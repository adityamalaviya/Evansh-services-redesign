import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export function generateServiceToken(): string {
  const secret = config.serviceJwtSecret;
  if (!secret) throw new Error('SERVICE_JWT_SECRET is not set');
  return jwt.sign(
    { service: 'bff', iat: Math.floor(Date.now() / 1000) },
    secret,
    { expiresIn: '5m' }
  );
}
