import { z } from 'zod';

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

  // Admin
  ADMIN_EMAIL: z.string().email().default(process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? ''),

  // Internal FastAPI pipeline
  PIPELINE_SERVICE_TOKEN: z.string().min(32),
  SERVICE_JWT_SECRET: z.string().optional().default(process.env.SERVICE_JWT_SECRET ?? ''),
  PIPELINE_URL: z.string().url().default(process.env.PIPELINE_URL ?? 'http://localhost:8000'),

  // CORS
  ALLOWED_ORIGINS: z.string().default(process.env.NEXT_PUBLIC_ALLOWED_ORIGINS ?? 'http://localhost:3000'),

  // Email
  RESEND_API_KEY: z.string().optional(),

  // Cookies
  COOKIE_SECRET: z.string().min(1).default('change-me-to-a-long-random-string'),
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
  cookieSecret: parsed.data.COOKIE_SECRET,
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

  resend: {
    apiKey: parsed.data.RESEND_API_KEY,
  },
} as const;
