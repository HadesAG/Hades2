'use client';

export interface AuthError {
  type: 'login' | 'logout' | 'session_restore' | 'wallet_connection' | 'session_expired' | 'network' | 'unknown';
  message: string;
  code?: string;
  details?: string;
  timestamp: number;
  actionable?: {
    label: string;
    action: () => void;
  };
}

export interface AuthErrorState {
  error: AuthError | null;
  hasError: boolean;
  isRecovering: boolean;
}

// Error message templates
export const AUTH_ERROR_MESSAGES = {
  // Login errors
  LOGIN_FAILED: 'Failed to connect wallet or sign in. Please try again.',
  LOGIN_CANCELLED: 'Login was cancelled. Please try again to continue.',
  LOGIN_NETWORK_ERROR: 'Network error during login. Check your connection and try again.',
  LOGIN_WALLET_REJECTED: 'Wallet connection was rejected. Please approve the connection to continue.',
  LOGIN_UNSUPPORTED_WALLET: 'This wallet is not supported. Please use a different wallet.',
  
  // Logout errors
  LOGOUT_FAILED: 'Failed to log out completely. Some session data may remain.',
  LOGOUT_PARTIAL: 'Logout completed but some cleanup failed. You have been signed out.',
  
  // Session errors
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  SESSION_RESTORE_FAILED: 'Failed to restore your session. Please log in again.',
  SESSION_INVALID: 'Your session is invalid. Please log in again.',
  SESSION_HYDRATION_ERROR: 'Failed to load session data. Some features may not work correctly.',
  
  // Wallet errors
  WALLET_CONNECTION_LOST: 'Wallet connection lost. Please reconnect your wallet.',
  WALLET_NETWORK_MISMATCH: 'Wallet is connected to wrong network. Please switch to Solana.',
  WALLET_PERMISSION_DENIED: 'Wallet permission denied. Please grant access to continue.',
  
  // Network errors
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  SERVICE_UNAVAILABLE: 'Authentication service is temporarily unavailable. Please try again later.',
  
  // Generic errors
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  RATE_LIMITED: 'Too many requests. Please wait a moment before trying again.',
} as const;

// Error type mapping
export function categorizeAuthError(error: unknown): AuthError {
  const timestamp = Date.now();
  
  // Handle Privy-specific errors
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = (error as Error).message.toLowerCase();
    
    // Login-related errors
    if (errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
      return {
        type: 'login',
        message: AUTH_ERROR_MESSAGES.LOGIN_WALLET_REJECTED,
        code: 'USER_REJECTED',
        timestamp,
        actionable: {
          label: 'Try Again',
          action: () => window.location.reload()
        }
      };
    }
    
    if (errorMessage.includes('cancelled') || errorMessage.includes('canceled')) {
      return {
        type: 'login',
        message: AUTH_ERROR_MESSAGES.LOGIN_CANCELLED,
        code: 'LOGIN_CANCELLED',
        timestamp
      };
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return {
        type: 'network',
        message: AUTH_ERROR_MESSAGES.LOGIN_NETWORK_ERROR,
        code: 'NETWORK_ERROR',
        timestamp,
        actionable: {
          label: 'Retry',
          action: () => window.location.reload()
        }
      };
    }
    
    if (errorMessage.includes('unsupported') || errorMessage.includes('not supported')) {
      return {
        type: 'wallet_connection',
        message: AUTH_ERROR_MESSAGES.LOGIN_UNSUPPORTED_WALLET,
        code: 'UNSUPPORTED_WALLET',
        timestamp
      };
    }
    
    // Session-related errors
    if (errorMessage.includes('session') || errorMessage.includes('expired')) {
      return {
        type: 'session_expired',
        message: AUTH_ERROR_MESSAGES.SESSION_EXPIRED,
        code: 'SESSION_EXPIRED',
        timestamp,
        actionable: {
          label: 'Log In Again',
          action: () => window.location.href = '/'
        }
      };
    }
    
    if (errorMessage.includes('unauthorized') || errorMessage.includes('forbidden')) {
      return {
        type: 'session_restore',
        message: AUTH_ERROR_MESSAGES.SESSION_INVALID,
        code: 'SESSION_INVALID',
        timestamp,
        actionable: {
          label: 'Log In Again',
          action: () => window.location.href = '/'
        }
      };
    }
    
    // Rate limiting
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
      return {
        type: 'network',
        message: AUTH_ERROR_MESSAGES.RATE_LIMITED,
        code: 'RATE_LIMITED',
        timestamp
      };
    }
  }
  
  // Default unknown error
  return {
    type: 'unknown',
    message: AUTH_ERROR_MESSAGES.UNKNOWN_ERROR,
    code: 'UNKNOWN',
    details: error instanceof Error ? error.message : String(error),
    timestamp,
    actionable: {
      label: 'Try Again',
      action: () => window.location.reload()
    }
  };
}

// Helper to check if error is recoverable
export function isRecoverableError(error: AuthError): boolean {
  return ['network', 'login', 'logout'].includes(error.type);
}

// Helper to get user-friendly error message
export function getErrorMessage(error: AuthError): string {
  return error.message;
}

// Helper to get error severity
export function getErrorSeverity(error: AuthError): 'low' | 'medium' | 'high' {
  switch (error.type) {
    case 'session_expired':
      return 'high';
    case 'login':
    case 'wallet_connection':
      return 'medium';
    case 'logout':
    case 'session_restore':
    case 'network':
      return 'low';
    default:
      return 'medium';
  }
}

// Error recovery strategies
export const ERROR_RECOVERY_STRATEGIES = {
  retry: (action: () => void, delay: number = 1000) => {
    setTimeout(action, delay);
  },
  
  redirectToLogin: () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },
  
  refreshPage: () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  },
  
  clearStorage: () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
  }
};
