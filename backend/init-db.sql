-- Scholar-Finder Database Initialization Script
-- This script creates all necessary tables and initial data

-- Create schemas for different services
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS scholarships;

-- =====================================================
-- AUTH SCHEMA - Authentication related tables
-- =====================================================

-- Users table for authentication
CREATE TABLE IF NOT EXISTS auth.users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- USERS SCHEMA - User profiles and related data
-- =====================================================

-- Student profiles
CREATE TABLE IF NOT EXISTS users.student_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    nationality VARCHAR(100) DEFAULT 'Sri Lankan',
    nic_passport VARCHAR(50),
    district VARCHAR(100),
    province VARCHAR(100),
    city VARCHAR(100),
    mobile VARCHAR(20),
    preferred_language VARCHAR(50) DEFAULT 'English',
    
    -- Academic Information
    highest_education VARCHAR(100),
    current_status VARCHAR(100),
    intended_level VARCHAR(100),
    intended_year VARCHAR(10),
    preferred_mode VARCHAR(50),
    preferred_location VARCHAR(100),
    
    -- O/L Results
    ol_year VARCHAR(10),
    ol_type VARCHAR(50),
    ol_medium VARCHAR(50),
    ol_passed INTEGER,
    ol_a_count INTEGER,
    ol_b_count INTEGER,
    ol_c_count INTEGER,
    maths_grade VARCHAR(5),
    science_grade VARCHAR(5),
    english_grade VARCHAR(5),
    
    -- A/L Results
    al_year VARCHAR(10),
    al_stream VARCHAR(100),
    al_medium VARCHAR(50),
    subject1 VARCHAR(100),
    grade1 VARCHAR(5),
    subject2 VARCHAR(100),
    grade2 VARCHAR(5),
    subject3 VARCHAR(100),
    grade3 VARCHAR(5),
    z_score DECIMAL(4,3),
    
    -- English Proficiency
    english_test VARCHAR(50),
    overall_score VARCHAR(20),
    exam_year VARCHAR(10),
    
    -- Financial Information
    household_income VARCHAR(100),
    dependents INTEGER,
    employment_status VARCHAR(100),
    government_assistance VARCHAR(50),
    
    -- Background Information
    background VARCHAR(255),
    disability VARCHAR(10),
    sports VARCHAR(10),
    leadership VARCHAR(10),
    first_generation VARCHAR(10),
    
    -- Preferences
    preferred_countries TEXT[], -- Array of countries
    preferred_fields TEXT[], -- Array of study fields
    scholarship_type VARCHAR(50),
    willing_to_return VARCHAR(10),
    
    profile_picture_url VARCHAR(500),
    profile_completion_percentage INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Institution profiles
CREATE TABLE IF NOT EXISTS users.institution_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    institution_name VARCHAR(255) NOT NULL,
    institution_type VARCHAR(100), -- University, College, Foundation, etc.
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    website VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    description TEXT,
    logo_url VARCHAR(500),
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verification_documents TEXT[],
    verified_at TIMESTAMP,
    verified_by BIGINT,
    
    -- Stats
    total_scholarships INTEGER DEFAULT 0,
    active_scholarships INTEGER DEFAULT 0,
    total_applications_received INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin profiles
CREATE TABLE IF NOT EXISTS users.admin_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    permissions TEXT[], -- Array of permission strings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SCHOLARSHIPS SCHEMA - Scholarship related tables
-- =====================================================

