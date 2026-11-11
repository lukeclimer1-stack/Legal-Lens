import { getArticles, getArticleBySlug } from '@/lib/articles'
import { formatCategory, cropPosition, formatDate, splitCategories } from '@/lib/format'
import { getGlossary, annotateGlossaryTerms } from '@/lib/glossary'
import { SITE_NAME, absoluteUrl } from '@/lib/site'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReadingProgress from '@/components/ReadingProgress'
import GlossaryPopover from '@/components/GlossaryPopover'

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

// Gives every article its own title, description and share card (the preview
// box that appears when the link is pasted into a text, Instagram, LinkedIn, etc.).
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  if (!article) return {}
  const url = `/blog/${article.slug}`
  const images = article.image ? [{ url: article.image, alt: article.title }] : undefined
  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      title: article.title,
      description: article.excerpt,
      url,
      publishedTime: article.date,
      authors: [article.author],
      tags: splitCategories(article.category),
      images,
    },
    twitter: {
      card: article.image ? 'summary_large_image' : 'summary',
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()

  const glossary = await getGlossary()
  const body = annotateGlossaryTerms(article.body, glossary)
  const currentAsOf = article.currentAsOf || article.date

  // Structured data that tells search engines this page is an article, who wrote it, and when.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: currentAsOf,
    author: { '@type': 'Person', name: article.author },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
    mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`),
    ...(article.image ? { image: [absoluteUrl(article.image)] } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ReadingProgress />
      <GlossaryPopover />
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
          By {article.author} · {formatDate(article.date)}
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
              style={{ objectFit: article.imageFit || 'cover', objectPosition: cropPosition(article.imageCrop) }}
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

        {article.updateNote && (
          <div
            style={{
              border: '1px solid #b08a42',
              borderLeft: '4px solid #b08a42',
              background: '#fffdf8',
              padding: '14px 18px',
              marginBottom: '28px',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#2a3142',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#8a6a2c',
                marginBottom: '4px',
              }}
            >
              Update · {formatDate(currentAsOf)}
            </span>
            {article.updateNote}
          </div>
        )}

        {/* Article body — pull quotes are embedded inline in the body HTML itself.
            Glossary terms are made tappable here at build time; the stored article text is untouched. */}
        <div
          className="article-body drop-cap"
          style={{
            fontSize: '18px',
            lineHeight: 1.85,
            color: '#2a3142',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
          dangerouslySetInnerHTML={{ __html: body }}
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
          <span
            style={{
              display: 'block',
              marginTop: '10px',
              fontStyle: 'normal',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#6f7d96',
            }}
          >
            Information current as of {formatDate(currentAsOf)}
          </span>
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
