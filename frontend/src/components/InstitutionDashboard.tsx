import { useEffect, useMemo, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Building2,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  Award,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Star,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  DollarSign,
  ArrowLeft,
  Loader2,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import { PostScholarshipForm } from './PostScholarshipForm';
import {
  AnnouncementResponse,
  AnnouncementRecipient,
  InstitutionApplicationResponse,
  notificationApi,
  scholarshipApi,
  tokenService,
} from '../services/api';

type TabType = 'overview' | 'scholarships' | 'candidates' | 'analytics' | 'announcements';
type CandidateStatus = 'pending' | 'shortlisted' | 'selected' | 'rejected';
type CandidateReviewAction = 'download' | 'shortlisted' | 'selected' | 'rejected' | 'announcement';
type InstitutionBulkRecipientGroup = 'all' | 'shortlisted' | 'selected' | 'rejected';
type InstitutionAnnouncementTemplate =
  | 'selection'
  | 'shortlist'
  | 'rejection'
  | 'received'
  | 'deadline'
  | 'custom';

type InstitutionDashboardProps = {
  onLogout?: () => void | Promise<void>;
};

type Candidate = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  scholarship: string;
  matchScore: number;
  gpa: number;
  alResults: string;
  status: CandidateStatus;
  appliedDate: string;
  level: string;
};

type CandidateSource = 'sample' | 'real';

type BulkAnnouncementRecipientSummary = {
  candidates: Candidate[];
  recipients: AnnouncementRecipient[];
  invalidCandidates: Candidate[];
  duplicateCount: number;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const toCandidateStatus = (status?: string): CandidateStatus => {
  const normalizedStatus = (status || '').trim().toUpperCase();

  if (['SHORTLISTED', 'SHORTLIST'].includes(normalizedStatus)) {
    return 'shortlisted';
  }

  if (['ACCEPTED', 'APPROVED', 'SELECTED'].includes(normalizedStatus)) {
    return 'selected';
  }

  if (['REJECTED', 'DECLINED', 'DENIED'].includes(normalizedStatus)) {
    return 'rejected';
  }

  return 'pending';
};

const formatApplicationDate = (value?: string) => {
  if (!value) return 'N/A';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return date.toISOString().slice(0, 10);
};

const mapApplicationToCandidate = (
  application: InstitutionApplicationResponse,
): Candidate => ({
  id: application.applicationId,
  name: application.studentName || `Student #${application.studentId}`,
  email: application.studentEmail || '',
  phone: application.studentPhone || 'Not provided',
  location: 'Not provided',
  scholarship: application.scholarshipTitle || 'Unknown Scholarship',
  matchScore: Math.round(application.matchPercentage ?? 0),
  gpa: 0,
  alResults: 'N/A',
  status: toCandidateStatus(application.status),
  appliedDate: formatApplicationDate(application.appliedAt),
  level: application.currentEducation || 'N/A',
});

const buildBulkRecipientSummary = (
  candidates: Candidate[],
): BulkAnnouncementRecipientSummary => {
  const recipientsByEmail = new Map<string, AnnouncementRecipient>();
  const invalidCandidates: Candidate[] = [];

  candidates.forEach((candidate) => {
    const normalizedEmail = normalizeEmail(candidate.email);

    if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
      invalidCandidates.push(candidate);
      return;
    }

    if (!recipientsByEmail.has(normalizedEmail)) {
      recipientsByEmail.set(normalizedEmail, {
        email: normalizedEmail,
        name: candidate.name,
      });
    }
  });

  const recipients = Array.from(recipientsByEmail.values());
  const duplicateCount = Math.max(
    0,
    candidates.length - recipients.length - invalidCandidates.length,
  );

  return {
    candidates,
    recipients,
    invalidCandidates,
    duplicateCount,
  };
};

const candidateTestEmail = (candidateId: number) =>
  `scholarfinders+candidate${String(candidateId).padStart(2, '0')}@gmail.com`;

const withDeliverableCandidateEmail = (candidate: Candidate): Candidate => ({
  ...candidate,
  email: candidateTestEmail(candidate.id),
});

type ScholarshipStatus = 'active' | 'closed';

type Scholarship = {
  id: number;
  title: string;
  status: ScholarshipStatus;
  deadline: string;
  applicants: number;
  shortlisted: number;
  selected: number;
  amount: string;
  duration: string;
  level: string;
};

type ScholarshipEditableField = keyof Pick<
  Scholarship,
  'title' | 'status' | 'deadline' | 'amount' | 'duration' | 'level'
>;

type ScholarshipRequirementProfile = {
  summary: string;
  minimumGpa: number;
  requiredLevel: string;
  minimumAlResults: string;
  requiredQualifications: string[];
  selectionCriteria: string[];
  requiredDocuments: string[];
};

type CandidateEvidenceProfile = {
  currentProgram: string;
  fieldOfStudy: string;
  englishTest: string;
  englishScore: string;
  experienceHighlights: string[];
  leadershipHighlights: string[];
  certifications: string[];
  uploadedDocuments: string[];
  personalStatementSummary: string;
};

type RequirementCheck = {
  requirement: string;
  matched: boolean;
  evidence: string;
};

const analyticsStatusConfig: Array<{
  status: CandidateStatus;
  label: string;
  barClassName: string;
}> = [
  { status: 'pending', label: 'Pending Review', barClassName: 'bg-slate-500' },
  { status: 'shortlisted', label: 'Shortlisted', barClassName: 'bg-blue-500' },
  { status: 'selected', label: 'Selected', barClassName: 'bg-green-500' },
  { status: 'rejected', label: 'Rejected', barClassName: 'bg-red-500' },
];

const parseAppliedDate = (value?: string) => {
  if (!value || value === 'N/A') return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

const formatPercent = (value: number) => {
  if (!Number.isFinite(value)) return '0%';

  const rounded = Math.round(value * 10) / 10;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
};

const formatAnalyticsDateLabel = (date: Date, periodDays: number) =>
  periodDays <= 30
    ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });

// Mock data for scholarships
const mockScholarships: Scholarship[] = [
  {
    id: 1,
    title: 'Commonwealth Scholarship 2026',
    status: 'active',
    deadline: '2026-06-30',
    applicants: 156,
    shortlisted: 23,
    selected: 5,
    amount: '$15,000',
    duration: '1 Year',
    level: 'Undergraduate',
  },
  {
    id: 2,
    title: 'Graduate Research Fellowship',
    status: 'active',
    deadline: '2026-08-15',
    applicants: 89,
    shortlisted: 15,
    selected: 0,
    amount: '$25,000',
    duration: '2 Years',
    level: 'Postgraduate',
  },
  {
    id: 3,
    title: 'Engineering Excellence Award',
    status: 'closed',
    deadline: '2026-03-31',
    applicants: 203,
    shortlisted: 30,
    selected: 10,
    amount: '$10,000',
    duration: '1 Year',
    level: 'Undergraduate',
  },
];

// Mock data for candidates
const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: 'Saman Perera',
    email: 'saman.perera@email.com',
    phone: '+94 77 123 4567',
    location: 'Colombo, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 95,
    gpa: 3.9,
    alResults: 'AAA',
    status: 'pending',
    appliedDate: '2026-01-10',
    level: 'Undergraduate',
  },
  {
    id: 2,
    name: 'Nimal Silva',
    email: 'nimal.silva@email.com',
    phone: '+94 76 234 5678',
    location: 'Kandy, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 92,
    gpa: 3.8,
    alResults: 'AAB',
    status: 'shortlisted',
    appliedDate: '2026-01-12',
    level: 'Undergraduate',
  },
  {
    id: 3,
    name: 'Kamala Fernando',
    email: 'kamala.fernando@email.com',
    phone: '+94 75 345 6789',
    location: 'Galle, Sri Lanka',
    scholarship: 'Graduate Research Fellowship',
    matchScore: 98,
    gpa: 4.0,
    alResults: 'AAA',
    status: 'pending',
    appliedDate: '2026-01-08',
    level: 'Postgraduate',
  },
  {
    id: 4,
    name: 'Rajitha Wijesinghe',
    email: 'rajitha.w@email.com',
    phone: '+94 71 456 7890',
    location: 'Jaffna, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 88,
    gpa: 3.7,
    alResults: 'ABB',
    status: 'selected',
    appliedDate: '2026-01-15',
    level: 'Undergraduate',
  },
  {
    id: 5,
    name: 'Priya Jayawardena',
    email: 'priya.j@email.com',
    phone: '+94 77 567 8901',
    location: 'Matara, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 90,
    gpa: 3.75,
    alResults: 'AAB',
    status: 'pending',
    appliedDate: '2026-01-11',
    level: 'Undergraduate',
  },
  {
    id: 6,
    name: 'Dinesh Kumar',
    email: 'dinesh.k@email.com',
    phone: '+94 76 678 9012',
    location: 'Batticaloa, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 87,
    gpa: 3.65,
    alResults: 'ABB',
    status: 'pending',
    appliedDate: '2026-01-13',
    level: 'Undergraduate',
  },
  {
    id: 7,
    name: 'Thilini Rathnayake',
    email: 'thilini.r@email.com',
    phone: '+94 75 789 0123',
    location: 'Kurunegala, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 93,
    gpa: 3.85,
    alResults: 'AAA',
    status: 'shortlisted',
    appliedDate: '2026-01-09',
    level: 'Undergraduate',
  },
  {
    id: 8,
    name: 'Harsha Dissanayake',
    email: 'harsha.d@email.com',
    phone: '+94 71 890 1234',
    location: 'Negombo, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 85,
    gpa: 3.6,
    alResults: 'ABB',
    status: 'pending',
    appliedDate: '2026-01-14',
    level: 'Undergraduate',
  },
  {
    id: 9,
    name: 'Nadeesha Perera',
    email: 'nadeesha.p@email.com',
    phone: '+94 77 901 2345',
    location: 'Anuradhapura, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 91,
    gpa: 3.8,
    alResults: 'AAB',
    status: 'pending',
    appliedDate: '2026-01-12',
    level: 'Undergraduate',
  },
  {
    id: 10,
    name: 'Ruwan Bandara',
    email: 'ruwan.b@email.com',
    phone: '+94 76 012 3456',
    location: 'Ratnapura, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 89,
    gpa: 3.7,
    alResults: 'ABB',
    status: 'pending',
    appliedDate: '2026-01-11',
    level: 'Undergraduate',
  },
  {
    id: 11,
    name: 'Amali Wijesekera',
    email: 'amali.w@email.com',
    phone: '+94 75 123 4567',
    location: 'Badulla, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 84,
    gpa: 3.55,
    alResults: 'ABB',
    status: 'pending',
    appliedDate: '2026-01-16',
    level: 'Undergraduate',
  },
  {
    id: 12,
    name: 'Suresh Gunasekara',
    email: 'suresh.g@email.com',
    phone: '+94 71 234 5678',
    location: 'Trincomalee, Sri Lanka',
    scholarship: 'Commonwealth Scholarship 2026',
    matchScore: 86,
    gpa: 3.65,
    alResults: 'ABB',
    status: 'pending',
    appliedDate: '2026-01-14',
    level: 'Undergraduate',
  },
  {
    id: 13,
    name: 'Sandali Mendis',
    email: 'sandali.m@email.com',
    phone: '+94 77 345 6789',
    location: 'Gampaha, Sri Lanka',
    scholarship: 'Graduate Research Fellowship',
    matchScore: 96,
    gpa: 3.95,
    alResults: 'AAA',
    status: 'shortlisted',
    appliedDate: '2026-01-09',
    level: 'Postgraduate',
  },
  {
    id: 14,
    name: 'Lakshan De Silva',
    email: 'lakshan.d@email.com',
    phone: '+94 76 456 7890',
    location: 'Colombo, Sri Lanka',
    scholarship: 'Graduate Research Fellowship',
    matchScore: 94,
    gpa: 3.88,
    alResults: 'AAA',
    status: 'pending',
    appliedDate: '2026-01-10',
    level: 'Postgraduate',
  },
  {
    id: 15,
    name: 'Dilini Jayasuriya',
    email: 'dilini.j@email.com',
    phone: '+94 75 567 8901',
    location: 'Kandy, Sri Lanka',
    scholarship: 'Graduate Research Fellowship',
    matchScore: 92,
    gpa: 3.82,
    alResults: 'AAB',
    status: 'pending',
    appliedDate: '2026-01-11',
    level: 'Postgraduate',
  },
  {
    id: 16,
    name: 'Chandana Rodrigo',
    email: 'chandana.r@email.com',
    phone: '+94 71 678 9012',
    location: 'Moratuwa, Sri Lanka',
    scholarship: 'Engineering Excellence Award',
    matchScore: 97,
    gpa: 3.92,
    alResults: 'AAA',
    status: 'selected',
    appliedDate: '2026-01-05',
    level: 'Undergraduate',
  },
  {
    id: 17,
    name: 'Tharaka Gamage',
    email: 'tharaka.g@email.com',
    phone: '+94 77 789 0123',
    location: 'Kiribathgoda, Sri Lanka',
    scholarship: 'Engineering Excellence Award',
    matchScore: 95,
    gpa: 3.9,
    alResults: 'AAA',
    status: 'selected',
    appliedDate: '2026-01-06',
    level: 'Undergraduate',
  },
  {
    id: 18,
    name: 'Nuwan Ranasinghe',
    email: 'nuwan.r@email.com',
    phone: '+94 76 890 1234',
    location: 'Maharagama, Sri Lanka',
    scholarship: 'Engineering Excellence Award',
    matchScore: 93,
    gpa: 3.85,
    alResults: 'AAB',
    status: 'selected',
    appliedDate: '2026-01-07',
    level: 'Undergraduate',
  },
];

