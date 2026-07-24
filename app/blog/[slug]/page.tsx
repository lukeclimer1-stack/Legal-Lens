import { getArticles, getArticleBySlug } from '@/lib/articles'
import { formatCategory, cropPosition } from '@/lib/format'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReadingProgress from '@/components/ReadingProgress'

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()

  return (
    <>
      <ReadingProgress />
      <div
        style={{ maxWidth: '760px', margin: '0 auto', padding: '50px 28px' }}
        className="article-container pagein"
      >
        <Link
          href="/blog"
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '11px',
            letterSpacing: '2px',
            color: '#b08a42',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '26px',
          }}
        >
          ← Back to the blog
        </Link>

        <p
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '11px',
            letterSpacing: '2px',
            color: '#b08a42',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '14px',
          }}
        >
          {formatCategory(article.category)}
        </p>

        <h1
          style={{
            fontSize: '40px',
            lineHeight: 1.18,
            color: '#11203b',
            fontFamily: '"Times New Roman", Times, serif',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '0 0 16px 0',
          }}
        >
          {article.title}
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: '#5a6172',
            fontStyle: 'italic',
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          By {article.author} · {article.date}
        </p>

        {/* Hero image */}
        <div
          style={{
            height: '360px',
            border: '1px solid #d8cfb9',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '32px',
            backgroundColor: '#e8e2d4',
          }}
        >
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
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
                fontSize: '12px',
                color: '#5a6172',
              }}
            >
              [ article image ]
            </div>
          )}
        </div>

        {/* Article body — pull quotes are embedded inline in the body HTML itself */}
        <div
          className="article-body drop-cap"
          style={{
            fontSize: '18px',
            lineHeight: 1.85,
            color: '#2a3142',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
          dangerouslySetInnerHTML={{ __html: article.body }}
        />

        {/* Footer line */}
        <div
          style={{
            borderTop: '1px solid #dcd3bf',
            marginTop: '36px',
            paddingTop: '22px',
            fontSize: '15px',
            color: '#5a6172',
            fontStyle: 'italic',
          }}
        >
          Written by {article.author} for Legal Lens.
        </div>

        <style>{`
          @media (max-width: 768px) {
            .article-container { padding: 30px 16px !important; }
          }
        `}</style>
      </div>
    </>
  )
}
