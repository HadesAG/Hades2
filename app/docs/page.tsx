"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink, Key, Mail, Shield } from "lucide-react"
import { SparklesText } from "@/components/ui/sparkles-text"
import { HyperText } from "@/components/ui/hyper-text"
import { GlowBorder } from "@/components/ui/glow-border"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { NumberTicker } from "@/components/ui/number-ticker"

interface APIEndpoint {
  method: string
  endpoint: string
  description: string
  parameters?: { name: string; type: string; required: boolean; description: string }[]
  response: any
  example: string
}

const apiEndpoints: APIEndpoint[] = [
  {
    method: "GET",
    endpoint: "/api/alpha-signals",
    description: "Get alpha performance signals with strength indicators and confidence scores",
    parameters: [
      { name: "limit", type: "number", required: false, description: "Number of signals to return (default: 50)" },
      { name: "timeframe", type: "string", required: false, description: "Time range: 1h, 4h, 24h (default: 24h)" },
    ],
    response: {
      success: true,
      data: {
        signals: [
          {
            id: "signal_123",
            tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            symbol: "USDC",
            name: "USD Coin",
            strength: 85.5,
            confidence: 92.3,
            direction: "bullish",
            timeframe: "4h",
            metadata: {
              marketCap: 32500000000,
              volume24h: 2800000000,
              priceChange24h: 2.45,
              liquidityScore: 98.7,
            },
            timestamp: "2025-01-15T10:30:00Z",
          },
        ],
        totalCount: 150,
        lastUpdated: "2025-01-15T10:30:00Z",
      },
    },
    example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.hades.ag/api/alpha-signals?limit=10',
  },
  {
    method: "GET",
    endpoint: "/api/whales/transactions",
    description: "Get recent whale transaction data with wallet labels and categories",
    parameters: [
      { name: "limit", type: "number", required: false, description: "Number of transactions to return (default: 20)" },
      { name: "minAmount", type: "number", required: false, description: "Minimum transaction amount in USD" },
    ],
    response: {
      success: true,
      data: {
        recentTransactions: [
          {
            signature: "5J7X9K2mN8pQ4rS6tU1vW3xY5zA7bC9dE2fG8hI4jK6lM7nO9pQ1rS3tU5vW7xY9zA",
            walletAddress: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
            walletLabel: "Alameda Research",
            tokenAddress: "So11111111111111111111111111111111111111112",
            symbol: "SOL",
            amount: 50000,
            usdValue: 5250000,
            type: "buy",
            timestamp: "2025-01-15T10:25:00Z",
            category: "institutional",
          },
        ],
        totalCount: 500,
        lastUpdated: "2025-01-15T10:30:00Z",
      },
    },
    example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.hades.ag/api/whales/transactions?limit=5',
  },
  {
    method: "GET",
    endpoint: "/api/launchpad-intelligence",
    description: "Get launchpad intelligence and market analysis data",
    response: {
      success: true,
      data: {
        marketAnalysis: {
          totalMarketCap: 2450000000000,
          totalVolume24h: 85000000000,
          activeTokens: 12500,
          trendingCount: 150,
        },
        topPerformers: [
          {
            tokenAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
            symbol: "BONK",
            name: "Bonk",
            priceChange24h: 45.67,
            volume24h: 125000000,
            marketCap: 890000000,
          },
        ],
        lastUpdated: "2025-01-15T10:30:00Z",
      },
    },
    example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.hades.ag/api/launchpad-intelligence',
  },
  {
    method: "GET",
    endpoint: "/api/signals",
    description: "Get basic trading signals with buy/sell recommendations",
    parameters: [
      { name: "type", type: "string", required: false, description: "Signal type: buy, sell, hold (default: all)" },
      { name: "confidence", type: "number", required: false, description: "Minimum confidence score (0-100)" },
    ],
    response: {
      success: true,
      data: {
        signals: [
          {
            id: "signal_456",
            tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            symbol: "USDC",
            type: "buy",
            confidence: 87.5,
            targetPrice: 1.02,
            stopLoss: 0.98,
            timeframe: "1h",
            timestamp: "2025-01-15T10:30:00Z",
          },
        ],
        totalCount: 75,
        lastUpdated: "2025-01-15T10:30:00Z",
      },
    },
    example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.hades.ag/api/signals?type=buy&confidence=80',
  },
  {
    method: "GET",
    endpoint: "/api/telegram-signals",
    description: "Get social sentiment signals from Telegram channels and groups",
    response: {
      success: true,
      data: {
        signals: [
          {
            id: "tg_signal_789",
            tokenAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
            symbol: "BONK",
            sentiment: "bullish",
            mentionCount: 245,
            sentimentScore: 78.5,
            channels: ["@solana_alpha", "@defi_signals"],
            timestamp: "2025-01-15T10:30:00Z",
          },
        ],
        totalCount: 120,
        lastUpdated: "2025-01-15T10:30:00Z",
      },
    },
    example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.hades.ag/api/telegram-signals',
  },
]

