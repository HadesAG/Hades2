// API route for whale transactions
import { NextRequest, NextResponse } from 'next/server';
import { getWhalePortfolioService } from '@/lib/whale-portfolio-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const timeframe = (searchParams.get('timeframe') || '24h') as '1h' | '24h' | '7d';
    
    const portfolioService = getWhalePortfolioService();
    const [recentTransactions, topMovers, whaleActivity] = await Promise.all([
      portfolioService.getRecentWhaleTransactions(limit),
      portfolioService.getTopMovers(timeframe),
      portfolioService.getWhaleActivity(timeframe)
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        recentTransactions,
        topMovers,
        whaleActivity
      }
    });
  } catch (error) {
    console.error('❌ Error fetching whale transactions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch whale transactions' 
      },
      { status: 500 }
    );
  }
}