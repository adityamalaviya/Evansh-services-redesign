import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { config } from './config/env';
import { logger } from './lib/logger';
import { requestIdMiddleware } from './middleware/requestId';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Public routes
import coursesPublicRouter from './routes/public/courses';
import servicesPublicRouter from './routes/public/services';
import projectsPublicRouter from './routes/public/projects';
import contactRouter from './routes/public/contact';

// Admin routes
import dashboardRouter from './routes/admin/dashboard';
import coursesAdminRouter from './routes/admin/courses';
import servicesAdminRouter from './routes/admin/services';
import projectsAdminRouter from './routes/admin/projects';

const app = express();

// ── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origins,
    credentials: true, // allow session cookies to be forwarded
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  })
);

// ── Core Middleware ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestIdMiddleware);

// ── Request logging ───────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.info({ requestId: req.requestId, method: req.method, path: req.path }, 'Incoming request');
  next();
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'evansh-bff', env: config.nodeEnv });
});

// ── Public routes ─────────────────────────────────────────────────────────────
app.use('/api/courses', coursesPublicRouter);
app.use('/api/services', servicesPublicRouter);
app.use('/api/projects', projectsPublicRouter);
app.use('/api/contact', contactRouter);

// ── Admin routes (all require auth + admin check) ─────────────────────────────
app.use('/api/admin', dashboardRouter);
app.use('/api/admin/courses', coursesAdminRouter);
app.use('/api/admin/services', servicesAdminRouter);
app.use('/api/admin/projects', projectsAdminRouter);

// ── 404 + Error handlers (must be last) ──────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  logger.info({ port: config.port, env: config.nodeEnv }, `🚀 BFF started`);
});

export default app;
