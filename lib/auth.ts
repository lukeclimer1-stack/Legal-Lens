// Shared staff password for the in-page "Manage Articles" / "Manage Website" editors.
// This is a lightweight shared-secret gate, not real per-user authentication —
// but write endpoints must still check it server-side, not just in the UI.
//
// DEFAULT_ADMIN_PASSWORD is imported by client-side login forms, so it must stay
// a plain literal (client bundles can't see un-prefixed server env vars). If you
// override ADMIN_PASSWORD in the deployment environment, update this literal to
// match, or the client-side login screens will fall out of sync with the server.
export const DEFAULT_ADMIN_PASSWORD = 'legallens2007'

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD

export function checkAdminAuth(request: Request): boolean {
  const header = request.headers.get('x-admin-password') || ''
  return header === ADMIN_PASSWORD
}
