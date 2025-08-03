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

const dataAggregator = new DataAggregator();

export default function SearchTokensPage() {
  const [trendingTokens, setTrendingTokens] = useState<TokenData[]>([]);
  const [searchResults, setSearchResults] = useState<TokenData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('trending');

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
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by token symbol or name (e.g. SOL, Bonk, Pepe)..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 bg-slate-700 border-slate-600 text-white text-lg h-14"
            />
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700"
              disabled={searching}
            >
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'trending', label: 'Trending', icon: Flame },
          { key: 'new-launches', label: 'New Launches', icon: Rocket },
          { key: 'low-cap', label: 'Low Cap Gems', icon: TrendingUp },
          { key: 'verified', label: 'Verified Only', icon: CheckCircle },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeFilter === key ? 'default' : 'outline'}
            onClick={() => handleFilterChange(key)}
            className={
              activeFilter === key
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'border-slate-600 text-slate-300 hover:bg-slate-700'
            }
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          {searchTerm ? `Search Results for "${searchTerm}"` : 'Trending Now'}
        </h2>
        <Badge variant="secondary" className="text-slate-300">
          {searchResults.length} tokens found
        </Badge>
      </div>

      {/* Token Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((token) => {
          const isPositive = token.change24h > 0;
          const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
          
          return (
            <Card key={`${token.symbol}-${token.name}`} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {token.image ? (
                      <img 
                        src={token.image} 
                        alt={token.symbol}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center ${token.image ? 'hidden' : ''}`}
                    >
                      <span className="text-white text-sm font-bold">
                        {token.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{token.symbol}</h3>
                      <p className="text-sm text-slate-400">{token.name}</p>
                    </div>
                  </div>
                  {token.rank && (
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      #{token.rank}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-400">Price</p>
                    <p className="text-lg font-bold text-white">
                      ${token.price >= 1 ? token.price.toFixed(2) : token.price.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">24h Change</p>
                    <p className={`text-lg font-bold ${changeColor}`}>
                      {isPositive ? '+' : ''}{token.change24h.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-400">Volume (24h)</p>
                    <p className="text-sm font-semibold text-white">
                      ${token.volume24h >= 1e9 ? 
                        `${(token.volume24h / 1e9).toFixed(2)}B` : 
                        `${(token.volume24h / 1e6).toFixed(2)}M`
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Market Cap</p>
                    <p className="text-sm font-semibold text-white">
                      ${token.marketCap >= 1e9 ? 
                        `${(token.marketCap / 1e9).toFixed(2)}B` : 
                        `${(token.marketCap / 1e6).toFixed(2)}M`
                      }
                    </p>
                  </div>
                </div>

                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => {
                    // This would open a detailed analysis or external link
                    console.log('Quick analyze:', token.symbol);
                  }}
                >
                  Quick Analyze
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {searchResults.length === 0 && !loading && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No tokens found</h3>
            <p className="text-slate-400">
              Try searching with different keywords or check the trending tokens above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}