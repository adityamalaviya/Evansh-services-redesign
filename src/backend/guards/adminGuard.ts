/**
 * Admin role helper. Admin status is verified server-side by the BFF via JWT session.
 */
export function isAdmin(userIsAdmin: boolean | null | undefined): boolean {
  return Boolean(userIsAdmin);
}

