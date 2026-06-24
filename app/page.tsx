import { getArticles } from '@/lib/articles'
import LeadStory from '@/components/LeadStory'
import ArticleCard from '@/components/ArticleCard'
import MissionStrip from '@/components/MissionStrip'
import ApplyCTA from '@/components/ApplyCTA'
import Link from 'next/link'

export default async function HomePage() {
  const articles = await getArticles()
  const lead = articles[0]
  const recent = articles.slice(1, 3)

  return (
    <>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '44px 28px' }} className="home-container">
        {lead && <LeadStory article={lead} />}

        {/* Recent Writing */}
        <div>
          <p
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '12px',
              letterSpacing: '3px',
              color: '#11203b',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            Recent Writing
          </p>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px' }}
            className="recent-grid"
          >
            {recent.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link
              href="/blog"
              style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '12px',
                letterSpacing: '2px',
                color: '#b08a42',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Read the full blog →
            </Link>
          </div>
        </div>
      </div>

      <MissionStrip />
      <ApplyCTA />

      <style>{`
        @media (max-width: 768px) {
          .home-container { padding: 24px 16px !important; }
          .recent-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
