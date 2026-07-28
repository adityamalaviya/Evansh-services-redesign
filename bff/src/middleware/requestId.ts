import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Extend Express Request type to carry requestId
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      user?: {
        userId: string;
        email: string;
        name: string;
      };
    }
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const suppliedId = req.headers['x-request-id'];
  const requestId = typeof suppliedId === 'string' && /^[a-zA-Z0-9._:-]{1,100}$/.test(suppliedId)
    ? suppliedId
    : uuidv4();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}
