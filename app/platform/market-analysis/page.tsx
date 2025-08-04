'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataAggregator, MarketStats } from '@/lib/data-services';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  RefreshCw,
  Activity
} from 'lucide-react';
import Link from 'next/link';

const dataAggregator = new DataAggregator();

export default function MarketAnalysisPage() {
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const [stats, topTokens] = await Promise.all([
        dataAggregator.getMarketOverview(),
        dataAggregator.getTopTokens(10) // Top 10 tokens for analysis
      ]);
      
      setMarketStats(stats);
      setMarketData(topTokens);
    } catch (error) {
      console.error('Error fetching market analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Refresh every 2 minutes for market analysis
    const interval = setInterval(fetchMarketData, 120000);
    return () => clearInterval(interval);
  }, []);

  // Use sector data for demo
  const sectorData = [
    { name: 'DeFi', value: 12.5, change: 8.2 },
    { name: 'Gaming', value: -3.1, change: -2.1 },
    { name: 'NFTs', value: 15.8, change: 12.3 },
    { name: 'Layer 1', value: 6.4, change: 4.1 },
    { name: 'Layer 2', value: -1.2, change: -0.8 },
    { name: 'Memes', value: 25.3, change: 18.7 }
  ];

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
          <nav className="flex flex-col gap-4">
            <Link href="/platform" className="text-white hover:text-[#ff6b35] transition">Dashboard</Link>
            <Link href="/platform/intelligence-feed" className="text-white hover:text-[#ff6b35] transition">Intelligence Feed</Link>
            <Link href="/platform/alpha-signals" className="text-white hover:text-[#ff6b35] transition">Alpha Signals</Link>
            <Link href="/platform/market-analysis" className="text-[#ff6b35] font-semibold">Market Analysis</Link>
            <Link href="/platform/alerts" className="text-white hover:text-[#ff6b35] transition">Alerts</Link>
            <Link href="/platform/watchlist" className="text-white hover:text-[#ff6b35] transition">Watchlist</Link>
            <Link href="/platform/search-tokens" className="text-white hover:text-[#ff6b35] transition">Search Tokens</Link>
            <Link href="/platform/settings" className="text-white hover:text-[#ff6b35] transition">Settings</Link>
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Market Analysis</h2>
        </div>
        {/* Charts and Stats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-[#151a26] rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-12 bg-slate-700 rounded mb-2"></div>
              <div className="h-4 bg-slate-700 rounded"></div>
            </div>
            <div className="bg-[#151a26] rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-12 bg-slate-700 rounded mb-2"></div>
              <div className="h-4 bg-slate-700 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-[#151a26] rounded-xl shadow-lg p-6 flex flex-col items-center">
              <span className="text-4xl font-bold text-[#ff6b35] mb-2">
                ${marketStats?.totalMarketCap ? (marketStats.totalMarketCap / 1e12).toFixed(2) : '2.45'}T
              </span>
              <span className="text-slate-300">Total Market Cap</span>
            </div>
            <div className="bg-[#151a26] rounded-xl shadow-lg p-6 flex flex-col items-center">
              <span className="text-4xl font-bold text-[#10b981] mb-2">
                ${marketStats?.volume24h ? (marketStats.volume24h / 1e9).toFixed(1) : '89.0'}B
              </span>
              <span className="text-slate-300">24h Volume</span>
            </div>
          </div>
        )}
        {/* Market Table */}
        <div className="bg-[#151a26] rounded-xl shadow-lg p-6">
          <table className="min-w-full divide-y divide-[#2a3441]">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Change</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Volume</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 bg-slate-700 rounded"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-slate-700 rounded"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-slate-700 rounded"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-slate-700 rounded"></div></td>
                  </tr>
                ))
              ) : (
                marketData.map((token, index) => (
                  <tr key={index} className="hover:bg-[#23283a] transition">
                    <td className="px-4 py-3 text-white font-semibold flex items-center gap-2">
                      {token.image ? (
                        <img src={token.image} alt={token.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {token.symbol.slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <span className="text-white font-medium">{token.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      ${token.price >= 1 ? token.price.toFixed(2) : token.price.toFixed(6)}
                    </td>
                    <td className={`px-4 py-3 font-semibold ${
                          token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      ${token.volume24h >= 1e9 ? 
                        `${(token.volume24h / 1e9).toFixed(2)}B` : 
                        `${(token.volume24h / 1e6).toFixed(1)}M`
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}