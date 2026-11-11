// Site-wide constants used for page titles, share cards, the sitemap and the RSS feed.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://legallens.blog').replace(/\/+$/, '')
export const SITE_NAME = 'Legal Lens'
export const SITE_DESCRIPTION = 'Clear, accessible, and inclusive analysis of the law.'

/** Turns a site path like "/uploads/x.jpg" into a full URL. Full URLs pass through unchanged. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return SITE_URL + (pathOrUrl.startsWith('/') ? '' : '/') + encodeURI(pathOrUrl)
}
