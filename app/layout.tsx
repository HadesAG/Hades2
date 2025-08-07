import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PrivyWrapper } from '@/components/privy-wrapper'
import { SessionStatus } from '@/components/auth/session-status'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HADES - Cross-Chain Intelligence Layer',
  description: 'Hunt alpha before it hits social. HADES scans across Solana, Base, and all major chains to surface early signals and intelligence before they reach social media.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} font-body antialiased`}>
        <PrivyWrapper>
          {children}
          <SessionStatus />
        </PrivyWrapper>
      </body>
    </html>
  )
}