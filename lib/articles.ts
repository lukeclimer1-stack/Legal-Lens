import { promises as fs } from 'fs'
import path from 'path'

export interface Article {
  slug: string
  title: string
  category: string
  author: string
  /** Publication date as "YYYY-MM-DD". Always include the year. */
  date: string
  /** Optional "YYYY-MM-DD". The date the article's facts were last checked. Defaults to the publication date. */
  currentAsOf?: string
  /** Optional short note shown at the top of the article when something has changed since publication. */
  updateNote?: string
  image: string
  excerpt: string
  pullQuote: string
  body: string
  imageCrop?: { x: number; y: number }
  /** 'contain' shows the whole photo letterboxed instead of cropping it to fill the frame. Defaults to 'cover'. */
  imageFit?: 'cover' | 'contain'
}

const filePath = path.join(process.cwd(), 'content', 'articles.json')

export async function getArticles(): Promise<Article[]> {
  const data = await fs.readFile(filePath, 'utf-8')
  const parsed = JSON.parse(data)
  return Array.isArray(parsed) ? parsed : parsed.articles || []
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getArticles()
  return articles.find((a) => a.slug === slug)
}

export async function writeArticles(articles: Article[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify({ articles }, null, 2))
}
