// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'STUDENT' | 'INSTITUTION' | 'ADMIN';
  fullName?: string;
  institutionName?: string;
}

export interface UserDto {
  id: number;
  email: string;
  role: 'STUDENT' | 'INSTITUTION' | 'ADMIN';
  isVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserDto;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Token management
const TOKEN_KEY = 'scholar_finder_token';
const REFRESH_TOKEN_KEY = 'scholar_finder_refresh_token';
const USER_KEY = 'scholar_finder_user';

export const tokenService = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  
  setRefreshToken: (token: string): void => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  
  getUser: (): UserDto | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  
  setUser: (user: UserDto): void => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  
  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  isAuthenticated: (): boolean => !!localStorage.getItem(TOKEN_KEY),
};

// API client with authentication
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = tokenService.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle token refresh if 401
    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry the request with new token
        const newToken = tokenService.getToken();
        (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers,
        });
        return retryResponse.json();
      } else {
        // Refresh failed, clear tokens and redirect to login
        tokenService.clearTokens();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data: ApiResponse<AuthResponse> = await response.json();
      if (data.success && data.data) {
        tokenService.setToken(data.data.accessToken);
        tokenService.setRefreshToken(data.data.refreshToken);
        tokenService.setUser(data.data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Auth endpoints
  async login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (response.success && response.data) {
      tokenService.setToken(response.data.accessToken);
      tokenService.setRefreshToken(response.data.refreshToken);
      tokenService.setUser(response.data.user);
    }

    return response;
  }

  async register(request: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (response.success && response.data) {
      tokenService.setToken(response.data.accessToken);
      tokenService.setRefreshToken(response.data.refreshToken);
      tokenService.setUser(response.data.user);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      tokenService.clearTokens();
    }
  }

  async getCurrentUser(): Promise<ApiResponse<UserDto>> {
    return this.request<UserDto>('/auth/me');
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/auth/verify-email?token=${token}`);
  }

  // Generic request methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export auth-specific functions for convenience
export const authApi = {
  login: (request: LoginRequest) => apiClient.login(request),
  register: (request: RegisterRequest) => apiClient.register(request),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  verifyEmail: (token: string) => apiClient.verifyEmail(token),
};

export default apiClient;
