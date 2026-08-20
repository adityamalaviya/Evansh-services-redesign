import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { requireAdmin } from '../../middleware/auth';
import { adminLimiter } from '../../middleware/rateLimiter';
import { config } from '../../config/env';
const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

async function forward(req: Request, res: Response, next: NextFunction, path: string, method = 'POST') {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const body = new FormData();
    if (req.file) body.append('file', new Blob([new Uint8Array(req.file.buffer)], { type: req.file.mimetype }), req.file.originalname);
    if (req.body.old_file_id) body.append('old_file_id', req.body.old_file_id);
    if (req.body.file_id) body.append('file_id', req.body.file_id);
    const upstream = await fetch(`${config.pipeline.url}${path}`, {
      method,
      headers: {
        'X-Service-Token': config.pipeline.serviceToken,
        'X-Admin-Verified': 'true',
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
        ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}),
      },
      body,
      signal: controller.signal,
    });
    const text = await upstream.text();
    res.status(upstream.status).type('application/json').send(text);
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      res.status(504).json({ error: { code: 'PIPELINE_TIMEOUT', message: 'Image service timed out. Please try again.' } });
      return;
    }
    next(err);
  } finally {
    clearTimeout(timeout);
  }
}

for (const entity of ['courses', 'portfolio', 'services'] as const) {
  router.post(`/${entity}/upload-image`, adminLimiter, requireAdmin, upload.single('file'), (req, res, next) => forward(req, res, next, `/media/${entity}/upload-image`));
  router.put(`/${entity}/update-image`, adminLimiter, requireAdmin, upload.single('file'), (req, res, next) => forward(req, res, next, `/media/${entity}/update-image`, 'PUT'));
  router.delete(`/${entity}/delete-image`, adminLimiter, requireAdmin, upload.none(), (req, res, next) => forward(req, res, next, `/media/${entity}/delete-image`, 'DELETE'));
}

export default router;
