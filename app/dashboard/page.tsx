// Force dynamic rendering
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BarChart3, Zap, Clock } from 'lucide-react';

export default function DashboardPage() {
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
                <Link href="/intelligence" className="text-slate-300 hover:text-white transition-colors">
                  Intelligence
                </Link>
                <Link href="/dashboard" className="text-blue-400 font-semibold">
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
          <h1 className="text-4xl font-bold text-white mb-2">📊 Dashboard</h1>
          <p className="text-slate-300 text-lg">Your personalized trading command center</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">$125,430</p>
                  <p className="text-sm text-green-400">+12.5% today</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Positions</p>
                  <p className="text-2xl font-bold text-white">8</p>
                  <p className="text-sm text-blue-400">3 profitable</p>
                </div>
                <Target className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Win Rate</p>
                  <p className="text-2xl font-bold text-white">73%</p>
                  <p className="text-sm text-orange-400">Last 30 days</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Signals Today</p>
                  <p className="text-2xl font-bold text-white">24</p>
                  <p className="text-sm text-purple-400">6 high confidence</p>
                </div>
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Signals</h3>
              <div className="space-y-4">
                {[
                  { token: 'BONK', type: 'BUY', confidence: 94, time: '2m ago' },
                  { token: 'WIF', type: 'SELL', confidence: 87, time: '15m ago' },
                  { token: 'POPCAT', type: 'BUY', confidence: 91, time: '32m ago' },
                ].map((signal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={signal.type === 'BUY' ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}>
                        {signal.type}
                      </Badge>
                      <span className="font-semibold text-white">{signal.token}</span>
                      <span className="text-sm text-slate-400">{signal.confidence}% confidence</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {signal.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Top Performers</h3>
              <div className="space-y-4">
                {[
                  { token: 'HOMURA', gain: '+245%', value: '$12,450' },
                  { token: 'PEPE', gain: '+180%', value: '$8,920' },
                  { token: 'DOGE', gain: '+95%', value: '$15,630' },
                ].map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">{performer.token}</span>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        {performer.gain}
                      </Badge>
                    </div>
                    <span className="text-white font-mono">{performer.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/alpha-feed" className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors text-center">
                  <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <span className="text-white font-medium">View Signals</span>
                </Link>
                <Link href="/intelligence" className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors text-center">
                  <BarChart3 className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <span className="text-white font-medium">Intelligence</span>
                </Link>
                <Link href="/platform" className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors text-center">
                  <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <span className="text-white font-medium">Platform</span>
                </Link>
                <div className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors text-center cursor-pointer">
                  <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <span className="text-white font-medium">Settings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}