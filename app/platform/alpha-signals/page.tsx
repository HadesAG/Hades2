'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataAggregator, AlphaSignal } from '@/lib/data-services';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { WhaleTracker } from '@/components/smart-money/WhaleTracker';
import { 
  Search, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Clock,
  BarChart3,
  Fish
} from 'lucide-react';
import Link from 'next/link';

// Declare the custom RSS App element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'rssapp-feed': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id: string;
      };
    }
  }
}

const dataAggregator = new DataAggregator();

// Mock price movement data for charts
const generatePriceData = (current: number, target: number) => {
  const data = [];
  const steps = 20;
  const diff = target - current;
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const noise = (Math.random() - 0.5) * (current * 0.02); // 2% noise
    const value = current + (diff * progress) + noise;
    data.push({
      time: i,
      price: Math.max(0, value),
    });
  }
  return data;
};

export default function AlphaSignalsPage() {
  const [signals, setSignals] = useState<AlphaSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [strengthFilter, setStrengthFilter] = useState('All Strengths');
  const [typeFilter, setTypeFilter] = useState('All Types');

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const alphaSignals = await dataAggregator.getAlphaSignals();
        setSignals(alphaSignals);
      } catch (error) {
        console.error('Error fetching alpha signals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
    
    // Refresh every 15 seconds
    const interval = setInterval(fetchSignals, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredSignals = signals.filter(signal => {
    const matchesSearch = signal.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signal.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStrength = strengthFilter === 'All Strengths' || 
                           (strengthFilter === 'High' && signal.confidence >= 80) ||
                           (strengthFilter === 'Medium' && signal.confidence >= 60 && signal.confidence < 80) ||
                           (strengthFilter === 'Low' && signal.confidence < 60);
    return matchesSearch && matchesStrength;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="alpha-signals" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="alpha-signals" className="data-[state=active]:bg-orange-600">
            Alpha Signals
          </TabsTrigger>
          <TabsTrigger value="smart-money" className="data-[state=active]:bg-orange-600">
            <Fish className="h-4 w-4 mr-2" />
            Smart Money
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alpha-signals" className="space-y-6">
          <div className="flex gap-6">
            <div className="flex-1 space-y-6">
        {/* Header, stats, filters, signal cards, and footer stats go here, mapped to dynamic data as in the previous integration. */}
        {/* Use the alpha_signals.html layout as a reference for structure and style. */}
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-500">{signals.length}</p>
                  <p className="text-sm text-slate-300">Total Signals</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-500">
                    {signals.filter(s => s.confidence >= 80).length}
                  </p>
                  <p className="text-sm text-slate-300">High Confidence</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-500">
                    {Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signals.length)}%
                  </p>
                  <p className="text-sm text-slate-300">Avg Confidence</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-500">11:13:21 PM</p>
                  <p className="text-sm text-slate-300">Last Update</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search signals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Select value={strengthFilter} onValueChange={setStrengthFilter}>
                  <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="All Strengths">All Strengths</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="All Types">All Types</SelectItem>
                    <SelectItem value="Performance">Performance</SelectItem>
                    <SelectItem value="Volume">Volume</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Demo Mode
                </Button>
                <Button 
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Auto ON
                </Button>
                <Button 
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSignals.map((signal) => {
            const priceData = generatePriceData(signal.priceMovement.current, signal.priceMovement.target);
            const isPositive = signal.performanceValue > 0;
            
            return (
              <Card key={signal.id} className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {signal.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{signal.symbol}</h3>
                        <div className="flex gap-2">
                          {signal.tags.map((tag, idx) => (
                            <Badge 
                              key={idx}
                              variant={tag === 'CRITICAL' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-500">
                        {signal.confidence}%
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(signal.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Performance */}
                    <Card className="bg-green-900/20 border-green-800">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-slate-300">Performance</span>
                        </div>
                        <div className="text-xl font-bold text-green-400">
                          {signal.performance}
                        </div>
                        <div className="text-sm text-green-300">
                          {isPositive ? '+' : ''}{signal.performanceValue.toFixed(1)}%
                        </div>
                      </CardContent>
                    </Card>

                    {/* Price Movement */}
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-slate-300">Price Movement</span>
                        </div>
                        <div className="text-lg font-bold text-white">
                          ${signal.priceMovement.current.toFixed(4)}
                        </div>
                        <div className="text-sm text-slate-400">
                          Target: ${signal.priceMovement.target.toFixed(4)}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Risk Analysis */}
                    <Card className={`border ${
                      signal.riskLevel === 'LOW' ? 'bg-green-900/20 border-green-800' :
                      signal.riskLevel === 'MEDIUM' ? 'bg-yellow-900/20 border-yellow-800' :
                      'bg-red-900/20 border-red-800'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-orange-400" />
                          <span className="text-sm text-slate-300">Risk Analysis</span>
                        </div>
                        <div className={`text-xl font-bold ${
                          signal.riskLevel === 'LOW' ? 'text-green-400' :
                          signal.riskLevel === 'MEDIUM' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {signal.riskLevel}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Price Chart */}
                  <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceData}>
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke={isPositive ? "#10b981" : "#ef4444"}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        </div>
        <div className="w-[400px] flex-shrink-0 hidden xl:block">
          <Card className="bg-slate-800 border-slate-700 h-full">
            <CardHeader>
              <CardTitle className="text-white">Live Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <rssapp-feed id="KInUwTcvBFvBtO7j"></rssapp-feed>
            </CardContent>
          </Card>
        </div>
      </div>
      <Script src="https://widget.rss.app/v1/feed.js" type="text/javascript" async />
      </TabsContent>

      <TabsContent value="smart-money" className="space-y-6">
        <WhaleTracker />
      </TabsContent>
      
      </Tabs>
    </>
  );
}