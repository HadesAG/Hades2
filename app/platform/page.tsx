'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedDashboardCard } from '@/components/platform/EnhancedDashboardCard';
import { DataAggregator, MarketStats } from '@/lib/data-services';
import { getRealtimePriceService } from '@/lib/realtime-price-service';
import { mockStore } from '@/app/hadesMockData';
import { 
  Target, 
  TrendingUp, 
  Shield, 
  Radar, 
  Zap, 
  BarChart3, 
  AlertTriangle, 
  Eye,
  Play,
  Brain,
  Link2
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
      {/* Enhanced Live Alpha Intelligence Banner */}
      <Card className="planetary-interface border-0 text-white relative overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-3xl font-bold mb-3 glow-red">Live Alpha Intelligence</h2>
              <p className="text-xl opacity-90 mb-2">Currently Tracking</p>
              <p className="text-sm opacity-75 leading-relaxed">
                Real-time monitoring across {mockStore.platformMetrics.chainsMonitored} chains • {mockStore.platformMetrics.tokensTracked.toLocaleString()} tokens tracked • {mockStore.platformMetrics.activeSignals} alpha signals active
                {wsConnected && <span className="ml-2 text-green-300">• WebSocket Connected</span>}
              </p>
            </div>
            <Button 
              className="descend-button text-white border-white/30 px-6 py-3"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Live Feed
            </Button>
          </div>
          
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 opacity-50" />
        </CardContent>
      </Card>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Alpha Signals */}
        <EnhancedDashboardCard
          title="Alpha Signals"
          value={mockStore.platformMetrics.activeSignals}
          subtitle="New token discoveries"
          icon={Target}
          iconColor="text-red-500"
          iconBgColor="bg-red-600"
          trend={{ value: "24 new today", isPositive: true }}
        />

        {/* Cross-Chain Intel */}
        <EnhancedDashboardCard
          title="Cross-Chain Intel"
          value={mockStore.platformMetrics.chainsMonitored}
          subtitle="Multi-chain monitoring"
          icon={Link2}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-600"
          trend={{ value: "chains active", isPositive: true }}
        />

        {/* DeFi Alerts */}
        <EnhancedDashboardCard
          title="DeFi Alerts"
          value={mockStore.platformMetrics.alertsPending}
          subtitle="Protocol updates"
          icon={Shield}
          iconColor="text-yellow-500"
          iconBgColor="bg-yellow-600"
          trend={{ value: "alerts pending", isPositive: false }}
        />

        {/* Market Intelligence */}
        <EnhancedDashboardCard
          title="Market Intelligence"
          value="156"
          subtitle="Trading insights"
          icon={Brain}
          iconColor="text-green-500"
          iconBgColor="bg-green-600"
          trend={{ value: "signals active", isPositive: true }}
        />

        {/* Flash Intelligence */}
        <EnhancedDashboardCard
          title="Flash Intelligence"
          value="Live"
          subtitle="Real-time feeds"
          icon={Zap}
          iconColor="text-purple-500"
          iconBgColor="bg-purple-600"
          trend={{ value: "updates", isPositive: true }}
        />

        {/* Deep Analytics */}
        <EnhancedDashboardCard
          title="Deep Analytics"
          value={mockStore.platformMetrics.reportsGenerated}
          subtitle="Advanced metrics"
          icon={BarChart3}
          iconColor="text-indigo-500"
          iconBgColor="bg-indigo-600"
          trend={{ value: "reports", isPositive: true }}
        />

        {/* Risk Intelligence */}
        <EnhancedDashboardCard
          title="Risk Intelligence"
          value={mockStore.platformMetrics.warningsActive}
          subtitle="Security monitoring"
          icon={AlertTriangle}
          iconColor="text-red-500"
          iconBgColor="bg-red-600"
          trend={{ value: "warnings", isPositive: false }}
        />

        {/* New Token Radar */}
        <EnhancedDashboardCard
          title="New Token Radar"
          value={mockStore.platformMetrics.newTokensDetected}
          subtitle="Fresh launches"
          icon={Radar}
          iconColor="text-teal-500"
          iconBgColor="bg-teal-600"
          trend={{ value: "detected", isPositive: true }}
        />
      </div>

      {/* Enhanced Market Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="platform-card-enhanced text-center group">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-red-500 mb-2 group-hover:text-red-400 transition-colors">
              {mockStore.platformMetrics.tokensTracked.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Tokens Tracked</div>
          </CardContent>
        </Card>

        <Card className="platform-card-enhanced text-center group">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-500 mb-2 group-hover:text-green-400 transition-colors">
              {mockStore.platformMetrics.activeSignals}
            </div>
            <div className="text-sm text-gray-300">Active Signals</div>
          </CardContent>
        </Card>

        <Card className="platform-card-enhanced text-center group">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-blue-500 mb-2 group-hover:text-blue-400 transition-colors">
              {mockStore.platformMetrics.chainsMonitored}
            </div>
            <div className="text-sm text-gray-300">Chains Monitored</div>
          </CardContent>
        </Card>

        <Card className="platform-card-enhanced text-center group">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-purple-500 mb-2 group-hover:text-purple-400 transition-colors">
              24h
            </div>
            <div className="text-sm text-gray-300">Live Monitoring</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}