'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ExternalLink,
  Activity
} from 'lucide-react';

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

interface RecentActivityFeedProps {
  activities: WhaleTransaction[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
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

  const getCategoryColor = (category: string) => {
    const colors = {
      'VC_FUND': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'HEDGE_FUND': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'MARKET_MAKER': 'bg-green-500/20 text-green-300 border-green-500/30',
      'KNOWN_TRADER': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'INSTITUTION': 'bg-red-500/20 text-red-300 border-red-500/30',
      'PROJECT_TREASURY': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-300';
  };

  const handleViewTransaction = (signature: string) => {
    window.open(`https://solscan.io/tx/${signature}`, '_blank');
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="h-16 w-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">No Recent Activity</h3>
        <p className="text-gray-400">
          Whale transactions will appear here as they happen
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Whale Activity</h3>
        <Badge variant="outline" className="text-gray-300">
          {activities.length} transactions
        </Badge>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getTransactionIcon(activity.transactionType)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white truncate">
                      {activity.wallet.label}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getCategoryColor(activity.wallet.category)}`}
                    >
                      {activity.wallet.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`font-semibold ${getTransactionColor(activity.transactionType)}`}>
                      {activity.transactionType}
                    </span>
                    <span className="text-white">
                      {activity.amount.toLocaleString()} {activity.tokenSymbol}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-green-400 font-semibold text-sm">
                      ${activity.usdValue.toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-400 text-xs">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleViewTransaction(activity.signature)}
                className="text-gray-400 hover:text-white ml-2"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length > 10 && (
        <div className="text-center pt-4 border-t border-gray-800">
          <Button variant="ghost" className="text-orange-400 hover:text-orange-300">
            View All Activity
          </Button>
        </div>
      )}
    </div>
  );
}