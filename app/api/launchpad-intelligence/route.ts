import { NextResponse } from 'next/server';
import { SolanaLaunchpadService } from '@/lib/data-services';

export async function GET() {
  try {
    const launchpadService = new SolanaLaunchpadService();
    
    const [launchpadData, sniperAlerts] = await Promise.all([
      launchpadService.getLaunchpadData(),
      launchpadService.getSniperAlerts()
    ]);
    
    // Calculate aggregated stats with enhanced metrics
    const totalLiquidity = launchpadData.reduce((sum, lp) => sum + lp.totalLiquidity, 0);
    const totalVolume24h = launchpadData.reduce((sum, lp) => sum + lp.volume24h, 0);
    const avgRugRate = launchpadData.reduce((sum, lp) => sum + lp.rugRate, 0) / (launchpadData.length || 1);
    const totalNewTokensPerHour = launchpadData.reduce((sum, lp) => sum + lp.newTokensPerHour, 0);
    
    // Get top performing launchpad
    const topPerformer = launchpadData.reduce((prev, current) => 
      (current.volume24h > prev.volume24h) ? current : prev,
      launchpadData[0] || { name: 'N/A', volumeChange24h: 0 }
    );

    // Enhanced market analysis with real-time data
    const marketTrend = totalVolume24h > 1000000 ? 'bullish' : totalVolume24h > 500000 ? 'neutral' : 'bearish';
    const volumeLevel = totalVolume24h > 5000000 ? 'high' : totalVolume24h > 1000000 ? 'medium' : 'low';
    const sentiment = avgRugRate < 10 ? 'positive' : avgRugRate < 20 ? 'neutral' : 'negative';
    const confidence = Math.min(95, Math.max(60, 85 - avgRugRate));

    // Platform-specific insights
    const platformInsights = launchpadData.map(lp => ({
      name: lp.name,
      platform: lp.platform,
      volume24h: lp.volume24h,
      volumeChange24h: lp.volumeChange24h,
      newTokensPerHour: lp.newTokensPerHour,
      rugRate: lp.rugRate,
      topPerformers: lp.topPerformers,
      bondingCurve: lp.bondingCurve,
      website: lp.website,
      description: lp.description,
      lastUpdated: lp.lastUpdated
    }));

    // Risk assessment
    const riskAssessment = {
      highRisk: launchpadData.filter(lp => lp.rugRate > 30).length,
      mediumRisk: launchpadData.filter(lp => lp.rugRate > 15 && lp.rugRate <= 30).length,
      lowRisk: launchpadData.filter(lp => lp.rugRate <= 15).length,
      totalPlatforms: launchpadData.length
    };

    // Performance metrics
    const performanceMetrics = {
      bestPerformer: topPerformer,
      averageVolumeChange: launchpadData.reduce((sum, lp) => sum + lp.volumeChange24h, 0) / (launchpadData.length || 1),
      totalNewTokens24h: totalNewTokensPerHour * 24,
      liquidityUtilization: (totalVolume24h / totalLiquidity) * 100
    };
    
    const intelligence = {
      launchpads: launchpadData,
      sniperAlerts: sniperAlerts.slice(0, 8), // Limit alerts
      platformInsights,
      aggregatedStats: {
        totalLiquidity,
        volume24h: totalVolume24h,
        launchpadsTracked: launchpadData.length,
        avgRugRate: parseFloat(avgRugRate.toFixed(2)),
        newTokensPerHour: totalNewTokensPerHour,
        topPerformer: {
          name: topPerformer.name,
          change24h: topPerformer.volumeChange24h,
          volume24h: topPerformer.volume24h
        }
      },
      marketAnalysis: {
        trend: marketTrend,
        volume: volumeLevel,
        sentiment,
        confidence: parseFloat(confidence.toFixed(1)),
        riskAssessment,
        performanceMetrics
      },
      recommendations: [
        avgRugRate < 15 ? 'Low rug rate detected - favorable conditions for new launches' : 'High rug rate detected - exercise caution with new launches',
        totalVolume24h > 2000000 ? 'High volume activity across launchpads - strong market momentum' : 'Monitor for volume increases - market may be consolidating',
        `${launchpadData.length} active launchpads currently tracked with real-time data`,
        sniperAlerts.length > 0 ? `${sniperAlerts.length} active sniper alerts - monitor for potential opportunities` : 'No immediate sniper threats detected - market appears stable',
        riskAssessment.lowRisk > riskAssessment.highRisk ? 'Risk profile favorable - majority of platforms showing low rug rates' : 'Risk profile concerning - high number of platforms with elevated rug rates'
      ],
      dataSources: [
        'Birdeye API - Real-time Solana token analytics',
        'Jupiter API - Launchpad token discovery and pricing',
        'DexScreener API - DEX pair data and volume metrics',
        'GMGN.ai API - Hot token detection and wallet activity',
        'Helius API - On-chain program monitoring'
      ],
      lastUpdated: Date.now()
    };
    
    return NextResponse.json({
      intelligence,
      timestamp: Date.now(),
      source: 'enhanced_solana_launchpad_real_data',
      version: '2.0'
    });
  } catch (error) {
    console.error('Launchpad intelligence API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch launchpad intelligence', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Handle intelligence data submission or analysis request
  console.log('Intelligence request received:', body);
  
  return NextResponse.json({
    success: true,
    message: 'Intelligence request processed',
    timestamp: Date.now()
  });
}