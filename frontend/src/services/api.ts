// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const STUDENT_ID_KEY = 'scholar_finder_student_id';
export const STUDENT_PROFILE_CACHE_KEY = 'scholar_finder_student_profile';

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
  username?: string;
  fullName?: string;
  institutionName?: string;
}

export interface StudentAccountRecoveryRequest {
  email: string;
  password: string;
  confirmPassword: string;
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
  email?: string;
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
  email?: string;
  dateOfBirth?: string;
  age?: number;
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
  olPassed?: number;
  olACount?: number;
  olBCount?: number;
  olCCount?: number;
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
  zScore?: number;
  calculatedGpa?: number;
  englishTest?: string;
  overallScore?: string;
  examYear?: string;
  householdIncome?: string;
  dependents?: number;
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
  profilePictureUrl?: string;
  profileCompletionPercentage?: number;
  applicationCount?: number;
  createdAt?: string;
  updatedAt?: string;
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

export type ScholarshipUpdateRequest = Partial<ScholarshipDto>;

export interface ApplicationDocumentDto {
  requirementName: string;
  source: 'EXISTING_PROFILE_DOCUMENT' | 'NEW_UPLOAD';
  documentId?: string;
  documentName?: string;
  fileName?: string;
}

export interface ApplicationSubmitRequest {
  studentId: number;
  scholarshipId: number;
  fullName: string;
  email?: string;
  phone?: string;
  currentEducation?: string;
  intendedLevel?: string;
  fieldOfStudy?: string;
  alStream?: string;
  alResults?: string;
  zScore?: string;
  gpa?: string;
  englishTest?: string;
  englishScore?: string;
  householdIncome?: string;
  achievements?: string;
  qualificationSummary?: string;
  coverLetter?: string;
  requiredDocuments?: string[];
  documents?: ApplicationDocumentDto[];
}

export interface ApplicationResponse {
  id: number;
  scholarshipId: number;
  studentId: number;
  status: string;
  matchScore?: number;
  updatedExistingApplication: boolean;
  submittedAt: string;
}

export interface StudentApplicationResponse {
  applicationId: number;
  scholarshipId: number;
  scholarshipTitle: string;
  providerName?: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
  matchPercentage?: number;
  requiredDocuments?: string[];
}

export interface StudentDocumentResponse {
  id: string;
  studentId?: number;
  name: string;
  status: 'uploaded' | 'pending';
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  fileDataUrl?: string;
  fileUrl?: string;
  uploadedAt?: string;
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

export type AnnouncementRecipientGroup = 'ALL' | 'STUDENTS' | 'INSTITUTIONS' | 'CUSTOM';

export interface AnnouncementRequest {
  recipientGroup: AnnouncementRecipientGroup;
  subject: string;
  message: string;
  verifiedOnly?: boolean;
  recipientEmails?: string[];
}

export interface AnnouncementFailure {
  recipientEmail: string;
  status: string;
  errorMessage?: string;
}

export interface AnnouncementResponse {
  recipientGroup: AnnouncementRecipientGroup;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  failures: AnnouncementFailure[];
  sentAt: string;
}

export interface AudienceCountsResponse {
  all: number;
  students: number;
  institutions: number;
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
    localStorage.removeItem(STUDENT_ID_KEY);
    localStorage.removeItem(STUDENT_PROFILE_CACHE_KEY);
  },
  
  isAuthenticated: (): boolean => !!localStorage.getItem(TOKEN_KEY),
};

export const studentProfileCache = {
  getProfile: (userId?: number | null): StudentProfileResponse | null => {
    const cached = localStorage.getItem(STUDENT_PROFILE_CACHE_KEY);
    if (!cached) return null;

    try {
      const profile = JSON.parse(cached) as StudentProfileResponse;
      if (userId && profile.userId !== userId) {
        return null;
      }
      return profile;
    } catch {
      localStorage.removeItem(STUDENT_PROFILE_CACHE_KEY);
      return null;
    }
  },

  setProfile: (profile: StudentProfileResponse): void => {
    localStorage.setItem(STUDENT_PROFILE_CACHE_KEY, JSON.stringify(profile));
    if (profile.userId) {
      localStorage.setItem(STUDENT_ID_KEY, String(profile.userId));
    }
  },

  clearProfile: (): void => {
    localStorage.removeItem(STUDENT_PROFILE_CACHE_KEY);
  },
};

// API client with authentication
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const text = await response.text();

