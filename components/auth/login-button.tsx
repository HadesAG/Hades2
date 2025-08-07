'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Wallet, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface LoginButtonProps {
  variant?: 'default' | 'compact';
  className?: string;
  disabled?: boolean;
}

export function LoginButton({ 
  variant = 'default',
  className = '',
  disabled = false 
}: LoginButtonProps) {
  const { ready, login, error, clearError } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const isLoginError = error?.type === 'login';
  const isSessionError = error?.type === 'session_expired';
  const hasError = isLoginError || isSessionError;
  const isDisabled = disabled || !ready || isLoggingIn;
  
  const handleLogin = async () => {
    if (isDisabled) return;
    
    try {
      setIsLoggingIn(true);
      if (error) {
        clearError();
      }
      await login();
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      // Add slight delay to prevent flashing
      setTimeout(() => setIsLoggingIn(false), 500);
    }
  };

  const getButtonText = () => {
    if (isLoggingIn) return 'Connecting...';
    if (isSessionError) return 'Sign In Again';
    if (isLoginError) return 'Try Again';
    if (variant === 'compact') return 'Connect';
    return 'Connect Solana Wallet';
  };

  const getButtonIcon = () => {
    if (isLoggingIn) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (hasError) {
      return <AlertCircle className="h-4 w-4" />;
    }
    return <Wallet className="h-4 w-4" />;
  };

  const getButtonStyle = () => {
    if (isSessionError) {
      return 'bg-yellow-600 hover:bg-yellow-700 border-yellow-500';
    }
    if (isLoginError) {
      return 'bg-red-600 hover:bg-red-700 border-red-500';
    }
    if (isLoggingIn) {
      return 'bg-[#ff6b35]/70 cursor-wait';
    }
    return 'bg-[#ff6b35] hover:bg-[#ff5722]';
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isDisabled}
      className={`
        ${getButtonStyle()}
        text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200
        flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${variant === 'compact' ? 'px-4 py-1 text-sm' : ''}
        ${className}
      `}
    >
      {getButtonIcon()}
      {getButtonText()}
    </Button>
  );
}
