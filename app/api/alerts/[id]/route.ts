import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AlertStatus } from '@prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id } = params;
    const { status, triggeredAt } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    // Verify alert belongs to user
    const existingAlert = await prisma.alert.findFirst({
      where: { id, userId }
    });

    if (!existingAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // Validate status if provided
    if (status && !Object.values(AlertStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid alert status' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (triggeredAt) updateData.triggeredAt = new Date(triggeredAt);

    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ alert: updatedAlert });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id } = params;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    // Verify alert belongs to user
    const existingAlert = await prisma.alert.findFirst({
      where: { id, userId }
    });

    if (!existingAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    await prisma.alert.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
  }
}