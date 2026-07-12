const requiredShared = [
  'NEXT_PUBLIC_SENTRY_DSN',
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_HONO_API_URL',
  'NEXT_PUBLIC_ADMIN_EMAIL',
  'NEXT_PUBLIC_APPWRITE_ENDPOINT',
  'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
] as const;

const requiredServer = [
  'HONO_API_URL',
  'REVALIDATE_SECRET',
  'RESEND_API_KEY',
] as const;

// On the server, we can validate all environment variables
if (typeof window === 'undefined') {
  const missing: string[] = [];

  requiredShared.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  requiredServer.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
} else {
  // On the client, we check statically since dynamic property access does not resolve compiled public env vars
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) missing.push('NEXT_PUBLIC_SENTRY_DSN');
  if (!process.env.NEXT_PUBLIC_API_URL) missing.push('NEXT_PUBLIC_API_URL');
  if (!process.env.NEXT_PUBLIC_HONO_API_URL) missing.push('NEXT_PUBLIC_HONO_API_URL');
  if (!process.env.NEXT_PUBLIC_ADMIN_EMAIL) missing.push('NEXT_PUBLIC_ADMIN_EMAIL');
  if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) missing.push('NEXT_PUBLIC_APPWRITE_ENDPOINT');
  if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) missing.push('NEXT_PUBLIC_APPWRITE_PROJECT_ID');

  if (missing.length > 0) {
    throw new Error(`Missing client environment variables: ${missing.join(', ')}`);
  }
}
