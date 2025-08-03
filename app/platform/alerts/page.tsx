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
    <div className="space-y-6">
      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-500">{totalAlerts}</p>
                <p className="text-sm text-slate-300">Total Alerts</p>
              </div>
              <Bell className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-500">{activeAlerts}</p>
                <p className="text-sm text-slate-300">Active</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-500">{triggeredAlerts}</p>
                <p className="text-sm text-slate-300">Triggered</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-500">{pausedAlerts}</p>
                <p className="text-sm text-slate-300">Paused</p>
              </div>
              <Pause className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Alert Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Manage your notifications and price alerts</h2>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const token = tokens.find(t => t.symbol.toLowerCase() === alert.symbol.toLowerCase());
          const statusColor = {
            ACTIVE: 'bg-green-600',
            TRIGGERED: 'bg-red-600',
            PAUSED: 'bg-gray-600'
          }[alert.status as 'ACTIVE' | 'TRIGGERED' | 'PAUSED'];
          
          const statusIcon = {
            ACTIVE: CheckCircle,
            TRIGGERED: AlertTriangle,
            PAUSED: Pause
          }[alert.status as 'ACTIVE' | 'TRIGGERED' | 'PAUSED'];
          
          const StatusIcon = statusIcon;
          
          return (
            <Card key={alert.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      {token?.image ? (
                        <img 
                          src={token.image} 
                          alt={alert.symbol}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {alert.symbol.slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-white">{alert.symbol}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={`${statusColor} text-white`}>
                            {alert.status}
                          </Badge>
                          {alert.type === 'PRICE' && <Badge variant="outline">PRICE ALERT</Badge>}
                          {alert.type === 'VOLUME' && <Badge variant="outline">VOLUME ALERT</Badge>}
                          {alert.type === 'PERCENT_CHANGE' && <Badge variant="outline">CHANGE ALERT</Badge>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-8">
                      <p className="text-white font-medium">{formatCondition(alert)}</p>
                      <p className="text-sm text-slate-400">
                        Created {new Date(alert.createdAt).toLocaleDateString()}
                        {alert.triggeredAt && (
                          <span className="text-red-400 ml-2">
                            • Triggered {new Date(alert.triggeredAt).toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white font-semibold">Current Value</p>
                      <p className="text-lg font-bold text-blue-400">
                        {alert.type === 'PRICE' ? `$${getCurrentValue(alert).toFixed(4)}` :
                         alert.type === 'VOLUME' ? `$${(getCurrentValue(alert) / 1e6).toFixed(1)}M` :
                         alert.type === 'PERCENT_CHANGE' ? `${getCurrentValue(alert).toFixed(2)}%` :
                         getCurrentValue(alert).toFixed(2)
                        }
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => pauseAlert(alert.id)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        {alert.status === 'PAUSED' ? 'Activate' : 'Pause'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteAlert(alert.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {alerts.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No alerts set up</h3>
            <p className="text-slate-400 mb-6">
              Create price and volume alerts to stay informed about market movements.
            </p>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Alert
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}