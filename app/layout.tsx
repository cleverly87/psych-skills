import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Psych-Skills - Sports Psychology for Golfers | Achieve Peak Performance',
    template: '%s | Psych-Skills'
  },
  description: 'Expert golf sports psychology services by Dr. Denise Hill. One-on-one coaching, group workshops, and performance support to help golfers reach their peak potential.',
  keywords: ['sports psychology', 'golf psychology', 'golf coaching', 'mental game', 'performance psychology', 'sports psychologist UK', 'golf performance', 'Swansea', 'Wales'],
  authors: [{ name: 'Dr. Denise Hill' }],
  creator: 'Psych-Skills',
  publisher: 'Psych-Skills',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'Psych-Skills - Sports Psychology for Golfers',
    description: 'Expert golf sports psychology services to help you achieve peak performance',
    siteName: 'Psych-Skills',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psych-Skills - Sports Psychology for Golfers',
    description: 'Expert golf sports psychology services to help you achieve peak performance',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
