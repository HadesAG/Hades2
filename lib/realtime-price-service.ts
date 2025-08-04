// Real-time price service that combines WebSocket + polling for comprehensive price updates
'use client';

import { getWebSocketClient } from './websocket-client';

import { DataAggregator } from './data-services';

export interface TokenPriceUpdate {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
}

export interface PriceSubscription {
  symbol: string;
  callback: (update: TokenPriceUpdate) => void;
}

export class RealtimePriceService {
  private dataAggregator = new DataAggregator();
  private wsClient = getWebSocketClient();
  private priceCache = new Map<string, TokenPriceUpdate>();
  private subscriptions = new Map<string, Set<(update: TokenPriceUpdate) => void>>();
  private pollingInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Connect to WebSocket for real-time updates
      await this.wsClient.connect();
      
      // Subscribe to WebSocket messages
      this.wsClient.subscribe('*', (message) => {
        this.handleWebSocketMessage(message);
      });

      // Start polling fallback for tokens not covered by WebSocket
      this.startPolling();
      
      this.isInitialized = true;
      console.log('🚀 Realtime Price Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Realtime Price Service:', error);
      // Fallback to polling only
      this.startPolling();
      this.isInitialized = true;
    }
  }

  private handleWebSocketMessage(message: any) {
    try {
      // Parse Helius WebSocket messages and convert to price updates
      if (message.method === 'accountNotification') {
        const accountData = message.params?.result?.value;
        if (accountData) {
          // Extract price data from account changes
          // This is a simplified example - you'd need to parse the actual token account data
          const priceUpdate = this.parseAccountDataToPriceUpdate(accountData);
          if (priceUpdate) {
            this.updatePrice(priceUpdate);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error handling WebSocket message:', error);
    }
  }

  private parseAccountDataToPriceUpdate(accountData: any): TokenPriceUpdate | null {
    // This is a simplified parser - in production you'd need to:
    // 1. Identify the token from the account data
    // 2. Extract price information from DEX pool data
    // 3. Calculate 24h change and volume
    
    // For now, return null and rely on polling
    // In a full implementation, you'd parse Jupiter/Raydium pool data
    return null;
  }

  private startPolling() {
    // Poll every 10 seconds for price updates
    this.pollingInterval = setInterval(async () => {
      await this.pollPriceUpdates();
    }, 10000);

    console.log('📊 Started price polling (10s intervals)');
  }

  private async pollPriceUpdates() {
    try {
      // Get all unique symbols from subscriptions
      const symbols = Array.from(this.subscriptions.keys());
      if (symbols.length === 0) return;

      // Fetch latest prices from DataAggregator
      const tokenData = await this.dataAggregator.getMarketData(symbols);
      
      // Update cache and notify subscribers
      tokenData.forEach(token => {
        const priceUpdate: TokenPriceUpdate = {
          symbol: token.symbol,
          price: token.price,
          change24h: token.change24h,
          volume24h: token.volume24h,
          timestamp: Date.now()
        };

        this.updatePrice(priceUpdate);
      });

    } catch (error) {
      console.error('❌ Error polling price updates:', error);
    }
  }

  private updatePrice(update: TokenPriceUpdate) {
    // Update cache
    const cached = this.priceCache.get(update.symbol);
    const hasChanged = !cached || 
      cached.price !== update.price || 
      cached.change24h !== update.change24h ||
      cached.volume24h !== update.volume24h;

    if (hasChanged) {
      this.priceCache.set(update.symbol, update);
      
      // Notify subscribers
      const subscribers = this.subscriptions.get(update.symbol);
      if (subscribers) {
        subscribers.forEach(callback => {
          try {
            callback(update);
          } catch (error) {
            console.error('❌ Error in price update callback:', error);
          }
        });
      }
    }
  }

  subscribeToPrice(symbol: string, callback: (update: TokenPriceUpdate) => void): () => void {
    const upperSymbol = symbol.toUpperCase();
    
    if (!this.subscriptions.has(upperSymbol)) {
      this.subscriptions.set(upperSymbol, new Set());
    }
    
    this.subscriptions.get(upperSymbol)!.add(callback);
    
    // If we have cached data, immediately call the callback
    const cached = this.priceCache.get(upperSymbol);
    if (cached) {
      try {
        callback(cached);
      } catch (error) {
        console.error('❌ Error in immediate price callback:', error);
      }
    }
    
    // Return unsubscribe function
    return () => {
      const subscribers = this.subscriptions.get(upperSymbol);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscriptions.delete(upperSymbol);
        }
      }
    };
  }

  getLatestPrice(symbol: string): TokenPriceUpdate | null {
    return this.priceCache.get(symbol.toUpperCase()) || null;
  }

  getAllPrices(): Map<string, TokenPriceUpdate> {
    return new Map(this.priceCache);
  }

  destroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    this.wsClient.disconnect();
    this.subscriptions.clear();
    this.priceCache.clear();
    this.isInitialized = false;
    
    console.log('🔌 Realtime Price Service destroyed');
  }
}

// Singleton instance
let priceService: RealtimePriceService | null = null;

export const getRealtimePriceService = (): RealtimePriceService => {
  if (!priceService) {
    priceService = new RealtimePriceService();
  }
  return priceService;
};

// React hook for real-time price updates
export const useRealtimePrice = (symbol: string) => {
  const [price, setPrice] = React.useState<TokenPriceUpdate | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const service = getRealtimePriceService();
    
    // Initialize service if not already done
    service.initialize().then(() => {
      setIsLoading(false);
    });
    
    // Subscribe to price updates
    const unsubscribe = service.subscribeToPrice(symbol, (update) => {
      setPrice(update);
      setIsLoading(false);
    });
    
    // Get initial price if available
    const cached = service.getLatestPrice(symbol);
    if (cached) {
      setPrice(cached);
      setIsLoading(false);
    }
    
    return unsubscribe;
  }, [symbol]);
  
  return { price, isLoading };
};

// Import React for the hook
import React from 'react';