INSERT INTO content.testimonials (
    scholar_name,
    submitter_email,
    scholarship_name,
    year_completed,
    field_of_study,
    university,
    testimonial_text,
    rating,
    is_anonymous,
    is_featured,
    status,
    reviewed_by,
    reviewed_at,
    created_at,
    updated_at
)
SELECT
    'Ayesha Fernando',
    'ayesha.story.sample@scholarfinder.lk',
    'Australia Awards Scholarship',
    2024,
    'Public Health',
    'University of Melbourne',
    'Receiving this scholarship allowed me to study public health with mentors who understood community challenges in South Asia. I returned to Sri Lanka with stronger research skills, practical policy experience, and the confidence to support health projects in underserved districts.',
    5,
    false,
    true,
    'PUBLISHED',
    'Admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1
    FROM content.testimonials
    WHERE submitter_email = 'ayesha.story.sample@scholarfinder.lk'
);

INSERT INTO content.testimonials (
    scholar_name,
    submitter_email,
    scholarship_name,
    year_completed,
    field_of_study,
    university,
    testimonial_text,
    rating,
    is_anonymous,
    is_featured,
    status,
    reviewed_by,
    reviewed_at,
    created_at,
    updated_at
)
SELECT
    'Tharindu Perera',
    'tharindu.story.sample@scholarfinder.lk',
    'Commonwealth Master''s Scholarship',
    2023,
    'Computer Science',
    'University of Cambridge',
    'The Commonwealth Scholarship changed my career path by giving me access to advanced computing courses, research seminars, and a global network of students. The experience helped me build AI projects that I now use to mentor younger applicants in Sri Lanka.',
    5,
    false,
    true,
    'PUBLISHED',
    'Admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1
    FROM content.testimonials
    WHERE submitter_email = 'tharindu.story.sample@scholarfinder.lk'
);

INSERT INTO content.testimonials (
    scholar_name,
    submitter_email,
    scholarship_name,
    year_completed,
    field_of_study,
    university,
    testimonial_text,
    rating,
    is_anonymous,
    is_featured,
    status,
    created_at,
    updated_at
)
SELECT
    'Sahan Wijesinghe',
    'sahan.pending.sample@scholarfinder.lk',
    'DAAD Scholarship',
    2025,
    'Mechanical Engineering',
    'Technical University of Munich',
    'My scholarship journey gave me the chance to work with modern engineering labs and industry mentors. I want to share how the financial support, structured application process, and guidance from senior students helped me stay focused and succeed abroad.',
    5,
    false,
    false,
    'PENDING',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1
    FROM content.testimonials
    WHERE submitter_email = 'sahan.pending.sample@scholarfinder.lk'
);

INSERT INTO content.testimonials (
    scholar_name,
    submitter_email,
    scholarship_name,
    year_completed,
    field_of_study,
    university,
    testimonial_text,
    rating,
    is_anonymous,
    is_featured,
    status,
    created_at,
    updated_at
)
SELECT
    'Hasini Jayawardena',
    'hasini.pending.sample@scholarfinder.lk',
    'Erasmus Mundus Scholarship',
    2025,
    'Environmental Science',
    'Multiple European Universities',
    'Studying through an international scholarship helped me understand climate challenges from several country perspectives. I would like my story reviewed because it may encourage students from smaller towns to apply even when the process feels difficult at first.',
    4,
    false,
    false,
    'PENDING',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1
    FROM content.testimonials
    WHERE submitter_email = 'hasini.pending.sample@scholarfinder.lk'
);
