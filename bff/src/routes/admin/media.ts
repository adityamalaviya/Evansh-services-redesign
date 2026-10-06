import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { requireAdmin } from '../../middleware/auth';
import { adminLimiter } from '../../middleware/rateLimiter';
import { uploadImageWithFallback, deleteImageWithFallback } from '../../lib/mediaUpload';
import { logger } from '../../lib/logger';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const VALID_ENTITIES = new Set(['courses', 'portfolio', 'services']);

// POST /api/admin/media/:entity/upload-image
router.post(
  '/:entity/upload-image',
  adminLimiter,
  requireAdmin,
  upload.single('file'),
  async (req: Request<{ entity: string }>, res: Response, next: NextFunction) => {
    try {
      const { entity } = req.params;
      if (!VALID_ENTITIES.has(entity)) {
        res.status(400).json({ error: { code: 'INVALID_ENTITY', message: 'Unknown image collection.' } });
        return;
      }
      const result = await uploadImageWithFallback(req, entity as 'courses' | 'portfolio' | 'services');
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/admin/media/:entity/update-image
router.put(
  '/:entity/update-image',
  adminLimiter,
  requireAdmin,
  upload.single('file'),
  async (req: Request<{ entity: string }>, res: Response, next: NextFunction) => {
    try {
      const { entity } = req.params;
      if (!VALID_ENTITIES.has(entity)) {
        res.status(400).json({ error: { code: 'INVALID_ENTITY', message: 'Unknown image collection.' } });
        return;
      }
      const result = await uploadImageWithFallback(req, entity as 'courses' | 'portfolio' | 'services');
      const oldFileId = req.body?.old_file_id as string | undefined;
      if (oldFileId) {
        deleteImageWithFallback(oldFileId, entity as 'courses' | 'portfolio' | 'services').catch((cleanupErr) =>
          logger.warn({ cleanupErr, oldFileId }, 'Failed to delete old image on update')
        );
      }
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/admin/media/:entity/delete-image
router.delete(
  '/:entity/delete-image',
  adminLimiter,
  requireAdmin,
  upload.none(),
  async (req: Request<{ entity: string }>, res: Response, next: NextFunction) => {
    try {
      const { entity } = req.params;
      if (!VALID_ENTITIES.has(entity)) {
        res.status(400).json({ error: { code: 'INVALID_ENTITY', message: 'Unknown image collection.' } });
        return;
      }
      const fileId = req.body?.file_id as string | undefined;
      if (!fileId) {
        res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'file_id is required.' } });
        return;
      }
      await deleteImageWithFallback(fileId, entity as 'courses' | 'portfolio' | 'services');
      res.status(200).json({ file_id: fileId, deleted: true });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
