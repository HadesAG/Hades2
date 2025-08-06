'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataAggregator, MarketStats } from '@/lib/data-services';
import { getRealtimePriceService } from '@/lib/realtime-price-service';
import { 
  Target, 
  TrendingUp, 
  Shield, 
  Radar, 
  Zap, 
  BarChart3, 
  AlertTriangle, 
  Eye,
  Play
} from 'lucide-react';

const dataAggregator = new DataAggregator();

export default function Dashboard() {
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await dataAggregator.getMarketOverview();
        setMarketStats(stats);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initialize real-time price service
    const initializeRealtime = async () => {
      try {
        const priceService = getRealtimePriceService();
        await priceService.initialize();
        setWsConnected(true);
        console.log('🚀 Real-time price service connected');
      } catch (error) {
        console.error('❌ Failed to connect real-time service:', error);
        setWsConnected(false);
      }
    };

    fetchData();
    initializeRealtime();
    
    // Refresh every 30 seconds (as backup to WebSocket)
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Alpha Intelligence Banner */}
      <Card className="bg-gradient-to-r from-orange-600 to-red-600 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Live Alpha Intelligence</h2>
              <p className="text-lg opacity-90">Currently Tracking</p>
              <p className="text-sm opacity-75">
                Real-time monitoring across 12 chains • 1,247 tokens tracked • 89 alpha signals active
                {wsConnected && <span className="ml-2 text-green-300">• WebSocket Connected</span>}
              </p>
            </div>
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Live
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Alpha Signals */}
        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">24 new today</p>
                <p className="text-2xl font-bold text-white">Alpha Signals</p>
                <p className="text-sm text-gray-300">New token discoveries</p>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cross-Chain Intel */}
        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">12 chains active</p>
                <p className="text-2xl font-bold text-white">Cross-Chain Intel</p>
                <p className="text-sm text-gray-300">Multi-chain monitoring</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DeFi Alerts */}
        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">8 alerts pending</p>
                <p className="text-2xl font-bold text-white">DeFi Alerts</p>
                <p className="text-sm text-gray-300">Protocol updates</p>
              </div>
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Intelligence */}
        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">156 signals</p>
                <p className="text-2xl font-bold text-white">Market Intelligence</p>
                <p className="text-sm text-gray-300">Trading insights</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flash Intelligence */}
        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Live updates</p>
                <p className="text-2xl font-bold text-white">Flash Intelligence</p>
                <p className="text-sm text-gray-300">Real-time feeds</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deep Analytics */}
        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">42 reports</p>
                <p className="text-2xl font-bold text-white">Deep Analytics</p>
                <p className="text-sm text-gray-300">Advanced metrics</p>
              </div>
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Intelligence */}
        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">3 warnings</p>
                <p className="text-2xl font-bold text-white">Risk Intelligence</p>
                <p className="text-sm text-gray-300">Security monitoring</p>
              </div>
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Token Radar */}
        <Card className="bg-black border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">67 detected</p>
                <p className="text-2xl font-bold text-white">New Token Radar</p>
                <p className="text-sm text-gray-300">Fresh launches</p>
              </div>
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                <Radar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Overview Stats */}
      {marketStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-black border-gray-800 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {marketStats.activeTokens?.toLocaleString() || '1,247'}
              </div>
              <div className="text-sm text-gray-300">Tokens Tracked</div>
            </CardContent>
          </Card>

          <Card className="bg-black border-gray-800 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-500 mb-2">89</div>
              <div className="text-sm text-gray-300">Active Signals</div>
            </CardContent>
          </Card>

          <Card className="bg-black border-gray-800 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-500 mb-2">12</div>
              <div className="text-sm text-gray-300">Chains Monitored</div>
            </CardContent>
          </Card>

          <Card className="bg-black border-gray-800 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-500 mb-2">24h</div>
              <div className="text-sm text-gray-300">Live Monitoring</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}