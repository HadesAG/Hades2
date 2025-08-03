#!/usr/bin/env node

/**
 * Telegram Webhook Setup Script
 * 
 * This script helps you set up the Telegram webhook for real-time updates.
 * 
 * Usage:
 * 1. Set your TELEGRAM_BOT_TOKEN environment variable
 * 2. Run: node scripts/setup-telegram-webhook.js
 * 
 * The script will:
 * - Set the webhook URL to your deployed application
 * - Verify the webhook is working
 * - Show current webhook status
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

// Configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://your-domain.com/api/telegram-webhook';

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN environment variable is required');
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
 * Get current webhook info
 */
async function getWebhookInfo() {
  try {
    console.log('🔍 Getting current webhook info...');
    const response = await makeRequest(`${TELEGRAM_API_BASE}/getWebhookInfo`);
    
    if (response.ok) {
      console.log('✅ Current webhook info:');
      console.log(`   URL: ${response.result.url || 'Not set'}`);
      console.log(`   Has custom certificate: ${response.result.has_custom_certificate}`);
      console.log(`   Pending updates: ${response.result.pending_update_count}`);
      
      if (response.result.last_error_date) {
        console.log(`   Last error: ${response.result.last_error_message}`);
        console.log(`   Last error date: ${new Date(response.result.last_error_date * 1000).toISOString()}`);
      }
    } else {
      console.error('❌ Failed to get webhook info:', response.description);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error getting webhook info:', error.message);
    return null;
  }
}

/**
 * Set webhook URL
 */
async function setWebhook(webhookUrl) {
  try {
    console.log(`🔧 Setting webhook URL to: ${webhookUrl}`);
    
    const response = await makeRequest(`${TELEGRAM_API_BASE}/setWebhook`, {
      url: webhookUrl,
      allowed_updates: ['message', 'channel_post', 'edited_message', 'edited_channel_post']
    });
    
    if (response.ok) {
      console.log('✅ Webhook set successfully!');
    } else {
      console.error('❌ Failed to set webhook:', response.description);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error setting webhook:', error.message);
    return null;
  }
}

/**
 * Delete webhook (useful for testing with polling)
 */
async function deleteWebhook() {
  try {
    console.log('🗑️  Deleting webhook...');
    
    const response = await makeRequest(`${TELEGRAM_API_BASE}/deleteWebhook`);
    
    if (response.ok) {
      console.log('✅ Webhook deleted successfully!');
    } else {
      console.error('❌ Failed to delete webhook:', response.description);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error deleting webhook:', error.message);
    return null;
  }
}

/**
 * Get bot info
 */
async function getBotInfo() {
  try {
    console.log('🤖 Getting bot info...');
    const response = await makeRequest(`${TELEGRAM_API_BASE}/getMe`);
    
    if (response.ok) {
      console.log('✅ Bot info:');
      console.log(`   Username: @${response.result.username}`);
      console.log(`   Name: ${response.result.first_name}`);
      console.log(`   ID: ${response.result.id}`);
      console.log(`   Can join groups: ${response.result.can_join_groups}`);
      console.log(`   Can read all group messages: ${response.result.can_read_all_group_messages}`);
    } else {
      console.error('❌ Failed to get bot info:', response.description);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error getting bot info:', error.message);
    return null;
  }
}

/**
 * Main setup function
 */
async function main() {
  console.log('🚀 Telegram Webhook Setup');
  console.log('=========================\n');

  // Get bot info first
  await getBotInfo();
  console.log('');

  // Get current webhook status
  await getWebhookInfo();
  console.log('');

  // Check command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--delete')) {
    await deleteWebhook();
    return;
  }

  if (args.includes('--info')) {
    // Just show info, don't set webhook
    return;
  }

  // Set new webhook
  const webhookUrl = args[0] || WEBHOOK_URL;
  
  if (!webhookUrl || webhookUrl.includes('your-domain.com')) {
    console.log('⚠️  Please provide a valid webhook URL:');
    console.log('   node scripts/setup-telegram-webhook.js https://your-domain.com/api/telegram-webhook');
    console.log('');
    console.log('Or set the WEBHOOK_URL environment variable.');
    console.log('');
    console.log('Options:');
    console.log('   --info     Show current webhook info only');
    console.log('   --delete   Delete current webhook');
    return;
  }

  await setWebhook(webhookUrl);
  console.log('');

  // Verify webhook was set
  await getWebhookInfo();
  
  console.log('');
  console.log('🎉 Setup complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Add your bot to the target channels as an admin');
  console.log('2. Make sure your bot can read messages in the channels');
  console.log('3. Test by sending a message in one of the channels');
  console.log('4. Check your application logs for webhook events');
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});