import type { Metadata } from 'next'
import './globals.css'
import Masthead from '@/components/Masthead'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DocketTicker from '@/components/DocketTicker'
import { SiteAuthProvider } from '@/components/SiteAuthProvider'

export const metadata: Metadata = {
  title: 'Legal Lens',
  description: 'Clear, accessible, and inclusive analysis of the law.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SiteAuthProvider>
          <Masthead />
          <Nav />
          <DocketTicker />
          <main>{children}</main>
          <Footer />
        </SiteAuthProvider>
      </body>
    </html>
  )
}
