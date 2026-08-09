import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { databases, storage, DB_ID, COLLECTIONS, BUCKET_ID, ID, Query } from '../../lib/appwrite';
import { requireAdmin } from '../../middleware/auth';
import { adminLimiter } from '../../middleware/rateLimiter';
import { logger } from '../../lib/logger';
import { config } from '../../config/env';

import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

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

interface UploadedImage {
  file_id: string;
  image_url: string;
}

async function uploadProjectImage(req: Request): Promise<UploadedImage> {
  const body = new FormData();
  body.append('file', new Blob([new Uint8Array(req.file!.buffer)], { type: req.file!.mimetype }), req.file!.originalname);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(`${config.pipeline.url}/media/portfolio/upload-image`, {
      method: 'POST',
      headers: {
        'X-Service-Token': config.pipeline.serviceToken,
        'X-Admin-Verified': 'true',
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
        ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}),
      },
      body,
      signal: controller.signal,
    });

    const result = await response.json() as UploadedImage | { detail?: string };
    if (!response.ok || !('image_url' in result) || !('file_id' in result)) {
      throw new Error(`Pipeline image upload failed (${response.status}): ${JSON.stringify(result)}`);
    }
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

// GET /api/admin/projects
router.get('/', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries: Parameters<typeof databases.listDocuments>[2] = [
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ];



    const result = await databases.listDocuments(DB_ID, COLLECTIONS.projects, queries);
    res.json({
      total: result.total,
      projects: result.documents.map((doc) => ({
        ...doc,
        imageId: doc.thumbnailFileId,
        imageUrl: doc.image_url || null,
      })),
    });
  } catch (err) { next(err); }
});

// GET /api/admin/projects/:id
router.get('/:id', adminLimiter, requireAdmin, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const doc = await databases.getDocument(DB_ID, COLLECTIONS.projects, req.params.id);
    res.json({
      ...doc,
      imageId: doc.thumbnailFileId,
      imageUrl: doc.image_url || null,
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
      const uploaded = await uploadProjectImage(req);
      imageId = uploaded.file_id;
      imageUrl = uploaded.image_url;
    }

    let doc;
    try {
      doc = await databases.createDocument(DB_ID, COLLECTIONS.projects, ID.unique(), {
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category,
        thumbnailFileId: imageId,
        image_url: imageUrl || '',
      });
    } catch (error) {
      if (imageId) await storage.deleteFile(BUCKET_ID, imageId).catch((cleanupError) =>
        logger.error({ cleanupError, imageId }, 'Failed to clean up project image after document creation failure')
      );
      throw error;
    }

    res.status(201).json({
      ...doc,
      imageId: doc.thumbnailFileId,
      imageUrl: doc.image_url,
    });
  } catch (err) { next(err); }
});

// PUT /api/admin/projects/:id — with optional image replacement
router.put('/:id', adminLimiter, requireAdmin, upload.single('image'), async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const parsed = projectSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid data.', fields: parsed.error.flatten().fieldErrors } });
      return;
    }

    const existing = await databases.getDocument(DB_ID, COLLECTIONS.projects, req.params.id);
    let imageId = existing.thumbnailFileId as string | null;
    let imageUrl = (existing.image_url as string | undefined) || '';

    if (req.file) {
      // Upload new image
      const uploaded = await uploadProjectImage(req);
      // Delete old image via Pipeline (non-blocking)
      if (imageId) {
        const formData = new FormData();
        formData.append('file_id', imageId);
        fetch(`${config.pipeline.url}/media/portfolio/delete-image`, {
          method: 'DELETE',
          headers: {
            'X-Service-Token': config.pipeline.serviceToken,
            'X-Admin-Verified': 'true',
          },
          body: formData,
        }).catch((err) =>
          logger.warn({ err, imageId }, 'Failed to delete old image via Pipeline')
        );
      }
      imageId = uploaded.file_id;
      imageUrl = uploaded.image_url;
    }

    const doc = await databases.updateDocument(DB_ID, COLLECTIONS.projects, req.params.id, {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      thumbnailFileId: imageId,
      image_url: imageId ? (imageUrl ?? '') : '',
    });

    res.json({
      ...doc,
      imageId: doc.thumbnailFileId,
      imageUrl: doc.image_url,
    });
  } catch (err) { next(err); }
});

// DELETE /api/admin/projects/:id — deletes document + storage file via Pipeline
router.delete('/:id', adminLimiter, requireAdmin, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const doc = await databases.getDocument(DB_ID, COLLECTIONS.projects, req.params.id);
    await databases.deleteDocument(DB_ID, COLLECTIONS.projects, req.params.id);

    // Delete associated image via Pipeline
    if (doc.thumbnailFileId) {
      const formData = new FormData();
      formData.append('file_id', doc.thumbnailFileId);
      await fetch(`${config.pipeline.url}/media/portfolio/delete-image`, {
        method: 'DELETE',
        headers: {
          'X-Service-Token': config.pipeline.serviceToken,
          'X-Admin-Verified': 'true',
        },
        body: formData,
      }).catch((err) =>
        logger.warn({ err, imageId: doc.thumbnailFileId }, 'Failed to delete storage file via Pipeline')
      );
    }

    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;
