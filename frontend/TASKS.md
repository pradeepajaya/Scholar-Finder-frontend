# Scholar-Finder Development Tasks Guide

## 📚 Learning Resources First

Before diving into the tasks, here are some essential concepts you need to understand:

### PostgreSQL Basics

1. **What is PostgreSQL?** - An open-source relational database
2. **Key Concepts:**
   - **Tables** - Store data in rows and columns
   - **Schemas** - Organize tables (we use `auth`, `users`, `scholarships`)
   - **Primary Key** - Unique identifier for each row (usually `id`)
   - **Foreign Key** - Links tables together
   - **Indexes** - Speed up queries

### Spring Boot Basics

1. **What is Spring Boot?** - A Java framework for building web applications
2. **Key Concepts:**
   - **@RestController** - Handles HTTP requests
   - **@Service** - Business logic
   - **@Repository** - Database operations
   - **@Entity** - Maps to database table
   - **DTO (Data Transfer Object)** - Data sent/received via API
   - **Dependency Injection** - Spring manages object creation

---

## 🎯 Development Tasks

### Phase 1: Setup & Run (Do This First!)

#### Task 1.1: Install Prerequisites

- [ ] Install Java 17 (JDK) from https://adoptium.net/
- [ ] Install Docker Desktop from https://docs.docker.com/get-docker/
- [ ] Install Maven from https://maven.apache.org/download.cgi
- [ ] Verify installations:
  ```powershell
  java -version
  docker --version
  mvn -version
  ```

#### Task 1.2: Start Database and Services with Docker

```powershell
cd f:\Scholar-Finder-frontend\backend
docker-compose up -d postgres redis
```

#### Task 1.3: Run Backend Services

```powershell
# Terminal 1 - Discovery Service
cd f:\Scholar-Finder-frontend\backend\discovery-service
mvnw.cmd spring-boot:run

# Terminal 2 - Auth Service
cd f:\Scholar-Finder-frontend\backend\auth-service
mvnw.cmd spring-boot:run

# Terminal 3 - API Gateway
cd f:\Scholar-Finder-frontend\backend\api-gateway
mvnw.cmd spring-boot:run
```

#### Task 1.4: Install Frontend Dependencies & Run

```powershell
cd f:\Scholar-Finder-frontend
npm install
npm run dev
```

#### Task 1.5: Test the Login

1. Open http://localhost:5173
2. Click "Student Login"
3. Try demo credentials: `student@scholarfinder.lk` / `student123`

---

### Phase 2: Complete Auth Service

#### Task 2.1: Add Password Reset Functionality

**File:** `auth-service/src/main/java/com/scholarfinder/auth/controller/AuthController.java`

Add these endpoints:

```java
@PostMapping("/forgot-password")
// Accepts email, generates reset token, sends email

@PostMapping("/reset-password")
// Accepts token + new password, updates password
```

#### Task 2.2: Add Email Verification

**File:** `auth-service/src/main/java/com/scholarfinder/auth/service/EmailService.java` (create new)

- Integrate with email service (e.g., SendGrid, Mailgun)
- Send verification email on registration
- Send password reset email

---

### Phase 3: Create User Service

#### Task 3.1: Create User Service Project

Copy the auth-service structure and modify:

```
backend/user-service/
├── pom.xml
├── Dockerfile
└── src/main/java/com/scholarfinder/user/
    ├── UserServiceApplication.java
    ├── config/
    ├── controller/
    │   ├── StudentController.java
    │   └── InstitutionController.java
    ├── dto/
    ├── entity/
    │   ├── StudentProfile.java
    │   └── InstitutionProfile.java
    ├── repository/
    └── service/
```

#### Task 3.2: Student Profile Endpoints

| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| GET    | `/api/students/profile` | Get current student's profile  |
| PUT    | `/api/students/profile` | Update student profile         |
| GET    | `/api/students/{id}`    | Get student by ID (admin only) |
| GET    | `/api/students`         | List all students (admin only) |

#### Task 3.3: Institution Profile Endpoints

| Method | Endpoint                    | Description                       |
| ------ | --------------------------- | --------------------------------- |
| GET    | `/api/institutions/profile` | Get current institution's profile |
| PUT    | `/api/institutions/profile` | Update institution profile        |
| GET    | `/api/institutions/{id}`    | Get institution by ID             |
| GET    | `/api/institutions`         | List all institutions             |

---

### Phase 4: Create Scholarship Service

