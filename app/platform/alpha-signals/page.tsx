'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SparklesText } from '@/components/ui/sparkles-text';
import { GlowBorder } from '@/components/ui/glow-border';
import { NumberTicker } from '@/components/ui/number-ticker';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Clock,
  BarChart3,
  Fish,
  Zap,
  DollarSign,
  TrendingUp as TrendingUpIcon,
  Rocket,
  Circle,
  Activity,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';

// Tab state
type ActiveTab = "trending" | "new" | "leaderboard";

// Types for real-time data
interface TrendingToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
}

interface WhaleTransaction {
  id: string;
  walletName: string;
  token: string;
  amount: number;
  action: 'BUY' | 'SELL';
  type: string;
  timestamp: string;
}

interface LaunchpadStats {
  totalLiquidity: number;
  volume24h: number;
  launchpadsTracked: number;
  newTokensPerHour: number;
  topPerformer: { name: string; change24h: number };
  marketTrend: string;
}

interface NewToken {
  id: string;
  symbol: string;
  name: string;
  description: string;
  currentPrice: number;
  priceChange: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  holders: number;
  riskLevel: string;
  isVerified: boolean;
  createdAt: string;
  mintAddress: string;
}

interface LeaderboardToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  marketCapRank?: number;
  launchpad: string;
  launchpadLogo: string;
  isGraduated: boolean;
  liquidityLocked: boolean;
}