const buildFallbackScholarshipCandidates = (
  scholarship: Scholarship,
): Candidate[] => {
  const fallbackCandidates: Candidate[] = [
    {
      id: 100000 + scholarship.id * 10 + 1,
      name: 'Anjali Perera',
      email: '',
      phone: '+94 77 214 8890',
      location: 'Colombo, Sri Lanka',
      scholarship: scholarship.title,
      matchScore: 94,
      gpa: 3.86,
      alResults: 'AAA',
      status: 'pending',
      appliedDate: '2026-02-04',
      level: scholarship.level,
    },
    {
      id: 100000 + scholarship.id * 10 + 2,
      name: 'Kavindu Samarasinghe',
      email: '',
      phone: '+94 76 502 1187',
      location: 'Kandy, Sri Lanka',
      scholarship: scholarship.title,
      matchScore: 91,
      gpa: 3.74,
      alResults: 'AAB',
      status: 'shortlisted',
      appliedDate: '2026-02-06',
      level: scholarship.level,
    },
    {
      id: 100000 + scholarship.id * 10 + 3,
      name: 'Madhavi Fernando',
      email: '',
      phone: '+94 75 618 3420',
      location: 'Galle, Sri Lanka',
      scholarship: scholarship.title,
      matchScore: 88,
      gpa: 3.68,
      alResults: 'ABB',
      status: 'pending',
      appliedDate: '2026-02-08',
      level: scholarship.level,
    },
  ];

  return fallbackCandidates.map(withDeliverableCandidateEmail);
};

const scholarshipRequirementProfiles: Record<string, ScholarshipRequirementProfile> = {
  'Commonwealth Scholarship 2026': {
    summary:
      'Commonwealth prioritizes academically strong students with leadership potential and a clear contribution plan.',
    minimumGpa: 3.7,
    requiredLevel: 'Undergraduate',
    minimumAlResults: 'AAB',
    requiredQualifications: [
      'Strong academic performance in A/L or equivalent',
      'Clear motivation aligned with scholarship mission',
      'English proficiency for international study',
    ],
    selectionCriteria: [
      'Academic excellence',
      'Leadership and service record',
      'Quality of personal statement',
      'Document completeness and authenticity',
    ],
    requiredDocuments: [
      'Academic transcript',
      'A/L results sheet',
      'Personal statement',
      'Recommendation letter',
      'English test report',
    ],
  },
  'Graduate Research Fellowship': {
    summary:
      'This fellowship is research-driven and favors candidates with top grades, research readiness, and domain focus.',
    minimumGpa: 3.85,
    requiredLevel: 'Postgraduate',
    minimumAlResults: 'AAA',
    requiredQualifications: [
      'High GPA in relevant degree',
      'Research aptitude and critical writing',
      'Evidence of discipline-specific depth',
    ],
    selectionCriteria: [
      'Research potential',
      'Academic consistency',
      'Statement quality and objective clarity',
      'Readiness of required documentation',
    ],
    requiredDocuments: [
      'Degree transcript',
      'Research proposal summary',
      'Reference letter',
      'English test report',
      'Updated CV',
    ],
  },
  'Engineering Excellence Award': {
    summary:
      'Engineering Excellence looks for technically strong candidates with project evidence and dependable academic results.',
    minimumGpa: 3.75,
    requiredLevel: 'Undergraduate',
    minimumAlResults: 'AAB',
    requiredQualifications: [
      'Consistent academic track record',
      'Strong quantitative foundation',
      'Technical or project achievements',
    ],
    selectionCriteria: [
      'GPA and A/L strength',
      'Technical project evidence',
      'Leadership and teamwork capability',
      'Complete and verifiable documents',
    ],
    requiredDocuments: [
      'Academic transcript',
      'A/L results sheet',
      'Project portfolio or summary',
      'Recommendation letter',
      'Personal statement',
    ],
  },
};

const buildFallbackRequirementProfile = (
  candidate: Candidate,
): ScholarshipRequirementProfile => ({
  summary:
    `${candidate.scholarship} was edited in this session. Review the candidate against the latest institution criteria before making a final decision.`,
  minimumGpa: candidate.gpa,
  requiredLevel: candidate.level,
  minimumAlResults: candidate.alResults,
  requiredQualifications: [
    'Meets the current scholarship profile reviewed by the institution',
    'Submitted academic evidence for manual verification',
  ],
  selectionCriteria: [
    'Academic fit',
    'Document completeness',
    'Institution review outcome',
  ],
  requiredDocuments: [
    'Academic transcript',
    'Personal statement',
    'Reference letter',
  ],
});

const candidateEvidenceOverrides: Record<number, Partial<CandidateEvidenceProfile>> = {
  1: {
    currentProgram: 'BSc in Computer Science, University of Colombo (Year 3)',
    fieldOfStudy: 'Computer Science and Data Systems',
    englishTest: 'IELTS',
    englishScore: '7.5',
    experienceHighlights: [
      'Finalist in National AI Challenge 2025',
      'Built scholarship matching mini-platform for student society',
    ],
    leadershipHighlights: [
      'President, Faculty Computing Society',
      'Volunteer mentor for first-year students',
    ],
    certifications: ['Google Data Analytics', 'AWS Cloud Practitioner'],
  },
  3: {
    currentProgram: 'BSc in Biotechnology, University of Ruhuna (Final Year)',
    fieldOfStudy: 'Biotechnology and Biomedical Research',
    englishTest: 'TOEFL',
    englishScore: '108',
    experienceHighlights: [
      'Co-authored undergraduate paper on antimicrobial resistance',
      'Research assistant in molecular diagnostics lab',
    ],
    leadershipHighlights: ['Coordinator, Women in STEM community chapter'],
    certifications: ['Good Clinical Practice (GCP)'],
  },
  16: {
    currentProgram: 'BEng in Mechanical Engineering, University of Moratuwa (Year 4)',
    fieldOfStudy: 'Mechanical Engineering',
    englishTest: 'IELTS',
    englishScore: '7.0',
    experienceHighlights: [
      'Led industry-linked capstone design project',
      'Internship in manufacturing automation',
    ],
    leadershipHighlights: ['Team lead, Robotics Club'],
    certifications: ['SolidWorks Professional Certification'],
  },
};

const gradeScoreMap: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  S: 1,
  F: 0,
};

const normalizeAlResults = (value: string) =>
  value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);

const alScore = (value: string) =>
  normalizeAlResults(value)
    .split('')
    .reduce((score, grade) => score + (gradeScoreMap[grade] ?? 0), 0);

const meetsAlRequirement = (actual: string, required: string) =>
  alScore(actual) >= alScore(required);

const buildCandidateEvidenceProfile = (
  candidate: Candidate,
): CandidateEvidenceProfile => {
  const fallback: CandidateEvidenceProfile = {
    currentProgram: `${candidate.level} program candidate in applied studies`,
    fieldOfStudy:
      candidate.level === 'Postgraduate'
        ? 'Research-focused interdisciplinary studies'
        : 'STEM and development-focused track',
    englishTest: candidate.level === 'Postgraduate' ? 'TOEFL' : 'IELTS',
    englishScore: candidate.level === 'Postgraduate' ? '102' : '7.0',
    experienceHighlights: [
      'Consistent performance in coursework and assessments',
      'Active participation in academic and project activities',
    ],
    leadershipHighlights: [
      'Contributed to peer mentoring and student collaboration initiatives',
    ],
    certifications: ['Academic Writing Workshop Certificate'],
    uploadedDocuments: [
      'Academic transcript',
      'A/L results sheet',
      'Personal statement',
      'Reference letter',
    ],
    personalStatementSummary:
      'Applicant explains academic goals clearly and links the scholarship to long-term impact plans.',
  };

  const overrides = candidateEvidenceOverrides[candidate.id] ?? {};

  return {
    ...fallback,
    ...overrides,
    uploadedDocuments:
      overrides.uploadedDocuments ?? fallback.uploadedDocuments,
    experienceHighlights:
      overrides.experienceHighlights ?? fallback.experienceHighlights,
    leadershipHighlights:
      overrides.leadershipHighlights ?? fallback.leadershipHighlights,
    certifications: overrides.certifications ?? fallback.certifications,
  };
};

