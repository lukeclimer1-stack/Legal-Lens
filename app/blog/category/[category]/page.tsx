import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllCategories, getArticlesByCategorySlug } from '@/lib/categories'
import ArticleCard from '@/components/ArticleCard'
import ScrollReveal from '@/components/ScrollReveal'

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((c) => ({ category: c.slug }))
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const result = await getArticlesByCategorySlug(params.category)
  if (!result) notFound()
  const { name, articles } = result

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '50px 28px' }} className="blog-container pagein">
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
          marginBottom: '10px',
        }}
      >
        Category
      </p>
      <h1
        style={{
          fontSize: '40px',
          color: '#11203b',
          fontFamily: '"Times New Roman", Times, serif',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '0 0 44px 0',
        }}
      >
        {name}
      </h1>

      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: '38px', columnGap: '36px' }}
        className="blog-grid"
      >
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} showExcerpt />
        ))}
      </div>

      <ScrollReveal />

      <style>{`
        @media (max-width: 768px) {
          .blog-container { padding: 30px 16px !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
