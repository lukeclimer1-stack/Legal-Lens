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
