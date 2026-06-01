-- Backfills selection criteria and application steps for scholarships that do not yet have them.

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
