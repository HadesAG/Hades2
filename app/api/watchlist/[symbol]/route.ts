import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { symbol } = params;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    const deleted = await prisma.watchlistToken.deleteMany({
      where: { 
        userId, 
        symbol: symbol.toUpperCase() 
      }
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Token not found in watchlist' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Token removed from watchlist' });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ error: 'Failed to remove token from watchlist' }, { status: 500 });
  }
}