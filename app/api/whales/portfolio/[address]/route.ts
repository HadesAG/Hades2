// API route for individual whale portfolio
import { NextRequest, NextResponse } from 'next/server';
import { getWhalePortfolioService } from '@/lib/whale-portfolio-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    
    if (!address) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Wallet address is required' 
        },
        { status: 400 }
      );
    }
    
    const portfolioService = getWhalePortfolioService();
    const portfolio = await portfolioService.getWhalePortfolio(address);
    
    if (!portfolio) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Whale wallet not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error('❌ Error fetching whale portfolio:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch whale portfolio' 
      },
      { status: 500 }
    );
  }
}