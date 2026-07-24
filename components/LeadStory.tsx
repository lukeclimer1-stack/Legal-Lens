'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/lib/articles'
import { formatCategory, cropPosition } from '@/lib/format'

export default function LeadStory({ article }: { article: Article }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const glassRef = useRef<HTMLDivElement>(null)
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null)

  const crop = article.imageCrop
  const px = crop && crop.x != null ? crop.x : 50
  const py = crop && crop.y != null ? crop.y : 50

  useEffect(() => {
    if (!article.image) return
    setNatural(null)
    const img = new window.Image()
    img.onload = () => setNatural({ w: img.naturalWidth, h: img.naturalHeight })
    img.src = article.image
  }, [article.image])

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = boxRef.current
    const glass = glassRef.current
    if (!box || !glass || !natural || !natural.w || !natural.h) return
    const r = box.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const s = Math.max(r.width / natural.w, r.height / natural.h)
    const bw = natural.w * s
    const bh = natural.h * s
    const offX = (r.width - bw) * px / 100
    const offY = (r.height - bh) * py / 100
    const Z = 1.8
    const D = 150
    glass.style.display = 'block'
    glass.style.left = x - D / 2 + 'px'
    glass.style.top = y - D / 2 + 'px'
    glass.style.backgroundSize = bw * Z + 'px ' + bh * Z + 'px'
    glass.style.backgroundPosition = -((x - offX) * Z - D / 2) + 'px ' + -((y - offY) * Z - D / 2) + 'px'
  }

  function onMouseLeave() {
    if (glassRef.current) glassRef.current.style.display = 'none'
  }

  return (
    <div style={{ borderBottom: '1px solid #dcd3bf', paddingBottom: '40px', marginBottom: '40px' }}>
      <Link
        href={`/blog/${article.slug}`}
        style={{ textDecoration: 'none', display: 'block' }}
        className="lead-card"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: '42px',
            alignItems: 'start',
          }}
          className="lead-grid"
        >
          {/* Left */}
          <div>
            <p
              style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '11px',
                letterSpacing: '2px',
                color: '#b08a42',
                textTransform: 'uppercase',
                margin: '0 0 12px 0',
              }}
            >
              Lead · {formatCategory(article.category)}
            </p>
            <h2
              style={{
                fontSize: '38px',
                lineHeight: 1.18,
                color: '#11203b',
                fontFamily: '"Times New Roman", Times, serif',
                fontWeight: 'bold',
                margin: '0 0 16px 0',
              }}
              className="lead-title"
            >
              {article.title}
            </h2>
            <p
              style={{
                fontSize: '17px',
                lineHeight: 1.65,
                color: '#3a4254',
                margin: '0 0 16px 0',
              }}
            >
              {article.excerpt}
            </p>
            <p
              style={{
                fontSize: '14px',
                color: '#5a6172',
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              By {article.author} · {article.date}
            </p>
          </div>

          {/* Right — image */}
          <div
            ref={boxRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{
              height: '300px',
              backgroundColor: '#e8e2d4',
              border: '1px solid #d8cfb9',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {article.image && (
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="zoomimg"
                style={{ objectFit: 'cover', objectPosition: cropPosition(article.imageCrop) }}
                unoptimized
              />
            )}
            <div
              ref={glassRef}
              style={{
                display: 'none',
                position: 'absolute',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                border: '2px solid #b08a42',
                boxShadow: '0 10px 30px rgba(17,32,59,.35), inset 0 0 0 6px rgba(250,247,240,.25)',
                backgroundImage: article.image ? `url("${article.image}")` : 'none',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#e8e2d4',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: '10px',
                bottom: '8px',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '9px',
                letterSpacing: '2px',
                color: 'rgba(250,247,240,.85)',
                textShadow: '0 1px 3px rgba(17,32,59,.7)',
                textTransform: 'uppercase',
                pointerEvents: 'none',
              }}
            >
              ⌕ Through the lens
            </div>
          </div>
        </div>
      </Link>
      <style>{`
        .lead-card { transition: transform 150ms ease; }
        .lead-card:hover { transform: translateY(-3px); }
        .lead-card:hover .lead-title { color: #b08a42; }
        @media (max-width: 768px) {
          .lead-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
