import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { InputFile } from 'node-appwrite/file';
import { z } from 'zod';
import { databases, storage, DB_ID, COLLECTIONS, BUCKET_ID, ID, Query, getFilePreviewUrl } from '../../lib/appwrite';
import { requireAdmin } from '../../middleware/auth';
import { adminLimiter } from '../../middleware/rateLimiter';
import { logger } from '../../lib/logger';

const router = Router();

// Multer: store file in memory for upload to Appwrite
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const projectSchema = z.object({
  title: z.string().min(2).max(300),
  description: z.string().max(5000).optional().default(''),
  category: z.string().max(100).optional().default(''),
});

// GET /api/admin/projects
router.get('/', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries: Parameters<typeof databases.listDocuments>[2] = [
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ];

    if (req.query.category === '3d') {
      queries.push(Query.equal('category', '3D Printing'));
    }

    const result = await databases.listDocuments(DB_ID, COLLECTIONS.projects, queries);
    res.json({
      total: result.total,
      projects: result.documents.map((doc) => ({
        ...doc,
        imageId: doc.thumbnailFileId,
        imageUrl: doc.thumbnailUrl || (doc.thumbnailFileId ? getFilePreviewUrl(doc.thumbnailFileId, 400, 300) : null),
      })),
    });
  } catch (err) { next(err); }
});

// GET /api/admin/projects/:id
router.get('/:id', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doc = await databases.getDocument(DB_ID, COLLECTIONS.projects, req.params.id);
    res.json({
      ...doc,
      imageId: doc.thumbnailFileId,
      imageUrl: doc.thumbnailUrl || (doc.thumbnailFileId ? getFilePreviewUrl(doc.thumbnailFileId, 800, 600) : null),
    });
  } catch (err) { next(err); }
});

// POST /api/admin/projects — with optional image upload
router.post('/', adminLimiter, requireAdmin, upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid data.', fields: parsed.error.flatten().fieldErrors } });
      return;
    }

    let imageId: string | null = null;
    let imageUrl: string | null = null;
    if (req.file) {
      const uploaded = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        InputFile.fromBuffer(req.file.buffer, req.file.originalname)
      );
      imageId = uploaded.$id;
      imageUrl = getFilePreviewUrl(imageId);
    }

    const doc = await databases.createDocument(DB_ID, COLLECTIONS.projects, ID.unique(), {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      thumbnailFileId: imageId,
      thumbnailUrl: imageUrl,
    });

    res.status(201).json({
      ...doc,
      imageId: doc.thumbnailFileId,
      imageUrl: doc.thumbnailUrl,
    });
  } catch (err) { next(err); }
});

// PUT /api/admin/projects/:id — with optional image replacement
router.put('/:id', adminLimiter, requireAdmin, upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = projectSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid data.', fields: parsed.error.flatten().fieldErrors } });
      return;
    }

    const existing = await databases.getDocument(DB_ID, COLLECTIONS.projects, req.params.id);
    let imageId = existing.thumbnailFileId as string | null;

    if (req.file) {
      // Upload new image
      const uploaded = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        InputFile.fromBuffer(req.file.buffer, req.file.originalname)
      );
      // Delete old image (non-blocking)
      if (imageId) {
        storage.deleteFile(BUCKET_ID, imageId).catch((err) =>
          logger.warn({ err, imageId }, 'Failed to delete old image')
        );
      }
      imageId = uploaded.$id;
    }

    const doc = await databases.updateDocument(DB_ID, COLLECTIONS.projects, req.params.id, {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      thumbnailFileId: imageId,
      thumbnailUrl: imageId ? getFilePreviewUrl(imageId) : null,
    });

    res.json({
      ...doc,
      imageId: doc.thumbnailFileId,
      imageUrl: doc.thumbnailUrl,
    });
  } catch (err) { next(err); }
});

// DELETE /api/admin/projects/:id — deletes document + storage file
router.delete('/:id', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doc = await databases.getDocument(DB_ID, COLLECTIONS.projects, req.params.id);
    await databases.deleteDocument(DB_ID, COLLECTIONS.projects, req.params.id);

    // Delete associated image from storage
    if (doc.thumbnailFileId) {
      await storage.deleteFile(BUCKET_ID, doc.thumbnailFileId).catch((err) =>
        logger.warn({ err, imageId: doc.thumbnailFileId }, 'Failed to delete storage file during project deletion')
      );
    }

    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
