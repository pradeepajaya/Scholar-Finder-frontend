-- Realistic student data for admin portal testing.
-- Uses active verified STUDENT accounts as the source of truth and keeps
-- Gmail plus-address aliases already configured for email testing.

WITH student_accounts AS (
    SELECT
        id AS user_id,
        email,
        row_number() OVER (ORDER BY id) AS rn
    FROM auth.users
    WHERE role = 'STUDENT'
      AND is_active = TRUE
      AND is_verified = TRUE
),
locations(idx, district, province, city) AS (
    VALUES
        (1, 'Colombo', 'Western', 'Nugegoda'),
        (2, 'Gampaha', 'Western', 'Wattala'),
        (3, 'Kalutara', 'Western', 'Panadura'),
        (4, 'Kandy', 'Central', 'Peradeniya'),
        (5, 'Matale', 'Central', 'Dambulla'),
        (6, 'Galle', 'Southern', 'Unawatuna'),
        (7, 'Matara', 'Southern', 'Weligama'),
        (8, 'Kurunegala', 'North Western', 'Kuliyapitiya'),
        (9, 'Jaffna', 'Northern', 'Nallur'),
        (10, 'Anuradhapura', 'North Central', 'Mihintale'),
        (11, 'Ratnapura', 'Sabaragamuwa', 'Balangoda'),
        (12, 'Batticaloa', 'Eastern', 'Kattankudy')
),
base_profiles AS (
    SELECT
        a.user_id,
        a.email,
        a.rn,
        (ARRAY[
            'Ayesha Fernando',
            'Naveen Perera',
            'Tharushi Silva',
            'Imesh Jayasinghe',
            'Kavindi Samarasinghe',
            'Dulaj Rathnayake',
            'Dinithi Abeysekara',
            'Ravindu De Silva',
            'Mihiri Wijeratne',
            'Akila Nanayakkara',
            'Chamodi Peris',
            'Sajith Madushanka',
            'Anjali Pathirana',
            'Yasiru Wickramasinghe',
            'Hashini Gunawardena',
            'Keshan Bandara',
            'Sanduni Rajapaksha',
            'Malith Ekanayake',
            'Pramodi Herath',
            'Isuru Karunaratne',
            'Hiruni Dissanayake',
            'Kavindu Seneviratne',
            'Nethmi Senanayake',
            'Pasan Wijesinghe',
            'Dilmi Madushani',
            'Ramesh Gunasekara',
            'Shanika Fernando',
            'Avishka Liyanage',
            'Madhavi Kumari',
            'Janith Jayawardena',
            'Nipuni Rathnayake',
            'Sachin Amarasinghe',
            'Ruwani Weerasinghe',
            'Pradeepa Jayaweera',
            'Bob Fernando',
            'Charlie Silva',
            'Dana Kumari',
            'Eric Jayasuriya'
        ])[((a.rn - 1) % 38) + 1] AS full_name,
        CASE ((a.rn - 1) % 5)
            WHEN 0 THEN 'SCIENCE'
            WHEN 1 THEN 'COMMERCE'
            WHEN 2 THEN 'ARTS'
            WHEN 3 THEN 'BIOLOGICAL_SCIENCE'
            ELSE 'TECHNOLOGY'
        END AS al_stream,
        l.district,
        l.province,
        l.city
    FROM student_accounts a
    JOIN locations l ON l.idx = ((a.rn - 1) % 12) + 1
),
profile_seed AS (
    SELECT
        user_id,
        full_name,
        email,
        DATE '1998-01-01' + ((rn * 173) % 2600)::int AS date_of_birth,
        CASE rn % 3 WHEN 0 THEN 'Female' WHEN 1 THEN 'Male' ELSE 'Prefer not to say' END AS gender,
        'Sri Lankan' AS nationality,
        'SF' || lpad(user_id::text, 8, '0') AS nic_passport,
        district,
        province,
        city,
        '+94 77 ' || lpad((4100000 + rn * 137)::text, 7, '0') AS mobile,
        CASE rn % 3 WHEN 0 THEN 'Sinhala' WHEN 1 THEN 'English' ELSE 'Tamil' END AS preferred_language,
        CASE rn % 4
            WHEN 0 THEN 'G.C.E. Advanced Level'
            WHEN 1 THEN 'Undergraduate Diploma'
            WHEN 2 THEN 'Bachelor''s Degree'
            ELSE 'Foundation Program'
        END AS highest_education,
        CASE rn % 4
            WHEN 0 THEN 'Awaiting university admission'
            WHEN 1 THEN 'Currently enrolled'
            WHEN 2 THEN 'Final year undergraduate'
            ELSE 'Working and studying part-time'
        END AS current_status,
        CASE rn % 5
            WHEN 0 THEN 'POSTGRADUATE'
            WHEN 1 THEN 'UNDERGRADUATE'
            WHEN 2 THEN 'UNDERGRADUATE'
            WHEN 3 THEN 'PHD'
            ELSE 'UNDERGRADUATE'
        END AS intended_level,
        (2026 + (rn % 3))::text AS intended_year,
        CASE rn % 3 WHEN 0 THEN 'On campus' WHEN 1 THEN 'Hybrid' ELSE 'Online' END AS preferred_mode,
        CASE rn % 4 WHEN 0 THEN 'Sri Lanka' WHEN 1 THEN 'Australia' WHEN 2 THEN 'United Kingdom' ELSE 'Canada' END AS preferred_location,
        (2016 + (rn % 5))::text AS ol_year,
        'Local' AS ol_type,
        CASE rn % 3 WHEN 0 THEN 'Sinhala' WHEN 1 THEN 'English' ELSE 'Tamil' END AS ol_medium,
        9 AS ol_passed,
        3 + (rn % 4) AS ol_a_count,
        2 + (rn % 3) AS ol_b_count,
        1 + (rn % 2) AS ol_c_count,
        CASE rn % 4 WHEN 0 THEN 'A' WHEN 1 THEN 'B' WHEN 2 THEN 'A' ELSE 'C' END AS maths_grade,
        CASE rn % 4 WHEN 0 THEN 'A' WHEN 1 THEN 'A' WHEN 2 THEN 'B' ELSE 'B' END AS science_grade,
        CASE rn % 4 WHEN 0 THEN 'B' WHEN 1 THEN 'A' WHEN 2 THEN 'B' ELSE 'A' END AS english_grade,
        (2020 + (rn % 5))::text AS al_year,
        al_stream,
        CASE rn % 3 WHEN 0 THEN 'Sinhala' WHEN 1 THEN 'English' ELSE 'Tamil' END AS al_medium,
        CASE al_stream
            WHEN 'SCIENCE' THEN 'Combined Mathematics'
            WHEN 'COMMERCE' THEN 'Accounting'
            WHEN 'ARTS' THEN 'Political Science'
            WHEN 'BIOLOGICAL_SCIENCE' THEN 'Biology'
            ELSE 'Engineering Technology'
        END AS subject1,
        CASE rn % 5 WHEN 0 THEN 'A' WHEN 1 THEN 'A' WHEN 2 THEN 'B' WHEN 3 THEN 'A' ELSE 'B' END AS grade1,
        CASE al_stream
            WHEN 'SCIENCE' THEN 'Physics'
            WHEN 'COMMERCE' THEN 'Business Studies'
            WHEN 'ARTS' THEN 'Economics'
            WHEN 'BIOLOGICAL_SCIENCE' THEN 'Chemistry'
            ELSE 'Science for Technology'
        END AS subject2,
        CASE rn % 5 WHEN 0 THEN 'A' WHEN 1 THEN 'B' WHEN 2 THEN 'A' WHEN 3 THEN 'B' ELSE 'C' END AS grade2,
        CASE al_stream
            WHEN 'SCIENCE' THEN 'Chemistry'
            WHEN 'COMMERCE' THEN 'Economics'
            WHEN 'ARTS' THEN 'Sinhala'
            WHEN 'BIOLOGICAL_SCIENCE' THEN 'Physics'
            ELSE 'Information and Communication Technology'
        END AS subject3,
        CASE rn % 5 WHEN 0 THEN 'B' WHEN 1 THEN 'A' WHEN 2 THEN 'B' WHEN 3 THEN 'C' ELSE 'A' END AS grade3,
        (1.100 + ((rn % 12) * 0.065))::numeric(4,3) AS z_score,
        CASE rn % 3 WHEN 0 THEN 'IELTS' WHEN 1 THEN 'TOEFL' ELSE 'PTE Academic' END AS english_test,
        CASE rn % 3 WHEN 0 THEN '7.0' WHEN 1 THEN '95' ELSE '64' END AS overall_score,
        (2024 + (rn % 3))::text AS exam_year,
        CASE rn % 4
            WHEN 0 THEN 'Below 50,000'
            WHEN 1 THEN '50,000-100,000'
            WHEN 2 THEN '100,000-200,000'
            ELSE 'Above 200,000'
        END AS household_income,
        1 + (rn % 5) AS dependents,
        CASE rn % 4 WHEN 0 THEN 'Student' WHEN 1 THEN 'Part-time employed' WHEN 2 THEN 'Unemployed' ELSE 'Intern' END AS employment_status,
        CASE rn % 3 WHEN 0 THEN 'Samurdhi beneficiary' WHEN 1 THEN 'No assistance' ELSE 'Education bursary' END AS government_assistance,
        CASE rn % 4
            WHEN 0 THEN 'Rural district applicant with strong school leadership'
            WHEN 1 THEN 'Urban applicant seeking merit-based funding'
            WHEN 2 THEN 'First-generation university applicant'
            ELSE 'Working student balancing family responsibilities'
        END AS background,
        CASE rn % 8 WHEN 0 THEN 'Requires accessible learning support' ELSE 'None' END AS disability,
        CASE rn % 4 WHEN 0 THEN 'School athletics captain' WHEN 1 THEN 'District cricket team' WHEN 2 THEN 'None' ELSE 'Badminton club member' END AS sports,
        CASE rn % 4 WHEN 0 THEN 'Head prefect' WHEN 1 THEN 'Rotaract volunteer' WHEN 2 THEN 'Debate society secretary' ELSE 'Community tutoring coordinator' END AS leadership,
        CASE rn % 3 WHEN 0 THEN 'Yes' ELSE 'No' END AS first_generation,
        CASE rn % 5
            WHEN 0 THEN ARRAY['Sri Lanka', 'Australia', 'United Kingdom']
            WHEN 1 THEN ARRAY['Sri Lanka', 'Canada']
            WHEN 2 THEN ARRAY['Sri Lanka', 'New Zealand']
            WHEN 3 THEN ARRAY['Sri Lanka', 'United States']
            ELSE ARRAY['Sri Lanka']
        END AS preferred_countries,
        CASE al_stream
            WHEN 'SCIENCE' THEN ARRAY['Engineering', 'IT & Computer Science']
            WHEN 'COMMERCE' THEN ARRAY['Business & Management', 'Economics']
            WHEN 'ARTS' THEN ARRAY['Social Sciences', 'Education']
            WHEN 'BIOLOGICAL_SCIENCE' THEN ARRAY['Medicine', 'Natural Sciences']
            ELSE ARRAY['Engineering', 'IT & Computer Science']
        END AS preferred_fields,
        CASE rn % 4 WHEN 0 THEN 'FULL' WHEN 1 THEN 'PARTIAL' WHEN 2 THEN 'TUITION' ELSE 'STIPEND' END AS scholarship_type,
        CASE rn % 3 WHEN 0 THEN 'Yes' ELSE 'No' END AS willing_to_return,
        92 + (rn % 9) AS profile_completion_percentage,
        CURRENT_TIMESTAMP - (rn || ' days')::interval AS created_at,
        CURRENT_TIMESTAMP AS updated_at
    FROM base_profiles
)
INSERT INTO users.student_profiles (
    user_id, full_name, email, date_of_birth, gender, nationality, nic_passport,
    district, province, city, mobile, preferred_language, highest_education,
    current_status, intended_level, intended_year, preferred_mode,
    preferred_location, ol_year, ol_type, ol_medium, ol_passed, ol_a_count,
    ol_b_count, ol_c_count, maths_grade, science_grade, english_grade,
    al_year, al_stream, al_medium, subject1, grade1, subject2, grade2,
    subject3, grade3, z_score, english_test, overall_score, exam_year,
    household_income, dependents, employment_status, government_assistance,
    background, disability, sports, leadership, first_generation,
    preferred_countries, preferred_fields, scholarship_type, willing_to_return,
    profile_completion_percentage, created_at, updated_at
)
SELECT
    user_id, full_name, email, date_of_birth, gender, nationality, nic_passport,
    district, province, city, mobile, preferred_language, highest_education,
    current_status, intended_level, intended_year, preferred_mode,
    preferred_location, ol_year, ol_type, ol_medium, ol_passed, ol_a_count,
    ol_b_count, ol_c_count, maths_grade, science_grade, english_grade,
    al_year, al_stream, al_medium, subject1, grade1, subject2, grade2,
    subject3, grade3, z_score, english_test, overall_score, exam_year,
    household_income, dependents, employment_status, government_assistance,
    background, disability, sports, leadership, first_generation,
    preferred_countries, preferred_fields, scholarship_type, willing_to_return,
    profile_completion_percentage, created_at, updated_at
