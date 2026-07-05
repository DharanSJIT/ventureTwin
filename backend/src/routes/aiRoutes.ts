import express from 'express';
import { handleAiMessage, handlePublicInterview } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/chat', protect, handleAiMessage);

router.post('/public/:username/interview', handlePublicInterview);

export default router;
