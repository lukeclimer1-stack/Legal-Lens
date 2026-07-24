import type { Metadata } from 'next'
import './globals.css'
import Masthead from '@/components/Masthead'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DocketTicker from '@/components/DocketTicker'

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
        <Masthead />
        <Nav />
        <DocketTicker />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
