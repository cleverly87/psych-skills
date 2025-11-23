import Script from 'next/script'

interface Person {
  '@type': 'Person'
  name: string
  jobTitle: string
  description: string
  url: string
  email: string
  telephone?: string
  address: {
    '@type': 'PostalAddress'
    addressLocality: string
    addressRegion: string
    addressCountry: string
  }
  alumniOf?: {
    '@type': 'Organization'
    name: string
  }
  knowsAbout: string[]
}

interface Organization {
  '@context': 'https://schema.org'
  '@type': 'LocalBusiness'
  name: string
  description: string
  url: string
  logo: string
  image: string
  telephone?: string
  email: string
  address: {
    '@type': 'PostalAddress'
    addressLocality: string
    addressRegion: string
    addressCountry: string
  }
  geo?: {
    '@type': 'GeoCoordinates'
    latitude: number
    longitude: number
  }
  priceRange: string
  areaServed: string[]
  serviceType: string[]
  founder: Person
  sameAs?: string[]
}

interface Service {
  '@context': 'https://schema.org'
  '@type': 'Service'
  serviceType: string
  provider: {
    '@type': 'LocalBusiness'
    name: string
  }
  areaServed: {
    '@type': 'Country'
    name: string
  }
  description: string
  offers?: {
    '@type': 'Offer'
    price?: string
    priceCurrency?: string
  }
}

interface StructuredDataProps {
  type: 'organization' | 'person' | 'service' | 'article'
  data?: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://psych-skills.com'

  const personData: Person = {
    '@type': 'Person',
    name: 'Dr. Denise Hill',
    jobTitle: 'Sports Psychologist',
    description: 'Elite sports psychologist specializing in golf psychology and mental performance coaching. Over 25 years of experience working with professional and amateur athletes.',
    url: `${baseUrl}/about`,
    email: 'info@psych-skills.co.uk',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Swansea',
      addressRegion: 'Wales',
      addressCountry: 'GB',
    },
    knowsAbout: [
      'Sports Psychology',
      'Golf Psychology',
      'Performance Psychology',
      'Mental Performance Coaching',
      'Elite Sports Performance',
      'Mental Skills Training',
      'CASES-SEPAR Accreditation',
      'Sports Supervision',
    ],
  }

  const organizationData: Organization = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Psych-Skills',
    description: 'Elite sports psychology services specializing in golf and mental performance coaching. Led by Dr. Denise Hill with over 25 years of experience in high-performance sport.',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/images/Denise.jpg`,
    email: 'info@psych-skills.co.uk',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Swansea',
      addressRegion: 'Wales',
      addressCountry: 'GB',
    },
    priceRange: '££-£££',
    areaServed: ['United Kingdom', 'Wales', 'England', 'Scotland', 'Northern Ireland'],
    serviceType: [
      'Sports Psychology',
      'Golf Psychology',
      'Performance Psychology',
      'One-to-One Coaching',
      'Group Workshops',
      'Mental Performance Training',
      'Sports Supervision',
    ],
    founder: personData,
  }

  const serviceData: Service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Sports Psychology Coaching',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Psych-Skills',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    description: 'Professional sports psychology services including one-to-one coaching, group workshops, and performance support for athletes across all sports.',
  }

  let jsonLd = {}

  switch (type) {
    case 'organization':
      jsonLd = organizationData
      break
    case 'person':
      jsonLd = personData
      break
    case 'service':
      jsonLd = serviceData
      break
    case 'article':
      jsonLd = data || {}
      break
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
