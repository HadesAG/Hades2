#!/usr/bin/env node

/**
 * Helper script to add Telegram bot token to .env file
 * Usage: node scripts/add-telegram-token.js <your_bot_token>
 */

const fs = require('fs');
const path = require('path');

const botToken = process.argv[2];

if (!botToken) {
  console.log('🤖 Telegram Bot Token Setup');
  console.log('============================');
  console.log('');
  console.log('To get a Telegram bot token:');
  console.log('1. Message @BotFather on Telegram');
  console.log('2. Send /newbot command');
  console.log('3. Follow instructions to create your bot');
  console.log('4. Copy the bot token');
  console.log('');
  console.log('Usage: node scripts/add-telegram-token.js <your_bot_token>');
  console.log('Example: node scripts/add-telegram-token.js 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ');
  process.exit(1);
}

// Validate token format (basic check)
if (!botToken.match(/^\d+:[A-Za-z0-9_-]+$/)) {
  console.error('❌ Invalid bot token format');
  console.log('Bot tokens should look like: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ');
  process.exit(1);
}

const envLocalPath = path.join(process.cwd(), '.env.local');

try {
  let content = '';
  
  // Read existing content if file exists
  if (fs.existsSync(envLocalPath)) {
    content = fs.readFileSync(envLocalPath, 'utf8');
    
    // Check if token already exists
    if (content.includes('TELEGRAM_BOT_TOKEN')) {
      console.log('⚠️  TELEGRAM_BOT_TOKEN already exists in .env.local');
      console.log('Updating existing token...');
      
      // Replace existing token
      content = content.replace(/TELEGRAM_BOT_TOKEN=.*/g, `TELEGRAM_BOT_TOKEN="${botToken}"`);
    } else {
      // Add token to existing content
      content += `\n# Telegram Bot Configuration\nTELEGRAM_BOT_TOKEN="${botToken}"\n`;
    }
  } else {
    // Create new file with token
    content = `# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN="${botToken}"

# Add other environment variables below
`;
  }
  
  // Write to .env.local
  fs.writeFileSync(envLocalPath, content);
  
  console.log('✅ Successfully added TELEGRAM_BOT_TOKEN to .env.local');
  console.log(`   Token: ${botToken.substring(0, 10)}...`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Test connection: npm run test:telegram');
  console.log('2. Set up webhook: npm run setup:telegram');
  console.log('3. Add bot to your target Telegram channels');
  
} catch (error) {
  console.error('❌ Error writing to .env.local:', error.message);
  process.exit(1);
}