export default function AlphaSignalsPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>("trending");
  const [isOnline] = useState(navigator.onLine);
  
  // Real-time data state
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([]);
  const [whaleTransactions, setWhaleTransactions] = useState<WhaleTransaction[]>([]);
  const [launchpadStats, setLaunchpadStats] = useState<LaunchpadStats | null>(null);
  const [newTokens, setNewTokens] = useState<NewToken[]>([]);
  const [leaderboardTokens, setLeaderboardTokens] = useState<LeaderboardToken[]>([]);
  
  // Loading states
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [isLoadingWhales, setIsLoadingWhales] = useState(true);
  const [isLoadingLaunchpad, setIsLoadingLaunchpad] = useState(true);
  const [isLoadingNew, setIsLoadingNew] = useState(true);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  
  // Error states
  const [errorTrending, setErrorTrending] = useState<string | null>(null);
  const [errorWhales, setErrorWhales] = useState<string | null>(null);
  const [errorLaunchpad, setErrorLaunchpad] = useState<string | null>(null);
  const [errorNew, setErrorNew] = useState<string | null>(null);
  const [errorLeaderboard, setErrorLeaderboard] = useState<string | null>(null);

  // Real-time data fetching functions
  const fetchTrendingTokens = async () => {
    try {
      setIsLoadingTrending(true);
      setErrorTrending(null);
      const response = await fetch('/api/signals?type=trending&limit=6');
      if (!response.ok) throw new Error('Failed to fetch trending tokens');
      const data = await response.json();
      
      if (data.tokens) {
        const tokens: TrendingToken[] = data.tokens.map((token: any) => ({
          id: token.id || token.symbol,
          symbol: token.symbol,
          name: token.name,
          price: token.current_price || 0,
          priceChange24h: token.price_change_percentage_24h || 0,
          volume24h: token.total_volume || 0,
          marketCap: token.market_cap || 0
        }));
        setTrendingTokens(tokens);
      }
    } catch (error) {
      setErrorTrending(error instanceof Error ? error.message : 'Failed to fetch trending tokens');
    } finally {
      setIsLoadingTrending(false);
    }
  };

  const fetchWhaleTransactions = async () => {
    try {
      setIsLoadingWhales(true);
      setErrorWhales(null);
      const response = await fetch('/api/whales/transactions?limit=5&timeframe=24h');
      if (!response.ok) throw new Error('Failed to fetch whale transactions');
      const data = await response.json();
      
      if (data.success && data.data?.recentTransactions) {
        const transactions: WhaleTransaction[] = data.data.recentTransactions.map((tx: any) => ({
          id: tx.id || `tx-${Date.now()}-${Math.random()}`,
          walletName: tx.walletName || tx.wallet?.label || 'Unknown',
          token: tx.tokenSymbol || tx.token || 'UNKNOWN',
          amount: tx.usdValue || 0,
          action: tx.transactionType === 'BUY' ? 'BUY' : 'SELL',
          type: tx.wallet?.category || 'UNKNOWN',
          timestamp: tx.timestamp || new Date().toISOString()
        }));
        setWhaleTransactions(transactions);
      }
    } catch (error) {
      setErrorWhales(error instanceof Error ? error.message : 'Failed to fetch whale transactions');
    } finally {
      setIsLoadingWhales(false);
    }
  };

  const fetchLaunchpadStats = async () => {
    try {
      setIsLoadingLaunchpad(true);
      setErrorLaunchpad(null);
      const response = await fetch('/api/launchpad-intelligence');
      if (!response.ok) throw new Error('Failed to fetch launchpad stats');
      const data = await response.json();
      
      if (data.intelligence) {
        const stats = data.intelligence.aggregatedStats;
        const launchpadData: LaunchpadStats = {
          totalLiquidity: stats.totalLiquidity || 0,
          volume24h: stats.volume24h || 0,
          launchpadsTracked: stats.launchpadsTracked || 0,
          newTokensPerHour: stats.newTokensPerHour || 0,
          topPerformer: stats.topPerformer || { name: 'N/A', change24h: 0 },
          marketTrend: data.intelligence.marketAnalysis?.trend || 'neutral'
        };
        setLaunchpadStats(launchpadData);
      }
    } catch (error) {
      setErrorLaunchpad(error instanceof Error ? error.message : 'Failed to fetch launchpad stats');
    } finally {
      setIsLoadingLaunchpad(false);
    }
  };

  const fetchNewTokens = async () => {
    try {
      setIsLoadingNew(true);
      setErrorNew(null);
      const response = await fetch('/api/solana-new-tokens?limit=10');
      if (!response.ok) throw new Error('Failed to fetch new tokens');
      const data = await response.json();
      
      if (data.tokens) {
        const tokens: NewToken[] = data.tokens.map((token: any) => ({
          id: token.id || token.mintAddress,
          symbol: token.symbol,
          name: token.name,
          description: token.description || 'New Solana token',
          currentPrice: token.price || 0,
          priceChange: token.priceChange || 0,
          marketCap: token.marketCap || 0,
          volume24h: token.volume24h || 0,
          liquidity: token.liquidity || 0,
          holders: token.holders || 0,
          riskLevel: token.riskLevel || 'MEDIUM',
          isVerified: token.isVerified || false,
          createdAt: token.createdAt || new Date().toISOString(),
          mintAddress: token.mintAddress
        }));
        setNewTokens(tokens);
      }
    } catch (error) {
      setErrorNew(error instanceof Error ? error.message : 'Failed to fetch new tokens');
    } finally {
      setIsLoadingNew(false);
    }
  };

  const fetchLeaderboardTokens = async () => {
    try {
      setIsLoadingLeaderboard(true);
      setErrorLeaderboard(null);
      const response = await fetch('/api/coingecko-memes?limit=20');
      if (!response.ok) throw new Error('Failed to fetch leaderboard tokens');
      const data = await response.json();
      
      if (data.tokens) {
        const tokens: LeaderboardToken[] = data.tokens.map((token: any, index: number) => ({
          id: token.id || `token-${index}`,
          symbol: token.symbol,
          name: token.name,
          image: token.image || '',
          currentPrice: token.current_price || 0,
          priceChange24h: token.price_change_percentage_24h || 0,
          marketCap: token.market_cap || 0,
          volume24h: token.total_volume || 0,
          marketCapRank: token.market_cap_rank,
          launchpad: token.launchpad || 'Unknown',
          launchpadLogo: '🚀',
          isGraduated: token.isGraduated || false,
          liquidityLocked: token.liquidityLocked || false
        }));
        setLeaderboardTokens(tokens);
      }
    } catch (error) {
      setErrorLeaderboard(error instanceof Error ? error.message : 'Failed to fetch leaderboard tokens');
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'trending') {
      fetchTrendingTokens();
    } else if (activeTab === 'new') {
      fetchNewTokens();
    } else if (activeTab === 'leaderboard') {
      fetchLeaderboardTokens();
    }
  }, [activeTab]);

  // Fetch initial data
  useEffect(() => {
    fetchTrendingTokens();
    fetchWhaleTransactions();
    fetchLaunchpadStats();
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'trending') {
        fetchTrendingTokens();
      } else if (activeTab === 'new') {
        fetchNewTokens();
      } else if (activeTab === 'leaderboard') {
        fetchLeaderboardTokens();
      }
      fetchWhaleTransactions();
      fetchLaunchpadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      // Refresh data when coming back online
      if (activeTab === 'trending') {
        fetchTrendingTokens();
      } else if (activeTab === 'new') {
        fetchNewTokens();
      } else if (activeTab === 'leaderboard') {
        fetchLeaderboardTokens();
      }
      fetchWhaleTransactions();
      fetchLaunchpadStats();
    };
    const handleOffline = () => console.log('Offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [activeTab]);

  // Utility functions
  const formatCurrency = (value: number): string => {
    if (isNaN(value) || value === null || value === undefined) return '$0.00';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatVolume = (value: number): string => {
    if (isNaN(value) || value === null || value === undefined) return '$0 Vol';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B Vol`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M Vol`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K Vol`;
    return `$${value.toFixed(0)} Vol`;
  };

  const formatTimeAgo = (timestamp: string): string => {
    try {
      const now = new Date();
      const time = new Date(timestamp);
      if (isNaN(time.getTime())) return 'Unknown';
      
      const diffMs = now.getTime() - time.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffHours < 1) return 'Just now';
      if (diffHours === 1) return '1h ago';
      if (diffHours < 24) return `${diffHours}h ago`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Unknown';
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "trending":
        return (
          <div className="space-y-6 min-h-[calc(100vh-12rem)]">
            <div className="flex items-center justify-between mb-6">
              <SparklesText 
                text="Alpha Signals Feed"
                className="text-2xl font-semibold text-foreground"
                colors={{
                  first: 'rgb(239, 68, 68)',
                  second: 'rgb(249, 115, 22)',
                }}
                sparklesCount={5}
              />
              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                Live
              </Badge>
            </div>

            <div className="w-full h-[calc(100vh-16rem)] rounded-lg overflow-hidden border border-border">
              <iframe 
                src="https://rss.app/embed/v1/feed/_xegk27P1igGNXPcH" 
                className="w-full h-full border-0"
                title="Alpha Signals RSS Feed"
                data-height="600"
              />
            </div>
          </div>
        );

      case "new":
        return (
          <div className="space-y-6 min-h-[calc(100vh-12rem)]">
            <div className="flex items-center justify-between mb-6">
              <SparklesText 
                text="New Solana Tokens"
                className="text-xl font-semibold"
                colors={{
                  first: 'rgb(34, 197, 94)',
                  second: 'rgb(59, 130, 246)',
                }}
                sparklesCount={5}
              />
              <Badge variant="outline" className="text-green-600 border-green-200">
                Real-time
              </Badge>
            </div>

            {launchpadStats && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-900">Launch Activity</h3>
                      <p className="text-sm text-green-700">
                        <NumberTicker 
                          value={launchpadStats.newTokensPerHour} 
                          decimalPlaces={1}
                          className="font-semibold"
                        /> tokens launching/hour
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-900">
                        {newTokens.length} Live Tokens
                      </div>
                      <p className="text-sm text-green-700">
                        Last 2 hours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoadingNew ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-slate-400 text-sm">Loading new tokens...</p>
              </div>
            ) : errorNew ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-slate-400 text-sm mb-2">{errorNew}</p>
                <Button size="sm" onClick={fetchNewTokens} className="bg-green-600 hover:bg-green-700">
                  Retry
                </Button>
              </div>
            ) : newTokens.length > 0 ? (
              <div className="space-y-3">
                {newTokens.slice(0, 3).map((token) => (
                <GlowBorder key={token.id}>
                  <Card className="border-border/30 bg-card/50 backdrop-blur-xl hover:bg-card/70 hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {token.symbol.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-foreground">{token.symbol}</span>
                              <Badge className="bg-green-600 text-white">
                                NEW
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-foreground mb-1">{token.name}</p>
                            
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>💰 {formatCurrency(token.marketCap)}</span>
                              <span>📊 {formatVolume(token.volume24h)} Vol</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${token.priceChange > 0 ? "text-green-600" : "text-red-600"}`}>
                            {token.priceChange > 0 ? "+" : ""}
                            {token.priceChange.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            ${token.currentPrice.toFixed(token.currentPrice < 0.01 ? 6 : 4)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </GlowBorder>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p>No new tokens available</p>
            </div>
          )}
        </div>
      );

      case "leaderboard":
        return (
          <div className="space-y-6 min-h-[calc(100vh-12rem)]">
            <div className="flex items-center justify-between mb-6">
              <SparklesText 
                text="Launchpad Meme Leaderboard"
                className="text-xl font-semibold"
                colors={{
                  first: 'rgb(239, 68, 68)',
                  second: 'rgb(249, 115, 22)',
                }}
                sparklesCount={5}
              />
              <Badge variant="outline" className="text-red-600 border-red-200">
                Real-time
              </Badge>
            </div>

            {isLoadingLeaderboard ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-slate-400 text-sm">Loading leaderboard...</p>
              </div>
            ) : errorLeaderboard ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-slate-400 text-sm mb-2">{errorLeaderboard}</p>
                <Button size="sm" onClick={fetchLeaderboardTokens} className="bg-red-600 hover:bg-red-700">
                  Retry
                </Button>
              </div>
            ) : leaderboardTokens.length > 0 ? (
              <div className="space-y-3">
                {leaderboardTokens.map((token, index) => (
                  <GlowBorder key={token.id}>
                    <Card className="border-border/30 bg-card/50 backdrop-blur-xl hover:bg-card/70 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg">
                              {index + 1}
                            </div>
                            <div className="h-12 w-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                              {token.symbol.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-foreground">{token.symbol}</span>
                                <Badge variant="outline" className="text-orange-600 border-orange-200">
                                  🚀 Launchpad
                                </Badge>
                              </div>
                              <p className="text-sm font-medium text-foreground mb-1">{token.name}</p>
                              <div className="flex gap-3 text-xs text-muted-foreground">
                                <span>📊 {formatVolume(token.volume24h)} Vol</span>
                                <span>💰 {formatCurrency(token.marketCap)} MCap</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-foreground text-lg">
                              {formatCurrency(token.marketCap)}
                            </div>
                            <div className="text-sm text-muted-foreground mb-1">
                              ${token.currentPrice.toFixed(token.currentPrice < 0.01 ? 6 : 4)}
                            </div>
                            <div className={`text-sm font-medium ${token.priceChange24h > 0 ? "text-green-600" : "text-red-600"}`}>
                              {token.priceChange24h > 0 ? "+" : ""}
                              {token.priceChange24h.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </GlowBorder>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>No leaderboard data available</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Tab navigation helpers
  const tabOrder: Array<"trending" | "new" | "leaderboard"> = ["trending", "new", "leaderboard"];
  
  function handleTabKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    tab: "trending" | "new" | "leaderboard"
  ) {
    const idx = tabOrder.indexOf(tab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveTab(tabOrder[(idx + 1) % tabOrder.length]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveTab(tabOrder[(idx - 1 + tabOrder.length) % tabOrder.length]);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveTab(tab);
    }
  }

  // No loading state needed with mock data

  return (
    <>
      {/* No error banner needed with mock data */}

      {/* No network status indicator needed with mock data */}

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Alpha Signals</h1>
        <p className="text-slate-400">Real-time crypto intelligence and market analysis.</p>
        
        {/* Tab Buttons */}
        <div className="flex gap-4 mt-6">
          <Button 
            className={`${activeTab === 'trending' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
            onClick={() => setActiveTab('trending')}
            onKeyDown={(e) => handleTabKeyDown(e, 'trending')}
          >
            Trending
          </Button>
          <Button 
            className={`${activeTab === 'new' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
            onClick={() => setActiveTab('new')}
            onKeyDown={(e) => handleTabKeyDown(e, 'new')}
          >
            New
          </Button>
          <Button 
            className={`${activeTab === 'leaderboard' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
            onClick={() => setActiveTab('leaderboard')}
            onKeyDown={(e) => handleTabKeyDown(e, 'leaderboard')}
          >
            Leaderboard
          </Button>
        </div>

        {/* Status and Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last update: {new Date().toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-400" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-400" />
              )}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        
        {/* Left Column */}
        <div className="space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          
          {/* How It Works */}
          <Card className="bg-slate-800 border-slate-700 min-h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
                    1
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Connect with your Solana Wallet, or Sign Up with Email and we&apos;ll create you a Smart Solana Wallet automatically
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
                    2
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Study Smart Money with Real Time Trench Signals and aggregated market and social data
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
                    3
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Make smarter buys and sell instantly for bigger paydays
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meme Launchpad Stats */}
          <Card className="bg-slate-800 border-slate-700 min-h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Meme Launchpad Stats
                <Badge className="bg-red-600 text-white text-xs">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingLaunchpad ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-slate-400 text-sm">Loading launchpad data...</p>
                </div>
              ) : errorLaunchpad ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-slate-400 text-sm mb-2">{errorLaunchpad}</p>
                  <Button size="sm" onClick={fetchLaunchpadStats} className="bg-red-600 hover:bg-red-700">
                    Retry
                  </Button>
                </div>
              ) : launchpadStats ? (
                <>
                  {/* Market Trend */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Market Trend</span>
                    <Badge variant="outline" className="border-orange-500 text-orange-400">
                      {launchpadStats.marketTrend.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(launchpadStats.totalLiquidity)}
                      </div>
                      <div className="text-xs text-slate-400">Total Liquidity</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <TrendingUpIcon className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(launchpadStats.volume24h)}
                      </div>
                      <div className="text-xs text-slate-400">24h Volume</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <Rocket className="h-6 w-6 text-red-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {launchpadStats.launchpadsTracked}
                      </div>
                      <div className="text-xs text-slate-400">Launchpads</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <Circle className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {launchpadStats.newTokensPerHour}
                      </div>
                      <div className="text-xs text-slate-400">Tokens/Hour</div>
                    </div>
                  </div>

                  {/* Top Performer */}
                  <div className="border-t border-slate-700 pt-4">
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Top Performer</div>
                      <div className="text-lg font-bold text-white">
                        {launchpadStats.topPerformer.name}
                      </div>
                      <div className={`text-sm ${
                        launchpadStats.topPerformer.change24h > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {launchpadStats.topPerformer.change24h > 0 ? '+' : ''}{launchpadStats.topPerformer.change24h.toFixed(1)}% 24h
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p>No launchpad data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Tabbed Content */}
        <div className="space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          <Card className="bg-slate-800 border-slate-700 min-h-full">
            <CardContent className="p-6 h-full">
              {renderContent()}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          
          {/* Going Viral */}
          <Card className="bg-slate-800 border-slate-700 min-h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-500" />
                Going Viral
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingTrending ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-slate-400 text-sm">Loading trending tokens...</p>
                </div>
              ) : errorTrending ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-slate-400 text-sm mb-2">{errorTrending}</p>
                  <Button size="sm" onClick={fetchTrendingTokens} className="bg-red-600 hover:bg-red-700">
                    Retry
                  </Button>
                </div>
              ) : trendingTokens.length > 0 ? (
                <div className="space-y-3">
                  {trendingTokens.map((token) => (
                  <div key={token.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{token.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{token.symbol}</div>
                        <div className="text-sm text-slate-400">{formatCurrency(token.price)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">{formatVolume(token.volume24h)}</div>
                      <div className={`text-sm font-semibold ${
                        token.priceChange24h > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>No trending data available</p>
              </div>
            )}
            </CardContent>
          </Card>

          {/* Top Traders */}
          <Card className="bg-slate-800 border-slate-700 min-h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Top Traders
                <Badge className="bg-red-600 text-white text-xs">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingWhales ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-slate-400 text-sm">Loading whale activity...</p>
                </div>
              ) : errorWhales ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-slate-400 text-sm mb-2">{errorWhales}</p>
                  <Button size="sm" onClick={fetchWhaleTransactions} className="bg-red-600 hover:bg-red-700">
                    Retry
                  </Button>
                </div>
              ) : whaleTransactions.length > 0 ? (
                <div className="space-y-3">
                  {whaleTransactions.map((trader) => (
                  <div key={trader.id} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{trader.walletName.slice(0, 1).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-white">{trader.walletName}</div>
                          <div className="text-sm text-slate-400">{trader.token}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">{formatCurrency(trader.amount)}</div>
                        <div className={`text-xs font-semibold ${
                          trader.action === 'BUY' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {trader.action}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{trader.type}</span>
                      <span>{formatTimeAgo(trader.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>No whale activity data</p>
              </div>
            )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-700 flex justify-between items-center">
        <div className="text-sm text-slate-400">
          © 2024 Hades.AG - Elite Crypto Intelligence
        </div>
        <div className="flex gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>
      </div>
    </>
  );
}