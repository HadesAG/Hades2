'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/components/auth/auth-guard';
import { DataAggregator, TokenData } from '@/lib/data-services';
import { watchlistApi, alertsApi } from '@/lib/api-client';
import { usePrivy } from '@privy-io/react-auth';
import { getRealtimePriceService } from '@/lib/realtime-price-service';
import type { TokenPriceUpdate } from '@/lib/realtime-price-service';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  BellOff, 
  Trash2, 
  Plus
} from 'lucide-react';
import Link from 'next/link';

const dataAggregator = new DataAggregator();

export default function WatchlistPage() {
  const { user } = usePrivy();
  const [watchlistTokens, setWatchlistTokens] = useState<TokenData[]>([]);
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([]);
  const [userAlerts, setUserAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState<Record<string, boolean>>({});
  const [realtimePrices, setRealtimePrices] = useState<Map<string, TokenPriceUpdate>>(new Map());

  useEffect(() => {
    const fetchWatchlistData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Get user's watchlist from database
        const { tokens: watchlistData } = await watchlistApi.getWatchlist(user.id);
        const symbols = watchlistData.map(t => t.symbol.toLowerCase());
        
        // If user has no watchlist, add default tokens
        if (symbols.length === 0) {
          const defaultTokens = ['solana', 'bitcoin', 'ethereum'];
          await Promise.all(defaultTokens.map(symbol => 
            watchlistApi.addToken(user.id, symbol).catch(() => {})
          ));
          setWatchlistSymbols(defaultTokens);
        } else {
          setWatchlistSymbols(symbols);
        }
        
        // Get market data for watchlist tokens
        const tokens = await dataAggregator.getMarketData(
          symbols.length > 0 ? symbols : ['solana', 'bitcoin', 'ethereum']
        );
        setWatchlistTokens(tokens);
        
        // Get user's alerts
        const { alerts } = await alertsApi.getAlerts(user.id);
        setUserAlerts(alerts);
        
        // Set alerts enabled state based on actual alerts
        const alertsState: Record<string, boolean> = {};
        tokens.forEach(token => {
          const hasActiveAlert = alerts.some(alert => 
            alert.symbol === token.symbol && alert.status === 'ACTIVE'
          );
          alertsState[token.symbol] = hasActiveAlert;
        });
        setAlertsEnabled(alertsState);
        
      } catch (error) {
        console.error('Error fetching watchlist data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchWatchlistData, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const toggleAlert = async (symbol: string) => {
    if (!user?.id) return;
    
    try {
      const currentlyEnabled = alertsEnabled[symbol];
      
      if (currentlyEnabled) {
        // Find and pause the alert
        const alert = userAlerts.find(a => a.symbol === symbol && a.status === 'ACTIVE');
        if (alert) {
          await alertsApi.updateAlert(user.id, alert.id, { status: 'PAUSED' });
        }
      } else {
        // Create a new price alert (above current price + 10%)
        const token = watchlistTokens.find(t => t.symbol === symbol);
        if (token) {
          await alertsApi.createAlert(user.id, {
            symbol,
            type: 'PRICE',
            operator: 'ABOVE',
            targetValue: token.price * 1.1
          });
        }
      }
      
      setAlertsEnabled(prev => ({
        ...prev,
        [symbol]: !prev[symbol]
      }));
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  const removeFromWatchlist = async (symbol: string) => {
    if (!user?.id) return;
    
    try {
      await watchlistApi.removeToken(user.id, symbol);
      setWatchlistTokens(prev => prev.filter(token => token.symbol !== symbol));
      setAlertsEnabled(prev => {
        const newState = { ...prev };
        delete newState[symbol];
        return newState;
      });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  // Calculate portfolio stats
  const totalTokens = watchlistTokens.length;
  const avgChange24h = watchlistTokens.length > 0 ? 
    watchlistTokens.reduce((sum, token) => sum + token.change24h, 0) / watchlistTokens.length : 0;
  const activeAlerts = Object.values(alertsEnabled).filter(Boolean).length;
  const combinedValue = watchlistTokens.reduce((sum, token) => sum + token.marketCap, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard 
      requireAuth={true}
      fallbackTitle="Watchlist Access Required"
      fallbackDescription="Connect your Solana wallet or sign in with email to manage your personal watchlist and track your favorite tokens."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Your Watchlist</h2>
          <Link href="/platform/search-tokens">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Token
            </Button>
          </Link>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-black border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Tokens</p>
                  <p className="text-2xl font-bold text-white">{totalTokens}</p>
                </div>
                <Star className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg 24h Change</p>
                  <p className={`text-2xl font-bold ${avgChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {avgChange24h >= 0 ? '+' : ''}{avgChange24h.toFixed(2)}%
                  </p>
                </div>
                {avgChange24h >= 0 ? 
                  <TrendingUp className="h-8 w-8 text-green-500" /> : 
                  <TrendingDown className="h-8 w-8 text-red-500" />
                }
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Alerts</p>
                  <p className="text-2xl font-bold text-white">{activeAlerts}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Combined Market Cap</p>
                  <p className="text-xl font-bold text-white">
                    ${combinedValue >= 1e12 ? 
                      `${(combinedValue / 1e12).toFixed(2)}T` : 
                      `${(combinedValue / 1e9).toFixed(1)}B`
                    }
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Watchlist Table */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">24h Change</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Volume</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Market Cap</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {loading ? (
                    [...Array(3)].map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-4 py-3"><div className="h-4 bg-gray-800 rounded"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-800 rounded"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-800 rounded"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-800 rounded"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-800 rounded"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-800 rounded"></div></td>
                      </tr>
                    ))
                  ) : watchlistTokens.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        No tokens in your watchlist yet. 
                        <Link href="/platform/search-tokens" className="text-orange-500 hover:underline ml-1">
                          Add some tokens to get started!
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    watchlistTokens.map((token, idx) => {
                      // Use real-time price if available, otherwise fallback to cached price
                      const realtimePrice = realtimePrices.get(token.symbol);
                      const displayPrice = realtimePrice?.price || token.price || 0;
                      const displayChange = realtimePrice?.change24h || token.change24h || 0;
                      const isRealtime = !!realtimePrice;

                      return (
                        <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {token.image ? (
                                <img src={token.image} alt={token.name} className="w-8 h-8 rounded-full" />
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">{token.symbol.slice(0, 2).toUpperCase()}</span>
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-white font-semibold">{token.name}</p>
                                  {isRealtime && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Real-time price"></div>
                                  )}
                                </div>
                                <p className="text-gray-400 text-sm">{token.symbol.toUpperCase()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-white font-medium">
                            ${displayPrice >= 1 ? displayPrice.toFixed(2) : displayPrice.toFixed(6)}
                          </td>
                          <td className="px-4 py-3">
                            <div className={`flex items-center gap-1 font-semibold ${displayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {displayChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                              {displayChange >= 0 ? '+' : ''}{displayChange.toFixed(2)}%
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-300">
                            ${token.volume24h >= 1e9 ? 
                              `${(token.volume24h / 1e9).toFixed(2)}B` : 
                              `${(token.volume24h / 1e6).toFixed(1)}M`
                            }
                          </td>
                          <td className="px-4 py-3 text-gray-300">
                            ${token.marketCap >= 1e9 ? 
                              `${(token.marketCap / 1e9).toFixed(2)}B` : 
                              `${(token.marketCap / 1e6).toFixed(1)}M`
                            }
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleAlert(token.symbol)}
                                className={`p-2 ${alertsEnabled[token.symbol] ? 'text-yellow-500 hover:text-yellow-400' : 'text-gray-400 hover:text-white'}`}
                                title={alertsEnabled[token.symbol] ? 'Disable alerts' : 'Enable alerts'}
                              >
                                {alertsEnabled[token.symbol] ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromWatchlist(token.symbol)}
                                className="p-2 text-red-400 hover:text-red-300"
                                title="Remove from watchlist"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}