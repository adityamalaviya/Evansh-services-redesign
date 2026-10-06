import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import { AppwriteException } from '../lib/appwrite';

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

  // Appwrite SDK errors
  if (err instanceof AppwriteException || ('type' in err && 'code' in err && typeof (err as any).code === 'number')) {
    const appwriteErr = err as AppwriteException;
    logger.warn({ requestId, type: appwriteErr.type, code: appwriteErr.code, message: appwriteErr.message }, 'Appwrite error');

    const status = appwriteErr.code >= 400 && appwriteErr.code < 600 ? appwriteErr.code : 502;
    res.status(status).json({
      error: {
        code: appwriteErr.type ? appwriteErr.type.toUpperCase() : 'DATABASE_ERROR',
        message: appwriteErr.message || 'A database error occurred.',
      },
    });
    return;
  }

  // Network / Gateway errors to upstream services (FastAPI Pipeline, Appwrite Cloud, SMTP, Resend)
  const errCode = (err as any)?.code || (err as any)?.cause?.code;
  const isNetworkTimeout = err.name === 'AbortError' || errCode === 'ETIMEDOUT' || errCode === 'UND_ERR_CONNECT_TIMEOUT';
  const isNetworkRefused = errCode === 'ECONNREFUSED' || errCode === 'ENOTFOUND' || errCode === 'EAI_AGAIN';

  if (isNetworkTimeout) {
    logger.warn({ requestId, err: err.message, code: errCode }, 'Upstream service timed out');
    res.status(504).json({
      error: {
        code: 'GATEWAY_TIMEOUT',
        message: 'The requested service timed out. Please try again.',
      },
    });
    return;
  }

  if (isNetworkRefused) {
    logger.warn({ requestId, err: err.message, code: errCode }, 'Upstream service unavailable or connection refused');
    res.status(502).json({
      error: {
        code: 'BAD_GATEWAY',
        message: 'Upstream service is temporarily unavailable. Please try again shortly.',
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

