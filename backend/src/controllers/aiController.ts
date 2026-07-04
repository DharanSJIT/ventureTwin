import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import User from '../models/User';
import ChatHistory from '../models/ChatHistory';
import { updateUiStateTool } from '../utils/tools';

const getAi = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'fake-key-to-allow-init' });

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
      
      You have access to a powerful tool called 'update_ui_state'. You MUST use this tool if the user asks for a visual representation (like a chart), a UI change, or wants to update their portfolio (skills, projects, certifications, achievements).
      
      - If they ask to add skills (e.g. HTML, CSS), trigger the tool with action: 'ADD_SKILL' and payload: { skills: ['HTML', 'CSS'] }.
      - If they ask to add a project, trigger with action: 'ADD_PROJECT' and payload: { project: { title: "...", description: "...", technologies: ["..."] } }.
      - If they ask to add a certification, trigger with action: 'ADD_CERTIFICATION' and payload: { certification: { name: "...", issuer: "...", date: "..." } }.
      - If they ask to add an achievement, trigger with action: 'ADD_ACHIEVEMENT' and payload: { achievement: { title: "...", description: "..." } }.
      - If they ask to see a chart of their skills, trigger the tool with action: 'RENDER_CHART' and payload: { chartType: 'pie', data: [...] }.
      - Always respond naturally to questions. Be encouraging.
      
      CRITICAL: Do NOT use markdown formatting like **bold** or *italics* in your text responses. Return pure plain text only without asterisks.
    `;

    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        tools: [updateUiStateTool],
      }
    });

    const functionCall = response.functionCalls?.[0];
    
    if (functionCall && functionCall.name === "update_ui_state") {
      const args = functionCall.args as any;
      const action = args.action;
      const payload = args.payload;

      // Handle Database updates if needed based on the action
      let userUpdated = false;
      
      if (action === 'ADD_SKILL' && payload.skills) {
        user.skills = [...new Set([...user.skills, ...payload.skills])];
        userUpdated = true;
      } else if (action === 'ADD_PROJECT' && payload.project) {
        user.projects.push(payload.project as never);
        userUpdated = true;
      } else if (action === 'ADD_CERTIFICATION' && payload.certification) {
        user.certifications.push(payload.certification as never);
        userUpdated = true;
      } else if (action === 'ADD_ACHIEVEMENT' && payload.achievement) {
        user.achievements.push(payload.achievement as never);
        userUpdated = true;
      }

      if (userUpdated) {
        await user.save();
      }

      await ChatHistory.create({ userId, role: 'user', text: message });
      await ChatHistory.create({ userId, role: 'model', text: `I have updated your portfolio: ${action}` });

      return res.json({ 
        message: response.text || `I have updated your portfolio with the requested details!`,
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
  } catch (error) {
    console.error('Error in AI Chat:', error);
    res.status(500).json({ message: 'Internal server error during AI chat processing.' });
  }
};