FROM profile_seed
ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    date_of_birth = EXCLUDED.date_of_birth,
    gender = EXCLUDED.gender,
    nationality = EXCLUDED.nationality,
    nic_passport = EXCLUDED.nic_passport,
    district = EXCLUDED.district,
    province = EXCLUDED.province,
    city = EXCLUDED.city,
    mobile = EXCLUDED.mobile,
    preferred_language = EXCLUDED.preferred_language,
    highest_education = EXCLUDED.highest_education,
    current_status = EXCLUDED.current_status,
    intended_level = EXCLUDED.intended_level,
    intended_year = EXCLUDED.intended_year,
    preferred_mode = EXCLUDED.preferred_mode,
    preferred_location = EXCLUDED.preferred_location,
    ol_year = EXCLUDED.ol_year,
    ol_type = EXCLUDED.ol_type,
    ol_medium = EXCLUDED.ol_medium,
    ol_passed = EXCLUDED.ol_passed,
    ol_a_count = EXCLUDED.ol_a_count,
    ol_b_count = EXCLUDED.ol_b_count,
    ol_c_count = EXCLUDED.ol_c_count,
    maths_grade = EXCLUDED.maths_grade,
    science_grade = EXCLUDED.science_grade,
    english_grade = EXCLUDED.english_grade,
    al_year = EXCLUDED.al_year,
    al_stream = EXCLUDED.al_stream,
    al_medium = EXCLUDED.al_medium,
    subject1 = EXCLUDED.subject1,
    grade1 = EXCLUDED.grade1,
    subject2 = EXCLUDED.subject2,
    grade2 = EXCLUDED.grade2,
    subject3 = EXCLUDED.subject3,
    grade3 = EXCLUDED.grade3,
    z_score = EXCLUDED.z_score,
    english_test = EXCLUDED.english_test,
    overall_score = EXCLUDED.overall_score,
    exam_year = EXCLUDED.exam_year,
    household_income = EXCLUDED.household_income,
    dependents = EXCLUDED.dependents,
    employment_status = EXCLUDED.employment_status,
    government_assistance = EXCLUDED.government_assistance,
    background = EXCLUDED.background,
    disability = EXCLUDED.disability,
    sports = EXCLUDED.sports,
    leadership = EXCLUDED.leadership,
    first_generation = EXCLUDED.first_generation,
    preferred_countries = EXCLUDED.preferred_countries,
    preferred_fields = EXCLUDED.preferred_fields,
    scholarship_type = EXCLUDED.scholarship_type,
    willing_to_return = EXCLUDED.willing_to_return,
    profile_completion_percentage = EXCLUDED.profile_completion_percentage,
    updated_at = CURRENT_TIMESTAMP;

