'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataAggregator, TokenData } from '@/lib/data-services';
import { alertsApi } from '@/lib/api-client';
import { usePrivy } from '@privy-io/react-auth';
import { 
  Bell, 
  TrendingUp, 
  AlertTriangle, 
  BellRing,
  Pause,
  Trash2,
  Plus,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const dataAggregator = new DataAggregator();

export default function AlertsPage() {
  const { user } = usePrivy();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Get real alerts from database
        const { alerts: userAlerts } = await alertsApi.getAlerts(user.id);
        setAlerts(userAlerts);
        
        // Get token data for all symbols in alerts
        const uniqueSymbols = [...new Set(userAlerts.map(alert => alert.symbol.toLowerCase()))];
        if (uniqueSymbols.length > 0) {
          const tokenData = await dataAggregator.getMarketData(uniqueSymbols);
          setTokens(tokenData);
        }
        
      } catch (error) {
        console.error('Error fetching alerts data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 30 seconds to check for triggered alerts
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const pauseAlert = async (alertId: string) => {
    if (!user?.id) return;
    
    try {
      const alert = alerts.find(a => a.id === alertId);
      if (!alert) return;
      
      const newStatus = alert.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED';
      await alertsApi.updateAlert(user.id, alertId, { status: newStatus });
      
      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, status: newStatus } : a
      ));
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const deleteAlert = async (alertId: string) => {
    if (!user?.id) return;
    
    try {
      await alertsApi.deleteAlert(user.id, alertId);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE').length;
  const triggeredAlerts = alerts.filter(a => a.status === 'TRIGGERED').length;
  const pausedAlerts = alerts.filter(a => a.status === 'PAUSED').length;

  // Helper function to get current value for an alert
  const getCurrentValue = (alert: any) => {
    const token = tokens.find(t => t.symbol.toLowerCase() === alert.symbol.toLowerCase());
    if (!token) return 0;
    
    switch (alert.type) {
      case 'PRICE':
        return token.price;
      case 'VOLUME':
        return token.volume24h;
      case 'PERCENT_CHANGE':
        return token.change24h;
      default:
        return 0;
    }
  };

  // Helper function to format alert condition
  const formatCondition = (alert: any) => {
    const operatorText = alert.operator === 'ABOVE' ? 'above' : 'below';
    switch (alert.type) {
      case 'PRICE':
        return `Price ${operatorText} $${alert.targetValue.toFixed(4)}`;
      case 'VOLUME':
        return `Volume ${operatorText} $${(alert.targetValue / 1e6).toFixed(1)}M`;
      case 'PERCENT_CHANGE':
        return `24h change ${operatorText} ${alert.targetValue > 0 ? '+' : ''}${alert.targetValue.toFixed(1)}%`;
      default:
        return `${alert.type} ${operatorText} ${alert.targetValue}`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded"></div>
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
            <Link href="/platform/alerts" className="text-[#ff6b35] font-semibold">Alerts</Link>
            <Link href="/platform/watchlist" className="text-white hover:text-[#ff6b35] transition">Watchlist</Link>
            <Link href="/platform/search-tokens" className="text-white hover:text-[#ff6b35] transition">Search Tokens</Link>
            <Link href="/platform/settings" className="text-white hover:text-[#ff6b35] transition">Settings</Link>
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Alerts</h2>
          <button className="bg-[#ff6b35] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#ff5722] transition">Create Alert</button>
        </div>
        {/* Alerts Table */}
        <div className="bg-[#151a26] rounded-xl shadow-lg p-6">
          <table className="min-w-full divide-y divide-[#2a3441]">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Condition</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {/* Map over alerts data here */}
              {alerts.map((alert, idx) => (
                <tr key={idx} className="hover:bg-[#23283a] transition">
                  <td className="px-4 py-3 text-white font-semibold">{alert.type}</td>
                  <td className="px-4 py-3 text-slate-300">{alert.condition}</td>
                  <td className="px-4 py-3 text-slate-300">{alert.value}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.status === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200'}`}>{alert.status}</span>
                  </td>
                                     <td className="px-4 py-3 flex gap-2">
                     <button className="text-[#ff6b35] hover:underline" onClick={() => console.log('Edit alert:', alert)}>Edit</button>
                     <button className="text-red-500 hover:underline" onClick={() => console.log('Delete alert:', alert)}>Delete</button>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}