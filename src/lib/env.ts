function requireEnv(name: string, value = process.env[name]): string {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

// ponytail: lean client/server public environment config
export const publicEnv = {
  appwriteEndpoint: requireEnv('NEXT_PUBLIC_APPWRITE_ENDPOINT', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
  appwriteProjectId: requireEnv('NEXT_PUBLIC_APPWRITE_PROJECT_ID', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
  bffUrl: requireEnv('NEXT_PUBLIC_BFF_URL', process.env.NEXT_PUBLIC_BFF_URL),
  adminEmail: requireEnv('NEXT_PUBLIC_ADMIN_EMAIL', process.env.NEXT_PUBLIC_ADMIN_EMAIL),
  dbId: process.env.NEXT_PUBLIC_DB_ID,
} as const;

export function requireServerEnv(name: string): string {
  return requireEnv(name);
}