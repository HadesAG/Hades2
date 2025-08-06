// API route for whale wallet data
import { NextRequest, NextResponse } from 'next/server';
import { getWhalePortfolioService } from '@/lib/whale-portfolio-service';
import { getWhaleTransactionMonitor } from '@/lib/whale-transaction-monitor';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    
    const portfolioService = getWhalePortfolioService();
    const whales = await portfolioService.getWhalesByCategory(category);
    
    return NextResponse.json({
      success: true,
      data: whales
    });
  } catch (error) {
    console.error('❌ Error fetching whales:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch whale data' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, label, category } = body;
    
    if (!address || !label || !category) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: address, label, category' 
        },
        { status: 400 }
      );
    }
    
    const whaleMonitor = getWhaleTransactionMonitor();
    await whaleMonitor.addWhaleWallet(address, label, category);
    
    return NextResponse.json({
      success: true,
      message: 'Whale wallet added successfully'
    });
  } catch (error) {
    console.error('❌ Error adding whale wallet:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add whale wallet' 
      },
      { status: 500 }
    );
  }
}