WITH ranked_students AS (
    SELECT
        id AS student_id,
        row_number() OVER (ORDER BY id) AS rn
    FROM auth.users
    WHERE role = 'STUDENT'
      AND is_active = TRUE
      AND is_verified = TRUE
    ORDER BY id
    LIMIT 24
),
scholarship_pool AS (
    SELECT
        id AS scholarship_id,
        row_number() OVER (ORDER BY id) AS rn,
        count(*) OVER () AS total
    FROM scholarships.scholarships
    WHERE status = 'ACTIVE'
),
seed_applications AS (
    SELECT
        rs.student_id,
        sp.scholarship_id,
        rs.rn,
        1 AS slot
    FROM ranked_students rs
    JOIN scholarship_pool sp ON sp.rn = ((rs.rn - 1) % sp.total) + 1
    UNION ALL
    SELECT
        rs.student_id,
        sp.scholarship_id,
        rs.rn,
        2 AS slot
    FROM ranked_students rs
    JOIN scholarship_pool sp ON sp.rn = ((rs.rn + 10) % sp.total) + 1
    WHERE rs.rn <= 12
)
INSERT INTO scholarships.applications (
    scholarship_id,
    student_id,
    status,
    cover_letter,
    statement_of_purpose,
    documents,
    match_score,
    selection_score,
    selection_recommendation,
    socio_economic_category,
    created_at,
    updated_at
)
SELECT
    scholarship_id,
    student_id,
    CASE (rn + slot) % 4
        WHEN 0 THEN 'SUBMITTED'
        WHEN 1 THEN 'UNDER_REVIEW'
        WHEN 2 THEN 'SHORTLISTED'
        ELSE 'ACCEPTED'
    END AS status,
    'I am applying for this scholarship to continue my studies with strong academic focus and community impact.' AS cover_letter,
    'My goal is to complete the selected program, build professional skills, and contribute to education access in Sri Lanka.' AS statement_of_purpose,
    jsonb_build_array('Transcript', 'NIC/Passport', 'Personal Statement', 'Recommendation Letter') AS documents,
    (74 + ((rn * 3 + slot * 5) % 23))::numeric(5,2) AS match_score,
    (70 + ((rn * 4 + slot * 3) % 25))::numeric(5,2) AS selection_score,
    CASE (rn + slot) % 3
        WHEN 0 THEN 'STRONG_MATCH'
        WHEN 1 THEN 'REVIEW_RECOMMENDED'
        ELSE 'GOOD_MATCH'
    END AS selection_recommendation,
    CASE rn % 4
        WHEN 0 THEN 'Low income'
        WHEN 1 THEN 'Middle income'
        WHEN 2 THEN 'First generation'
        ELSE 'Rural applicant'
    END AS socio_economic_category,
    CURRENT_TIMESTAMP - ((rn + slot) || ' days')::interval AS created_at,
    CURRENT_TIMESTAMP AS updated_at
FROM seed_applications seeded
WHERE NOT EXISTS (
    SELECT 1
    FROM scholarships.applications existing
    WHERE existing.student_id = seeded.student_id
      AND existing.scholarship_id = seeded.scholarship_id
);
