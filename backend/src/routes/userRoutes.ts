import express, { Request, Response } from 'express';
import multer from 'multer';
import { avatarStorage, resumeStorage } from '../config/cloudinary';
import cloudinary from '../config/cloudinary';
import { protect } from '../middleware/authMiddleware';
import User from '../models/User';
import { GoogleGenAI } from '@google/genai';

const pdfParse = require('pdf-parse');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'fake-key-to-allow-init' });

async function extractPortfolioData(resumeText: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract the following portfolio data from the resume. Return ONLY a valid JSON object with the following four keys:
      1. 'skills' (array of strings, like "React", "Node.js").
      2. 'projects' (array of objects with 'title', 'description' (max 2 sentences), and 'technologies' (array of strings)).
      3. 'certifications' (array of objects with 'name', 'issuer', and 'date' (string, e.g. "2023")).
      4. 'achievements' (array of objects with 'title' and 'description').
      If any category is not found, return an empty array for that key. Resume: ${resumeText}`,
    });
    
    let text = response.text || '{}';
    // Remove markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(text);
    return {
      skills: Array.isArray(data.skills) ? data.skills : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
      achievements: Array.isArray(data.achievements) ? data.achievements : [],
    };
  } catch (error) {
    console.error('Failed to extract portfolio data:', error);
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
    if (user.resumeText && user.resumeText !== 'Error extracting text from PDF') {
      const extractedData = await extractPortfolioData(user.resumeText);
      // Merge unique skills
      const mergedSkills = new Set([...user.skills, ...extractedData.skills]);
      user.skills = Array.from(mergedSkills);
      user.projects = extractedData.projects as any;
      user.certifications = extractedData.certifications as any;
      user.achievements = extractedData.achievements as any;
    }
    // ------------------------------

    await user.save();

    res.json({ 
      message: 'Resume uploaded successfully',
      resumeUrl: user.resumeUrl,
      projects: user.projects,
      skills: user.skills,
      certifications: user.certifications,
      achievements: user.achievements
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
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
    const extractedData = await extractPortfolioData(user.resumeText);
    const mergedSkills = new Set([...user.skills, ...extractedData.skills]);
    user.skills = Array.from(mergedSkills);
    user.projects = extractedData.projects as any;
    user.certifications = extractedData.certifications as any;
    user.achievements = extractedData.achievements as any;
    // ------------------------------
    
    await user.save();

    res.json({ 
      message: 'Text resume saved successfully',
      resumeText: user.resumeText,
      projects: user.projects,
      skills: user.skills,
      certifications: user.certifications,
      achievements: user.achievements
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
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

export default router;
