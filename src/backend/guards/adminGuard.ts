/**
 * Admin Guard — checks if the logged-in user is the admin.
 * Admin email is stored in NEXT_PUBLIC_ADMIN_EMAIL environment variable.
 */

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '';

export function isAdmin(userEmail: string | null | undefined): boolean {
  const normalizedAdmin = ADMIN_EMAIL.trim().toLowerCase();
  const normalizedUser = (userEmail ?? '').trim().toLowerCase();
  
  if (!normalizedUser || !normalizedAdmin) return false;
  return normalizedUser === normalizedAdmin;
}
