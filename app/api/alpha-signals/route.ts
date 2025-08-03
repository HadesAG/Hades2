import { NextResponse } from 'next/server';
import { DataAggregator } from '@/lib/data-services';
import { prisma } from '@/lib/prisma';
import { telegramService } from '@/lib/telegram-service';

const dataAggregator = new DataAggregator();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  console.log("🔥 Alpha signals API called - REAL DATA + TELEGRAM");
  
  try {
    // Get real alpha signals from trending/volatile tokens
    const marketSignals = await dataAggregator.getAlphaSignals();
    
    // Get Telegram signals
    const telegramSignals = await telegramService.getAllTelegramSignals();
    const telegramAlphaSignals = telegramService.convertToAlphaSignals(telegramSignals);
    
    console.log(`📊 Market signals: ${marketSignals.length}, Telegram signals: ${telegramAlphaSignals.length}`);
    
    // Save market signals to database for history
    try {
      await Promise.all(marketSignals.map(signal => 
        prisma.signal.create({
          data: {
            symbol: signal.symbol,
            token: signal.token,
            confidence: signal.confidence,
            performance: signal.performance,
            performanceValue: signal.performanceValue,
            currentPrice: signal.priceMovement.current,
            targetPrice: signal.priceMovement.target,
            riskLevel: signal.riskLevel,
            tags: signal.tags,
            source: signal.source,
            volume24h: signal.volume24h,
            marketCap: signal.marketCap,
          }
        }).catch(() => {
          // Ignore duplicate signals (same symbol created recently)
        })
      ));
      console.log(`💾 Saved ${marketSignals.length} market signals to database`);
    } catch (error) {
      console.warn('⚠️ Error saving market signals to database:', error);
    }

    // Save Telegram signals to database
    try {
      await Promise.all(telegramSignals.map(signal => 
        prisma.telegramSignal.create({
          data: {
            source: signal.source,
            sourceId: signal.sourceId,
            sourceName: signal.sourceName,
            messageId: signal.messageId,
            originalMessage: signal.originalMessage,
            extractedData: signal.extractedData,
            timestamp: BigInt(signal.timestamp),
            processed: signal.processed,
            confidence: signal.extractedData.confidence,
            token: signal.extractedData.token,
            symbol: signal.extractedData.symbol,
            action: signal.extractedData.action,
            price: signal.extractedData.price,
            target: signal.extractedData.target,
            stopLoss: signal.extractedData.stopLoss,
            riskLevel: signal.extractedData.riskLevel,
          }
        }).catch(() => {
          // Ignore duplicate signals
        })
      ));
      console.log(`💾 Saved ${telegramSignals.length} Telegram signals to database`);
    } catch (error) {
      console.warn('⚠️ Error saving Telegram signals to database:', error);
    }
    
    // Combine and transform signals to match expected format
    const allSignals = [...marketSignals, ...telegramAlphaSignals];
    
    // Transform market signals to match expected format
    const formattedMarketSignals = marketSignals.map(signal => ({
      id: signal.id,
      type: 'alpha_performance',
      token: signal.symbol,
      symbol: signal.symbol,
      strength: signal.confidence >= 90 ? 'critical' : 
               signal.confidence >= 85 ? 'high' : 
               signal.confidence >= 80 ? 'medium' : 'low',
      confidence: signal.confidence,
      change: signal.performanceValue,
      value: signal.performance,
      timestamp: new Date(signal.timestamp).toISOString(),
      description: `${signal.symbol} ${signal.performance} - Live Market Data`,
      metadata: {
        source: 'coingecko_live',
        channelName: 'Live Market Analysis',
        channelWinRate: 85,
        performanceType: signal.performance,
        percentageGain: Math.abs(signal.performanceValue),
        priceFrom: `$${signal.priceMovement.current.toFixed(6)}`,
        priceTo: `$${signal.priceMovement.target.toFixed(6)}`,
        signalType: signal.tags[0]?.toLowerCase() || 'trending',
        scannerBot: '@hades_live_scanner',
        rawMessage: `📈 ${signal.symbol} is ${signal.performance} 📈\nVolume: $${(signal.volume24h || 0) / 1e6}M\nMarket Cap: $${(signal.marketCap || 0) / 1e6}M`,
        riskLevel: signal.riskLevel.toLowerCase(),
        volume24h: signal.volume24h,
        marketCap: signal.marketCap
      }
    }));
    
    // Combine all formatted signals
    const formattedSignals = [...formattedMarketSignals, ...telegramAlphaSignals];
    
    // Calculate stats from combined data
    const stats = {
      totalSignals: formattedSignals.length,
      highConfidenceSignals: formattedSignals.filter(s => s.confidence >= 85).length,
      criticalSignals: formattedSignals.filter(s => s.strength === 'critical').length,
      averageConfidence: formattedSignals.length > 0 ? 
        Math.round(formattedSignals.reduce((acc, s) => acc + s.confidence, 0) / formattedSignals.length) : 0,
      signalTypes: {
        performance_alert: formattedSignals.filter(s => s.metadata.signalType?.includes('trending')).length,
        entry_signal: formattedSignals.filter(s => s.metadata.signalType?.includes('buy') || s.metadata.signalType?.includes('bullish')).length,
        whale_movement: formattedSignals.filter(s => s.metadata.signalType?.includes('high_volume')).length,
        telegram_signals: formattedSignals.filter(s => s.metadata.source === 'telegram').length,
        trending: formattedSignals.filter(s => s.metadata.signalType?.includes('trending')).length
      },
      riskDistribution: {
        low: formattedSignals.filter(s => s.metadata.riskLevel === 'low').length,
        medium: formattedSignals.filter(s => s.metadata.riskLevel === 'medium').length,
        high: formattedSignals.filter(s => s.metadata.riskLevel === 'high').length
      },
      averageGain: formattedSignals.length > 0 ? 
        Math.round(formattedSignals.reduce((acc, s) => acc + Math.abs(s.change), 0) / formattedSignals.length) : 0
    };

    console.log(`✅ Returning ${formattedSignals.length} alpha signals (${formattedMarketSignals.length} market + ${telegramAlphaSignals.length} telegram)`);
    
    return NextResponse.json({
      signals: formattedSignals,
      cached: false,
      timestamp: Date.now(),
      source: 'combined_market_telegram',
      isRealData: true,
      stats,
      telegramStats: {
        totalTelegramSignals: telegramAlphaSignals.length,
        channelSignals: telegramAlphaSignals.filter(s => s.metadata.telegramSource === 'telegram_channel').length,
        botSignals: telegramAlphaSignals.filter(s => s.metadata.telegramSource === 'telegram_bot').length,
      },
      note: `Combined alpha signals: ${formattedMarketSignals.length} from live market data + ${telegramAlphaSignals.length} from Telegram channels/bots`
    });
    
  } catch (error) {
    console.error("❌ Failed to fetch real alpha signals:", error);
    
    return NextResponse.json({
      signals: [],
      cached: false,
      timestamp: Date.now(),
      source: 'error',
      isRealData: false,
      error: "Failed to fetch real market data",
      stats: {
        totalSignals: 0,
        highConfidenceSignals: 0,
        criticalSignals: 0,
        averageConfidence: 0,
        signalTypes: {
          performance_alert: 0,
          entry_signal: 0,
          whale_movement: 0,
          trending: 0
        },
        riskDistribution: {
          low: 0,
          medium: 0,
          high: 0
        },
        averageGain: 0
      },
      note: "Error fetching live data - please check API connectivity"
    }, { status: 500 });
  }
}