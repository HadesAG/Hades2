'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Wallet, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { AuthLoading } from './auth-loading';
import { ReactNode, useState } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  fallbackTitle?: string;
  fallbackDescription?: string;
  showCompactLoading?: boolean;
}

export function AuthGuard({ 
  children, 
  requireAuth = false,
  fallbackTitle = "Authentication Required",
  fallbackDescription = "Please connect your Solana wallet or sign in with email to access this feature.",
  showCompactLoading = false
}: AuthGuardProps) {
  const { ready, authenticated, login, error, clearError } = useAuth();
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);

  // Show loading state while auth is initializing
  if (!ready) {
    return <AuthLoading />;
  }

  // If authentication is required but user is not authenticated, show login prompt
  if (requireAuth && !authenticated) {
    const isLoginError = error?.type === 'login';
    const isSessionError = error?.type === 'session_expired';
    
    const handleLogin = async () => {
      if (isAttemptingLogin) return;
      
      try {
        setIsAttemptingLogin(true);
        if (error) {
          clearError();
        }
        await login();
      } catch (err) {
        console.error('Login attempt failed:', err);
      } finally {
        // Add slight delay to prevent flashing
        setTimeout(() => setIsAttemptingLogin(false), 500);
      }
    };
    
    const displayTitle = isSessionError ? 'Session Expired' : fallbackTitle;
    const displayDescription = isSessionError 
      ? 'Your session has expired. Please sign in again to continue.'
      : isLoginError 
        ? 'Login failed. Please try again with a different method or check your connection.'
        : fallbackDescription;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
        <div className={`mb-6 p-4 rounded-full ${
          isSessionError ? 'bg-yellow-950/50' : isLoginError ? 'bg-red-950/50' : 'bg-black/50'
        }`}>
          {isLoginError ? (
            <AlertCircle className="h-8 w-8 text-red-500" />
          ) : isSessionError ? (
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          ) : (
            <Lock className="h-8 w-8 text-red-500" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">{displayTitle}</h2>
        <p className={`mb-6 max-w-md ${
          isLoginError ? 'text-red-300' : isSessionError ? 'text-yellow-300' : 'text-gray-400'
        }`}>{displayDescription}</p>
        
        {error && (
          <div className={`mb-4 p-3 rounded-lg border max-w-md text-sm ${
            isLoginError 
              ? 'bg-red-950/30 border-red-500/30 text-red-200'
              : isSessionError
              ? 'bg-yellow-950/30 border-yellow-500/30 text-yellow-200' 
              : 'bg-gray-950/30 border-gray-500/30 text-gray-200'
          }`}>
            {error.message}
          </div>
        )}
        
        <Button 
          onClick={handleLogin} 
          disabled={isAttemptingLogin}
          className={`px-6 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-wait ${
            isAttemptingLogin
              ? 'bg-gray-600 cursor-wait'
              : isLoginError 
              ? 'bg-red-600 hover:bg-red-700'
              : isSessionError
              ? 'bg-yellow-600 hover:bg-yellow-700'
              : 'bg-red-600 hover:bg-red-700'
          } text-white`}
          size="lg"
        >
          {isAttemptingLogin ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : isLoginError ? (
            <>
              <AlertCircle className="mr-2 h-5 w-5" />
              Try Again
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-5 w-5" />
              {isSessionError ? 'Sign In Again' : 'Connect Wallet / Sign In'}
            </>
          )}
        </Button>
      </div>
    );
  }

  // Render children if no auth required or user is authenticated
  return <>{children}</>;
}