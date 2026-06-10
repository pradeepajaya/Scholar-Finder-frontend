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
    email VARCHAR(255),
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
    provider_name VARCHAR(255),
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
    min_al_passes INTEGER,
    required_al_stream VARCHAR(100),
    min_z_score DECIMAL(4,3),
    requires_financial_need BOOLEAN DEFAULT FALSE,
    max_household_income VARCHAR(100),
    sports_achievement_required BOOLEAN DEFAULT FALSE,
    leadership_required BOOLEAN DEFAULT FALSE,
    first_generation_priority BOOLEAN DEFAULT FALSE,
    disability_friendly BOOLEAN DEFAULT FALSE,
    return_to_home_required BOOLEAN DEFAULT FALSE,
    
    -- Dates
    application_deadline DATE,
    start_date DATE,
    end_date DATE,
    duration_months INTEGER,
    
    -- Requirements
    required_documents TEXT[],
    additional_requirements TEXT,
    benefits TEXT[],
    selection_criteria TEXT[],
    application_steps TEXT[],
    application_url VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website_url VARCHAR(500),
    image_url VARCHAR(500),
    
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

-- Keep existing local databases aligned when new scholarship detail fields are added.
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS provider_name VARCHAR(255);
ALTER TABLE users.student_profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS min_al_passes INTEGER;
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS required_al_stream VARCHAR(100);
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS min_z_score DECIMAL(4,3);
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS requires_financial_need BOOLEAN DEFAULT FALSE;
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS max_household_income VARCHAR(100);
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS sports_achievement_required BOOLEAN DEFAULT FALSE;
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS leadership_required BOOLEAN DEFAULT FALSE;
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS first_generation_priority BOOLEAN DEFAULT FALSE;
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS disability_friendly BOOLEAN DEFAULT FALSE;
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS return_to_home_required BOOLEAN DEFAULT FALSE;
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS benefits TEXT[];
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS selection_criteria TEXT[];
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS application_steps TEXT[];
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS application_url VARCHAR(500);
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS website_url VARCHAR(500);
ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

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