    if (!text) {
      return {
        success: response.ok,
        message: response.statusText || "",
        data: undefined as T,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      return JSON.parse(text) as ApiResponse<T>;
    } catch {
      return {
        success: response.ok,
        message: text || response.statusText || "An error occurred",
        data: undefined as T,
        timestamp: new Date().toISOString(),
      };
    }
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
        return this.parseResponse<T>(retryResponse);
      } else {
        // Refresh failed, clear tokens and redirect to login
        tokenService.clearTokens();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }
    }

    const data = await this.parseResponse<T>(response);

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

      const data = await this.parseResponse<AuthResponse>(response);
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

  async recoverStudentAccount(
    request: StudentAccountRecoveryRequest,
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>(
      '/auth/students/recover-account',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
    );

    if (response.success && response.data) {
      tokenService.setToken(response.data.accessToken);
      tokenService.setRefreshToken(response.data.refreshToken);
      tokenService.setUser(response.data.user);
    }

    return response;
  }

  async registerOrRecoverStudent(
    request: RegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>(
      '/auth/students/register-or-recover',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
    );

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
  recoverStudentAccount: (request: StudentAccountRecoveryRequest) =>
    apiClient.recoverStudentAccount(request),
  registerOrRecoverStudent: (request: RegisterRequest) =>
    apiClient.registerOrRecoverStudent(request),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  verifyEmail: (token: string) => apiClient.verifyEmail(token),
};

export const scholarshipApi = {
  upsertStudentProfile: (request: StudentProfileRequest) =>
    apiClient.post<StudentProfileResponse>('/scholarships/students', request),
  getStudentProfile: (userId: number) =>
    apiClient.get<StudentProfileResponse>(`/scholarships/students/${userId}`),
  getAllStudentProfiles: () =>
    apiClient.get<StudentProfileResponse[]>('/scholarships/students/admin/all'),
  getStudentDocuments: (studentId: number) =>
    apiClient.get<StudentDocumentResponse[]>(`/scholarships/students/${studentId}/documents`),
  upsertStudentDocument: (studentId: number, document: StudentDocumentResponse) =>
    apiClient.put<StudentDocumentResponse>(
      `/scholarships/students/${studentId}/documents/${encodeURIComponent(document.id)}`,
      document,
    ),
  deleteStudentDocument: (studentId: number, documentId: string) =>
    apiClient.delete<void>(
      `/scholarships/students/${studentId}/documents/${encodeURIComponent(documentId)}`,
    ),
  getStudentApplications: (studentId: number) =>
    apiClient.get<StudentApplicationResponse[]>(`/scholarships/students/${studentId}/applications`),
  getScholarships: () =>
    apiClient.get<ScholarshipDto[]>('/scholarships'),
  getScholarship: (id: number) =>
    apiClient.get<ScholarshipDto>(`/scholarships/${id}`),
  getAllScholarships: () =>
    apiClient.get<ScholarshipDto[]>('/scholarships/admin/all'),
  updateScholarship: (id: number, request: ScholarshipUpdateRequest) =>
    apiClient.put<ScholarshipDto>(`/scholarships/admin/${id}`, request),
  deleteScholarship: (id: number) =>
    apiClient.delete<void>(`/scholarships/admin/${id}`),
  submitApplication: (scholarshipId: number, request: ApplicationSubmitRequest) =>
    apiClient.post<ApplicationResponse>(`/scholarships/${scholarshipId}/apply`, request),
  getMatches: (request: MatchRequest) =>
    apiClient.post<MatchResponse>('/scholarships/matches', request),
};

export const notificationApi = {
  getAnnouncementAudienceCounts: (verifiedOnly = true) =>
    apiClient.get<AudienceCountsResponse>(
      `/notifications/announcements/audience-counts?verifiedOnly=${verifiedOnly}`,
    ),
  sendAnnouncement: (request: AnnouncementRequest) =>
    apiClient.post<AnnouncementResponse>('/notifications/announcements', request),
};

export default apiClient;
