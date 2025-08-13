#!/usr/bin/env node

/**
 * Telegram Sources Test Script
 * 
 * This script tests connectivity and data retrieval from the specified Telegram sources:
 * - Channel ID: -1002093384030
 * - Channel ID: -1002192465581  
 * - Bot User ID: 6872314605
 * 
 * Usage: node scripts/test-telegram-sources.js
 */

const https = require('https');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env files (like Next.js does)
function loadEnvFiles() {
  const envFiles = ['.env.local', '.env'];
  
  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    
    if (fs.existsSync(envPath)) {
      console.log(`📋 Loading environment from ${envFile}`);
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      // Parse .env file content
      envContent.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#') && line.includes('=')) {
          const [key, ...valueParts] = line.split('=');
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
          
          // Only set if not already set (prioritize existing env vars)
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      });
    }
  }
}

// Load environment variables
loadEnvFiles();

// Configuration from environment
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TARGET_CHANNELS = ['-1002093384030', '-1002192465581'];
const TARGET_BOTS = ['6872314605'];

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN environment variable is required');
  console.log('Please add your bot token to the .env file:');
  console.log('TELEGRAM_BOT_TOKEN="your_bot_token_here"');
  process.exit(1);
}

const TELEGRAM_API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Make HTTPS request to Telegram API
 */
