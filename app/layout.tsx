import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://earthprotect.org'
const OG_IMAGE = `${BASE_URL}/og-image.png`

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Earth Protect | Protecting African Wildlife',
    template: '%s — Earth Protect',
  },
  description:
    'Support conservation of wild animals and environments across Africa. Adopt an animal, donate to protect habitats, or join our global community of conservationists.',
  keywords: [
    'Africa wildlife conservation', 'adopt an animal Africa', 'donate wildlife',
    'endangered species Africa', 'elephant conservation', 'gorilla protection',
    'rhino conservation', 'wildlife charity', 'African conservation organisation',
  ],
  authors: [{ name: 'Earth Protect' }],
  creator: 'Earth Protect',
  publisher: 'Earth Protect',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: BASE_URL },
  openGraph: {
    siteName: 'Earth Protect',
    title: 'Earth Protect | Protecting African Wildlife',
    description: "Every donation saves a life. Protect Africa's wild heart.",
    type: 'website',
    url: BASE_URL,
    locale: 'en_US',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Earth Protect — African Wildlife Conservation' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@earthprotect',
    creator: '@earthprotect',
    title: 'Earth Protect | Protecting African Wildlife',
    description: "Every donation saves a life. Protect Africa's wild heart.",
    images: [OG_IMAGE],
  },
  verification: {
    // Add your Google Search Console verification token here when you have it
    // google: 'your-verification-token',
  },
  category: 'charity',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Earth Protect',
  description: 'Non-profit organisation dedicated to protecting African wildlife and natural environments through conservation, education, and community engagement.',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.svg`,
  image: OG_IMAGE,
  sameAs: [
    'https://twitter.com/earthprotect',
    'https://www.facebook.com/earthprotect',
    'https://www.instagram.com/earthprotect',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'info@earthprotect.org',
  },
  areaServed: 'Africa',
  knowsAbout: ['Wildlife Conservation', 'African Ecosystems', 'Endangered Species', 'Environmental Protection'],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
