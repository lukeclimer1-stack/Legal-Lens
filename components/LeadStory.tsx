import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/articles'

export default function LeadStory({ article }: { article: Article }) {
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
              Lead · {article.category}
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
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            )}
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
