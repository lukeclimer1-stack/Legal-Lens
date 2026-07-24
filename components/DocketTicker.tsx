import Link from 'next/link'
import { getArticles } from '@/lib/articles'
import { formatCategory } from '@/lib/format'

export default async function DocketTicker() {
  const articles = await getArticles()
  const items = articles.map((a) => ({
    slug: a.slug,
    label: (formatCategory(a.category) ? formatCategory(a.category) + ' — ' : '') + a.title,
  }))
  const looped = items.concat(items)

  return (
    <div
      className="tickwrap"
      style={{ background: '#11203b', display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}
    >
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          background: '#b08a42',
          color: '#0d1a30',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '10px',
          letterSpacing: '2px',
          padding: '0 16px',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 2,
        }}
      >
        On the Docket
      </div>
      <div style={{ overflow: 'hidden', flex: 1, display: 'flex', alignItems: 'center' }}>
        <div
          className="tick"
          style={{ display: 'flex', width: 'max-content', animation: 'll-ticker 55s linear infinite' }}
        >
          {looped.map((item, i) => (
            <Link
              key={i}
              href={`/blog/${item.slug}`}
              style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '11px',
                letterSpacing: '1px',
                color: '#c3c8d2',
                padding: '9px 0',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}&nbsp;&nbsp;<span style={{ color: '#c9a44e' }}>§</span>&nbsp;&nbsp;
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