const buildRequirementChecks = (
  candidate: Candidate,
  scholarshipProfile: ScholarshipRequirementProfile,
  evidenceProfile: CandidateEvidenceProfile,
): RequirementCheck[] => {
  const hasEnglishEvidence = Boolean(evidenceProfile.englishTest.trim());
  const hasLeadershipEvidence = evidenceProfile.leadershipHighlights.length > 0;
  const hasRequiredDocuments = scholarshipProfile.requiredDocuments.every(
    (requiredDoc) =>
      evidenceProfile.uploadedDocuments.some((uploadedDoc) =>
        uploadedDoc.toLowerCase().includes(requiredDoc.toLowerCase()),
      ),
  );

  return [
    {
      requirement: `Minimum GPA ${scholarshipProfile.minimumGpa}`,
      matched: candidate.gpa >= scholarshipProfile.minimumGpa,
      evidence: `Candidate GPA: ${candidate.gpa}`,
    },
    {
      requirement: `Required level: ${scholarshipProfile.requiredLevel}`,
      matched:
        candidate.level.toLowerCase() ===
        scholarshipProfile.requiredLevel.toLowerCase(),
      evidence: `Candidate level: ${candidate.level}`,
    },
    {
      requirement: `Minimum A/L profile: ${scholarshipProfile.minimumAlResults}`,
      matched: meetsAlRequirement(
        candidate.alResults,
        scholarshipProfile.minimumAlResults,
      ),
      evidence: `Candidate A/L: ${candidate.alResults}`,
    },
    {
      requirement: 'English proficiency evidence',
      matched: hasEnglishEvidence,
      evidence: `${evidenceProfile.englishTest} (${evidenceProfile.englishScore})`,
    },
    {
      requirement: 'Leadership and engagement evidence',
      matched: hasLeadershipEvidence,
      evidence: hasLeadershipEvidence
        ? evidenceProfile.leadershipHighlights[0]
        : 'No strong leadership evidence provided',
    },
    {
      requirement: 'Required documents complete',
      matched: hasRequiredDocuments,
      evidence: `${evidenceProfile.uploadedDocuments.length} supporting documents attached`,
    },
  ];
};

const getStatusPillClasses = (status: CandidateStatus) => {
  if (status === 'selected') return 'bg-green-100 text-green-700';
  if (status === 'shortlisted') return 'bg-blue-100 text-blue-700';
  if (status === 'rejected') return 'bg-red-100 text-red-700';
  return 'bg-slate-100 text-slate-700';
};

const candidateStatusLabels: Record<CandidateStatus, string> = {
  pending: 'pending review',
  shortlisted: 'shortlisted',
  selected: 'selected',
  rejected: 'rejected',
};

const candidateAnnouncementLabels: Record<CandidateStatus, string> = {
  pending: 'Application Update',
  shortlisted: 'Shortlist Email',
  selected: 'Selection Email',
  rejected: 'Rejection Email',
};

const canSendCandidateAnnouncement = (status: CandidateStatus) =>
  status === 'shortlisted' || status === 'selected' || status === 'rejected';

const getAnnouncementButtonClass = (status: CandidateStatus) => {
  if (status === 'shortlisted') {
    return 'bg-blue-600 hover:bg-blue-700 text-white';
  }

  if (status === 'rejected') {
    return 'bg-red-600 hover:bg-red-700 text-white';
  }

  return 'bg-green-600 hover:bg-green-700 text-white';
};

const dedupeSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown';

const buildCandidateOutcomeDedupeKey = (
  status: CandidateStatus,
  scholarship: string,
) => `candidate-outcome:${status}:${dedupeSegment(scholarship)}`;

const bulkTemplateOutcomeStatus = (
  template: InstitutionAnnouncementTemplate,
): CandidateStatus | null => {
  if (template === 'selection') return 'selected';
  if (template === 'shortlist') return 'shortlisted';
  if (template === 'rejection') return 'rejected';
  return null;
};

const buildCandidateAnnouncementContent = (candidate: Candidate) => {
  if (candidate.status === 'shortlisted') {
    return {
      label: candidateAnnouncementLabels.shortlisted,
      successMessage: `Shortlist announcement sent to ${candidate.name}.`,
      failureMessage: `Could not send the shortlist email to ${candidate.name}.`,
      subject: `Shortlist update - ${candidate.scholarship}`,
      message:
        `You have been shortlisted for ${candidate.scholarship}.\n\n` +
        'Our institution team will contact you with the next review steps and any required interview or document instructions.',
    };
  }

  if (candidate.status === 'rejected') {
    return {
      label: candidateAnnouncementLabels.rejected,
      successMessage: `Rejection announcement sent to ${candidate.name}.`,
      failureMessage: `Could not send the rejection email to ${candidate.name}.`,
      subject: `Application outcome - ${candidate.scholarship}`,
      message:
        `Thank you for applying for ${candidate.scholarship}.\n\n` +
        'After careful review, your application has not been selected for this round. We appreciate the time you invested and encourage you to continue applying for suitable opportunities.',
    };
  }

  return {
    label: candidateAnnouncementLabels.selected,
    successMessage: `Selection announcement sent to ${candidate.name}.`,
    failureMessage: `Could not send the selection email to ${candidate.name}.`,
    subject: `Selection announcement - ${candidate.scholarship}`,
    message:
      `Congratulations. You have been selected for ${candidate.scholarship}.\n\n` +
      'Our institution team will contact you with the next steps and required confirmation details.',
  };
};

