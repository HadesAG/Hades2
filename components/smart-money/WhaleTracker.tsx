'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhaleAlerts } from './WhaleAlerts';
import { WhalePortfolioView } from './WhalePortfolioView';
import { WhaleList } from './WhaleList';
import { RecentActivityFeed } from './RecentActivityFeed';
import { 
  Search, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Wallet,
  DollarSign,
  Activity
} from 'lucide-react';

interface WhaleWallet {
  id: string;
  address: string;
  label: string;
  category: string;
  totalValue: number;
  isActive: boolean;
  _count: {
    transactions: number;
    holdings: number;
  };
}

interface WhaleTransaction {
  id: string;
  tokenSymbol: string;
  transactionType: string;
  amount: number;
  usdValue: number;
  timestamp: Date;
  signature: string;
  wallet: {
    label: string;
    category: string;
  };
}

interface TopMover {
  token: string;
  symbol: string;
  totalVolume: number;
  netFlow: number;
  transactionCount: number;
  whaleCount: number;
}

export function WhaleTracker() {
  const [whales, setWhales] = useState<WhaleWallet[]>([]);
  const [selectedWhale, setSelectedWhale] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<WhaleTransaction[]>([]);
  const [topMovers, setTopMovers] = useState<TopMover[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWhaleData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchWhaleData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWhaleData = async () => {
    try {
      setRefreshing(true);
      
      const [whalesResponse, transactionsResponse] = await Promise.all([
        fetch('/api/whales'),
        fetch('/api/whales/transactions?limit=20')
      ]);

      if (whalesResponse.ok) {
        const whalesData = await whalesResponse.json();
        setWhales(whalesData.data || []);
      }

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setRecentTransactions(transactionsData.data?.recentTransactions || []);
        setTopMovers(transactionsData.data?.topMovers || []);
      }
    } catch (error) {
      console.error('Error fetching whale data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredWhales = whales.filter(whale => {
    const matchesSearch = whale.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         whale.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || whale.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalWhales = whales.length;
  const totalValue = whales.reduce((sum, whale) => sum + whale.totalValue, 0);
  const activeWhales = whales.filter(w => w.isActive).length;
  const recentActivity = recentTransactions.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Smart Money Tracker</h1>
          <p className="text-gray-300">
            Real-time whale wallet intelligence for Solana traders
          </p>
        </div>
        <Button 
          onClick={fetchWhaleData} 
          disabled={refreshing}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-500">{totalWhales}</p>
                <p className="text-sm text-gray-300">Total Whales</p>
              </div>
              <Wallet className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-500">
                  ${(totalValue / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-gray-300">Total Value</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-500">{activeWhales}</p>
                <p className="text-sm text-gray-300">Active Whales</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-500">{recentActivity}</p>
                <p className="text-sm text-gray-300">Recent Moves</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-black border-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-red-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="whales" className="data-[state=active]:bg-red-600">
            Whale List
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-red-600">
            Live Alerts
          </TabsTrigger>
          <TabsTrigger value="top-movers" className="data-[state=active]:bg-red-600">
            Top Movers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Whale List */}
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Top Whales</CardTitle>
              </CardHeader>
              <CardContent>
                <WhaleList 
                  whales={filteredWhales.slice(0, 10)}
                  selectedWhale={selectedWhale}
                  onSelectWhale={setSelectedWhale}
                  compact={true}
                />
              </CardContent>
            </Card>

            {/* Portfolio/Activity View */}
            <Card className="lg:col-span-2 bg-black border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {selectedWhale ? 'Whale Portfolio' : 'Recent Activity'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedWhale ? (
                  <WhalePortfolioView walletAddress={selectedWhale} />
                ) : (
                  <RecentActivityFeed activities={recentTransactions} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whales" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search whales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black border-gray-800 text-white placeholder:text-gray-400"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-black border-gray-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-800">
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="VC_FUND">VC Funds</SelectItem>
                <SelectItem value="HEDGE_FUND">Hedge Funds</SelectItem>
                <SelectItem value="MARKET_MAKER">Market Makers</SelectItem>
                <SelectItem value="KNOWN_TRADER">Known Traders</SelectItem>
                <SelectItem value="INSTITUTION">Institutions</SelectItem>
                <SelectItem value="PROJECT_TREASURY">Project Treasuries</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-black border-gray-800">
            <CardContent className="p-0">
              <WhaleList 
                whales={filteredWhales}
                selectedWhale={selectedWhale}
                onSelectWhale={setSelectedWhale}
                compact={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <WhaleAlerts />
        </TabsContent>

        <TabsContent value="top-movers" className="space-y-6">
          <div className="grid gap-6">
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Top Moving Tokens (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMovers.map((mover, index) => (
                    <div key={mover.token} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{mover.symbol}</p>
                          <p className="text-sm text-gray-300">{mover.whaleCount} whales active</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          ${(mover.totalVolume / 1000000).toFixed(2)}M
                        </p>
                        <div className="flex items-center gap-1">
                          {mover.netFlow > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <p className={`text-sm ${mover.netFlow > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ${Math.abs(mover.netFlow / 1000000).toFixed(2)}M net
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}