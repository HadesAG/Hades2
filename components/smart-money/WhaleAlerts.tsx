'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle,
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Clock,
  Filter,
  Bell,
  BellOff,
  ExternalLink
} from 'lucide-react';

interface WhaleAlert {
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

interface AlertFilters {
  minValue: number;
  whaleTypes: string[];
  actionTypes: string[];
  tokens: string[];
}

export function WhaleAlerts() {
  const [alerts, setAlerts] = useState<WhaleAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AlertFilters>({
    minValue: 10000,
    whaleTypes: ['VC_FUND', 'HEDGE_FUND', 'MARKET_MAKER'],
    actionTypes: ['BUY', 'SELL'],
    tokens: []
  });

  useEffect(() => {
    fetchAlerts();
    
    // Real-time updates every 10 seconds
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/whales/transactions?limit=50');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.data?.recentTransactions || []);
      }
    } catch (error) {
      console.error('Error fetching whale alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (alert.usdValue < filters.minValue) return false;
    if (filters.whaleTypes.length > 0 && !filters.whaleTypes.includes(alert.wallet.category)) return false;
    if (filters.actionTypes.length > 0 && !filters.actionTypes.includes(alert.transactionType)) return false;
    if (filters.tokens.length > 0 && !filters.tokens.includes(alert.tokenSymbol)) return false;
    return true;
  });

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

  const handleViewTransaction = (signature: string) => {
    window.open(`https://solscan.io/tx/${signature}`, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Controls */}
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              {alertsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
              Live Whale Alerts
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="alerts-toggle" className="text-sm text-gray-300">
                  Alerts
                </Label>
                <Switch
                  id="alerts-toggle"
                  checked={alertsEnabled}
                  onCheckedChange={setAlertsEnabled}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-300 hover:text-white"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {showFilters && (
          <CardContent className="border-t border-gray-800 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-300 mb-2 block">Min Value ($)</Label>
                <Input
                  type="number"
                  value={filters.minValue}
                  onChange={(e) => setFilters(prev => ({ ...prev, minValue: parseInt(e.target.value) || 0 }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label className="text-sm text-gray-300 mb-2 block">Whale Types</Label>
                <Select>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select types..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="VC_FUND">VC Funds</SelectItem>
                    <SelectItem value="HEDGE_FUND">Hedge Funds</SelectItem>
                    <SelectItem value="MARKET_MAKER">Market Makers</SelectItem>
                    <SelectItem value="KNOWN_TRADER">Known Traders</SelectItem>
                    <SelectItem value="INSTITUTION">Institutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm text-gray-300 mb-2 block">Actions</Label>
                <Select>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select actions..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="BUY">Buys</SelectItem>
                    <SelectItem value="SELL">Sells</SelectItem>
                    <SelectItem value="TRANSFER_IN">Transfers In</SelectItem>
                    <SelectItem value="TRANSFER_OUT">Transfers Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm text-gray-300 mb-2 block">Tokens</Label>
                <Input
                  placeholder="SOL, USDC, JUP..."
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-white">{filteredAlerts.length}</p>
                <p className="text-sm text-gray-300">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-white">
                  ${(filteredAlerts.reduce((sum, alert) => sum + alert.usdValue, 0) / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-gray-300">Total Volume</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {filteredAlerts.length > 0 ? formatTimeAgo(filteredAlerts[0].timestamp) : 'N/A'}
                </p>
                <p className="text-sm text-gray-300">Last Alert</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Feed */}
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Whale Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No alerts match your current filters</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(alert.transactionType)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">
                              {alert.wallet.label}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {alert.wallet.category.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`font-semibold ${getTransactionColor(alert.transactionType)}`}>
                              {alert.transactionType}
                            </span>
                            <span className="text-white">
                              {alert.amount.toLocaleString()} {alert.tokenSymbol}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-green-400 font-semibold">
                              ${alert.usdValue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {formatTimeAgo(alert.timestamp)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewTransaction(alert.signature)}
                          className="text-gray-400 hover:text-white"
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
    </div>
  );
}