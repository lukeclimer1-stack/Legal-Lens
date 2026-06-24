'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/writers', label: 'Writers' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        borderTop: '1px solid #11203b',
        backgroundColor: '#faf7f0',
      }}
    >
      <div
        style={{
          maxWidth: '1080px',
          margin: '0 auto',
          padding: '0 28px',
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
        }}
        className="nav-inner"
      >
        {links.map(({ href, label }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'block',
                position: 'relative',
                padding: '14px 4px',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '17px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: isActive ? '#b08a42' : '#11203b',
                textDecoration: 'none',
                transition: 'color 150ms ease',
              }}
              className="nav-link"
            >
              {label}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: '#b08a42',
                  }}
                />
              )}
            </Link>
          )
        })}
      </div>
      <style>{`
        .nav-link:hover { color: #b08a42 !important; }
        @media (max-width: 768px) {
          .nav-inner { gap: 20px !important; padding: 0 16px !important; flex-wrap: wrap; }
          .nav-link { font-size: 13px !important; padding: 10px 2px !important; }
        }
      `}</style>
    </nav>
  )
}
