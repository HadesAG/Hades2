import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PrivyWrapper } from '@/components/privy-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://hades.ag'),
  title: {
    default: "Hades.AG - Elite Crypto Intelligence Platform | Track Whale Moves & Alpha Signals",
    template: "%s | Hades.AG"
  },
  description: "🔥 EXCLUSIVE ACCESS: Track whale portfolios, get instant alpha signals, and follow smart money before the crowd. Real-time Solana intelligence that turns darkness into profits. Join the elite.",
  keywords: [
    "crypto intelligence",
    "whale tracking",
    "solana signals",
    "alpha signals", 
    "smart money",
    "trading signals",
    "cryptocurrency analysis",
    "defi intelligence",
    "solana trading",
    "whale portfolio tracker",
    "crypto data aggregator",
    "blockchain analytics"
  ],
  authors: [{ name: "Hades.AG Team" }],
  creator: "Hades.AG",
  publisher: "Hades.AG",
  applicationName: "Hades.AG",
  generator: "Next.js",
  category: "Finance",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hades.ag",
    siteName: "Hades.AG",
    title: "Hades.AG - Elite Crypto Intelligence Platform | Track Whale Moves & Alpha Signals",
    description: "🔥 EXCLUSIVE ACCESS: Track whale portfolios, get instant alpha signals, and follow smart money before the crowd. Real-time Solana intelligence that turns darkness into profits.",
    images: [
      {
        url: "https://wzqnoowkjahivajh.public.blob.vercel-storage.com/h2/hadeslogo2.png",
        width: 1200,
        height: 630,
        alt: "Hades.AG - Elite Crypto Intelligence Platform",
        type: "image/png"
      },
      {
        url: "https://wzqnoowkjahivajh.public.blob.vercel-storage.com/h2/hadeslogo2.png",
        width: 800,
        height: 600,
        alt: "Hades.AG Logo",
        type: "image/png"
      }
    ]
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    site: "@HadesAG",
    creator: "@HadesAG", 
    title: "Hades.AG - Elite Crypto Intelligence Platform",
    description: "🔥 EXCLUSIVE: Track whale moves, get alpha signals before the crowd. Real-time Solana intelligence that turns darkness into profits. Join the elite.",
    images: [
      {
        url: "https://wzqnoowkjahivajh.public.blob.vercel-storage.com/h2/hadeslogo2.png",
        alt: "Hades.AG - Elite Crypto Intelligence Platform"
      }
    ]
  },
  
  // Icons and favicons
  icons: {
    icon: [
      {
        url: "https://wzqnoowkjahivajh.public.blob.vercel-storage.com/h2/hadeslogo2.png",
        sizes: "32x32",
        type: "image/png"
      },
      {
        url: "https://wzqnoowkjahivajh.public.blob.vercel-storage.com/h2/hadeslogo2.png", 
        sizes: "16x16",
        type: "image/png"
      }
    ],
    apple: [
      {
        url: "https://wzqnoowkjahivajh.public.blob.vercel-storage.com/h2/hadeslogo2.png",
        sizes: "180x180",
        type: "image/png"
      }
    ],
    shortcut: [
      {
        url: "https://wzqnoowkjahivajh.public.blob.vercel-storage.com/h2/hadeslogo2.png",
        type: "image/png"
      }
    ]
  },
  
  // Manifest
  manifest: "/manifest.json",
  
  // Additional metadata
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
  
  // Verification (add your verification codes when available)
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  
  // Additional tags
  other: {
    'theme-color': '#000000',
    'color-scheme': 'dark',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Hades.AG',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#000000',
    'msapplication-TileImage': 'https://wzqnoowkjahivajh.public.blob.vercel-storage.com/h2/hadeslogo2.png',
    'msapplication-config': '/browserconfig.xml',
    // Performance optimizations
    'dns-prefetch': '//api.coingecko.com,//quote-api.jup.ag,//api.helius.xyz',
    'preconnect': '//api.coingecko.com,//quote-api.jup.ag,//api.helius.xyz',
    'resource-hints': '//api.coingecko.com,//quote-api.jup.ag,//api.helius.xyz'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Performance Resource Hints */}
        <link rel="dns-prefetch" href="//api.coingecko.com" />
        <link rel="dns-prefetch" href="//quote-api.jup.ag" />
        <link rel="dns-prefetch" href="//api.helius.xyz" />
        <link rel="preconnect" href="//api.coingecko.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="//quote-api.jup.ag" crossOrigin="anonymous" />
        <link rel="preconnect" href="//api.helius.xyz" crossOrigin="anonymous" />
        <link rel="preload" href="/hades-logo.png" as="image" type="image/png" />
        <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
      </head>
      <body className={`${inter.className} font-body antialiased`}>
        <PrivyWrapper>
          {children}
        </PrivyWrapper>
      </body>
    </html>
  )
}