export function InstitutionDashboard({ onLogout }: InstitutionDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [scholarships, setScholarships] = useState<Scholarship[]>(mockScholarships);
  const [candidates, setCandidates] = useState<Candidate[]>(
    mockCandidates.map(withDeliverableCandidateEmail),
  );
  const [candidateSource, setCandidateSource] = useState<CandidateSource>('sample');
  const [isLoadingInstitutionApplications, setIsLoadingInstitutionApplications] =
    useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timePeriod, setTimePeriod] = useState('all');
  const [editingScholarshipId, setEditingScholarshipId] = useState<number | null>(null);
  const [scholarshipDraft, setScholarshipDraft] = useState<Scholarship | null>(null);
  const [selectedScholarshipDetail, setSelectedScholarshipDetail] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCandidateProfile, setSelectedCandidateProfile] = useState<number | null>(null);
  const [activeReviewAction, setActiveReviewAction] = useState<Record<number, CandidateReviewAction | null>>({});
  const [showPostScholarshipForm, setShowPostScholarshipForm] = useState(false);
  const [bulkRecipientGroup, setBulkRecipientGroup] =
    useState<InstitutionBulkRecipientGroup>('all');
  const [bulkScholarship, setBulkScholarship] = useState('all');
  const [bulkTemplate, setBulkTemplate] =
    useState<InstitutionAnnouncementTemplate>('selection');
  const [bulkCustomSubject, setBulkCustomSubject] = useState('');
  const [bulkCustomMessage, setBulkCustomMessage] = useState('');
  const [isSendingBulkAnnouncement, setIsSendingBulkAnnouncement] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const currentUser = tokenService.getUser();

    if (currentUser?.role !== 'INSTITUTION') {
      return;
    }

    let ignore = false;

    const loadInstitutionApplications = async () => {
      setIsLoadingInstitutionApplications(true);

      try {
        const response = await scholarshipApi.getInstitutionApplicationsByUser(
          currentUser.id,
        );
        const applications = response.data ?? [];

        if (ignore || applications.length === 0) {
          return;
        }

        const realCandidates = applications.map(mapApplicationToCandidate);
        setCandidates(realCandidates);
        setCandidateSource('real');

        setScholarships((currentScholarships) => {
          const mergedByTitle = new Map(
            currentScholarships.map((scholarship) => [scholarship.title, scholarship]),
          );

          applications.forEach((application) => {
            const title = application.scholarshipTitle || 'Unknown Scholarship';
            const existing = mergedByTitle.get(title);
            const applicantCount = applications.filter(
              (item) => (item.scholarshipTitle || 'Unknown Scholarship') === title,
            ).length;

            mergedByTitle.set(title, {
              id: application.scholarshipId ?? application.applicationId,
              title,
              status: existing?.status ?? 'active',
              deadline: existing?.deadline ?? 'N/A',
              applicants: applicantCount,
              shortlisted: realCandidates.filter(
                (candidate) =>
                  candidate.scholarship === title &&
                  candidate.status === 'shortlisted',
              ).length,
              selected: realCandidates.filter(
                (candidate) =>
                  candidate.scholarship === title &&
                  candidate.status === 'selected',
              ).length,
              amount: existing?.amount ?? 'N/A',
              duration: existing?.duration ?? 'N/A',
              level: existing?.level ?? 'N/A',
            });
          });

          return Array.from(mergedByTitle.values());
        });
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Could not load institution applications.',
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingInstitutionApplications(false);
        }
      }
    };

    loadInstitutionApplications();

    return () => {
      ignore = true;
    };
  }, []);

  const handleInstitutionLogout = async () => {
    if (!onLogout || isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleStartScholarshipEdit = (scholarship: Scholarship) => {
    setEditingScholarshipId(scholarship.id);
    setScholarshipDraft({ ...scholarship });
  };

  const handleCancelScholarshipEdit = () => {
    setEditingScholarshipId(null);
    setScholarshipDraft(null);
  };

  const handleScholarshipDraftChange = <Key extends ScholarshipEditableField>(
    field: Key,
    value: Scholarship[Key],
  ) => {
    setScholarshipDraft((currentDraft) =>
      currentDraft ? { ...currentDraft, [field]: value } : currentDraft,
    );
  };

  const handleSaveScholarship = () => {
    if (!scholarshipDraft) return;

    const trimmedTitle = scholarshipDraft.title.trim();

    if (!trimmedTitle) {
      toast.error('Scholarship title is required.');
      return;
    }

    const previousTitle = scholarships.find(
      (scholarship) => scholarship.id === scholarshipDraft.id,
    )?.title;
    const nextScholarship: Scholarship = {
      ...scholarshipDraft,
      title: trimmedTitle,
      amount: scholarshipDraft.amount.trim(),
      duration: scholarshipDraft.duration.trim(),
      level: scholarshipDraft.level.trim(),
    };

    setScholarships((previous) =>
      previous.map((scholarship) =>
        scholarship.id === nextScholarship.id ? nextScholarship : scholarship,
      ),
    );

    if (previousTitle && previousTitle !== nextScholarship.title) {
      setCandidates((previous) =>
        previous.map((candidate) =>
          candidate.scholarship === previousTitle
            ? { ...candidate, scholarship: nextScholarship.title }
            : candidate,
        ),
      );

      if (selectedScholarship === previousTitle) {
        setSelectedScholarship(nextScholarship.title);
      }
    }

    setEditingScholarshipId(null);
    setScholarshipDraft(null);
    toast.success(`${nextScholarship.title} updated.`);
  };

  const handleStatusChange = (candidateId: number, newStatus: string) => {
    const validStatuses: CandidateStatus[] = [
      'pending',
      'shortlisted',
      'selected',
      'rejected',
    ];

    if (!validStatuses.includes(newStatus as CandidateStatus)) {
      return;
    }

    const nextStatus = newStatus as CandidateStatus;
    const currentCandidate = candidates.find(
      (candidate) => candidate.id === candidateId,
    );

    if (!currentCandidate) return;

    if (currentCandidate.status === nextStatus) {
      toast.info(
        `${currentCandidate.name} is already ${candidateStatusLabels[nextStatus]}.`,
      );
      return;
    }

    setCandidates((previous) =>
      previous.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, status: nextStatus }
          : candidate,
      ),
    );
    const nextReviewAction: CandidateReviewAction | null =
      nextStatus === 'pending' ? null : nextStatus;

    setActiveReviewAction((previous) => ({
      ...previous,
      [candidateId]: nextReviewAction,
    }));

    if (nextStatus === 'selected') {
      toast.success(
        `${currentCandidate.name} has been selected for ${currentCandidate.scholarship}.`,
      );
      return;
    }

    if (nextStatus === 'shortlisted') {
      toast.success(
        `${currentCandidate.name} has been shortlisted for further review.`,
      );
      return;
    }

    if (nextStatus === 'rejected') {
      toast.error(`${currentCandidate.name} has been rejected.`);
      return;
    }

    toast.info(
      `${currentCandidate.name} moved back to pending review.`,
    );
  };

  const handleAnnouncement = async (candidateId: number) => {
    const candidate = candidates.find((item) => item.id === candidateId);
    if (!candidate) return;

    if (!canSendCandidateAnnouncement(candidate.status)) {
      toast.info('Move the candidate to shortlisted, selected, or rejected before sending an outcome email.');
      return;
    }

    const candidateEmail = normalizeEmail(candidate.email);
    if (!EMAIL_PATTERN.test(candidateEmail)) {
      toast.error(`Add a valid email address for ${candidate.name} before sending.`);
      return;
    }

    const content = buildCandidateAnnouncementContent(candidate);

    setActiveReviewAction((previous) => ({
      ...previous,
      [candidateId]: 'announcement',
    }));

    try {
      const response = await notificationApi.sendAnnouncement({
        recipientGroup: 'CUSTOM',
        recipients: [{ email: candidateEmail, name: candidate.name }],
        subject: content.subject,
        message: content.message,
        dedupeKey: buildCandidateOutcomeDedupeKey(candidate.status, candidate.scholarship),
      });

      if (!response.success || response.data.failedCount > 0) {
        toast.error(
          response.data.failures[0]?.errorMessage ||
          response.message ||
          content.failureMessage,
        );
        return;
      }

      if (response.data.skippedDuplicateCount > 0) {
        toast.info(`${candidate.name} already received this ${content.label.toLowerCase()}.`);
      } else {
        toast.success(content.successMessage);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : content.failureMessage,
      );
    }
  };

  const handleBulkRecipientGroupChange = (nextGroup: InstitutionBulkRecipientGroup) => {
    setBulkRecipientGroup(nextGroup);

    if (bulkTemplate === 'custom') {
      return;
    }

    if (nextGroup === 'rejected') {
      setBulkTemplate('rejection');
    } else if (nextGroup === 'shortlisted' && bulkTemplate === 'selection') {
      setBulkTemplate('shortlist');
    } else if (nextGroup === 'selected' && bulkTemplate === 'rejection') {
      setBulkTemplate('selection');
    } else if (nextGroup === 'all' && bulkTemplate === 'rejection') {
      setBulkTemplate('received');
    }
  };

  const bulkAnnouncementCandidates = useMemo(
    () =>
      candidates.filter((candidate) => {
        const matchesScholarship =
          bulkScholarship === 'all' || candidate.scholarship === bulkScholarship;
        const matchesStatus =
          bulkRecipientGroup === 'all' || candidate.status === bulkRecipientGroup;

        return matchesScholarship && matchesStatus;
      }),
    [bulkRecipientGroup, bulkScholarship, candidates],
  );

  const bulkAnnouncementSummary = useMemo(
    () => buildBulkRecipientSummary(bulkAnnouncementCandidates),
    [bulkAnnouncementCandidates],
  );

  const buildBulkAnnouncementContent = (
    recipientCount: number,
    scholarshipOverride = bulkScholarship,
  ) => {
    const scholarshipName =
      scholarshipOverride === 'all' ? 'your scholarship application' : scholarshipOverride;
    const audienceLabel =
      bulkRecipientGroup === 'all'
        ? 'applicants'
        : `${candidateStatusLabels[bulkRecipientGroup]} candidates`;

    if (bulkTemplate === 'shortlist') {
      return {
        subject: `Shortlist update - ${scholarshipName}`,
        message: `You have been shortlisted for ${scholarshipName}. Our institution team will contact you with the next review steps.\n\nThis update is being sent to ${recipientCount} ${audienceLabel}.`,
      };
    }

    if (bulkTemplate === 'received') {
      return {
        subject: `Application received - ${scholarshipName}`,
        message: `We have received your application for ${scholarshipName}. Please monitor your email for review updates and document requests.\n\nThis update is being sent to ${recipientCount} ${audienceLabel}.`,
      };
    }

    if (bulkTemplate === 'rejection') {
      return {
        subject: `Application outcome - ${scholarshipName}`,
        message: `Thank you for applying for ${scholarshipName}.\n\nAfter careful review, your application has not been selected for this round. We appreciate the time you invested and encourage you to continue applying for suitable opportunities.\n\nThis update is being sent to ${recipientCount} ${audienceLabel}.`,
      };
    }

    if (bulkTemplate === 'deadline') {
      return {
        subject: `Deadline reminder - ${scholarshipName}`,
        message: `This is a reminder to complete all pending requirements for ${scholarshipName} before the published deadline.\n\nThis update is being sent to ${recipientCount} ${audienceLabel}.`,
      };
    }

    if (bulkTemplate === 'custom') {
      return {
        subject: bulkCustomSubject.trim(),
        message: bulkCustomMessage.trim(),
      };
    }

    return {
      subject: `Selection announcement - ${scholarshipName}`,
      message: `Selection updates are now available for ${scholarshipName}. Selected candidates will receive next-step instructions from our institution team.\n\nThis update is being sent to ${recipientCount} ${audienceLabel}.`,
    };
  };

  const handleBulkAnnouncement = async () => {
    const { recipients, invalidCandidates } = bulkAnnouncementSummary;

    if (recipients.length === 0) {
      toast.error('No valid recipient emails match the selected announcement filters.');
      return;
    }

    if (invalidCandidates.length > 0) {
      const preview = invalidCandidates
        .slice(0, 3)
        .map((candidate) => candidate.name)
        .join(', ');
      toast.error(
        `Fix missing or invalid emails for ${invalidCandidates.length} candidate(s): ${preview}`,
      );
      return;
    }

    const content = buildBulkAnnouncementContent(recipients.length);

    if (!content.subject || !content.message) {
      toast.error('Add a subject and message before sending the custom announcement.');
      return;
    }

    const outcomeStatus = bulkTemplateOutcomeStatus(bulkTemplate);

    setIsSendingBulkAnnouncement(true);

    try {
      const responses: AnnouncementResponse[] = [];

      if (outcomeStatus && bulkScholarship === 'all') {
        const candidatesByScholarship = new Map<string, Candidate[]>();
        bulkAnnouncementCandidates.forEach((candidate) => {
          const scholarshipCandidates =
            candidatesByScholarship.get(candidate.scholarship) ?? [];
          scholarshipCandidates.push(candidate);
          candidatesByScholarship.set(candidate.scholarship, scholarshipCandidates);
        });

        for (const [scholarshipName, scholarshipCandidates] of candidatesByScholarship) {
          const scholarshipSummary = buildBulkRecipientSummary(scholarshipCandidates);
          if (scholarshipSummary.recipients.length === 0) {
            continue;
          }

          const scholarshipContent = buildBulkAnnouncementContent(
            scholarshipSummary.recipients.length,
            scholarshipName,
          );
          const response = await notificationApi.sendAnnouncement({
            recipientGroup: 'CUSTOM',
            recipients: scholarshipSummary.recipients,
            subject: scholarshipContent.subject,
            message: scholarshipContent.message,
            dedupeKey: buildCandidateOutcomeDedupeKey(outcomeStatus, scholarshipName),
          });
          responses.push(response.data);
        }
      } else {
        const response = await notificationApi.sendAnnouncement({
          recipientGroup: 'CUSTOM',
          recipients,
          subject: content.subject,
          message: content.message,
          dedupeKey:
            outcomeStatus && bulkScholarship !== 'all'
              ? buildCandidateOutcomeDedupeKey(outcomeStatus, bulkScholarship)
              : undefined,
        });
        responses.push(response.data);
      }

      const aggregateResult = responses.reduce(
        (summary, result) => ({
          sentCount: summary.sentCount + result.sentCount,
          failedCount: summary.failedCount + result.failedCount,
          skippedDuplicateCount:
            summary.skippedDuplicateCount + result.skippedDuplicateCount,
          failures: [...summary.failures, ...result.failures],
        }),
        {
          sentCount: 0,
          failedCount: 0,
          skippedDuplicateCount: 0,
          failures: [] as AnnouncementResponse['failures'],
        },
      );

      if (aggregateResult.failedCount > 0) {
        const failurePreview = aggregateResult.failures
          .slice(0, 3)
          .map((failure) => `${failure.recipientEmail}: ${failure.errorMessage || failure.status}`)
          .join('; ');
        toast.error(
          failurePreview
            ? `Bulk announcement completed with failures. ${failurePreview}`
            : `Sent ${aggregateResult.sentCount}; ${aggregateResult.failedCount} failed.`,
        );
        return;
      }

      if (aggregateResult.sentCount === 0 && aggregateResult.skippedDuplicateCount > 0) {
        toast.info(
          `No new emails sent. ${aggregateResult.skippedDuplicateCount} candidate(s) already received this announcement.`,
        );
      } else if (aggregateResult.skippedDuplicateCount > 0) {
        toast.success(
          `Bulk announcement sent to ${aggregateResult.sentCount} candidate(s); ${aggregateResult.skippedDuplicateCount} duplicate(s) skipped.`,
        );
      } else {
        toast.success(`Bulk announcement sent to ${aggregateResult.sentCount} candidates.`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Could not send bulk announcement.',
      );
    } finally {
      setIsSendingBulkAnnouncement(false);
    }
  };

  const handleViewCandidate = (candidate: Candidate) => {
    const deliverableCandidate = withDeliverableCandidateEmail(candidate);

    setCandidates((currentCandidates) =>
      currentCandidates.some((item) => item.id === deliverableCandidate.id)
        ? currentCandidates
        : [...currentCandidates, deliverableCandidate],
    );
    setSelectedCandidateProfile(deliverableCandidate.id);
  };

  const filteredCandidates = candidates
    .filter((c) => selectedScholarship === 'all' || c.scholarship === selectedScholarship)
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((c) => statusFilter === 'all' || c.status === statusFilter)
    .sort((a, b) => b.matchScore - a.matchScore) // Sort by match score (highest first)
    .slice(0, 10); // Limit to top 10 candidates

  const selectedCandidate = selectedCandidateProfile
    ? candidates.find((candidate) => candidate.id === selectedCandidateProfile) ?? null
    : null;

  const selectedScholarshipProfile = selectedCandidate
    ? scholarshipRequirementProfiles[selectedCandidate.scholarship] ??
    buildFallbackRequirementProfile(selectedCandidate)
    : null;

  const selectedEvidenceProfile = selectedCandidate
    ? buildCandidateEvidenceProfile(selectedCandidate)
    : null;

  const selectedRequirementChecks =
    selectedCandidate && selectedScholarshipProfile && selectedEvidenceProfile
      ? buildRequirementChecks(
        selectedCandidate,
        selectedScholarshipProfile,
        selectedEvidenceProfile,
      )
      : [];

  const matchedRequirementCount = selectedRequirementChecks.filter(
    (check) => check.matched,
  ).length;

  const requirementCoverage = selectedRequirementChecks.length
    ? Math.round(
      (matchedRequirementCount / selectedRequirementChecks.length) * 100,
    )
    : 0;

  const missingRequiredDocuments =
    selectedScholarshipProfile && selectedEvidenceProfile
      ? selectedScholarshipProfile.requiredDocuments.filter(
        (requiredDocument) =>
          !selectedEvidenceProfile.uploadedDocuments.some((uploadedDocument) =>
            uploadedDocument
              .toLowerCase()
              .includes(requiredDocument.toLowerCase()),
          ),
      )
      : [];

  const analyticsData = useMemo(() => {
    const selectedPeriodDays =
      timePeriod === 'all' ? null : Number.parseInt(timePeriod, 10) || 30;
    const now = new Date();
    const datedCandidates = candidates.map((candidate) => ({
      candidate,
      appliedAt: parseAppliedDate(candidate.appliedDate),
    }));
    const datedApplications = datedCandidates.filter(
      (entry): entry is { candidate: Candidate; appliedAt: Date } =>
        Boolean(entry.appliedAt),
    );
    const firstApplicationDate = datedApplications.reduce<Date | null>(
      (earliest, { appliedAt }) =>
        !earliest || appliedAt < earliest ? appliedAt : earliest,
      null,
    );
    const lastApplicationDate = datedApplications.reduce<Date | null>(
      (latest, { appliedAt }) =>
        !latest || appliedAt > latest ? appliedAt : latest,
      null,
    );
    const periodLengthMs = selectedPeriodDays ? selectedPeriodDays * DAY_IN_MS : 0;
    const periodStart = selectedPeriodDays
      ? new Date(now.getTime() - periodLengthMs)
      : firstApplicationDate;
    const previousPeriodStart =
      selectedPeriodDays && periodStart
        ? new Date(periodStart.getTime() - periodLengthMs)
        : null;

    const periodCandidates = selectedPeriodDays
      ? datedApplications.filter(
        ({ appliedAt }) =>
          periodStart && appliedAt >= periodStart && appliedAt <= now,
      )
      : datedApplications;
    const previousPeriodCandidates =
      selectedPeriodDays && previousPeriodStart && periodStart
        ? datedApplications.filter(
          ({ appliedAt }) =>
            appliedAt >= previousPeriodStart && appliedAt < periodStart,
        )
        : [];
    const totalApplicants = candidates.length;
    const periodApplicantCount =
      selectedPeriodDays === null ? totalApplicants : periodCandidates.length;
    const statusCounts = analyticsStatusConfig.reduce(
      (counts, { status }) => ({
        ...counts,
        [status]: candidates.filter((candidate) => candidate.status === status).length,
      }),
      {
        pending: 0,
        shortlisted: 0,
        selected: 0,
        rejected: 0,
      } as Record<CandidateStatus, number>,
    );
    const averageMatchScore = totalApplicants
      ? candidates.reduce((total, candidate) => total + candidate.matchScore, 0) /
      totalApplicants
      : 0;
    const applicationChangePercent = previousPeriodCandidates.length
      ? ((periodCandidates.length - previousPeriodCandidates.length) /
        previousPeriodCandidates.length) *
      100
      : selectedPeriodDays && periodCandidates.length > 0
        ? 100
        : 0;
    const applicationChangeLabel =
      selectedPeriodDays === null
        ? `${periodApplicantCount} applicants in total`
        : previousPeriodCandidates.length > 0
        ? `${formatPercent(applicationChangePercent)} vs previous period`
        : periodCandidates.length > 0
          ? `${periodCandidates.length} more than previous period`
          : 'No applications in the previous period';
    const periodLabel =
      selectedPeriodDays === null ? 'All time' : `Last ${selectedPeriodDays} days`;
    const periodMetricTitle =
      selectedPeriodDays === null ? 'Applicants on Record' : 'New Applications';
    const shouldShowHistoricalChart =
      selectedPeriodDays !== null &&
      periodCandidates.length === 0 &&
      datedApplications.length > 0;
    const chartApplications = shouldShowHistoricalChart
      ? datedApplications
      : periodCandidates;
    const chartStart =
      shouldShowHistoricalChart || selectedPeriodDays === null
        ? firstApplicationDate ?? now
        : periodStart ?? now;
    const chartEndCandidate =
      shouldShowHistoricalChart || selectedPeriodDays === null
        ? lastApplicationDate ?? now
        : now;
    const chartEnd =
      chartEndCandidate.getTime() <= chartStart.getTime()
        ? new Date(chartStart.getTime() + DAY_IN_MS)
        : chartEndCandidate;
    const chartPeriodDays = Math.max(
      1,
      Math.ceil((chartEnd.getTime() - chartStart.getTime()) / DAY_IN_MS),
    );
    const chartLabel =
      shouldShowHistoricalChart || selectedPeriodDays === null
        ? 'All available application history'
        : periodLabel;
    const chartEmptyMessage = shouldShowHistoricalChart
      ? 'Showing all available application history because the selected period has no applications.'
      : 'No applications were submitted in the selected period.';
    const bucketCount = chartPeriodDays <= 7 ? 7 : chartPeriodDays <= 180 ? 6 : 12;
    const bucketLengthMs =
      Math.max(DAY_IN_MS, chartEnd.getTime() - chartStart.getTime()) / bucketCount;
    const applicationBuckets = Array.from({ length: bucketCount }, (_, index) => {
      const bucketStart = new Date(chartStart.getTime() + bucketLengthMs * index);
      const bucketEnd =
        index === bucketCount - 1
          ? chartEnd
          : new Date(chartStart.getTime() + bucketLengthMs * (index + 1));
      const count = chartApplications.filter(
        ({ appliedAt }) =>
          appliedAt >= bucketStart &&
          (index === bucketCount - 1 ? appliedAt <= bucketEnd : appliedAt < bucketEnd),
      ).length;

      return {
        label: formatAnalyticsDateLabel(bucketStart, chartPeriodDays),
        count,
      };
    });
    const maxBucketCount = Math.max(...applicationBuckets.map((bucket) => bucket.count), 1);
    const scholarshipSummaryMap = candidates.reduce((summaryByScholarship, candidate) => {
        const existing =
          summaryByScholarship.get(candidate.scholarship) ?? {
            title: candidate.scholarship,
            applications: 0,
            shortlisted: 0,
            selected: 0,
            rejected: 0,
            matchScoreTotal: 0,
          };

        existing.applications += 1;
        existing.matchScoreTotal += candidate.matchScore;

        if (candidate.status === 'shortlisted') existing.shortlisted += 1;
        if (candidate.status === 'selected') existing.selected += 1;
        if (candidate.status === 'rejected') existing.rejected += 1;

        summaryByScholarship.set(candidate.scholarship, existing);
        return summaryByScholarship;
      }, new Map<string, {
        title: string;
        applications: number;
        shortlisted: number;
        selected: number;
        rejected: number;
        matchScoreTotal: number;
      }>());
    const scholarshipSummaries = Array.from(scholarshipSummaryMap.values())
      .map((summary) => ({
        ...summary,
        averageMatchScore: summary.applications
          ? summary.matchScoreTotal / summary.applications
          : 0,
        selectionRate: summary.applications
          ? (summary.selected / summary.applications) * 100
          : 0,
      }))
      .sort(
        (first, second) =>
          second.applications - first.applications ||
          second.selected - first.selected ||
          second.averageMatchScore - first.averageMatchScore,
      )
      .slice(0, 5);
    const statusRows = analyticsStatusConfig.map((config) => {
      const count = statusCounts[config.status];

      return {
        ...config,
        count,
        percentage: totalApplicants ? (count / totalApplicants) * 100 : 0,
      };
    });

    return {
      periodLabel,
      periodMetricTitle,
      totalApplicants,
      periodApplicants: periodApplicantCount,
      applicationChangeLabel,
      applicationBuckets,
      maxBucketCount,
      chartLabel,
      chartEmptyMessage,
      isShowingHistoricalFallback: shouldShowHistoricalChart,
      hasChartApplications: chartApplications.length > 0,
      averageMatchScore,
      highMatchApplicants: candidates.filter((candidate) => candidate.matchScore >= 85).length,
      activeScholarships: scholarships.filter((scholarship) => scholarship.status === 'active').length,
      statusCounts,
      statusRows,
      scholarshipSummaries,
      selectionRate: totalApplicants ? (statusCounts.selected / totalApplicants) * 100 : 0,
      reviewCompletionRate: totalApplicants
        ? ((statusCounts.shortlisted + statusCounts.selected + statusCounts.rejected) /
          totalApplicants) *
        100
        : 0,
      periodShare: totalApplicants ? (periodApplicantCount / totalApplicants) * 100 : 0,
    };
  }, [candidates, scholarships, timePeriod]);

  const decisionRecommendation = !selectedCandidate
    ? ''
    : selectedCandidate.matchScore >= 94 && requirementCoverage >= 80
      ? 'High-confidence candidate. Strong fit for selection if interview confirms motivation.'
      : selectedCandidate.matchScore >= 88 && requirementCoverage >= 65
        ? 'Good candidate. Shortlist recommended and request any missing evidence before final selection.'
        : 'Fit is moderate. Review missing requirements carefully before progressing this application.';

  const handleDownloadApplication = (
    candidate: Candidate,
    scholarshipProfile: ScholarshipRequirementProfile,
    evidenceProfile: CandidateEvidenceProfile,
    requirementChecks: RequirementCheck[],
  ) => {
    try {
      const lines = [
        'Scholar-Finder Candidate Application Review',
        '========================================',
        '',
        'Candidate Information',
        `- Name: ${candidate.name}`,
        `- Email: ${candidate.email}`,
        `- Phone: ${candidate.phone}`,
        `- Location: ${candidate.location}`,
        `- Applied Date: ${candidate.appliedDate}`,
        `- Current Status: ${candidate.status}`,
        '',
        'Scholarship Information',
        `- Scholarship: ${candidate.scholarship}`,
        `- Match Score: ${candidate.matchScore}%`,
        `- Requirement Coverage: ${requirementCoverage}%`,
        '',
        'Academic Qualifications',
        `- GPA: ${candidate.gpa}`,
        `- A/L Results: ${candidate.alResults}`,
        `- Level: ${candidate.level}`,
        `- Current Program: ${evidenceProfile.currentProgram}`,
        `- Field of Study: ${evidenceProfile.fieldOfStudy}`,
        `- English Test: ${evidenceProfile.englishTest} (${evidenceProfile.englishScore})`,
        '',
        'Scholarship Requirement Profile',
        `- Summary: ${scholarshipProfile.summary}`,
        `- Minimum GPA: ${scholarshipProfile.minimumGpa}`,
        `- Required Level: ${scholarshipProfile.requiredLevel}`,
        `- Minimum A/L Results: ${scholarshipProfile.minimumAlResults}`,
        '',
        'Requirement Match Breakdown',
        ...requirementChecks.map(
          (check) =>
            `- [${check.matched ? 'MATCHED' : 'NEEDS REVIEW'}] ${check.requirement} | Evidence: ${check.evidence}`,
        ),
        '',
        'Selection Criteria',
        ...scholarshipProfile.selectionCriteria.map((criterion) => `- ${criterion}`),
        '',
        'Uploaded Documents',
        ...evidenceProfile.uploadedDocuments.map((doc) => `- ${doc}`),
        '',
        'Missing Required Documents',
        ...(missingRequiredDocuments.length > 0
          ? missingRequiredDocuments.map((doc) => `- ${doc}`)
          : ['- None']),
        '',
        'Experience Highlights',
        ...evidenceProfile.experienceHighlights.map((item) => `- ${item}`),
        '',
        'Leadership Highlights',
        ...evidenceProfile.leadershipHighlights.map((item) => `- ${item}`),
        '',
        'Certifications',
        ...evidenceProfile.certifications.map((item) => `- ${item}`),
        '',
        'Personal Statement Summary',
        evidenceProfile.personalStatementSummary,
      ];

      const fileContent = lines.join('\n');
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileSafeName = candidate.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

      link.href = url;
      link.download = `${fileSafeName || 'candidate'}-full-application.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setActiveReviewAction((previous) => ({
        ...previous,
        [candidate.id]: 'download',
      }));

      toast.success(`Downloaded full application for ${candidate.name}.`);
    } catch (error) {
      console.error('Failed to download application file:', error);
      toast.error('Could not generate the application download. Please try again.');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-900">8</p>
          <p className="text-sm text-blue-700">Active Scholarships</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-900">448</p>
          <p className="text-sm text-purple-700">Total Applicants</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-600 p-3 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-900">68</p>
          <p className="text-sm text-green-700">Shortlisted</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-600 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-900">15</p>
          <p className="text-sm text-orange-700">Selected Candidates</p>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Recent Applications</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {filteredCandidates.slice(0, 5).map((candidate) => (
            <div
              key={candidate.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-full">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{candidate.name}</h4>
                  <p className="text-sm text-slate-600">{candidate.scholarship}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <p className="font-semibold text-slate-900">{candidate.matchScore}% Match</p>
                  </div>
                  <p className="text-sm text-slate-600">{candidate.appliedDate}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewCandidate(candidate)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderScholarships = () => {
    // If a scholarship is selected for detail view, show that instead
    if (selectedScholarshipDetail) {
      const scholarship = scholarships.find(s => s.id === selectedScholarshipDetail);
      if (!scholarship) return null;

      const storedScholarshipCandidates = candidates
        .filter(c => c.scholarship === scholarship.title)
        .sort((a, b) => b.matchScore - a.matchScore);
      const isShowingSampleApplicants = storedScholarshipCandidates.length === 0;
      const scholarshipCandidates = isShowingSampleApplicants
        ? buildFallbackScholarshipCandidates(scholarship)
        : storedScholarshipCandidates;

      return (
        <div className="space-y-6">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => setSelectedScholarshipDetail(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scholarships
          </Button>

          {/* Scholarship Header */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-lg border border-blue-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{scholarship.title}</h2>
                    <p className="text-slate-600 mt-1">Detailed Overview & Applicant List</p>
                  </div>
                </div>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${scholarship.status === 'active'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
                  }`}
              >
                {scholarship.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-medium text-slate-600">Amount</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{scholarship.amount}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <p className="text-sm font-medium text-slate-600">Duration</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{scholarship.duration}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <p className="text-sm font-medium text-slate-600">Level</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{scholarship.level}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <p className="text-sm font-medium text-slate-600">Deadline</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">{scholarship.deadline}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-blue-200">
              <div className="text-center bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-6 h-6 text-slate-600" />
                  <p className="text-4xl font-bold text-slate-900">{scholarship.applicants}</p>
                </div>
                <p className="text-sm font-medium text-slate-600">Total Applicants</p>
              </div>
              <div className="text-center bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-blue-600" />
                  <p className="text-4xl font-bold text-blue-600">{scholarship.shortlisted}</p>
                </div>
                <p className="text-sm font-medium text-slate-600">Shortlisted</p>
              </div>
              <div className="text-center bg-white/60 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-4xl font-bold text-green-600">{scholarship.selected}</p>
                </div>
                <p className="text-sm font-medium text-slate-600">Selected</p>
              </div>
            </div>
          </Card>

          {/* Applicants List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">All Applicants</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {isShowingSampleApplicants
                    ? 'Showing sample applicant data until real applications arrive'
                    : 'Sorted by match score (highest to lowest)'}
                </p>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export List
              </Button>
            </div>

            <div className="space-y-3">
              {scholarshipCandidates.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-full">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{candidate.name}</h4>
                      <p className="text-sm text-slate-600">{candidate.email}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-slate-600">GPA</p>
                        <p className="font-semibold text-slate-900">{candidate.gpa}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">A/L Results</p>
                        <p className="font-semibold text-slate-900">{candidate.alResults}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xl font-bold text-slate-900">{candidate.matchScore}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${candidate.status === 'selected' ? 'bg-green-100 text-green-700' :
                      candidate.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                        candidate.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                      }`}>
                      {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewCandidate(candidate)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    // Original scholarship list view
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Manage Scholarships</h2>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setShowPostScholarshipForm(true)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Add New Scholarship
          </Button>
        </div>

        <div className="grid gap-6">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 bg-[rgba(107,171,246,0.18)]">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{scholarship.title}</h3>
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm ${scholarship.status === 'active'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
                        }`}
                    >
                      {scholarship.status.toUpperCase()}
                    </span>
                  </div>
                  {editingScholarshipId === scholarship.id && scholarshipDraft ? (
                    <div className="mt-6 rounded-xl border border-purple-200 bg-white/90 p-5 shadow-sm">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={scholarshipDraft.title}
                            onChange={(event) =>
                              handleScholarshipDraftChange('title', event.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <select
                            value={scholarshipDraft.status}
                            onChange={(event) =>
                              handleScholarshipDraftChange(
                                'status',
                                event.target.value as ScholarshipStatus,
                              )
                            }
                            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2"
                          >
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                        <div>
                          <Label>Deadline</Label>
                          <Input
                            type="date"
                            value={scholarshipDraft.deadline}
                            onChange={(event) =>
                              handleScholarshipDraftChange('deadline', event.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Amount</Label>
                          <Input
                            value={scholarshipDraft.amount}
                            onChange={(event) =>
                              handleScholarshipDraftChange('amount', event.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Input
                            value={scholarshipDraft.duration}
                            onChange={(event) =>
                              handleScholarshipDraftChange('duration', event.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Level</Label>
                          <Input
                            value={scholarshipDraft.level}
                            onChange={(event) =>
                              handleScholarshipDraftChange('level', event.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          <p className="text-sm font-medium text-slate-600">Amount</p>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{scholarship.amount}</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <p className="text-sm font-medium text-slate-600">Duration</p>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{scholarship.duration}</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="w-4 h-4 text-indigo-600" />
                          <p className="text-sm font-medium text-slate-600">Level</p>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{scholarship.level}</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          <p className="text-sm font-medium text-slate-600">Deadline</p>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{scholarship.deadline}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-blue-200 pt-6 mt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Users className="w-5 h-5 text-slate-600" />
                        <p className="text-3xl font-bold text-slate-900">{scholarship.applicants}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-600">Applicants</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Star className="w-5 h-5 text-blue-600" />
                        <p className="text-3xl font-bold text-blue-600">{scholarship.shortlisted}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-600">Shortlisted</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-3xl font-bold text-green-600">{scholarship.selected}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-600">Selected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedScholarshipDetail(scholarship.id)}
                      className="flex-1 md:flex-initial bg-white hover:bg-blue-50 border-blue-300 text-blue-700 font-semibold hover:border-blue-400 shadow-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {editingScholarshipId === scholarship.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={handleSaveScholarship}
                          className="flex-1 md:flex-initial bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelScholarshipEdit}
                          className="flex-1 md:flex-initial bg-white hover:bg-slate-50 border-slate-300 text-slate-700 font-semibold shadow-sm"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartScholarshipEdit(scholarship)}
                        className="flex-1 md:flex-initial bg-white hover:bg-purple-50 border-purple-300 text-purple-700 font-semibold hover:border-purple-400 shadow-sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-red-50 border-red-300 text-red-600 hover:text-red-700 font-semibold hover:border-red-400 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCandidates = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Top 10 Candidates</h2>
          <p className="text-sm text-slate-600 mt-1">Showing best matches sorted by compatibility score</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-64 shadow-md"
            />
          </div>
          <select
            value={selectedScholarship}
            onChange={(e) => setSelectedScholarship(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="all">All Scholarships</option>
            {scholarships.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCandidates.map((candidate, index) => (
          <Card
            key={candidate.id}
            className={`p-6 hover:shadow-lg transition-shadow ${candidate.status === 'selected'
              ? 'bg-gradient-to-br from-green-100 via-green-50 to-white border-green-300'
              : candidate.status === 'shortlisted'
                ? 'bg-gradient-to-br from-blue-100 via-blue-50 to-white border-blue-300'
                : candidate.status === 'rejected'
                  ? 'bg-gradient-to-br from-red-100 via-red-50 to-white border-red-300'
                  : 'bg-gradient-to-br from-slate-100 via-slate-50 to-white border-slate-300'
              }`}
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Candidate Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`p-4 rounded-full ${candidate.status === 'selected'
                        ? 'bg-gradient-to-br from-green-600 to-emerald-600'
                        : candidate.status === 'shortlisted'
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                          : candidate.status === 'rejected'
                            ? 'bg-gradient-to-br from-red-600 to-rose-600'
                            : 'bg-gradient-to-br from-slate-600 to-slate-700'
                        }`}>
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{candidate.name}</h3>
                      <p className="text-sm text-slate-600">{candidate.scholarship}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xl font-bold text-slate-900">{candidate.matchScore}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600">Email</p>
                      <p className="text-sm font-medium text-slate-900">{candidate.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600">Phone</p>
                      <p className="text-sm font-medium text-slate-900">{candidate.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600">Location</p>
                      <p className="text-sm font-medium text-slate-900">{candidate.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600">Applied</p>
                      <p className="text-sm font-medium text-slate-900">{candidate.appliedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                    <p className="text-sm font-medium text-blue-700">GPA: {candidate.gpa}</p>
                  </div>
                  <div className="bg-purple-50 px-3 py-1 rounded-full">
                    <p className="text-sm font-medium text-purple-700">
                      A/L: {candidate.alResults}
                    </p>
                  </div>
                  <div className="bg-indigo-50 px-3 py-1 rounded-full">
                    <p className="text-sm font-medium text-indigo-700">{candidate.level}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 lg:w-64">
                <Label className="text-sm font-medium text-slate-700">Status</Label>
                <select
                  value={candidate.status}
                  onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                  className={`px-3 py-2 border rounded-lg text-sm font-medium ${candidate.status === 'selected'
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : candidate.status === 'shortlisted'
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : candidate.status === 'rejected'
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                >
                  <option value="pending">Pending Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewCandidate(candidate)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Profile
                </Button>

                {canSendCandidateAnnouncement(candidate.status) && (
                  <Button
                    size="sm"
                    className={`w-full ${getAnnouncementButtonClass(candidate.status)}`}
                    onClick={() => handleAnnouncement(candidate.id)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send {candidateAnnouncementLabels[candidate.status]}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics & Insights</h2>
          <p className="text-sm text-slate-600">
            {candidateSource === 'real'
              ? 'Using real institution application records'
              : 'Using sample candidates until institution applications are available'}
          </p>
        </div>
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm"
        >
          <option value="all">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 3 Months</option>
          <option value="180">Last 6 Months</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">{analyticsData.periodMetricTitle}</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">
            {analyticsData.periodApplicants}
          </p>
          <p className="text-sm text-slate-600">
            {analyticsData.applicationChangeLabel}
          </p>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${clampPercent(analyticsData.periodShare)}%` }}
            ></div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Average Match Score</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">
            {formatPercent(analyticsData.averageMatchScore)}
          </p>
          <p className="text-sm text-slate-600">
            {analyticsData.highMatchApplicants} applicants at 85%+ match
          </p>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${clampPercent(analyticsData.averageMatchScore)}%` }}
            ></div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Selection Rate</h3>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">
            {formatPercent(analyticsData.selectionRate)}
          </p>
          <p className="text-sm text-slate-600">
            {analyticsData.statusCounts.selected} selected from {analyticsData.totalApplicants} applicants
          </p>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${clampPercent(analyticsData.selectionRate)}%` }}
            ></div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Applications Over Time</h3>
          <p className="text-sm text-slate-600">
            {analyticsData.chartLabel}
          </p>
        </div>
        <div className="h-64 flex items-end justify-between gap-2">
          {analyticsData.applicationBuckets.map((bucket, index) => (
            <div key={`${bucket.label}-${index}`} className="flex-1 flex flex-col items-center gap-2">
              <p className="text-xs font-medium text-slate-700">{bucket.count}</p>
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500"
                style={{
                  height: `${bucket.count > 0
                    ? Math.max((bucket.count / analyticsData.maxBucketCount) * 100, 8)
                    : 2
                    }%`,
                }}
              ></div>
              <p className="text-xs text-slate-600 text-center">
                {bucket.label}
              </p>
            </div>
          ))}
        </div>
        {(analyticsData.isShowingHistoricalFallback || !analyticsData.hasChartApplications) && (
          <p className="mt-3 text-sm text-slate-500">
            {analyticsData.chartEmptyMessage}
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Top Performing Scholarships</h3>
          <div className="space-y-3">
            {analyticsData.scholarshipSummaries.map((scholarship, index) => (
              <div key={scholarship.title} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{scholarship.title}</p>
                    <p className="text-xs text-slate-600">{scholarship.applications} applications</p>
                    <p className="text-xs text-slate-500">
                      {formatPercent(scholarship.averageMatchScore)} avg match
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    {formatPercent(scholarship.selectionRate)}
                  </p>
                  <p className="text-xs text-slate-600">selection rate</p>
                  <p className="text-xs text-slate-500">
                    {scholarship.shortlisted} shortlisted
                  </p>
                </div>
              </div>
            ))}
            {analyticsData.scholarshipSummaries.length === 0 && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
                <p className="font-medium text-slate-900">No scholarship data yet</p>
                <p className="mt-1 text-sm text-slate-600">
                  Application analytics will appear after candidates apply.
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Candidate Distribution</h3>
            <p className="text-sm text-slate-600">
              {analyticsData.totalApplicants} total
            </p>
          </div>
          <div className="space-y-4">
            {analyticsData.statusRows.map((row) => (
              <div key={row.status}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-600">{row.label}</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {row.count} ({formatPercent(row.percentage)})
                  </p>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.barClassName}`}
                    style={{ width: `${clampPercent(row.percentage)}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="rounded-lg bg-indigo-50 p-3">
              <p className="text-xs font-medium uppercase text-indigo-700">Reviewed</p>
              <p className="mt-1 text-lg font-bold text-indigo-900">
                {formatPercent(analyticsData.reviewCompletionRate)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAnnouncements = () => {
    const bulkRecipientCount = bulkAnnouncementSummary.recipients.length;
    const matchedCandidateCount = bulkAnnouncementSummary.candidates.length;
    const skippedCandidateCount = bulkAnnouncementSummary.invalidCandidates.length;
    const isCustomTemplateIncomplete =
      bulkTemplate === 'custom' &&
      (!bulkCustomSubject.trim() || !bulkCustomMessage.trim());

    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Announcements</h2>
          <p className="text-sm text-slate-600">
            {candidateSource === 'real'
              ? 'Using real institution application records'
              : 'Using sample candidates until an institution session has real applications'}
          </p>
        </div>
        {isLoadingInstitutionApplications && (
          <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm text-purple-700">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading applications
          </div>
        )}
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Outcome Announcements</h3>
        <div className="space-y-4">
          {filteredCandidates
            .filter((c) => canSendCandidateAnnouncement(c.status))
            .map((candidate) => (
              <div
                key={candidate.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  candidate.status === 'selected'
                    ? 'bg-green-50 border border-green-200'
                    : candidate.status === 'shortlisted'
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full ${
                      candidate.status === 'selected'
                        ? 'bg-green-600'
                        : candidate.status === 'shortlisted'
                          ? 'bg-blue-600'
                          : 'bg-red-600'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{candidate.name}</h4>
                    <p className="text-sm text-slate-600">{candidate.scholarship}</p>
                    <p className="text-xs text-slate-500">{candidate.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className={getAnnouncementButtonClass(candidate.status)}
                    onClick={() => handleAnnouncement(candidate.id)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send {candidateAnnouncementLabels[candidate.status]}
                  </Button>
                </div>
              </div>
            ))}
          {filteredCandidates.filter((c) => canSendCandidateAnnouncement(c.status)).length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="font-medium text-slate-900">No outcome announcements ready</p>
              <p className="mt-1 text-sm text-slate-600">
                Shortlist, select, or reject applicants to send them outcome emails.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Bulk Announcements</h3>
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase text-slate-500">Matched</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {matchedCandidateCount}
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-xs font-medium uppercase text-emerald-700">Recipients</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">
                {bulkRecipientCount}
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-medium uppercase text-amber-700">Skipped</p>
              <p className="mt-1 text-2xl font-bold text-amber-700">
                {skippedCandidateCount}
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs font-medium uppercase text-blue-700">Duplicates</p>
              <p className="mt-1 text-2xl font-bold text-blue-700">
                {bulkAnnouncementSummary.duplicateCount}
              </p>
            </div>
          </div>
          <div>
            <Label>Recipient Group</Label>
            <select
              value={bulkRecipientGroup}
              onChange={(event) =>
                handleBulkRecipientGroupChange(
                  event.target.value as InstitutionBulkRecipientGroup,
                )
              }
              className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg"
            >
              <option value="all">All Applicants</option>
              <option value="shortlisted">Shortlisted Candidates</option>
              <option value="selected">Selected Candidates</option>
              <option value="rejected">Rejected Candidates</option>
            </select>
          </div>
          <div>
            <Label>Scholarship</Label>
            <select
              value={bulkScholarship}
              onChange={(event) => setBulkScholarship(event.target.value)}
              className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg"
            >
              <option value="all">All Scholarships</option>
              {scholarships.map((s) => (
                <option key={s.id} value={s.title}>{s.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Message Template</Label>
            <select
              value={bulkTemplate}
              onChange={(event) =>
                setBulkTemplate(event.target.value as InstitutionAnnouncementTemplate)
              }
              className="w-full mt-2 px-4 py-2 border border-slate-300 rounded-lg"
            >
              <option value="selection">Selection Announcement</option>
              <option value="shortlist">Shortlist Notification</option>
              <option value="rejection">Rejection Notification</option>
              <option value="received">Application Received</option>
              <option value="deadline">Deadline Reminder</option>
              <option value="custom">Custom Message</option>
            </select>
          </div>
          {bulkTemplate === 'custom' && (
            <div className="grid gap-4">
              <div>
                <Label htmlFor="bulkCustomSubject">Subject</Label>
                <Input
                  id="bulkCustomSubject"
                  value={bulkCustomSubject}
                  onChange={(event) => setBulkCustomSubject(event.target.value)}
                  maxLength={255}
                  placeholder="Scholarship application update"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="bulkCustomMessage">Message</Label>
                <Textarea
                  id="bulkCustomMessage"
                  value={bulkCustomMessage}
                  onChange={(event) => setBulkCustomMessage(event.target.value)}
                  maxLength={10000}
                  placeholder="Write the announcement body..."
                  className="mt-2 min-h-36"
                />
              </div>
            </div>
          )}
          {skippedCandidateCount > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {skippedCandidateCount} matched candidate
              {skippedCandidateCount === 1 ? ' has' : 's have'} missing or invalid
              email addresses. Fix them before sending.
            </div>
          )}
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleBulkAnnouncement}
            disabled={
              isSendingBulkAnnouncement ||
              bulkRecipientCount === 0 ||
              skippedCandidateCount > 0 ||
              isCustomTemplateIncomplete
            }
          >
            {isSendingBulkAnnouncement ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {isSendingBulkAnnouncement
              ? 'Sending Bulk Announcement'
              : `Send Bulk Announcement (${bulkRecipientCount})`}
          </Button>
        </div>
      </Card>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Institution Dashboard</h1>
                <p className="text-slate-600">University of Colombo</p>
              </div>
            </div>
            {onLogout && (
              <Button
                type="button"
                variant="outline"
                onClick={handleInstitutionLogout}
                disabled={isLoggingOut}
                className="self-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 sm:self-auto"
              >
                {isLoggingOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                {isLoggingOut ? 'Logging out' : 'Logout'}
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-200">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'scholarships', label: 'Scholarships', icon: FileText },
              { id: 'candidates', label: 'Candidates', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'announcements', label: 'Announcements', icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? 'border-purple-600 text-purple-600 font-medium'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'scholarships' && renderScholarships()}
        {activeTab === 'candidates' && renderCandidates()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'announcements' && renderAnnouncements()}
      </div>

      {/* Post Scholarship Form Modal */}
      {showPostScholarshipForm && (
        <PostScholarshipForm
          onClose={() => setShowPostScholarshipForm(false)}
          institutionName="University of Colombo"
        />
      )}

      {/* Candidate Profile Modal */}
      {selectedCandidateProfile && selectedCandidate && selectedScholarshipProfile && selectedEvidenceProfile && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex h-[calc(100vh-2rem)] w-full max-w-5xl min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-20 rounded-t-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedCandidate.name}
                    </h2>
                    <p className="text-purple-100">
                      Candidate Review for {selectedCandidate.scholarship}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCandidateProfile(null)}
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-8">
              <div className="rounded-xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <p className="mb-1 text-sm font-medium text-yellow-800">Match Score</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                      <span className="text-4xl font-bold text-yellow-900">
                        {selectedCandidate.matchScore}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-yellow-800">Requirement Coverage</p>
                    <p className="text-4xl font-bold text-yellow-900">{requirementCoverage}%</p>
                  </div>
                  <div className="md:text-right">
                    <p className="mb-2 text-sm font-medium text-yellow-800">Current Status</p>
                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusPillClasses(selectedCandidate.status)}`}>
                      {selectedCandidate.status.charAt(0).toUpperCase() + selectedCandidate.status.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="mt-4 rounded-lg border border-yellow-200 bg-white/70 p-3 text-sm text-yellow-900">
                  {decisionRecommendation}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-600" />
                    <p className="text-sm font-medium text-slate-600">Email</p>
                  </div>
                  <p className="text-base font-semibold text-slate-900">{selectedCandidate.email}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-600" />
                    <p className="text-sm font-medium text-slate-600">Phone</p>
                  </div>
                  <p className="text-base font-semibold text-slate-900">{selectedCandidate.phone}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-600" />
                    <p className="text-sm font-medium text-slate-600">Location</p>
                  </div>
                  <p className="text-base font-semibold text-slate-900">{selectedCandidate.location}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-600" />
                    <p className="text-sm font-medium text-slate-600">Applied Date</p>
                  </div>
                  <p className="text-base font-semibold text-slate-900">{selectedCandidate.appliedDate}</p>
                </div>
              </div>

              <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
                <h3 className="mb-2 text-xl font-bold text-slate-900">Scholarship Fit Overview</h3>
                <p className="mb-4 text-sm text-slate-700">{selectedScholarshipProfile.summary}</p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm font-medium text-blue-700">GPA</p>
                    <p className="text-3xl font-bold text-blue-900">{selectedCandidate.gpa}</p>
                  </div>
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                    <p className="text-sm font-medium text-purple-700">A/L Results</p>
                    <p className="text-3xl font-bold text-purple-900">{selectedCandidate.alResults}</p>
                  </div>
                  <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                    <p className="text-sm font-medium text-indigo-700">Study Level</p>
                    <p className="text-3xl font-bold text-indigo-900">{selectedCandidate.level}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-bold text-slate-900">Requirement Match Breakdown</h3>
                <div className="grid gap-3">
                  {selectedRequirementChecks.map((check) => (
                    <div
                      key={check.requirement}
                      className={`rounded-lg border p-4 ${check.matched
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          {check.matched ? (
                            <CheckCircle className="mt-0.5 h-5 w-5 text-green-700" />
                          ) : (
                            <XCircle className="mt-0.5 h-5 w-5 text-red-700" />
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{check.requirement}</p>
                            <p className="mt-1 text-sm text-slate-700">{check.evidence}</p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${check.matched
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}
                        >
                          {check.matched ? 'Matched' : 'Needs Review'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <h4 className="mb-3 text-lg font-semibold text-slate-900">
                    Qualifications & Evidence
                  </h4>
                  <div className="space-y-3 text-sm text-slate-700">
                    <p><span className="font-semibold text-slate-900">Current Program:</span> {selectedEvidenceProfile.currentProgram}</p>
                    <p><span className="font-semibold text-slate-900">Field of Study:</span> {selectedEvidenceProfile.fieldOfStudy}</p>
                    <p><span className="font-semibold text-slate-900">English Test:</span> {selectedEvidenceProfile.englishTest} ({selectedEvidenceProfile.englishScore})</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-900">Experience Highlights</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      {selectedEvidenceProfile.experienceHighlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-900">Leadership Highlights</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      {selectedEvidenceProfile.leadershipHighlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <h4 className="mb-3 text-lg font-semibold text-slate-900">
                    Requirement Readiness
                  </h4>
                  <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-900">Selection Criteria</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {selectedScholarshipProfile.selectionCriteria.map((criterion) => (
                        <li key={criterion} className="flex items-start gap-2">
                          <Award className="mt-0.5 h-4 w-4 text-purple-600" />
                          <span>{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-900">Documents Submitted</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedEvidenceProfile.uploadedDocuments.map((document) => (
                        <span key={document} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {document}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-900">Missing Required Documents</p>
                    {missingRequiredDocuments.length === 0 ? (
                      <p className="mt-2 text-sm font-medium text-green-700">All required documents are present.</p>
                    ) : (
                      <ul className="mt-2 space-y-1 text-sm text-red-700">
                        {missingRequiredDocuments.map((document) => (
                          <li key={document} className="flex items-start gap-2">
                            <XCircle className="mt-0.5 h-4 w-4" />
                            <span>{document}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h4 className="mb-3 text-lg font-semibold text-slate-900">Personal Statement Summary</h4>
                <p className="text-sm leading-relaxed text-slate-700">
                  {selectedEvidenceProfile.personalStatementSummary}
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 lg:flex-row">
                <Button
                  className={`flex-1 text-red-700 hover:bg-blue-700 ${activeReviewAction[selectedCandidate.id] === 'shortlisted'
                    ? 'bg-blue-800 ring-2 ring-blue-300'
                    : 'bg-blue-600'
                    }`}
                  onClick={() => handleStatusChange(selectedCandidate.id, 'shortlisted')}
                >
                  Shortlist Candidate
                </Button>
                <Button
                  className={`flex-1 text-blue-600 hover:bg-green-700 ${activeReviewAction[selectedCandidate.id] === 'selected'
                    ? 'bg-green-800 ring-2 ring-green-300'
                    : 'bg-green-600'
                    }`}
                  onClick={() => handleStatusChange(selectedCandidate.id, 'selected')}
                >
                  Select Candidate
                </Button>
                <Button
                  variant="outline"
                  className={`flex-1 border-red-300 text-red-700 hover:bg-red-50 ${activeReviewAction[selectedCandidate.id] === 'rejected'
                    ? 'bg-red-100 ring-2 ring-red-200'
                    : ''
                    }`}
                  onClick={() => handleStatusChange(selectedCandidate.id, 'rejected')}
                >
                  Reject Candidate
                </Button>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
                <Button
                  className={`flex-1 text-yellow-500 hover:bg-purple-700 ${activeReviewAction[selectedCandidate.id] === 'download'
                    ? 'bg-purple-800 ring-2 ring-purple-300'
                    : 'bg-purple-600'
                    }`}
                  onClick={() =>
                    handleDownloadApplication(
                      selectedCandidate,
                      selectedScholarshipProfile,
                      selectedEvidenceProfile,
                      selectedRequirementChecks,
                    )
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Application
                </Button>
                {canSendCandidateAnnouncement(selectedCandidate.status) && (
                  <Button
                    className={`flex-1 ${getAnnouncementButtonClass(selectedCandidate.status)} ${activeReviewAction[selectedCandidate.id] === 'announcement'
                      ? 'ring-2 ring-purple-300'
                      : ''
                      }`}
                    onClick={() => handleAnnouncement(selectedCandidate.id)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send {candidateAnnouncementLabels[selectedCandidate.status]}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
