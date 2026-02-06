-- Scholar-Finder Database Initialization Script
-- This script creates all necessary tables and initial data

-- Create schemas for different services
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS scholarships;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS notifications;

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
// Example pseudo-code for a MatchingService
public class MatchingService {
    
    public MatchResult calculateMatch(StudentProfile student, Scholarship scholarship) {
        List<String> matched = new ArrayList<>();
        List<String> unmatched = new ArrayList<>();
        
        // 1. Check education level
        if (scholarship.getEligibleLevels().contains(student.getIntendedLevel())) {
            matched.add("Education level matches");
        } else {
            unmatched.add("Required: " + scholarship.getEligibleLevels());
        }
        
        // 2. Check age
        int age = calculateAge(student.getDateOfBirth());
        if (age >= scholarship.getMinAge() && age <= scholarship.getMaxAge()) {
            matched.add("Age requirement met");
        } else {
            unmatched.add("Age must be " + scholarship.getMinAge() + "-" + scholarship.getMaxAge());
        }
        
        // 3. Check English score
        if (student.getOverallScore() >= scholarship.getMinEnglishScore()) {
            matched.add("English proficiency met");
        } else {
            unmatched.add("Requires " + scholarship.getMinEnglishScore() + " " + scholarship.getRequiredEnglishTest());
        }
        
        // 4. Check preferred countries
        if (student.getPreferredCountries().contains(scholarship.getCountry())) {
            matched.add("Preferred country");
        }
        
        // 5. Check financial need (if applicable)
        // 6. Check citizenship
        // ... more criteria
        
        // Calculate percentage
        int total = matched.size() + unmatched.size();
        double percentage = (matched.size() / (double) total) * 100;
        
        return new MatchResult(percentage, matched, unmatched);
    }
}// Example pseudo-code for a MatchingService
public class MatchingService {
    
    public MatchResult calculateMatch(StudentProfile student, Scholarship scholarship) {
        List<String> matched = new ArrayList<>();
        List<String> unmatched = new ArrayList<>();
        
        // 1. Check education level
        if (scholarship.getEligibleLevels().contains(student.getIntendedLevel())) {
            matched.add("Education level matches");
        } else {
            unmatched.add("Required: " + scholarship.getEligibleLevels());
        }
        
        // 2. Check age
        int age = calculateAge(student.getDateOfBirth());
        if (age >= scholarship.getMinAge() && age <= scholarship.getMaxAge()) {
            matched.add("Age requirement met");
        } else {
            unmatched.add("Age must be " + scholarship.getMinAge() + "-" + scholarship.getMaxAge());
        }
        
        // 3. Check English score
        if (student.getOverallScore() >= scholarship.getMinEnglishScore()) {
            matched.add("English proficiency met");
        } else {
            unmatched.add("Requires " + scholarship.getMinEnglishScore() + " " + scholarship.getRequiredEnglishTest());
        }
        
        // 4. Check preferred countries
        if (student.getPreferredCountries().contains(scholarship.getCountry())) {
            matched.add("Preferred country");
        }
        
        // 5. Check financial need (if applicable)
        // 6. Check citizenship
        // ... more criteria
        
        // Calculate percentage
        int total = matched.size() + unmatched.size();
        double percentage = (matched.size() / (double) total) * 100;
        
        return new MatchResult(percentage, matched, unmatched);
    }
}-- =====================================================

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
-- CONTENT SCHEMA - News and Blog content tables
-- =====================================================

