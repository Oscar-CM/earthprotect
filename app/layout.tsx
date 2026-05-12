import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter, Lora } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Earth Protect | Protecting African Wildlife',
    template: '%s — Earth Protect',
  },
  description:
    'Support conservation of wild animals and environments across Africa. Adopt an animal, donate to protect habitats, or join our global community of conservationists.',
  keywords: ['Africa', 'wildlife conservation', 'donate', 'adopt animal', 'environment', 'endangered species'],
  openGraph: {
    title: 'Earth Protect | Protecting African Wildlife',
    description: 'Every donation saves a life. Protect Africa\'s wild heart.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