-- Student profile documents stored by user/student id
CREATE TABLE IF NOT EXISTS scholarships.student_documents (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    document_key VARCHAR(120) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'uploaded',
    file_name VARCHAR(255),
    file_type VARCHAR(255),
    file_size BIGINT,
    file_data BYTEA,
    file_url VARCHAR(1000),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_student_documents_student_key UNIQUE (student_id, document_key)
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
CREATE TABLE IF NOT EXISTS content.blog_post_tags (
    blog_post_id BIGINT NOT NULL REFERENCES content.blog_posts(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES content.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, tag_id)
);

-- Seed content categories
INSERT INTO content.categories (name, slug, description, content_type, display_order, is_active)
VALUES
    ('Scholarship News', 'scholarship-news', 'Announcements and deadlines for scholarships.', 'NEWS', 1, TRUE),
    ('Student Guides', 'student-guides', 'Guides and tips for applicants.', 'BLOG', 2, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Seed news articles
INSERT INTO content.news (
    title,
    slug,
    summary,
    content,
    author_id,
    category_id,
    status,
    views_count,
    published_at,
    created_at,
    updated_at,
    source_url
)
VALUES
    (
        'New Scholarship Opportunities for 2026',
        'new-scholarship-opportunities-for-2026',
        'A roundup of new scholarships opening in 2026 with key deadlines and eligibility.',
        'This update highlights new scholarship opportunities for local and international students. It includes application windows, required documents, and official announcement links. Review eligibility carefully and submit early.',
        1,
        (SELECT id FROM content.categories WHERE slug = 'scholarship-news'),
        'PUBLISHED',
        1245,
        '2026-01-15 09:00:00',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'https://example.com/docs/scholarship-opportunities-2026.pdf'
    ),
    (
        'Upcoming Scholarship Deadlines',
        'upcoming-scholarship-deadlines',
        'Draft list of upcoming scholarship deadlines for the next quarter.',
        'This draft compiles upcoming deadlines by region and field of study. Verify dates against official sources before publishing.',
        1,
        (SELECT id FROM content.categories WHERE slug = 'scholarship-news'),
        'DRAFT',
        0,
        NULL,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        NULL
    )
ON CONFLICT (slug) DO NOTHING;

-- Seed blog posts
INSERT INTO content.blog_posts (
    title,
    slug,
    excerpt,
    content,
    author_id,
    category_id,
    status,
    views_count,
    reading_time_minutes,
    published_at,
    created_at,
    updated_at
)
VALUES
    (
        'How to Write a Winning Scholarship Application',
        'how-to-write-a-winning-scholarship-application',
        'Practical tips for writing personal statements, organizing documents, and meeting deadlines.',
        'Strong applications focus on clarity, evidence, and alignment with scholarship goals. This guide covers structuring a personal statement, collecting recommendations, and avoiding common mistakes.',
        1,
        (SELECT id FROM content.categories WHERE slug = 'student-guides'),
        'PUBLISHED',
        987,
        4,
        '2026-01-12 09:00:00',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Tips for A/L Students Seeking Higher Education',
        'tips-for-al-students-seeking-higher-education',
        'Planning advice for A/L students preparing applications and selecting programs.',
        'Start early by mapping application calendars, shortlisting programs, and preparing documents. Keep a checklist of transcripts, exam results, and ID documents.',
        1,
        (SELECT id FROM content.categories WHERE slug = 'student-guides'),
        'PUBLISHED',
        1532,
        5,
        '2026-01-10 09:00:00',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (slug) DO NOTHING;

-- Testimonials table
CREATE TABLE IF NOT EXISTS content.testimonials (
    id BIGSERIAL PRIMARY KEY,
    scholar_name VARCHAR(255), -- NULL for anonymous
    scholarship_name VARCHAR(255) NOT NULL,
    year_completed INT,
    field_of_study VARCHAR(255),
    university VARCHAR(255),
    testimonial_text TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    is_anonymous BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'PUBLISHED', -- PUBLISHED, DRAFT, ARCHIVED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed testimonials data (90% anonymous)
INSERT INTO content.testimonials (scholar_name, scholarship_name, year_completed, field_of_study, university, testimonial_text, rating, is_anonymous, is_featured, status)
VALUES
    (NULL, 'Commonwealth Master''s Scholarship', 2023, 'Computer Science', 'University of Cambridge', 'The Commonwealth Scholarship opened doors I never imagined. It wasn''t just about the education - it was about the network, the exposure, and the confidence to pursue my dreams. The financial support allowed me to focus on my studies without worrying about expenses.', 5, TRUE, TRUE, 'PUBLISHED'),
    ('Nimali Perera', 'Commonwealth Master''s Scholarship', 2023, 'Computer Science', 'University of Cambridge', 'Now working as an AI Research Scientist, I credit my scholarship for giving me the global perspective and technical foundation needed for this career. The experience changed my life trajectory.', 5, FALSE, TRUE, 'PUBLISHED'),
    (NULL, 'Australia Awards Scholarship', 2022, 'Environmental Engineering', 'University of Melbourne', 'Coming back to Sri Lanka after my Master''s was empowering. I immediately applied the knowledge to environmental projects and saw tangible improvements. The scholarship wasn''t just an investment in me, it was an investment in my country.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Fulbright Scholarship', 2024, 'Public Health', 'Johns Hopkins University', 'The rigorous coursework pushed me beyond what I thought was possible. Professors actually knew my name and invited me to research projects. This level of mentorship is rare and invaluable.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'DAAD Scholarship', 2023, 'Mechanical Engineering', 'Technical University of Munich', 'German engineering education is world-class. The hands-on laboratory experience and industry connections opened doors I didn''t expect. I networked with professionals who now reference my work.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Chevening Scholarship', 2021, 'International Relations', 'London School of Economics', 'LSE alumni network is extraordinary. The scholarship enabled me to build connections with professionals from over 50 countries. These relationships continue to shape my career decisions.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Japan MEXT Scholarship', 2022, 'Engineering', 'University of Tokyo', 'Living in Japan and studying in English-taught programs gave me cultural competence alongside technical skills. The scholarship covered everything - tuition, accommodation, and living expenses. I graduated debt-free.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Erasmus Mundus Scholarship', 2023, 'Environmental Science', 'Multiple European Universities', 'The opportunity to study in multiple countries within one program was transformative. I learned different approaches to sustainability from leading institutions across Europe.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'New Zealand Development Scholarship', 2021, 'Agribusiness', 'Lincoln University', 'The practical focus of New Zealand education suited me better than theory alone. I implemented what I learned on my family''s farm with immediate results. Crop yields improved by 30% using new techniques.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Canadian ELAP Scholarship', 2024, 'Business Administration', 'University of British Columbia', 'The collaborative learning environment in Canada helped me develop teamwork skills essential for my current role. The country''s multiculturalism prepared me for global business challenges.', 4, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Singapore ASEAN Scholarship', 2022, 'Information Technology', 'Nanyang Technological University', 'NTU''s strong industry partnerships meant I was networking with tech leaders from day one. The scholarship fast-tracked my entry into the tech industry by years.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Korean Government Scholarship', 2023, 'Korean Studies', 'Seoul National University', 'Understanding Korean language and culture opened unique career paths. The country''s innovation ecosystem exposed me to cutting-edge technologies and startups. I''m now working in tech transfer.', 4, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Swiss Government Scholarship', 2021, 'Biotechnology', 'ETH Zurich', 'Swiss precision in research and education is unmatched. The laboratory equipment and research facilities exceeded anything I''d worked with. The scholarship enabled groundbreaking research during my thesis.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Portuguese Government Scholarship', 2022, 'Architecture', 'University of Lisbon', 'Portugal''s historic architecture combined with modern education gave me a unique perspective. I learned restoration techniques applicable to heritage buildings in South Asia. Now consulting on conservation projects.', 4, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Czech Republic Scholarship', 2023, 'Automotive Engineering', 'Czech Technical University', 'The Czech auto industry is thriving, and studying there connected me directly with manufacturers. I received job offers before graduation from companies impressed with my thesis work.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Belgium Scholarship', 2024, 'Human Rights Law', 'Vrije Universiteit Brussel', 'Belgium''s central location in Europe meant I could attend seminars and conferences across the continent. My network now spans European institutions, enhancing my advocacy work significantly.', 4, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Denmark Government Scholarship', 2022, 'Renewable Energy', 'Aarhus University', 'Denmark is the renewable energy leader. Studying sustainability in a country living it daily made the knowledge real and actionable. I returned ready to transform my organization''s energy strategy.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Netherlands Scholarship', 2023, 'Water Resources Management', 'TU Delft', 'The Netherlands'' water management expertise is world-renowned. The research opportunities and practical projects gave me solutions I now implement in water scarcity regions. Every skill learned has direct application.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Norway NORAD Scholarship', 2021, 'Marine Biology', 'University of Bergen', 'Studying marine biology in Norway meant Arctic research opportunities. The hands-on fieldwork and access to cutting-edge research vessels elevated my research quality. Publications came from undergraduate work.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'French Government Scholarship', 2024, 'Philosophy & Arts', 'Sorbonne University', 'The intellectual discourse and cultural immersion in Paris transformed my thinking. I''m now working in cultural diplomacy, leveraging insights gained through deep engagement with European philosophy and arts history.', 4, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Greece Scholarship', 2022, 'Classics & Ancient History', 'University of Athens', 'Studying classics where the culture actually originated provided irreplaceable context. Museums became classrooms. I''m documenting heritage sites for preservation initiatives back home.', 4, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Germany DAAD (Engineering)', 2023, 'Civil Engineering', 'Technische Universität Berlin', 'The engineering standards and infrastructure knowledge in Germany directly translated to infrastructure project improvements. I lead design reviews applying German efficiency principles.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Austria Scholarship', 2024, 'Music & Technology', 'University of Music and Performing Arts Vienna', 'The intersection of music and technology in Vienna offered unique innovation pathways. I''m developing music technology solutions informed by classical training and digital expertise.', 4, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Taiwan Scholarship', 2021, 'Electronics & Semiconductors', 'National Taiwan University', 'Taiwan''s semiconductor industry is unparalleled. Interning at leading fabs during my studies, I learned manufacturing processes at the highest level. Three job offers upon graduation.', 5, TRUE, FALSE, 'PUBLISHED'),
    (NULL, 'Malaysia PETRONAS Scholarship', 2022, 'Petroleum Engineering', 'Universiti Teknologi PETRONAS', 'The industry-integrated education meant immediate relevance to current challenges. I was solving real company problems as coursework. Job secured before graduation.', 5, TRUE, FALSE, 'PUBLISHED')
ON CONFLICT DO NOTHING;

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
CREATE INDEX IF NOT EXISTS idx_student_documents_student_id ON scholarships.student_documents(student_id);

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

-- =====================================================
-- ADDITIONAL INSTITUTION USERS (seed data)
-- Passwords are hashed using pgcrypto's crypt() with bcrypt
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO auth.users (email, password, role, is_active, is_verified)
VALUES
    ('colombo@uoc.lk', crypt('uoc', gen_salt('bf')), 'INSTITUTION', true, true),
    ('peradeniya@pdn.ac.lk', crypt('pdn', gen_salt('bf')), 'INSTITUTION', true, true),
    ('moratuwa@uom.lk', crypt('uom', gen_salt('bf')), 'INSTITUTION', true, true),
    ('kelaniya@kln.ac.lk', crypt('kln', gen_salt('bf')), 'INSTITUTION', true, true),
    ('jayewardenepura@sjp.ac.lk', crypt('sjp', gen_salt('bf')), 'INSTITUTION', true, true),
    ('ruhuna@ruh.ac.lk', crypt('ruh', gen_salt('bf')), 'INSTITUTION', true, true),
    ('openuni@ou.ac.lk', crypt('ou', gen_salt('bf')), 'INSTITUTION', true, true),
    ('nsbm@nsbm.lk', crypt('nsbm', gen_salt('bf')), 'INSTITUTION', true, true),
    ('iit@iit.ac.lk', crypt('iit', gen_salt('bf')), 'INSTITUTION', true, true)
ON CONFLICT (email) DO NOTHING;

-- Create institution profiles for seeded institution users
INSERT INTO users.institution_profiles (user_id, institution_name, institution_type, country, is_verified)
SELECT id, 'University of Colombo', 'University', 'Sri Lanka', true FROM auth.users WHERE email = 'colombo@uoc.lk'
ON CONFLICT DO NOTHING;

INSERT INTO users.institution_profiles (user_id, institution_name, institution_type, country, is_verified)
SELECT id, 'University of Peradeniya', 'University', 'Sri Lanka', true FROM auth.users WHERE email = 'peradeniya@pdn.ac.lk'
ON CONFLICT DO NOTHING;

INSERT INTO users.institution_profiles (user_id, institution_name, institution_type, country, is_verified)
SELECT id, 'University of Moratuwa', 'University', 'Sri Lanka', true FROM auth.users WHERE email = 'moratuwa@uom.lk'
ON CONFLICT DO NOTHING;

INSERT INTO users.institution_profiles (user_id, institution_name, institution_type, country, is_verified)
SELECT id, 'University of Kelaniya', 'University', 'Sri Lanka', true FROM auth.users WHERE email = 'kelaniya@kln.ac.lk'
ON CONFLICT DO NOTHING;

INSERT INTO users.institution_profiles (user_id, institution_name, institution_type, country, is_verified)
SELECT id, 'University of Jayewardenepura', 'University', 'Sri Lanka', true FROM auth.users WHERE email = 'jayewardenepura@sjp.ac.lk'
ON CONFLICT DO NOTHING;

INSERT INTO users.institution_profiles (user_id, institution_name, institution_type, country, is_verified)
SELECT id, 'University of Ruhuna', 'University', 'Sri Lanka', true FROM auth.users WHERE email = 'ruhuna@ruh.ac.lk'
ON CONFLICT DO NOTHING;

INSERT INTO users.institution_profiles (user_id, institution_name, institution_type, country, is_verified)
SELECT id, 'Open University', 'University', 'Sri Lanka', true FROM auth.users WHERE email = 'openuni@ou.ac.lk'
ON CONFLICT DO NOTHING;

INSERT INTO users.institution_profiles (user_id, institution_name, institution_type, country, is_verified)
SELECT id, 'NSBM Green University', 'University', 'Sri Lanka', true FROM auth.users WHERE email = 'nsbm@nsbm.lk'
ON CONFLICT DO NOTHING;

INSERT INTO users.institution_profiles (user_id, institution_name, institution_type, country, is_verified)
SELECT id, 'Institute of Information Technology', 'Institute', 'Sri Lanka', true FROM auth.users WHERE email = 'iit@iit.ac.lk'
ON CONFLICT DO NOTHING;

-- =====================================================
-- ADDITIONAL SEED: Scholarships, applications, saved bookmarks
-- =====================================================

-- Seed example scholarships (use title uniqueness check to avoid duplicates)
INSERT INTO scholarships.scholarships (
    institution_id, title, description, scholarship_type, amount, currency,
    eligible_countries, eligible_fields, eligible_levels, application_deadline,
    start_date, end_date, required_documents, status, created_at, updated_at
)
SELECT
    (SELECT id FROM users.institution_profiles WHERE institution_name = 'University of Colombo'),
    'Colombo Excellence Scholarship',
    'Merit-based scholarship for top-performing undergraduates at University of Colombo.',
    'Full', 5000.00, 'USD', ARRAY['Sri Lanka'], ARRAY['Computer Science','Engineering'], ARRAY['Undergraduate'],
    '2026-07-31', '2026-09-01', '2029-08-31', ARRAY['Transcript','Personal Statement','Recommendation Letters'],
    'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM scholarships.scholarships WHERE title = 'Colombo Excellence Scholarship');

INSERT INTO scholarships.scholarships (
    institution_id, title, description, scholarship_type, amount, currency,
    eligible_countries, eligible_fields, eligible_levels, application_deadline,
    start_date, end_date, required_documents, status, created_at, updated_at
)
SELECT
    (SELECT id FROM users.institution_profiles WHERE institution_name = 'University of Peradeniya'),
    'Peradeniya Research Fellowship',
    'Funding for postgraduate research students in STEM fields.',
    'Partial', 3000.00, 'USD', ARRAY['Sri Lanka','International'], ARRAY['Science','Engineering','Medicine'], ARRAY['Postgraduate'],
    '2026-08-15', '2026-10-01', '2028-09-30', ARRAY['Research Proposal','CV','Supervisor Letter'],
    'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM scholarships.scholarships WHERE title = 'Peradeniya Research Fellowship');

-- Normalize scholarship metadata for matching
UPDATE scholarships.scholarships
SET scholarship_type = 'FULL',
    eligible_levels = ARRAY['UNDERGRADUATE'],
    eligible_fields = ARRAY['Engineering','IT & Computer Science'],
    min_gpa = 3.20,
    min_z_score = 1.400,
    min_al_passes = 3,
    required_al_stream = 'SCIENCE',
    leadership_required = true,
    status = 'ACTIVE',
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Colombo Excellence Scholarship';

UPDATE scholarships.scholarships
SET scholarship_type = 'PARTIAL',
    eligible_levels = ARRAY['POSTGRADUATE'],
    eligible_fields = ARRAY['Engineering','Natural Sciences','Medicine'],
    min_gpa = 3.00,
    min_z_score = 1.000,
    required_al_stream = 'SCIENCE',
    required_english_test = 'IELTS',
    min_english_score = 6.50,
    return_to_home_required = true,
    status = 'ACTIVE',
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Peradeniya Research Fellowship';

-- Additional scholarships for matching
INSERT INTO scholarships.scholarships (
    institution_id, title, description, scholarship_type, amount, currency,
    eligible_countries, eligible_fields, eligible_levels, min_gpa, min_age, max_age,
    min_al_passes, required_al_stream, min_z_score, leadership_required,
    application_deadline, start_date, end_date, required_documents, status,
    created_at, updated_at
)
SELECT
    (SELECT id FROM users.institution_profiles WHERE institution_name = 'University of Moratuwa'),
    'Moratuwa Tech Innovators Scholarship',
    'Full scholarship for outstanding undergraduates in engineering and computing.',
    'FULL', 4000.00, 'USD', ARRAY['Sri Lanka'],
    ARRAY['Engineering','IT & Computer Science'], ARRAY['UNDERGRADUATE'],
    3.00, 18, 30, 3, 'SCIENCE', 1.200, true,
    '2026-08-20', '2026-09-15', '2030-06-30',
    ARRAY['Transcript','Personal Statement','Recommendation Letters'],
    'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM scholarships.scholarships WHERE title = 'Moratuwa Tech Innovators Scholarship');

INSERT INTO scholarships.scholarships (
    institution_id, title, description, scholarship_type, amount, currency,
    eligible_countries, eligible_fields, eligible_levels, min_gpa,
    requires_financial_need, max_household_income, leadership_required,
    application_deadline, start_date, end_date, required_documents, status,
    created_at, updated_at
)
SELECT
    (SELECT id FROM users.institution_profiles WHERE institution_name = 'NSBM Green University'),
    'NSBM Future Leaders Scholarship',
    'Partial funding for high-potential business and IT undergraduates with leadership experience.',
    'PARTIAL', 2500.00, 'USD', ARRAY['Sri Lanka'],
    ARRAY['Business & Management','IT & Computer Science'], ARRAY['UNDERGRADUATE'],
    2.80, true, '100,000-200,000', true,
    '2026-09-15', '2026-10-01', '2029-09-30',
    ARRAY['Transcript','Leadership Portfolio'],
    'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM scholarships.scholarships WHERE title = 'NSBM Future Leaders Scholarship');

INSERT INTO scholarships.scholarships (
    institution_id, title, description, scholarship_type, coverage_percentage, currency,
    eligible_countries, eligible_fields, eligible_levels, min_age, max_age,
    requires_financial_need, max_household_income,
    application_deadline, start_date, end_date, required_documents, status,
    created_at, updated_at
)
SELECT
    (SELECT id FROM users.institution_profiles WHERE institution_name = 'Open University'),
    'Open University Distance Learning Grant',
    'Tuition support for undergraduates pursuing distance learning.',
    'TUITION', 50, 'USD', ARRAY['Sri Lanka'],
    ARRAY['Education','Social Sciences'], ARRAY['UNDERGRADUATE'],
    20, 45, true, '50,000-100,000',
    '2026-10-01', '2026-11-01', '2029-10-31',
    ARRAY['Transcript','Income Verification'],
    'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM scholarships.scholarships WHERE title = 'Open University Distance Learning Grant');

INSERT INTO scholarships.scholarships (
    institution_id, title, description, scholarship_type, amount, currency,
    eligible_countries, eligible_fields, eligible_levels, min_gpa,
    required_english_test, min_english_score, min_al_passes, required_al_stream, min_z_score,
    application_deadline, start_date, end_date, required_documents, status,
    created_at, updated_at
)
SELECT
    (SELECT id FROM users.institution_profiles WHERE institution_name = 'Institute of Information Technology'),
    'IIT Tech Talent Scholarship',
    'Merit-based scholarship for talented computing students.',
    'PARTIAL', 3000.00, 'USD', ARRAY['Sri Lanka'],
    ARRAY['IT & Computer Science'], ARRAY['UNDERGRADUATE'],
    3.00, 'IELTS', 6.00, 3, 'SCIENCE', 1.100,
    '2026-08-31', '2026-09-20', '2029-08-31',
    ARRAY['Transcript','Personal Statement'],
    'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM scholarships.scholarships WHERE title = 'IIT Tech Talent Scholarship');

INSERT INTO scholarships.scholarships (
    institution_id, title, description, scholarship_type, amount, currency,
    eligible_countries, eligible_fields, eligible_levels, min_gpa,
    required_english_test, min_english_score, return_to_home_required,
    application_deadline, start_date, end_date, required_documents, status,
    created_at, updated_at
)
SELECT
    (SELECT id FROM users.institution_profiles WHERE institution_name = 'University of Colombo'),
    'Sri Lanka Postgraduate Research Scholarship',
    'Fully funded research scholarship for postgraduate STEM students.',
    'FULL', 6000.00, 'USD', ARRAY['Sri Lanka'],
    ARRAY['Natural Sciences','Engineering','Medicine'], ARRAY['POSTGRADUATE'],
    3.20, 'IELTS', 6.50, true,
    '2026-11-15', '2027-01-10', '2030-12-31',
    ARRAY['Research Proposal','Transcript','Recommendation Letters'],
    'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM scholarships.scholarships WHERE title = 'Sri Lanka Postgraduate Research Scholarship');

-- Comprehensive details used by the public scholarship detail view.
UPDATE scholarships.scholarships
SET provider_name = 'University of Colombo',
    description = 'A flagship merit scholarship for high-performing Sri Lankan undergraduates entering University of Colombo programmes in computing, engineering, and related technology disciplines.',
    benefits = ARRAY['USD 5,000 annual tuition support','Priority access to academic mentoring','Career guidance through University of Colombo industry partners','Recognition at the annual scholarship awards ceremony'],
    selection_criteria = ARRAY['Academic excellence in A/L or equivalent qualifications','Strong personal statement with clear study goals','Leadership contribution in school or community activities','Preference for applicants with computing or engineering interests'],
    application_steps = ARRAY['Create or update your Scholar-Finder student profile','Prepare transcripts, personal statement, and recommendation letters','Submit the online application before the deadline','Shortlisted applicants may be invited for an interview'],
    additional_requirements = 'Applicants should maintain good academic standing each year. Renewal is reviewed annually based on progress, conduct, and continued enrolment.',
    application_url = 'https://cmb.ac.lk/scholarships/colombo-excellence',
    website_url = 'https://cmb.ac.lk',
    contact_email = 'colombo@uoc.lk',
    contact_phone = '+94 11 2581835',
    image_url = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Colombo Excellence Scholarship';

UPDATE scholarships.scholarships
SET provider_name = 'University of Peradeniya',
    description = 'A postgraduate research fellowship supporting STEM researchers with strong academic records, viable research proposals, and supervisor alignment.',
    benefits = ARRAY['USD 3,000 research grant','Access to laboratory and library resources','Supervisor-supported research planning','Conference and publication guidance'],
    selection_criteria = ARRAY['Quality and feasibility of the research proposal','Academic record and research readiness','Alignment with priority STEM research areas','Availability of an appropriate academic supervisor'],
    application_steps = ARRAY['Identify a proposed supervisor or research unit','Prepare a research proposal and CV','Upload transcripts and supervisor letter','Attend technical review if shortlisted'],
    additional_requirements = 'Applicants should be prepared to submit periodic research progress reports and follow university research ethics requirements.',
    application_url = 'https://www.pdn.ac.lk/research/fellowships',
    website_url = 'https://www.pdn.ac.lk',
    contact_email = 'registrar@pdn.ac.lk',
    contact_phone = '+94 81 2392000',
    image_url = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200',
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Peradeniya Research Fellowship';

UPDATE scholarships.scholarships
SET provider_name = 'University of Moratuwa',
    benefits = ARRAY['Full tuition support','Innovation project mentoring','Access to engineering labs and maker spaces','Networking with technology industry partners'],
    selection_criteria = ARRAY['Outstanding STEM academic performance','Evidence of innovation, competitions, or technical projects','Leadership potential','Clear motivation for engineering or computing study'],
    application_steps = ARRAY['Submit academic transcript and personal statement','Attach evidence of technical projects or competitions','Complete scholarship screening through Scholar-Finder','Attend final panel interview if shortlisted'],
    additional_requirements = 'Recipients are expected to participate in innovation showcases and maintain satisfactory academic progress.',
    application_url = 'https://uom.lk/scholarships/tech-innovators',
    website_url = 'https://uom.lk',
    contact_email = 'scholarships@uom.lk',
    image_url = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Moratuwa Tech Innovators Scholarship';

UPDATE scholarships.scholarships
SET provider_name = 'NSBM Green University',
    benefits = ARRAY['Partial tuition funding','Leadership development workshops','Career mentoring and employability support','Access to student enterprise activities'],
    selection_criteria = ARRAY['Academic record and financial need','Leadership experience in school, clubs, or community','Commitment to business, management, or IT study','Quality of leadership portfolio'],
    application_steps = ARRAY['Prepare transcript and leadership portfolio','Submit income or financial need evidence','Complete online application','Participate in leadership interview if shortlisted'],
    additional_requirements = 'Recipients may be asked to contribute to student leadership initiatives during the award period.',
    application_url = 'https://www.nsbm.ac.lk/scholarships/future-leaders',
    website_url = 'https://www.nsbm.ac.lk',
    contact_email = 'scholarships@nsbm.ac.lk',
    image_url = 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1200',
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'NSBM Future Leaders Scholarship';

UPDATE scholarships.scholarships
SET provider_name = 'Open University',
    benefits = ARRAY['50% tuition support','Flexible distance-learning support','Academic advising for working students','Access to online learning resources'],
    selection_criteria = ARRAY['Demonstrated financial need','Commitment to distance or part-time learning','Academic readiness for undergraduate study','Potential benefit to local community'],
    application_steps = ARRAY['Submit transcript and income verification','Confirm intended distance-learning programme','Complete Scholar-Finder application','Respond to verification requests if needed'],
    additional_requirements = 'Applicants should be able to continue coursework through online or blended delivery.',
    application_url = 'https://ou.ac.lk/scholarships/distance-learning-grant',
    website_url = 'https://ou.ac.lk',
    contact_email = 'studentaffairs@ou.ac.lk',
    image_url = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200',
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Open University Distance Learning Grant';

UPDATE scholarships.scholarships
SET provider_name = 'Institute of Information Technology',
    benefits = ARRAY['USD 3,000 tuition assistance','Technical mentoring','Access to computing labs and career events','Priority consideration for internship referrals'],
    selection_criteria = ARRAY['Strong computing aptitude','Academic record in science or technology subjects','English readiness','Motivation for software, data, or cybersecurity careers'],
    application_steps = ARRAY['Upload transcript and personal statement','Include portfolio, GitHub, or project links if available','Complete English readiness review','Attend technical interview if shortlisted'],
    additional_requirements = 'Applicants with demonstrable coding projects, hackathon participation, or ICT achievements receive additional consideration.',
    application_url = 'https://www.iit.ac.lk/scholarships/tech-talent',
    website_url = 'https://www.iit.ac.lk',
    contact_email = 'scholarships@iit.ac.lk',
    image_url = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'IIT Tech Talent Scholarship';

UPDATE scholarships.scholarships
SET provider_name = 'University of Colombo',
    benefits = ARRAY['Full postgraduate tuition funding','Research stipend support','Supervisor-led research mentorship','Support for thesis preparation and dissemination'],
    selection_criteria = ARRAY['Strong postgraduate academic record','High-quality STEM research proposal','English proficiency suitable for research work','Commitment to applying research outcomes in Sri Lanka'],
    application_steps = ARRAY['Prepare research proposal, transcript, and recommendation letters','Confirm intended postgraduate programme and supervisor fit','Submit the online application','Complete research review and interview if shortlisted'],
    additional_requirements = 'Recipients should submit progress reports and may be asked to present research outcomes at university forums.',
    application_url = 'https://cmb.ac.lk/scholarships/postgraduate-research',
    website_url = 'https://cmb.ac.lk',
    contact_email = 'colombo@uoc.lk',
    contact_phone = '+94 11 2581835',
    image_url = 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200',
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Sri Lanka Postgraduate Research Scholarship';

-- Backfill selection criteria and application steps for institution-entered scholarships.
UPDATE scholarships.scholarships
SET selection_criteria = ARRAY[
        CASE
            WHEN scholarship_type = 'FULL' THEN 'Exceptional academic merit and evidence of readiness for fully funded support'
            WHEN scholarship_type = 'TUITION' THEN 'Academic record and suitability for tuition support'
            WHEN requires_financial_need IS TRUE THEN 'Verified financial need and ability to continue the programme'
            ELSE 'Academic record and readiness for the intended programme'
        END,
        CASE
            WHEN eligible_fields IS NOT NULL AND cardinality(eligible_fields) > 0
                THEN 'Strong fit with eligible field(s): ' || array_to_string(eligible_fields, ', ')
            ELSE 'Clear alignment with the scholarship objectives'
        END,
        CASE
            WHEN leadership_required IS TRUE THEN 'Leadership experience in school, university, work, or community activities'
            WHEN sports_achievement_required IS TRUE THEN 'Recognised sports achievement and evidence of continued commitment'
            WHEN first_generation_priority IS TRUE THEN 'Priority consideration for first-generation university learners'
            ELSE 'Quality of personal statement, proposal, portfolio, or supporting documents'
        END,
        CASE
            WHEN additional_requirements IS NOT NULL AND additional_requirements <> ''
                THEN additional_requirements
            ELSE 'Complete application submitted before the deadline with accurate supporting information'
        END
    ]::TEXT[],
    updated_at = CURRENT_TIMESTAMP
WHERE selection_criteria IS NULL OR cardinality(selection_criteria) = 0;

UPDATE scholarships.scholarships
SET application_steps = ARRAY[
        'Review eligibility, deadline, and award conditions for ' || title,
        CASE
            WHEN required_documents IS NOT NULL AND cardinality(required_documents) > 0
                THEN 'Prepare required documents: ' || array_to_string(required_documents, ', ')
            ELSE 'Prepare transcripts, personal statement, and relevant supporting documents'
        END,
        CASE
            WHEN application_url IS NOT NULL AND application_url <> ''
                THEN 'Submit the application through the provider link before the deadline'
            ELSE 'Submit the application through Scholar-Finder or the provider office before the deadline'
        END,
        'Monitor email for verification requests, interviews, review outcomes, or final award notifications'
    ]::TEXT[],
    updated_at = CURRENT_TIMESTAMP
WHERE application_steps IS NULL OR cardinality(application_steps) = 0;

-- Seed sample applications for the test student
INSERT INTO scholarships.applications (
    scholarship_id, student_id, status, cover_letter, documents, created_at, updated_at
)
SELECT
    (SELECT id FROM scholarships.scholarships WHERE title = 'Colombo Excellence Scholarship'),
    (SELECT id FROM auth.users WHERE email = 'student@scholarfinder.lk'),
    'SUBMITTED',
    'I am applying for the Colombo Excellence Scholarship because I have strong academic results and leadership experience.',
    '{"transcript":"https://example.com/docs/transcript.pdf","sop":"https://example.com/docs/sop.pdf"}',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM scholarships.applications a
    WHERE a.scholarship_id = (SELECT id FROM scholarships.scholarships WHERE title = 'Colombo Excellence Scholarship')
      AND a.student_id = (SELECT id FROM auth.users WHERE email = 'student@scholarfinder.lk')
);

INSERT INTO scholarships.applications (
    scholarship_id, student_id, status, cover_letter, documents, created_at, updated_at
)
SELECT
    (SELECT id FROM scholarships.scholarships WHERE title = 'Peradeniya Research Fellowship'),
    (SELECT id FROM auth.users WHERE email = 'student@scholarfinder.lk'),
    'SUBMITTED',
    'My proposed research aligns with the fellowship objectives and supervisor availability.',
    '{"research_proposal":"https://example.com/docs/proposal.pdf"}',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM scholarships.applications a
    WHERE a.scholarship_id = (SELECT id FROM scholarships.scholarships WHERE title = 'Peradeniya Research Fellowship')
      AND a.student_id = (SELECT id FROM auth.users WHERE email = 'student@scholarfinder.lk')
);

-- Seed a saved scholarship (bookmark)
INSERT INTO scholarships.saved_scholarships (student_id, scholarship_id, created_at)
SELECT
    (SELECT id FROM auth.users WHERE email = 'student@scholarfinder.lk'),
    (SELECT id FROM scholarships.scholarships WHERE title = 'Colombo Excellence Scholarship'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM scholarships.saved_scholarships s
    WHERE s.student_id = (SELECT id FROM auth.users WHERE email = 'student@scholarfinder.lk')
      AND s.scholarship_id = (SELECT id FROM scholarships.scholarships WHERE title = 'Colombo Excellence Scholarship')
)
ON CONFLICT (student_id, scholarship_id) DO NOTHING;

COMMIT;

-- =====================================================
-- ADDITIONAL SAMPLE STUDENTS
-- =====================================================

-- Seed student users (bcrypt via pgcrypto)
INSERT INTO auth.users (email, password, role, is_active, is_verified)
VALUES
        ('alice@scholarfinder.lk', crypt('alice123', gen_salt('bf')), 'STUDENT', true, true),
        ('bob@scholarfinder.lk', crypt('bob123', gen_salt('bf')), 'STUDENT', true, true),
        ('charlie@scholarfinder.lk', crypt('charlie123', gen_salt('bf')), 'STUDENT', true, true),
        ('dana@scholarfinder.lk', crypt('dana123', gen_salt('bf')), 'STUDENT', true, true),
        ('eric@scholarfinder.lk', crypt('eric123', gen_salt('bf')), 'STUDENT', true, true)
ON CONFLICT (email) DO NOTHING;

-- Seed corresponding student profiles (idempotent)
INSERT INTO users.student_profiles (user_id, full_name, nationality, district, province, mobile, highest_education, intended_level)
SELECT u.id, 'Alice Perera', 'Sri Lankan', 'Galle', 'Southern', '0711111111', 'A/L', 'Undergraduate'
FROM auth.users u
WHERE u.email = 'alice@scholarfinder.lk'
    AND NOT EXISTS (SELECT 1 FROM users.student_profiles sp WHERE sp.user_id = u.id);

INSERT INTO users.student_profiles (user_id, full_name, nationality, district, province, mobile, highest_education, intended_level)
SELECT u.id, 'Bob Fernando', 'Sri Lankan', 'Kandy', 'Central', '0712222222', 'A/L', 'Undergraduate'
FROM auth.users u
WHERE u.email = 'bob@scholarfinder.lk'
    AND NOT EXISTS (SELECT 1 FROM users.student_profiles sp WHERE sp.user_id = u.id);

INSERT INTO users.student_profiles (user_id, full_name, nationality, district, province, mobile, highest_education, intended_level)
SELECT u.id, 'Charlie Silva', 'Sri Lankan', 'Colombo', 'Western', '0713333333', 'Diploma', 'Undergraduate'
FROM auth.users u
WHERE u.email = 'charlie@scholarfinder.lk'
    AND NOT EXISTS (SELECT 1 FROM users.student_profiles sp WHERE sp.user_id = u.id);

INSERT INTO users.student_profiles (user_id, full_name, nationality, district, province, mobile, highest_education, intended_level)
SELECT u.id, 'Dana Kumari', 'Sri Lankan', 'Jaffna', 'Northern', '0714444444', 'A/L', 'Postgraduate'
FROM auth.users u
WHERE u.email = 'dana@scholarfinder.lk'
    AND NOT EXISTS (SELECT 1 FROM users.student_profiles sp WHERE sp.user_id = u.id);

INSERT INTO users.student_profiles (user_id, full_name, nationality, district, province, mobile, highest_education, intended_level)
SELECT u.id, 'Eric Jayasuriya', 'Sri Lankan', 'Matara', 'Southern', '0715555555', 'A/L', 'Undergraduate'
FROM auth.users u
WHERE u.email = 'eric@scholarfinder.lk'
    AND NOT EXISTS (SELECT 1 FROM users.student_profiles sp WHERE sp.user_id = u.id);

-- Enrich sample student profiles for matching
UPDATE users.student_profiles
SET date_of_birth = '2004-05-12',
    gender = 'Male',
    city = 'Colombo',
    highest_education = 'A/L',
    current_status = 'A/L Student',
    intended_level = 'UNDERGRADUATE',
    intended_year = '2026',
    preferred_mode = 'Full-time',
    preferred_location = 'Sri Lanka',
    al_year = '2023',
    al_stream = 'Science',
    al_medium = 'English',
    subject1 = 'Physics',
    grade1 = 'A',
    subject2 = 'Chemistry',
    grade2 = 'B',
    subject3 = 'Mathematics',
    grade3 = 'A',
    z_score = 1.523,
    english_test = 'IELTS',
    overall_score = '7.0',
    exam_year = '2024',
    household_income = '50,000-100,000',
    dependents = 4,
    employment_status = 'Student',
    government_assistance = 'No',
    leadership = 'Yes',
    sports = 'No',
    first_generation = 'Yes',
    disability = 'No',
    preferred_countries = ARRAY['Sri Lanka','Australia','United Kingdom'],
    preferred_fields = ARRAY['Engineering','IT & Computer Science'],
    scholarship_type = 'FULL',
    willing_to_return = 'Yes',
    profile_completion_percentage = 85,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'student@scholarfinder.lk');

UPDATE users.student_profiles
SET date_of_birth = '2003-09-18',
    current_status = 'A/L Student',
    intended_level = 'UNDERGRADUATE',
    al_stream = 'Science',
    grade1 = 'A',
    grade2 = 'B',
    grade3 = 'A',
    z_score = 1.320,
    english_test = 'IELTS',
    overall_score = '6.5',
    household_income = 'Below 50,000',
    leadership = 'Yes',
    first_generation = 'Yes',
    preferred_fields = ARRAY['Engineering','IT & Computer Science'],
    profile_completion_percentage = 78,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'alice@scholarfinder.lk');

