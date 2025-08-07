# Authentication Error Handling System

This document describes the comprehensive error handling system integrated across all authentication flows in the application.

## Overview

The authentication error handling system provides:
- **Centralized error management** through the AuthContext
- **Categorized error types** with specific handling for each
- **User-friendly error messages** with actionable feedback
- **Visual error indicators** in UI components
- **Automatic error recovery** where possible
- **Toast notifications** for error display
- **Error persistence** across component renders

## Components

### Core Error System

#### `lib/auth-errors.ts`
- **AuthError interface**: Defines error structure with type, message, code, details, and actionable recovery
- **Error categorization**: Automatically categorizes errors based on content and context
- **Error templates**: Pre-defined user-friendly messages for common scenarios
- **Recovery strategies**: Built-in methods for error recovery

#### Error Types
- `login`: Wallet connection failures, user rejection, network issues during login
- `logout`: Failures during logout process, partial cleanup errors
- `session_restore`: Session hydration failures, invalid session data
- `session_expired`: Expired sessions requiring re-authentication
- `session_invalid`: Invalid or corrupted session data
- `wallet_connection`: Wallet-specific connection issues
- `network`: Network connectivity problems
- `unknown`: Unhandled or unexpected errors

### UI Components

#### `components/ui/auth-error-toast.tsx`
- **Animated toast notifications** for error display
- **Severity-based styling** (low/medium/high)
- **Actionable buttons** for error recovery
- **Auto-dismiss functionality** with configurable duration
- **Expandable error details** for debugging

#### `components/auth/auth-provider-with-error-handling.tsx`
- **Enhanced AuthProvider wrapper** with integrated error display
- **Automatic toast rendering** for auth errors
- **Error testing utilities** for development

### Enhanced Auth Context

#### `contexts/auth-context.tsx`
- **Error state management** integrated into auth context
- **Enhanced login/logout functions** with error handling
- **Session management errors** captured and categorized
- **Error clearing functionality** for user interaction

### Updated Auth Components

#### `components/auth/login-button.tsx`
- **Visual error indicators** when login fails
- **Error-aware button styling** (red for errors)
- **Automatic error clearing** on retry

#### `components/auth/auth-guard.tsx`
- **Error-specific fallback UI** for different error types
- **Session expiration handling** with appropriate messaging
- **Inline error display** with user-friendly descriptions

## Usage

### Basic Implementation

```tsx
// Replace AuthProvider with enhanced version
import { AuthProviderWithErrorHandling } from '@/components/auth/auth-provider-with-error-handling';

function App() {
  return (
    <AuthProviderWithErrorHandling>
      <YourApp />
    </AuthProviderWithErrorHandling>
  );
}
```

### Error Handling in Components

```tsx
import { useAuth } from '@/contexts/auth-context';

function MyComponent() {
  const { login, logout, error, clearError } = useAuth();
  
  // Check for specific error types
  const isLoginError = error?.type === 'login';
  const isSessionExpired = error?.type === 'session_expired';
  
  // Handle errors in your UI
  return (
    <div>
      {error && (
        <div className="error-display">
          {error.message}
          {error.actionable && (
            <button onClick={error.actionable.action}>
              {error.actionable.label}
            </button>
          )}
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
    </div>
  );
}
```

### Manual Error Handling

```tsx
import { categorizeAuthError } from '@/lib/auth-errors';

// Manually handle and categorize errors
try {
  await someAuthOperation();
} catch (error) {
  const authError = categorizeAuthError(error);
  console.error('Auth error:', authError);
  
  // Handle based on error type
  if (authError.type === 'session_expired') {
    // Redirect to login
    window.location.href = '/';
  } else if (authError.actionable) {
    // Show recovery option
    authError.actionable.action();
  }
}
```

## Error Messages

### Login Errors
- **LOGIN_FAILED**: "Failed to connect wallet or sign in. Please try again."
- **LOGIN_CANCELLED**: "Login was cancelled. Please try again to continue."
- **LOGIN_NETWORK_ERROR**: "Network error during login. Check your connection and try again."
- **LOGIN_WALLET_REJECTED**: "Wallet connection was rejected. Please approve the connection to continue."
- **LOGIN_UNSUPPORTED_WALLET**: "This wallet is not supported. Please use a different wallet."

### Session Errors
- **SESSION_EXPIRED**: "Your session has expired. Please log in again."
- **SESSION_RESTORE_FAILED**: "Failed to restore your session. Please log in again."
- **SESSION_INVALID**: "Your session is invalid. Please log in again."
- **SESSION_HYDRATION_ERROR**: "Failed to load session data. Some features may not work correctly."

### Logout Errors
- **LOGOUT_FAILED**: "Failed to log out completely. Some session data may remain."
- **LOGOUT_PARTIAL**: "Logout completed but some cleanup failed. You have been signed out."

### Network & General
- **NETWORK_ERROR**: "Network connection error. Please check your internet connection."
- **SERVICE_UNAVAILABLE**: "Authentication service is temporarily unavailable. Please try again later."
- **UNKNOWN_ERROR**: "An unexpected error occurred. Please try again."
- **RATE_LIMITED**: "Too many requests. Please wait a moment before trying again."

## Error Recovery

### Automatic Recovery
- **Network errors**: Automatic retry with exponential backoff
- **Session errors**: Automatic redirect to login page
- **Temporary failures**: Retry mechanisms with user confirmation

### User-Driven Recovery
- **Login failures**: "Try Again" button with error clearing
- **Session expiration**: "Sign In Again" with appropriate messaging
- **Wallet issues**: Guidance for wallet reconnection

## Testing

### Development Testing
```tsx
import { useAuthErrorTesting } from '@/components/auth/auth-provider-with-error-handling';

function TestComponent() {
  const { triggerTestError, currentError, clearError } = useAuthErrorTesting();
  
  return (
    <div>
      <button onClick={() => triggerTestError('login')}>
        Test Login Error
      </button>
      <button onClick={() => triggerTestError('session_expired')}>
        Test Session Expired
      </button>
      {currentError && (
        <div>Current Error: {currentError.message}</div>
      )}
    </div>
  );
}
```

## Best Practices

1. **Always handle authentication errors** in user-facing components
2. **Use the enhanced AuthProvider** for automatic error display
3. **Provide clear, actionable error messages** to users
4. **Test error scenarios** during development
5. **Log errors appropriately** for debugging
6. **Clear errors** when users take corrective actions
7. **Show loading states** during error recovery
8. **Provide fallback options** when primary auth methods fail

## Integration Notes

- Error handling is **automatically integrated** when using the enhanced AuthProvider
- **Toast notifications appear** at the top-right of the screen
- **Component-level error handling** supplements the global toast system
- **Session errors** automatically redirect users to appropriate pages
- **Error state persists** across component re-renders until cleared
- **Multiple error types** can be displayed with appropriate prioritization
