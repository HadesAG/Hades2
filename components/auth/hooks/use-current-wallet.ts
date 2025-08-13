'use client';

import { useAuth } from '@/contexts/auth-context';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { useState, useEffect, useCallback } from 'react';
import { isValidSolanaAddress } from '@/utils/wallet';

interface WalletInfo {
  address: string | null;
  provider: string;
  isEmbedded: boolean;
  isValid: boolean;
}

interface ProfileInfo {
  username: string | null;
  hasProfile: boolean;
  isLoading: boolean;
}

export function useCurrentWallet() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets: solanaWallets } = useSolanaWallets();
  const { solanaWallet, solanaAddress, isEmbeddedWallet } = useAuth();
  
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    username: null,
    hasProfile: false,
    isLoading: false
  });

  // Get wallet information with validation
  const getWalletInfo = useCallback((): WalletInfo => {
    // Priority: solanaAddress from auth context > direct wallet access
    const address = solanaAddress || solanaWallet?.address || null;
    
    let provider = 'Unknown';
    if (solanaWallet?.walletClientType) {
      provider = solanaWallet.walletClientType;
    } else if (isEmbeddedWallet) {
      provider = 'Embedded Wallet';
    }

    // Normalize provider names
    if (provider === 'privy') {
      provider = 'Embedded Wallet';
    } else if (provider && provider !== 'Unknown') {
      provider = provider.charAt(0).toUpperCase() + provider.slice(1);
    }

    return {
      address,
      provider,
      isEmbedded: isEmbeddedWallet,
      isValid: address ? isValidSolanaAddress(address) : false
    };
  }, [solanaAddress, solanaWallet, isEmbeddedWallet]);

  // Check if user has a profile
  const checkProfile = useCallback(async (): Promise<string | null> => {
    if (!ready || !authenticated || !user) {
      return null;
    }

    setProfileInfo(prev => ({ ...prev, isLoading: true }));

    try {
      // This would typically call an API to check if user has a profile
      // For now, we'll simulate this check
      const walletInfo = getWalletInfo();
      
      if (!walletInfo.address || !walletInfo.isValid) {
        setProfileInfo({
          username: null,
          hasProfile: false,
          isLoading: false
        });
        return null;
      }

      // Simulate API call to check profile
      // In a real implementation, this would be:
      // const response = await fetch(`/api/profile/check?wallet=${walletInfo.address}`);
      // const data = await response.json();
      
      // For now, return null to indicate no profile found
      const username = null; // data.username || null;
      
      setProfileInfo({
        username,
        hasProfile: !!username,
        isLoading: false
      });

      return username;
    } catch (error) {
      console.error('Error checking profile:', error);
      setProfileInfo({
        username: null,
        hasProfile: false,
        isLoading: false
      });
      return null;
    }
  }, [ready, authenticated, user, getWalletInfo]);

  // Auto-check profile when auth state changes
  useEffect(() => {
    if (ready && authenticated && user) {
      checkProfile();
    } else {
      setProfileInfo({
        username: null,
        hasProfile: false,
        isLoading: false
      });
    }
  }, [ready, authenticated, user, checkProfile]);

  const walletInfo = getWalletInfo();

  return {
    // Wallet information
    walletAddress: walletInfo.address,
    walletProvider: walletInfo.provider,
    isEmbeddedWallet: walletInfo.isEmbedded,
    isValidWallet: walletInfo.isValid,
    
    // Profile information
    mainUsername: profileInfo.username,
    hasProfile: profileInfo.hasProfile,
    isProfileLoading: profileInfo.isLoading,
    
    // Functions
    checkProfile,
    
    // Raw wallet objects for advanced usage
    solanaWallet,
    solanaWallets,
    
    // Auth state
    ready,
    authenticated,
    user
  };
}
