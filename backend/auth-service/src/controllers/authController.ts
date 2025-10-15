import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authService } from '../services/authService';

const router = Router();

router.post('/signup', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });
  const result = await authService.signup(email, password);
  res.json(result);
}));

router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });
  const token = await authService.login(email, password);
  res.json(token);
}));

router.post('/verify', asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body as { token?: string };
  if (!token) return res.status(400).json({ error: 'token required' });
  const payload = authService.verifyToken(token);
  if (!payload) return res.status(401).json({ valid: false, error: 'invalid token' });
  res.json({ valid: true, payload });
}));

router.get('/admin-only', asyncHandler(async (req: Request, res: Response) => {
  const auth = req.headers.authorization as string | undefined;
  if (!auth) return res.status(401).json({ error: 'missing auth' });
  const token = auth.split(' ')[1];
  const payload = authService.verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'invalid token' });
  res.json({ message: 'hello admin', payload });
}));

export default router;
