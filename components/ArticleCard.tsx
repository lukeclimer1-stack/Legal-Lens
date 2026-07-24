'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/lib/articles'
import { formatCategory, cropPosition } from '@/lib/format'

interface Props {
  article: Article
  showExcerpt?: boolean
  reveal?: boolean
}

export default function ArticleCard({ article, showExcerpt = false, reveal = true }: Props) {
  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg) translateY(-3px)`
  }
  function onMouseLeave(e: React.MouseEvent<HTMLAnchorElement>) {
    e.currentTarget.style.transform = ''
  }

  return (
    <Link
      href={`/blog/${article.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
      className={`article-card${reveal ? ' reveal' : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Image area */}
      <div
        style={{
          height: '180px',
          backgroundColor: '#e8e2d4',
          border: '1px solid #d8cfb9',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '14px',
        }}
      >
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="zoomimg"
            style={{ objectFit: 'cover', objectPosition: cropPosition(article.imageCrop) }}
            unoptimized
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '11px',
              color: '#5a6172',
            }}
          >
            [ article image ]
          </div>
        )}
      </div>

      <p
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '10px',
          letterSpacing: '2px',
          color: '#b08a42',
          textTransform: 'uppercase',
          margin: '0 0 6px 0',
        }}
      >
        {formatCategory(article.category)}
      </p>
      <h3
        style={{
          fontSize: '21px',
          lineHeight: 1.26,
          color: '#11203b',
          fontFamily: '"Times New Roman", Times, serif',
          fontWeight: 'bold',
          margin: '0 0 8px 0',
        }}
        className="card-title"
      >
        {article.title}
      </h3>
      {showExcerpt && (
        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.55,
            color: '#5a6172',
            margin: '0 0 8px 0',
          }}
        >
          {article.excerpt}
        </p>
      )}
      <p
        style={{
          fontSize: '13px',
          color: '#5a6172',
          fontStyle: 'italic',
          margin: 0,
        }}
      >
        By {article.author} · {article.date}
      </p>
      <style>{`
        .article-card { transition: transform 150ms ease; }
        .article-card:hover .card-title { color: #b08a42; }
      `}</style>
    </Link>
  )
}
