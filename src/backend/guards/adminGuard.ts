import { publicEnv } from '@/lib/env';

// ponytail: single comparison for UI route gating; BFF enforces actual security
export function isAdmin(userEmail: string | null | undefined): boolean {
  if (!userEmail || !publicEnv.adminEmail) return false;
  return userEmail.trim().toLowerCase() === publicEnv.adminEmail.trim().toLowerCase();
}
