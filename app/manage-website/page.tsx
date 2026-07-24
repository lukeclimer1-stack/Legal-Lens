import { promises as fs } from 'fs'
import path from 'path'
import { getSiteConfig } from '@/lib/site-config'
import ManageWebsitePanel from '@/components/ManageWebsitePanel'

interface Writer {
  name: string
  slug: string
  photo: string
}

async function getWriters(): Promise<Writer[]> {
  const data = await fs.readFile(path.join(process.cwd(), 'content', 'writers.json'), 'utf-8')
  return JSON.parse(data)
}

export default async function ManageWebsitePage() {
  const [writers, siteConfig] = await Promise.all([getWriters(), getSiteConfig()])
  return <ManageWebsitePanel writers={writers} siteConfig={siteConfig} />
}
