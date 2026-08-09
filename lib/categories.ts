import { getArticles, Article } from './articles'
import { splitCategories, slugifyCategory } from './format'

export interface CategoryInfo {
  name: string
  slug: string
}

// Every category is derived from content/articles.json - there is no separate
// list to maintain. Add a new category to any article's "category" field and
// it appears here automatically, next time the site builds.
export async function getAllCategories(): Promise<CategoryInfo[]> {
  const articles = await getArticles()
  const bySlug = new Map<string, string>()
  for (const article of articles) {
    for (const name of splitCategories(article.category)) {
      const slug = slugifyCategory(name)
      if (slug && !bySlug.has(slug)) bySlug.set(slug, name)
    }
  }
  return Array.from(bySlug.entries())
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getArticlesByCategorySlug(
  slug: string
): Promise<{ name: string; articles: Article[] } | null> {
  const articles = await getArticles()
  let name: string | null = null
  const matched = articles.filter((article) =>
    splitCategories(article.category).some((cat) => {
      const isMatch = slugifyCategory(cat) === slug
      if (isMatch && !name) name = cat
      return isMatch
    })
  )
  if (!matched.length || !name) return null
  return { name, articles: matched }
}
