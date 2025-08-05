'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Rocket, 
  CheckCircle,
  ExternalLink,
  Star,
  Plus,
  BarChart3,
  Globe,
  Clock,
  AlertCircle
} from 'lucide-react';

interface TokenResult {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d?: number;
  volume24h: number;
  marketCap: number;
  image: string;
  rank?: number;
  description?: string;
  website?: string;
  verified?: boolean;
}

interface SearchState {
  query: string;
  results: TokenResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

export default function SearchTokensPage() {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    loading: false,
    error: null,
    hasSearched: false
  });
  
  const [trendingTokens, setTrendingTokens] = useState<TokenResult[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'verified' | 'new' | 'defi'>('all');

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchState(prev => ({ ...prev, results: [], hasSearched: false }));
        return;
      }

      setSearchState(prev => ({ ...prev, loading: true, error: null }));

      try {
        // Search CoinGecko API
        const searchResponse = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
        );

        if (!searchResponse.ok) {
          throw new Error('Search failed');
        }

        const searchData = await searchResponse.json();
        const coinIds = searchData.coins.slice(0, 20).map((coin: any) => coin.id);

        if (coinIds.length === 0) {
          setSearchState(prev => ({ 
            ...prev, 
            results: [], 
            loading: false, 
            hasSearched: true,
            error: 'No tokens found matching your search'
          }));
          return;
        }

        // Get detailed market data
        const marketResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h,7d`
        );

        if (!marketResponse.ok) {
          throw new Error('Failed to fetch market data');
        }

        const marketData = await marketResponse.json();
        
        const results: TokenResult[] = marketData.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price || 0,
          change24h: coin.price_change_percentage_24h || 0,
          change7d: coin.price_change_percentage_7d_in_currency || 0,
          volume24h: coin.total_volume || 0,
          marketCap: coin.market_cap || 0,
          image: coin.image,
          rank: coin.market_cap_rank,
          verified: coin.market_cap_rank <= 100 // Top 100 considered verified
        }));

        setSearchState(prev => ({ 
          ...prev, 
          results, 
          loading: false, 
          hasSearched: true,
          error: null
        }));

      } catch (error) {
        console.error('Search error:', error);
        setSearchState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to search tokens. Please try again.',
          hasSearched: true
        }));
      }
    }, 500),
    []
  );

  // Load trending tokens on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
        );
        
        if (response.ok) {
          const data = await response.json();
          const trending: TokenResult[] = data.map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            price: coin.current_price || 0,
            change24h: coin.price_change_percentage_24h || 0,
            volume24h: coin.total_volume || 0,
            marketCap: coin.market_cap || 0,
            image: coin.image,
            rank: coin.market_cap_rank,
            verified: coin.market_cap_rank <= 100
          }));
          setTrendingTokens(trending);
        }
      } catch (error) {
        console.error('Failed to fetch trending tokens:', error);
      }
    };

    fetchTrending();
  }, []);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchState(prev => ({ ...prev, query: value }));
    debouncedSearch(value);
  };

  // Add to watchlist
  const toggleWatchlist = (tokenId: string) => {
    setWatchlist(prev => 
      prev.includes(tokenId) 
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    );
  };

  // Filter results
  const filteredResults = searchState.results.filter(token => {
    switch (activeFilter) {
      case 'verified':
        return token.verified;
      case 'new':
        return token.rank && token.rank > 100;
      case 'defi':
        return token.name.toLowerCase().includes('defi') || 
               token.symbol.toLowerCase().includes('defi') ||
               ['UNI', 'SUSHI', 'COMP', 'AAVE', 'MKR', 'SNX'].includes(token.symbol);
      default:
        return true;
    }
  });

  const displayTokens = searchState.hasSearched ? filteredResults : trendingTokens;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Token Search</h1>
          <p className="text-slate-400 mt-1">Search and discover cryptocurrency tokens</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Globe className="h-4 w-4" />
          <span>Powered by CoinGecko</span>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search for tokens (e.g., Bitcoin, ETH, DOGE)..."
              value={searchState.query}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-lg py-3"
            />
            {searchState.loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 mt-4">
            {[
              { key: 'all', label: 'All Tokens', icon: Globe },
              { key: 'verified', label: 'Verified', icon: CheckCircle },
              { key: 'new', label: 'New/Small Cap', icon: Rocket },
              { key: 'defi', label: 'DeFi', icon: BarChart3 }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeFilter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(key as any)}
                className={`${
                  activeFilter === key 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            {searchState.hasSearched ? (
              <>
                <Search className="h-5 w-5" />
                Search Results ({filteredResults.length})
              </>
            ) : (
              <>
                <Flame className="h-5 w-5 text-orange-500" />
                Trending Tokens
              </>
            )}
          </h2>
        </div>

        {/* Error State */}
        {searchState.error && (
          <Card className="bg-red-900/20 border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span>{searchState.error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {searchState.hasSearched && filteredResults.length === 0 && !searchState.error && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No tokens found</h3>
              <p className="text-slate-400">Try adjusting your search terms or filters</p>
            </CardContent>
          </Card>
        )}

        {/* Token Results Grid */}
        {displayTokens.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTokens.map((token) => (
              <Card key={token.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all">
                <CardContent className="p-6">
                  {/* Token Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={token.image} 
                        alt={token.name}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/40/ff6b35/ffffff?text=${token.symbol.slice(0, 2)}`;
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-white">{token.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-sm">{token.symbol}</span>
                          {token.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {token.rank && (
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              #{token.rank}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleWatchlist(token.id)}
                      className={`${
                        watchlist.includes(token.id) 
                          ? 'text-yellow-500 hover:text-yellow-400' 
                          : 'text-slate-400 hover:text-yellow-500'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${watchlist.includes(token.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  {/* Price Info */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        ${token.price >= 1 ? token.price.toFixed(2) : token.price.toFixed(6)}
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {token.change24h >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {Math.abs(token.change24h).toFixed(2)}% (24h)
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-700">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Market Cap</div>
                        <div className="text-sm text-white font-medium">
                          {token.marketCap >= 1e9 
                            ? `$${(token.marketCap / 1e9).toFixed(2)}B`
                            : `$${(token.marketCap / 1e6).toFixed(0)}M`
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Volume (24h)</div>
                        <div className="text-sm text-white font-medium">
                          {token.volume24h >= 1e9 
                            ? `$${(token.volume24h / 1e9).toFixed(2)}B`
                            : `$${(token.volume24h / 1e6).toFixed(0)}M`
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Watchlist
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}