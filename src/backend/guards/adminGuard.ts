/**
 * Admin Guard — checks if the logged-in user is the admin.
 * Admin email is stored in NEXT_PUBLIC_ADMIN_EMAIL environment variable.
 */

import { publicEnv } from '@/lib/env';

const ADMIN_EMAIL = publicEnv.adminEmail;

export function isAdmin(userEmail: string | null | undefined): boolean {
  const normalizedAdmin = ADMIN_EMAIL.trim().toLowerCase();
  const normalizedUser = (userEmail ?? '').trim().toLowerCase();
  
  console.log("Checking Admin Access:", {
    user: normalizedUser,
    required: normalizedAdmin,
    match: normalizedUser === normalizedAdmin
  });

  if (!normalizedUser || !normalizedAdmin) return false;
  return normalizedUser === normalizedAdmin;
}
