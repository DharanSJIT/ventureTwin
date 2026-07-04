import express, { Request, Response } from 'express';
import multer from 'multer';
import { avatarStorage, resumeStorage } from '../config/cloudinary';
import cloudinary from '../config/cloudinary';
import { protect } from '../middleware/authMiddleware';
import User from '../models/User';
import ChatHistory from '../models/ChatHistory';
import { GoogleGenAI } from '@google/genai';
import { Groq } from 'groq-sdk';

const pdfParse = require('pdf-parse');
let currentKeyIndex = 0;
const getAi = () => {
  const keysStr = process.env.GEMINI_API_KEY || '';
  const keys = keysStr.split(',').map(k => k.trim()).filter(k => k);
  if (keys.length === 0) return new GoogleGenAI({ apiKey: 'fake-key-to-allow-init' });
  
  const key = keys[currentKeyIndex % keys.length];
  currentKeyIndex++;
  return new GoogleGenAI({ apiKey: key });
};
async function extractPortfolioData(resumeText: string) {
  try {
    const keysCount = Math.max(1, (process.env.GEMINI_API_KEY || '').split(',').length);
    let response: any;
    let lastError: any;

    const prompt = `Extract the following portfolio data from the resume. Return ONLY a valid JSON object with the following four keys:
      1. 'skills' (array of strings, like "React", "Node.js").
      2. 'projects' (array of objects with 'title', 'description' (max 2 sentences), and 'technologies' (array of strings)).
      3. 'certifications' (array of objects with 'name', 'issuer', and 'date' (string, e.g. "2023")).
      4. 'achievements' (array of objects with 'title' and 'description').
      If any category is not found, return an empty array for that key. Resume: ${resumeText}`;

    for (let attempt = 0; attempt < keysCount; attempt++) {
      try {
        const ai = getAi();
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });
        break;
      } catch (err: any) {
        lastError = err;
        if (err?.status === 429 || (err?.message && err.message.includes('429')) || (err?.message && err.message.includes('quota'))) {
          console.warn(`[Resume Parser] Key rate limited. Retrying... (Attempt ${attempt + 1}/${keysCount})`);
          continue;
        }
        throw err;
      }
    }

    if (!response) {
      throw lastError;
    }
    
    let text = response.text || '{}';
    
    // In case the model still wraps it in markdown despite the config
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    // Fallback: try to find the first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const data = JSON.parse(text);
    return {
      skills: Array.isArray(data.skills) ? data.skills : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
      achievements: Array.isArray(data.achievements) ? data.achievements : [],
    };
  } catch (error: any) {
    console.error('Failed to extract portfolio data. The LLM might have returned invalid JSON or rate limit hit.', error);
    if (error?.status === 429 || (error?.message && error.message.includes('429'))) {
      throw new Error("RATE_LIMIT");
    }
    return { skills: [], projects: [], certifications: [], achievements: [] };
  }
}

const router = express.Router();

// Multer instances for different storages
const avatarUpload = multer({ storage: avatarStorage });
const resumeUpload = multer({ storage: resumeStorage });

