/**
 * Admin email allowlist.
 *
 * Any user whose email appears here is automatically treated as an
 * administrator and can access the /admin/* dashboard without needing
 * additional backend configuration.
 *
 * To add or remove admins:
 *   1. Edit this list.
 *   2. Run `npm run build` again.
 *   3. Re-upload the new `out/` to public_html.
 *
 * Comparison is case-insensitive.
 */
export const ADMIN_EMAILS: ReadonlyArray<string> = [
  "admin@example.com",
  "admin@adverse.live",
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.some(
    (e) => e.toLowerCase() === email.trim().toLowerCase(),
  );
}
