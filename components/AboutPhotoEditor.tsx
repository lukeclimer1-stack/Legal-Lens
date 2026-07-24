'use client'

import { useState } from 'react'
import PhotoCropper from './PhotoCropper'
import type { SiteConfig, PhotoCrop } from '@/lib/site-config-shared'
import { NATURAL_RATIOS } from '@/lib/site-config-shared'
import { useSiteAuth } from './SiteAuthProvider'

export default function AboutPhotoEditor({
  initialConfig,
  alwaysEditable = false,
}: {
  initialConfig: SiteConfig
  alwaysEditable?: boolean
}) {
  const { password } = useSiteAuth()
  const [config, setConfig] = useState(initialConfig)

  async function onSave(next: PhotoCrop) {
    const updated = { ...config, about: next }
    setConfig(updated)
    await fetch('/api/site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(updated),
    })
  }

  return (
    <PhotoCropper
      src="/uploads/luke-src.jpg"
      alt="Luke Wilson"
      natRatio={NATURAL_RATIOS.about}
      boxW={260}
      boxH={340}
      crop={config.about}
      onSave={onSave}
      alwaysEditable={alwaysEditable}
    />
  )
}
