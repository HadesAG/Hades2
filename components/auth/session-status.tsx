'use client';

import { useAuth } from '@/contexts/auth-context';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { 
  hydrateSessionAfterLoad, 
  checkSessionForNavigation, 
  getSessionUserData,
  getCachedWalletInfo 
} from '@/lib/session-utils';

interface SessionStatus {
  privyReady: boolean;
  privyAuthenticated: boolean;
  sessionHydrated: boolean;
  walletCached: boolean;
  canNavigate: boolean;
  isLoading: boolean;
}

export function SessionStatus() {
  const { ready, authenticated, user } = useAuth();
  const { getAccessToken } = usePrivy();
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    privyReady: false,
    privyAuthenticated: false,
    sessionHydrated: false,
    walletCached: false,
    canNavigate: false,
    isLoading: true
  });

  useEffect(() => {
    const updateSessionStatus = async () => {
      try {
        const sessionInfo = {
          authenticated,
          ready,
          user,
          getAccessToken
        };

        // Check session hydration
        const hydrationResult = hydrateSessionAfterLoad(sessionInfo);
        
        // Check navigation status
        const navigationStatus = checkSessionForNavigation(sessionInfo);
        
        // Check cached data
        const sessionUserData = getSessionUserData();
        const walletInfo = getCachedWalletInfo();

        setSessionStatus({
          privyReady: ready,
          privyAuthenticated: authenticated,
          sessionHydrated: hydrationResult.isHydrated,
          walletCached: walletInfo !== null,
          canNavigate: navigationStatus.canNavigate,
          isLoading: navigationStatus.isLoading
        });
      } catch (error) {
        console.error('Error updating session status:', error);
      }
    };

    updateSessionStatus();
  }, [ready, authenticated, user, getAccessToken]);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Session Status (Dev Mode)</h4>
      <div className="space-y-1">
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${sessionStatus.privyReady ? 'bg-green-500' : 'bg-red-500'}`} />
          Privy Ready: {sessionStatus.privyReady ? 'Yes' : 'No'}
        </div>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${sessionStatus.privyAuthenticated ? 'bg-green-500' : 'bg-red-500'}`} />
          Authenticated: {sessionStatus.privyAuthenticated ? 'Yes' : 'No'}
        </div>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${sessionStatus.sessionHydrated ? 'bg-green-500' : 'bg-red-500'}`} />
          Session Hydrated: {sessionStatus.sessionHydrated ? 'Yes' : 'No'}
        </div>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${sessionStatus.walletCached ? 'bg-green-500' : 'bg-gray-500'}`} />
          Wallet Cached: {sessionStatus.walletCached ? 'Yes' : 'No'}
        </div>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${sessionStatus.canNavigate ? 'bg-green-500' : 'bg-red-500'}`} />
          Can Navigate: {sessionStatus.canNavigate ? 'Yes' : 'No'}
        </div>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${sessionStatus.isLoading ? 'bg-yellow-500' : 'bg-green-500'}`} />
          Loading: {sessionStatus.isLoading ? 'Yes' : 'No'}
        </div>
        {user && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="text-xs text-gray-400">User ID: {user.id?.slice(0, 8)}...</div>
            <div className="text-xs text-gray-400">Email: {user.email?.address || 'N/A'}</div>
          </div>
        )}
      </div>
    </div>
  );
}
