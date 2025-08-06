/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['react-icons']
  },
  env: {
    CUSTOM_KEY: 'hades-roadmap'
  },
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hades-red': {
          50: '#fef2f2',
          100: '#fee2e2', 
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        'hades-orange': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        'hades-yellow': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'pulse-glow': {
          '0%': {
            'box-shadow': '0 0 5px #ef4444, 0 0 10px #ef4444, 0 0 15px #ef4444'
          },
          '100%': {
            'box-shadow': '0 0 10px #ef4444, 0 0 20px #ef4444, 0 0 30px #ef4444'
          }
        }
      }
    },
  },
  plugins: [],
}

export default config

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

src/app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HADES Intelligence Platform - Roadmap',
  description: 'The Cross-Chain Aggregator of On-Chain Intelligence. Built to route attention. Forged to hunt alpha.',
  keywords: ['HADES', 'blockchain', 'intelligence', 'crypto', 'defi', 'solana', 'roadmap'],
  authors: [{ name: 'HADES Intelligence Platform' }],
  creator: 'HADES Intelligence Platform',
  publisher: 'HADES Intelligence Platform',
  openGraph: {
    title: 'HADES Intelligence Platform - Roadmap',
    description: 'The Cross-Chain Aggregator of On-Chain Intelligence',
    url: 'https://hades-roadmap.vercel.app',
    siteName: 'HADES Intelligence Platform',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HADES Intelligence Platform - Roadmap',
    description: 'The Cross-Chain Aggregator of On-Chain Intelligence',
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
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

src/app/globals.css

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-black text-white min-h-screen;
  }
}

@layer components {
  .gradient-text {
    @apply bg-gradient-to-r from-orange-400 via-red-500 to-yellow-600 bg-clip-text text-transparent;
  }
  
  .underworld-glow {
    text-shadow: 0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3), 0 0 30px rgba(239, 68, 68, 0.1);
  }
  
  .ember-border {
    border: 1px solid rgba(239, 68, 68, 0.3);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.1);
  }
  
  .phase-indicator {
    @apply w-4 h-4 rounded-full relative z-10;
    box-shadow: 0 0 10px currentColor;
  }
  
  .timeline-line {
    @apply absolute left-2 top-6 bottom-0 w-px bg-gradient-to-b from-red-900/40 to-transparent;
  }
}

@layer utilities {
  .text-shadow-glow {
    text-shadow: 0 0 10px currentColor;
  }
  
  .border-glow {
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.1);
  }
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-900;
}

::-webkit-scrollbar-thumb {
  @apply bg-red-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-red-500;
}

/* Smooth transitions */
* {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

/* Focus states for accessibility */
button:focus-visible,
a:focus-visible {
  @apply outline-2 outline-red-500 outline-offset-2;
}

src/app/page.tsx

import HadesRoadmap from '@/components/HadesRoadmap'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <HadesRoadmap />
    </main>
  )
}

src/data/roadmap.ts

/**
 * HADES Intelligence Platform Roadmap Data
 * 
 * Complete roadmap configuration and phase data
 */

export interface RoadmapPhase {
  quarter: string;
  title: string;
  subtitle: string;
  highlights: string[];
  features?: string[];
  target?: string;
  status?: 'planned' | 'in-progress' | 'completed';
}

export interface RoadmapConfig {
  title: string;
  subtitle: string;
  description: string;
  positioningStatement: {
    tagline: string;
    description: string;
  };
}

// Roadmap Configuration
export const roadmapConfig: RoadmapConfig = {
  title: "Our Roadmap",
  subtitle: "The Cross-Chain Aggregator of On-Chain Intelligence",
  description: "Built to route attention. Forged to hunt alpha.",
  positioningStatement: {
    tagline: "Jupiter routes capital. HADES routes attention.",
    description: "HADES.ag is the root intelligence layer powering alpha, sentiment, and decision flow — autonomous, cross-chain, and infrastructure-grade."
  }
};

// Q3 2025 - The Descent
export const q3_2025: RoadmapPhase = {
  quarter: "Q3 2025",
  title: "The Descent",
  subtitle: "Solana-Native Intelligence from Day One",
  status: 'in-progress',
  highlights: [
    "Public release of HADES Intelligence Platform (Alpha Engine v1, 87% signal win rate)",
    "Real-time generative portfolio analytics: personalized alpha based on your actual holdings",
    "Launch of HADES.ag — the root infrastructure layer for intelligence routing",
    "HADES Token Launch"
  ],
  features: [
    "Generative wallet-specific insights: custom strategy prompts based on what's in your bag",
    "Telegram channels dynamically ranked by real-time win rate, PnL, signal timing, and wallet overlap — poor performers auto-deprecated",
    "Solana-native intelligence layer built for launchpad-driven alpha",
    "Aggregation from all major Solana launchpads",
    "Live integrations: Jupiter, DexScreener, Birdeye, CoinGecko",
    "Launch of Agent Medusa — first autonomous intelligence entity",
    "Web app goes live with WalletConnect + account creation",
    "API v0.1: Solana alpha access, contract indexing, and basic trends",
    "Stealth beta: 100 power users, active feedback loop, wallet labeling"
  ],
  target: "1,000+ daily users, 100+ connected wallets • Token-gated access for community testing • Early user snapshot for priority allocation"
};

