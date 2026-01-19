# Scholar-Finder Backend

A microservices-based backend for the Scholar-Finder scholarship matching platform, built with Spring Boot, PostgreSQL, Redis, and Elasticsearch.

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                          │
│                       http://localhost:5173                       │
└─────────────────────────────┬────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    API Gateway (Spring Cloud)                     │
│                       http://localhost:8080                       │
└─────────────────────────────┬────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Auth Service │   │ User Service  │   │  Scholarship  │
│  Port: 8081   │   │  Port: 8082   │   │   Service     │
└───────┬───────┘   └───────┬───────┘   │  Port: 8083   │
        │                   │           └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  PostgreSQL   │   │     Redis     │   │ Elasticsearch │
│  Port: 5432   │   │  Port: 6379   │   │  Port: 9200   │
└───────────────┘   └───────────────┘   └───────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   Discovery Service   │
                │  (Eureka) Port: 8761  │
                └───────────────────────┘
```

## 📦 Services

| Service             | Port | Description                                    |
| ------------------- | ---- | ---------------------------------------------- |
| Discovery Service   | 8761 | Eureka Server for service registration         |
| API Gateway         | 8080 | Single entry point, routing, CORS              |
| Auth Service        | 8081 | Authentication, JWT tokens, user credentials   |
| User Service        | 8082 | User profiles (students, institutions, admins) |
| Scholarship Service | 8083 | Scholarship CRUD and applications              |

## 🚀 Quick Start

### Prerequisites

- **Java 17+** - [Download](https://adoptium.net/)
- **Docker & Docker Compose** - [Download](https://docs.docker.com/get-docker/)
- **Maven 3.8+** - [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** (for frontend) - [Download](https://nodejs.org/)

### Option 1: Using Docker Compose (Recommended)

1. **Start all services:**

   ```bash
   cd backend
   docker-compose up -d
   ```

2. **Check service status:**

   ```bash
   docker-compose ps
   ```

3. **View logs:**

   ```bash
   docker-compose logs -f auth-service
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

### Option 2: Run Services Individually (Development)

1. **Start infrastructure services first:**

   ```bash
   docker-compose up -d postgres redis elasticsearch
   ```

2. **Start Discovery Service:**

   ```bash
   cd discovery-service
   ./mvnw spring-boot:run
   ```

3. **Start Auth Service:**

   ```bash
   cd auth-service
   ./mvnw spring-boot:run
   ```

4. **Start API Gateway:**
   ```bash
   cd api-gateway
   ./mvnw spring-boot:run
   ```

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint                  | Description       | Auth Required |
| ------ | ------------------------- | ----------------- | ------------- |
| POST   | `/api/auth/register`      | Register new user | No            |
| POST   | `/api/auth/login`         | Login user        | No            |
| POST   | `/api/auth/refresh-token` | Refresh JWT token | No            |
| POST   | `/api/auth/logout`        | Logout user       | Yes           |
| GET    | `/api/auth/me`            | Get current user  | Yes           |
| GET    | `/api/auth/verify-email`  | Verify email      | No            |

### Example API Calls

**Register a Student:**

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newstudent@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "STUDENT",
    "fullName": "John Doe"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@scholarfinder.lk",
    "password": "student123"
  }'
```

**Access Protected Resource:**

```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 👤 Default Test Users

| Role        | Email                        | Password       |
| ----------- | ---------------------------- | -------------- |
| Admin       | admin@scholarfinder.lk       | admin123       |
| Student     | student@scholarfinder.lk     | student123     |
| Institution | institution@scholarfinder.lk | institution123 |

## 🗄️ Database

### Connecting to PostgreSQL

```bash
# Using Docker
docker exec -it scholar-finder-postgres psql -U scholarfinder -d scholarfinder_db

# Using psql directly
psql -h localhost -U scholarfinder -d scholarfinder_db
```

### Database Schemas

- `auth` - Authentication tables (users, refresh_tokens)
- `users` - User profiles (student_profiles, institution_profiles, admin_profiles)
- `scholarships` - Scholarship data (scholarships, applications, saved_scholarships)

## 📊 Monitoring

- **Eureka Dashboard:** http://localhost:8761 (eureka/eureka123)
- **API Gateway Health:** http://localhost:8080/actuator/health
- **Auth Service Health:** http://localhost:8081/actuator/health

## 🔧 Configuration

### Environment Variables

| Variable                               | Default                                           | Description                               |
| -------------------------------------- | ------------------------------------------------- | ----------------------------------------- |
| `JWT_SECRET`                           | -                                                 | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRATION`                       | 86400000                                          | Access token expiry (24h in ms)           |
| `SPRING_DATASOURCE_URL`                | jdbc:postgresql://localhost:5432/scholarfinder_db | DB URL                                    |
| `SPRING_DATASOURCE_USERNAME`           | scholarfinder                                     | DB username                               |
| `SPRING_DATASOURCE_PASSWORD`           | scholarfinder123                                  | DB password                               |
| `SPRING_REDIS_HOST`                    | localhost                                         | Redis host                                |
| `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | http://localhost:8761/eureka/                     | Eureka URL                                |

## 🛠️ Development

### Project Structure

```
backend/
├── docker-compose.yml          # Docker orchestration
├── init-db.sql                 # Database initialization
├── discovery-service/          # Eureka Server
│   ├── pom.xml
│   └── src/main/java/...
├── api-gateway/               # Spring Cloud Gateway
│   ├── pom.xml
│   └── src/main/java/...
├── auth-service/              # Authentication Service
│   ├── pom.xml
│   └── src/main/java/
│       └── com/scholarfinder/auth/
│           ├── config/        # Security config
│           ├── controller/    # REST endpoints
│           ├── dto/           # Data transfer objects
│           ├── entity/        # JPA entities
│           ├── exception/     # Exception handling
│           ├── repository/    # Data access
│           ├── security/      # JWT & filters
│           └── service/       # Business logic
├── user-service/              # User Management (TODO)
└── scholarship-service/       # Scholarships (TODO)
```

### Building Services

```bash
# Build all services
cd backend
for dir in */; do
  if [ -f "$dir/pom.xml" ]; then
    (cd "$dir" && ./mvnw clean package -DskipTests)
  fi
done

# Build specific service
cd auth-service
./mvnw clean package
```

### Running Tests

```bash
cd auth-service
./mvnw test
```

## 🔒 Security

- JWT-based authentication
- Password hashing with BCrypt
- Role-based access control (STUDENT, INSTITUTION, ADMIN)
- CORS configured for frontend
- Token refresh mechanism
- Secure password reset flow

## 📝 Next Steps

1. **User Service** - Implement profile management
2. **Scholarship Service** - CRUD operations and search
3. **Matching Service** - AI-powered scholarship matching
4. **Notification Service** - Email notifications
5. **Elasticsearch Integration** - Full-text search
6. **Redis Caching** - Performance optimization

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Find process using port
netstat -ano | findstr :8080
# Kill process
taskkill /PID <PID> /F
```

**Docker containers not starting:**

```bash
# Remove all containers and volumes
docker-compose down -v
docker-compose up -d
```

**Database connection issues:**

```bash
# Check if PostgreSQL is running
docker logs scholar-finder-postgres
```

## 📚 Resources

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Spring Cloud Gateway](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
