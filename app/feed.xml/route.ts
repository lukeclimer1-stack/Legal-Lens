import { getArticles } from '@/lib/articles'
import { splitCategories } from '@/lib/format'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'

// RSS feed at /feed.xml, built from content/articles.json. Lets readers follow
// Legal Lens in a feed reader and lets newsletter tools pick up new articles automatically.
export const dynamic = 'force-static'

function escapeXml(s: string): string {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function rssDate(date: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || '')
  if (!m) return null
  // Noon UTC keeps the calendar day the same in every US time zone.
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12)).toUTCString()
}

export async function GET() {
  const articles = await getArticles()
  const items = articles
    .map((a) => {
      const link = `${SITE_URL}/blog/${a.slug}`
      const pubDate = rssDate(a.date)
      return [
        '    <item>',
        `      <title>${escapeXml(a.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <description>${escapeXml(a.excerpt)}</description>`,
        `      <dc:creator>${escapeXml(a.author)}</dc:creator>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : '',
        ...splitCategories(a.category).map((c) => `      <category>${escapeXml(c)}</category>`),
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
