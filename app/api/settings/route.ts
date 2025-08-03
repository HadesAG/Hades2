import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    // Get user settings from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true, email: true, username: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return settings with defaults if none exist
    const defaultSettings = {
      // Profile
      username: user.username || 'hades_trader',
      email: user.email || '',
      timezone: 'UTC-8 (PST)',
      currency: 'USD ($)',
      
      // Display
      theme: 'Dark',
      numberFormat: 'Compact (1.2M)',
      
      // Notifications
      priceAlerts: true,
      volumeAlerts: true,
      signalNotifications: true,
      emailDigest: false,
      
      // Trading
      defaultSlippage: '0.5',
      autoApprove: false,
      
      // API
      heliusApiKey: '',
      telegramBotToken: '',
      
      // Privacy
      shareData: false,
      analytics: true,
    };

    const settings = user.settings ? 
      { ...defaultSettings, ...(user.settings as any) } : 
      defaultSettings;

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const settings = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    // Validate settings structure
    if (typeof settings !== 'object' || settings === null) {
      return NextResponse.json({ error: 'Invalid settings format' }, { status: 400 });
    }

    // Extract profile fields that need to be updated in user table
    const { username, email, ...otherSettings } = settings;

    // Update user record with profile info and settings
    const updatedUser = await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: email || '',
        username: username || null,
        settings: otherSettings
      },
      update: {
        username: username || undefined,
        settings: otherSettings
      }
    });

    return NextResponse.json({ 
      message: 'Settings saved successfully',
      settings: {
        username: updatedUser.username,
        email: updatedUser.email,
        ...otherSettings
      }
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const partialSettings = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    // Get current user settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true, username: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Merge with existing settings
    const currentSettings = (user.settings as any) || {};
    const { username, email, ...otherSettings } = partialSettings;
    const mergedSettings = { ...currentSettings, ...otherSettings };

    // Update user record
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: username !== undefined ? username : undefined,
        settings: mergedSettings
      }
    });

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings: {
        username: updatedUser.username,
        email: updatedUser.email,
        ...mergedSettings
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}