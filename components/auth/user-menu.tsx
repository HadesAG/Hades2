'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, Copy, ExternalLink, Wallet, Mail } from 'lucide-react';
import { useState } from 'react';

export function UserMenu() {
  const { user, logout, exportWallet } = usePrivy();
  const { solanaWallet, solanaAddress, isEmbeddedWallet } = useAuth();
  const [copied, setCopied] = useState(false);

  // Use wallet address from auth context
  const walletAddress = solanaAddress || user?.wallet?.address;
  
  // Get email if user logged in with email
  const userEmail = user?.email?.address;
  
  // Determine wallet provider name
  const walletProvider = solanaWallet?.walletClientType || 
                         (isEmbeddedWallet ? 'Embedded Wallet' : 'Unknown');

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        {/* Show email if available */}
        {userEmail && (
          <div className="flex items-center gap-1 text-slate-300 mb-1">
            <Mail className="h-3 w-3" />
            <span className="text-xs">{userEmail}</span>
          </div>
        )}
        
        {/* Show wallet address */}
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-[#FF6B35]" />
          <p className="font-semibold text-white">
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'No wallet'}
          </p>
          <span className="text-xs text-slate-400">({walletProvider})</span>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2 mt-1">
          {walletAddress && (
            <button 
              onClick={copyAddress} 
              title="Copy address" 
              className="text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <Copy className="h-3 w-3" />
              <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}
          {isEmbeddedWallet && exportWallet && (
            <button 
              onClick={exportWallet} 
              title="Export wallet" 
              className="text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="text-xs">Export</span>
            </button>
          )}
        </div>
      </div>
      
      <Button
        variant="ghost"
        className="text-white hover:bg-[#2a3441] hover:text-white"
        onClick={logout}
        size="sm"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}