// Reusable component for displaying real-time prices
'use client';

import { useEffect, useState } from 'react';
import { getRealtimePriceService } from '@/lib/realtime-price-service';
import type { TokenPriceUpdate } from '@/lib/realtime-price-service';

interface RealtimePriceProps {
  symbol: string;
  className?: string;
  showChange?: boolean;
  showVolume?: boolean;
  precision?: number;
}

export function RealtimePrice({ 
  symbol, 
  className = '', 
  showChange = true, 
  showVolume = false,
  precision = 2 
}: RealtimePriceProps) {
  const [priceData, setPriceData] = useState<TokenPriceUpdate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealtime, setIsRealtime] = useState(false);

  useEffect(() => {
    const priceService = getRealtimePriceService();
    
    // Initialize service
    priceService.initialize().then(() => {
      setIsLoading(false);
    });

    // Subscribe to price updates
    const unsubscribe = priceService.subscribeToPrice(symbol, (update: TokenPriceUpdate) => {
      setPriceData(update);
      setIsRealtime(true);
      setIsLoading(false);
    });

    // Get initial cached price
    const cached = priceService.getLatestPrice(symbol);
    if (cached) {
      setPriceData(cached);
      setIsLoading(false);
    }

    return unsubscribe;
  }, [symbol]);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-slate-700 rounded w-16"></div>
      </div>
    );
  }

  if (!priceData) {
    return (
      <div className={className}>
        <span className="text-slate-400">--</span>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return price.toFixed(precision);
    } else {
      return price.toFixed(6);
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`;
    }
    return volume.toFixed(0);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-semibold">
            ${formatPrice(priceData.price)}
          </span>
          {isRealtime && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Real-time price"></div>
          )}
        </div>
        
        {showChange && (
          <div className={`text-sm font-medium ${
            priceData.change24h >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {priceData.change24h >= 0 ? '+' : ''}{priceData.change24h.toFixed(2)}%
          </div>
        )}
        
        {showVolume && (
          <div className="text-xs text-slate-400">
            Vol: ${formatVolume(priceData.volume24h)}
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for using real-time price data
export function useRealtimePrice(symbol: string) {
  const [priceData, setPriceData] = useState<TokenPriceUpdate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealtime, setIsRealtime] = useState(false);

  useEffect(() => {
    const priceService = getRealtimePriceService();
    
    priceService.initialize().then(() => {
      setIsLoading(false);
    });

    const unsubscribe = priceService.subscribeToPrice(symbol, (update: TokenPriceUpdate) => {
      setPriceData(update);
      setIsRealtime(true);
      setIsLoading(false);
    });

    const cached = priceService.getLatestPrice(symbol);
    if (cached) {
      setPriceData(cached);
      setIsLoading(false);
    }

    return unsubscribe;
  }, [symbol]);

  return { priceData, isLoading, isRealtime };
}