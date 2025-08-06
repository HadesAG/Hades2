'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { updateSessionTimestamp, clearAllSessionData } from './session-utils';

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
  const router = useRouter();
  
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

  // Handle successful login
  const handleLoginSuccess = useCallback((user: any) => {
    console.log('✅ Login successful:', user);
    
    // Update session timestamp
    updateSessionTimestamp();
    
    // Navigate to dashboard after successful login from home page
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      router.push('/platform');
    }
  }, [router]);

  // Handle logout with comprehensive cleanup
  const handleLogout = useCallback(() => {
    console.log('👋 User logged out');
    
    // Clear all session data and cache
    clearAllSessionData();
    
    // Navigate to home page
    router.push('/');
  }, [router]);

  return (
    <PrivyProvider
      appId={appId}
      config={{
        // Login methods: Email and Solana wallets only
        loginMethods: ['email', 'wallet'],
        
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
          logo: '/logo.png',
          showWalletLoginFirst: false,
          loginMessage: 'Connect to HADES',
          walletChainType: 'solana-only',
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