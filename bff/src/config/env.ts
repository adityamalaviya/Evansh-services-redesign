import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from bff/.env, falling back to root .env.local and .env
dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), '../.env.local'), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), '../.env'), quiet: true });

const schema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Appwrite — server-side only, never sent to frontend
  APPWRITE_ENDPOINT: z.string().url().default(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? ''),
  APPWRITE_PROJECT_ID: z.string().min(1).default(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? ''),
  APPWRITE_API_KEY: z.string().min(1),

  // Database
  APPWRITE_DB_ID: z.string().min(1).default(process.env.NEXT_PUBLIC_APPWRITE_DB_ID ?? ''),
  APPWRITE_BUCKET_ID: z.string().min(1).default(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID ?? ''),

  // Admin (server-only)
  ADMIN_EMAIL: z.string().email(),

  // Internal FastAPI pipeline
  PIPELINE_SERVICE_TOKEN: z.string().min(32),
  SERVICE_JWT_SECRET: z.string().optional().default(process.env.SERVICE_JWT_SECRET ?? ''),
  PIPELINE_URL: z.string().url().default(process.env.PIPELINE_URL ?? 'http://localhost:8000'),

  // CORS
  ALLOWED_ORIGINS: z.string().default(process.env.NEXT_PUBLIC_ALLOWED_ORIGINS ?? 'http://localhost:3000'),

  // Email — Native SMTP (Gmail / custom SMTP) or Resend
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_SECURE: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

if (parsed.data.NODE_ENV === 'production' && !process.env.ALLOWED_ORIGINS) {
  console.error('❌ ALLOWED_ORIGINS must be explicitly configured in production');
  process.exit(1);
}

export const config = {
  port: parseInt(parsed.data.PORT, 10),
  isDev: parsed.data.NODE_ENV === 'development',
  nodeEnv: parsed.data.NODE_ENV,
  serviceJwtSecret: parsed.data.SERVICE_JWT_SECRET || process.env.SERVICE_JWT_SECRET,

  appwrite: {
    endpoint: parsed.data.APPWRITE_ENDPOINT,
    projectId: parsed.data.APPWRITE_PROJECT_ID,
    apiKey: parsed.data.APPWRITE_API_KEY,
    dbId: parsed.data.APPWRITE_DB_ID,
    bucketId: parsed.data.APPWRITE_BUCKET_ID,
  },

  admin: {
    email: parsed.data.ADMIN_EMAIL.toLowerCase().trim(),
  },

  pipeline: {
    serviceToken: parsed.data.PIPELINE_SERVICE_TOKEN,
    url: parsed.data.PIPELINE_URL,
  },

  cors: {
    origins: parsed.data.ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
  },

  email: {
    smtpHost: parsed.data.SMTP_HOST || (parsed.data.SMTP_USER?.includes('@gmail.com') ? 'smtp.gmail.com' : undefined),
    smtpPort: parsed.data.SMTP_PORT ? parseInt(parsed.data.SMTP_PORT, 10) : 465,
    smtpSecure: parsed.data.SMTP_SECURE !== 'false',
    smtpUser: parsed.data.SMTP_USER,
    smtpPass: parsed.data.SMTP_PASS,
    from: parsed.data.EMAIL_FROM || (parsed.data.SMTP_USER ? `"Evansh Services" <${parsed.data.SMTP_USER}>` : undefined),
  },

  resend: {
    apiKey: parsed.data.RESEND_API_KEY,
    fromEmail: parsed.data.RESEND_FROM_EMAIL || 'Evansh Services <onboarding@resend.dev>',
  },
} as const;