// Q4 2025 - SaaS Expansion
export const q4_2025: RoadmapPhase = {
  quarter: "Q4 2025",
  title: "SaaS Expansion & Solana Optimization",
  subtitle: "Infrastructure Monetization and Strategic Growth",
  status: 'planned',
  highlights: [
    "Rollout of Pro and Enterprise API tiers (SaaS monetization begins)",
    "Optimized coverage of all known Solana launchpads and stealth deployers",
    "Expansion to Base chain: alpha tracking, contract intel, sniper detection"
  ],
  features: [
    "Strategic partnerships with aggregators, DeFi dashboards, and analytics platforms",
    "Deployment of MetaSignal Layer v0.1:",
    "• Holder growth/loss tracking",
    "• Wallet segmentation",
    "• Token behavioral deltas"
  ]
};

// Q1 2026 - Cross-Chain Intelligence
export const q1_2026: RoadmapPhase = {
  quarter: "Q1 2026",
  title: "Cross-Chain Intelligence & Social Monetization",
  subtitle: "Layer Consolidation and Community Intelligence Economy",
  status: 'planned',
  highlights: [
    "Launch of HADES Feed: unified real-time alpha across Solana, Base, and Ethereum",
    "Indexing of whales, MEV bots, and smart money wallet behavior",
    "Comment and react to any token on-chain (wallet-based identity layer)"
  ],
  features: [
    "Monetization of emojis and reactions via microtransactions",
    "X integration: wallet-based social posting & engagement",
    "Expansion of MetaSignal Layer:",
    "• Track token launches",
    "• Detect signal decay",
    "• Map holder dynamics",
    "Release of developer SDK and custom API endpoint tooling",
    "Launch of whitelabel dashboards for partners and platforms",
    "Signal Provenance Layer: verify source and win rate of alpha",
    "Reputation Layer: public scoring, influence tiers, and trust metrics"
  ]
};

// Q2 2026 - Autonomous Infrastructure
export const q2_2026: RoadmapPhase = {
  quarter: "Q2 2026",
  title: "Autonomous Intelligence Infrastructure",
  subtitle: "Protocol-Layer Agents & SaaS Ecosystem Lock-In",
  status: 'planned',
  highlights: [
    "SaaS business model scales via plug-and-play API for aggregators, launchpads, dashboards",
    "Launch of multiple new autonomous agents",
    "HADES transitions from product to attention-routing infrastructure layer"
  ],
  features: [
    "Autonomous agents for:",
    "• Cross-chain intelligence retrieval",
    "• Token lifecycle anomaly detection",
    "• Insider activity alerts",
    "• Liquidity mirroring and smart routing behavior",
    "Modular, scalable integration model for L1s, L2s, and appchains",
    "Embedded intelligence into 3rd-party UIs via SDK, iFrame, or direct API",
    "Alpha resellers and embedded partners onboarded into the HADES data layer"
  ]
};

// Complete roadmap data export
export const roadmapData: RoadmapPhase[] = [
  q3_2025,
  q4_2025,
  q1_2026,
  q2_2026
];

// Individual phase exports for easy access
export const phases = {
  q3_2025,
  q4_2025,
  q1_2026,
  q2_2026
};

// Utility functions for roadmap data
export const getRoadmapPhase = (quarter: string): RoadmapPhase | undefined => {
  return roadmapData.find(phase => phase.quarter === quarter);
};

export const getCompletedPhases = (): RoadmapPhase[] => {
  return roadmapData.filter(phase => phase.status === 'completed');
};

export const getInProgressPhases = (): RoadmapPhase[] => {
  return roadmapData.filter(phase => phase.status === 'in-progress');
};

export const getPlannedPhases = (): RoadmapPhase[] => {
  return roadmapData.filter(phase => phase.status === 'planned');
};

// Default export
export default {
  config: roadmapConfig,
  data: roadmapData,
  phases,
  utils: {
    getRoadmapPhase,
    getCompletedPhases,
    getInProgressPhases,
    getPlannedPhases
  }
};

 src/components/HadesRoadmap.tsx

