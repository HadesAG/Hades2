import type { Metadata } from 'next'
import { SparklesText } from "@/components/ui/sparkles-text"
import { GlowBorder } from "@/components/ui/glow-border"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | Hades.AG",
  description: "Read the terms and conditions for using Hades.AG. Our terms of service outline the rules, rights, and responsibilities for accessing our elite crypto intelligence platform.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "crypto terms",
    "Hades.AG terms",
    "user agreement",
    "platform terms",
    "cryptocurrency terms"
  ],
  openGraph: {
    title: "Terms of Service | Hades.AG",
    description: "Read the terms and conditions for using Hades.AG. Our terms of service outline the rules, rights, and responsibilities for accessing our platform.",
    url: "https://hades.ag/terms",
    siteName: "Hades.AG",
    type: "website",
    images: [
      {
        url: "https://wzqnoowkjahivajh.public.blob.vercel-storage.com/h2/hadeslogo2.png",
        width: 1200,
        height: 630,
        alt: "Hades.AG Terms of Service",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Hades.AG",
    description: "Read the terms and conditions for using Hades.AG. Our terms of service outline the rules, rights, and responsibilities for accessing our platform.",
    images: [
      {
        url: "https://wzqnoowkjahivajh.public.blob.vercel-storage.com/h2/hadeslogo2.png",
        alt: "Hades.AG Terms of Service"
      }
    ]
  }
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <SparklesText text="Terms of Service" className="text-4xl font-bold text-center mb-4" />
          <p className="text-gray-400 text-center">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <GlowBorder className="p-8 mb-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-red-500 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-300">
                By accessing and using Hades.ag, you accept and agree to be bound by the terms and provision of this
                agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-red-500 mb-4">Service Description</h2>
              <p className="text-gray-300">
                Hades.ag provides cryptocurrency trading intelligence, whale tracking, and market analysis tools. Our
                services are for informational purposes only and do not constitute financial advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-red-500 mb-4">User Responsibilities</h2>
              <div className="space-y-4 text-gray-300">
                <p>You agree to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Use the service in compliance with all applicable laws</li>
                  <li>Not attempt to gain unauthorized access to our systems</li>
                  <li>Not use the service for any illegal or unauthorized purpose</li>
                  <li>Maintain the security of your wallet and account credentials</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-red-500 mb-4">Disclaimer</h2>
              <p className="text-gray-300">
                Cryptocurrency trading involves substantial risk. Past performance is not indicative of future results.
                You should carefully consider whether trading is suitable for you in light of your circumstances,
                knowledge, and financial resources.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-red-500 mb-4">Contact Information</h2>
              <p className="text-gray-300">
                For questions about these Terms of Service, contact us at{" "}
                <a href="mailto:legal@hades.ag" className="text-red-400 hover:text-red-300">
                  legal@hades.ag
                </a>
              </p>
            </section>
          </div>
        </GlowBorder>

        <div className="text-center">
          <Link href="/">
            <InteractiveHoverButton>Back to Home</InteractiveHoverButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
