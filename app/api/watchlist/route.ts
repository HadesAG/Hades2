import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    const watchlistTokens = await prisma.watchlistToken.findMany({
      where: { userId },
      orderBy: { addedAt: 'desc' }
    });

    return NextResponse.json({ tokens: watchlistTokens });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { symbol } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    // Check if token already exists in watchlist
    const existing = await prisma.watchlistToken.findFirst({
      where: { userId, symbol: symbol.toUpperCase() }
    });

    if (existing) {
      return NextResponse.json({ error: 'Token already in watchlist' }, { status: 409 });
    }

    const watchlistToken = await prisma.watchlistToken.create({
      data: {
        symbol: symbol.toUpperCase(),
        userId
      }
    });

    return NextResponse.json({ token: watchlistToken }, { status: 201 });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json({ error: 'Failed to add token to watchlist' }, { status: 500 });
  }
}