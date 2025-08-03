import { NextResponse } from 'next/server';
import { telegramService } from '@/lib/telegram-service';

export const dynamic = 'force-dynamic';

/**
 * Test endpoint for Telegram integration
 * This endpoint allows testing the Telegram service directly from the browser
 */
export async function GET() {
  console.log('🧪 Testing Telegram integration...');
  
  try {
    const startTime = Date.now();
    
    // Test getting all Telegram signals
    const telegramSignals = await telegramService.getAllTelegramSignals();
    
    // Convert to alpha signals format
    const alphaSignals = telegramService.convertToAlphaSignals(telegramSignals);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Calculate statistics
    const stats = {
      totalTelegramSignals: telegramSignals.length,
      alphaSignalsGenerated: alphaSignals.length,
      channelSignals: telegramSignals.filter(s => s.source === 'telegram_channel').length,
      botSignals: telegramSignals.filter(s => s.source === 'telegram_bot').length,
      signalsWithTokens: telegramSignals.filter(s => s.extractedData.token).length,
      signalsWithPrices: telegramSignals.filter(s => s.extractedData.price).length,
      signalsWithTargets: telegramSignals.filter(s => s.extractedData.target).length,
      processingTimeMs: duration
    };
    
    // Sample signals for analysis
    const sampleSignals = telegramSignals.slice(0, 3).map(signal => ({
      id: signal.id,
      source: signal.source,
      sourceName: signal.sourceName,
      extractedData: signal.extractedData,
      originalMessage: signal.originalMessage.substring(0, 100) + '...'
    }));
    
    console.log(`✅ Telegram test completed: ${telegramSignals.length} signals processed in ${duration}ms`);
    
    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      stats,
      sampleSignals,
      telegramSignals: telegramSignals.length > 0 ? telegramSignals : undefined,
      alphaSignals: alphaSignals.length > 0 ? alphaSignals : undefined,
      configuration: {
        targetChannels: ['-1002093384030', '-1002192465581'],
        targetBots: ['6872314605'],
        botTokenConfigured: !!process.env.TELEGRAM_BOT_TOKEN
      },
      recommendations: generateRecommendations(stats)
    });
    
  } catch (error) {
    console.error('❌ Telegram test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: Date.now(),
      configuration: {
        targetChannels: ['-1002093384030', '-1002192465581'],
        targetBots: ['6872314605'],
        botTokenConfigured: !!process.env.TELEGRAM_BOT_TOKEN
      },
      recommendations: [
        'Check if TELEGRAM_BOT_TOKEN is configured in environment variables',
        'Verify bot has access to target channels',
        'Ensure bot is added as admin to channels',
        'Test with sample messages in channels'
      ]
    }, { status: 500 });
  }
}

/**
 * POST endpoint for testing with sample data
 */
export async function POST(request: Request) {
  console.log('🧪 Testing Telegram integration with sample data...');
  
  try {
    const body = await request.json();
    const { testMessage } = body;
    
    if (!testMessage) {
      return NextResponse.json({
        success: false,
        error: 'testMessage is required in request body'
      }, { status: 400 });
    }
    
    // Create a mock Telegram message
    const mockMessage = {
      id: `test_${Date.now()}`,
      chatId: '-1002093384030',
      messageId: Math.floor(Math.random() * 1000000),
      text: testMessage,
      date: Math.floor(Date.now() / 1000),
      channelName: 'Test Channel',
      isBot: false
    };
    
    // Test signal parsing
    const signal = telegramService.parseMessageForSignals(mockMessage);
    
    let alphaSignal = null;
    if (signal) {
      const alphaSignals = telegramService.convertToAlphaSignals([signal]);
      alphaSignal = alphaSignals[0];
    }
    
    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      testMessage,
      mockMessage,
      detectedSignal: signal,
      alphaSignal,
      analysis: {
        signalDetected: !!signal,
        tokenExtracted: signal?.extractedData?.token || null,
        actionDetected: signal?.extractedData?.action || null,
        priceDetected: signal?.extractedData?.price || null,
        targetDetected: signal?.extractedData?.target || null,
        confidenceCalculated: signal?.extractedData?.confidence || null
      }
    });
    
  } catch (error) {
    console.error('❌ Telegram POST test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: Date.now()
    }, { status: 500 });
  }
}

/**
 * Generate recommendations based on test results
 */
function generateRecommendations(stats: any): string[] {
  const recommendations = [];
  
  if (stats.totalTelegramSignals === 0) {
    recommendations.push('No Telegram signals found - check if bot has access to target channels');
    recommendations.push('Add bot as admin to channels: -1002093384030, -1002192465581');
    recommendations.push('Ensure bot has "Read Messages" permission');
    recommendations.push('Send test messages in channels to generate data');
  }
  
  if (stats.signalsWithTokens < stats.totalTelegramSignals) {
    recommendations.push('Some signals missing token information - improve message formatting');
    recommendations.push('Use clear token symbols like $BTC, $ETH, $SOL in messages');
  }
  
  if (stats.signalsWithPrices < stats.totalTelegramSignals / 2) {
    recommendations.push('Many signals missing price information - include entry prices');
    recommendations.push('Format prices as: "Price: $180" or "Entry: $180"');
  }
  
  if (stats.processingTimeMs > 5000) {
    recommendations.push('Processing time is high - consider optimizing signal parsing');
  }
  
  if (stats.channelSignals === 0 && stats.botSignals === 0) {
    recommendations.push('No signals from configured sources - verify channel/bot IDs');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Configuration looks good! Monitor for real-time updates');
    recommendations.push('Test with live trading signals in target channels');
  }
  
  return recommendations;
}