'use client';

import React from 'react';
import { roadmapConfig, roadmapData, type RoadmapPhase } from '@/data/roadmap';

interface HadesRoadmapProps {
  /**
   * Custom roadmap data - if not provided, uses default HADES roadmap
   */
  customRoadmapData?: RoadmapPhase[];
  /**
   * Custom configuration - if not provided, uses default HADES config
   */
  customConfig?: {
    title?: string;
    subtitle?: string;
    description?: string;
    positioningStatement?: {
      tagline?: string;
      description?: string;
    };
  };
  /**
   * Whether to show the positioning statement section
   */
  showPositioningStatement?: boolean;
  /**
   * Custom CSS classes for styling
   */
  className?: string;
}

const HadesRoadmap: React.FC<HadesRoadmapProps> = ({
  customRoadmapData,
  customConfig,
  showPositioningStatement = true,
  className = ""
}) => {
  // Use custom data or default roadmap data
  const data = customRoadmapData || roadmapData;
  const config = { ...roadmapConfig, ...customConfig };

  return (
    <section className={`relative py-20 px-6 bg-black ${className}`}>
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {config.title.split(' ')[0]}{' '}
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-yellow-600 bg-clip-text text-transparent">
              {config.title.split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {config.subtitle}
            <br />
            {config.description}
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {data.map((phase, index) => (
            <RoadmapPhaseComponent
              key={`${phase.quarter}-${index}`}
              phase={phase}
              index={index}
              isLast={index === data.length - 1}
            />
          ))}
        </div>

        {/* Positioning Statement */}
        {showPositioningStatement && config.positioningStatement && (
          <div className="max-w-3xl mx-auto mt-16 p-6 border border-red-500/30 rounded-lg bg-red-900/10">
            <h3 className="text-xl font-bold text-red-400 mb-4 text-center">⚡️ Positioning Statement</h3>
            <p className="text-white/90 text-center leading-relaxed">
              <strong>{config.positioningStatement.tagline}</strong>
              <br />
              {config.positioningStatement.description}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

// Individual roadmap phase component for modularity
interface RoadmapPhaseComponentProps {
  phase: RoadmapPhase;
  index: number;
  isLast: boolean;
}

const RoadmapPhaseComponent: React.FC<RoadmapPhaseComponentProps> = ({
  phase,
  index,
  isLast
}) => {
  return (
    <div className="flex mb-16 relative">
      {/* Quarter Badge */}
      <div className="flex-shrink-0 w-32 mr-8 relative">
        <div className={`w-4 h-4 rounded-full absolute left-0 top-2 ${
          phase.status === 'completed' ? 'bg-green-500' :
          phase.status === 'in-progress' ? 'bg-yellow-500' : 'bg-red-500'
        }`}></div>
        {!isLast && (
          <div className="absolute left-2 top-6 bottom-0 w-px bg-red-900/40"></div>
        )}
        <div className="ml-8 text-red-400 text-sm font-semibold">{phase.quarter}</div>
        {phase.status && (
          <div className={`ml-8 text-xs mt-1 ${
            phase.status === 'completed' ? 'text-green-400' :
            phase.status === 'in-progress' ? 'text-yellow-400' : 'text-gray-400'
          }`}>
            {phase.status === 'completed' ? '✓ Done' :
             phase.status === 'in-progress' ? '⚡ Active' : '📅 Planned'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-white mb-2">{phase.title}</h3>
        {phase.subtitle && (
          <p className="text-white/70 mb-6 italic text-sm">{phase.subtitle}</p>
        )}

        {/* Highlights */}
        <div className="mb-6">
          <h4 className="text-red-400 font-semibold mb-3 text-sm uppercase tracking-wide">Key Highlights</h4>
          <div className="grid gap-2">
            {phase.highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-center">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-white font-medium">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        {phase.features && (
          <div className="mb-4">
            <h4 className="text-white/60 font-medium mb-3 text-sm">Features & Infrastructure</h4>
            <div className="grid gap-2">
              {phase.features.map((feature, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-white/40 mr-3 mt-1 text-xs">•</span>
                  <span className="text-white/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Target */}
        {phase.target && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded">
            <div className="text-red-300 font-medium text-sm">
              <div className="mb-2">Target:</div>
              {phase.target.split('•').map((item, idx) => (
                <div key={idx} className="flex items-start mb-1">
                  {idx === 0 ? (
                    <span>{item.trim()}</span>
                  ) : (
                    <>
                      <span className="text-red-400 mr-2 mt-0.5">•</span>
                      <span>{item.trim()}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export both the main component and the phase component for modularity
export { RoadmapPhaseComponent };
export default HadesRoadmap;
