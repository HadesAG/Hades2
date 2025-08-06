/**
 * Session management utilities for HADES authentication
 */

export const SESSION_KEYS = {
  AUTH_TIMESTAMP: 'hades_auth_timestamp',
  USER_PREFERENCES: 'hades_user_preferences',
  WALLET_CACHE: 'hades_wallet_cache',
  API_CACHE: 'hades_api_cache_',
} as const;

export const SESSION_DURATION = {
  SEVEN_DAYS: 7 * 24 * 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
} as const;

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
 * Check if the current session is valid based on timestamp
 */
export function isSessionValid(): boolean {
  if (typeof window === 'undefined') return false;

  const authTimestamp = localStorage.getItem(SESSION_KEYS.AUTH_TIMESTAMP);
  if (!authTimestamp) return false;

  const timestamp = parseInt(authTimestamp);
  const now = Date.now();
  
  return (now - timestamp) < SESSION_DURATION.SEVEN_DAYS;
}

/**
 * Update the session timestamp
 */
export function updateSessionTimestamp(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(SESSION_KEYS.AUTH_TIMESTAMP, Date.now().toString());
}

/**
 * Get session age in milliseconds
 */
export function getSessionAge(): number {
  if (typeof window === 'undefined') return 0;

  const authTimestamp = localStorage.getItem(SESSION_KEYS.AUTH_TIMESTAMP);
  if (!authTimestamp) return 0;

  const timestamp = parseInt(authTimestamp);
  return Date.now() - timestamp;
}

/**
 * Get formatted session age string
 */
export function getSessionAgeString(): string {
  const age = getSessionAge();
  const hours = Math.floor(age / SESSION_DURATION.ONE_HOUR);
  const days = Math.floor(age / SESSION_DURATION.ONE_DAY);

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    return 'Less than an hour ago';
  }
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
