"use client"

import { SparklesText } from "@/components/ui/sparkles-text"
import { GlowBorder } from "@/components/ui/glow-border"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <SparklesText text="Privacy Policy" className="text-4xl font-bold text-center mb-4" />
          <p className="text-gray-400 text-center">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <GlowBorder className="p-8 mb-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-red-500 mb-4">Information We Collect</h2>
              <div className="space-y-4 text-gray-300">
                <p>We collect information you provide directly to us, such as when you:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Create an account or connect your Solana wallet</li>
                  <li>Use our trading intelligence services</li>
                  <li>Contact us for support</li>
                  <li>Subscribe to our alerts and notifications</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-red-500 mb-4">How We Use Your Information</h2>
              <div className="space-y-4 text-gray-300">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide and maintain our services</li>
                  <li>Send you trading alerts and market intelligence</li>
                  <li>Improve our platform and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-red-500 mb-4">Data Security</h2>
              <p className="text-gray-300">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. Your wallet connections are secured using
                industry-standard encryption.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-red-500 mb-4">Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@hades.ag" className="text-red-400 hover:text-red-300">
                  privacy@hades.ag
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
