'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Wallet, Lock } from 'lucide-react';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function AuthGuard({ 
  children, 
  requireAuth = false,
  fallbackTitle = "Authentication Required",
  fallbackDescription = "Please connect your Solana wallet or sign in with email to access this feature."
}: AuthGuardProps) {
  const { ready, authenticated, login } = useAuth();

  // Show loading state while auth is initializing
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated, show login prompt
  if (requireAuth && !authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
        <div className="mb-6 p-4 rounded-full bg-black/50">
          <Lock className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">{fallbackTitle}</h2>
        <p className="text-gray-400 mb-6 max-w-md">{fallbackDescription}</p>
        <Button 
          onClick={login} 
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
          size="lg"
        >
          <Wallet className="mr-2 h-5 w-5" />
          Connect Wallet / Sign In
        </Button>
      </div>
    );
  }

  // Render children if no auth required or user is authenticated
  return <>{children}</>;
}