-- Scholarships table
CREATE TABLE IF NOT EXISTS scholarships.scholarships (
    id BIGSERIAL PRIMARY KEY,
    institution_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Scholarship Details
    scholarship_type VARCHAR(50), -- Full, Partial, Tuition, Living Expenses
    coverage_percentage INTEGER,
    amount DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'USD',
    
    -- Eligibility
    eligible_countries TEXT[],
    eligible_fields TEXT[],
    eligible_levels TEXT[], -- Undergraduate, Postgraduate, PhD
    min_gpa DECIMAL(3,2),
    min_age INTEGER,
    max_age INTEGER,
    required_english_test VARCHAR(50),
    min_english_score DECIMAL(5,2),
    
    -- Dates
    application_deadline DATE,
    start_date DATE,
    end_date DATE,
    duration_months INTEGER,
    
    -- Requirements
    required_documents TEXT[],
    additional_requirements TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, ACTIVE, CLOSED, EXPIRED
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Stats
    total_applications INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- Scholarship Applications
CREATE TABLE IF NOT EXISTS scholarships.applications (
    id BIGSERIAL PRIMARY KEY,
    scholarship_id BIGINT NOT NULL REFERENCES scholarships.scholarships(id),
    student_id BIGINT NOT NULL,
    
    -- Application Details
    status VARCHAR(50) DEFAULT 'SUBMITTED', -- SUBMITTED, UNDER_REVIEW, SHORTLISTED, ACCEPTED, REJECTED, WITHDRAWN
    cover_letter TEXT,
    statement_of_purpose TEXT,
    
    -- Documents
    documents JSONB, -- Store document URLs and types
    
    -- Review
    reviewer_id BIGINT,
    review_notes TEXT,
    reviewed_at TIMESTAMP,
    
    -- Match Score (for AI matching)
    match_score DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved Scholarships (Bookmarks)
CREATE TABLE IF NOT EXISTS scholarships.saved_scholarships (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    scholarship_id BIGINT NOT NULL REFERENCES scholarships.scholarships(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, scholarship_id)
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================

CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_role ON auth.users(role);
CREATE INDEX idx_refresh_tokens_user_id ON auth.refresh_tokens(user_id);
CREATE INDEX idx_student_profiles_user_id ON users.student_profiles(user_id);
CREATE INDEX idx_institution_profiles_user_id ON users.institution_profiles(user_id);
CREATE INDEX idx_scholarships_institution_id ON scholarships.scholarships(institution_id);
CREATE INDEX idx_scholarships_status ON scholarships.scholarships(status);
CREATE INDEX idx_scholarships_deadline ON scholarships.scholarships(application_deadline);
CREATE INDEX idx_applications_scholarship_id ON scholarships.applications(scholarship_id);
CREATE INDEX idx_applications_student_id ON scholarships.applications(student_id);
CREATE INDEX idx_applications_status ON scholarships.applications(status);

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Create default admin user (password: admin123 - bcrypt hashed)
INSERT INTO auth.users (email, password, role, is_active, is_verified) 
VALUES ('admin@scholarfinder.lk', '$2a$10$N.zmYfgKLLxj4TvfnYsLdeD3xKPmAOWxrMxNQ1b.0TQz7MvJZz6Oe', 'ADMIN', true, true)
ON CONFLICT (email) DO NOTHING;

-- Create test student user (password: student123)
INSERT INTO auth.users (email, password, role, is_active, is_verified)
VALUES ('student@scholarfinder.lk', '$2a$10$dG7F8qKLJHk/CZxMFLvN3eWC0qYLhG1FJLqjZk3EXQpPq2z1WzBKG', 'STUDENT', true, true)
ON CONFLICT (email) DO NOTHING;

-- Create test institution user (password: institution123)
INSERT INTO auth.users (email, password, role, is_active, is_verified)
VALUES ('institution@scholarfinder.lk', '$2a$10$XLzk9qvN8FxMJH3vR2dP6OQK5LhZ1TJLqjZk3EXQpPq2z1WzBKM', 'INSTITUTION', true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert admin profile
INSERT INTO users.admin_profiles (user_id, full_name, department, permissions)
SELECT id, 'System Administrator', 'IT', ARRAY['ALL']
FROM auth.users WHERE email = 'admin@scholarfinder.lk'
ON CONFLICT DO NOTHING;

-- Insert test student profile
INSERT INTO users.student_profiles (user_id, full_name, nationality, district, province)
SELECT id, 'Test Student', 'Sri Lankan', 'Colombo', 'Western'
FROM auth.users WHERE email = 'student@scholarfinder.lk'
ON CONFLICT DO NOTHING;

-- Insert test institution profile
INSERT INTO users.institution_profiles (user_id, institution_name, institution_type, country, is_verified)
SELECT id, 'Test University', 'University', 'Sri Lanka', true
FROM auth.users WHERE email = 'institution@scholarfinder.lk'
ON CONFLICT DO NOTHING;

COMMIT;
