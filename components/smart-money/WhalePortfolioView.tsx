'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign,
  TrendingUp, 
  TrendingDown,
  Wallet,
  Clock,
  ExternalLink,
  PieChart,
  Activity
} from 'lucide-react';

interface WhaleHolding {
  tokenAddress: string;
  tokenSymbol: string;
  balance: number;
  usdValue: number;
  lastUpdated: Date;
  percentOfPortfolio?: number;
}

interface WhaleTransaction {
  id: string;
  tokenSymbol: string;
  transactionType: string;
  amount: number;
  usdValue: number;
  timestamp: Date;
  signature: string;
}

interface WhalePortfolio {
  wallet: {
    address: string;
    label: string;
    category: string;
    totalValue: number;
  };
  totalValue: number;
  holdings: WhaleHolding[];
  recentTransactions: WhaleTransaction[];
  topPositions: WhaleHolding[];
  recentActivity: {
    totalTransactions: number;
    totalVolume: number;
    topTokens: { symbol: string; volume: number }[];
    netFlow: number;
  };
}

interface WhalePortfolioViewProps {
  walletAddress: string;
}

export function WhalePortfolioView({ walletAddress }: WhalePortfolioViewProps) {
  const [portfolio, setPortfolio] = useState<WhalePortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, [walletAddress]);

  const fetchPortfolio = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/whales/portfolio/${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data.data);
      } else {
        setError('Failed to load portfolio data');
      }
    } catch (error) {
      console.error('Error fetching whale portfolio:', error);
      setError('Error loading portfolio');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'BUY':
      case 'TRANSFER_IN':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'SELL':
      case 'TRANSFER_OUT':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'BUY':
      case 'TRANSFER_IN':
        return 'text-green-500';
      case 'SELL':
      case 'TRANSFER_OUT':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const handleViewTransaction = (signature: string) => {
    window.open(`https://solscan.io/tx/${signature}`, '_blank');
  };

  const handleViewWallet = () => {
    window.open(`https://solscan.io/account/${walletAddress}`, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="h-32 bg-slate-700 rounded"></div>
            <div className="h-32 bg-slate-700 rounded"></div>
          </div>
          <div className="h-64 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="text-center py-8">
        <Wallet className="h-12 w-12 text-slate-500 mx-auto mb-4" />
        <p className="text-slate-400">{error || 'Portfolio data not available'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{portfolio.wallet.label}</h3>
          <p className="text-sm text-slate-400 font-mono">{portfolio.wallet.address}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewWallet}
          className="text-slate-400 hover:text-white"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </Button>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-lg font-bold text-white">
                  ${portfolio.totalValue > 1000000 
                    ? `${(portfolio.totalValue / 1000000).toFixed(2)}M` 
                    : `${(portfolio.totalValue / 1000).toFixed(0)}K`
                  }
                </p>
                <p className="text-xs text-slate-400">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-lg font-bold text-white">{portfolio.holdings.length}</p>
                <p className="text-xs text-slate-400">Holdings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-lg font-bold text-white">{portfolio.recentActivity.totalTransactions}</p>
                <p className="text-xs text-slate-400">Recent Txs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {portfolio.recentActivity.netFlow >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className={`text-lg font-bold ${portfolio.recentActivity.netFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${Math.abs(portfolio.recentActivity.netFlow / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-slate-400">Net Flow</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Details */}
      <Tabs defaultValue="holdings" className="space-y-4">
        <TabsList className="bg-slate-700 border-slate-600">
          <TabsTrigger value="holdings" className="data-[state=active]:bg-orange-500">
            Holdings
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-orange-500">
            Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-4">
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Top Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.topPositions.map((holding) => (
                  <div key={holding.tokenAddress} className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {holding.tokenSymbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{holding.tokenSymbol}</p>
                        <p className="text-sm text-slate-400">
                          {holding.balance.toLocaleString()} tokens
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        ${holding.usdValue.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-400">
                        {holding.percentOfPortfolio?.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
                
                {portfolio.topPositions.length === 0 && (
                  <div className="text-center py-8">
                    <PieChart className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No holdings data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Composition */}
          {portfolio.topPositions.length > 0 && (
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Portfolio Composition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolio.topPositions.slice(0, 5).map((holding) => (
                    <div key={holding.tokenAddress} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{holding.tokenSymbol}</span>
                        <span className="text-slate-400">{holding.percentOfPortfolio?.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={holding.percentOfPortfolio || 0} 
                        className="h-2 bg-slate-600"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-64 overflow-y-auto">
                {portfolio.recentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No recent transactions</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-600">
                    {portfolio.recentTransactions.slice(0, 10).map((tx) => (
                      <div key={tx.id} className="p-4 hover:bg-slate-600/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getTransactionIcon(tx.transactionType)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${getTransactionColor(tx.transactionType)}`}>
                                  {tx.transactionType}
                                </span>
                                <span className="text-white">{tx.tokenSymbol}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-slate-400">
                                  {tx.amount.toLocaleString()} tokens
                                </span>
                                <span className="text-sm text-green-400">
                                  ${tx.usdValue.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400">
                              {formatTimeAgo(tx.timestamp)}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewTransaction(tx.signature)}
                              className="text-slate-400 hover:text-white"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}