function makeRequest(url, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: data ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Test bot authentication
 */
async function testBotAuth() {
  console.log('🤖 Testing bot authentication...');
  
  try {
    const response = await makeRequest(`${TELEGRAM_API_BASE}/getMe`);
    
    if (response.ok) {
      console.log('✅ Bot authentication successful!');
      console.log(`   Bot Username: @${response.result.username}`);
      console.log(`   Bot Name: ${response.result.first_name}`);
      console.log(`   Bot ID: ${response.result.id}`);
      console.log(`   Can join groups: ${response.result.can_join_groups}`);
      console.log(`   Can read all group messages: ${response.result.can_read_all_group_messages}`);
      return true;
    } else {
      console.error('❌ Bot authentication failed:', response.description);
      return false;
    }
  } catch (error) {
    console.error('❌ Bot authentication error:', error.message);
    return false;
  }
}

/**
 * Test getting updates (recent messages)
 */
async function testGetUpdates() {
  console.log('\n📬 Testing getUpdates (recent messages)...');
  
  try {
    const response = await makeRequest(`${TELEGRAM_API_BASE}/getUpdates?limit=10`);
    
    if (response.ok) {
      console.log(`✅ Retrieved ${response.result.length} recent updates`);
      
      if (response.result.length === 0) {
        console.log('ℹ️  No recent updates found. This is normal if:');
        console.log('   - Bot hasn\'t received messages recently');
        console.log('   - Webhook is active (webhook and getUpdates are mutually exclusive)');
        console.log('   - Bot is new and hasn\'t been added to chats yet');
      } else {
        console.log('\n📝 Recent updates:');
        response.result.forEach((update, index) => {
          console.log(`   ${index + 1}. Update ID: ${update.update_id}`);
          
          if (update.message) {
            const msg = update.message;
            console.log(`      Message from: ${msg.chat.type} (ID: ${msg.chat.id})`);
            console.log(`      Text: ${(msg.text || '').substring(0, 50)}${msg.text && msg.text.length > 50 ? '...' : ''}`);
            console.log(`      Date: ${new Date(msg.date * 1000).toISOString()}`);
            
            // Check if it's from our target sources
            if (TARGET_CHANNELS.includes(msg.chat.id.toString()) || 
                TARGET_BOTS.includes(msg.from?.id?.toString())) {
              console.log('      🎯 This is from one of our target sources!');
            }
          }
          
          if (update.channel_post) {
            const post = update.channel_post;
            console.log(`      Channel post from: ${post.chat.title || post.chat.username} (ID: ${post.chat.id})`);
            console.log(`      Text: ${(post.text || '').substring(0, 50)}${post.text && post.text.length > 50 ? '...' : ''}`);
            console.log(`      Date: ${new Date(post.date * 1000).toISOString()}`);
            
            // Check if it's from our target channels
            if (TARGET_CHANNELS.includes(post.chat.id.toString())) {
              console.log('      🎯 This is from one of our target channels!');
            }
          }
        });
      }
      
      return response.result;
    } else {
      console.error('❌ Failed to get updates:', response.description);
      return [];
    }
  } catch (error) {
    console.error('❌ Error getting updates:', error.message);
    return [];
  }
}

/**
 * Test webhook status
 */
async function testWebhookStatus() {
  console.log('\n🔗 Testing webhook status...');
  
  try {
    const response = await makeRequest(`${TELEGRAM_API_BASE}/getWebhookInfo`);
    
    if (response.ok) {
      const info = response.result;
      console.log('✅ Webhook info retrieved:');
      console.log(`   URL: ${info.url || 'Not set'}`);
      console.log(`   Has custom certificate: ${info.has_custom_certificate}`);
      console.log(`   Pending updates: ${info.pending_update_count}`);
      console.log(`   Max connections: ${info.max_connections || 'Default'}`);
      console.log(`   Allowed updates: ${info.allowed_updates?.join(', ') || 'All'}`);
      
      if (info.last_error_date) {
        console.log(`   ⚠️  Last error: ${info.last_error_message}`);
        console.log(`   Last error date: ${new Date(info.last_error_date * 1000).toISOString()}`);
      }
      
      if (info.url && info.pending_update_count > 0) {
        console.log(`   ℹ️  ${info.pending_update_count} updates are pending delivery`);
      }
      
      return info;
    } else {
      console.error('❌ Failed to get webhook info:', response.description);
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting webhook info:', error.message);
    return null;
  }
}

/**
 * Test channel access by trying to get chat info
 */
async function testChannelAccess() {
  console.log('\n🏢 Testing access to target channels...');
  
  for (const channelId of TARGET_CHANNELS) {
    console.log(`\n   Testing channel: ${channelId}`);
    
    try {
      const response = await makeRequest(`${TELEGRAM_API_BASE}/getChat?chat_id=${channelId}`);
      
      if (response.ok) {
        const chat = response.result;
        console.log(`   ✅ Channel access successful!`);
        console.log(`      Title: ${chat.title || 'N/A'}`);
        console.log(`      Type: ${chat.type}`);
        console.log(`      Username: ${chat.username ? '@' + chat.username : 'N/A'}`);
        console.log(`      Description: ${chat.description ? chat.description.substring(0, 100) + '...' : 'N/A'}`);
        
        // Try to get chat member count
        try {
          const memberResponse = await makeRequest(`${TELEGRAM_API_BASE}/getChatMemberCount?chat_id=${channelId}`);
          if (memberResponse.ok) {
            console.log(`      Members: ${memberResponse.result}`);
          }
        } catch (e) {
          console.log(`      Members: Unable to retrieve`);
        }
        
      } else {
        console.log(`   ❌ Cannot access channel: ${response.description}`);
        
        if (response.description.includes('chat not found')) {
          console.log(`      Possible reasons:`);
          console.log(`      - Channel ID is incorrect`);
          console.log(`      - Channel is private and bot is not a member`);
          console.log(`      - Channel doesn't exist`);
        } else if (response.description.includes('not enough rights')) {
          console.log(`      Possible reasons:`);
          console.log(`      - Bot is not an admin in the channel`);
          console.log(`      - Bot doesn't have required permissions`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Error accessing channel: ${error.message}`);
    }
  }
}

/**
 * Test our Telegram service integration
 */
async function testTelegramService() {
  console.log('\n🔧 Testing our Telegram service integration...');
  
  try {
    // Import our service (this will only work if we're in the right directory)
    const path = require('path');
    const servicePath = path.join(process.cwd(), 'lib', 'telegram-service.ts');
    
    console.log('   Checking if service file exists...');
    const fs = require('fs');
    
    if (fs.existsSync(servicePath)) {
      console.log('   ✅ Telegram service file found');
      
      // Try to load and test the service
      try {
        // This is a basic test - in a real scenario we'd need to compile TypeScript
        const serviceContent = fs.readFileSync(servicePath, 'utf8');
        
        if (serviceContent.includes('TARGET_CHANNELS') || serviceContent.includes('-1002093384030')) {
          console.log('   ✅ Service contains target channel configuration');
        } else {
          console.log('   ⚠️  Service may not have target channels configured');
        }
        
        if (serviceContent.includes('parseMessageForSignals')) {
          console.log('   ✅ Service has signal parsing functionality');
        } else {
          console.log('   ⚠️  Service may not have signal parsing');
        }
        
      } catch (error) {
        console.log(`   ⚠️  Could not analyze service: ${error.message}`);
      }
    } else {
      console.log('   ❌ Telegram service file not found');
      console.log('      Expected location: lib/telegram-service.ts');
    }
    
    // Test our API endpoint
    console.log('\n   Testing alpha-signals API endpoint...');
    const testApiUrl = 'http://localhost:3000/api/alpha-signals';
    
    try {
      // This would only work if the server is running
      console.log(`   ℹ️  To test API endpoint, run: curl ${testApiUrl}`);
      console.log('   (Make sure your development server is running)');
    } catch (error) {
      console.log(`   ℹ️  API endpoint test skipped (server not running)`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error testing service integration: ${error.message}`);
  }
}

/**
 * Provide recommendations based on test results
 */
async function provideRecommendations(updates, webhookInfo) {
  console.log('\n💡 Recommendations:');
  
  // Check if we have recent data
  const hasRecentUpdates = updates && updates.length > 0;
  const hasWebhook = webhookInfo && webhookInfo.url;
  
  if (!hasRecentUpdates && !hasWebhook) {
    console.log('\n🔴 No data retrieval detected. Possible solutions:');
    console.log('   1. Add your bot to the target channels as an admin');
    console.log('   2. Set up webhook for real-time updates:');
    console.log('      node scripts/setup-telegram-webhook.js https://your-domain.com/api/telegram-webhook');
    console.log('   3. Ensure bot has "Read Messages" permission in channels');
    console.log('   4. Send test messages in the channels to generate data');
  } else if (hasWebhook && !hasRecentUpdates) {
    console.log('\n🟡 Webhook is configured but no recent updates:');
    console.log('   1. This is normal if channels are quiet');
    console.log('   2. Send test messages to verify webhook is working');
    console.log('   3. Check webhook endpoint logs for incoming requests');
  } else if (!hasWebhook && hasRecentUpdates) {
    console.log('\n🟡 Getting updates via polling, consider webhook for real-time:');
    console.log('   1. Set up webhook for instant updates');
    console.log('   2. Webhook is more efficient than polling');
  } else {
    console.log('\n🟢 Configuration looks good!');
    console.log('   1. Monitor webhook endpoint for incoming updates');
    console.log('   2. Check alpha feed for Telegram signals');
    console.log('   3. Test with trading signal messages in channels');
  }
  
  console.log('\n📋 Next steps:');
  console.log('   1. Ensure bot is admin in target channels');
  console.log('   2. Set up webhook for real-time updates');
  console.log('   3. Test with sample trading messages');
  console.log('   4. Monitor application logs for signal detection');
  console.log('   5. Check alpha feed UI for Telegram signals');
}

/**
 * Main test function
 */
async function main() {
  console.log('🚀 Telegram Sources Test');
  console.log('========================');
  console.log('Target Sources:');
  console.log(`   Channels: ${TARGET_CHANNELS.join(', ')}`);
  console.log(`   Bots: ${TARGET_BOTS.join(', ')}`);
  console.log('');

  // Test bot authentication
  const authSuccess = await testBotAuth();
  if (!authSuccess) {
    console.log('\n❌ Bot authentication failed. Please check your TELEGRAM_BOT_TOKEN.');
    process.exit(1);
  }

  // Test getting updates
  const updates = await testGetUpdates();

  // Test webhook status
  const webhookInfo = await testWebhookStatus();

  // Test channel access
  await testChannelAccess();

  // Test service integration
  await testTelegramService();

  // Provide recommendations
  await provideRecommendations(updates, webhookInfo);

  console.log('\n✅ Test completed!');
  console.log('\nFor real-time testing:');
  console.log('1. Send a message like "🚀 $SOL buy signal at $180" in one of the target channels');
  console.log('2. Check your webhook endpoint logs');
  console.log('3. Visit your alpha feed to see if the signal appears');
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection:', reason);
  process.exit(1);
});

// Run the test
main().catch((error) => {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
});