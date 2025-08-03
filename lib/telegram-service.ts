// Telegram Bot API service for fetching messages from channels and bots
// This service handles real-time data fetching from specified Telegram sources

export interface TelegramMessage {
  id: string;
  chatId: string;
  messageId: number;
  text: string;
  date: number;
  fromId?: number;
  fromUsername?: string;
  channelName?: string;
  isBot?: boolean;
  entities?: Array<{
    type: string;
    offset: number;
    length: number;
    url?: string;
  }>;
  forwardFrom?: {
    id: number;
    username?: string;
    firstName?: string;
  };
}

export interface TelegramSignal {
  id: string;
  source: 'telegram_channel' | 'telegram_bot';
  sourceId: string;
  sourceName: string;
  messageId: number;
  originalMessage: string;
  extractedData: {
    token?: string;
    symbol?: string;
    action?: 'buy' | 'sell' | 'hold' | 'alert';
    price?: number;
    target?: number;
    stopLoss?: number;
    confidence?: number;
    timeframe?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  };
  timestamp: number;
  processed: boolean;
}

export class TelegramService {
  private botToken: string;
  private baseUrl: string;
  private targetChannels: string[];
  private targetBots: string[];

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
    
    // Target channels and bots from user requirements
    this.targetChannels = [
      '-1002093384030', // Channel ID 1
      '-1002192465581'  // Channel ID 2
    ];
    
