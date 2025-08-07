import { NextResponse } from 'next/server';
import { SolanaLaunchpadService } from '@/lib/data-services';

export async function GET() {
  try {
    const launchpadService = new SolanaLaunchpadService();
    
    const [launchpadData, sniperAlerts] = await Promise.all([
      launchpadService.getLaunchpadData(),
      launchpadService.getSniperAlerts()
    ]);
    
    // Calculate aggregated stats
    const totalLiquidity = launchpadData.reduce((sum, lp) => sum + lp.totalLiquidity, 0);
    const totalVolume24h = launchpadData.reduce((sum, lp) => sum + lp.volume24h, 0);
    const avgRugRate = launchpadData.reduce((sum, lp) => sum + lp.rugRate, 0) / (launchpadData.length || 1);
    const totalNewTokensPerHour = launchpadData.reduce((sum, lp) => sum + lp.newTokensPerHour, 0);
    
    // Get top performing launchpad
    const topPerformer = launchpadData.reduce((prev, current) => 
      (current.volume24h > prev.volume24h) ? current : prev,
      launchpadData[0] || { name: 'N/A', volumeChange24h: 0 }
    );
    
    const intelligence = {
      launchpads: launchpadData,
      sniperAlerts: sniperAlerts.slice(0, 8), // Limit alerts
      aggregatedStats: {
        totalLiquidity,
        volume24h: totalVolume24h,
        launchpadsTracked: launchpadData.length,
        avgRugRate,
        newTokensPerHour: totalNewTokensPerHour,
        topPerformer: {
          name: topPerformer.name,
          change24h: topPerformer.volumeChange24h
        }
      },
      marketAnalysis: {
        trend: totalVolume24h > 1000000 ? 'bullish' : 'neutral',
        volume: totalVolume24h > 5000000 ? 'high' : totalVolume24h > 1000000 ? 'medium' : 'low',
        sentiment: avgRugRate < 10 ? 'positive' : avgRugRate < 20 ? 'neutral' : 'negative',
        confidence: Math.min(95, Math.max(60, 85 - avgRugRate))
      },
      recommendations: [
        avgRugRate < 15 ? 'Low rug rate detected - favorable conditions' : 'High rug rate - exercise caution',
        totalVolume24h > 2000000 ? 'High volume activity across launchpads' : 'Monitor for volume increases',
        `${launchpadData.length} active launchpads currently tracked`,
        sniperAlerts.length > 0 ? `${sniperAlerts.length} active sniper alerts` : 'No immediate sniper threats detected'
      ]
    };
    
    return NextResponse.json({
      intelligence,
      timestamp: Date.now(),
      source: 'solana_launchpad_real_data'
    });
  } catch (error) {
    console.error('Launchpad intelligence API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch launchpad intelligence' },
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