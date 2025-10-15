import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyToken } from '../services/authClient';
import { recommendationService } from '../services/recommendationService';

const router = Router();

router.post('/api/recommendations', asyncHandler(async (req: Request, res: Response) => {
  // const auth = req.headers.authorization as string | undefined;
  // if (!auth) return res.status(401).json({ error: 'missing authorization header' });
  // const token = auth.split(' ')[1];
  // const payload = await verifyToken(token);
  // if (!payload) return res.status(401).json({ error: 'invalid token' });

  const { topics = [], skillLevel } = req.body as { topics?: string[]; skillLevel?: string };
  if (!Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ error: 'topics array required' });
  }
  console.log("api key", process.env.GEMINI_API_KEY);
  
  if (!process.env.GEMINI_API_KEY) {
    const recs = await recommendationService.generateMockRecommendations(topics, skillLevel);
    return res.json({ source: 'mock', recommendations: recs, requestedBy: 'payload' });
  }

  const recs = await recommendationService.generateFromGemini(topics, skillLevel);
  res.json({ source: 'gemini', recommendations: recs, requestedBy: 'payload' });
}));

export default router;
