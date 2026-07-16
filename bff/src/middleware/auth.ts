import { Request, Response, NextFunction } from 'express';
import { Client, Account } from 'node-appwrite';
import { createSessionClient } from '../lib/appwrite';
import { config } from '../config/env';
import { logger } from '../lib/logger';

// ── Extract JWT from Authorization header ───────────────────────────────────
function extractJWT(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// ── Extract Appwrite session cookie from request ────────────────────────────
function extractSessionCookie(req: Request): string | null {
  const cookieName = `a_session_${config.appwrite.projectId}`;
  const cookieHeader = req.headers.cookie || '';

  for (const part of cookieHeader.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === cookieName) {
      return rest.join('=');
    }
  }
  return null;
}

// ── Base auth: verify JWT or session cookie, attach req.user ─────────────────
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const jwt = extractJWT(req);
  const sessionToken = extractSessionCookie(req);

  if (!jwt && !sessionToken) {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required. Please log in.' },
    });
    return;
  }

  try {
    let user;
    if (jwt) {
      const userClient = new Client()
        .setEndpoint(config.appwrite.endpoint)
        .setProject(config.appwrite.projectId)
        .setJWT(jwt);
      const account = new Account(userClient);
      user = await account.get();
    } else {
      const { account } = createSessionClient(sessionToken!);
      user = await account.get();
    }

    req.user = {
      userId: user.$id,
      email: user.email,
      name: user.name,
    };
    next();
  } catch (err) {
    logger.warn({ requestId: req.requestId, err }, 'Authentication verification failed');
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Session expired or invalid. Please log in again.' },
    });
  }
}

// ── Admin auth: verify session + enforce admin email ────────────────────────
export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  await requireAuth(req, res, async () => {
    if (!req.user) return; // already handled by requireAuth

    const userEmail = req.user.email.toLowerCase().trim();
    if (userEmail !== config.admin.email) {
      logger.warn(
        { requestId: req.requestId, userEmail, adminEmail: config.admin.email },
        'Non-admin user attempted admin access'
      );
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource.',
        },
      });
      return;
    }
    next();
  });
}
