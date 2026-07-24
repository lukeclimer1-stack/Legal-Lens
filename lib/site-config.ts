import { promises as fs } from 'fs'
import path from 'path'
import { SiteConfig, DEFAULT_SITE_CONFIG } from './site-config-shared'

export type { PhotoCrop, SiteConfig } from './site-config-shared'
export { DEFAULT_SITE_CONFIG, NATURAL_RATIOS } from './site-config-shared'

const filePath = path.join(process.cwd(), 'content', 'site-config.json')

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    const parsed = JSON.parse(data)
    return {
      about: { ...DEFAULT_SITE_CONFIG.about, ...parsed.about },
      writers: { ...DEFAULT_SITE_CONFIG.writers, ...parsed.writers },
    }
  } catch {
    return DEFAULT_SITE_CONFIG
  }
}

export async function writeSiteConfig(config: SiteConfig): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(config, null, 2))
}
