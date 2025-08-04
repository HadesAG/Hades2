'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import dynamic from 'next/dynamic';

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
  // Skip rendering during build/SSR
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

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
        // Only allow connections to Solana
        loginMethods: ['wallet', 'email'],
        defaultChain: solana,
        supportedChains: [solana],
        
        // Customize the modal
        appearance: {
          theme: 'dark',
          accentColor: '#FF6B35',
          logo: 'https://your-logo-url.com/logo.png', // Optional: Add your logo URL
          showWalletLoginFirst: true, // Prioritize wallet login
        },
        
        // Configure embedded wallets for email users
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          // Restrict to Solana

        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

// Export as dynamic component to prevent SSR
export const PrivyClientProvider = dynamic(() => Promise.resolve(PrivyProviderComponent), {
  ssr: false,
});