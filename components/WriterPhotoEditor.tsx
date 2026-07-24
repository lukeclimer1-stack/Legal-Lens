'use client'

import { useState } from 'react'
import PhotoCropper from './PhotoCropper'
import type { SiteConfig, PhotoCrop } from '@/lib/site-config-shared'
import { NATURAL_RATIOS, DEFAULT_SITE_CONFIG } from '@/lib/site-config-shared'
import { useSiteAuth } from './SiteAuthProvider'

interface Props {
  cropKey: string
  photo: string
  name: string
  initialConfig: SiteConfig
  boxW?: number
  boxH?: number
  zoomMax?: number
  alwaysEditable?: boolean
}

export default function WriterPhotoEditor({ cropKey, photo, name, initialConfig, boxW = 150, boxH = 180, zoomMax = 4, alwaysEditable = false }: Props) {
  const { password } = useSiteAuth()
  const [config, setConfig] = useState(initialConfig)
  const crop = config.writers[cropKey] || DEFAULT_SITE_CONFIG.writers[cropKey]

  async function onSave(next: PhotoCrop) {
    const updated = { ...config, writers: { ...config.writers, [cropKey]: next } }
    setConfig(updated)
    await fetch('/api/site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(updated),
    })
  }

  return (
    <PhotoCropper
      src={photo}
      alt={name}
      natRatio={NATURAL_RATIOS[cropKey] || 1.25}
      boxW={boxW}
      boxH={boxH}
      crop={crop}
      onSave={onSave}
      zoomMin={1}
      zoomMax={zoomMax}
      zoomStep={0.05}
      alwaysEditable={alwaysEditable}
    />
  )
}
