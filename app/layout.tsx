import type { Metadata } from 'next'
import './globals.css'
import Masthead from '@/components/Masthead'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DocketTicker from '@/components/DocketTicker'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Each page sets its own title, shown as "Page Title | Legal Lens" in browser tabs and search results.
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: '/',
  },
  twitter: { card: 'summary', title: SITE_NAME, description: SITE_DESCRIPTION },
  alternates: {
    types: { 'application/rss+xml': [{ url: '/feed.xml', title: `${SITE_NAME} articles` }] },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Masthead />
        <Nav />
        <DocketTicker />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
