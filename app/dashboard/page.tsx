// Force dynamic rendering
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BarChart3, Zap, Clock } from 'lucide-react';

export default function DashboardPage() {
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
            <Link href="/dashboard" className="sidebar-item active flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all text-white bg-[#d2691e]">
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Intelligence Dashboard</h1>
          <p className="text-gray-400">Real-time crypto intelligence and market analysis</p>
        </div>
        {/* Hero Card */}
        <div className="hero-card relative mb-8 bg-gradient-to-br from-[#8b4513] to-[#a0522d] rounded-xl p-6 overflow-hidden">
          <div className="hero-content flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Live Alpha Intelligence</h2>
              <h3 className="text-xl font-semibold text-[#ff6b35] mb-4">Currently Tracking</h3>
              <p className="text-white opacity-90">Real-time monitoring across 12 chains • 1,247 tokens tracked • 89 alpha signals active</p>
            </div>
            <button className="play-button bg-[#ff6b35] rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#ff5722] transition-all" title="Play">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><polygon points="8,5 19,12 8,19" fill="#fff"/></svg>
            </button>
          </div>
        </div>
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Example: Alpha Signals */}
          <div className="metric-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all">
            <div className="metric-icon text-[#ff6b35] mb-3"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M12 8v4l3 3"/></svg></div>
            <div className="metric-number text-[#ff6b35]">24 new today</div>
            <div className="metric-label">Alpha Signals</div>
            <div className="metric-description">New token discoveries</div>
          </div>
          {/* Cross-Chain Intel */}
          <div className="metric-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all">
            <div className="metric-icon text-[#f1c40f] mb-3"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 2v20m10-10H2"/></svg></div>
            <div className="metric-number text-[#f1c40f]">12 chains active</div>
            <div className="metric-label">Cross-Chain Intel</div>
            <div className="metric-description">Multi-chain monitoring</div>
          </div>
          {/* DeFi Alerts */}
          <div className="metric-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all">
            <div className="metric-icon text-[#ff6b35] mb-3"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg></div>
            <div className="metric-number text-[#ff6b35]">8 alerts pending</div>
            <div className="metric-label">DeFi Alerts</div>
            <div className="metric-description">Protocol updates</div>
          </div>
          {/* Market Intelligence */}
          <div className="metric-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all">
            <div className="metric-icon text-[#2ea043] mb-3"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M3 17v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2"/></svg></div>
            <div className="metric-number text-[#2ea043]">156 signals</div>
            <div className="metric-label">Market Intelligence</div>
            <div className="metric-description">Trading insights</div>
          </div>
        </div>
        {/* Stats Row */}
        <div className="stats-row bg-[#242938] rounded-xl p-6 border border-[#2a3441] mt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="stat-item text-center">
              <div className="stat-number text-[#ff6b35] text-2xl font-bold">1,247</div>
              <div className="stat-label text-[#8b949e] text-sm">Tokens Tracked</div>
            </div>
            <div className="stat-item text-center">
              <div className="stat-number text-[#ff6b35] text-2xl font-bold">89</div>
              <div className="stat-label text-[#8b949e] text-sm">Active Signals</div>
            </div>
            <div className="stat-item text-center">
              <div className="stat-number text-[#ff6b35] text-2xl font-bold">12</div>
              <div className="stat-label text-[#8b949e] text-sm">Chains Monitored</div>
            </div>
            <div className="stat-item text-center">
              <div className="stat-number text-[#ff6b35] text-2xl font-bold">24h</div>
              <div className="stat-label text-[#8b949e] text-sm">Live Monitoring</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}