import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://earthprotect.org'
const OG_IMAGE = `${BASE_URL}/logo.svg`

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Earth Protect | Protecting African Wildlife',
    template: '%s — Earth Protect',
  },
  description:
    'Support conservation of wild animals and environments across Africa. Adopt an animal, donate to protect habitats, or join our global community of conservationists.',
  keywords: ['Africa', 'wildlife conservation', 'donate', 'adopt animal', 'environment', 'endangered species'],
  openGraph: {
    siteName: 'Earth Protect',
    title: 'Earth Protect | Protecting African Wildlife',
    description: "Every donation saves a life. Protect Africa's wild heart.",
    type: 'website',
    url: BASE_URL,
    images: [{ url: OG_IMAGE, width: 800, height: 500, alt: 'Earth Protect — African Wildlife Conservation' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Earth Protect | Protecting African Wildlife',
    description: "Every donation saves a life. Protect Africa's wild heart.",
    images: [OG_IMAGE],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
