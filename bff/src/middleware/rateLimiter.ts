import rateLimit from 'express-rate-limit';

const makeHandler = (windowMs: number, max: number, message: string) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
        error: { code: 'RATE_LIMITED', message },
      });
    },
  });

// Public API — 60 requests per minute
export const publicLimiter = makeHandler(
  60 * 1000,
  60,
  'Too many requests. Please wait a moment and try again.'
);

// Admin API — 20 requests per minute
export const adminLimiter = makeHandler(
  60 * 1000,
  20,
  'Too many admin requests. Please slow down.'
);

// Contact form — 5 requests per 15 minutes
export const contactLimiter = makeHandler(
  15 * 60 * 1000,
  5,
  'Too many contact form submissions. Please wait 15 minutes.'
);
