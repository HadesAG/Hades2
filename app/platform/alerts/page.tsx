'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/components/auth/auth-guard';
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
    <AuthGuard 
      requireAuth={true}
      fallbackTitle="Alerts Access Required"
      fallbackDescription="Connect your Solana wallet or sign in with email to set up price alerts and get notified about market movements."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Price Alerts</h2>
          <Link href="/platform/watchlist">
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </Link>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Alerts</p>
                  <p className="text-2xl font-bold text-white">{totalAlerts}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active</p>
                  <p className="text-2xl font-bold text-green-500">{activeAlerts}</p>
                </div>
                <BellRing className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Triggered</p>
                  <p className="text-2xl font-bold text-red-500">{triggeredAlerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Paused</p>
                  <p className="text-2xl font-bold text-slate-400">{pausedAlerts}</p>
                </div>
                <Pause className="h-8 w-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Your Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Token</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Condition</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Current Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {alerts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        No alerts set up yet. 
                        <Link href="/platform/watchlist" className="text-red-500 hover:underline ml-1">
                          Add tokens to your watchlist to create alerts!
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    alerts.map((alert) => {
                      const currentValue = getCurrentValue(alert);
                      const statusColorMap: Record<string, string> = {
                        'ACTIVE': 'text-green-500 bg-green-500/10',
                        'TRIGGERED': 'text-red-500 bg-red-500/10',
                        'PAUSED': 'text-slate-400 bg-slate-400/10'
                      };
                      const statusColor = statusColorMap[alert.status] || 'text-slate-400 bg-slate-400/10';

                      return (
                        <tr key={alert.id} className="hover:bg-slate-700/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{alert.symbol.slice(0, 2).toUpperCase()}</span>
                              </div>
                              <span className="text-white font-semibold">{alert.symbol.toUpperCase()}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {formatCondition(alert)}
                          </td>
                          <td className="px-4 py-3 text-white font-medium">
                            {alert.type === 'PRICE' && `$${currentValue.toFixed(4)}`}
                            {alert.type === 'VOLUME' && `$${(currentValue / 1e6).toFixed(1)}M`}
                            {alert.type === 'PERCENT_CHANGE' && `${currentValue > 0 ? '+' : ''}${currentValue.toFixed(1)}%`}
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={`${statusColor} border-0`}>
                              {alert.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => pauseAlert(alert.id)}
                                className={`p-2 ${alert.status === 'PAUSED' ? 'text-green-400 hover:text-green-300' : 'text-slate-400 hover:text-white'}`}
                                title={alert.status === 'PAUSED' ? 'Resume alert' : 'Pause alert'}
                              >
                                {alert.status === 'PAUSED' ? <CheckCircle className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteAlert(alert.id)}
                                className="p-2 text-red-400 hover:text-red-300"
                                title="Delete alert"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}