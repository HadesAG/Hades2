'use client';

import { PrivyProvider } from '@privy-io/react-auth';

// Solana chain configuration
const solana = {
  id: 101,
  name: 'Solana',
  network: 'solana-mainnet',
  nativeCurrency: {
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
  },
  rpcUrls: {
    default: {
      http: ['https://api.mainnet-beta.solana.com'],
    },
    public: {
      http: ['https://api.mainnet-beta.solana.com'],
    },
  },
};

function PrivyProviderComponent({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  // Don't initialize if no app ID
  if (!appId || appId === 'demo-app-id') {
    console.warn('Privy App ID not configured. Please set NEXT_PUBLIC_PRIVY_APP_ID in your environment.');
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        // Login methods: Email and Solana wallets only
        loginMethods: ['email', 'wallet'],
        // Solana-only wallets (handled by walletChainType and supportedChains)
        // Solana-only configuration
        defaultChain: solana,
        supportedChains: [solana],
        // Embedded wallets for email users - Solana only
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        // Customize the modal appearance
        appearance: {
          theme: 'dark',
          accentColor: '#FF6B35',
          logo: '/hades-logo.png', // Update to your actual logo path or URL
          showWalletLoginFirst: true,
          loginMessage: 'Connect to HADES',
          walletChainType: 'solana-only',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

// Export the component directly - SSR handling is done internally
export const PrivyClientProvider = PrivyProviderComponent;