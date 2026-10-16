import { publicEnv } from "@/lib/env";

/**
 * Admin role helper.
 * Returns true if server verified (userIsAdmin is true) OR if user email matches configured admin email.
 */
export function isAdmin(userIsAdmin?: boolean | null, userEmail?: string | null): boolean {
  if (userIsAdmin) return true;
  if (!userEmail || !publicEnv.adminEmail) return false;
  return userEmail.trim().toLowerCase() === publicEnv.adminEmail.trim().toLowerCase();
}