#### Task 4.1: Create Scholarship Service Project

```
backend/scholarship-service/
├── pom.xml
├── Dockerfile
└── src/main/java/com/scholarfinder/scholarship/
    ├── ScholarshipServiceApplication.java
    ├── controller/
    │   ├── ScholarshipController.java
    │   └── ApplicationController.java
    ├── entity/
    │   ├── Scholarship.java
    │   ├── Application.java
    │   └── SavedScholarship.java
    ├── repository/
    └── service/
```

#### Task 4.2: Scholarship CRUD Endpoints

| Method | Endpoint                 | Description                           |
| ------ | ------------------------ | ------------------------------------- |
| GET    | `/api/scholarships`      | List all active scholarships          |
| GET    | `/api/scholarships/{id}` | Get scholarship details               |
| POST   | `/api/scholarships`      | Create scholarship (institution only) |
| PUT    | `/api/scholarships/{id}` | Update scholarship                    |
| DELETE | `/api/scholarships/{id}` | Delete scholarship                    |

#### Task 4.3: Application Endpoints

| Method | Endpoint                             | Description                        |
| ------ | ------------------------------------ | ---------------------------------- |
| POST   | `/api/applications`                  | Submit application (student)       |
| GET    | `/api/applications/my`               | Get student's applications         |
| GET    | `/api/applications/scholarship/{id}` | Get applications for a scholarship |
| PUT    | `/api/applications/{id}/status`      | Update application status          |

---

### Phase 5: Frontend Integration

#### Task 5.1: Connect Student Registration

**File:** `src/components/StudentRegistration.tsx`

- On form submit, call `authApi.register()` with role="STUDENT"
- Then call User Service to create student profile
- Handle success/error states

#### Task 5.2: Connect Institution Registration

**File:** `src/components/InstitutionRegistration.tsx`

- Similar to student registration
- Call `authApi.register()` with role="INSTITUTION"

#### Task 5.3: Create Scholarship Listing Page

**File:** `src/components/ScholarshipsPage.tsx`

- Fetch scholarships from API
- Display in cards
- Add filtering/searching

#### Task 5.4: Create Application Flow

- View scholarship details
- Apply button
- Application form
- Submission confirmation

---

### Phase 6: Advanced Features

#### Task 6.1: Implement Elasticsearch Search

- Index scholarships in Elasticsearch
- Full-text search across title, description
- Filter by country, field, type

#### Task 6.2: Implement Redis Caching

- Cache frequently accessed data
- Session storage
- Rate limiting

#### Task 6.3: Scholarship Matching Algorithm

Create matching service that:

- Takes student profile
- Compares against scholarship requirements
- Returns ranked matches with match percentage

---

## 📋 Quick Reference Commands

### Database Commands

```powershell
# Connect to PostgreSQL
docker exec -it scholar-finder-postgres psql -U scholarfinder -d scholarfinder_db

# List tables
\dt auth.*
\dt users.*
\dt scholarships.*

# View data
SELECT * FROM auth.users;
```

### Spring Boot Commands

```powershell
# Run with Maven
mvnw.cmd spring-boot:run

# Build JAR file
mvnw.cmd clean package

# Run with specific profile
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=docker
```

### Docker Commands

```powershell
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f auth-service

# Stop all
docker-compose down

# Remove volumes (reset database)
docker-compose down -v
```

### API Testing with cURL

```powershell
# Login
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"student@scholarfinder.lk\",\"password\":\"student123\"}"

# With token
curl -X GET http://localhost:8080/api/auth/me -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Common Issues & Solutions

### Issue: Port already in use

```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Issue: Maven wrapper not found

```powershell
# Download Maven wrapper
mvn wrapper:wrapper
```

### Issue: Database connection refused

1. Check if PostgreSQL container is running: `docker ps`
2. Check container logs: `docker logs scholar-finder-postgres`
3. Restart container: `docker-compose restart postgres`

### Issue: JWT token expired

- Get new token by logging in again
- Token expires in 24 hours by default

---

## 📖 Learning Path

1. **Week 1:** Get everything running, understand the structure
2. **Week 2:** Complete Auth Service features
3. **Week 3:** Build User Service
4. **Week 4:** Build Scholarship Service
5. **Week 5:** Frontend integration
6. **Week 6:** Search & matching features
7. **Week 7:** Testing & refinement
8. **Week 8:** Deployment preparation

Good luck! 🚀
