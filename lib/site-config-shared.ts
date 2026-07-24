// Pure types/constants with no Node built-ins, safe to import from client components.

export interface PhotoCrop {
  cropX: number
  cropY: number
  zoom: number
  bright: number
}

export interface SiteConfig {
  about: PhotoCrop
  writers: Record<string, PhotoCrop>
}

// Defaults ported verbatim from Legal Lens v2.dc.html's initial state / _wDefaults.
export const DEFAULT_SITE_CONFIG: SiteConfig = {
  about: { cropX: -39.078125, cropY: -48.2890625, zoom: 1.3, bright: 0.8 },
  writers: {
    luke: { cropX: -22, cropY: -41, zoom: 1.25, bright: 1.0 },
    skyler: { cropX: -37, cropY: -10, zoom: 1.5, bright: 1.0 },
    veen: { cropX: -10, cropY: 0, zoom: 1.1, bright: 1.0 },
    talio: { cropX: -63, cropY: -25, zoom: 1.75, bright: 1.0 },
    camrynn: { cropX: -43, cropY: -53, zoom: 1.55, bright: 1.0 },
  },
}

// Natural image aspect ratios (height / width), ported from v2's _natRatio / _writerNatRatios.
export const NATURAL_RATIOS: Record<string, number> = {
  about: 2976 / 1984,
  luke: 2976 / 1984,
  skyler: 1402 / 1122,
  camrynn: 1600 / 1200,
  veen: 1151 / 1025,
  talio: 1062 / 882,
}
