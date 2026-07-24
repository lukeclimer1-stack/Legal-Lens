'use client'

import { useRef, useState, useEffect } from 'react'
import type { PhotoCrop } from '@/lib/site-config-shared'
import { useSiteAuth } from './SiteAuthProvider'

interface Props {
  src: string
  alt: string
  natRatio: number
  boxW: number
  boxH: number
  crop: PhotoCrop
  onSave: (next: PhotoCrop) => void
  /** Show sliders/drag immediately without an "Adjust photo" toggle (used on the Manage Website page). */
  alwaysEditable?: boolean
  zoomMin?: number
  zoomMax?: number
  zoomStep?: number
}

function clamp(x: number, y: number, zoom: number, w: number, h: number, natRatio: number) {
  const imgW = w * zoom
  const imgH = imgW * natRatio
  const minX = Math.min(0, w - imgW)
  const minY = Math.min(0, h - imgH)
  return { cropX: Math.max(minX, Math.min(0, x)), cropY: Math.max(minY, Math.min(0, y)) }
}

export default function PhotoCropper({
  src,
  alt,
  natRatio,
  boxW,
  boxH,
  crop,
  onSave,
  alwaysEditable = false,
  zoomMin = 1,
  zoomMax = 3,
  zoomStep = 0.02,
}: Props) {
  const { authed } = useSiteAuth()
  const boxRef = useRef<HTMLDivElement>(null)
  const [local, setLocal] = useState<PhotoCrop>(crop)
  const [adjusting, setAdjusting] = useState(alwaysEditable)

  useEffect(() => setLocal(crop), [crop])

  const canEdit = alwaysEditable || authed
  const showControls = alwaysEditable || adjusting

  function boxSize() {
    const el = boxRef.current
    if (el) {
      const r = el.getBoundingClientRect()
      if (r.width) return { w: r.width, h: r.height }
    }
    return { w: boxW, h: boxH }
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!canEdit || !showControls) return
    e.preventDefault()
    const sx = e.clientX
    const sy = e.clientY
    const ox = local.cropX
    const oy = local.cropY
    const { w, h } = boxSize()
    const move = (ev: PointerEvent) => {
      const c = clamp(ox + (ev.clientX - sx), oy + (ev.clientY - sy), local.zoom, w, h, natRatio)
      setLocal((s) => ({ ...s, ...c }))
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setLocal((s) => {
        onSave(s)
        return s
      })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  function setZoom(e: React.ChangeEvent<HTMLInputElement>) {
    const zoom = parseFloat(e.target.value)
    const { w, h } = boxSize()
    const c = clamp(local.cropX, local.cropY, zoom, w, h, natRatio)
    const next = { ...local, zoom, ...c }
    setLocal(next)
    onSave(next)
  }

  function setBright(e: React.ChangeEvent<HTMLInputElement>) {
    const next = { ...local, bright: parseFloat(e.target.value) }
    setLocal(next)
    onSave(next)
  }

  return (
    <div>
      <div
        ref={boxRef}
        onPointerDown={onPointerDown}
        style={{
          width: boxW + 'px',
          height: boxH + 'px',
          background: '#e8e2d4',
          border: '1px solid #d8cfb9',
          overflow: 'hidden',
          position: 'relative',
          cursor: canEdit && showControls ? 'grab' : 'default',
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            position: 'absolute',
            left: local.cropX + 'px',
            top: local.cropY + 'px',
            width: local.zoom * 100 + '%',
            height: 'auto',
            maxWidth: 'none',
            display: 'block',
            filter: `brightness(${local.bright}) contrast(1.18) saturate(1.02)`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      </div>

      {canEdit && !alwaysEditable && (
        <div
          onClick={() => setAdjusting((a) => !a)}
          style={{
            marginTop: '8px',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '10px',
            letterSpacing: '1px',
            color: '#8a7340',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'inline-block',
          }}
        >
          ✎ {adjusting ? 'Done' : 'Adjust photo'}
        </div>
      )}

      {canEdit && showControls && (
        <div style={{ marginTop: '10px', padding: '14px', background: '#efe9dc', border: '1px solid #dcd3bf' }}>
          {!alwaysEditable && (
            <div
              style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '10px',
                letterSpacing: '1px',
                color: '#11203b',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Drag the photo to position your face
            </div>
          )}
          <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '10px', letterSpacing: '1px', color: '#5a6172', textTransform: 'uppercase', marginBottom: '3px' }}>
            Zoom
          </div>
          <input type="range" min={zoomMin} max={zoomMax} step={zoomStep} value={local.zoom} onChange={setZoom} style={{ width: '100%', accentColor: '#b08a42' }} />
          <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '10px', letterSpacing: '1px', color: '#5a6172', textTransform: 'uppercase', margin: '8px 0 3px' }}>
            Brightness
          </div>
          <input type="range" min={0.4} max={1.2} step={0.01} value={local.bright} onChange={setBright} style={{ width: '100%', accentColor: '#b08a42' }} />
        </div>
      )}
      {alwaysEditable && (
        <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '9px', letterSpacing: '1px', color: '#8a7340', marginTop: '7px', textTransform: 'uppercase' }}>
          ↔ Drag photo to reposition
        </div>
      )}
    </div>
  )
}
