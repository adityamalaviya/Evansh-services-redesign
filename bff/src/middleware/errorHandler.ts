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
  const isDuckAppwrite = 'type' in err && 'code' in err && typeof err.code === 'number';
  if (err instanceof AppwriteException || isDuckAppwrite) {
    const code = 'code' in err && typeof err.code === 'number' ? err.code : 500;
    const type = 'type' in err && typeof err.type === 'string' ? err.type : undefined;
    logger.warn({ requestId, type, code, message: err.message }, 'Appwrite error');

    const status = code >= 400 && code < 600 ? code : 502;
    res.status(status).json({
      error: {
        code: type ? type.toUpperCase() : 'DATABASE_ERROR',
        message: err.message || 'A database error occurred.',
      },
    });
    return;
  }

  // Network / Gateway errors to upstream services (Appwrite Cloud, SMTP, Resend)
  const errCode = 'code' in err && typeof err.code === 'string' ? err.code : undefined;
  const cause = 'cause' in err && typeof err.cause === 'object' && err.cause !== null ? err.cause : undefined;
  const causeCode = cause && 'code' in cause && typeof cause.code === 'string' ? cause.code : undefined;
  const resolvedCode = errCode || causeCode;
  const isNetworkTimeout = err.name === 'AbortError' || resolvedCode === 'ETIMEDOUT' || resolvedCode === 'UND_ERR_CONNECT_TIMEOUT';
  const isNetworkRefused = resolvedCode === 'ECONNREFUSED' || resolvedCode === 'ENOTFOUND' || resolvedCode === 'EAI_AGAIN';

  if (isNetworkTimeout) {
    logger.warn({ requestId, err: err.message, code: resolvedCode }, 'Upstream service timed out');
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