-- Categories table for organizing content
CREATE TABLE IF NOT EXISTS content.categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(20),
    content_type VARCHAR(20) DEFAULT 'BOTH', -- NEWS, BLOG, or BOTH
    parent_id BIGINT REFERENCES content.categories(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table for content tagging
CREATE TABLE IF NOT EXISTS content.tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News articles table
CREATE TABLE IF NOT EXISTS content.news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    author_id BIGINT NOT NULL,
    category_id BIGINT REFERENCES content.categories(id) ON DELETE SET NULL,
    source VARCHAR(255),
    source_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ARCHIVED
    is_featured BOOLEAN DEFAULT FALSE,
    is_breaking BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS content.blog_posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    author_id BIGINT NOT NULL,
    category_id BIGINT REFERENCES content.categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ARCHIVED
    is_featured BOOLEAN DEFAULT FALSE,
    allow_comments BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    reading_time_minutes INTEGER DEFAULT 5,
    published_at TIMESTAMP,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News-Tags junction table
CREATE TABLE IF NOT EXISTS content.news_tags (
    news_id BIGINT NOT NULL REFERENCES content.news(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES content.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (news_id, tag_id)
);

-- Blog-Tags junction table
CREATE TABLE IF NOT EXISTS content.blog_tags (
    blog_post_id BIGINT NOT NULL REFERENCES content.blog_posts(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES content.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, tag_id)
);

-- =====================================================
-- NOTIFICATIONS SCHEMA - Contact and notification tables
-- =====================================================

-- Contact messages from Contact Us page
CREATE TABLE IF NOT EXISTS notifications.contact_messages (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'NEW', -- NEW, READ, IN_PROGRESS, RESOLVED, CLOSED
    category VARCHAR(50), -- GENERAL, SCHOLARSHIP, TECHNICAL, FEEDBACK, COMPLAINT
    priority VARCHAR(20) DEFAULT 'NORMAL', -- LOW, NORMAL, HIGH, URGENT
    assigned_to BIGINT,
    admin_notes TEXT,
    response TEXT,
    responded_at TIMESTAMP,
    responded_by BIGINT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email notifications log
CREATE TABLE IF NOT EXISTS notifications.email_notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    body_html TEXT,
    template_name VARCHAR(100),
    template_data TEXT, -- JSON string
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, SENT, FAILED, RETRY
    notification_type VARCHAR(50), -- CONTACT_CONFIRMATION, CONTACT_ADMIN, etc.
    reference_id BIGINT,
    reference_type VARCHAR(50), -- CONTACT_MESSAGE, SCHOLARSHIP, APPLICATION
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    error_message TEXT,
    sent_at TIMESTAMP,
    scheduled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON auth.users(role);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON auth.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON users.student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_institution_profiles_user_id ON users.institution_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_scholarships_institution_id ON scholarships.scholarships(institution_id);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships.scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships.scholarships(application_deadline);
CREATE INDEX IF NOT EXISTS idx_applications_scholarship_id ON scholarships.applications(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON scholarships.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON scholarships.applications(status);

-- Content indexes
CREATE INDEX IF NOT EXISTS idx_news_status ON content.news(status);
CREATE INDEX IF NOT EXISTS idx_news_slug ON content.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON content.news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_category_id ON content.news(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON content.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON content.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON content.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON content.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON content.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_content_type ON content.categories(content_type);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON content.tags(slug);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON notifications.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON notifications.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON notifications.contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_priority ON notifications.contact_messages(priority);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON notifications.email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_recipient ON notifications.email_notifications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_notifications_type ON notifications.email_notifications(notification_type);

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

-- =====================================================
-- INSERT DEFAULT CONTENT DATA
-- =====================================================

-- Insert default categories
INSERT INTO content.categories (name, slug, description, content_type, display_order, is_active) VALUES
('Scholarships', 'scholarships', 'News and articles about scholarships', 'BOTH', 1, true),
('Education', 'education', 'General education news and tips', 'BOTH', 2, true),
('Study Abroad', 'study-abroad', 'Information about studying overseas', 'BOTH', 3, true),
('Career Guidance', 'career-guidance', 'Career advice and job market insights', 'BLOG', 4, true),
('Success Stories', 'success-stories', 'Stories from scholarship recipients', 'BLOG', 5, true),
('Announcements', 'announcements', 'Official announcements and updates', 'NEWS', 6, true),
('University News', 'university-news', 'News from universities and institutions', 'NEWS', 7, true),
('Application Tips', 'application-tips', 'Tips for scholarship applications', 'BLOG', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO content.tags (name, slug, description, usage_count) VALUES
('STEM', 'stem', 'Science, Technology, Engineering, Mathematics', 0),
('Arts', 'arts', 'Arts and Humanities', 0),
('Medicine', 'medicine', 'Medical and Healthcare fields', 0),
('Engineering', 'engineering', 'Engineering disciplines', 0),
('Business', 'business', 'Business and Management', 0),
('Law', 'law', 'Legal studies', 0),
('Full Scholarship', 'full-scholarship', 'Fully funded scholarships', 0),
('Partial Scholarship', 'partial-scholarship', 'Partially funded scholarships', 0),
('Undergraduate', 'undergraduate', 'For undergraduate students', 0),
('Postgraduate', 'postgraduate', 'For postgraduate students', 0),
('PhD', 'phd', 'For doctoral students', 0),
('Sri Lanka', 'sri-lanka', 'Related to Sri Lanka', 0),
('International', 'international', 'International opportunities', 0),
('Deadline', 'deadline', 'Deadline related news', 0),
('Tips', 'tips', 'Helpful tips and advice', 0)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