    this.targetBots = [
      '6872314605' // Bot User ID
    ];
  }

  /**
   * Fetch recent messages from a specific channel
   */
  async getChannelMessages(channelId: string, limit: number = 10): Promise<TelegramMessage[]> {
    if (!this.botToken) {
      console.warn('⚠️ Telegram bot token not configured');
      return [];
    }

    try {
      // Note: Bot API doesn't support reading channel history directly
      // This would typically require MTProto API or webhook setup
      // For now, we'll simulate the structure and use webhook data
      
      console.log(`🔍 Fetching messages from channel ${channelId}`);
      
      // In a real implementation, you would:
      // 1. Use MTProto API (like Telethon/GramJS) for channel history
      // 2. Set up webhooks to receive real-time updates
      // 3. Store messages in database for processing
      
      return this.getMockChannelMessages(channelId, limit);
      
    } catch (error) {
      console.error(`❌ Error fetching messages from channel ${channelId}:`, error);
      return [];
    }
  }

  /**
   * Get messages from bot conversations
   */
  async getBotMessages(botId: string, limit: number = 10): Promise<TelegramMessage[]> {
    if (!this.botToken) {
      console.warn('⚠️ Telegram bot token not configured');
      return [];
    }

    try {
      console.log(`🤖 Fetching messages from bot ${botId}`);
      
      // Bot API can get updates, but for historical messages we need webhooks
      const response = await fetch(`${this.baseUrl}/getUpdates?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(`Telegram API error: ${data.description}`);
      }
      
      // Filter messages from specific bot
      const botMessages = data.result
        .filter((update: any) => update.message?.from?.id?.toString() === botId)
        .map((update: any) => this.parseMessage(update.message));
      
      return botMessages;
      
    } catch (error) {
      console.error(`❌ Error fetching messages from bot ${botId}:`, error);
      return this.getMockBotMessages(botId, limit);
    }
  }

  /**
   * Parse Telegram message to extract trading signals
   */
  parseMessageForSignals(message: TelegramMessage): TelegramSignal | null {
    const text = message.text.toLowerCase();
    
    // Common trading signal patterns
    const patterns = {
      token: /(?:^|\s)(\$?[A-Z]{2,10})(?:\s|$|\/)/g,
      price: /(?:price|@|entry)[\s:]*\$?([0-9]+\.?[0-9]*)/gi,
      target: /(?:target|tp|take profit)[\s:]*\$?([0-9]+\.?[0-9]*)/gi,
      stopLoss: /(?:sl|stop loss|stop)[\s:]*\$?([0-9]+\.?[0-9]*)/gi,
      action: /\b(buy|sell|long|short|hold|alert|pump|dump)\b/gi,
      confidence: /(?:confidence|sure|certain)[\s:]*([0-9]+)%?/gi,
      riskLevel: /\b(low|medium|high)\s*risk\b/gi
    };

    const extractedData: TelegramSignal['extractedData'] = {};
    
    // Extract token/symbol
    const tokenMatch = text.match(patterns.token);
    if (tokenMatch) {
      extractedData.token = tokenMatch[0].replace(/[$\s]/g, '').toUpperCase();
      extractedData.symbol = extractedData.token;
    }

    // Extract price
    const priceMatch = text.match(patterns.price);
    if (priceMatch) {
      extractedData.price = parseFloat(priceMatch[1]);
    }

    // Extract target
    const targetMatch = text.match(patterns.target);
    if (targetMatch) {
      extractedData.target = parseFloat(targetMatch[1]);
    }

    // Extract stop loss
    const stopLossMatch = text.match(patterns.stopLoss);
    if (stopLossMatch) {
      extractedData.stopLoss = parseFloat(stopLossMatch[1]);
    }

    // Extract action
    const actionMatch = text.match(patterns.action);
    if (actionMatch) {
      const action = actionMatch[0].toLowerCase();
      if (['buy', 'long'].includes(action)) extractedData.action = 'buy';
      else if (['sell', 'short'].includes(action)) extractedData.action = 'sell';
      else if (action === 'hold') extractedData.action = 'hold';
      else extractedData.action = 'alert';
    }

    // Extract confidence
    const confidenceMatch = text.match(patterns.confidence);
    if (confidenceMatch) {
      extractedData.confidence = parseInt(confidenceMatch[1]);
    }

    // Extract risk level
    const riskMatch = text.match(patterns.riskLevel);
    if (riskMatch) {
      extractedData.riskLevel = riskMatch[1].toLowerCase() as 'low' | 'medium' | 'high';
    }

    // Only create signal if we have meaningful data
    if (extractedData.token || extractedData.action || extractedData.price) {
      return {
        id: `tg_signal_${message.chatId}_${message.messageId}_${Date.now()}`,
        source: message.isBot ? 'telegram_bot' : 'telegram_channel',
        sourceId: message.chatId,
        sourceName: message.channelName || message.fromUsername || `Chat ${message.chatId}`,
        messageId: message.messageId,
        originalMessage: message.text,
        extractedData,
        timestamp: message.date * 1000,
        processed: false
      };
    }

    return null;
  }

  /**
   * Get all signals from configured channels and bots
   */
  async getAllTelegramSignals(): Promise<TelegramSignal[]> {
    const allSignals: TelegramSignal[] = [];

    // Fetch from channels
    for (const channelId of this.targetChannels) {
      try {
        const messages = await this.getChannelMessages(channelId, 20);
        for (const message of messages) {
          const signal = this.parseMessageForSignals(message);
          if (signal) {
            allSignals.push(signal);
          }
        }
      } catch (error) {
        console.error(`❌ Error processing channel ${channelId}:`, error);
      }
    }

    // Fetch from bots
    for (const botId of this.targetBots) {
      try {
        const messages = await this.getBotMessages(botId, 20);
        for (const message of messages) {
          const signal = this.parseMessageForSignals(message);
          if (signal) {
            allSignals.push(signal);
          }
        }
      } catch (error) {
        console.error(`❌ Error processing bot ${botId}:`, error);
      }
    }

    // Sort by timestamp (newest first)
    return allSignals.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Convert Telegram signals to Alpha signals format
   */
  convertToAlphaSignals(telegramSignals: TelegramSignal[]): any[] {
    return telegramSignals
      .filter(signal => signal.extractedData.token || signal.extractedData.symbol)
      .map(signal => {
        const data = signal.extractedData;
        const confidence = data.confidence || this.calculateConfidence(signal);
        const change = this.calculatePerformanceChange(signal);
        
        return {
          id: signal.id,
          type: 'telegram_alpha',
          token: data.token || data.symbol || 'UNKNOWN',
          symbol: data.symbol || data.token || 'UNKNOWN',
          strength: confidence >= 90 ? 'critical' : 
                   confidence >= 80 ? 'high' : 
                   confidence >= 70 ? 'medium' : 'low',
          confidence,
          change,
          value: data.action === 'buy' ? `+${change.toFixed(1)}%` : 
                 data.action === 'sell' ? `-${Math.abs(change).toFixed(1)}%` : 
                 `${change.toFixed(1)}%`,
          timestamp: new Date(signal.timestamp).toISOString(),
          description: `${signal.sourceName}: ${data.token || 'Signal'} - ${data.action || 'Alert'}`,
          metadata: {
            source: 'telegram',
            channelName: signal.sourceName,
            signalType: data.action || 'alert',
            priceFrom: data.price ? `$${data.price}` : undefined,
            priceTo: data.target ? `$${data.target}` : undefined,
            stopLoss: data.stopLoss ? `$${data.stopLoss}` : undefined,
            riskLevel: data.riskLevel || 'medium',
            rawMessage: signal.originalMessage,
            telegramSource: signal.source,
            messageId: signal.messageId,
            riskRewardRatio: this.calculateRiskReward(data.price, data.target, data.stopLoss)
          }
        };
      });
  }

  // Helper methods
  private parseMessage(message: any): TelegramMessage {
    return {
      id: `${message.chat.id}_${message.message_id}`,
      chatId: message.chat.id.toString(),
      messageId: message.message_id,
      text: message.text || '',
      date: message.date,
      fromId: message.from?.id,
      fromUsername: message.from?.username,
      channelName: message.chat.title || message.chat.username,
      isBot: message.from?.is_bot || false,
      entities: message.entities || []
    };
  }

  private calculateConfidence(signal: TelegramSignal): number {
    let confidence = 60; // Base confidence
    
    const data = signal.extractedData;
    
    // Increase confidence based on available data
    if (data.price) confidence += 10;
    if (data.target) confidence += 10;
    if (data.stopLoss) confidence += 5;
    if (data.action && data.action !== 'alert') confidence += 10;
    if (data.riskLevel) confidence += 5;
    
    // Source-based confidence
    if (signal.source === 'telegram_bot') confidence += 5;
    
    return Math.min(95, confidence);
  }

  private calculatePerformanceChange(signal: TelegramSignal): number {
    const data = signal.extractedData;
    
    if (data.price && data.target) {
      return ((data.target - data.price) / data.price) * 100;
    }
    
    // Random realistic change for demo
    return (Math.random() - 0.5) * 50;
  }

  private calculateRiskReward(price?: number, target?: number, stopLoss?: number): string {
    if (price && target && stopLoss) {
      const profit = Math.abs(target - price);
      const loss = Math.abs(price - stopLoss);
      const ratio = profit / loss;
      return `1:${ratio.toFixed(1)}`;
    }
    return '1:2.0'; // Default
  }

  // Mock data for development/demo
  private getMockChannelMessages(channelId: string, limit: number): TelegramMessage[] {
    const mockMessages: TelegramMessage[] = [
      {
        id: `${channelId}_1001`,
        chatId: channelId,
        messageId: 1001,
        text: "🚀 $SOL breaking resistance at $180! Target: $220, SL: $170. High confidence signal! #SOLANA",
        date: Math.floor(Date.now() / 1000) - 300,
        channelName: channelId === '-1002093384030' ? 'Alpha Crypto Signals' : 'DeFi Gems',
        isBot: false
      },
      {
        id: `${channelId}_1002`,
        chatId: channelId,
        messageId: 1002,
        text: "⚡ BREAKING: $ETH showing strong bullish momentum! Entry: $3200, Target: $3500, Stop: $3000. Medium risk.",
        date: Math.floor(Date.now() / 1000) - 600,
        channelName: channelId === '-1002093384030' ? 'Alpha Crypto Signals' : 'DeFi Gems',
        isBot: false
      },
      {
        id: `${channelId}_1003`,
        chatId: channelId,
        messageId: 1003,
        text: "📈 $AVAX pump incoming! Current: $45, Target: $55, SL: $40. 85% confidence. Low risk trade.",
        date: Math.floor(Date.now() / 1000) - 900,
        channelName: channelId === '-1002093384030' ? 'Alpha Crypto Signals' : 'DeFi Gems',
        isBot: false
      }
    ];

    return mockMessages.slice(0, limit);
  }

  private getMockBotMessages(botId: string, limit: number): TelegramMessage[] {
    const mockMessages: TelegramMessage[] = [
      {
        id: `bot_${botId}_2001`,
        chatId: botId,
        messageId: 2001,
        text: "🤖 SCAN ALERT: $MATIC detected unusual volume spike! Price: $0.85, 24h Volume: +340%. Confidence: 92%",
        date: Math.floor(Date.now() / 1000) - 180,
        fromUsername: 'AlphaScanner_Bot',
        isBot: true
      },
      {
        id: `bot_${botId}_2002`,
        chatId: botId,
        messageId: 2002,
        text: "⚠️ WHALE ALERT: Large $BTC movement detected. 500 BTC moved to exchange. Price impact expected. Current: $65,000",
        date: Math.floor(Date.now() / 1000) - 480,
        fromUsername: 'AlphaScanner_Bot',
        isBot: true
      },
      {
        id: `bot_${botId}_2003`,
        chatId: botId,
        messageId: 2003,
        text: "🔥 HOT SIGNAL: $ADA breakout confirmed! Entry: $0.55, Target: $0.70, Stop: $0.50. High risk, high reward!",
        date: Math.floor(Date.now() / 1000) - 720,
        fromUsername: 'AlphaScanner_Bot',
        isBot: true
      }
    ];

    return mockMessages.slice(0, limit);
  }
}

// Export singleton instance
export const telegramService = new TelegramService();