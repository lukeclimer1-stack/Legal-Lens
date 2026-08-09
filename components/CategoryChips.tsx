import Link from 'next/link'
import { getAllCategories } from '@/lib/categories'

export default async function CategoryChips() {
  const categories = await getAllCategories()
  if (!categories.length) return null

  return (
    <div
      style={{
        borderTop: '1px solid #dcd3bf',
        marginTop: '56px',
        paddingTop: '40px',
      }}
      className="reveal"
    >
      <p
        style={{
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '12px',
          letterSpacing: '3px',
          color: '#11203b',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '22px',
        }}
      >
        Browse by Category
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/blog/category/${cat.slug}`}
            className="btn-lift category-chip"
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '11px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#11203b',
              border: '1px solid #dcd3bf',
              backgroundColor: '#fff',
              padding: '9px 16px',
              borderRadius: '2px',
              textDecoration: 'none',
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>
      <style>{`
        .category-chip:hover { color: #b08a42 !important; border-color: #b08a42 !important; }
      `}</style>
    </div>
  )
}
