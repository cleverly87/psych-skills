import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StructuredData } from '@/components/seo/structured-data'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Dr Denise Hill - Elite Sports Psychologist | Golf Psychology Expert | Psych-Skills',
    template: '%s | Dr Denise Hill - Psych-Skills'
  },
  description: 'Dr Denise Hill - Elite sports psychologist with 25+ years experience in golf psychology and mental performance coaching. CASES-SEPAR accredited. Proven strategies for athletes across all sports. Based in Swansea, Wales, serving UK-wide.',
  keywords: [
    'Dr Denise Hill',
    'Dr. Denise Hill sports psychologist',
    'Denise Hill golf psychology',
    'sports psychologist',
    'golf psychologist',
    'elite sports psychology',
    'golf psychology UK',
    'golf psychology Wales',
    'sports psychology Swansea',
    'performance psychologist',
    'mental performance coach',
    'golf mental game',
    'sports psychology coaching',
    'CASES-SEPAR psychologist',
    'golf psychology expert',
    'elite golf psychology',
    'professional sports psychologist UK',
    'mental skills training',
    'sports performance psychology',
    'golf coaching psychology',
  ],
  authors: [{ name: 'Dr. Denise Hill' }],
  creator: 'Dr. Denise Hill',
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
    title: 'Dr Denise Hill - Elite Sports Psychologist | Golf Psychology Expert',
    description: 'Elite sports psychology by Dr Denise Hill. 25+ years experience in golf psychology and mental performance. CASES-SEPAR accredited. Serving athletes across the UK.',
    siteName: 'Psych-Skills - Dr Denise Hill',
    images: [{
      url: '/images/Denise.jpg',
      width: 1200,
      height: 630,
      alt: 'Dr Denise Hill - Sports Psychologist',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr Denise Hill - Elite Sports Psychologist | Golf Psychology Expert',
    description: 'Elite sports psychology with 25+ years experience. Golf psychology expert. CASES-SEPAR accredited. Mental performance coaching for all athletes.',
    images: ['/images/Denise.jpg'],
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
      <head>
        <StructuredData type="organization" />
        <StructuredData type="person" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
