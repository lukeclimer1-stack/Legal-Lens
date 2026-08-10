import { getArticles } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'
import ScrollReveal from '@/components/ScrollReveal'
import CategoryChips from '@/components/CategoryChips'

export default async function BlogPage() {
  const articles = await getArticles()

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '50px 28px' }} className="blog-container pagein">
      <h1
        style={{
          fontSize: '40px',
          color: '#11203b',
          fontFamily: '"Times New Roman", Times, serif',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '0 0 10px 0',
        }}
      >
        The Blog
      </h1>
      <p
        style={{
          fontStyle: 'italic',
          fontSize: '16px',
          color: '#5a6172',
          textAlign: 'center',
          marginBottom: '44px',
        }}
      >
        Analysis of cases, policy, and the questions that shape the law.
      </p>

      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: '38px', columnGap: '36px' }}
        className="blog-grid"
      >
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} showExcerpt />
        ))}
      </div>

      <CategoryChips />

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