// POST /api/users/avatar
// Upload profile image to Cloudinary and save URL to User
router.post('/avatar', protect, avatarUpload.single('image'), async (req: Request | any, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image uploaded' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.profileImage = req.file.path; // Cloudinary URL
    await user.save();

    res.json({ 
      message: 'Avatar uploaded successfully',
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/users/resume/file
// Upload PDF resume to Cloudinary, extract text, and save both to User
router.post('/resume/file', protect, resumeUpload.single('resume'), async (req: Request | any, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const cloudinaryUrl = req.file.path; // Cloudinary URL
    user.resumeUrl = cloudinaryUrl;

    // --- NEW: PDF Parsing Logic ---
    try {
      // Fetch the PDF from Cloudinary URL
      const response = await fetch(cloudinaryUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extract text from the PDF
      const pdfData = await pdfParse(buffer);
      user.resumeText = pdfData.text;
    } catch (parseError) {
      console.error('Error parsing PDF:', parseError);
      // We don't fail the upload if parsing fails, but we log it
      user.resumeText = 'Error extracting text from PDF';
    }
    // ------------------------------
    
    // --- NEW: Portfolio Extraction ---
    let extractionFailed = false;
    if (user.resumeText && user.resumeText !== 'Error extracting text from PDF') {
      try {
        const extractedData = await extractPortfolioData(user.resumeText);
        // Merge unique skills
        const mergedSkills = new Set([...user.skills, ...extractedData.skills]);
        user.skills = Array.from(mergedSkills);
        user.projects = extractedData.projects as any;
        user.certifications = extractedData.certifications as any;
        user.achievements = extractedData.achievements as any;
      } catch (e: any) {
        if (e.message === "RATE_LIMIT") extractionFailed = true;
      }
    }
    // ------------------------------

    await user.save();

    // Push the updated resume text into the chat history for the user to review
    if (user.resumeText && user.resumeText !== 'Error extracting text from PDF') {
      const messageText = `I have received your updated resume. Here is the full content I see:\n\n${user.resumeText}\n\nLet me know if you would like me to extract any more skills, projects, or achievements from it!`;
      await ChatHistory.create({ userId: user._id, role: 'model', text: messageText });
    }

    res.json({ 
      message: extractionFailed ? 'Resume saved, but AI extraction failed due to rate limits. Try again in 1 minute.' : 'Resume uploaded successfully',
      resumeUrl: user.resumeUrl,
      projects: user.projects,
      skills: user.skills,
      certifications: user.certifications,
      achievements: user.achievements
    });
  } catch (error: any) {
    console.error(error);
    if (error?.status === 429 || (error?.message && error.message.includes('429'))) {
      res.status(429).json({ message: "AI rate limit reached. Please wait 1 minute." });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
});

// POST /api/users/resume/text
// Save raw text resume directly to MongoDB
router.post('/resume/text', protect, async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    
    if (!text) {
      res.status(400).json({ message: 'No text provided' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.resumeText = text;
    
    // --- NEW: Portfolio Extraction ---
    let extractionFailed = false;
    try {
      const extractedData = await extractPortfolioData(user.resumeText);
      const mergedSkills = new Set([...user.skills, ...extractedData.skills]);
      user.skills = Array.from(mergedSkills);
      user.projects = extractedData.projects as any;
      user.certifications = extractedData.certifications as any;
      user.achievements = extractedData.achievements as any;
    } catch (e: any) {
      if (e.message === "RATE_LIMIT") extractionFailed = true;
    }
    // ------------------------------
    
    await user.save();

    // Push the updated resume text into the chat history for the user to review
    if (user.resumeText) {
      const messageText = `I have received your updated resume content. Here is the full text I see:\n\n${user.resumeText}\n\nLet me know if you would like me to extract any more skills, projects, or achievements from it!`;
      await ChatHistory.create({ userId: user._id, role: 'model', text: messageText });
    }

    res.json({ 
      message: extractionFailed ? 'Resume saved, but AI extraction failed due to rate limits. Try again in 1 minute.' : 'Text resume saved successfully',
      resumeText: user.resumeText,
      projects: user.projects,
      skills: user.skills,
      certifications: user.certifications,
      achievements: user.achievements
    });
  } catch (error: any) {
    console.error(error);
    if (error?.status === 429 || (error?.message && error.message.includes('429'))) {
      res.status(429).json({ message: "AI rate limit reached. Please wait 1 minute." });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
});

// DELETE /api/users/resume/file
// Delete PDF resume from Cloudinary and clear URL from User
router.delete('/resume/file', protect, async (req: Request | any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.resumeUrl) {
      // The public_id we used to save was venturetwin/resumes/{user_id}_resume.pdf
      const publicId = `venturetwin/resumes/${user._id}_resume.pdf`;
      
      // Delete from Cloudinary (requires resource_type: raw for pdfs)
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    }

    // Update DB (Always clear these when delete is requested)
    user.resumeUrl = '';
    user.resumeText = '';
    user.projects = [] as any;
    user.certifications = [] as any;
    user.achievements = [] as any;
    user.skills = [];
    await user.save();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ message: 'Server Error during deletion' });
  }
});

// PUT /api/users/template
// Save active template
router.put('/template', protect, async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { templateId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.activeTemplate = templateId;
    await user.save();
    res.json({ message: 'Template updated successfully', activeTemplate: user.activeTemplate });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/users/username
// Claim unique username
router.put('/username', protect, async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { username } = req.body;
    
    // Check if taken
    const existing = await User.findOne({ username });
    if (existing && existing._id.toString() !== req.user._id.toString()) {
      res.status(400).json({ message: 'Username is already taken' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.username = username;
    await user.save();
    res.json({ message: 'Username updated successfully', username: user.username });
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/users/public/:username
// Get public profile (No Auth Required)
router.get('/public/:username', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    // Only return safe public fields
    res.json({
      name: user.name,
      username: user.username,
      profileImage: user.profileImage,
      skills: user.skills,
      projects: user.projects,
      certifications: user.certifications,
      achievements: user.achievements,
      activeTemplate: user.activeTemplate
    });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/users/startup/blueprints
// Get all generated startup blueprints for the user
router.get('/startup/blueprints', protect, async (req: Request | any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    // Access the newly added startupBlueprints property
    res.json({ blueprints: (user as any).startupBlueprints || [] });
  } catch (error) {
    console.error('Error fetching blueprints:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/users/startup/generate
// Generate a new startup blueprint based on an idea
router.post('/startup/generate', protect, async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { idea } = req.body;
    if (!idea) {
      res.status(400).json({ message: 'Startup idea is required' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const prompt = `Act as an expert startup advisor and VC. Generate a comprehensive startup blueprint and guide based on the following idea: "${idea}". 
    Return ONLY a valid JSON object with the following exact keys:
    - 'title' (catchy name for the startup)
    - 'description' (a punchy 2-sentence elevator pitch)
    - 'marketSize' (format in Indian Rupees, e.g. "₹500 Crores")
    - 'estMRR' (format in Indian Rupees, e.g. "₹5 Lakhs in Y1")
    - 'competitors' (e.g. "High (12)", "Low (2)")
    - 'innovationScore' (e.g. "8/10")
    - 'validation' (a detailed 3-4 paragraph string assessing market need, target audience, and problem/solution fit. Replace all actual newlines with '\\n')
    - 'businessModel' (a detailed string outlining the monetization strategy, pricing tiers, and cost structure. Replace all actual newlines with '\\n')
    - 'investorSimulation' (a detailed string containing tough questions VCs would ask and how to answer them, plus pros/cons. Replace all actual newlines with '\\n')
    - 'revenueForecasting' (a detailed string showing year 1-3 projections, customer acquisition cost vs lifetime value. Format currency in Indian Rupees ₹. Replace all actual newlines with '\\n')
    - 'fundingReadiness' (a detailed string assessing if the idea is ready for pre-seed/seed funding and what milestones are missing. Replace all actual newlines with '\\n')
    - 'revenueData' (an array of exactly 7 objects projecting revenue over 24 months. Keys: 'month' (string, e.g. "M1", "M3", "M6", "M9", "M12", "M18", "M24") and 'revenue' (number in Rupees))
    - 'competitorData' (an array of exactly 3 objects comparing innovation. Keys: 'name' (string) and 'score' (number 0-100). The first object MUST be "Your Startup". The 2nd and 3rd objects MUST be actual, real-world competing companies in this specific industry)
    CRITICAL: Do not wrap in markdown or backticks, just valid raw JSON. Ensure all double quotes inside the text values are escaped as \\". NO raw newlines allowed in strings. ABSOLUTELY DO NOT USE ANY MARKDOWN FORMATTING like ** or * for bold/italics or bullet points. Just plain text.`;

    const keysCount = Math.max(1, (process.env.GEMINI_API_KEY || '').split(',').length);
    let response: any;
    let lastError: any;
    let generatedText = '';

    for (let attempt = 0; attempt < keysCount; attempt++) {
      try {
        const ai = getAi();
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });
        generatedText = response?.text || '';
        break;
      } catch (err: any) {
        lastError = err;
        if (err?.status === 429 || (err?.message && err.message.includes('429')) || (err?.message && err.message.includes('quota'))) {
          continue;
        }
        throw err;
      }
    }

    if (!generatedText) {
      if (process.env.GROQ_API_KEY) {
        console.warn(`[AI] Gemini rate limited for startup generation. Falling back to Groq...`);
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const groqResponse = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: "json_object" }
        });
        generatedText = groqResponse.choices[0]?.message?.content || '{}';
      } else {
        throw lastError;
      }
    }

    let text = generatedText;
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const generated = JSON.parse(text);
    
    const newBlueprint = {
      idea: idea,
      title: generated.title || 'Untitled Startup',
      description: generated.description || 'No description provided.',
      marketSize: generated.marketSize || '$1B+',
      estMRR: generated.estMRR || '$10k in Y1',
      competitors: generated.competitors || 'Unknown',
      innovationScore: generated.innovationScore || '5/10',
      status: 'Evaluating',
      details: {
        validation: generated.validation || 'No validation data provided.',
        businessModel: generated.businessModel || 'No business model data provided.',
        investorSimulation: generated.investorSimulation || 'No investor simulation data provided.',
        revenueForecasting: generated.revenueForecasting || 'No revenue forecasting data provided.',
        fundingReadiness: generated.fundingReadiness || 'No funding readiness data provided.'
      }
    };

    (user as any).startupBlueprints = (user as any).startupBlueprints || [];
    (user as any).startupBlueprints.push(newBlueprint);
    await user.save();

    res.json({ message: 'Blueprint generated successfully', blueprint: newBlueprint });
  } catch (error: any) {
    console.error('Error generating blueprint:', error);
    if (error?.status === 429 || (error?.message && error.message.includes('429'))) {
      res.status(429).json({ message: 'AI rate limit reached. Please wait 1 minute.' });
    } else {
      res.status(500).json({ message: 'Server Error during generation' });
    }
  }
});

// DELETE /api/users/startup/blueprints/:index
// Delete a startup blueprint by its index in the array
router.delete('/startup/blueprints/:index', protect, async (req: Request | any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    const index = parseInt(req.params.index, 10);
    const blueprints = (user as any).startupBlueprints || [];
    
    if (isNaN(index) || index < 0 || index >= blueprints.length) {
      res.status(400).json({ message: 'Invalid blueprint index' });
      return;
    }
    
    blueprints.splice(index, 1);
    (user as any).startupBlueprints = blueprints;
    await user.save();
    
    res.json({ message: 'Blueprint deleted successfully' });
  } catch (error) {
    console.error('Error deleting blueprint:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/users/learning/roadmaps
// Get all generated learning roadmaps for the user
router.get('/learning/roadmaps', protect, async (req: Request | any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ roadmaps: (user as any).learningRoadmaps || [] });
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/users/learning/generate
// Generate a learning roadmap using Gemini API
router.post('/learning/generate', protect, async (req: Request | any, res: Response): Promise<void> => {
  try {
    const { goal } = req.body;
    if (!goal) {
      res.status(400).json({ message: 'Please provide a learning goal' });
      return;
    }

    const prompt = `Act as an expert technical career advisor. Generate a structured learning roadmap for the following goal or target role: "${goal}".
    Return ONLY a valid JSON object with the following exact keys:
    - 'title' (string, a concise title for the roadmap)
    - 'description' (string, a short motivating description)
    - 'targetRole' (string, the target role or main skill)
    - 'steps' (an array of exactly 5 step objects in logical learning order. Keys: 'title' (string), 'status' (string, MUST be "locked"), 'description' (string), and 'recommendedResources' (an array of exactly 2 resource objects with keys 'title' (string) and 'type' (string, either "doc" or "video")))
    - 'skillGoals' (an array of exactly 3 distinct skills related to this goal. Keys: 'name' (string) and 'progress' (number, set to 0))
    CRITICAL: Do not wrap in markdown or backticks, just valid raw JSON. Ensure all double quotes inside the text values are escaped as \\".`;

    const keysCount = Math.max(1, (process.env.GEMINI_API_KEY || '').split(',').length);
    let response: any;
    let lastError: any;
    let generatedText = '';

    for (let attempt = 0; attempt < keysCount; attempt++) {
      try {
        const ai = getAi();
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });
        generatedText = response?.text || '';
        break;
      } catch (err: any) {
        lastError = err;
        if (err?.status === 429 || err?.status === 503 || (err?.message && (err.message.includes('429') || err.message.includes('503'))) || (err?.message && err.message.includes('quota'))) {
          continue;
        }
        throw err;
      }
    }

    if (!generatedText) {
      if (process.env.GROQ_API_KEY) {
        console.warn(`[AI] Gemini rate limited/busy for learning generation. Falling back to Groq...`);
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const groqResponse = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: "json_object" }
        });
        generatedText = groqResponse.choices[0]?.message?.content || '{}';
      } else {
        throw lastError;
      }
    }

    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = generatedText.indexOf('{');
    const lastBrace = generatedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      generatedText = generatedText.substring(firstBrace, lastBrace + 1);
    }

    let roadmapData;
    try {
      roadmapData = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("JSON Parse Error on AI output:", parseError, "\\nRaw text:", generatedText);
      throw new Error('AI returned invalid JSON format');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Set first step to 'learning' instead of 'locked'
    if (roadmapData.steps && roadmapData.steps.length > 0) {
      roadmapData.steps[0].status = 'learning';
    }

    user.learningRoadmaps.push(roadmapData);
    await user.save();

    res.status(201).json(user.learningRoadmaps);
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ message: error.message || 'Error generating learning roadmap' });
  }
});

// DELETE /api/users/learning/roadmaps/:index
// Delete a learning roadmap by its index in the array
router.delete('/learning/roadmaps/:index', protect, async (req: Request | any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const index = parseInt(req.params.index);
    if (index >= 0 && index < user.learningRoadmaps.length) {
      user.learningRoadmaps.splice(index, 1);
      await user.save();
    }
    
    res.status(200).json(user.learningRoadmaps);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting roadmap' });
  }
});

export default router;
