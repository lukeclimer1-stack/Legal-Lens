// Pure display-formatting helpers with no Node built-ins, safe to import from client components.

export function splitCategories(category: string): string[] {
  return String(category || '')
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function formatCategory(category: string): string {
  return splitCategories(category).join(' · ')
}

export function slugifyCategory(name: string): string {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function cropPosition(crop?: { x: number; y: number }): string {
  if (!crop || crop.x == null || crop.y == null) return '50% 50%'
  return `${crop.x}% ${crop.y}%`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Article dates are stored as "YYYY-MM-DD" and shown as "Aug 17, 2026".
 * Parsed by hand (no Date object) so the day never shifts with the reader's time zone.
 * Anything that isn't in that format is shown exactly as written.
 */
export function formatDate(date: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date || '').trim())
  if (!m) return String(date || '')
  const month = MONTHS[Number(m[2]) - 1]
  if (!month) return date
  return `${month} ${Number(m[3])}, ${m[1]}`
}
