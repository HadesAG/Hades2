'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataAggregator, AlphaSignal } from '@/lib/data-services';
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

const dataAggregator = new DataAggregator();

// Types for our real-time data
interface TrendingToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
}

interface LaunchpadStats {
  totalLiquidity: number;
  volume24h: number;
  launchpadsTracked: number;
  newTokensPerHour: number;
  topPerformer: {
    name: string;
    change24h: number;
  };
  marketTrend: string;
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

interface AlphaSignalData {
  id: string;
  symbol: string;
  performance: string;
  performanceValue: number;
  priceMovement: {
    current: number;
    target: number;
  };
  confidence: number;
  timestamp: string;
}

// Error and loading states
interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
  retryCount: number;
}

interface AppState {
  alphaSignals: DataState<AlphaSignalData[]>;
  trendingTokens: DataState<TrendingToken[]>;
  launchpadStats: DataState<LaunchpadStats>;
  whaleTransactions: DataState<WhaleTransaction[]>;
  isOnline: boolean;
  globalError: string | null;
}

// Default fallback data
const DEFAULT_LAUNCHPAD_STATS: LaunchpadStats = {
  totalLiquidity: 0,
  volume24h: 0,
  launchpadsTracked: 0,
  newTokensPerHour: 0,
  topPerformer: { name: 'N/A', change24h: 0 },
  marketTrend: 'neutral'
};

const DEFAULT_TRENDING_TOKENS: TrendingToken[] = [
  { id: 'sol', symbol: 'SOL', name: 'Solana', price: 0, priceChange24h: 0, volume24h: 0, marketCap: 0 },
  { id: 'bonk', symbol: 'BONK', name: 'Bonk', price: 0, priceChange24h: 0, volume24h: 0, marketCap: 0 },
  { id: 'wif', symbol: 'WIF', name: 'dogwifhat', price: 0, priceChange24h: 0, volume24h: 0, marketCap: 0 }
];

const DEFAULT_WHALE_TRANSACTIONS: WhaleTransaction[] = [
  { id: '1', walletName: 'Loading...', token: 'SOL', amount: 0, action: 'BUY', type: 'UNKNOWN', timestamp: new Date().toISOString() }
];

