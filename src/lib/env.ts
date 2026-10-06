function getPublicEnv(name: string, fallback = ''): string {
  const value = process.env[name];
  if (!value) {
    if (process.env.NODE_ENV === 'production' && !fallback) {
      console.warn(`[WARN] Missing environment variable: ${name}`);
    }
    return fallback;
  }
  return value;
}

// ponytail: lean client/server public environment config
export const publicEnv = {
  appwriteEndpoint: getPublicEnv('NEXT_PUBLIC_APPWRITE_ENDPOINT', 'https://cloud.appwrite.io/v1'),
  appwriteProjectId: getPublicEnv('NEXT_PUBLIC_APPWRITE_PROJECT_ID', ''),
  bffUrl: getPublicEnv('NEXT_PUBLIC_BFF_URL', 'http://localhost:3001'),
  adminEmail: getPublicEnv('NEXT_PUBLIC_ADMIN_EMAIL', ''),
  dbId: process.env.NEXT_PUBLIC_DB_ID || '',
} as const;

export function requireServerEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required server env var: ${name}`);
  return val;
}