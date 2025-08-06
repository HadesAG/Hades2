# Solana-Only Authentication Setup Guide

## Overview
HADES is configured to support **Solana-only** authentication through Privy, allowing users to connect via:
1. **External Solana Wallets**: Phantom, Solflare, Backpack, Glow, Trust, Coinbase Wallet
2. **Email Authentication**: Creates Solana-only embedded wallets for email users

## Configuration

### 1. Privy Setup

1. Visit [Privy Console](https://console.privy.io/)
2. Create a new app or select existing
3. Configure your app settings:

#### Authentication Methods
- ✅ Email
- ✅ Wallet (Solana only)
- ❌ Disable all EVM chains
- ❌ Disable social logins (unless needed)

#### Supported Chains
- Select **Solana Mainnet** only
- Remove all Ethereum/EVM chains

#### Embedded Wallets
- Enable embedded wallets for email users
- Set to "Create for users without wallets"
- Choose Solana as the default chain

### 2. Environment Variables

Create a `.env.local` file with:

```env
# Required: Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id_here"
PRIVY_APP_SECRET="your_privy_app_secret_here"

# Optional: Enhanced wallet support
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_walletconnect_id"

# Optional: Custom Solana RPC (recommended for production)
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
```

### 3. Privy Dashboard Configuration

In your Privy app dashboard:

1. **Login Methods**:
   - Enable Email
   - Enable Wallets
   - Set Solana as default chain

2. **Allowed Domains**:
   - Add `localhost:3000` for development
   - Add your production domain

3. **Wallet Configuration**:
   - Enable these Solana wallets:
     - Phantom
     - Solflare
     - Backpack
     - Glow
     - Trust Wallet
     - Coinbase Wallet

4. **Embedded Wallet Settings**:
   - Recovery: Email-based
   - Network: Solana Mainnet
   - Auto-create: Yes

## Features Implemented

### 1. Privy Provider (`lib/privy-provider.tsx`)
- ✅ Solana-only chain configuration
- ✅ Support for popular Solana wallets
- ✅ Email authentication with embedded wallets
- ✅ Dark theme with HADES branding
- ✅ Custom RPC endpoint support

### 2. Authentication Context (`contexts/auth-context.tsx`)
- ✅ Solana wallet detection
- ✅ Embedded wallet identification
- ✅ Wallet address management
- ✅ Export wallet functionality

### 3. User Interface Components
- ✅ Updated login button with Solana branding
- ✅ Enhanced user menu showing wallet details
- ✅ Email display for email-authenticated users
- ✅ Wallet provider identification
- ✅ Copy address functionality
- ✅ Export wallet option for embedded wallets

## Testing Guide

### Test Email Authentication

1. Click "Connect Wallet / Email"
2. Select "Email" option
3. Enter your email address
4. Verify via OTP code
5. Privy will create a Solana embedded wallet
6. Check that you can:
   - See your Solana address
   - Copy the address
   - Export the wallet (if needed)

### Test External Wallet Connection

1. Install a Solana wallet (e.g., Phantom, Solflare)
2. Click "Connect Wallet / Email"
3. Select your wallet from the list
4. Approve the connection in your wallet
5. Verify you can:
   - See your wallet address
   - See the wallet provider name
   - Copy your address
   - Sign transactions (when implemented)

### Test Logout/Reconnect

1. Connect with either method
2. Click "Logout"
3. Reconnect and verify session persistence
4. Check that wallet/email info is retained

## Troubleshooting

### Common Issues

1. **"Privy App ID not configured"**
   - Ensure `NEXT_PUBLIC_PRIVY_APP_ID` is set in `.env.local`
   - Restart the development server

2. **Wallet not connecting**
   - Check that wallet is installed
   - Ensure wallet is on Solana Mainnet
   - Clear browser cache and retry

3. **Email verification not working**
   - Check spam folder for OTP
   - Ensure email is correctly configured in Privy dashboard
   - Verify domain is whitelisted

4. **Embedded wallet not created**
   - Check Privy dashboard settings
   - Ensure embedded wallets are enabled
   - Verify Solana is selected as chain

### Debug Information

To debug authentication issues, check:
1. Browser console for errors
2. Network tab for Privy API calls
3. Privy dashboard for user sessions
4. Application logs for configuration issues

## Security Considerations

1. **API Keys**: Never commit `.env.local` to version control
2. **RPC Endpoints**: Use private RPC endpoints in production
3. **Wallet Security**: Educate users about wallet safety
4. **Email Security**: Use strong OTP settings in Privy

## Next Steps

After authentication is working:
1. Implement transaction signing
2. Add wallet balance display
3. Create Solana-specific features
4. Add multi-wallet support
5. Implement session management

## Support

For issues:
- Privy Documentation: https://docs.privy.io/
- Solana Wallet Adapter: https://github.com/solana-labs/wallet-adapter
- HADES Support: [Your support channel]
