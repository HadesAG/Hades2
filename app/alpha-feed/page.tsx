'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search, TrendingUp, Target, BarChart3, Clock, Zap, MessageCircle, Bot, Radio } from 'lucide-react';

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
                <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                  Chains
                </Link>
                <Link href="/alpha-feed" className="text-blue-400 font-semibold">
                  Alpha Feed
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isRealData ? "default" : "secondary"} className="text-sm">
                {isRealData ? "🔴 Live Signals" : "📊 Demo Mode"}
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  size="sm"
                  variant={autoRefresh ? "default" : "outline"}
                  className={autoRefresh ? "bg-green-600 hover:bg-green-700" : "bg-slate-800 border-slate-600 text-white"}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
                  {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
                </Button>
                <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(Number(value))} disabled={!autoRefresh}>
                  <SelectTrigger className="w-24 bg-slate-800/50 border-slate-600 text-white text-xs">
                    <SelectValue placeholder="Interval" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="10">10s</SelectItem>
                    <SelectItem value="30">30s</SelectItem>
                    <SelectItem value="60">1m</SelectItem>
                    <SelectItem value="120">2m</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => fetchSignals()} disabled={loading} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">🔥 Alpha Feed</h1>
            <p className="text-slate-300 text-lg">Premium trading signals with precise entry points and targets</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Signals</p>
                    <p className="text-2xl font-bold text-white">{stats.totalSignals || 0}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">High Confidence</p>
                    <p className="text-2xl font-bold text-white">{stats.highConfidenceSignals || 0}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Avg Confidence</p>
                    <p className="text-2xl font-bold text-white">{stats.averageConfidence || 0}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Telegram Signals</p>
                    <p className="text-2xl font-bold text-white">{telegramStats.totalTelegramSignals}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-cyan-400 flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {telegramStats.channelSignals}
                      </span>
                      <span className="text-xs text-blue-400 flex items-center gap-1">
                        <Bot className="h-3 w-3" />
                        {telegramStats.botSignals}
                      </span>
                    </div>
                  </div>
                  <Radio className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search signals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>
            <Select value={strengthFilter} onValueChange={setStrengthFilter}>
              <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-white">
                <SelectValue placeholder="Signal Strength" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Strengths</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-white">
                <SelectValue placeholder="Signal Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buy">Buy Signals</SelectItem>
                <SelectItem value="sell">Sell Signals</SelectItem>
                <SelectItem value="alert">Alerts</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-white">
                <SelectValue placeholder="Signal Source" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="market">Market Data</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="channel">Telegram Channels</SelectItem>
                <SelectItem value="bot">Telegram Bots</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
              <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-white">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Timeframes</SelectItem>
                <SelectItem value="5m">5 Minutes</SelectItem>
                <SelectItem value="30m">30 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Signals List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-3 text-slate-300">Loading alpha signals...</span>
            </div>
          ) : filteredSignals.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <p className="text-slate-400">No alpha signals found matching your filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredSignals.map((signal) => (
              <Card key={signal.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          {signal.change > 100 && <TrendingUp className="h-5 w-5 text-yellow-400 animate-pulse" />}
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                            {signal.token}
                          </h3>
                        </div>
                        <Badge className={`${getStrengthBadgeClass(signal.strength)} font-semibold`} variant="outline">
                          {signal.strength.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-medium">
                          {signal.metadata.signalType?.toUpperCase() || "ALPHA"}
                        </Badge>
                        {signal.metadata.channelName && (
                          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {signal.metadata.channelName}
                          </Badge>
                        )}
                        {signal.metadata.channelWinRate && (
                          <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                            {signal.metadata.channelWinRate}% Win Rate
                          </Badge>
                        )}
                        {signal.metadata.source === 'telegram' && (
                          <Badge variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 flex items-center gap-1">
                            {signal.metadata.telegramSource === 'telegram_bot' ? <Bot className="h-3 w-3" /> : <MessageCircle className="h-3 w-3" />}
                            {signal.metadata.telegramSource === 'telegram_bot' ? 'BOT' : 'CHANNEL'}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent" />
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-green-300">Performance</p>
                              <Zap className="h-4 w-4 text-green-400" />
                            </div>
                            <p className="text-2xl font-bold text-green-400 mb-1">{signal.value}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-semibold text-green-300">+{signal.change?.toFixed(0) || 0}%</p>
                              {signal.change > 200 && (
                                <span className="text-xs bg-yellow-500/30 text-yellow-300 px-2 py-1 rounded-full">🔥 MEGA</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border border-slate-600/50">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-400">Price Movement</p>
                            <Target className="h-4 w-4 text-slate-400" />
                          </div>
                          {signal.metadata.priceFrom && signal.metadata.priceTo ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-300 font-medium">From:</span>
                                <span className="text-slate-200 font-mono">{signal.metadata.priceFrom}</span>
                              </div>
                              <div className="flex items-center justify-center">
                                <Zap className="h-4 w-4 text-blue-400" />
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-300 font-medium">To:</span>
                                <span className="text-green-400 font-mono font-semibold">{signal.metadata.priceTo}</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-400">Price data pending...</p>
                          )}
                        </div>

                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/30">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-blue-300">Analysis</p>
                            <BarChart3 className="h-4 w-4 text-blue-400" />
                          </div>
                          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm px-3 py-2 rounded-lg transition-all duration-300 font-medium group-hover:shadow-md">
                            🔍 Scan with {signal.metadata.scannerBot || "@soul_scanner_bot"}
                          </button>
                          {signal.metadata.performanceType && (
                            <p className="text-xs text-purple-300 mt-2 text-center">{signal.metadata.performanceType}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="lg:text-right space-y-3 lg:min-w-[120px]">
                      <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                        <div className="text-center">
                          <span className="text-xs text-slate-400 block mb-1">CONFIDENCE</span>
                          <span className={`text-2xl font-bold ${
                            signal.confidence >= 90 ? "text-green-400" : 
                            signal.confidence >= 80 ? "text-yellow-400" : "text-orange-400"
                          }`}>
                            {signal.confidence}%
                          </span>
                        </div>
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        <div className="flex lg:flex-col items-center lg:items-end gap-1">
                          <span className="text-xs text-slate-400">RISK</span>
                          <span className={`text-sm font-bold px-2 py-1 rounded-md ${getRiskBadgeClass(signal.metadata.riskLevel || '')}`}>
                            {signal.metadata.riskLevel?.toUpperCase() || "UNKNOWN"}
                          </span>
                        </div>
                        {signal.metadata.riskRewardRatio && (
                          <div className="flex lg:flex-col items-center lg:items-end gap-1">
                            <span className="text-xs text-slate-400">R:R</span>
                            <span className="text-sm font-bold text-purple-400">{signal.metadata.riskRewardRatio}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center lg:justify-end gap-1 text-xs text-slate-500 mt-3">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(signal.timestamp)}
                      </div>
                    </div>
                  </div>

                  {signal.metadata.rawMessage && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <details className="group">
                        <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                          📱 View Original Message
                        </summary>
                        <div className="mt-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                          <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
                            {signal.metadata.rawMessage.length > 200 
                              ? `${signal.metadata.rawMessage.substring(0, 200)}...` 
                              : signal.metadata.rawMessage}
                          </p>
                        </div>
                      </details>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-8 space-y-4">
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${isRealData ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />
                  <span className="text-sm font-medium text-slate-300">{isRealData ? "Live Channels" : "Demo Mode"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Last update: {lastUpdate.toLocaleTimeString()}</span>
                </div>
                {autoRefresh && (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-green-400 animate-spin" />
                    <span className="text-sm text-green-400">Auto-refresh every {refreshInterval}s</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-slate-400">
                  <span className="text-white font-semibold">{signals.length}</span> total signals
                </div>
                <div className="text-slate-400">
                  <span className="text-green-400 font-semibold">{signals.filter(s => s.confidence >= 85).length}</span> high confidence
                </div>
                <div className="text-slate-400">
                  <span className="text-red-400 font-semibold">{signals.filter(s => s.strength === 'critical').length}</span> critical
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/20 rounded-lg p-3 text-center border border-slate-700/30">
              <div className="text-lg font-bold text-white">{stats.averageConfidence}%</div>
              <div className="text-xs text-slate-400">Avg Confidence</div>
            </div>
            <div className="bg-slate-800/20 rounded-lg p-3 text-center border border-slate-700/30">
              <div className="text-lg font-bold text-green-400">
                {signals.length > 0 ? Math.round(signals.reduce((acc, signal) => acc + signal.change, 0) / signals.length) : 0}%
              </div>
              <div className="text-xs text-slate-400">Avg Performance</div>
            </div>
            <div className="bg-slate-800/20 rounded-lg p-3 text-center border border-slate-700/30">
              <div className="text-lg font-bold text-blue-400">
                {signals.filter(s => s.metadata.channelWinRate && s.metadata.channelWinRate > 85).length}
              </div>
              <div className="text-xs text-slate-400">Elite Channels</div>
            </div>
            <div className="bg-slate-800/20 rounded-lg p-3 text-center border border-slate-700/30">
              <div className="text-lg font-bold text-purple-400">
                {signals.filter(s => s.change > 100).length}
              </div>
              <div className="text-xs text-slate-400">Mega Gains (100%+)</div>
            </div>
          </div>

          <div className="text-center text-slate-500 text-sm">
            {isRealData 
              ? `🔥 Live alpha signals: Market data + ${telegramStats.totalTelegramSignals} Telegram signals from ${telegramStats.channelSignals + telegramStats.botSignals > 0 ? `${telegramStats.channelSignals} channels & ${telegramStats.botSignals} bots` : 'premium sources'}` 
              : "📊 Demo mode - Connect your Telegram bot for real-time alpha signals"}
          </div>
        </div>
      </div>
    </div>
  );
}