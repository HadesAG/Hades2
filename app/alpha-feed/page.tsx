'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search, TrendingUp, Target, BarChart3, Clock, Zap, MessageCircle, Bot, Radio } from 'lucide-react';

// Declare the custom RSS App element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'rssapp-feed': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id: string;
      };
    }
  }
}

interface AlphaSignal {
  id: string;
  token: string;
  value: string;
  change: number;
  strength: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  timestamp: string;
  metadata: {
    signalType?: string;
    channelName?: string;
    channelWinRate?: number;
    priceFrom?: string;
    priceTo?: string;
    riskLevel?: 'low' | 'medium' | 'high';
    riskRewardRatio?: string;
    rawMessage?: string;
    performanceType?: string;
    scannerBot?: string;
    telegramSource?: 'telegram_channel' | 'telegram_bot';
    messageId?: number;
    source?: string;
  };
}

interface SignalStats {
  totalSignals: number;
  highConfidenceSignals: number;
  criticalSignals: number;
  averageConfidence: number;
  signalTypes: {
    spot: number;
    futures: number;
    swing: number;
    scalp: number;
  };
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  averageRiskReward: number;
}

export default function AlphaFeedPage() {
  const [signals, setSignals] = useState<AlphaSignal[]>([]);
  const [filteredSignals, setFilteredSignals] = useState<AlphaSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [strengthFilter, setStrengthFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [timeframeFilter, setTimeframeFilter] = useState('all');
  const [stats, setStats] = useState<SignalStats>({
    totalSignals: 0,
    highConfidenceSignals: 0,
    criticalSignals: 0,
    averageConfidence: 0,
    signalTypes: { spot: 0, futures: 0, swing: 0, scalp: 0 },
    riskDistribution: { low: 0, medium: 0, high: 0 },
    averageRiskReward: 0
  });
  const [telegramStats, setTelegramStats] = useState({
    totalTelegramSignals: 0,
    channelSignals: 0,
    botSignals: 0
  });
  const [isRealData, setIsRealData] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchSignals = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const response = await fetch('/api/alpha-signals', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      const data = await response.json();
      
      if (data.signals) {
        setSignals(data.signals);
        setStats(data.stats || {
          totalSignals: 0,
          highConfidenceSignals: 0,
          criticalSignals: 0,
          averageConfidence: 0,
          signalTypes: { spot: 0, futures: 0, swing: 0, scalp: 0 },
          riskDistribution: { low: 0, medium: 0, high: 0 },
          averageRiskReward: 0
        });
        setTelegramStats(data.telegramStats || {
          totalTelegramSignals: 0,
          channelSignals: 0,
          botSignals: 0
        });
        setIsRealData(data.isRealData || false);
        setLastUpdate(new Date());
        console.log('🔥 Alpha signals updated:', data.signals.length, data.isRealData ? '(LIVE)' : '(DEMO)', 
                   `Telegram: ${data.telegramStats?.totalTelegramSignals || 0}`);
      }
    } catch (error) {
      console.error('❌ Error fetching alpha signals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchSignals(true);
    }, refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  useEffect(() => {
    let filtered = signals.filter(signal => {
      const matchesSearch = signal.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           signal.metadata.channelName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStrength = strengthFilter === 'all' || signal.strength === strengthFilter;
      const matchesType = typeFilter === 'all' || signal.metadata.signalType === typeFilter;
      const matchesSource = sourceFilter === 'all' || 
                           (sourceFilter === 'telegram' && signal.metadata.source === 'telegram') ||
                           (sourceFilter === 'market' && signal.metadata.source !== 'telegram') ||
                           (sourceFilter === 'bot' && signal.metadata.telegramSource === 'telegram_bot') ||
                           (sourceFilter === 'channel' && signal.metadata.telegramSource === 'telegram_channel');
      
      return matchesSearch && matchesStrength && matchesType && matchesSource;
    });
    
    setFilteredSignals(filtered);
  }, [signals, searchTerm, strengthFilter, typeFilter, sourceFilter]);

  const getStrengthBadgeClass = (strength: string) => {
    switch (strength) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/10 border border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border border-yellow-400/20';
      case 'high': return 'text-red-400 bg-red-500/10 border border-red-400/20';
      default: return 'text-gray-400 bg-gray-500/10 border border-gray-400/20';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  return (
    <>
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
              <Link href="/alpha-feed" className="sidebar-item active flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all text-white bg-[#d2691e]">
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
          <div className="flex gap-8">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full mr-3 flex items-center justify-center">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="white" strokeWidth="2" d="M17 18a5 5 0 0 0-10 0m10 0v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1m10 0V8a5 5 0 0 0-10 0v10"/></svg>
                    </div>
                    <h1 className="text-3xl font-bold">Alpha Signals</h1>
                  </div>
                  <p className="text-gray-400">Premium trading signals from Telegram channels</p>
                </div>
                <div className="header-buttons flex gap-3 items-center">
                  <button className="demo-btn bg-blue-100 text-blue-600 px-4 py-2 rounded-lg border border-blue-200 font-medium flex items-center gap-2" title="Demo Mode">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><polygon points="8,5 19,12 8,19" fill="#2196f3"/></svg>
                    Demo Mode
                  </button>
                  <button className="auto-btn bg-green-100 text-green-600 px-4 py-2 rounded-lg border border-green-200 font-medium" title="Auto ON">Auto ON</button>
                  <button className="refresh-btn bg-[#ff6b35] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#ff5722] transition-all" title="Refresh">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4.05 11a9 9 0 1 1 2.13 5.66"/><path stroke="currentColor" strokeWidth="2" d="M4 19v-5h5"/></svg>
                    Refresh
                  </button>
                </div>
              </div>
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Total Signals */}
                <div className="metric-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Total Signals</div>
                      <div className="text-2xl font-bold">{stats.totalSignals || 0}</div>
                    </div>
                    <div className="text-[#ff6b35]">
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                    </div>
                  </div>
                </div>
                {/* High Confidence */}
                <div className="metric-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all">
                  <div className="flex items-center justify-between mb-4">
                        <div>
                      <div className="text-sm text-gray-400 mb-1">High Confidence</div>
                      <div className="text-2xl font-bold">{stats.highConfidenceSignals || 0}</div>
                        </div>
                    <div className="text-[#2ea043]">
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M17 18a5 5 0 0 0-10 0m10 0v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1m10 0V8a5 5 0 0 0-10 0v10"/></svg>
                      </div>
                        </div>
                      </div>
                {/* Avg Confidence */}
                <div className="metric-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all">
                  <div className="flex items-center justify-between mb-4">
                        <div>
                      <div className="text-sm text-gray-400 mb-1">Avg Confidence</div>
                      <div className="text-2xl font-bold">{stats.averageConfidence || 0}%</div>
                        </div>
                    <div className="text-[#ff6b35]">
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                          </div>
                        </div>
                </div>
                {/* Last Update */}
                <div className="metric-card bg-[#242938] rounded-xl p-5 border border-[#2a3441] hover:border-[#3a4553] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Last Update</div>
                      <div className="text-2xl font-bold">{lastUpdate.toLocaleTimeString()}</div>
                    </div>
                    <div className="text-[#f1c40f]">
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
              {/* Search and Filters */}
              <div className="mb-6">
                <input type="text" placeholder="Search signals..." className="search-bar bg-[#242938] border border-[#2a3441] rounded-lg px-4 py-3 text-white w-full mb-4" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <div className="filter-section flex gap-4 mb-4">
                  <select className="filter-dropdown bg-[#242938] border border-[#2a3441] rounded-lg px-3 py-2 text-white" value={strengthFilter} onChange={e => setStrengthFilter(e.target.value)} title="Filter by signal strength">
                    <option value="all">All Strengths</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select className="filter-dropdown bg-[#242938] border border-[#2a3441] rounded-lg px-3 py-2 text-white" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} title="Filter by signal type">
                    <option value="all">All Types</option>
                    <option value="buy">Buy Signals</option>
                    <option value="sell">Sell Signals</option>
                    <option value="alert">Alerts</option>
                    <option value="trending">Trending</option>
                  </select>
                                  </div>
                                </div>
              {/* Signal Cards */}
              <div className="space-y-6">
                {filteredSignals.map(signal => (
                  <div key={signal.id} className="signal-card bg-[#242938] rounded-xl p-6 border border-[#2a3441] mb-6 hover:border-[#3a4553] transition-all">
                    <div className="signal-header flex items-center justify-between mb-5">
                      <div className="signal-title flex items-center gap-3">
                        <div className="signal-icon w-8 h-8 rounded-lg flex items-center justify-center text-white bg-[#ff6b35]">{signal.token[0]}</div>
                        <div>
                          <h3 className="text-xl font-bold">{signal.token}</h3>
                                    </div>
                                  </div>
                      <div className="signal-badges flex gap-2 flex-wrap">
                        <span className={`badge ${signal.strength === 'critical' ? 'badge-critical' : signal.strength === 'high' ? 'badge-high' : signal.strength === 'medium' ? 'badge-medium' : ''}`}>{signal.strength.toUpperCase()}</span>
                        {signal.metadata.signalType && <span className="badge badge-performance">{signal.metadata.signalType.toUpperCase()}</span>}
                        {signal.metadata.performanceType && <span className="badge badge-trending">{signal.metadata.performanceType}</span>}
                              </div>
                            </div>
                    <div className="signal-content grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                      {/* Performance */}
                      <div className="performance-section bg-green-100/10 border border-green-400/20 rounded-lg p-4">
                        <div className="performance-title text-green-400 text-sm font-medium flex items-center gap-2 mb-2">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#2ea043" strokeWidth="2" d="M17 18a5 5 0 0 0-10 0m10 0v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1m10 0V8a5 5 0 0 0-10 0v10"/></svg>
                          Performance
                          </div>
                        <div className="performance-value text-2xl font-bold text-green-400 mb-1">{signal.value}</div>
                        <div className="performance-change text-green-400 text-lg font-semibold">+{signal.change?.toFixed(0) || 0}%</div>
                              </div>
                      {/* Price Movement */}
                      <div className="price-section text-center">
                        <div className="price-title text-[#8b949e] text-sm mb-2">Price Movement</div>
                        <div className="price-value text-lg font-bold text-white mb-1">{signal.metadata.priceFrom}</div>
                        <div className="price-range text-[#8b949e] text-sm">{signal.metadata.priceTo}</div>
                            </div>
                      {/* Risk Analysis */}
                      <div className="risk-section bg-orange-100/10 border border-orange-400/20 rounded-lg p-4 text-center">
                        <div className="risk-title text-[#ff6b35] text-sm font-medium mb-2">Risk Analysis</div>
                        <div className={`risk-value text-lg font-bold ${signal.metadata.riskLevel === 'low' ? 'text-green-400' : signal.metadata.riskLevel === 'high' ? 'text-red-400' : 'text-yellow-400'}`}>{signal.metadata.riskLevel?.toUpperCase() || 'UNKNOWN'}</div>
                              </div>
                      {/* Confidence */}
                      <div className="confidence-section text-center">
                        <div className="confidence-label text-[#8b949e] text-xs uppercase mb-1">CONFIDENCE</div>
                        <div className="confidence-value text-2xl font-bold text-green-400 mb-1">{signal.confidence}%</div>
                        <div className="confidence-time text-[#6e7681] text-xs">⏱ {getTimeAgo(signal.timestamp)}</div>
                            </div>
                          </div>
                        </div>
                ))}
              </div>
              {/* Footer Stats */}
              <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#242938] rounded-lg p-4 border border-[#2a3441]">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${isRealData ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                    <span className="text-sm font-medium text-[#8b949e]">{isRealData ? 'Live Channels' : 'Demo Mode'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#8b949e" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                    <span className="text-sm text-[#8b949e]">Last update: {lastUpdate.toLocaleTimeString()}</span>
                      </div>
                      {autoRefresh && (
                        <div className="flex items-center gap-2">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#2ea043" strokeWidth="2" d="M4.05 11a9 9 0 1 1 2.13 5.66"/><path stroke="#2ea043" strokeWidth="2" d="M4 19v-5h5"/></svg>
                          <span className="text-sm text-green-400">Auto-refresh every {refreshInterval}s</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                  <div className="text-[#8b949e]">
                        <span className="text-white font-semibold">{signals.length}</span> total signals
                  </div>
                  <div className="text-[#8b949e]">
                    <span className="text-green-400 font-semibold">{signals.filter(s => s.confidence >= 85).length}</span> high confidence
                  </div>
                  <div className="text-[#8b949e]">
                    <span className="text-red-400 font-semibold">{signals.filter(s => s.strength === 'critical').length}</span> critical
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[400px] flex-shrink-0 hidden xl:block">
              <div className="bg-[#242938] rounded-xl p-6 border border-[#2a3441] h-full">
                <h2 className="text-xl font-bold mb-4 text-white">Live Feed</h2>
                <rssapp-feed id="KInUwTcvBFvBtO7j"></rssapp-feed>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Script src="https://widget.rss.app/v1/feed.js" type="text/javascript" async />
    </>
  );
}
