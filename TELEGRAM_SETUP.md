# Telegram Integration Setup Guide

This guide will help you set up instant Telegram updates for the alpha feed from the specified channels and bot.

## Prerequisites

1. **Telegram Bot Token**: You need to create a Telegram bot and get its token
2. **Deployed Application**: Your app needs to be deployed and accessible via HTTPS
3. **Channel Access**: Your bot needs to be added to the target channels

## Target Sources

The system is configured to monitor:

### Telegram Channels
- Channel ID: `-1002093384030`
- Channel ID: `-1002192465581`

### Telegram Bot
- User ID: `6872314605`

## Step 1: Create a Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Save the bot token (looks like `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`)

## Step 2: Configure Environment Variables

Add these to your `.env` file:

```env
TELEGRAM_BOT_TOKEN="your_bot_token_here"
WEBHOOK_URL="https://your-domain.com/api/telegram-webhook"
```

## Step 3: Set Up Webhook

### Option A: Using the Setup Script

```bash
# Install dependencies first
npm install

# Set up webhook (replace with your actual domain)
node scripts/setup-telegram-webhook.js https://your-domain.com/api/telegram-webhook

# Or set WEBHOOK_URL environment variable and run:
node scripts/setup-telegram-webhook.js

# To check current webhook status:
node scripts/setup-telegram-webhook.js --info

# To delete webhook (for testing):
node scripts/setup-telegram-webhook.js --delete
```

### Option B: Manual Setup

Use curl or any HTTP client:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/api/telegram-webhook",
    "allowed_updates": ["message", "channel_post", "edited_message", "edited_channel_post"]
  }'
```

## Step 4: Add Bot to Channels

For each target channel:

1. **Get Channel Admin Rights**: You need to be an admin of the channels
2. **Add Bot as Admin**: 
   - Go to channel settings
   - Add your bot as an administrator
   - Give it permission to read messages
3. **Verify Bot Access**: Send a test message and check your logs

## Step 5: Test the Integration

1. **Send Test Messages**: Post messages in the target channels with trading signals like:
   ```
   🚀 $SOL breaking resistance at $180! Target: $220, SL: $170. High confidence signal!
   ```

2. **Check Logs**: Monitor your application logs for:
   ```
   📨 Telegram webhook received
   🎯 Signal detected: SOL
   ✅ Signal stored successfully
   ```

3. **Verify Alpha Feed**: Visit your alpha feed page and look for:
   - Telegram signals with cyan badges
   - Channel/Bot indicators
   - Real-time updates

## Signal Detection Patterns

The system automatically detects trading signals using these patterns:

### Token Detection
- `$SOL`, `$BTC`, `$ETH` (with $ prefix)
- `SOL`, `BTC`, `ETH` (standalone tokens)

### Price Information
- `Price: $180`, `@ $180`, `Entry: $180`
- `Target: $220`, `TP: $220`
- `Stop Loss: $170`, `SL: $170`

### Actions
- `buy`, `long`, `sell`, `short`, `hold`, `alert`

### Confidence & Risk
- `85% confidence`, `High confidence`
- `Low risk`, `Medium risk`, `High risk`

## API Endpoints

### Webhook Endpoint
- **URL**: `/api/telegram-webhook`
- **Method**: POST
- **Purpose**: Receives real-time updates from Telegram

### Alpha Signals API
- **URL**: `/api/alpha-signals`
- **Method**: GET
- **Purpose**: Returns combined market + Telegram signals

### Webhook Status
- **URL**: `/api/telegram-webhook`
- **Method**: GET
- **Purpose**: Check webhook status

## Database Schema

The integration adds two new tables:

### TelegramMessage
Stores all incoming messages for processing and history.

### TelegramSignal
Stores extracted trading signals with parsed data.

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Updates**
   - Check if your domain is accessible via HTTPS
   - Verify the webhook URL is correct
   - Check Telegram webhook info: `node scripts/setup-telegram-webhook.js --info`

2. **Bot Can't Read Channel Messages**
   - Ensure bot is added as admin to channels
   - Check bot has "Read Messages" permission
   - Verify channel IDs are correct (negative for channels)

3. **No Signals Detected**
   - Check message format matches detection patterns
   - Review logs for parsing errors
   - Test with simple messages like "$BTC buy signal"

4. **Database Errors**
   - Run migrations: `npx prisma migrate dev`
   - Check database connection
   - Verify Prisma client is generated

### Debugging

Enable detailed logging by checking your application logs for:

```
📨 Telegram webhook received
💬 Processing message: [message_id]
🔍 Processing message for signals: [message_id]
🎯 Signal detected: [token]
✅ Signal stored successfully
```

## Security Considerations

1. **Bot Token Security**: Never expose your bot token in client-side code
2. **Webhook Verification**: Consider adding webhook secret verification
3. **Rate Limiting**: Implement rate limiting for webhook endpoint
4. **Data Validation**: Always validate incoming webhook data

## Performance Optimization

1. **Database Indexing**: The schema includes indexes for common queries
2. **Duplicate Prevention**: Built-in duplicate message/signal detection
3. **Async Processing**: Webhook processing is asynchronous
4. **Error Handling**: Graceful error handling for failed operations

## Support

If you encounter issues:

1. Check the application logs
2. Verify webhook status using the setup script
3. Test with simple trading signal messages
4. Ensure all environment variables are set correctly

The integration will automatically start working once the webhook is properly configured and the bot has access to the target channels.