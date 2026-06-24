import { NextResponse } from 'next/server'
import { getArticles, writeArticles, Article } from '@/lib/articles'

export async function GET() {
  const articles = await getArticles()
  return NextResponse.json(articles)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    await writeArticles(body as Article[])
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
