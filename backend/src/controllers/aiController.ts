import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { Groq } from 'groq-sdk';
import User from '../models/User';
import ChatHistory from '../models/ChatHistory';
import { updateUiStateTool } from '../utils/tools';

let currentKeyIndex = 0;
const getAi = () => {
  const keysStr = process.env.GEMINI_API_KEY || '';
  const keys = keysStr.split(',').map(k => k.trim()).filter(k => k);
  if (keys.length === 0) return new GoogleGenAI({ apiKey: 'fake-key-to-allow-init' });
  
  const key = keys[currentKeyIndex % keys.length];
  currentKeyIndex++;
  return new GoogleGenAI({ apiKey: key });
};

export const handleAiMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const userId = (req as any).user._id;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        message: 'GEMINI_API_KEY is not configured in the backend environment.',
        action: 'SHOW_ALERT',
        payload: { title: 'Configuration Error', message: 'Please add GEMINI_API_KEY to your backend .env file.' }
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const rawHistory = await ChatHistory.find({ userId }).sort({ createdAt: 1 });
    const contents = rawHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    contents.push({ role: 'user', parts: [{ text: message }] });

    const systemInstruction = `
      You are VentureTwin AI, an expert career coach and startup advisor. 
      CRITICAL: You ARE a Stateful AI Agent. You HAVE long-term persistent memory because your conversations are permanently saved to a MongoDB database. If a user asks if you have memory or if you are stateful, enthusiastically confirm that you DO have long-term memory across all their sessions.
      
      The user's current resume text: ${user.resumeText || 'None uploaded'}.
      The user's current listed skills: ${user.skills?.join(', ') || 'None listed'}.
      The user's current projects: ${JSON.stringify(user.projects || [])}.
      
      You have access to a powerful tool called 'update_ui_state'. You MUST use this tool if the user asks for a visual representation (like a chart), a UI change, or wants to add ANY skills, projects, certifications, or achievements to their profile. You should proactively infer this intent even if they do not explicitly say the word "portfolio". If they simply say "add X skill", "I got Y certification", or "add Z project", you MUST use the tool to save it.
      
      - If they ask to add skills (e.g. HTML, CSS), trigger the tool with action: 'ADD_SKILL' and payload: { skills: ['HTML', 'CSS'] }.
      - If they ask to add a project, trigger with action: 'ADD_PROJECT' and payload: { project: { title: "...", description: "...", technologies: ["..."] } }.
      - If they ask to add a certification, trigger with action: 'ADD_CERTIFICATION' and payload: { certification: { name: "...", issuer: "...", date: "..." } }.
      - If they ask to add an achievement, trigger with action: 'ADD_ACHIEVEMENT' and payload: { achievement: { title: "...", description: "..." } }.
      - If they ask to see a chart of their skills, trigger the tool with action: 'RENDER_CHART' and payload: { chartType: 'pie', data: [...] }.
      - Always respond naturally to questions. Be encouraging.
      
      CRITICAL: Do NOT use markdown formatting like **bold** or *italics* in your text responses. Return pure plain text only without asterisks.
    `;

    const keysCount = Math.max(1, (process.env.GEMINI_API_KEY || '').split(',').length);
    let response: any;
    let lastError: any;

    for (let attempt = 0; attempt < keysCount; attempt++) {
      try {
        const ai = getAi();
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            tools: [updateUiStateTool],
          }
        });
        break; // Success, exit retry loop
      } catch (err: any) {
        lastError = err;
        console.error("DEBUG AI RATE LIMIT:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
        if (err?.status === 429 || (err?.message && err.message.includes('429')) || (err?.message && err.message.includes('quota'))) {
          console.warn(`[AI] Key rate limited. Retrying... (Attempt ${attempt + 1}/${keysCount})`);
          continue; // Try next key
        }
        throw err; // Not a rate limit, fail immediately
      }
    }

    if (!response) {
      if (process.env.GROQ_API_KEY) {
        console.warn(`[AI] All Gemini keys rate limited. Falling back to Groq...`);
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        const groqMessages = contents.map((c: any) => ({
          role: c.role === 'model' ? 'assistant' : c.role,
          content: c.parts[0].text
        }));
        
        groqMessages.unshift({
          role: 'system',
          content: systemInstruction
        });

        const groqTools = [{
          type: 'function',
          function: {
            name: 'update_ui_state',
            description: updateUiStateTool.functionDeclarations[0].description,
            parameters: {
              type: "object",
              properties: {
                action: { type: "string" },
                payload: {
                  type: "object",
                  properties: {
                    skills: { type: "array", items: { type: "string" } },
                    project: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, technologies: { type: "array", items: { type: "string" } } } },
                    certification: { type: "object", properties: { name: { type: "string" }, issuer: { type: "string" }, date: { type: "string" } } },
                    achievement: { type: "object", properties: { title: { type: "string" }, description: { type: "string" } } },
                    chartType: { type: "string" },
                    data: { type: "array", items: { type: "object" } },
                    title: { type: "string" },
                    message: { type: "string" }
                  }
                }
              },
              required: ["action", "payload"]
            }
          }
        }];

        const groqResponse = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: groqMessages,
          tools: groqTools as any,
          tool_choice: 'auto'
        });

        const choice = groqResponse.choices[0];
        
        if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
           const toolCall = choice.message.tool_calls[0];
           response = {
             functionCalls: [{
               name: toolCall.function.name,
               args: JSON.parse(toolCall.function.arguments)
             }],
             text: choice.message.content || ''
           };
        } else {
           response = {
             text: choice.message.content || ''
           };
        }
      } else {
        throw lastError; // All keys exhausted
      }
    }

    const functionCall = response.functionCalls?.[0];
    
    if (functionCall && functionCall.name === "update_ui_state") {
      const args = functionCall.args as any;
      const action = args.action;
      const payload = args.payload;

      // Handle Database updates if needed based on the action
      let userUpdated = false;
      
      if (action === 'ADD_SKILL' && payload.skills) {
        const prevLength = user.skills.length;
        user.skills = [...new Set([...user.skills, ...payload.skills])];
        if (user.skills.length > prevLength) userUpdated = true;
      } else if (action === 'ADD_PROJECT' && payload.project) {
        const exists = user.projects.some((p: any) => p.title?.toLowerCase() === payload.project.title?.toLowerCase());
        if (!exists) {
          user.projects.push(payload.project as never);
          userUpdated = true;
        }
      } else if (action === 'ADD_CERTIFICATION' && payload.certification) {
        const exists = user.certifications.some((c: any) => c.name?.toLowerCase() === payload.certification.name?.toLowerCase());
        if (!exists) {
          user.certifications.push(payload.certification as never);
          userUpdated = true;
        }
      } else if (action === 'ADD_ACHIEVEMENT' && payload.achievement) {
        const exists = user.achievements.some((a: any) => a.title?.toLowerCase() === payload.achievement.title?.toLowerCase());
        if (!exists) {
          user.achievements.push(payload.achievement as never);
          userUpdated = true;
        }
      }

      if (userUpdated) {
        await user.save();
      }

      await ChatHistory.create({ userId, role: 'user', text: message });
      await ChatHistory.create({ userId, role: 'model', text: userUpdated ? `I have updated your portfolio: ${action}` : `Duplicate item prevented for ${action}` });

      return res.json({ 
        message: userUpdated ? (response.text || `I have updated your portfolio with the requested details!`) : `That item is already in your portfolio! I did not add duplicates.`,
        action: action,
        payload: payload,
        user: userUpdated ? {
          skills: user.skills,
          projects: user.projects,
          certifications: user.certifications,
          achievements: user.achievements
        } : null
      });
    }

    const textReply = response.text || 'I am not sure how to respond to that.';
    
    await ChatHistory.create({ userId, role: 'user', text: message });
    await ChatHistory.create({ userId, role: 'model', text: textReply });
    
    res.json({ message: textReply });
  } catch (error: any) {
    console.error('Error in AI Chat:', error);
    if (error?.status === 429 || (error?.message && error.message.includes('429')) || (error?.message && error.message.includes('quota'))) {
      res.status(429).json({ message: 'AI rate limit reached. Please wait 1 minute before sending another message.' });
    } else {
      res.status(500).json({ message: 'Internal server error during AI chat processing.' });
    }
  }
};
