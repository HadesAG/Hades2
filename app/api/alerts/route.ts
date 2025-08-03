import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AlertType, Operator, AlertStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    const alerts = await prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { symbol, type, operator, targetValue } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    if (!symbol || !type || !operator || targetValue === undefined) {
      return NextResponse.json({ 
        error: 'Symbol, type, operator, and targetValue are required' 
      }, { status: 400 });
    }

    // Validate enum values
    if (!Object.values(AlertType).includes(type)) {
      return NextResponse.json({ error: 'Invalid alert type' }, { status: 400 });
    }

    if (!Object.values(Operator).includes(operator)) {
      return NextResponse.json({ error: 'Invalid operator' }, { status: 400 });
    }

    const alert = await prisma.alert.create({
      data: {
        symbol: symbol.toUpperCase(),
        type,
        operator,
        targetValue: parseFloat(targetValue),
        userId
      }
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
  }
}