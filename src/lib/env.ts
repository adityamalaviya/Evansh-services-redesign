// ponytail: static property access is required for Next.js bundler to inline NEXT_PUBLIC_* variables in client bundles
export const publicEnv = {
  appwriteEndpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  appwriteProjectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  bffUrl: process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:3001',
  dbId: process.env.NEXT_PUBLIC_DB_ID || '',
} as const;

export function requireServerEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required server env var: ${name}`);
  return val;
}