export default function DocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint>(apiEndpoints[0])

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEndpoint(endpoint)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <InteractiveHoverButton
                text="← Back to App"
                className="bg-gray-700 hover:bg-gray-600 text-white"
                onClick={() => (window.location.href = "/")}
              />
              <SparklesText text="API Documentation" className="text-xl font-bold" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                <NumberTicker value={apiEndpoints.length} /> endpoints available
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <GlowBorder className="p-6 bg-gray-900 rounded-lg">
              <SparklesText text="API Access" className="text-lg font-semibold mb-4" />

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Token Holders Only</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Key className="h-4 w-4" />
                  <span className="text-sm">API Key Required</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Contact for Access</span>
                </div>
              </div>

              <InteractiveHoverButton
                text="Request API Key"
                className="w-full bg-red-600 hover:bg-red-700 text-white mb-4"
                onClick={() => window.open("mailto:api@hades.ag?subject=API Key Request", "_blank")}
              />

              <div className="text-xs text-gray-400">
                Email: <HyperText text="api@hades.ag" className="text-red-400" />
              </div>
            </GlowBorder>

            {/* Endpoint Navigation */}
            <GlowBorder className="p-4 bg-gray-900 rounded-lg mt-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Endpoints</h3>
              <div className="space-y-2">
                {apiEndpoints.map((endpoint, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      selectedEndpoint.endpoint === endpoint.endpoint
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono ${
                          endpoint.method === "GET" ? "bg-green-600" : "bg-blue-600"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <span className="truncate">{endpoint.endpoint}</span>
                    </div>
                  </button>
                ))}
              </div>
            </GlowBorder>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <GlowBorder className="p-8 bg-gray-900 rounded-lg">
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span
                    className={`px-3 py-1 rounded text-sm font-mono ${
                      selectedEndpoint.method === "GET" ? "bg-green-600" : "bg-blue-600"
                    }`}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <HyperText text={selectedEndpoint.endpoint} className="text-xl font-mono text-red-400" />
                </div>
                <p className="text-gray-300">{selectedEndpoint.description}</p>
              </div>

              {/* Parameters */}
              {selectedEndpoint.parameters && (
                <div className="mb-8">
                  <SparklesText text="Parameters" className="text-lg font-semibold mb-4" />
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-300">Name</th>
                          <th className="text-left py-2 text-gray-300">Type</th>
                          <th className="text-left py-2 text-gray-300">Required</th>
                          <th className="text-left py-2 text-gray-300">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEndpoint.parameters.map((param, index) => (
                          <tr key={index} className="border-b border-gray-800">
                            <td className="py-2 font-mono text-red-400">{param.name}</td>
                            <td className="py-2 text-blue-400">{param.type}</td>
                            <td className="py-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${param.required ? "bg-red-600" : "bg-gray-600"}`}
                              >
                                {param.required ? "Required" : "Optional"}
                              </span>
                            </td>
                            <td className="py-2 text-gray-300">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Response */}
              <div className="mb-8">
                <SparklesText text="Response" className="text-lg font-semibold mb-4" />
                <div className="relative">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(selectedEndpoint.response, null, 2),
                        selectedEndpoint.endpoint + "_response",
                      )
                    }
                    className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                  >
                    {copiedEndpoint === selectedEndpoint.endpoint + "_response" ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="text-gray-300">{JSON.stringify(selectedEndpoint.response, null, 2)}</code>
                  </pre>
                </div>
              </div>

              {/* Example */}
              <div>
                <SparklesText text="Example Request" className="text-lg font-semibold mb-4" />
                <div className="relative">
                  <button
                    onClick={() => copyToClipboard(selectedEndpoint.example, selectedEndpoint.endpoint + "_example")}
                    className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                  >
                    {copiedEndpoint === selectedEndpoint.endpoint + "_example" ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="text-green-400">{selectedEndpoint.example}</code>
                  </pre>
                </div>
              </div>
            </GlowBorder>

            {/* Authentication Info */}
            <GlowBorder className="p-6 bg-gray-900 rounded-lg mt-6">
              <SparklesText text="Authentication" className="text-lg font-semibold mb-4" />
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">API Key Header</h4>
                  <div className="relative">
                    <button
                      onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY", "auth_header")}
                      className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                    >
                      {copiedEndpoint === "auth_header" ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                    <pre className="bg-gray-950 p-3 rounded text-sm">
                      <code className="text-blue-400">Authorization: Bearer YOUR_API_KEY</code>
                    </pre>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <p>• API keys are only available to $HADES token holders</p>
                  <p>
                    • Contact <HyperText text="api@hades.ag" className="text-red-400" /> to request access
                  </p>
                  <p>• Include your wallet address and token holdings proof</p>
                  <p>• Rate limits apply based on your token holding tier</p>
                </div>
              </div>
            </GlowBorder>
          </div>
        </div>
      </div>
    </div>
  )
}
