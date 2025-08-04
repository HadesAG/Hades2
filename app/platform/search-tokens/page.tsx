'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataAggregator, TokenData } from '@/lib/data-services';
import { 
  Search, 
  TrendingUp, 
  Flame, 
  Rocket, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

const dataAggregator = new DataAggregator();

export default function SearchTokensPage() {
  const [trendingTokens, setTrendingTokens] = useState<TokenData[]>([]);
  const [searchResults, setSearchResults] = useState<TokenData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTokens, setFilteredTokens] = useState<any[]>([]);
  const [allTokens, setAllTokens] = useState<any[]>([]);

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      const tokenData = await dataAggregator.getTrendingTokens();
      setAllTokens(tokenData);
      setFilteredTokens(tokenData);
    } catch (error) {
      console.error('Error fetching token data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTokens(allTokens);
    } else {
      const filtered = allTokens.filter(token => 
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTokens(filtered);
    }
  }, [searchQuery, allTokens]);

  useEffect(() => {
    const fetchTrendingTokens = async () => {
      try {
        setLoading(true);
        const tokens = await dataAggregator.getTrendingTokens();
        setTrendingTokens(tokens);
        setSearchResults(tokens);
      } catch (error) {
        console.error('Error fetching trending tokens:', error);
        // Fallback to top tokens
        try {
          const fallbackTokens = await dataAggregator.getTopTokens(20);
          setTrendingTokens(fallbackTokens);
          setSearchResults(fallbackTokens);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTokens();
  }, []);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setSearchResults(trendingTokens);
      return;
    }

    setSearching(true);
    try {
      // Search within trending tokens first
      const filtered = trendingTokens.filter(token =>
        token.name.toLowerCase().includes(term.toLowerCase()) ||
        token.symbol.toLowerCase().includes(term.toLowerCase())
      );

      if (filtered.length > 0) {
        setSearchResults(filtered);
      } else {
        // If no results in trending, search broader market
        try {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(term)}`
          );
          
          if (response.ok) {
            const data = await response.json();
            const coinIds = data.coins.slice(0, 10).map((coin: any) => coin.id);
            
            if (coinIds.length > 0) {
              const detailedResponse = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h,7d`
              );
              
              if (detailedResponse.ok) {
                const detailedData = await detailedResponse.json();
                const searchTokens = detailedData.map((coin: any) => ({
                  symbol: coin.symbol.toUpperCase(),
                  name: coin.name,
                  price: coin.current_price,
                  change24h: coin.price_change_percentage_24h || 0,
                  change7d: coin.price_change_percentage_7d_in_currency || 0,
                  volume24h: coin.total_volume || 0,
                  marketCap: coin.market_cap || 0,
                  image: coin.image,
                  rank: coin.market_cap_rank,
                }));
                setSearchResults(searchTokens);
              }
            }
          }
        } catch (searchError) {
          console.error('Search error:', searchError);
          setSearchResults([]);
        }
      }
    } finally {
      setSearching(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    let filtered = [...trendingTokens];

    switch (filter) {
      case 'trending':
        // Already sorted by trending
        break;
      case 'new-launches':
        // Filter for newer/smaller market cap tokens
        filtered = filtered.filter(token => token.marketCap < 1e9);
        break;
      case 'low-cap':
        filtered = filtered.filter(token => token.marketCap < 1e8);
        break;
      case 'verified':
        // Filter for established tokens (top 100)
        filtered = filtered.filter(token => token.rank && token.rank <= 100);
        break;
    }

    setSearchResults(filtered);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-700 rounded"></div>
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
            <Link href="/platform/watchlist" className="text-white hover:text-[#ff6b35] transition">Watchlist</Link>
            <Link href="/platform/search-tokens" className="text-[#ff6b35] font-semibold">Search Tokens</Link>
            <Link href="/platform/settings" className="text-white hover:text-[#ff6b35] transition">Settings</Link>
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Search Tokens</h2>
        </div>
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            className="w-full bg-[#151a26] border border-[#2a3441] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            placeholder="Search for a token..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Search Results */}
        <div className="bg-[#151a26] rounded-xl shadow-lg p-6">
          <table className="min-w-full divide-y divide-[#2a3441]">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Market Cap</th>
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
                 filteredTokens.map((token, idx) => (
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
                     </td>
                     <td className="px-4 py-3 text-slate-300">{token.symbol}</td>
                     <td className="px-4 py-3 text-slate-300">
                       ${token.price >= 1 ? token.price.toFixed(2) : token.price.toFixed(6)}
                     </td>
                     <td className="px-4 py-3 text-slate-300">
                       ${token.marketCap >= 1e9 ? 
                         `${(token.marketCap / 1e9).toFixed(2)}B` : 
                         `${(token.marketCap / 1e6).toFixed(0)}M`
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