// Force dynamic rendering
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BarChart3, Zap, Brain, Rocket } from 'lucide-react';

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
                <span className="font-bold text-2xl text-white">HADES</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/intelligence" className="text-blue-400 font-semibold">
                  Intelligence
                </Link>
                <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/alpha-feed" className="text-slate-300 hover:text-white transition-colors">
                  Alpha Feed
                </Link>
                <Link href="/platform" className="text-slate-300 hover:text-white transition-colors">
                  Platform
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🧠 Intelligence Hub</h1>
          <p className="text-slate-300 text-lg">AI-powered market analysis and launchpad intelligence</p>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">LIVE</Badge>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Market Sentiment</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Overall</span>
                  <span className="text-green-400 font-semibold">Bullish</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence</span>
                  <span className="text-white">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Volume</span>
                  <span className="text-orange-400">High</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Rocket className="h-8 w-8 text-green-400" />
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">HOT</Badge>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Trending Sectors</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">DeFi</span>
                  <span className="text-green-400">+24%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GameFi</span>
                  <span className="text-green-400">+18%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Layer 2</span>
                  <span className="text-green-400">+15%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="h-8 w-8 text-purple-400" />
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">AI</Badge>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Risk Assessment</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Market Risk</span>
                  <span className="text-yellow-400">Medium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Volatility</span>
                  <span className="text-orange-400">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Liquidity</span>
                  <span className="text-green-400">Good</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Launchpad Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">🚀 Upcoming Launches</h3>
              <div className="space-y-4">
                {[
                  {
                    name: 'DefiToken',
                    symbol: 'DFT',
                    date: '2024-02-15',
                    platform: 'Uniswap',
                    confidence: 88,
                    risk: 'Medium'
                  },
                  {
                    name: 'GameFi Protocol',
                    symbol: 'GFP',
                    date: '2024-02-20',
                    platform: 'PancakeSwap',
                    confidence: 94,
                    risk: 'Low'
                  },
                  {
                    name: 'Layer2 Bridge',
                    symbol: 'L2B',
                    date: '2024-02-25',
                    platform: 'Arbitrum',
                    confidence: 76,
                    risk: 'High'
                  }
                ].map((launch, index) => (
                  <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white">{launch.name}</span>
                        <Badge variant="outline" className="text-blue-300 border-blue-300">
                          {launch.symbol}
                        </Badge>
                      </div>
                      <Badge className={`${
                        launch.risk === 'Low' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        launch.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        {launch.risk} Risk
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{launch.platform} • {launch.date}</span>
                      <span className="text-white">{launch.confidence}% confidence</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">📊 Market Analysis</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Key Insights</h4>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      DeFi sector showing strong momentum with 24% growth
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      GameFi tokens gaining institutional interest
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">•</span>
                      Layer 2 solutions preparing for major upgrades
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <span className="text-green-400 font-semibold">BUY: </span>
                      <span className="text-white">Monitor DeFi blue chips for entry</span>
                    </div>
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <span className="text-yellow-400 font-semibold">WATCH: </span>
                      <span className="text-white">GameFi sector for breakout signals</span>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <span className="text-blue-400 font-semibold">RESEARCH: </span>
                      <span className="text-white">Layer 2 tokens before upgrades</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chain Analysis */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">🔗 Cross-Chain Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Solana</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Activity</span>
                    <span className="text-green-400">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TVL</span>
                    <span className="text-white">$2.1B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">24h Volume</span>
                    <span className="text-blue-400">$890M</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Base</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Activity</span>
                    <span className="text-green-400">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TVL</span>
                    <span className="text-white">$1.8B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">24h Volume</span>
                    <span className="text-blue-400">$650M</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Ethereum</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Activity</span>
                    <span className="text-yellow-400">Medium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TVL</span>
                    <span className="text-white">$45.2B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">24h Volume</span>
                    <span className="text-blue-400">$12.5B</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}