UPDATE users.student_profiles
SET date_of_birth = '2004-02-05',
    current_status = 'Undergraduate',
    intended_level = 'UNDERGRADUATE',
    al_stream = 'Commerce',
    grade1 = 'B',
    grade2 = 'B',
    grade3 = 'C',
    z_score = 1.050,
    household_income = '100,000-200,000',
    sports = 'Yes',
    preferred_fields = ARRAY['Business & Management'],
    profile_completion_percentage = 65,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'bob@scholarfinder.lk');

UPDATE users.student_profiles
SET date_of_birth = '2002-11-29',
    current_status = 'Graduate',
    intended_level = 'POSTGRADUATE',
    al_stream = 'Science',
    grade1 = 'A',
    grade2 = 'A',
    grade3 = 'B',
    z_score = 1.600,
    english_test = 'IELTS',
    overall_score = '7.5',
    household_income = '50,000-100,000',
    leadership = 'Yes',
    preferred_fields = ARRAY['Natural Sciences','Medicine'],
    profile_completion_percentage = 82,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'dana@scholarfinder.lk');

UPDATE users.student_profiles
SET date_of_birth = '2005-06-14',
    current_status = 'A/L Student',
    intended_level = 'UNDERGRADUATE',
    al_stream = 'Science',
    grade1 = 'B',
    grade2 = 'C',
    grade3 = 'B',
    z_score = 1.010,
    english_test = 'PTE',
    overall_score = '58',
    household_income = 'Below 50,000',
    preferred_fields = ARRAY['Agriculture'],
    profile_completion_percentage = 70,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'eric@scholarfinder.lk');

-- optional: increment profile completion or add sample data for these users if needed

COMMIT;
