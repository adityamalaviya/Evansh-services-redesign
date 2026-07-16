import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found.` },
  });
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const requestId = req.requestId;

  if (err instanceof AppError) {
    logger.warn({ requestId, code: err.code, message: err.message }, 'App error');
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
    return;
  }

  // Appwrite SDK errors have a `type` and `code` field
  const appwriteErr = err as any;
  if (appwriteErr?.type && appwriteErr?.code) {
    logger.warn({ requestId, type: appwriteErr.type, code: appwriteErr.code }, 'Appwrite error');

    // Map common Appwrite errors to friendly messages
    const status = appwriteErr.code >= 400 && appwriteErr.code < 600 ? appwriteErr.code : 500;
    res.status(status).json({
      error: {
        code: appwriteErr.type?.toUpperCase() ?? 'APPWRITE_ERROR',
        message: appwriteErr.message ?? 'A database error occurred.',
      },
    });
    return;
  }

  // Unknown / internal error — never leak details
  logger.error({ requestId, err }, 'Unhandled internal error');
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred. Please try again.' },
  });
}
