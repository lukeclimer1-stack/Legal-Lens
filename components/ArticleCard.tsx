import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/articles'

interface Props {
  article: Article
  showExcerpt?: boolean
}

export default function ArticleCard({ article, showExcerpt = false }: Props) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
      className="article-card"
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
            style={{ objectFit: 'cover' }}
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
        {article.category}
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
        .article-card:hover { transform: translateY(-3px); }
        .article-card:hover .card-title { color: #b08a42; }
      `}</style>
    </Link>
  )
}
