import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { databases, DB_ID, COLLECTIONS, ID, Query } from '../../lib/appwrite';
import { requireAdmin } from '../../middleware/auth';
import { adminLimiter } from '../../middleware/rateLimiter';

const router = Router();

const serviceSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional().default(''),
  icon: z.string().max(200).optional().default(''),
  ImageUrl: z.string().optional().default(''),
  display_order: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

// GET /api/admin/services
router.get('/', adminLimiter, requireAdmin, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await databases.listDocuments(DB_ID, COLLECTIONS.services, [
      Query.orderAsc('display_order'),
      Query.limit(100),
    ]);
    res.json({
      total: result.total,
      services: result.documents.map((doc) => ({
        ...doc,
        image: doc.ImageUrl || doc.icon || '',
      })),
    });
  } catch (err) { next(err); }
});

// GET /api/admin/services/:id
router.get('/:id', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doc = await databases.getDocument(DB_ID, COLLECTIONS.services, req.params.id);
    res.json({
      ...doc,
      image: doc.ImageUrl || doc.icon || '',
    });
  } catch (err) { next(err); }
});

// POST /api/admin/services
router.post('/', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.image !== undefined && req.body.ImageUrl === undefined) {
      req.body.ImageUrl = req.body.image;
    }
    const parsed = serviceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid data.', fields: parsed.error.flatten().fieldErrors } });
      return;
    }
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.services, ID.unique(), parsed.data);
    res.status(201).json({
      ...doc,
      image: doc.ImageUrl || doc.icon || '',
    });
  } catch (err) { next(err); }
});

// PUT /api/admin/services/:id
router.put('/:id', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.image !== undefined && req.body.ImageUrl === undefined) {
      req.body.ImageUrl = req.body.image;
    }
    const parsed = serviceSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid data.', fields: parsed.error.flatten().fieldErrors } });
      return;
    }
    const doc = await databases.updateDocument(DB_ID, COLLECTIONS.services, req.params.id, parsed.data);
    res.json({
      ...doc,
      image: doc.ImageUrl || doc.icon || '',
    });
  } catch (err) { next(err); }
});

// DELETE /api/admin/services/:id
router.delete('/:id', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await databases.deleteDocument(DB_ID, COLLECTIONS.services, req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