export default function AlphaSignalsPage() {
  // Enhanced state management with error handling
  const [appState, setAppState] = useState<AppState>({
    alphaSignals: { data: null, loading: true, error: null, lastFetch: null, retryCount: 0 },
    trendingTokens: { data: null, loading: true, error: null, lastFetch: null, retryCount: 0 },
    launchpadStats: { data: null, loading: true, error: null, lastFetch: null, retryCount: 0 },
    whaleTransactions: { data: null, loading: true, error: null, lastFetch: null, retryCount: 0 },
    isOnline: navigator.onLine,
    globalError: null
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setAppState(prev => ({ ...prev, isOnline: true, globalError: null }));
    const handleOffline = () => setAppState(prev => ({ ...prev, isOnline: false, globalError: 'Network connection lost' }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  // Enhanced error handling with retry logic
  const handleApiError = useCallback((section: keyof Omit<AppState, 'isOnline' | 'globalError'>, error: any, retryDelay = 5000) => {
    console.error(`Error fetching ${section}:`, error);
    
    const errorMessage = error?.message || 'Failed to fetch data';
    const isNetworkError = !navigator.onLine || error?.name === 'TypeError' || error?.message?.includes('fetch');
    
    setAppState(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        loading: false,
        error: isNetworkError ? 'Network error - check connection' : errorMessage,
        retryCount: prev[section].retryCount + 1
      }
    }));

    // Auto-retry with exponential backoff (max 5 retries)
    const currentRetryCount = appState[section].retryCount;
    if (currentRetryCount < 5 && isNetworkError) {
      retryTimeoutRef.current = setTimeout(() => {
        fetchSectionData(section);
      }, retryDelay * Math.pow(2, currentRetryCount));
    }
  }, [appState]);

  // Individual section data fetching with error handling
  const fetchSectionData = useCallback(async (section: keyof Omit<AppState, 'isOnline' | 'globalError'>) => {
    if (!navigator.onLine) {
      handleApiError(section, { message: 'No internet connection' });
      return;
    }

    setAppState(prev => ({
      ...prev,
      [section]: { ...prev[section], loading: true, error: null }
    }));

    try {
      let response: Response;
      let data: any;

      switch (section) {
        case 'alphaSignals':
          response = await fetch('/api/alpha-signals');
          if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          data = await response.json();
          
          if (data.signals && data.signals.length > 0) {
            const topSignal = data.signals
              .filter((s: any) => s.confidence >= 80)
              .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            
            if (topSignal) {
              const signalData: AlphaSignalData = {
                id: topSignal.id,
                symbol: topSignal.symbol,
                performance: topSignal.value || 'TRENDING',
                performanceValue: topSignal.change || 0,
                priceMovement: {
                  current: parseFloat(topSignal.metadata?.priceFrom?.replace('$', '') || '0'),
                  target: parseFloat(topSignal.metadata?.priceTo?.replace('$', '') || '0')
                },
                confidence: topSignal.confidence,
                timestamp: topSignal.timestamp
              };
              
              setAppState(prev => ({
                ...prev,
                alphaSignals: {
                  data: [signalData],
                  loading: false,
                  error: null,
                  lastFetch: new Date(),
                  retryCount: 0
                }
              }));
            } else {
              setAppState(prev => ({
                ...prev,
                alphaSignals: {
                  data: [],
                  loading: false,
                  error: null,
                  lastFetch: new Date(),
                  retryCount: 0
                }
              }));
            }
          }
          break;

        case 'trendingTokens':
          response = await fetch('/api/signals?type=trending&limit=6');
          if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          data = await response.json();
          
          if (data.tokens) {
            const tokens: TrendingToken[] = data.tokens.slice(0, 6).map((token: any) => ({
              id: token.id,
              symbol: token.symbol,
              name: token.name,
              price: token.current_price || 0,
              priceChange24h: token.price_change_percentage_24h || 0,
              volume24h: token.total_volume || 0,
              marketCap: token.market_cap || 0
            }));
            
            setAppState(prev => ({
              ...prev,
              trendingTokens: {
                data: tokens,
                loading: false,
                error: null,
                lastFetch: new Date(),
                retryCount: 0
              }
            }));
          }
          break;

        case 'launchpadStats':
          response = await fetch('/api/launchpad-intelligence');
          if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          data = await response.json();
          
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
            
            setAppState(prev => ({
              ...prev,
              launchpadStats: {
                data: launchpadData,
                loading: false,
                error: null,
                lastFetch: new Date(),
                retryCount: 0
              }
            }));
          }
          break;

        case 'whaleTransactions':
          response = await fetch('/api/whales/transactions?limit=5&timeframe=24h');
          if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          data = await response.json();
          
          if (data.success && data.data.recentTransactions) {
            const transactions: WhaleTransaction[] = data.data.recentTransactions.slice(0, 5).map((tx: any) => ({
              id: tx.id || `tx-${Date.now()}-${Math.random()}`,
              walletName: tx.walletName || tx.wallet?.label || 'Unknown',
              token: tx.tokenSymbol || tx.token || 'UNKNOWN',
              amount: tx.usdValue || 0,
              action: tx.transactionType === 'BUY' ? 'BUY' : 'SELL',
              type: tx.wallet?.category || 'UNKNOWN',
              timestamp: tx.timestamp || new Date().toISOString()
            }));
            
            setAppState(prev => ({
              ...prev,
              whaleTransactions: {
                data: transactions,
                loading: false,
                error: null,
                lastFetch: new Date(),
                retryCount: 0
              }
            }));
          }
          break;
      }
    } catch (error) {
      handleApiError(section, error);
    }
  }, [handleApiError]);

  // Fetch all data with enhanced error handling
  const fetchAllData = useCallback(async (isManualRefresh = false) => {
    if (!navigator.onLine) {
      setAppState(prev => ({ ...prev, globalError: 'No internet connection' }));
      return;
    }

    if (isManualRefresh) {
      setIsRefreshing(true);
    }

    try {
      // Clear any existing errors
      setAppState(prev => ({ ...prev, globalError: null }));

      // Fetch all sections in parallel with individual error handling
      await Promise.allSettled([
        fetchSectionData('alphaSignals'),
        fetchSectionData('trendingTokens'),
        fetchSectionData('launchpadStats'),
        fetchSectionData('whaleTransactions')
      ]);

    } catch (error) {
      console.error('Error in fetchAllData:', error);
      setAppState(prev => ({ 
        ...prev, 
        globalError: 'Failed to refresh data. Please try again.' 
      }));
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchSectionData]);

  // Initialize data fetching
  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 30 seconds
    refreshTimeoutRef.current = setInterval(() => {
      if (navigator.onLine && !appState.globalError) {
        fetchAllData();
      }
    }, 30000);

    return () => {
      if (refreshTimeoutRef.current) clearInterval(refreshTimeoutRef.current);
    };
  }, [fetchAllData]);

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

  // Loading state
  if (appState.alphaSignals.loading && !appState.alphaSignals.data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-red-500 font-semibold">Loading Alpha Signals...</div>
          <div className="text-slate-400 text-sm mt-2">Initializing real-time data feeds</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Global Error Banner */}
      {appState.globalError && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{appState.globalError}</span>
            <Button 
              size="sm" 
              variant="outline" 
              className="ml-4 border-white text-white hover:bg-red-700"
              onClick={() => setAppState(prev => ({ ...prev, globalError: null }))}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Network Status Indicator */}
      {!appState.isOnline && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-yellow-600 text-white p-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span>You are currently offline. Some features may be unavailable.</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Alpha Signals</h1>
        <p className="text-slate-400">Real-time crypto intelligence and market analysis.</p>
        
        {/* Tab Buttons */}
        <div className="flex gap-4 mt-6">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Alpha Signals
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            <Fish className="h-4 w-4 mr-2" />
            Smart Money
          </Button>
        </div>

        {/* Status and Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last update: {appState.alphaSignals.lastFetch?.toLocaleTimeString() || 'Never'}
            </div>
            <div className="flex items-center gap-2">
              {appState.isOnline ? (
                <Wifi className="h-4 w-4 text-green-400" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-400" />
              )}
              <span>{appState.isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchAllData(true)}
            disabled={isRefreshing || !appState.isOnline}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
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
              {appState.launchpadStats.loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-slate-400 text-sm">Loading launchpad data...</p>
                </div>
              ) : appState.launchpadStats.error ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-slate-400 text-sm mb-2">{appState.launchpadStats.error}</p>
                  <Button 
                    size="sm" 
                    onClick={() => fetchSectionData('launchpadStats')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  {/* Market Trend */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Market Trend</span>
                    <Badge variant="outline" className={`${
                      appState.launchpadStats.data?.marketTrend === 'bullish' 
                        ? 'border-green-500 text-green-400' 
                        : appState.launchpadStats.data?.marketTrend === 'bearish'
                        ? 'border-red-500 text-red-400'
                        : 'border-orange-500 text-orange-400'
                    }`}>
                      {appState.launchpadStats.data?.marketTrend?.toUpperCase() || 'NEUTRAL'}
                    </Badge>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(appState.launchpadStats.data?.totalLiquidity || 0)}
                      </div>
                      <div className="text-xs text-slate-400">Total Liquidity</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <TrendingUpIcon className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(appState.launchpadStats.data?.volume24h || 0)}
                      </div>
                      <div className="text-xs text-slate-400">24h Volume</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <Rocket className="h-6 w-6 text-red-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {appState.launchpadStats.data?.launchpadsTracked || 0}
                      </div>
                      <div className="text-xs text-slate-400">Launchpads</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <Circle className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {appState.launchpadStats.data?.newTokensPerHour || 0}
                      </div>
                      <div className="text-xs text-slate-400">Tokens/Hour</div>
                    </div>
                  </div>

                  {/* Top Performer */}
                  <div className="border-t border-slate-700 pt-4">
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Top Performer</div>
                      <div className="text-lg font-bold text-white">
                        {appState.launchpadStats.data?.topPerformer?.name || 'N/A'}
                      </div>
                      <div className={`text-sm ${
                        (appState.launchpadStats.data?.topPerformer?.change24h || 0) > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {appState.launchpadStats.data?.topPerformer?.change24h !== undefined ? 
                          `${(appState.launchpadStats.data.topPerformer.change24h > 0 ? '+' : '')}${appState.launchpadStats.data.topPerformer.change24h.toFixed(1)}% 24h` 
                          : '0.0% 24h'
                        }
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Main RSS Feed/Alpha Signal */}
        <div className="space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          <Card className="bg-slate-800 border-slate-700 min-h-full">
            <CardContent className="p-6 h-full flex flex-col">
              {/* Main Signal Title */}
              <div className="mb-6">
                {appState.alphaSignals.loading ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-slate-400 text-sm">Loading signals...</p>
                  </div>
                ) : appState.alphaSignals.error ? (
                  <div className="text-center py-4">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-slate-400 text-sm mb-2">{appState.alphaSignals.error}</p>
                    <Button 
                      size="sm" 
                      onClick={() => fetchSectionData('alphaSignals')}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Retry
                    </Button>
                  </div>
                ) : appState.alphaSignals.data && appState.alphaSignals.data.length > 0 ? (
                  <>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-red-500" />
                      {appState.alphaSignals.data[0].symbol} is {appState.alphaSignals.data[0].performance.toLowerCase()} {Math.abs(appState.alphaSignals.data[0].performanceValue).toFixed(1)}% from Entry Signal ${appState.alphaSignals.data[0].priceMovement.current.toFixed(2)} → ${appState.alphaSignals.data[0].priceMovement.target.toFixed(2)}
                      <ArrowUpRight className="h-5 w-5 text-green-500" />
                    </h2>
                    <div className="flex gap-1 mt-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-red-500" />
                      No Active Alpha Signals
                    </h2>
                    <p className="text-slate-400 text-sm mt-2">Monitoring for new opportunities...</p>
                  </>
                )}
              </div>

              {/* Main Visual Content Area */}
              <div className="flex-1 bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-800/50 rounded-lg p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Zap className="h-16 w-16 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {appState.alphaSignals.data && appState.alphaSignals.data.length > 0 ? 'Alpha Signal Active' : 'Monitoring Markets'}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {appState.alphaSignals.data && appState.alphaSignals.data.length > 0 ? 'Real-time market intelligence' : 'Waiting for signals...'}
                  </p>
                </div>
              </div>

              {/* Signal Details */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Entry Price</div>
                  <div className="text-lg font-bold text-green-400">
                    {appState.alphaSignals.data && appState.alphaSignals.data.length > 0 ? `$${appState.alphaSignals.data[0].priceMovement.current.toFixed(2)}` : '$0.00'}
                  </div>
                </div>
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Target Price</div>
                  <div className="text-lg font-bold text-white">
                    {appState.alphaSignals.data && appState.alphaSignals.data.length > 0 ? `$${appState.alphaSignals.data[0].priceMovement.target.toFixed(2)}` : '$0.00'}
                  </div>
                </div>
              </div>
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
              {appState.trendingTokens.loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-slate-400 text-sm">Loading trending tokens...</p>
                </div>
              ) : appState.trendingTokens.error ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-slate-400 text-sm mb-2">{appState.trendingTokens.error}</p>
                  <Button 
                    size="sm" 
                    onClick={() => fetchSectionData('trendingTokens')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Retry
                  </Button>
                </div>
              ) : appState.trendingTokens.data && appState.trendingTokens.data.length > 0 ? (
                <div className="space-y-3">
                  {appState.trendingTokens.data.map((token) => (
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
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-slate-600" />
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
              {appState.whaleTransactions.loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-slate-400 text-sm">Loading whale activity...</p>
                </div>
              ) : appState.whaleTransactions.error ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-slate-400 text-sm mb-2">{appState.whaleTransactions.error}</p>
                  <Button 
                    size="sm" 
                    onClick={() => fetchSectionData('whaleTransactions')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Retry
                  </Button>
                </div>
              ) : appState.whaleTransactions.data && appState.whaleTransactions.data.length > 0 ? (
                <div className="space-y-3">
                  {appState.whaleTransactions.data.map((trader) => (
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
                  <Users className="h-8 w-8 mx-auto mb-2 text-slate-600" />
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