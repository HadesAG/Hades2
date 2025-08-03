import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { telegramService } from '@/lib/telegram-service';

export const dynamic = 'force-dynamic';

/**
 * Telegram Webhook endpoint for receiving real-time updates
 * This endpoint should be configured as the webhook URL in your Telegram bot settings
 */
export async function POST(request: Request) {
  console.log('📨 Telegram webhook received');
  
  try {
    const update = await request.json();
    console.log('📊 Telegram update:', JSON.stringify(update, null, 2));

    // Process different types of updates
    if (update.message) {
      await processMessage(update.message);
    } else if (update.channel_post) {
      await processChannelPost(update.channel_post);
    } else if (update.edited_message) {
      await processEditedMessage(update.edited_message);
    } else if (update.edited_channel_post) {
      await processEditedChannelPost(update.edited_channel_post);
    }

    return NextResponse.json({ 
      ok: true, 
      timestamp: Date.now(),
      message: 'Update processed successfully' 
    });

  } catch (error) {
    console.error('❌ Error processing Telegram webhook:', error);
    
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to process update',
      timestamp: Date.now() 
    }, { status: 500 });
  }
}

/**
 * Process regular messages (from bots or private chats)
 */
async function processMessage(message: any) {
  console.log('💬 Processing message:', message.message_id);
  
  try {
    // Store message in database
    await prisma.telegramMessage.create({
      data: {
        chatId: message.chat.id.toString(),
        messageId: message.message_id,
        text: message.text || '',
        date: message.date,
        fromId: message.from?.id?.toString(),
        fromUsername: message.from?.username,
        channelName: message.chat.title || message.chat.username,
        isBot: message.from?.is_bot || false,
        entities: message.entities || [],
        forwardFrom: message.forward_from ? {
          id: message.forward_from.id,
          username: message.forward_from.username,
          firstName: message.forward_from.first_name
        } : undefined,
        processed: false
      }
    }).catch(() => {
      // Ignore duplicate messages
      console.log('⚠️ Duplicate message ignored');
    });

    // Check if this is from our target channels/bots
    const targetChannels = ['-1002093384030', '-1002192465581'];
    const targetBots = ['6872314605'];
    
    const chatId = message.chat.id.toString();
    const fromId = message.from?.id?.toString();
    
    if (targetChannels.includes(chatId) || targetBots.includes(fromId || '')) {
      await processSignalMessage(message);
    }

  } catch (error) {
    console.error('❌ Error processing message:', error);
  }
}

/**
 * Process channel posts
 */
async function processChannelPost(channelPost: any) {
  console.log('📢 Processing channel post:', channelPost.message_id);
  
  try {
    // Store channel post in database
    await prisma.telegramMessage.create({
      data: {
        chatId: channelPost.chat.id.toString(),
        messageId: channelPost.message_id,
        text: channelPost.text || '',
        date: channelPost.date,
        channelName: channelPost.chat.title || channelPost.chat.username,
        isBot: false,
        entities: channelPost.entities || [],
        processed: false
      }
    }).catch(() => {
      console.log('⚠️ Duplicate channel post ignored');
    });

    // Check if this is from our target channels
    const targetChannels = ['-1002093384030', '-1002192465581'];
    const chatId = channelPost.chat.id.toString();
    
    if (targetChannels.includes(chatId)) {
      await processSignalMessage(channelPost);
    }

  } catch (error) {
    console.error('❌ Error processing channel post:', error);
  }
}

/**
 * Process edited messages
 */
async function processEditedMessage(editedMessage: any) {
  console.log('✏️ Processing edited message:', editedMessage.message_id);
  
  try {
    // Update existing message in database
    await prisma.telegramMessage.updateMany({
      where: {
        chatId: editedMessage.chat.id.toString(),
        messageId: editedMessage.message_id
      },
      data: {
        text: editedMessage.text || '',
        entities: editedMessage.entities || [],
        processed: false // Reprocess for signals
      }
    });

    // Reprocess for signals if it's from target sources
    const targetChannels = ['-1002093384030', '-1002192465581'];
    const targetBots = ['6872314605'];
    
    const chatId = editedMessage.chat.id.toString();
    const fromId = editedMessage.from?.id?.toString();
    
    if (targetChannels.includes(chatId) || targetBots.includes(fromId || '')) {
      await processSignalMessage(editedMessage);
    }

  } catch (error) {
    console.error('❌ Error processing edited message:', error);
  }
}

/**
 * Process edited channel posts
 */
async function processEditedChannelPost(editedChannelPost: any) {
  console.log('✏️ Processing edited channel post:', editedChannelPost.message_id);
  
  try {
    // Update existing channel post in database
    await prisma.telegramMessage.updateMany({
      where: {
        chatId: editedChannelPost.chat.id.toString(),
        messageId: editedChannelPost.message_id
      },
      data: {
        text: editedChannelPost.text || '',
        entities: editedChannelPost.entities || [],
        processed: false
      }
    });

    // Reprocess for signals if it's from target channels
    const targetChannels = ['-1002093384030', '-1002192465581'];
    const chatId = editedChannelPost.chat.id.toString();
    
    if (targetChannels.includes(chatId)) {
      await processSignalMessage(editedChannelPost);
    }

  } catch (error) {
    console.error('❌ Error processing edited channel post:', error);
  }
}

/**
 * Process message for trading signals
 */
async function processSignalMessage(message: any) {
  console.log('🔍 Processing message for signals:', message.message_id);
  
  try {
    // Convert message to our format
    const telegramMessage = {
      id: `${message.chat.id}_${message.message_id}`,
      chatId: message.chat.id.toString(),
      messageId: message.message_id,
      text: message.text || '',
      date: message.date,
      fromId: message.from?.id,
      fromUsername: message.from?.username,
      channelName: message.chat.title || message.chat.username,
      isBot: message.from?.is_bot || false,
      entities: message.entities || []
    };

    // Parse for signals
    const signal = telegramService.parseMessageForSignals(telegramMessage);
    
    if (signal) {
      console.log('🎯 Signal detected:', signal.extractedData.token || 'Unknown token');
      
      // Store signal in database
      await prisma.telegramSignal.create({
        data: {
          source: signal.source,
          sourceId: signal.sourceId,
          sourceName: signal.sourceName,
          messageId: signal.messageId,
          originalMessage: signal.originalMessage,
          extractedData: signal.extractedData,
          timestamp: BigInt(signal.timestamp),
          processed: false,
          confidence: signal.extractedData.confidence,
          token: signal.extractedData.token,
          symbol: signal.extractedData.symbol,
          action: signal.extractedData.action,
          price: signal.extractedData.price,
          target: signal.extractedData.target,
          stopLoss: signal.extractedData.stopLoss,
          riskLevel: signal.extractedData.riskLevel,
        }
      }).catch(() => {
        console.log('⚠️ Duplicate signal ignored');
      });

      // Mark original message as processed
      await prisma.telegramMessage.updateMany({
        where: {
          chatId: message.chat.id.toString(),
          messageId: message.message_id
        },
        data: {
          processed: true
        }
      });

      console.log('✅ Signal stored successfully');
    } else {
      console.log('ℹ️ No trading signal detected in message');
    }

  } catch (error) {
    console.error('❌ Error processing signal message:', error);
  }
}

/**
 * GET endpoint for webhook verification (optional)
 */
export async function GET() {
  return NextResponse.json({
    status: 'Telegram webhook endpoint active',
    timestamp: Date.now(),
    endpoints: {
      webhook: '/api/telegram-webhook',
      signals: '/api/alpha-signals'
    }
  });
}