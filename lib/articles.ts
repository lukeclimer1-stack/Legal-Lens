import { promises as fs } from 'fs'
import path from 'path'

export interface Article {
  slug: string
  title: string
  category: string
  author: string
  date: string
  image: string
  excerpt: string
  pullQuote: string
  body: string
}

const filePath = path.join(process.cwd(), 'content', 'articles.json')

export async function getArticles(): Promise<Article[]> {
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getArticles()
  return articles.find((a) => a.slug === slug)
}

export async function writeArticles(articles: Article[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(articles, null, 2))
}
