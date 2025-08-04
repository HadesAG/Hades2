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
            <Link href="/platform/market-analysis" className="text-white hover:text-[#ff6b35] transition">Market Analysis</Link>
            <Link href="/platform/alerts" className="text-white hover:text-[#ff6b35] transition">Alerts</Link>
            <Link href="/platform/watchlist" className="text-[#ff6b35] font-semibold">Watchlist</Link>
            <Link href="/platform/search-tokens" className="text-white hover:text-[#ff6b35] transition">Search Tokens</Link>
            <Link href="/platform/settings" className="text-white hover:text-[#ff6b35] transition">Settings</Link>
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Watchlist</h2>
        </div>
        {/* Watchlist Table */}
        <div className="bg-[#151a26] rounded-xl shadow-lg p-6">
          <table className="min-w-full divide-y divide-[#2a3441]">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Change</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Volume</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
                         <tbody>
               {loading ? (
                 [...Array(3)].map((_, idx) => (
                   <tr key={idx} className="animate-pulse">
                     <td className="px-4 py-3"><div className="h-4 bg-slate-700 rounded"></div></td>
                     <td className="px-4 py-3"><div className="h-4 bg-slate-700 rounded"></div></td>
                     <td className="px-4 py-3"><div className="h-4 bg-slate-700 rounded"></div></td>
                     <td className="px-4 py-3"><div className="h-4 bg-slate-700 rounded"></div></td>
                     <td className="px-4 py-3"><div className="h-4 bg-slate-700 rounded"></div></td>
                   </tr>
                 ))
               ) : watchlistTokens.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                     No tokens in your watchlist yet. Add some tokens to get started!
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
                     <tr key={idx} className="hover:bg-[#23283a] transition">
                       <td className="px-4 py-3 text-white font-semibold flex items-center gap-2">
                                                {token.image ? (
                         <img src={token.image} alt={token.name} className="w-6 h-6 rounded-full" />
                       ) : (
                           <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                             <span className="text-white text-xs font-bold">{token.symbol.slice(0, 2)}</span>
                           </div>
                         )}
                         {token.name}
                         {isRealtime && (
                           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Real-time price"></div>
                         )}
                       </td>
                       <td className="px-4 py-3 text-slate-300">
                         ${displayPrice >= 1 ? displayPrice.toFixed(2) : displayPrice.toFixed(6)}
                       </td>
                       <td className={`px-4 py-3 font-semibold ${displayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                         {displayChange >= 0 ? '+' : ''}{displayChange.toFixed(2)}%
                       </td>
                       <td className="px-4 py-3 text-slate-300">
                         ${token.volume24h >= 1e9 ? 
                           `${(token.volume24h / 1e9).toFixed(2)}B` : 
                           `${(token.volume24h / 1e6).toFixed(1)}M`
                         }
                       </td>
                       <td className="px-4 py-3 flex gap-2">
                         <button 
                           className="text-[#ff6b35] hover:underline" 
                           onClick={() => removeFromWatchlist(token.symbol)}
                         >
                           Remove
                         </button>
                       </td>
                     </tr>
                   );
                 })
               )}
             </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}