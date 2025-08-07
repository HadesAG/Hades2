/**
 * Session management utilities for HADES authentication
 * Integrated with Privy's recommended session mechanisms
 */

export const SESSION_KEYS = {
  // Minimize localStorage usage - only for supplementary data
  USER_PREFERENCES: 'hades_user_preferences',
  WALLET_CACHE: 'hades_wallet_cache',
  API_CACHE: 'hades_api_cache_',
  // Remove AUTH_TIMESTAMP - rely on Privy's session management
} as const;

export const SESSION_DURATION = {
  SEVEN_DAYS: 7 * 24 * 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  API_CACHE_DEFAULT: 5 * 60 * 1000, // 5 minutes for API cache
} as const;

// Privy session validation interface
interface PrivySessionInfo {
  authenticated: boolean;
  ready: boolean;
  user: any;
  getAccessToken: () => Promise<string | null>;
}

/**
 * Clear all HADES-related data from localStorage and sessionStorage
 */
export function clearAllSessionData(): void {
  if (typeof window === 'undefined') return;

  // Clear specific HADES keys from localStorage
  Object.values(SESSION_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });

  // Clear API cache keys (they have dynamic suffixes)
  const localStorageKeys = Object.keys(localStorage);
  localStorageKeys.forEach(key => {
    if (key.startsWith(SESSION_KEYS.API_CACHE)) {
      localStorage.removeItem(key);
    }
  });

  // Clear all sessionStorage (temporary data)
  sessionStorage.clear();

  console.log('🧹 Cleared all HADES session data');
}

/**
 * Validate session using Privy's authentication state
 * Only use cached data if Privy reports a valid session
 */
export function isSessionValidWithPrivy(privySessionInfo: PrivySessionInfo): boolean {
  if (typeof window === 'undefined') return false;

  // Primary validation: Privy's authentication state
  if (!privySessionInfo.ready) {
    return false; // Wait for Privy to be ready
  }

  return privySessionInfo.authenticated && privySessionInfo.user != null;
}

/**
 * Initialize or restore session data from Privy after hydration
 * This should be called after Privy is ready and authenticated
 */
export function initializeFromPrivySession(privySessionInfo: PrivySessionInfo): void {
  if (typeof window === 'undefined') return;

  if (!isSessionValidWithPrivy(privySessionInfo)) {
    console.log('❌ Invalid Privy session, clearing local cache');
    clearAllSessionData();
    return;
  }

  console.log('✅ Valid Privy session found, initializing session data');
  
  // Store basic user info for offline fallback (minimal data)
  const userData = {
    id: privySessionInfo.user.id,
    email: privySessionInfo.user.email?.address,
    lastSeen: Date.now()
  };
  
  sessionStorage.setItem('hades_session_user', JSON.stringify(userData));
}

/**
 * Get session user data for fallback scenarios
 * Only use when Privy session is confirmed valid
 */
export function getSessionUserData(): {
  id: string;
  email?: string;
  lastSeen: number;
} | null {
  if (typeof window === 'undefined') return null;

  const cached = sessionStorage.getItem('hades_session_user');
  if (!cached) return null;

  try {
    const userData = JSON.parse(cached);
    // Check if data is fresh (within last 10 minutes for fallback)
    if (Date.now() - userData.lastSeen > 10 * 60 * 1000) {
      sessionStorage.removeItem('hades_session_user');
      return null;
    }
    return userData;
  } catch (error) {
    console.error('Failed to parse session user data:', error);
    sessionStorage.removeItem('hades_session_user');
    return null;
  }
}

/**
 * Enhanced wallet info caching that validates against Privy session
 */
export function cacheWalletInfoSecurely(walletInfo: {
  address: string;
  provider: string;
  chainType: string;
}, privySessionInfo: PrivySessionInfo): void {
  if (typeof window === 'undefined') return;
  
  // Only cache if Privy session is valid
  if (!isSessionValidWithPrivy(privySessionInfo)) {
    console.warn('Cannot cache wallet info - invalid Privy session');
    return;
  }

  const walletData = {
    ...walletInfo,
    userId: privySessionInfo.user.id,
    cachedAt: Date.now()
  };
  
  localStorage.setItem(SESSION_KEYS.WALLET_CACHE, JSON.stringify(walletData));
}

/**
 * Cache user preferences
 */
export function cacheUserPreferences(preferences: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(SESSION_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
}

/**
 * Get cached user preferences
 */
export function getCachedUserPreferences(): Record<string, any> | null {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem(SESSION_KEYS.USER_PREFERENCES);
  if (!cached) return null;

  try {
    return JSON.parse(cached);
  } catch (error) {
    console.error('Failed to parse cached user preferences:', error);
    localStorage.removeItem(SESSION_KEYS.USER_PREFERENCES);
    return null;
  }
}

/**
 * Cache wallet information
 */
export function cacheWalletInfo(walletInfo: {
  address: string;
  provider: string;
  chainType: string;
}): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(SESSION_KEYS.WALLET_CACHE, JSON.stringify(walletInfo));
}

