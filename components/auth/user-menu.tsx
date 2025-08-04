'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { LogOut, Copy, ExternalLink } from 'lucide-react';

export function UserMenu() {
  const { user, logout, exportWallet } = usePrivy();

  const walletAddress = user?.wallet?.address;
  const isEmbedded = user?.wallet?.walletClientType === 'privy';

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <p className="font-semibold text-white">{walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'No wallet connected'}</p>
        <div className="flex gap-2">
          <button onClick={copyAddress} title="Copy address" className="text-slate-400 hover:text-white transition">
            <Copy className="h-4 w-4" />
          </button>
          {isEmbedded && (
            <button onClick={exportWallet} title="Export wallet" className="text-slate-400 hover:text-white transition">
              <ExternalLink className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        className="text-white hover:bg-[#2a3441] hover:text-white"
        onClick={logout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}