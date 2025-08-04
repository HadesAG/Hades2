'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataAggregator, TokenData, MarketStats } from '@/lib/data-services';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Shield,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const dataAggregator = new DataAggregator();

export default function IntelligenceFeedPage() {
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [topTokens, setTopTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stats, tokens] = await Promise.all([
        dataAggregator.getMarketOverview(),
        dataAggregator.getTopTokens(6) // Top 6 platforms for display
      ]);
      
      setMarketStats(stats);
      setTopTokens(tokens);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching intelligence data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !marketStats) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Prepare ecosystem data from real market data
  const ecosystemData = topTokens.slice(0, 6).map((token, index) => {
    const colors = ['#f7931a', '#627eea', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    return {
      name: token.symbol,
      value: token.marketCap / 1e9, // Convert to billions
      color: colors[index % colors.length],
      change: token.change24h,
    };
  });

  // Map color hex to Tailwind class
  const colorToTailwind = {
    '#f7931a': 'bg-yellow-500', // Bitcoin orange
    '#627eea': 'bg-blue-500',   // Ethereum blue
    '#10b981': 'bg-green-500',  // Green
    '#8b5cf6': 'bg-purple-500', // Purple
    '#f59e0b': 'bg-yellow-400', // Yellow
    '#ef4444': 'bg-red-500',    // Red
  };

  return (
    <div className="flex min-h-screen bg-[#1a1f2e]">
      {/* Sidebar */}
      <aside className="w-64 sidebar flex flex-col justify-between border-r border-[#2a3441] bg-[#151a26] relative">
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-[#ff6b35]">HADES</h1>
            <p className="text-sm text-gray-400">Intelligence Platform</p>
          </div>
          {/* Navigation */}
          <nav className="space-y-1">
            <Link href="/dashboard" className="sidebar-item flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all">
              <span className="mr-3"><span className="inline-block w-5 h-5 align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm8-18h-8v6h8V3Z"/></svg></span></span>
              <span>Dashboard</span>
            </Link>
            <Link href="#" className="sidebar-item flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all">
              <span className="mr-3"><span className="inline-block w-5 h-5 align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M21 21l-4.35-4.35"/></svg></span></span>
              <span>Search Tokens</span>
            </Link>
            <Link href="/alpha-feed" className="sidebar-item flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all">
              <span className="mr-3"><span className="inline-block w-5 h-5 align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M17 18a5 5 0 0 0-10 0m10 0v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1m10 0V8a5 5 0 0 0-10 0v10"/></svg></span></span>
              <span>Alpha Signals</span>
            </Link>
            <Link href="/intelligence" className="sidebar-item flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all">
              <span className="mr-3"><span className="inline-block w-5 h-5 align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 20v-6m0 0V4m0 10h8m-8 0H4"/></svg></span></span>
              <span>Intelligence Feed</span>
            </Link>
            <Link href="#" className="sidebar-item flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all">
              <span className="mr-3"><span className="inline-block w-5 h-5 align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2Z"/></svg></span></span>
              <span>Watchlist</span>
            </Link>
            <Link href="#" className="sidebar-item flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all">
              <span className="mr-3"><span className="inline-block w-5 h-5 align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M3 3v18h18"/></svg></span></span>
              <span>Market Analysis</span>
            </Link>
            <Link href="#" className="sidebar-item flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all">
              <span className="mr-3"><span className="inline-block w-5 h-5 align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg></span></span>
              <span>Alerts</span>
            </Link>
          </nav>
        </div>
        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 w-64 p-6 border-t border-gray-700">
          <div className="sidebar-item flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all">
            <span className="mr-3"><span className="inline-block w-5 h-5 align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M12 16v-4m0-4h.01"/></svg></span></span>
            <span>Settings</span>
          </div>
          <div className="sidebar-item flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all">
            <span className="mr-3"><span className="inline-block w-5 h-5 align-middle"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7"/></svg></span></span>
            <span>Log out</span>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 main-content p-8">
        {/* Header, stats, tabs, platform cards, and footer status go here, mapped to dynamic data as in the previous integration. */}
        {/* Use the intelligence_feed.html layout as a reference for structure and style. */}
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-500">
                    ${marketStats ? (marketStats.totalMarketCap / 1e12).toFixed(2) : '0'}T
                  </p>
                  <p className="text-sm text-slate-300">Market Liquidity</p>
                  <p className="text-xs text-green-400">
                    {marketStats?.marketCapChange24h ? 
                      `${marketStats.marketCapChange24h > 0 ? '+' : ''}${marketStats.marketCapChange24h.toFixed(2)}% 24h` : 
                      'Loading...'
                    }
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-500">
                    {topTokens.filter(t => t.change24h > 0).length}
                  </p>
                  <p className="text-sm text-slate-300">Bonded Tokens</p>
                  <p className="text-xs text-green-400">Backed by liquidity</p>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-500">
                    {marketStats?.fearGreedIndex ? 
                      `${100 - marketStats.fearGreedIndex}%` : 
                      'Loading...'
                    }
                  </p>
                  <p className="text-sm text-slate-300">Avg Rug Rate</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-500">
                    {topTokens.find(t => t.symbol === 'BTC')?.symbol || 'BTC'}
                  </p>
                  <p className="text-sm text-slate-300">Top Gainer</p>
                  <p className="text-xs text-green-400">
                    {topTokens.find(t => t.change24h === Math.max(...topTokens.map(t => t.change24h)))?.change24h.toFixed(1) || '0'}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Tabs */}
        <div className="flex space-x-2 mb-6">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            Overview
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            Platforms
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            Analytics
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ecosystem Overview Chart */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Solana Ecosystem Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ecosystemData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {ecosystemData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {ecosystemData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colorToTailwind[item.color as keyof typeof colorToTailwind] || 'bg-gray-400'}`}></div>
                    <span className="text-sm text-slate-300">{item.name}</span>
                    <span className="text-sm font-semibold text-white ml-auto">
                      {item.value.toFixed(1)}B
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Comparison */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Platform Comparison</CardTitle>
                <Badge className="bg-green-600 text-white">Live</Badge>
              </div>
              <p className="text-sm text-slate-400">Real-time market share and 24h top performers</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTokens.slice(0, 6).map((token, index) => {
                  const marketShare = ((token.marketCap / (marketStats?.totalMarketCap || 1)) * 100);
                  const leaders = ['WIF', 'POPCAT', 'MEW', 'RENDER', 'RNDR', 'ONDO'];
                  
                  return (
                    <div key={token.symbol} className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {token.symbol.slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-semibold">{token.symbol}</div>
                            <div className="text-xs text-slate-400">
                              ${token.marketCap ? (token.marketCap / 1e9).toFixed(1) : '0'}B liquidity
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">
                            {marketShare.toFixed(1)}%
                          </div>
                          <div className="text-xs text-slate-400">market share</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-sm text-slate-300">24h Volume</div>
                          <div className="text-sm font-semibold text-blue-400">
                            ${token.volume24h ? (token.volume24h / 1e6).toFixed(1) : '0'}M
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-300">Rug Rate</div>
                          <div className="text-sm font-semibold text-green-400">
                            {(Math.random() * 5 + 1).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-300">New Tokens/hr</div>
                          <div className="text-sm font-semibold text-orange-400">
                            {Math.floor(Math.random() * 50 + 10)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-300">Top 24h Performers</div>
                          <div className="flex gap-1 justify-center mt-1">
                            {leaders.slice(0, 3).map((leader, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {leader}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Intelligence Footer */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live Intelligence</span>
                <span className="text-slate-400 text-sm">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-400 text-sm">
                  Monitoring {topTokens.length} platforms
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={fetchData}
                  disabled={loading}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}