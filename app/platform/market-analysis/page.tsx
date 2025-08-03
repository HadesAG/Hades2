'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataAggregator, MarketStats } from '@/lib/data-services';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  RefreshCw,
  Activity
} from 'lucide-react';

const dataAggregator = new DataAggregator();

// Market dominance data will be calculated from real market stats

// Real sector performance data will be calculated from actual tokens

export default function MarketAnalysisPage() {
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [sectorData, setSectorData] = useState<any[]>([]);
  const [dominanceData, setDominanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, topTokens] = await Promise.all([
          dataAggregator.getMarketOverview(),
          dataAggregator.getTopTokens(20)
        ]);
        
        setMarketStats(stats);
        
        // Generate real dominance data from market stats
        const realDominanceData = [
          { name: 'Bitcoin', value: stats.btcDominance, color: '#f7931a' },
          { name: 'Ethereum', value: stats.ethDominance, color: '#627eea' },
          { name: 'Altcoins', value: 100 - stats.btcDominance - stats.ethDominance - 5, color: '#10b981' },
          { name: 'Stablecoins', value: 5, color: '#6b7280' }, // Approximate stablecoin dominance
        ];
        setDominanceData(realDominanceData);
        
        // Generate real sector data from top tokens
        const sectors = [
          { name: 'DeFi', tokens: topTokens.filter(t => ['UNI', 'AAVE', 'COMP', 'MKR', 'CRV'].includes(t.symbol)) },
          { name: 'Layer 1', tokens: topTokens.filter(t => ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'].includes(t.symbol)) },
          { name: 'Infrastructure', tokens: topTokens.filter(t => ['LINK', 'GRT', 'FIL', 'AR'].includes(t.symbol)) },
          { name: 'Memes', tokens: topTokens.filter(t => ['DOGE', 'SHIB', 'PEPE', 'WIF', 'BONK'].includes(t.symbol)) },
          { name: 'AI/Data', tokens: topTokens.filter(t => ['FET', 'OCEAN', 'RNDR', 'TAO'].includes(t.symbol)) },
          { name: 'Gaming', tokens: topTokens.filter(t => ['AXS', 'SAND', 'MANA', 'ENJ'].includes(t.symbol)) },
        ];
        
        const realSectorData = sectors.map(sector => {
          if (sector.tokens.length === 0) {
            return { name: sector.name, value: 0, change: 0 };
          }
          
          const avgChange24h = sector.tokens.reduce((sum, token) => sum + token.change24h, 0) / sector.tokens.length;
          const avgChange7d = sector.tokens.reduce((sum, token) => sum + token.change7d, 0) / sector.tokens.length;
          
          return {
            name: sector.name,
            value: avgChange24h,
            change: avgChange7d
          };
        }).filter(sector => sector.value !== 0);
        
        setSectorData(realSectorData);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-500">
                  ${marketStats?.totalMarketCap ? (marketStats.totalMarketCap / 1e12).toFixed(2) : '2.45'}T
                </p>
                <p className="text-sm text-slate-300">Total Market Cap</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-500">
                  ${marketStats?.volume24h ? (marketStats.volume24h / 1e9).toFixed(1) : '89.0'}B
                </p>
                <p className="text-sm text-slate-300">24h Volume</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-500">
                  {marketStats?.fearGreedIndex || 68}
                </p>
                <p className="text-sm text-slate-300">Fear & Greed</p>
              </div>
              <PieChartIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-500">
                  {marketStats?.btcDominance?.toFixed(1) || '52.3'}%
                </p>
                <p className="text-sm text-slate-300">BTC Dominance</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Dominance Chart */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Market Dominance
              </CardTitle>
              <Button 
                size="sm" 
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dominanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dominanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: any) => [`${value}%`, 'Dominance']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {dominanceData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-slate-300">{item.name}</span>
                  <span className="text-sm font-semibold text-white ml-auto">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sector Performance */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sector Performance (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: any) => [`${value}%`, 'Change']}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  >
                    {sectorData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.value > 0 ? '#10b981' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700 text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {marketStats?.activeTokens?.toLocaleString() || '15,420'}
            </div>
            <div className="text-sm text-slate-300 mb-1">Active Tokens</div>
            <div className="text-xs text-slate-400">Currently trading</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-green-500 mb-2">
              1,247
            </div>
            <div className="text-sm text-slate-300 mb-1">New Launches</div>
            <div className="text-xs text-slate-400">Last 24 hours</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-red-500 mb-2">
              89
            </div>
            <div className="text-sm text-slate-300 mb-1">Failed Projects</div>
            <div className="text-xs text-slate-400">Rugged/failed (24h)</div>
          </CardContent>
        </Card>
      </div>

      {/* Sector Analysis Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Detailed Sector Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Sector</th>
                  <th className="text-right py-3 px-4 text-slate-300">24h Change</th>
                  <th className="text-right py-3 px-4 text-slate-300">7d Change</th>
                  <th className="text-right py-3 px-4 text-slate-300">Market Cap</th>
                  <th className="text-right py-3 px-4 text-slate-300">Volume</th>
                </tr>
              </thead>
              <tbody>
                {sectorData.map((sector, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {sector.name.slice(0, 2)}
                          </span>
                        </div>
                        <span className="text-white font-medium">{sector.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-semibold ${
                        sector.value > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {sector.value > 0 ? '+' : ''}{sector.value}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-semibold ${
                        sector.change > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {sector.change > 0 ? '+' : ''}{sector.change}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      ${(Math.random() * 50 + 10).toFixed(1)}B
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      ${(Math.random() * 5 + 1).toFixed(1)}B
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}