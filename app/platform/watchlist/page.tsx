'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataAggregator, TokenData } from '@/lib/data-services';
import { watchlistApi, alertsApi } from '@/lib/api-client';
import { usePrivy } from '@privy-io/react-auth';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  BellOff,
  Trash2,
  Plus
} from 'lucide-react';

const dataAggregator = new DataAggregator();

export default function WatchlistPage() {
  const { user } = usePrivy();
  const [watchlistTokens, setWatchlistTokens] = useState<TokenData[]>([]);
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([]);
  const [userAlerts, setUserAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState<Record<string, boolean>>({});

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
          <div className="h-8 bg-slate-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Watchlist Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-500">{totalTokens}</p>
                <p className="text-sm text-slate-300">Total Tokens</p>
              </div>
              <Star className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-bold ${avgChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {avgChange24h >= 0 ? '+' : ''}{avgChange24h.toFixed(1)}%
                </p>
                <p className="text-sm text-slate-300">Avg 24h Change</p>
              </div>
              {avgChange24h >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-500">{activeAlerts}</p>
                <p className="text-sm text-slate-300">Active Alerts</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-500">
                  ${(combinedValue / 1e12).toFixed(2)}T
                </p>
                <p className="text-sm text-slate-300">Combined Value</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Token Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Your Watchlist</h2>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Token
        </Button>
      </div>

      {/* Watchlist Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-6 text-slate-300">Token</th>
                  <th className="text-right py-4 px-4 text-slate-300">Price</th>
                  <th className="text-right py-4 px-4 text-slate-300">24h Change</th>
                  <th className="text-right py-4 px-4 text-slate-300">7d Change</th>
                  <th className="text-right py-4 px-4 text-slate-300">Volume (24h)</th>
                  <th className="text-center py-4 px-4 text-slate-300">Alerts</th>
                  <th className="text-center py-4 px-4 text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {watchlistTokens.map((token) => {
                  const isPositive24h = token.change24h >= 0;
                  const isPositive7d = token.change7d >= 0;
                  const hasAlert = alertsEnabled[token.symbol];
                  
                  return (
                    <tr key={token.symbol} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {token.image ? (
                            <img 
                              src={token.image} 
                              alt={token.symbol}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center ${token.image ? 'hidden' : ''}`}
                          >
                            <span className="text-white text-xs font-bold">
                              {token.symbol.slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-white">{token.symbol}</div>
                            <div className="text-sm text-slate-400">{token.name}</div>
                          </div>
                          <Badge className="bg-blue-600 text-white ml-2">
                            Solana
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-white font-semibold">
                          ${token.price >= 1 ? token.price.toFixed(2) : token.price.toFixed(6)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className={`font-semibold ${isPositive24h ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive24h ? '+' : ''}{token.change24h.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className={`font-semibold ${isPositive7d ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive7d ? '+' : ''}{token.change7d.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-slate-300">
                          ${token.volume24h >= 1e9 ? 
                            `${(token.volume24h / 1e9).toFixed(2)}B` : 
                            `${(token.volume24h / 1e6).toFixed(2)}M`
                          }
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleAlert(token.symbol)}
                          className={hasAlert ? 'text-green-400 hover:text-green-300' : 'text-slate-400 hover:text-slate-300'}
                        >
                          {hasAlert ? (
                            <>
                              <Bell className="h-4 w-4 mr-1" />
                              ON
                            </>
                          ) : (
                            <>
                              <BellOff className="h-4 w-4 mr-1" />
                              OFF
                            </>
                          )}
                        </Button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromWatchlist(token.symbol)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {watchlistTokens.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-12 text-center">
            <Star className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h3>
            <p className="text-slate-400 mb-6">
              Add tokens to track their performance and set up price alerts.
            </p>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Token
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}