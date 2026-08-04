import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Type augmentation is in src/types/express.d.ts — applies globally.

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const suppliedId = req.headers['x-request-id'];
  const requestId = typeof suppliedId === 'string' && /^[a-zA-Z0-9._:-]{1,100}$/.test(suppliedId)
    ? suppliedId
    : uuidv4();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}
