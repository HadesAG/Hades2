'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Copy, ExternalLink, Wallet, Mail, AlertCircle, User, Shield } from 'lucide-react';
import { useState, useMemo } from 'react';

interface UserInfo {
  displayName: string;
  email?: string;
  hasIncompleteProfile: boolean;
}

interface WalletInfo {
  address: string | null;
  provider: string;
  isEmbedded: boolean;
  hasValidWallet: boolean;
}

export function UserMenu() {
  const { user, exportWallet, ready } = usePrivy();
  const { logout, isLoggingOut, solanaWallet, solanaAddress, isEmbeddedWallet } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);

  // Parse user information with comprehensive null checks and fallbacks
  const userInfo: UserInfo = useMemo(() => {
    if (!user || !ready) {
      return {
        displayName: 'Loading...',
        hasIncompleteProfile: true
      };
    }

    // Extract email from user object with fallbacks
    const emailAccount = user?.linkedAccounts?.find((account: any) => account.type === 'email');
    const email = user?.email?.address || 
                  (emailAccount && 'address' in emailAccount ? (emailAccount as any).address : null) ||
                  null;

    // Create display name based on available information
    let displayName = 'Anonymous User';
    if (email) {
      displayName = email.split('@')[0]; // Use email prefix as display name
    } else if (user?.id) {
      displayName = `User ${user.id.slice(-6)}`; // Use last 6 chars of user ID
    }

    const hasIncompleteProfile = !email && !user?.wallet?.address && !solanaAddress;

    return {
      displayName,
      email: email || undefined,
      hasIncompleteProfile
    };
  }, [user, ready, solanaAddress]);

  // Parse wallet information with comprehensive checks
  const walletInfo: WalletInfo = useMemo(() => {
    // Priority: solanaAddress > user.wallet.address > null
    const address = solanaAddress || user?.wallet?.address || null;
    
    // Determine provider with comprehensive checks
    let provider = 'Unknown';
    
    if (solanaWallet?.walletClientType) {
      // Use Solana wallet client type if available
      provider = solanaWallet.walletClientType;
    } else if (user?.wallet?.walletClientType) {
      // Fallback to user wallet client type
      provider = user.wallet.walletClientType;
    } else if (isEmbeddedWallet) {
      provider = 'Embedded Wallet';
    } else if (user?.linkedAccounts && user.linkedAccounts.length > 0) {
      // Check linked accounts for wallet information
      const walletAccount = user.linkedAccounts.find((account: any) => 
        account.type === 'wallet' && 'walletClientType' in account
      ) as any;
      if (walletAccount && walletAccount.walletClientType) {
        provider = walletAccount.walletClientType;
      }
    }

    // Normalize provider names for better display
    if (provider === 'privy') {
      provider = 'Embedded Wallet';
    } else if (provider && provider !== 'Unknown') {
      // Capitalize first letter
      provider = provider.charAt(0).toUpperCase() + provider.slice(1);
    }

    return {
      address,
      provider,
      isEmbedded: isEmbeddedWallet,
      hasValidWallet: !!address
    };
  }, [user, solanaWallet, solanaAddress, isEmbeddedWallet]);

  // Enhanced copy address function with error handling
  const copyAddress = async () => {
    if (!walletInfo.address) return;
    
    try {
      await navigator.clipboard.writeText(walletInfo.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
      // Fallback: try to select text for manual copy
      setShowFullAddress(true);
      setTimeout(() => setShowFullAddress(false), 3000);
    }
  };

  // Handle export wallet with error handling
  const handleExportWallet = async () => {
    if (!exportWallet) return;
    
    try {
      await exportWallet();
    } catch (error) {
      console.error('Failed to export wallet:', error);
      // Could add toast notification here if available
    }
  };

  // Show loading state
  if (!ready) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          <span className="text-sm">Loading user info...</span>
        </div>
      </div>
    );
  }

  // Show error state if user data couldn't be loaded
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Failed to load user info</span>
        </div>
        <Button
          variant="ghost"
          className="text-white hover:bg-[#2a3441] hover:text-white"
          onClick={logout}
          size="sm"
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm space-y-1">
        {/* User display name with profile completion indicator */}
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-slate-400" />
          <span className="text-white font-medium">{userInfo.displayName}</span>
          {userInfo.hasIncompleteProfile && (
            <AlertCircle className="h-3 w-3 text-yellow-500" />
          )}
        </div>

        {/* Show email if available */}
        {userInfo.email && (
          <div className="flex items-center gap-1 text-slate-300">
            <Mail className="h-3 w-3" />
            <span className="text-xs">{userInfo.email}</span>
            <Badge variant="outline" className="text-xs px-1 py-0 h-4 text-green-400 border-green-400">
              Email
            </Badge>
          </div>
        )}
        
        {/* Show wallet information */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {walletInfo.isEmbedded ? (
              <Shield className="h-4 w-4 text-blue-400" />
            ) : (
              <Wallet className="h-4 w-4 text-[#FF6B35]" />
            )}
          </div>
          
          {walletInfo.hasValidWallet ? (
            <>
              <p className="font-semibold text-white font-mono text-xs">
                {showFullAddress ? 
                  walletInfo.address : 
                  `${walletInfo.address?.slice(0, 6)}...${walletInfo.address?.slice(-4)}`
                }
              </p>
              <Badge 
                variant={walletInfo.isEmbedded ? "secondary" : "outline"} 
                className="text-xs px-1 py-0 h-4"
              >
                {walletInfo.provider}
              </Badge>
            </>
          ) : (
            <>
              <span className="text-slate-400 text-xs">No wallet connected</span>
              <AlertCircle className="h-3 w-3 text-yellow-500" />
            </>
          )}
        </div>
        
        {/* Action buttons */}
        {walletInfo.hasValidWallet && (
          <div className="flex gap-2 pt-1">
            <button 
              onClick={copyAddress} 
              title="Copy wallet address" 
              className="text-slate-400 hover:text-white transition flex items-center gap-1 text-xs"
            >
              <Copy className="h-3 w-3" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            
            {walletInfo.isEmbedded && exportWallet !== undefined && (
              <button 
                onClick={handleExportWallet} 
                title="Export embedded wallet" 
                className="text-slate-400 hover:text-white transition flex items-center gap-1 text-xs"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Export</span>
              </button>
            )}
            
            <button 
              onClick={() => setShowFullAddress(!showFullAddress)} 
              title="Toggle full address display" 
              className="text-slate-400 hover:text-white transition text-xs"
            >
              {showFullAddress ? 'Hide' : 'Show'} Full
            </button>
          </div>
        )}

        {/* Helpful tips for incomplete profiles */}
        {userInfo.hasIncompleteProfile && (
          <div className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Profile incomplete - consider connecting email or wallet</span>
          </div>
        )}
      </div>
      
      <Button
        variant="ghost"
        className="text-white hover:bg-[#2a3441] hover:text-white"
        onClick={logout}
        size="sm"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Logging out...
          </>
        ) : (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </>
        )}
      </Button>
    </div>
  );
}
