'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import type { ConnectedSolanaWallet } from '@privy-io/react-auth/solana';
import { 
  isSessionValid, 
  updateSessionTimestamp, 
  cacheWalletInfo, 
  initializeSessionManagement 
} from '@/lib/session-utils';

interface AuthContextType {
  ready: boolean;
  authenticated: boolean;
  user: any;
  login: () => void;
  logout: () => void;
  // Solana wallet specific
  solanaWallet: ConnectedSolanaWallet | null;
  solanaAddress: string | null;
  isEmbeddedWallet: boolean;
  exportWallet?: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Handle potential missing Privy context gracefully
  let privyData;
  let solanaWalletsData;
  
  try {
    privyData = usePrivy();
    solanaWalletsData = useSolanaWallets();
  } catch (error) {
    // During SSR or when Privy isn't initialized, provide fallback values
    privyData = {
      ready: false,
      authenticated: false,
      user: null,
      login: () => {},
      logout: () => {},
      exportWallet: undefined
    };
    solanaWalletsData = { wallets: [] };
  }
  
  const { ready, authenticated, user, login, logout, exportWallet } = privyData;
  const { wallets: solanaWallets } = solanaWalletsData;
  const [isReady, setIsReady] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Get Solana wallet information
  const solanaWallet = solanaWallets[0] || null;
  const solanaAddress = solanaWallet?.address || null;
  
  // Check if using embedded wallet (created via email login)
  const isEmbeddedWallet = user?.wallet?.walletClientType === 'privy' || 
                           user?.linkedAccounts?.some((account: any) => 
                             account.type === 'wallet' && account.walletClientType === 'privy'
                           ) || false;

  // Initialize session management and check existing session
  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        if (ready) {
          setIsReady(true);
          
          // Initialize session management system
          initializeSessionManagement();
          
          // Check if session is still valid
          if (isSessionValid()) {
            console.log('Valid session found');
          } else {
            console.log('No valid session found');
          }
          
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.warn('Error in auth session check:', error);
        setIsReady(true);
        setIsCheckingAuth(false);
      }
    };
    
    checkAuthSession();
  }, [ready]);

  // Update session and cache wallet info on authentication change
  useEffect(() => {
    try {
      if (authenticated && user) {
        console.log('✅ Login successful:', user);
        updateSessionTimestamp();
        
        // Cache wallet information
        if (solanaWallet) {
          cacheWalletInfo({
            address: solanaWallet.address,
            provider: solanaWallet.walletClientType || 'Unknown',
            chainType: 'solana'
          });
        }
        
        // Navigate to dashboard after successful login from home page
        if (typeof window !== 'undefined' && window.location.pathname === '/') {
          window.location.href = '/platform';
        }
      }
    } catch (error) {
      console.warn('Error updating session/wallet cache:', error);
    }
  }, [authenticated, user, solanaWallet]);

  return (
    <AuthContext.Provider 
      value={{ 
        ready: isReady && !isCheckingAuth, 
        authenticated, 
        user, 
        login, 
        logout,
        solanaWallet,
        solanaAddress,
        isEmbeddedWallet,
        exportWallet
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During SSR/build time, return a loading state instead of throwing
    if (typeof window === 'undefined') {
      return {
        ready: false,
        authenticated: false,
        user: null,
        login: () => {},
        logout: () => {},
        solanaWallet: null,
        solanaAddress: null,
        isEmbeddedWallet: false,
        exportWallet: undefined
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}