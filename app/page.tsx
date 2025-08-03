// Force dynamic rendering
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, BarChart3, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
                <span className="font-bold text-2xl text-white">HADES</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/intelligence" className="text-slate-300 hover:text-white transition-colors">
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
            <div className="flex items-center gap-4">
              <Link href="/alpha-feed">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            Hunt Alpha Before It Hits Social
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            HADES scans across Solana, Base, and all major chains to surface early signals and intelligence 
            before they reach social media. Get the edge you need in crypto trading.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/alpha-feed">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                🔥 View Alpha Signals
              </Button>
            </Link>
            <Link href="/intelligence">
              <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 text-lg px-8 py-3">
                📊 Intelligence Hub
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-blue-400" />
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">LIVE</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Alpha Signals</h3>
              <p className="text-slate-400">Real-time trading signals from premium Telegram channels with confidence scores.</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="h-8 w-8 text-green-400" />
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">AI</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Analysis</h3>
              <p className="text-slate-400">AI-powered analysis of market movements and entry points across multiple chains.</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="h-8 w-8 text-orange-400" />
                <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">PRO</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Intelligence Hub</h3>
              <p className="text-slate-400">Comprehensive market intelligence and launchpad analysis for informed decisions.</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="h-8 w-8 text-purple-400" />
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">FAST</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Cross-Chain</h3>
              <p className="text-slate-400">Monitor opportunities across Solana, Base, Ethereum, and other major blockchains.</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Alpha Hunters</h2>
            <p className="text-slate-300">Join thousands of traders who get early access to the next big opportunities</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-sm text-slate-400">Daily Signals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">87%</div>
              <div className="text-sm text-slate-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">15+</div>
              <div className="text-sm text-slate-400">Chains Monitored</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-sm text-slate-400">Live Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 HADES. Hunt alpha before it hits social.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}