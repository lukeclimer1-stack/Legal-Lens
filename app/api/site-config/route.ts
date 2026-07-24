import { NextResponse } from 'next/server'
import { getSiteConfig, writeSiteConfig, SiteConfig } from '@/lib/site-config'
import { checkAdminAuth } from '@/lib/auth'

export async function GET() {
  const config = await getSiteConfig()
  return NextResponse.json(config)
}

export async function POST(request: Request) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = (await request.json()) as SiteConfig
    if (!body || typeof body !== 'object' || !body.about || !body.writers) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    await writeSiteConfig(body)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
