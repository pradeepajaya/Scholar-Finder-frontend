// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const STUDENT_ID_KEY = 'scholar_finder_student_id';

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

export interface StudentProfileRequest {
  userId?: number;
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  nicPassport?: string;
  district?: string;
  province?: string;
  city?: string;
  mobile?: string;
  preferredLanguage?: string;
  highestEducation?: string;
  currentStatus?: string;
  intendedLevel?: string;
  intendedYear?: string;
  preferredMode?: string;
  preferredLocation?: string;
  olYear?: string;
  olType?: string;
  olMedium?: string;
  olPassed?: number | null;
  olACount?: number | null;
  olBCount?: number | null;
  olCCount?: number | null;
  mathsGrade?: string;
  scienceGrade?: string;
  englishGrade?: string;
  alYear?: string;
  alStream?: string;
  alMedium?: string;
  subject1?: string;
  grade1?: string;
  subject2?: string;
  grade2?: string;
  subject3?: string;
  grade3?: string;
  zScore?: number | null;
  englishTest?: string | null;
  overallScore?: string | null;
  examYear?: string;
  householdIncome?: string | null;
  dependents?: number | null;
  employmentStatus?: string;
  governmentAssistance?: string;
  background?: string;
  disability?: string;
  sports?: string;
  leadership?: string;
  firstGeneration?: string;
  preferredCountries?: string[];
  preferredFields?: string[];
  scholarshipType?: string;
  willingToReturn?: string;
  profileCompletionPercentage?: number;
}

export interface StudentProfileResponse {
  userId: number;
  fullName: string;
  profileCompletionPercentage?: number;
}

export interface MatchRequest {
  studentUserId: number;
  scholarshipIds?: number[];
  educationLevel?: string;
  country?: string;
  fieldOfStudy?: string;
  scholarshipType?: string;
  minimumMatchPercentage?: number;
  limit?: number;
  sortBy?: string;
}

export interface ScholarshipMatchDto {
  id: number;
  title: string;
  description: string;
  provider: string;
  country: string;
  scholarshipType: string;
  amount?: number;
  currency?: string;
  amountDisplay?: string;
  level?: string;
  applicationDeadline?: string;
  deadlineDisplay?: string;
  isFeatured?: boolean;
  applyLink?: string;
  imageUrl?: string;
  matchPercentage: number;
  matchQuality: string;
  matchedCriteria: string[];
  unmatchedCriteria: string[];
  isEligible: boolean;
}

export interface ScholarshipDto {
  id: number;
  institutionId: number;
  providerName?: string;
  title: string;
  description?: string;
  scholarshipType?: string;
  coveragePercentage?: number;
  amount?: number;
  currency?: string;
  eligibleCountries?: string[];
  eligibleFields?: string[];
  eligibleLevels?: string[];
  minGpa?: number;
  minAge?: number;
  maxAge?: number;
  requiredEnglishTest?: string;
  minEnglishScore?: number;
  minAlPasses?: number;
  requiredAlStream?: string;
  minZScore?: number;
  requiresFinancialNeed?: boolean;
  maxHouseholdIncome?: string;
  sportsAchievementRequired?: boolean;
  leadershipRequired?: boolean;
  firstGenerationPriority?: boolean;
  disabilityFriendly?: boolean;
  returnToHomeRequired?: boolean;
  applicationDeadline?: string;
  startDate?: string;
  endDate?: string;
  durationMonths?: number;
  requiredDocuments?: string[];
  additionalRequirements?: string;
  benefits?: string[];
  selectionCriteria?: string[];
  applicationSteps?: string[];
  applicationUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  imageUrl?: string;
  status?: string;
  isFeatured?: boolean;
  totalApplications?: number;
  viewsCount?: number;
}

export interface MatchResponse {
  studentId: number;
  studentName: string;
  totalScholarshipsAnalyzed: number;
  matchesFound: number;
  excellentMatches: number;
  goodMatches: number;
  fairMatches: number;
  scholarships: ScholarshipMatchDto[];
  improvementSuggestions: string[];
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

export const scholarshipApi = {
  upsertStudentProfile: (request: StudentProfileRequest) =>
    apiClient.post<StudentProfileResponse>('/scholarships/students', request),
  getStudentProfile: (userId: number) =>
    apiClient.get<StudentProfileResponse>(`/scholarships/students/${userId}`),
  getScholarships: () =>
    apiClient.get<ScholarshipDto[]>('/scholarships'),
  getScholarship: (id: number) =>
    apiClient.get<ScholarshipDto>(`/scholarships/${id}`),
  getMatches: (request: MatchRequest) =>
    apiClient.post<MatchResponse>('/scholarships/matches', request),
};

export default apiClient;
