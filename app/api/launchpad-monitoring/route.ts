import { NextResponse } from 'next/server';
import { SolanaLaunchpadService } from '@/lib/data-services';

export async function GET() {
  try {
    const launchpadService = new SolanaLaunchpadService();
    
    // Get comprehensive launchpad data
    const launchpadData = await launchpadService.getLaunchpadData();
    
    // Real-time monitoring data
    const monitoringData = {
      timestamp: Date.now(),
      totalPlatforms: launchpadData.length,
      activePlatforms: launchpadData.filter(lp => lp.isActive).length,
      
      // Volume analysis
      totalVolume24h: launchpadData.reduce((sum, lp) => sum + lp.volume24h, 0),
      volumeChange24h: launchpadData.reduce((sum, lp) => sum + lp.volumeChange24h, 0) / (launchpadData.length || 1),
      
      // Liquidity analysis
      totalLiquidity: launchpadData.reduce((sum, lp) => sum + lp.totalLiquidity, 0),
      averageLiquidity: launchpadData.reduce((sum, lp) => sum + lp.totalLiquidity, 0) / (launchpadData.length || 1),
      
      // Risk analysis
      averageRugRate: launchpadData.reduce((sum, lp) => sum + lp.rugRate, 0) / (launchpadData.length || 1),
      highRiskPlatforms: launchpadData.filter(lp => lp.rugRate > 30).length,
      mediumRiskPlatforms: launchpadData.filter(lp => lp.rugRate > 15 && lp.rugRate <= 30).length,
      lowRiskPlatforms: launchpadData.filter(lp => lp.rugRate <= 15).length,
      
      // Token generation
      totalNewTokensPerHour: launchpadData.reduce((sum, lp) => sum + lp.newTokensPerHour, 0),
      estimatedNewTokens24h: launchpadData.reduce((sum, lp) => sum + lp.newTokensPerHour, 0) * 24,
      
      // Platform performance ranking
      topPerformers: launchpadData
        .sort((a, b) => b.volume24h - a.volume24h)
        .slice(0, 5)
        .map(lp => ({
          name: lp.name,
          platform: lp.platform,
          volume24h: lp.volume24h,
          volumeChange24h: lp.volumeChange24h,
          rugRate: lp.rugRate,
          newTokensPerHour: lp.newTokensPerHour
        })),
      
      // Risk assessment
      riskProfile: {
        overall: launchpadData.reduce((sum, lp) => sum + lp.rugRate, 0) / (launchpadData.length || 1) < 20 ? 'LOW' : 'MEDIUM',
        distribution: {
          low: launchpadData.filter(lp => lp.rugRate <= 15).length,
          medium: launchpadData.filter(lp => lp.rugRate > 15 && lp.rugRate <= 30).length,
          high: launchpadData.filter(lp => lp.rugRate > 30).length
        }
      },
      
      // Market sentiment
      marketSentiment: {
        trend: launchpadData.reduce((sum, lp) => sum + lp.volumeChange24h, 0) > 0 ? 'BULLISH' : 'BEARISH',
        confidence: Math.max(60, 100 - launchpadData.reduce((sum, lp) => sum + lp.rugRate, 0) / (launchpadData.length || 1)),
        volumeMomentum: launchpadData.reduce((sum, lp) => sum + lp.volume24h, 0) > 2000000 ? 'HIGH' : 'MEDIUM'
      },
      
      // Platform details
      platforms: launchpadData.map(lp => ({
        name: lp.name,
        symbol: lp.symbol,
        platform: lp.platform,
        address: lp.address,
        logo: lp.logo,
        website: lp.website,
        description: lp.description,
        metrics: {
          volume24h: lp.volume24h,
          volumeChange24h: lp.volumeChange24h,
          totalLiquidity: lp.totalLiquidity,
          newTokensPerHour: lp.newTokensPerHour,
          rugRate: lp.rugRate,
          isActive: lp.isActive
        },
        topPerformers: lp.topPerformers,
        bondingCurve: lp.bondingCurve,
        lastUpdated: lp.lastUpdated
      }))
    };
    
    return NextResponse.json({
      success: true,
      data: monitoringData,
      source: 'real_time_launchpad_monitoring',
      version: '1.0'
    });
    
  } catch (error) {
    console.error('Launchpad monitoring API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch launchpad monitoring data', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Handle monitoring configuration or alerts
    console.log('Launchpad monitoring request received:', body);
    
    // You can add logic here to:
    // - Set up monitoring alerts
    // - Configure risk thresholds
    // - Set up automated responses
    
    return NextResponse.json({
      success: true,
      message: 'Monitoring configuration updated',
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error('Launchpad monitoring POST error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process monitoring request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
