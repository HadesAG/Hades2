// API client utilities for authenticated requests with Privy integration

export class ApiClient {
  private baseUrl: string;
  private userId: string | null = null;
  private accessToken: string | null = null;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.userId) {
      headers['x-user-id'] = this.userId;
    }

    // Use Privy access token for authentication when available
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// Create authenticated API client from Privy user
export function createAuthenticatedApiClient(user: any): ApiClient {
  const client = new ApiClient();
  
  // Use Privy user ID as the API user identifier
  if (user?.id) {
    client.setUserId(user.id);
  }
  
  return client;
}

// Enhanced API client factory with Privy access token
export async function createAuthenticatedApiClientWithToken(
  user: any, 
  getAccessToken: () => Promise<string | null>
): Promise<ApiClient> {
  const client = new ApiClient();
  
  // Set user ID
  if (user?.id) {
    client.setUserId(user.id);
  }
  
  // Get and set access token
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      client.setAccessToken(accessToken);
    }
  } catch (error) {
    console.warn('Failed to get Privy access token:', error);
  }
  
  return client;
}

// Enhanced API methods that accept optional access token
export const enhancedWatchlistApi = {
  async getWatchlist(userId: string, accessToken?: string) {
    const client = new ApiClient();
    client.setUserId(userId);
    if (accessToken) client.setAccessToken(accessToken);
    return client.get<{ tokens: any[] }>('/api/watchlist');
  },

  async addToken(userId: string, symbol: string, accessToken?: string) {
    const client = new ApiClient();
    client.setUserId(userId);
    if (accessToken) client.setAccessToken(accessToken);
    return client.post<{ token: any }>('/api/watchlist', { symbol });
  },

  async removeToken(userId: string, symbol: string, accessToken?: string) {
    const client = new ApiClient();
    client.setUserId(userId);
    if (accessToken) client.setAccessToken(accessToken);
    return client.delete<{ message: string }>(`/api/watchlist/${symbol}`);
  },
};

// Watchlist API methods
export const watchlistApi = {
  async getWatchlist(userId: string) {
    const client = new ApiClient();
    client.setUserId(userId);
    return client.get<{ tokens: any[] }>('/api/watchlist');
  },

  async addToken(userId: string, symbol: string) {
    const client = new ApiClient();
    client.setUserId(userId);
    return client.post<{ token: any }>('/api/watchlist', { symbol });
  },

  async removeToken(userId: string, symbol: string) {
    const client = new ApiClient();
    client.setUserId(userId);
    return client.delete<{ message: string }>(`/api/watchlist/${symbol}`);
  },
};

// Alerts API methods
export const alertsApi = {
  async getAlerts(userId: string) {
    const client = new ApiClient();
    client.setUserId(userId);
    return client.get<{ alerts: any[] }>('/api/alerts');
  },

  async createAlert(userId: string, alertData: {
    symbol: string;
    type: string;
    operator: string;
    targetValue: number;
  }) {
    const client = new ApiClient();
    client.setUserId(userId);
    return client.post<{ alert: any }>('/api/alerts', alertData);
  },

  async updateAlert(userId: string, alertId: string, updates: {
    status?: string;
    triggeredAt?: string;
  }) {
    const client = new ApiClient();
    client.setUserId(userId);
    return client.patch<{ alert: any }>(`/api/alerts/${alertId}`, updates);
  },

  async deleteAlert(userId: string, alertId: string) {
    const client = new ApiClient();
    client.setUserId(userId);
    return client.delete<{ message: string }>(`/api/alerts/${alertId}`);
  },
};

// Settings API methods
export const settingsApi = {
  async getSettings(userId: string) {
    const client = new ApiClient();
    client.setUserId(userId);
    return client.get<{ settings: any }>('/api/settings');
  },

  async saveSettings(userId: string, settings: any) {
    const client = new ApiClient();
    client.setUserId(userId);
    return client.post<{ message: string; settings: any }>('/api/settings', settings);
  },

  async updateSettings(userId: string, partialSettings: any) {
    const client = new ApiClient();
    client.setUserId(userId);
    return client.patch<{ message: string; settings: any }>('/api/settings', partialSettings);
  },
};