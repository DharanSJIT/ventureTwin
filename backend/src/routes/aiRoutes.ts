import express from 'express';
import { handleAiMessage } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/chat', protect, handleAiMessage);

export default router;
