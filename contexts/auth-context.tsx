'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import type { ConnectedSolanaWallet } from '@privy-io/react-auth/solana';
import { 
  isSessionValidWithPrivy, 
  hydrateSessionAfterLoad, 
  cacheWalletInfoSecurely, 
  initializeSessionManagement,
  cleanupSessionOnLogout,
  checkSessionForNavigation,
  createAuthenticatedApiClientWithPrivy
} from '@/lib/session-utils';
import { categorizeAuthError, AUTH_ERROR_MESSAGES, type AuthError } from '@/lib/auth-errors';

interface AuthContextType {
  ready: boolean;
  authenticated: boolean;
  user: any;
  login: () => void;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
  // Solana wallet specific
  solanaWallet: ConnectedSolanaWallet | null;
  solanaAddress: string | null;
  isEmbeddedWallet: boolean;
  exportWallet?: () => void;
  // Error handling
  error: AuthError | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  // Only render with Privy hooks after component mounts (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // During SSR or before mount, provide fallback context
  if (!mounted) {
    return (
      <AuthContext.Provider value={{
        ready: false,
        authenticated: false,
        user: null,
        login: () => {},
        logout: async () => {},
        isLoggingOut: false,
        solanaWallet: null,
        solanaAddress: null,
        isEmbeddedWallet: false,
        exportWallet: undefined,
        error: null,
        clearError: () => {}
      }}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  // Client-side rendering with actual Privy hooks
  return <AuthProviderClient>{children}</AuthProviderClient>;
}

function AuthProviderClient({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user, login, logout: privyLogout, exportWallet, getAccessToken } = usePrivy();
  const { wallets: solanaWallets } = useSolanaWallets();
  const [isReady, setIsReady] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  // Error handling functions
  const handleAuthError = (error: unknown, errorType: AuthError['type'] = 'unknown') => {
    const categorizedError = categorizeAuthError(error);
    // Override type if specified
    if (errorType !== 'unknown') {
      categorizedError.type = errorType;
    }
    setAuthError(categorizedError);
    console.error(`🚨 Auth Error [${categorizedError.type}]:`, categorizedError.message, error);
  };

  const clearError = () => {
    setAuthError(null);
  };

  // Enhanced login function with error handling
  const enhancedLogin = () => {
    try {
      clearError(); // Clear any previous errors
      login();
    } catch (error) {
      handleAuthError(error, 'login');
    }
  };

  // Get Solana wallet information
  const solanaWallet = solanaWallets[0] || null;
  const solanaAddress = solanaWallet?.address || null;
  
  // Check if using embedded wallet (created via email login)
  const isEmbeddedWallet = user?.wallet?.walletClientType === 'privy' || 
                           user?.linkedAccounts?.some((account: any) => 
                             account.type === 'wallet' && account.walletClientType === 'privy'
                           ) || false;

  // Initialize session management and hydrate from Privy
  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        if (ready) {
          setIsReady(true);
          
          // Initialize session management system
          initializeSessionManagement();
          
          // Hydrate session from Privy's state
          const sessionInfo = {
            authenticated,
            ready,
            user,
            getAccessToken
          };
          
          const hydrationResult = hydrateSessionAfterLoad(sessionInfo);
          
          if (hydrationResult.isHydrated) {
            if (hydrationResult.user) {
              console.log('✅ Session hydrated successfully');
            } else {
              console.log('🔒 No active session found');
            }
          }
          
          setIsCheckingAuth(false);
        }
        } catch (error) {
        console.warn('Error in auth session check:', error);
        handleAuthError(error, 'session_restore');
        setIsReady(true);
        setIsCheckingAuth(false);
      }
    };
    
    checkAuthSession();
  }, [ready, authenticated, user]);

  // Update session and cache wallet info on authentication change
  useEffect(() => {
    const updateSessionData = async () => {
      try {
        if (authenticated && user) {
          console.log('✅ Login successful:', user);
          
          // Create session info for secure caching
          const sessionInfo = {
            authenticated,
            ready,
            user,
            getAccessToken
          };
          
          // Cache wallet information securely
          if (solanaWallet) {
            cacheWalletInfoSecurely({
              address: solanaWallet.address,
              provider: solanaWallet.walletClientType || 'Unknown',
              chainType: 'solana'
            }, sessionInfo);
          }
          
          // Navigate to dashboard after successful login from home page
          if (typeof window !== 'undefined' && window.location.pathname === '/') {
            window.location.href = '/platform';
          }
        }
      } catch (error) {
        console.warn('Error updating session/wallet cache:', error);
      }
    };
    
    updateSessionData();
  }, [authenticated, user, solanaWallet, ready, getAccessToken]);

  // Enhanced logout function with complete session cleanup and redirect
  const logout = async (): Promise<void> => {
    if (isLoggingOut) {
      console.log('⏳ Logout already in progress');
      return;
    }

    setIsLoggingOut(true);
    console.log('🚪 Starting logout process...');

    try {
      // Step 1: Enhanced session cleanup
      cleanupSessionOnLogout();

      // Step 2: Call Privy's logout
      await privyLogout();
      console.log('✅ Privy logout completed');

      // Step 3: Redirect to home page
      if (typeof window !== 'undefined') {
        console.log('🏠 Redirecting to home page...');
        window.location.href = '/';
      }

    } catch (error) {
      console.error('❌ Error during logout:', error);
      handleAuthError(error, 'logout');
      
      // Even if Privy logout fails, still clear local data and redirect
      try {
        cleanupSessionOnLogout();
        console.log('✅ Fallback: Session cleanup completed despite error');
        
        if (typeof window !== 'undefined') {
          console.log('🏠 Fallback: Redirecting to home page despite error...');
          window.location.href = '/';
        }
      } catch (fallbackError) {
        console.error('❌ Critical error in logout fallback:', fallbackError);
        handleAuthError(fallbackError, 'logout');
        
        // Last resort: reload the page to clear everything
        if (typeof window !== 'undefined') {
          console.log('🔄 Last resort: Reloading page to clear session...');
          window.location.reload();
        }
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        ready: isReady && !isCheckingAuth, 
        authenticated, 
        user, 
        login: enhancedLogin, 
        logout,
        isLoggingOut,
        solanaWallet,
        solanaAddress,
        isEmbeddedWallet,
        exportWallet,
        error: authError,
        clearError
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
        logout: async () => {},
        isLoggingOut: false,
        solanaWallet: null,
        solanaAddress: null,
        isEmbeddedWallet: false,
        exportWallet: undefined,
        error: null,
        clearError: () => {}
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}