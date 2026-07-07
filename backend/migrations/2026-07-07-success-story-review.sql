ALTER TABLE content.testimonials
    ADD COLUMN IF NOT EXISTS submitter_email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
    ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(255),
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;

COMMENT ON COLUMN content.testimonials.status IS
    'PENDING, PUBLISHED, REJECTED, DRAFT, ARCHIVED';
