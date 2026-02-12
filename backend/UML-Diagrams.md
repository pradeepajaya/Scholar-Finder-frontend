# Scholar-Finder UML Diagrams

## Table of Contents

1. [ER Diagram](#er-diagram)
2. [Class Diagram](#class-diagram)
3. [Use Case Diagram](#use-case-diagram)

---

## ER Diagram

```mermaid
erDiagram
    %% AUTH SCHEMA
    AUTH_USERS {
        bigserial id PK
        varchar email UK
        varchar password
        varchar role
        boolean is_active
        boolean is_verified
        varchar verification_token
        varchar reset_password_token
        timestamp reset_password_expires
        timestamp last_login
        timestamp created_at
        timestamp updated_at
    }

    AUTH_REFRESH_TOKENS {
        bigserial id PK
        bigint user_id FK
        varchar token UK
        timestamp expires_at
        timestamp created_at
    }

    %% USERS SCHEMA
    STUDENT_PROFILES {
        bigserial id PK
        bigint user_id FK,UK
        varchar full_name
        date date_of_birth
        varchar gender
        varchar nationality
        varchar nic_passport
        varchar district
        varchar province
        varchar city
        varchar mobile
        varchar highest_education
        varchar current_status
        decimal z_score
        text[] preferred_countries
        text[] preferred_fields
        varchar profile_picture_url
        integer profile_completion_percentage
        timestamp created_at
        timestamp updated_at
    }

    INSTITUTION_PROFILES {
        bigserial id PK
        bigint user_id FK,UK
        varchar institution_name
        varchar institution_type
        varchar country
        varchar city
        text address
        varchar website
        varchar contact_email
        varchar contact_phone
        text description
        varchar logo_url
        boolean is_verified
        text[] verification_documents
        timestamp verified_at
        bigint verified_by
        integer total_scholarships
        integer active_scholarships
        integer total_applications_received
        timestamp created_at
        timestamp updated_at
    }

    ADMIN_PROFILES {
        bigserial id PK
        bigint user_id FK,UK
        varchar full_name
        varchar department
        text[] permissions
        timestamp created_at
        timestamp updated_at
    }

    %% SCHOLARSHIPS SCHEMA
    SCHOLARSHIPS {
        bigserial id PK
        bigint institution_id FK
        varchar title
        text description
        varchar scholarship_type
        integer coverage_percentage
        decimal amount
        varchar currency
        text[] eligible_countries
        text[] eligible_fields
        text[] eligible_levels
        decimal min_gpa
        date application_deadline
        date start_date
        date end_date
        integer duration_months
        text[] required_documents
        varchar status
        boolean is_featured
        integer total_applications
        integer views_count
        timestamp created_at
        timestamp updated_at
        timestamp published_at
    }

    APPLICATIONS {
        bigserial id PK
        bigint scholarship_id FK
        bigint student_id FK
        varchar status
        text cover_letter
        text statement_of_purpose
        jsonb documents
        bigint reviewer_id
        text review_notes
        timestamp reviewed_at
        decimal match_score
        timestamp created_at
        timestamp updated_at
    }

    SAVED_SCHOLARSHIPS {
        bigserial id PK
        bigint student_id FK
        bigint scholarship_id FK
        timestamp created_at
    }

    %% RELATIONSHIPS
    AUTH_USERS ||--o{ AUTH_REFRESH_TOKENS : "has"
    AUTH_USERS ||--o| STUDENT_PROFILES : "has"
    AUTH_USERS ||--o| INSTITUTION_PROFILES : "has"
    AUTH_USERS ||--o| ADMIN_PROFILES : "has"
    INSTITUTION_PROFILES ||--o{ SCHOLARSHIPS : "offers"
    SCHOLARSHIPS ||--o{ APPLICATIONS : "receives"
    STUDENT_PROFILES ||--o{ APPLICATIONS : "submits"
    STUDENT_PROFILES ||--o{ SAVED_SCHOLARSHIPS : "saves"
    SCHOLARSHIPS ||--o{ SAVED_SCHOLARSHIPS : "bookmarked_by"
    ADMIN_PROFILES ||--o{ INSTITUTION_PROFILES : "verifies"
    ADMIN_PROFILES ||--o{ APPLICATIONS : "reviews"
```

## Entity Descriptions

| Entity               | Schema       | Description                                  |
| -------------------- | ------------ | -------------------------------------------- |
| AUTH_USERS           | auth         | Core authentication data for all users       |
| AUTH_REFRESH_TOKENS  | auth         | JWT refresh tokens for session management    |
| STUDENT_PROFILES     | users        | Detailed student information and preferences |
| INSTITUTION_PROFILES | users        | Institution/university details               |
| ADMIN_PROFILES       | users        | Administrator profiles and permissions       |
| SCHOLARSHIPS         | scholarships | Scholarship listings and details             |
| APPLICATIONS         | scholarships | Student applications to scholarships         |
| SAVED_SCHOLARSHIPS   | scholarships | Bookmarked scholarships by students          |

## Relationship Summary

1. **AUTH_USERS → REFRESH_TOKENS**: One-to-Many (User can have multiple refresh tokens)
2. **AUTH_USERS → STUDENT_PROFILES**: One-to-One (Each student has one profile)
3. **AUTH_USERS → INSTITUTION_PROFILES**: One-to-One (Each institution has one profile)
4. **AUTH_USERS → ADMIN_PROFILES**: One-to-One (Each admin has one profile)
5. **INSTITUTION_PROFILES → SCHOLARSHIPS**: One-to-Many (Institution can post many scholarships)
6. **SCHOLARSHIPS → APPLICATIONS**: One-to-Many (Scholarship can have many applications)
7. **STUDENT_PROFILES → APPLICATIONS**: One-to-Many (Student can apply to many scholarships)
8. **STUDENT_PROFILES → SAVED_SCHOLARSHIPS**: One-to-Many (Student can save many scholarships)

---

## Class Diagram

```mermaid
classDiagram
    direction TB
    
    %% ========================================
    %% ENTITY CLASSES
    %% ========================================
    
    class User {
        -Long id
        -String email
        -String password
        -Role role
        -Boolean isActive
        -Boolean isVerified
        -String verificationToken
        -String resetPasswordToken
        -LocalDateTime resetPasswordExpires
        -LocalDateTime lastLogin
        -LocalDateTime createdAt
        -LocalDateTime updatedAt
    }
    
    class RefreshToken {
        -Long id
        -User user
        -String token
        -LocalDateTime expiresAt
        -LocalDateTime createdAt
    }
    
    class StudentProfile {
        -Long id
        -Long userId
        -String fullName
        -Date dateOfBirth
        -String gender
        -String nationality
        -String nicPassport
        -String district
        -String province
        -String city
        -String mobile
        -String highestEducation
        -String currentStatus
        -BigDecimal zScore
        -List~String~ preferredCountries
        -List~String~ preferredFields
        -String profilePictureUrl
        -Integer profileCompletionPercentage
    }
    
    class InstitutionProfile {
        -Long id
        -Long userId
        -String institutionName
        -String institutionType
        -String country
        -String city
        -String address
        -String website
        -String contactEmail
        -String contactPhone
        -String description
        -String logoUrl
        -Boolean isVerified
        -LocalDateTime verifiedAt
        -Long verifiedBy
        -Integer totalScholarships
        -Integer activeScholarships
    }
    
    class AdminProfile {
        -Long id
        -Long userId
        -String fullName
        -String department
        -List~String~ permissions
    }
    
    class Scholarship {
        -Long id
        -Long institutionId
        -String title
        -String description
        -String scholarshipType
        -Integer coveragePercentage
        -BigDecimal amount
        -String currency
        -List~String~ eligibleCountries
        -List~String~ eligibleFields
        -List~String~ eligibleLevels
        -BigDecimal minGpa
        -Date applicationDeadline
        -Date startDate
        -Date endDate
        -Integer durationMonths
        -String status
        -Boolean isFeatured
        -Integer totalApplications
        -Integer viewsCount
    }
    
    class Application {
        -Long id
        -Long scholarshipId
        -Long studentId
        -String status
        -String coverLetter
        -String statementOfPurpose
        -JsonObject documents
        -Long reviewerId
        -String reviewNotes
        -LocalDateTime reviewedAt
        -BigDecimal matchScore
    }
    
    class SavedScholarship {
        -Long id
        -Long studentId
        -Long scholarshipId
        -LocalDateTime createdAt
    }
    
    class Role {
        <<enumeration>>
        STUDENT
        INSTITUTION
        ADMIN
    }
    
    %% ========================================
    %% SERVICE CLASSES
    %% ========================================
    
    class AuthService {
        -UserRepository userRepository
        -RefreshTokenRepository refreshTokenRepository
        -PasswordEncoder passwordEncoder
        -JwtTokenProvider jwtTokenProvider
        -AuthenticationManager authenticationManager
        +register(RegisterRequest) AuthResponse
        +login(LoginRequest) AuthResponse
        +refreshToken(RefreshTokenRequest) AuthResponse
        +logout(String token) void
        +verifyEmail(String token) void
        +resetPassword(String email) void
    }
    
    class JwtTokenProvider {
        -String jwtSecret
        -Long jwtExpiration
        +generateToken(String email) String
        +generateToken(Authentication auth) String
        +getEmailFromToken(String token) String
        +validateToken(String token) Boolean
    }
    
    class CustomUserDetailsService {
        -UserRepository userRepository
        +loadUserByUsername(String email) UserDetails
    }
    
    %% ========================================
    %% CONTROLLER CLASSES
    %% ========================================
    
    class AuthController {
        -AuthService authService
        +register(RegisterRequest) ResponseEntity
        +login(LoginRequest) ResponseEntity
        +refreshToken(RefreshTokenRequest) ResponseEntity
        +logout() ResponseEntity
        +getCurrentUser() ResponseEntity
        +verifyEmail(String token) ResponseEntity
    }
    
    %% ========================================
    %% REPOSITORY INTERFACES
    %% ========================================
    
    class UserRepository {
        <<interface>>
        +findByEmail(String email) Optional~User~
        +existsByEmail(String email) Boolean
    }
    
    class RefreshTokenRepository {
        <<interface>>
        +findByToken(String token) Optional~RefreshToken~
        +deleteByUser(User user) void
    }
    
    %% ========================================
    %% DTO CLASSES
    %% ========================================
    
    class LoginRequest {
        -String email
        -String password
        -Boolean rememberMe
    }
    
    class RegisterRequest {
        -String email
        -String password
        -String confirmPassword
        -Role role
        -String fullName
        -String institutionName
    }
    
    class AuthResponse {
        -String accessToken
        -String refreshToken
        -String tokenType
        -Long expiresIn
        -UserDto user
    }
    
    class UserDto {
        -Long id
        -String email
        -Role role
        -Boolean isVerified
    }
    
    %% ========================================
    %% FRONTEND CLASSES
    %% ========================================
    
    class ApiClient {
        -String baseUrl
        -request~T~(endpoint, options) Promise~ApiResponse~
        -refreshToken() Promise~Boolean~
        +login(LoginRequest) Promise~AuthResponse~
        +register(RegisterRequest) Promise~AuthResponse~
        +logout() Promise~void~
        +getCurrentUser() Promise~UserDto~
        +get~T~(endpoint) Promise~T~
        +post~T~(endpoint, data) Promise~T~
        +put~T~(endpoint, data) Promise~T~
        +delete~T~(endpoint) Promise~T~
    }
    
    class TokenService {
        +getToken() String
        +setToken(token) void
        +getRefreshToken() String
        +setRefreshToken(token) void
        +getUser() UserDto
        +setUser(user) void
        +clearTokens() void
        +isAuthenticated() Boolean
    }
    
    class AuthContext {
        -UserDto user
        -Boolean isLoading
        -Boolean isAuthenticated
        -String error
        +login(LoginRequest) Promise~void~
        +register(RegisterRequest) Promise~void~
        +logout() Promise~void~
        +clearError() void
    }
    
    %% ========================================
    %% RELATIONSHIPS
    %% ========================================
    
    User "1" --> "0..*" RefreshToken : has
    User "1" --> "0..1" StudentProfile : has
    User "1" --> "0..1" InstitutionProfile : has
    User "1" --> "0..1" AdminProfile : has
    User --> Role : has
    
    InstitutionProfile "1" --> "0..*" Scholarship : offers
    Scholarship "1" --> "0..*" Application : receives
    StudentProfile "1" --> "0..*" Application : submits
    StudentProfile "1" --> "0..*" SavedScholarship : saves
    Scholarship "1" --> "0..*" SavedScholarship : bookmarkedIn
    
    AuthController --> AuthService : uses
    AuthService --> UserRepository : uses
    AuthService --> RefreshTokenRepository : uses
    AuthService --> JwtTokenProvider : uses
    AuthService --> CustomUserDetailsService : uses
    
    UserRepository ..> User : manages
    RefreshTokenRepository ..> RefreshToken : manages
    
    AuthController ..> LoginRequest : receives
    AuthController ..> RegisterRequest : receives
    AuthController ..> AuthResponse : returns
    
    ApiClient --> TokenService : uses
    AuthContext --> ApiClient : uses
```

---

## Use Case Diagram

```mermaid
flowchart TB
    subgraph Actors
        Student((👨‍🎓 Student))
        Institution((🏛️ Institution))
        Admin((👔 Admin))
        Guest((👤 Guest))
    end
    
    subgraph Authentication["🔐 Authentication"]
        UC1[Register Account]
        UC2[Login]
        UC3[Logout]
        UC4[Reset Password]
        UC5[Verify Email]
        UC6[Refresh Token]
    end
    
    subgraph StudentFeatures["📚 Student Features"]
        UC10[Create/Edit Profile]
        UC11[View Scholarships]
        UC12[Search Scholarships]
        UC13[Filter Scholarships]
        UC14[Apply to Scholarship]
        UC15[Track Application Status]
        UC16[Save/Bookmark Scholarship]
        UC17[Get Scholarship Matching]
        UC18[View Application History]
        UC19[Upload Documents]
    end
    
    subgraph InstitutionFeatures["🏛️ Institution Features"]
        UC20[Create Institution Profile]
        UC21[Post Scholarship]
        UC22[Edit Scholarship]
        UC23[Close/Delete Scholarship]
        UC24[View Applications]
        UC25[Review Applications]
        UC26[Shortlist Candidates]
        UC27[Accept/Reject Applications]
        UC28[View Institution Dashboard]
        UC29[Export Application Data]
    end
    
    subgraph AdminFeatures["⚙️ Admin Features"]
        UC30[Manage Users]
        UC31[Verify Institutions]
        UC32[Manage Scholarships]
        UC33[View System Analytics]
        UC34[Moderate Content]
        UC35[Manage Settings]
        UC36[View Admin Dashboard]
        UC37[Suspend/Activate Accounts]
        UC38[Review Reports]
    end
    
    subgraph PublicFeatures["🌐 Public Features"]
        UC40[Browse Scholarships]
        UC41[View Scholarship Details]
        UC42[Read News/Blog]
        UC43[Contact Support]
        UC44[View Previous Scholars]
    end
    
    %% Guest connections
    Guest --> UC1
    Guest --> UC2
    Guest --> UC40
    Guest --> UC41
    Guest --> UC42
    Guest --> UC43
    Guest --> UC44
    
    %% Student connections
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC10
    Student --> UC11
    Student --> UC12
    Student --> UC13
    Student --> UC14
    Student --> UC15
    Student --> UC16
    Student --> UC17
    Student --> UC18
    Student --> UC19
    Student --> UC40
    Student --> UC41
    Student --> UC42
    Student --> UC43
    
    %% Institution connections
    Institution --> UC2
    Institution --> UC3
    Institution --> UC4
    Institution --> UC20
    Institution --> UC21
    Institution --> UC22
    Institution --> UC23
    Institution --> UC24
    Institution --> UC25
    Institution --> UC26
    Institution --> UC27
    Institution --> UC28
    Institution --> UC29
    
    %% Admin connections
    Admin --> UC2
    Admin --> UC3
    Admin --> UC30
    Admin --> UC31
    Admin --> UC32
    Admin --> UC33
    Admin --> UC34
    Admin --> UC35
    Admin --> UC36
    Admin --> UC37
    Admin --> UC38
    
    %% Include relationships
    UC14 -.->|includes| UC19
    UC14 -.->|includes| UC10
    UC25 -.->|includes| UC26
    UC25 -.->|includes| UC27
    
    %% Extend relationships
    UC2 -.->|extends| UC6
    UC11 -.->|extends| UC12
    UC11 -.->|extends| UC13
```

---

## Use Case Descriptions

### Authentication Use Cases

| ID | Use Case | Actor(s) | Description |
|----|----------|----------|-------------|
| UC1 | Register Account | Guest | Create a new account as Student or Institution |
| UC2 | Login | All Users | Authenticate with email and password |
| UC3 | Logout | All Users | End current session |
| UC4 | Reset Password | All Users | Request password reset via email |
| UC5 | Verify Email | Student, Institution | Confirm email address |
| UC6 | Refresh Token | System | Automatically refresh expired JWT tokens |

### Student Use Cases

| ID | Use Case | Description |
|----|----------|-------------|
| UC10 | Create/Edit Profile | Complete academic, financial, and preference information |
| UC11 | View Scholarships | Browse available scholarships |
| UC12 | Search Scholarships | Search by keywords, field, or country |
| UC13 | Filter Scholarships | Filter by type, deadline, eligibility |
| UC14 | Apply to Scholarship | Submit application with documents |
| UC15 | Track Application Status | View current status of all applications |
| UC16 | Save/Bookmark Scholarship | Save scholarships for later |
| UC17 | Get Scholarship Matching | AI-powered scholarship recommendations |
| UC18 | View Application History | See past applications and outcomes |
| UC19 | Upload Documents | Upload certificates, transcripts, etc. |

### Institution Use Cases

| ID | Use Case | Description |
|----|----------|-------------|
| UC20 | Create Institution Profile | Set up institution details and verification |
| UC21 | Post Scholarship | Create new scholarship listing |
| UC22 | Edit Scholarship | Update scholarship details |
| UC23 | Close/Delete Scholarship | Remove or close scholarship |
| UC24 | View Applications | See all received applications |
| UC25 | Review Applications | Evaluate student applications |
| UC26 | Shortlist Candidates | Mark promising candidates |
| UC27 | Accept/Reject Applications | Make final decisions |
| UC28 | View Institution Dashboard | Analytics and overview |
| UC29 | Export Application Data | Download application reports |

### Admin Use Cases

| ID | Use Case | Description |
|----|----------|-------------|
| UC30 | Manage Users | CRUD operations on user accounts |
| UC31 | Verify Institutions | Approve/reject institution registrations |
| UC32 | Manage Scholarships | Moderate and manage all scholarships |
| UC33 | View System Analytics | Platform-wide statistics |
| UC34 | Moderate Content | Review and moderate user content |
| UC35 | Manage Settings | Configure system settings |
| UC36 | View Admin Dashboard | Administrative overview |
| UC37 | Suspend/Activate Accounts | Enable/disable user accounts |
| UC38 | Review Reports | Handle user reports and complaints |

---

## How to View These Diagrams

1. **VS Code**: Install "Markdown Preview Mermaid Support" extension, then press `Ctrl+Shift+V`
2. **GitHub/GitLab**: Push to repository - renders automatically
3. **Online**: Copy Mermaid code to [mermaid.live](https://mermaid.live/)
4. **Export**: Use Mermaid CLI: `mmdc -i ER-Diagram.md -o diagram.png`
