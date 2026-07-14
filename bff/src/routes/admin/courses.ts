import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { databases, DB_ID, COLLECTIONS, ID, Query } from '../../lib/appwrite';
import { requireAdmin } from '../../middleware/auth';
import { adminLimiter } from '../../middleware/rateLimiter';

const router = Router();

const courseSchema = z.object({
  title: z.string().min(2).max(200),
  subtitle: z.string().min(2).max(300),
  shortDescription: z.string().min(10).max(500),
  aboutCourse: z.string().min(10).max(5000),
  price: z.number().int().min(0),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  cardImageUrl: z.string().url().optional().or(z.literal('')),
  heroImageUrl: z.string().url().optional().or(z.literal('')),
  feature1Title: z.string().max(100).default(''),
  feature1Subtitle: z.string().max(200).default(''),
  feature2Title: z.string().max(100).default(''),
  feature2Subtitle: z.string().max(200).default(''),
  feature3Title: z.string().max(100).default(''),
  feature3Subtitle: z.string().max(200).default(''),
  whatYouWillLearn: z.string().max(5000).default(''),
  isPublished: z.boolean().default(false),
});

// GET /api/admin/courses
router.get('/', adminLimiter, requireAdmin, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await databases.listDocuments(DB_ID, COLLECTIONS.courses, [
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ]);
    res.json({ total: result.total, courses: result.documents });
  } catch (err) { next(err); }
});

// GET /api/admin/courses/:id
router.get('/:id', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doc = await databases.getDocument(DB_ID, COLLECTIONS.courses, req.params.id);
    res.json(doc);
  } catch (err) { next(err); }
});

// POST /api/admin/courses
router.post('/', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = courseSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid data.', fields: parsed.error.flatten().fieldErrors } });
      return;
    }
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.courses, ID.unique(), parsed.data);
    res.status(201).json(doc);
  } catch (err) { next(err); }
});

// PUT /api/admin/courses/:id
router.put('/:id', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = courseSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid data.', fields: parsed.error.flatten().fieldErrors } });
      return;
    }
    const doc = await databases.updateDocument(DB_ID, COLLECTIONS.courses, req.params.id, parsed.data);
    res.json(doc);
  } catch (err) { next(err); }
});

// DELETE /api/admin/courses/:id
router.delete('/:id', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await databases.deleteDocument(DB_ID, COLLECTIONS.courses, req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