/**
 * Get cached wallet information
 */
export function getCachedWalletInfo(): {
  address: string;
  provider: string;
  chainType: string;
} | null {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem(SESSION_KEYS.WALLET_CACHE);
  if (!cached) return null;

  try {
    return JSON.parse(cached);
  } catch (error) {
    console.error('Failed to parse cached wallet info:', error);
    localStorage.removeItem(SESSION_KEYS.WALLET_CACHE);
    return null;
  }
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache(): void {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const localStorageKeys = Object.keys(localStorage);

  localStorageKeys.forEach(key => {
    if (key.startsWith(SESSION_KEYS.API_CACHE)) {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const { timestamp, ttl } = JSON.parse(cached);
          if (now - timestamp > ttl) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // Invalid cache entry, remove it
        localStorage.removeItem(key);
      }
    }
  });
}

/**
 * Enhanced session hydration for page load/refresh scenarios
 * This is the primary function to call after Privy initializes
 */
export function hydrateSessionAfterLoad(privySessionInfo: PrivySessionInfo): {
  isHydrated: boolean;
  user: any;
  walletInfo: any;
} {
  if (typeof window === 'undefined') {
    return { isHydrated: false, user: null, walletInfo: null };
  }

  // Wait for Privy to be ready
  if (!privySessionInfo.ready) {
    console.log('⏳ Waiting for Privy to initialize...');
    return { isHydrated: false, user: null, walletInfo: null };
  }

  // If not authenticated via Privy, clear everything
  if (!privySessionInfo.authenticated || !privySessionInfo.user) {
    console.log('❌ No valid Privy session found');
    clearAllSessionData();
    return { isHydrated: true, user: null, walletInfo: null };
  }

  // Successfully authenticated via Privy
  console.log('✅ Privy session validated, hydrating user data');
  
  // Initialize session data from Privy
  initializeFromPrivySession(privySessionInfo);
  
  // Get cached wallet info (if exists and valid)
  const walletInfo = getCachedWalletInfo();
  
  return {
    isHydrated: true,
    user: privySessionInfo.user,
    walletInfo
  };
}

/**
 * Enhanced API client creation with Privy token integration
 */
export async function createAuthenticatedApiClientWithPrivy(
  privySessionInfo: PrivySessionInfo
): Promise<{
  client: any;
  accessToken: string | null;
} | null> {
  if (!isSessionValidWithPrivy(privySessionInfo)) {
    console.warn('Cannot create authenticated client - invalid Privy session');
    return null;
  }

  try {
    // Get Privy access token for secure API calls
    const accessToken = await privySessionInfo.getAccessToken();
    
    // Create enhanced API client with token
    const client = {
      userId: privySessionInfo.user.id,
      accessToken,
      user: privySessionInfo.user
    };
    
    return { client, accessToken };
  } catch (error) {
    console.error('Failed to create authenticated API client:', error);
    return null;
  }
}

/**
 * Session persistence check for navigation/routing
 * Use this before redirecting or when checking auth status
 */
export function checkSessionForNavigation(privySessionInfo: PrivySessionInfo): {
  canNavigate: boolean;
  shouldRedirectToLogin: boolean;
  isLoading: boolean;
} {
  // Still loading
  if (!privySessionInfo.ready) {
    return {
      canNavigate: false,
      shouldRedirectToLogin: false,
      isLoading: true
    };
  }

  // Not authenticated
  if (!privySessionInfo.authenticated || !privySessionInfo.user) {
    return {
      canNavigate: false,
      shouldRedirectToLogin: true,
      isLoading: false
    };
  }

  // Authenticated and ready
  return {
    canNavigate: true,
    shouldRedirectToLogin: false,
    isLoading: false
  };
}

/**
 * Cleanup session data on logout with proper Privy integration
 */
export function cleanupSessionOnLogout(): void {
  if (typeof window === 'undefined') return;

  console.log('🧹 Starting enhanced session cleanup...');
  
  // Clear all HADES session data
  clearAllSessionData();
  
  // Clear any remaining session artifacts
  sessionStorage.removeItem('hades_session_user');
  
  // Note: Privy handles its own session cleanup internally
  console.log('✅ Session cleanup completed');
}

/**
 * Initialize session management
 */
export function initializeSessionManagement(): void {
  if (typeof window === 'undefined') return;

  // Clear expired cache on initialization
  clearExpiredCache();

  // Set up periodic cache cleanup (every 30 minutes)
  setInterval(clearExpiredCache, 30 * 60 * 1000);

  console.log('🔧 Session management initialized');
}
