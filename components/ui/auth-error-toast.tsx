'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, AlertCircle, Wifi, LogIn, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import type { AuthError } from '@/lib/auth-errors';
import { getErrorSeverity } from '@/lib/auth-errors';

interface AuthErrorToastProps {
  error: AuthError | null;
  onDismiss: () => void;
  onAction?: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
}

export function AuthErrorToast({ 
  error, 
  onDismiss, 
  onAction,
  autoClose = true,
  autoCloseDuration = 5000 
}: AuthErrorToastProps) {

  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);


  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
  }, [onDismiss]);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      setIsExiting(false);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, autoCloseDuration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [error, autoClose, autoCloseDuration, handleDismiss]);

  const handleAction = () => {
    if (error?.actionable?.action) {
      error.actionable.action();
    }
    if (onAction) {
      onAction();
    }
    handleDismiss();
  };

  if (!error || !isVisible) {
    return null;
  }

  const severity = getErrorSeverity(error);
  const Icon = getErrorIcon(error.type);
  const colorClasses = getSeverityClasses(severity);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div 
        className={`
          transform transition-all duration-300 ease-in-out
          ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        `}
      >
        <div className={`
          ${colorClasses.background} border ${colorClasses.border} 
          rounded-lg shadow-lg p-4 min-w-[320px]
        `}>
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 p-1 rounded-full ${colorClasses.iconBackground}`}>
              <Icon className={`h-5 w-5 ${colorClasses.icon}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-semibold text-sm ${colorClasses.title}`}>
                  {getErrorTitle(error.type)}
                </h4>
                <button
                  onClick={handleDismiss}
                  className={`${colorClasses.closeButton} hover:opacity-80 transition-opacity`}
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <p className={`text-sm ${colorClasses.message} mb-3 leading-relaxed`}>
                {error.message}
              </p>
              
              {error.details && (
                <details className="mb-3">
                  <summary className={`text-xs cursor-pointer ${colorClasses.details} hover:opacity-80`}>
                    View details
                  </summary>
                  <p className={`text-xs mt-1 ${colorClasses.details} font-mono bg-black/20 p-2 rounded`}>
                    {error.details}
                  </p>
                </details>
              )}
              
              <div className="flex gap-2">
                {error.actionable && (
                  <Button
                    onClick={handleAction}
                    size="sm"
                    className={`${colorClasses.actionButton} text-xs px-3 py-1 h-7`}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    {error.actionable.label}
                  </Button>
                )}
                
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className={`${colorClasses.dismissButton} text-xs px-3 py-1 h-7`}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getErrorIcon(type: AuthError['type']) {
  switch (type) {
    case 'login':
    case 'session_expired':
    // case 'session_invalid': // removed, not a valid AuthError type
      return LogIn;
    case 'network':
      return Wifi;
    case 'wallet_connection':
      return AlertTriangle;
    default:
      return AlertCircle;
  }
}

function getErrorTitle(type: AuthError['type']): string {
  switch (type) {
    case 'login':
      return 'Login Failed';
    case 'logout':
      return 'Logout Error';
    case 'session_restore':
      return 'Session Error';
    case 'session_expired':
      return 'Session Expired';
    // case 'session_invalid': // removed, not a valid AuthError type
      return 'Invalid Session';
    case 'wallet_connection':
      return 'Wallet Connection Error';
    case 'network':
      return 'Network Error';
    default:
      return 'Authentication Error';
  }
}

function getSeverityClasses(severity: 'low' | 'medium' | 'high') {
  switch (severity) {
    case 'high':
      return {
        background: 'bg-red-950/80 backdrop-blur-sm',
        border: 'border-red-500/30',
        iconBackground: 'bg-red-500/20',
        icon: 'text-red-400',
        title: 'text-red-200',
        message: 'text-red-100',
        details: 'text-red-300',
        actionButton: 'bg-red-600 hover:bg-red-700 text-white border-red-500',
        dismissButton: 'text-red-300 hover:text-red-200 hover:bg-red-800/50',
        closeButton: 'text-red-400'
      };
    case 'medium':
      return {
        background: 'bg-yellow-950/80 backdrop-blur-sm',
        border: 'border-yellow-500/30',
        iconBackground: 'bg-yellow-500/20',
        icon: 'text-yellow-400',
        title: 'text-yellow-200',
        message: 'text-yellow-100',
        details: 'text-yellow-300',
        actionButton: 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-500',
        dismissButton: 'text-yellow-300 hover:text-yellow-200 hover:bg-yellow-800/50',
        closeButton: 'text-yellow-400'
      };
    case 'low':
    default:
      return {
        background: 'bg-blue-950/80 backdrop-blur-sm',
        border: 'border-blue-500/30',
        iconBackground: 'bg-blue-500/20',
        icon: 'text-blue-400',
        title: 'text-blue-200',
        message: 'text-blue-100',
        details: 'text-blue-300',
        actionButton: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500',
        dismissButton: 'text-blue-300 hover:text-blue-200 hover:bg-blue-800/50',
        closeButton: 'text-blue-400'
      };
  }
}

// Global toast management hook
export function useAuthErrorToast() {
  const [error, setError] = useState<AuthError | null>(null);

  const showError = (authError: AuthError) => {
    setError(authError);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    showError,
    clearError
  };
}
