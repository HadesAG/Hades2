'use client';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { AuthErrorToast } from '@/components/ui/auth-error-toast';

/**
 * Enhanced AuthProvider wrapper that includes error toast display
 * This component integrates the auth error state with the toast UI
 */
function AuthErrorHandler({ children }: { children: React.ReactNode }) {
  const { error, clearError } = useAuth();

  return (
    <>
      {children}
      <AuthErrorToast 
        error={error}
        onDismiss={clearError}
        autoClose={true}
        autoCloseDuration={8000} // Show error longer for auth issues
      />
    </>
  );
}

/**
 * Complete auth provider with error handling and UI
 * Use this instead of the basic AuthProvider when you want integrated error display
 */
export function AuthProviderWithErrorHandling({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthErrorHandler>
        {children}
      </AuthErrorHandler>
    </AuthProvider>
  );
}

/**
 * Hook to manually trigger auth errors for testing or special cases
 * This is primarily for development and testing purposes
 */
export function useAuthErrorTesting() {
  const { error, clearError } = useAuth();
  
  const triggerTestError = (type: 'login' | 'logout' | 'session_restore' = 'login') => {
    // Create a test error for demonstration purposes
    const testError = new Error(`Test ${type} error`);
    console.warn('Triggering test auth error:', testError);
  };

  return {
    currentError: error,
    clearError,
    triggerTestError
  };
}
