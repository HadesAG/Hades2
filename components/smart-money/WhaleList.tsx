'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  ExternalLink,
  Eye
} from 'lucide-react';

interface WhaleWallet {
  id: string;
  address: string;
  label: string;
  category: string;
  totalValue: number;
  isActive: boolean;
  _count?: {
    transactions: number;
    holdings: number;
  };
}

interface WhaleListProps {
  whales: WhaleWallet[];
  selectedWhale: string | null;
  onSelectWhale: (address: string | null) => void;
  compact?: boolean;
}

const categoryColors = {
  'VC_FUND': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'HEDGE_FUND': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'MARKET_MAKER': 'bg-green-500/20 text-green-300 border-green-500/30',
  'KNOWN_TRADER': 'bg-red-500/20 text-red-300 border-red-500/30',
  'INSTITUTION': 'bg-red-500/20 text-red-300 border-red-500/30',
  'PROJECT_TREASURY': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

const categoryLabels = {
  'VC_FUND': 'VC Fund',
  'HEDGE_FUND': 'Hedge Fund',
  'MARKET_MAKER': 'Market Maker',
  'KNOWN_TRADER': 'Known Trader',
  'INSTITUTION': 'Institution',
  'PROJECT_TREASURY': 'Project Treasury',
};

export function WhaleList({ whales, selectedWhale, onSelectWhale, compact = false }: WhaleListProps) {
  const handleViewPortfolio = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectWhale(selectedWhale === address ? null : address);
  };

  const handleViewOnExplorer = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://solscan.io/account/${address}`, '_blank');
  };

  if (whales.length === 0) {
    return (
      <div className="text-center py-8">
        <Wallet className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No whale wallets found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {whales.map((whale) => (
        <div
          key={whale.id}
          className={`
            p-4 rounded-lg border transition-all duration-200 cursor-pointer
            ${selectedWhale === whale.address 
              ? 'bg-red-500/10 border-red-500/30 shadow-lg' 
              : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
            }
          `}
          onClick={() => onSelectWhale(selectedWhale === whale.address ? null : whale.address)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-white truncate">
                  {whale.label}
                </h3>
                <Badge 
                  variant="outline" 
                  className={categoryColors[whale.category as keyof typeof categoryColors] || 'bg-gray-500/20 text-gray-300'}
                >
                  {categoryLabels[whale.category as keyof typeof categoryLabels] || whale.category}
                </Badge>
              </div>
              
              {!compact && (
                <p className="text-sm text-gray-400 font-mono truncate mb-2">
                  {whale.address}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Value:</span>
                  <span className="text-green-400 font-semibold">
                    ${whale.totalValue > 1000000 
                      ? `${(whale.totalValue / 1000000).toFixed(1)}M` 
                      : whale.totalValue > 1000 
                        ? `${(whale.totalValue / 1000).toFixed(0)}K`
                        : whale.totalValue.toLocaleString()
                    }
                  </span>
                </div>
                
                {whale._count && (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Holdings:</span>
                      <span className="text-blue-400">{whale._count.holdings}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Txs:</span>
                      <span className="text-purple-400">{whale._count.transactions}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleViewPortfolio(whale.address, e)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Eye className="h-4 w-4" />
                {!compact && <span className="ml-1">View</span>}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleViewOnExplorer(whale.address, e)}
                className="text-gray-400 hover:text-gray-300 hover:bg-gray-800"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {selectedWhale === whale.address && (
            <div className="mt-3 pt-3 border-t border-red-500/20">
              <div className="flex items-center gap-2 text-sm text-red-400">
                <TrendingUp className="h-4 w-4" />
                <span>Portfolio details loading...</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}