import type { MetadataRoute } from 'next'
import { getArticles } from '@/lib/articles'
import { getAllCategories } from '@/lib/categories'
import { SITE_URL } from '@/lib/site'

// The sitemap is the list of pages search engines read to find every article.
// It rebuilds itself from content/articles.json, so there is nothing to maintain by hand.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles()
  const categories = await getAllCategories()
  const isoDate = (d?: string) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : undefined)

  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/blog` },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/writers` },
    { url: `${SITE_URL}/glossary` },
    ...articles.map((a) => ({
      url: `${SITE_URL}/blog/${a.slug}`,
      lastModified: isoDate(a.currentAsOf) || isoDate(a.date),
    })),
    ...categories.map((c) => ({ url: `${SITE_URL}/blog/category/${c.slug}` })),
  ]
}
