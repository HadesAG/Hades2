// Force dynamic rendering
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BarChart3, Zap, Brain, Rocket } from 'lucide-react';

export default function IntelligencePage() {
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
            <Link href="/intelligence" className="sidebar-item active flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all text-white bg-[#d2691e]">
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-pink-500 rounded-full mr-3 flex items-center justify-center">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="white" strokeWidth="2" d="M12 20v-6m0 0V4m0 10h8m-8 0H4"/></svg>
              </div>
              <h1 className="text-3xl font-bold">Intelligence Feed</h1>
            </div>
            <p className="text-gray-400">Cross-chain launchpad monitoring and analysis</p>
          </div>
          <button className="refresh-btn bg-[#ff6b35] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#ff5722] transition-all" title="Refresh">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4.05 11a9 9 0 1 1 2.13 5.66"/><path stroke="currentColor" strokeWidth="2" d="M4 19v-5h5"/></svg>
            Refresh
          </button>
        </div>
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Market Liquidity */}
          <div className="metric-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Market Liquidity</div>
                <div className="text-2xl font-bold">$978.0M</div>
                <div className="text-sm text-[#2ea043]">↑ +5.2% 24h</div>
              </div>
              <div className="text-[#58a6ff]">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M17 18a5 5 0 0 0-10 0m10 0v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1m10 0V8a5 5 0 0 0-10 0v10"/></svg>
              </div>
            </div>
          </div>
          {/* Bonded Tokens */}
          <div className="metric-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Bonded Tokens</div>
                <div className="text-2xl font-bold">847</div>
                <div className="text-sm text-[#2ea043]">↑ Backed by liquidity</div>
              </div>
              <div className="text-[#2ea043]">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 20v-6m0 0V4m0 10h8m-8 0H4"/></svg>
              </div>
            </div>
          </div>
          {/* Avg Rug Rate */}
          <div className="metric-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Avg Rug Rate</div>
                <div className="text-2xl font-bold">8.4%</div>
              </div>
              <div className="text-[#f85149]">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
              </div>
            </div>
          </div>
          {/* Top Gainer */}
          <div className="metric-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Top Gainer</div>
                <div className="text-2xl font-bold">Moonshot</div>
                <div className="text-sm text-[#2ea043]">+23.7%</div>
              </div>
              <div className="text-[#2ea043]">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M17 18a5 5 0 0 0-10 0m10 0v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1m10 0V8a5 5 0 0 0-10 0v10"/></svg>
              </div>
            </div>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="tab-nav flex mb-6">
          <div className="tab-item active px-6 py-3 rounded-lg mr-2 bg-[#ff6b35] text-white cursor-pointer">Overview</div>
          <div className="tab-item px-6 py-3 rounded-lg mr-2 text-[#8b949e] cursor-pointer hover:bg-white/5 hover:text-white transition-all">Platforms</div>
          <div className="tab-item px-6 py-3 rounded-lg text-[#8b949e] cursor-pointer hover:bg-white/5 hover:text-white transition-all">Analytics</div>
        </div>
        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Example Platform Card: BONK */}
          <div className="platform-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all relative">
            <div className="percentage-badge positive absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">36.8%</div>
            <div className="platform-icon bonk-icon bg-[#ff6b35] text-white w-8 h-8 rounded-lg flex items-center justify-center mb-3">🐕</div>
            <h3 className="text-xl font-bold mb-4">BONK</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-400">Total Liquidity</div>
                <div className="font-semibold">$298.0M</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">24h Volume</div>
                <div className="font-semibold text-[#ff6b35]">18.4%</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">New Tokens/hr</div>
                <div className="font-semibold text-[#f1c40f]">156</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Rug Rate</div>
                <div className="font-semibold text-[#ff6b35]">8.7%</div>
              </div>
            </div>
            <div className="mb-3">
              <div className="text-sm text-gray-400 mb-2">🔥 Top 24h Performers</div>
              <div>
                <span className="token-tag bg-[#ff6b35] text-white px-2 py-1 rounded mr-1 text-xs font-semibold">WIF</span>
                <span className="token-tag bg-[#ff6b35] text-white px-2 py-1 rounded mr-1 text-xs font-semibold">POPCAT</span>
                <span className="token-tag bg-[#ff6b35] text-white px-2 py-1 rounded text-xs font-semibold">MEW</span>
              </div>
            </div>
          </div>
          {/* Additional platform cards would be mapped here using dynamic data */}
        </div>
        {/* Footer Status */}
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center">
            <div className="live-indicator mr-2 w-2 h-2 bg-[#2ea043] rounded-full animate-pulse"></div>
            <span className="font-semibold">Live Intelligence</span>
            <span className="text-gray-400 ml-4">Last update: 11:13:29 PM</span>
          </div>
          <div className="text-gray-400">
            Monitoring 6 platforms
          </div>
        </div>
      </main>
    </div>
  );
}