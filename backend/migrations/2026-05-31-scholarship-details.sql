-- Adds full scholarship detail fields for existing local databases.

ALTER TABLE scholarships.scholarships ADD COLUMN IF NOT EXISTS provider_name VARCHAR(255);
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
