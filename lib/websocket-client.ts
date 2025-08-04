// WebSocket client for real-time data updates using Helius
'use client';

// TokenPriceUpdate interface moved to realtime-price-service.ts

export interface WebSocketMessage {
  type: 'price_update' | 'account_change' | 'transaction' | 'error';
  data: any;
}

export class HeliusWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscribers = new Map<string, Set<(data: any) => void>>();
  private isConnected = false;
  private wsUrl: string;

  constructor() {
    // Use the WebSocket URL from environment variables
    this.wsUrl = process.env.NEXT_PUBLIC_HELIUS_WEBSOCKET || 'wss://mainnet.helius-rpc.com';
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔌 Connecting to Helius WebSocket:', this.wsUrl);
        this.ws = new WebSocket(this.wsUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected to Helius');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Subscribe to account changes for popular tokens
          this.subscribeToTokenAccounts();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('❌ Error parsing WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.isConnected = false;
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket disconnected:', event.code, event.reason);
          this.isConnected = false;
          this.handleReconnect();
        };

      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  private subscribeToTokenAccounts() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    // Subscribe to popular Solana token accounts for price updates
    const popularTokens = [
      'So11111111111111111111111111111111111111112', // SOL
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
      'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
      'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn', // JitoSOL
    ];

    popularTokens.forEach(tokenMint => {
      const subscribeMessage = {
        jsonrpc: '2.0',
        id: `token_${tokenMint}`,
        method: 'accountSubscribe',
        params: [
          tokenMint,
          {
            encoding: 'jsonParsed',
            commitment: 'confirmed'
          }
        ]
      };

      this.ws?.send(JSON.stringify(subscribeMessage));
    });

    console.log('📡 Subscribed to token account updates');
  }

  private handleMessage(message: WebSocketMessage) {
    // Notify all subscribers for this message type
    const typeSubscribers = this.subscribers.get(message.type);
    if (typeSubscribers) {
      typeSubscribers.forEach(callback => {
        try {
          callback(message.data);
        } catch (error) {
          console.error('❌ Error in WebSocket subscriber callback:', error);
        }
      });
    }

    // Notify all subscribers (wildcard)
    const allSubscribers = this.subscribers.get('*');
    if (allSubscribers) {
      allSubscribers.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('❌ Error in WebSocket wildcard subscriber callback:', error);
        }
      });
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('❌ Reconnection failed:', error);
      });
    }, delay);
  }

  subscribe(eventType: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    this.subscribers.get(eventType)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const typeSubscribers = this.subscribers.get(eventType);
      if (typeSubscribers) {
        typeSubscribers.delete(callback);
        if (typeSubscribers.size === 0) {
          this.subscribers.delete(eventType);
        }
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.subscribers.clear();
    console.log('🔌 WebSocket manually disconnected');
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Send a custom message to the WebSocket
  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message');
    }
  }
}

// Singleton instance
let wsClient: HeliusWebSocketClient | null = null;

export const getWebSocketClient = (): HeliusWebSocketClient => {
  if (!wsClient) {
    wsClient = new HeliusWebSocketClient();
  }
  return wsClient;
};

// React hook for WebSocket integration
export const useWebSocket = () => {
  const client = getWebSocketClient();
  
  return {
    client,
    isConnected: client.getConnectionStatus(),
    connect: () => client.connect(),
    disconnect: () => client.disconnect(),
    subscribe: (eventType: string, callback: (data: any) => void) => client.subscribe(eventType, callback)
  };
};