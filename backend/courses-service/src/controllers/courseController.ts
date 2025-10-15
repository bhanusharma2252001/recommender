import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import { verifyToken } from '../services/authClient';
import { courseService } from '../services/courseService';
import { Course } from '../types';

const upload = multer({ dest: '/tmp/uploads' });
const router = Router();

router.post('/api/courses/upload', upload.single('file'), asyncHandler(async (req: Request, res: Response) => {
  const auth = req.headers.authorization as string | undefined;
  if (!auth) return res.status(401).json({ error: 'missing authorization header' });
  const token = auth.split(' ')[1];
  const payload = await verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'invalid token' });

  if (!req.file) return res.status(400).json({ error: 'file missing' });
  const filePath = req.file.path;
  const results: Course[] = [];
  const stream = fs.createReadStream(filePath).pipe(csv());
  for await (const row of stream) {
    const mapped: Course = {
      course_id: row.course_id || row.id || row.courseId,
      title: row.title || '',
      description: row.description || '',
      category: row.category || '',
      instructor: row.instructor || '',
      duration: row.duration || ''
    };
    if (!mapped.course_id) continue;
    results.push(mapped);
    await courseService.saveAndIndex(mapped);
  }
  await fs.promises.unlink(filePath);
  res.json({ uploaded: results.length });
}));

router.get('/api/courses/search', asyncHandler(async (req: Request, res: Response) => {
  const auth = req.headers.authorization as string | undefined;
  if (!auth) return res.status(401).json({ error: 'missing authorization header' });
  const token = auth.split(' ')[1];
  const payload = await verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'invalid token' });

  const q = String(req.query.q || '');
  const category = String(req.query.category || '');
  const instructor = String(req.query.instructor || '');
  const page = Number(req.query.page || 1);
  const size = Number(req.query.size || 10);
  const result = await courseService.search(q, category, instructor, page, size);
  res.json(result);
}));

router.get('/api/courses/:id', asyncHandler(async (req: Request, res: Response) => {
  const auth = req.headers.authorization as string | undefined;
  if (!auth) return res.status(401).json({ error: 'missing authorization header' });
  const token = auth.split(' ')[1];
  const payload = await verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'invalid token' });

  const id = req.params.id;
  const course = await courseService.getCourse(id);
  res.json(course);
}));

export default router;
