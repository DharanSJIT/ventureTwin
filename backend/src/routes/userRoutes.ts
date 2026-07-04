import express, { Request, Response } from 'express';
import multer from 'multer';
import { avatarStorage, resumeStorage } from '../config/cloudinary';
import { protect } from '../middleware/authMiddleware';
import User from '../models/User';

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
// Upload PDF resume to Cloudinary and save URL to User
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

    user.resumeUrl = req.file.path; // Cloudinary URL
    await user.save();

    res.json({ 
      message: 'Resume uploaded successfully',
      resumeUrl: user.resumeUrl
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
    await user.save();

    res.json({ 
      message: 'Text resume saved successfully',
      resumeText: user.resumeText
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
