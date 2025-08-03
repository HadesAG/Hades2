// API client utilities for authenticated requests

export class ApiClient {
  private baseUrl: string;
  private userId: string | null = null;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.userId) {
      headers['x-user-id'] = this.userId;
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