import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Search,
  Filter,
  MapPin,
  GraduationCap,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Globe,
  BookOpen,
  Heart,
  Zap,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Files,
  Loader2,
  Send,
  Upload,
  UserRound,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { matchesSearch } from "@/utils/search";
import {
  ApplicationDocumentDto,
  ApplicationSubmitRequest,
  scholarshipApi,
  ScholarshipDto,
  STUDENT_ID_KEY,
  tokenService,
} from "@/services/api";
import {
  getStoredStudentDocuments,
  mergeStudentDocuments,
  readStudentDocumentFile,
  saveStudentDocuments,
  type StudentDocument,
} from "@/utils/studentDocuments";

const scholarships = [
  {
    id: 1,
    title: "Commonwealth Scholarship",
    provider: "UK Government",
    country: "United Kingdom",
    amount: "Full Funding",
    deadline: "2026-03-15",
    fieldOfStudy: "All Fields",
    level: "Masters, PhD",
    description:
      "Fully-funded scholarships for outstanding students from Commonwealth countries to pursue postgraduate studies in the UK.",
    requirements: [
      "Bachelor degree with 2:1 or equivalent",
      "IELTS 6.5+",
      "Strong academic record",
    ],
    benefits: [
      "Full tuition fees",
      "Monthly stipend",
      "Airfare",
      "Thesis grant",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1758270704587-43339a801396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvbGFyc2hpcCUyMHVuaXZlcnNpdHklMjBlZHVjYXRpb258ZW58MXx8fHwxNzY4NzUzNjIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fully Funded",
    featured: true,
  },
  {
    id: 2,
    title: "Fulbright Foreign Student Program",
    provider: "US Government",
    country: "United States",
    amount: "Full Funding",
    deadline: "2026-04-01",
    fieldOfStudy: "All Fields",
    level: "Masters, PhD",
    description:
      "Prestigious scholarship providing full funding for Sri Lankan students to pursue graduate studies in the United States.",
    requirements: [
      "Bachelor degree",
      "TOEFL 90+ or IELTS 7.0+",
      "Leadership potential",
      "Strong English proficiency",
    ],
    benefits: [
      "Full tuition",
      "Living allowance",
      "Health insurance",
      "Travel costs",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1613324765334-7f4a413b8bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwbGlicmFyeSUyMGJvb2tzfGVufDF8fHx8MTc2ODY2ODAzNXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fully Funded",
    featured: true,
  },
  {
    id: 3,
    title: "DAAD Scholarships",
    provider: "German Academic Exchange Service",
    country: "Germany",
    amount: "€1,200/month",
    deadline: "2026-05-30",
    fieldOfStudy: "Engineering, Science, Technology",
    level: "Masters, PhD",
    description:
      "Generous scholarships for international students to study engineering, sciences, and technology in Germany.",
    requirements: [
      "Bachelor degree in relevant field",
      "Strong academic record",
      "German or English proficiency",
    ],
    benefits: [
      "Monthly stipend",
      "Health insurance",
      "Travel allowance",
      "Study materials",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1748366465774-aaa2160fe78d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29tcHV0ZXIlMjBzY2llbmNlfGVufDF8fHx8MTc2ODc1MzYyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Partial Funding",
    featured: false,
  },
  {
    id: 4,
    title: "Australia Awards Scholarship",
    provider: "Australian Government",
    country: "Australia",
    amount: "Full Funding",
    deadline: "2026-04-30",
    fieldOfStudy: "All Fields",
    level: "Masters, PhD",
    description:
      "Long-term development-focused scholarships for Sri Lankan students to study in Australia.",
    requirements: [
      "Bachelor degree",
      "IELTS 6.5+",
      "Work experience preferred",
      "Commitment to return",
    ],
    benefits: [
      "Full tuition",
      "Living expenses",
      "Health insurance",
      "Pre-course English training",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1758270704587-43339a801396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvbGFyc2hpcCUyMHVuaXZlcnNpdHklMjBlZHVjYXRpb258ZW58MXx8fHwxNzY4NzUzNjIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fully Funded",
    featured: true,
  },
  {
    id: 5,
    title: "Chinese Government Scholarship",
    provider: "China Scholarship Council",
    country: "China",
    amount: "Full Funding",
    deadline: "2026-03-31",
    fieldOfStudy: "All Fields",
    level: "Bachelors, Masters, PhD",
    description:
      "Comprehensive scholarships for international students at all levels to study in Chinese universities.",
    requirements: [
      "Educational qualifications",
      "Good health",
      "Age requirements vary by level",
    ],
    benefits: [
      "Tuition waiver",
      "Accommodation",
      "Monthly stipend",
      "Medical insurance",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1613324765334-7f4a413b8bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwbGlicmFyeSUyMGJvb2tzfGVufDF8fHx8MTc2ODY2ODAzNXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fully Funded",
    featured: false,
  },
  {
    id: 6,
    title: "Erasmus Mundus Joint Masters",
    provider: "European Union",
    country: "Multiple EU Countries",
    amount: "€1,400/month",
    deadline: "2026-01-15",
    fieldOfStudy: "Various Programs",
    level: "Masters",
    description:
      "Study in multiple European countries with full funding through prestigious joint degree programs.",
    requirements: [
      "Bachelor degree",
      "English proficiency",
      "Varies by program",
    ],
    benefits: [
      "Monthly allowance",
      "Tuition fees covered",
      "Travel costs",
      "Insurance",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1758270704587-43339a801396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvbGFyc2hpcCUyMHVuaXZlcnNpdHklMjBlZHVjYXRpb258ZW58MXx8fHwxNzY4NzUzNjIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fully Funded",
    featured: false,
  },
  {
    id: 7,
    title: "Rhodes Scholarship",
    provider: "Rhodes Trust",
    country: "United Kingdom",
    amount: "Full Funding",
    deadline: "2026-08-01",
    fieldOfStudy: "All Fields",
    level: "Masters, PhD",
    description:
      "One of the world's most prestigious scholarships for exceptional students to study at Oxford University.",
    requirements: [
      "Outstanding academic record",
      "Leadership qualities",
      "Commitment to service",
      "Age 18-28",
    ],
    benefits: [
      "Full tuition",
      "Living stipend",
      "Travel expenses",
      "Health insurance",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1613324765334-7f4a413b8bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwbGlicmFyeSUyMGJvb2tzfGVufDF8fHx8MTc2ODY2ODAzNXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fully Funded",
    featured: true,
  },
  {
    id: 8,
    title: "Chevening Scholarship",
    provider: "UK Foreign Office",
    country: "United Kingdom",
    amount: "Full Funding",
    deadline: "2026-11-02",
    fieldOfStudy: "All Fields",
    level: "Masters",
    description:
      "UK government's global scholarship programme for one-year master's degrees with leadership focus.",
    requirements: [
      "Bachelor degree",
      "IELTS 6.5+",
      "2+ years work experience",
      "Leadership potential",
    ],
    benefits: ["Full tuition", "Monthly stipend", "Travel costs", "Visa fees"],
    imageUrl:
      "https://images.unsplash.com/photo-1758270704587-43339a801396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvbGFyc2hpcCUyMHVuaXZlcnNpdHklMjBlZHVjYXRpb258ZW58MXx8fHwxNzY4NzUzNjIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fully Funded",
    featured: false,
  },
  {
    id: 9,
    title: "Swedish Institute Scholarships",
    provider: "Swedish Institute",
    country: "Sweden",
    amount: "SEK 10,000/month",
    deadline: "2026-02-15",
    fieldOfStudy: "All Fields",
    level: "Masters",
    description:
      "Scholarships for students from developing countries to pursue full-time master's studies in Sweden.",
    requirements: [
      "Bachelor degree",
      "Strong academic record",
      "English proficiency",
      "Leadership experience",
    ],
    benefits: ["Tuition fees", "Living expenses", "Travel grant", "Insurance"],
    imageUrl:
      "https://images.unsplash.com/photo-1613324765334-7f4a413b8bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwbGlicmFyeSUyMGJvb2tzfGVufDF8fHx8MTc2ODY2ODAzNXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fully Funded",
    featured: false,
  },
  {
    id: 10,
    title: "MEXT Japanese Government Scholarship",
    provider: "Japanese Ministry of Education",
    country: "Japan",
    amount: "¥144,000-¥145,000/month",
    deadline: "2026-05-20",
    fieldOfStudy: "All Fields",
    level: "Bachelors, Masters, PhD",
    description:
      "Comprehensive scholarships for international students to study at Japanese universities.",
    requirements: [
      "Educational background",
      "Age requirements",
      "Language proficiency (Japanese or English)",
    ],
    benefits: [
      "Monthly allowance",
      "Tuition waiver",
      "Airfare",
      "No tuition fees",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1748366465774-aaa2160fe78d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29tcHV0ZXIlMjBzY2llbmNlfGVufDF8fHx8MTc2ODc1MzYyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fully Funded",
    featured: false,
  },
  {
    id: 11,
    title: "Gates Cambridge Scholarship",
    provider: "Bill & Melinda Gates Foundation",
    country: "United Kingdom",
    amount: "Full Funding",
    deadline: "2026-10-15",
    fieldOfStudy: "All Fields",
    level: "Masters, PhD",
    description:
      "Highly competitive scholarship for outstanding applicants to study at University of Cambridge.",
    requirements: [
      "Exceptional academic record",
      "Leadership potential",
      "Social commitment",
    ],
    benefits: [
      "Full tuition",
      "Maintenance allowance",
      "Airfare",
      "Discretionary funding",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1613324765334-7f4a413b8bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwbGlicmFyeSUyMGJvb2tzfGVufDF8fHx8MTc2ODY2ODAzNXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fully Funded",
    featured: true,
  },
  {
    id: 12,
    title: "Rotary Peace Fellowship",
    provider: "Rotary Foundation",
    country: "Multiple Countries",
    amount: "Full Funding",
    deadline: "2026-05-15",
    fieldOfStudy: "Peace & Conflict Resolution",
    level: "Masters, Certificate",
    description:
      "Fellowships for leaders committed to peace and conflict resolution to study at premier universities.",
    requirements: [
      "Work/volunteer experience in peace",
      "English proficiency",
      "Leadership experience",
    ],
    benefits: [
      "Tuition & fees",
      "Room & board",
      "Travel expenses",
      "Internship funding",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1758270704587-43339a801396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvbGFyc2hpcCUyMHVuaXZlcnNpdHklMjBlZHVjYXRpb258ZW58MXx8fHwxNzY4NzUzNjIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fully Funded",
    featured: false,
  },
];

const categories = [
  "All",
  "Fully Funded",
  "Partial Funding",
  "Research",
  "Merit-Based",
];
const countries = [
  "All Countries",
  "Sri Lanka",
  "United Kingdom",
  "United States",
  "Germany",
  "Australia",
  "China",
  "Japan",
  "Multiple EU Countries",
];
const levels = [
  "All Levels",
  "Undergraduate",
  "Postgraduate",
  "Bachelors",
  "Masters",
  "PhD",
];

export type BrowseScholarship = (typeof scholarships)[number] & {
  source: "backend" | "static";
  coveragePercentage?: number;
  eligibleCountries?: string[];
  eligibleFields?: string[];
  eligibleLevels?: string[];
  minGpa?: number;
  minAge?: number;
  maxAge?: number;
  requiredEnglishTest?: string;
  minEnglishScore?: number;
  minAlPasses?: number;
  requiredAlStream?: string;
  minZScore?: number;
  requiresFinancialNeed?: boolean;
  maxHouseholdIncome?: string;
  sportsAchievementRequired?: boolean;
  leadershipRequired?: boolean;
  firstGenerationPriority?: boolean;
  disabilityFriendly?: boolean;
  returnToHomeRequired?: boolean;
  startDate?: string;
  endDate?: string;
  durationMonths?: number;
  requiredDocuments?: string[];
  additionalRequirements?: string;
  selectionCriteria?: string[];
  applicationSteps?: string[];
  applicationUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  viewsCount?: number;
  totalApplications?: number;
};

type ApplicationFormState = {
  fullName: string;
  email: string;
  phone: string;
  currentEducation: string;
  intendedLevel: string;
  fieldOfStudy: string;
  alStream: string;
  alResults: string;
  zScore: string;
  gpa: string;
  englishTest: string;
  englishScore: string;
  householdIncome: string;
  achievements: string;
  qualificationSummary: string;
  coverLetter: string;
};

type DocumentChoice = {
  source: "EXISTING_PROFILE_DOCUMENT" | "NEW_UPLOAD";
  documentId?: string;
  documentName?: string;
  fileName?: string;
};

const sampleScholarships: BrowseScholarship[] = scholarships.map(
  (scholarship) => ({
    ...scholarship,
    source: "static",
  }),
);

const formatScholarshipType = (type?: string) => {
  switch (type?.toUpperCase()) {
    case "FULL":
      return "Fully Funded";
    case "PARTIAL":
      return "Partial Funding";
    case "TUITION":
      return "Tuition Only";
    case "LIVING_EXPENSES":
      return "Living Allowance";
    default:
      return type || "Scholarship";
  }
};

const formatLevel = (level: string) => {
  switch (level.toUpperCase()) {
    case "UNDERGRADUATE":
      return "Undergraduate";
    case "POSTGRADUATE":
      return "Postgraduate";
    case "PHD":
      return "PhD";
    default:
      return level;
  }
};

const formatAmount = (scholarship: ScholarshipDto) => {
  const type = scholarship.scholarshipType?.toUpperCase();

  if (type === "FULL") {
    return "Full Funding";
  }

  if (scholarship.amount && scholarship.currency) {
    return `${scholarship.currency} ${Number(scholarship.amount).toLocaleString()}`;
  }

  if (scholarship.coveragePercentage) {
    return `${scholarship.coveragePercentage}% Coverage`;
  }

  return "Contact for details";
};

export const mapBackendScholarship = (
  scholarship: ScholarshipDto,
): BrowseScholarship => {
  const eligibleCountries = scholarship.eligibleCountries ?? [];
  const eligibleFields = scholarship.eligibleFields ?? [];
  const eligibleLevels = (scholarship.eligibleLevels ?? []).map(formatLevel);
  const category = formatScholarshipType(scholarship.scholarshipType);

  return {
    id: scholarship.id,
    source: "backend",
    title: scholarship.title,
    provider:
      scholarship.providerName || `Institution #${scholarship.institutionId}`,
    country:
      eligibleCountries.length > 1
        ? eligibleCountries.join(", ")
        : eligibleCountries[0] || "Multiple countries",
    amount: formatAmount(scholarship),
    deadline: scholarship.applicationDeadline || "",
    fieldOfStudy:
      eligibleFields.length > 0 ? eligibleFields.join(", ") : "All Fields",
    level: eligibleLevels.length > 0 ? eligibleLevels.join(", ") : "All Levels",
    description:
      scholarship.description || "Scholarship details are being updated.",
    requirements:
      scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0
        ? scholarship.requiredDocuments
        : ["Review the complete scholarship details before applying"],
    benefits:
      scholarship.benefits && scholarship.benefits.length > 0
        ? scholarship.benefits
        : [formatAmount(scholarship)],
    imageUrl:
      scholarship.imageUrl ||
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1080",
    category,
    featured: Boolean(scholarship.isFeatured),
    coveragePercentage: scholarship.coveragePercentage,
    eligibleCountries,
    eligibleFields,
    eligibleLevels,
    minGpa: scholarship.minGpa,
    minAge: scholarship.minAge,
    maxAge: scholarship.maxAge,
    requiredEnglishTest: scholarship.requiredEnglishTest,
    minEnglishScore: scholarship.minEnglishScore,
    minAlPasses: scholarship.minAlPasses,
    requiredAlStream: scholarship.requiredAlStream,
    minZScore: scholarship.minZScore,
    requiresFinancialNeed: scholarship.requiresFinancialNeed,
    maxHouseholdIncome: scholarship.maxHouseholdIncome,
    sportsAchievementRequired: scholarship.sportsAchievementRequired,
    leadershipRequired: scholarship.leadershipRequired,
    firstGenerationPriority: scholarship.firstGenerationPriority,
    disabilityFriendly: scholarship.disabilityFriendly,
    returnToHomeRequired: scholarship.returnToHomeRequired,
    startDate: scholarship.startDate,
    endDate: scholarship.endDate,
    durationMonths: scholarship.durationMonths,
    requiredDocuments: scholarship.requiredDocuments,
    additionalRequirements: scholarship.additionalRequirements,
    selectionCriteria: scholarship.selectionCriteria,
    applicationSteps: scholarship.applicationSteps,
    applicationUrl: scholarship.applicationUrl,
    contactEmail: scholarship.contactEmail,
    contactPhone: scholarship.contactPhone,
    websiteUrl: scholarship.websiteUrl,
    viewsCount: scholarship.viewsCount,
    totalApplications: scholarship.totalApplications,
  };
};

const normalizeDocumentName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "");

const findMatchingUploadedDocument = (
  requirement: string,
  documents: StudentDocument[],
) => {
  const normalizedRequirement = normalizeDocumentName(requirement);

  return documents.find((document) => {
    const normalizedName = normalizeDocumentName(document.name);
    return (
      normalizedName.includes(normalizedRequirement) ||
      normalizedRequirement.includes(normalizedName)
    );
  });
};

const getStudentIdForApplication = () => {
  const storedId = Number(localStorage.getItem(STUDENT_ID_KEY));
  if (Number.isFinite(storedId) && storedId > 0) {
    return storedId;
  }

  const userId = tokenService.getUser()?.id;
  return userId && userId > 0 ? userId : null;
};

const getRegistrationDraft = () => {
  try {
    return JSON.parse(localStorage.getItem("scholarFinderProgress") || "{}");
  } catch {
    return {};
  }
};

const asText = (value: unknown) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  return "";
};

const getInitialApplicationForm = (
  scholarship: BrowseScholarship | null,
): ApplicationFormState => {
  const draft = getRegistrationDraft();
  const user = tokenService.getUser();

  return {
    fullName: asText(draft.fullName),
    email: user?.email || asText(draft.email),
    phone: asText(draft.mobile),
    currentEducation: asText(draft.highestEducation),
    intendedLevel: asText(draft.intendedLevel) || scholarship?.level || "",
    fieldOfStudy:
      asText(draft.preferredFields) || scholarship?.fieldOfStudy || "",
    alStream: asText(draft.alStream),
    alResults: [draft.grade1, draft.grade2, draft.grade3]
      .filter(Boolean)
      .join(", "),
    zScore: asText(draft.zScore),
    gpa: "",
    englishTest: asText(draft.englishTest),
    englishScore: asText(draft.overallScore),
    householdIncome: asText(draft.householdIncome),
    achievements: [draft.sports, draft.leadership, draft.background]
      .filter(Boolean)
      .join("\n"),
    qualificationSummary: "",
    coverLetter: "",
  };
};

export function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [showFilters, setShowFilters] = useState(false);
  const [apiScholarships, setApiScholarships] = useState<BrowseScholarship[]>(
    [],
  );
  const [isLoadingScholarships, setIsLoadingScholarships] = useState(true);
  const [scholarshipLoadError, setScholarshipLoadError] = useState("");
  const [selectedScholarship, setSelectedScholarship] =
    useState<BrowseScholarship | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [applicationScholarship, setApplicationScholarship] =
    useState<BrowseScholarship | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  // Temporary filter states (for the dropdowns before applying)
  const [tempCategory, setTempCategory] = useState("All");
  const [tempCountry, setTempCountry] = useState("All Countries");
  const [tempLevel, setTempLevel] = useState("All Levels");

  useEffect(() => {
    let isMounted = true;

    const fetchScholarships = async () => {
      setIsLoadingScholarships(true);
      setScholarshipLoadError("");

      try {
        const response = await scholarshipApi.getScholarships();
        if (isMounted) {
          setApiScholarships((response.data ?? []).map(mapBackendScholarship));
        }
      } catch (error) {
        console.error("Failed to load scholarships:", error);
        if (isMounted) {
          setApiScholarships([]);
          setScholarshipLoadError(
            "Showing sample scholarships while the backend is unavailable.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingScholarships(false);
        }
      }
    };

    fetchScholarships();

    return () => {
      isMounted = false;
    };
  }, []);

  const availableScholarships =
    apiScholarships.length > 0 ? apiScholarships : sampleScholarships;

  // Filter scholarships based on search and filters
  const filteredScholarships = availableScholarships.filter((scholarship) => {
    const matchesSearchQuery = matchesSearch(searchQuery, [
      scholarship.title,
      scholarship.provider,
      scholarship.country,
      scholarship.amount,
      scholarship.deadline,
      scholarship.fieldOfStudy,
      scholarship.level,
      scholarship.description,
      scholarship.requirements,
      scholarship.benefits,
      scholarship.category,
    ]);
    const matchesCategory =
      selectedCategory === "All" || scholarship.category === selectedCategory;
    const matchesCountry =
      selectedCountry === "All Countries" ||
      scholarship.country.toLowerCase().includes(selectedCountry.toLowerCase());
    const matchesLevel =
      selectedLevel === "All Levels" ||
      scholarship.level.toLowerCase().includes(selectedLevel.toLowerCase()) ||
      (selectedLevel === "Bachelors" &&
        scholarship.level.toLowerCase().includes("undergraduate")) ||
      (selectedLevel === "Masters" &&
        scholarship.level.toLowerCase().includes("postgraduate"));

    return (
      matchesSearchQuery && matchesCategory && matchesCountry && matchesLevel
    );
  });
  const featuredScholarships = filteredScholarships.filter((s) => s.featured);
  const regularScholarships = filteredScholarships.filter((s) => !s.featured);

  // Count active filters
  const activeFiltersCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedCountry !== "All Countries" ? 1 : 0) +
    (selectedLevel !== "All Levels" ? 1 : 0);

  // Apply filters
  const handleApplyFilters = () => {
    setSelectedCategory(tempCategory);
    setSelectedCountry(tempCountry);
    setSelectedLevel(tempLevel);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setTempCategory("All");
    setTempCountry("All Countries");
    setTempLevel("All Levels");
    setSelectedCategory("All");
    setSelectedCountry("All Countries");
    setSelectedLevel("All Levels");
    setSearchQuery("");
  };

  const handleViewDetails = async (scholarship: BrowseScholarship) => {
    setSelectedScholarship(scholarship);
    setIsDetailsOpen(true);
    setDetailsError("");

    if (scholarship.source !== "backend") {
      return;
    }

    setIsDetailsLoading(true);
    try {
      const response = await scholarshipApi.getScholarship(scholarship.id);
      setSelectedScholarship(mapBackendScholarship(response.data));
    } catch (error) {
      console.error("Failed to load scholarship details:", error);
      setDetailsError(
        "Could not refresh the latest backend details. Showing the list details instead.",
      );
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleApplyNow = async (scholarship: BrowseScholarship) => {
    setApplicationScholarship(scholarship);
    setIsApplicationOpen(true);
    setIsDetailsOpen(false);

    if (scholarship.source !== "backend") {
      return;
    }

    try {
      const response = await scholarshipApi.getScholarship(scholarship.id);
      setApplicationScholarship(mapBackendScholarship(response.data));
    } catch (error) {
      console.error("Failed to refresh scholarship before applying:", error);
    }
  };

  const getDaysUntilDeadline = (deadline?: string) => {
    if (!deadline) {
      return Number.POSITIVE_INFINITY;
    }

    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
          <Award className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-900">
            500+ Active Opportunities
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Browse All Scholarships
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Explore our comprehensive database of scholarships from around the
          world. Find the perfect opportunity that matches your academic goals
          and aspirations.
        </p>
      </div>

      {/* Search and Filter Section */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-white to-blue-50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by scholarship name, provider, or field..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-6 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Filter Toggle Button */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-6 border-slate-300 hover:bg-slate-100"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <select
                value={tempCategory}
                onChange={(e) => setTempCategory(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Country
              </label>
              <select
                value={tempCountry}
                onChange={(e) => setTempCountry(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Education Level
              </label>
              <select
                value={tempLevel}
                onChange={(e) => setTempLevel(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Apply and Clear Filters */}
        {showFilters && (
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="px-6 py-2.5 border-slate-300 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">
              Active Filters:
            </span>
            {selectedCategory !== "All" && (
              <Badge variant="secondary" className="px-3 py-1">
                {selectedCategory}
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setTempCategory("All");
                  }}
                  className="ml-1.5 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedCountry !== "All Countries" && (
              <Badge variant="secondary" className="px-3 py-1">
                {selectedCountry}
                <button
                  onClick={() => {
                    setSelectedCountry("All Countries");
                    setTempCountry("All Countries");
                  }}
                  className="ml-1.5 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedLevel !== "All Levels" && (
              <Badge variant="secondary" className="px-3 py-1">
                {selectedLevel}
                <button
                  onClick={() => {
                    setSelectedLevel("All Levels");
                    setTempLevel("All Levels");
                  }}
                  className="ml-1.5 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </Card>

      {(isLoadingScholarships || scholarshipLoadError) && (
        <div className="mb-8 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          {isLoadingScholarships
            ? "Loading latest scholarships from the backend..."
            : scholarshipLoadError}
        </div>
      )}

      {/* Featured Scholarships */}
      {featuredScholarships.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Featured Scholarships
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredScholarships.map((scholarship, index) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                index={index}
                featured={true}
                daysUntilDeadline={getDaysUntilDeadline(scholarship.deadline)}
                onViewDetails={handleViewDetails}
                onApplyNow={handleApplyNow}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Scholarships */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              All Scholarships
            </h2>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {filteredScholarships.length} Results
          </Badge>
        </div>

        {filteredScholarships.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-slate-100 p-4 rounded-full">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                No scholarships found
              </h3>
              <p className="text-slate-600 max-w-md">
                Try adjusting your search criteria or filters to find more
                opportunities.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedCountry("All Countries");
                  setSelectedLevel("All Levels");
                  setTempCategory("All");
                  setTempCountry("All Countries");
                  setTempLevel("All Levels");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Clear All Filters
              </Button>
            </div>
          </Card>
        ) : regularScholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularScholarships.map((scholarship, index) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                index={index}
                featured={false}
                daysUntilDeadline={getDaysUntilDeadline(scholarship.deadline)}
                onViewDetails={handleViewDetails}
                onApplyNow={handleApplyNow}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-slate-600">
            Matching results are shown in the featured section above.
          </Card>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Heart className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">
              Personalized for You
            </span>
          </div>

          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Matched with Perfect Scholarships
          </h3>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Register now to receive personalized scholarship matches based on
            your qualifications, preferences, and goals
          </p>

          <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg shadow-lg">
            <GraduationCap className="w-5 h-5 mr-2" />
            Register for Free
          </Button>

          <p className="text-xs text-blue-200 mt-4">
            Join 10,000+ Sri Lankan students finding their perfect scholarship
          </p>
        </div>
      </div>

      <ScholarshipDetailsDialog
        scholarship={selectedScholarship}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        isLoading={isDetailsLoading}
        error={detailsError}
        onApplyNow={handleApplyNow}
      />
      <ScholarshipApplicationDialog
        scholarship={applicationScholarship}
        open={isApplicationOpen}
        onOpenChange={setIsApplicationOpen}
      />
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "Not specified";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}

function DetailList({ items }: { items?: string[] }) {
  const visibleItems = (items ?? []).filter(Boolean);

  if (visibleItems.length === 0) {
    return <p className="text-sm text-slate-500">Not specified</p>;
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {visibleItems.map((item) => (
        <li
          key={item}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function DetailField({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <div className="mt-1 text-sm font-semibold text-slate-900">
        {value !== undefined && value !== null && value !== ""
          ? value
          : "Not specified"}
      </div>
    </div>
  );
}

export function ScholarshipDetailsDialog({
  scholarship,
  open,
  onOpenChange,
  isLoading,
  error,
  onApplyNow,
  contentClassName = "",
}: {
  scholarship: BrowseScholarship | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  error: string;
  onApplyNow: (scholarship: BrowseScholarship) => void;
  contentClassName?: string;
}) {
  if (!scholarship) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scholarship details</DialogTitle>
            <DialogDescription>
              {isLoading
                ? "Loading scholarship details."
                : error || "Select a scholarship to view its details."}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const eligibilityItems = [
    scholarship.eligibleCountries?.length
      ? `Eligible countries: ${scholarship.eligibleCountries.join(", ")}`
      : `Eligible countries: ${scholarship.country}`,
    scholarship.eligibleFields?.length
      ? `Fields: ${scholarship.eligibleFields.join(", ")}`
      : `Fields: ${scholarship.fieldOfStudy}`,
    scholarship.eligibleLevels?.length
      ? `Study levels: ${scholarship.eligibleLevels.join(", ")}`
      : `Study levels: ${scholarship.level}`,
    scholarship.minGpa ? `Minimum GPA: ${scholarship.minGpa}` : "",
    scholarship.minAge || scholarship.maxAge
      ? `Age range: ${scholarship.minAge ?? "Any"}-${scholarship.maxAge ?? "Any"}`
      : "",
    scholarship.minAlPasses
      ? `Minimum A/L passes: ${scholarship.minAlPasses}`
      : "",
    scholarship.requiredAlStream
      ? `Required A/L stream: ${scholarship.requiredAlStream}`
      : "",
    scholarship.minZScore ? `Minimum Z-score: ${scholarship.minZScore}` : "",
    scholarship.requiredEnglishTest
      ? `${scholarship.requiredEnglishTest} score: ${scholarship.minEnglishScore ?? "Required"}`
      : "",
    scholarship.requiresFinancialNeed
      ? `Financial need required${scholarship.maxHouseholdIncome ? ` up to ${scholarship.maxHouseholdIncome}` : ""}`
      : "",
    scholarship.leadershipRequired ? "Leadership experience required" : "",
    scholarship.sportsAchievementRequired
      ? "Sports achievement required"
      : "",
    scholarship.firstGenerationPriority
      ? "Priority for first-generation university students"
      : "",
    scholarship.disabilityFriendly ? "Disability-friendly scholarship" : "",
    scholarship.returnToHomeRequired
      ? "Return-to-home commitment required"
      : "",
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-4xl max-h-[90vh] overflow-y-auto ${contentClassName}`}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl leading-tight">
            {scholarship.title}
          </DialogTitle>
          <DialogDescription>
            {scholarship.provider} - {scholarship.country}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <div className="relative h-56 overflow-hidden rounded-lg">
            <ImageWithFallback
              src={scholarship.imageUrl}
              alt={scholarship.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <Badge className="bg-white text-slate-900">
                {scholarship.category}
              </Badge>
              {scholarship.featured && (
                <Badge className="bg-yellow-500 text-white">Featured</Badge>
              )}
            </div>
          </div>

          {isLoading && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
              Loading latest backend details...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {error}
            </div>
          )}

          <p className="text-slate-700 leading-relaxed">
            {scholarship.description}
          </p>

          <DetailSection title="Key Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <DetailField label="Funding" value={scholarship.amount} />
              <DetailField label="Deadline" value={formatDate(scholarship.deadline)} />
              <DetailField label="Study Level" value={scholarship.level} />
              <DetailField
                label="Duration"
                value={
                  scholarship.durationMonths
                    ? `${scholarship.durationMonths} months`
                    : scholarship.startDate || scholarship.endDate
                      ? `${formatDate(scholarship.startDate)} to ${formatDate(scholarship.endDate)}`
                      : undefined
                }
              />
            </div>
          </DetailSection>

          <DetailSection title="Benefits & Coverage">
            <DetailList items={scholarship.benefits} />
          </DetailSection>

          <DetailSection title="Eligibility">
            <DetailList items={eligibilityItems} />
          </DetailSection>

          <DetailSection title="Required Documents">
            <DetailList
              items={scholarship.requiredDocuments ?? scholarship.requirements}
            />
          </DetailSection>

          <DetailSection title="Selection Criteria">
            <DetailList items={scholarship.selectionCriteria} />
          </DetailSection>

          <DetailSection title="Application Steps">
            <DetailList items={scholarship.applicationSteps} />
          </DetailSection>

          {scholarship.additionalRequirements && (
            <DetailSection title="Additional Requirements">
              <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {scholarship.additionalRequirements}
              </p>
            </DetailSection>
          )}

          <DetailSection title="Contact & Links">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DetailField label="Email" value={scholarship.contactEmail} />
              <DetailField label="Phone" value={scholarship.contactPhone} />
              <DetailField label="Applications" value={scholarship.totalApplications} />
              <DetailField label="Views" value={scholarship.viewsCount} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => onApplyNow(scholarship)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply Now
              </Button>
              {scholarship.applicationUrl && (
                <Button variant="outline" asChild>
                  <a
                    href={scholarship.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Provider Application Link
                  </a>
                </Button>
              )}
              {scholarship.websiteUrl && (
                <Button variant="outline" asChild>
                  <a
                    href={scholarship.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Provider Website
                  </a>
                </Button>
              )}
              {scholarship.contactEmail && (
                <Button variant="outline" asChild>
                  <a href={`mailto:${scholarship.contactEmail}`}>
                    Email Contact
                  </a>
                </Button>
              )}
            </div>
          </DetailSection>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ScholarshipApplicationDialog({
  scholarship,
  open,
  onOpenChange,
  onApplicationSubmitted,
}: {
  scholarship: BrowseScholarship | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplicationSubmitted?: () => void;
}) {
  const [formData, setFormData] = useState<ApplicationFormState>(
    getInitialApplicationForm(scholarship),
  );
  const [documents, setDocuments] = useState<StudentDocument[]>(
    () => getStoredStudentDocuments(getStudentIdForApplication()),
  );
  const [documentChoices, setDocumentChoices] = useState<
    Record<string, DocumentChoice>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const requiredDocuments = (
    scholarship?.requiredDocuments?.length
      ? scholarship.requiredDocuments
      : scholarship?.requirements ?? []
  ).filter(Boolean);
  const uploadedDocuments = documents.filter(
    (document) => document.status === "uploaded",
  );
  const missingDocuments = requiredDocuments.filter((requirement) => {
    const choice = documentChoices[requirement];
    return !choice?.documentId && !choice?.fileName;
  });
  const missingProfileFields = [
    { field: "fullName" as const, label: "full name" },
    { field: "email" as const, label: "email" },
  ].filter(({ field }) => !formData[field].trim());
  const missingQualificationFields = [
    {
      field: "qualificationSummary" as const,
      label: "qualification summary",
    },
  ].filter(({ field }) => !formData[field].trim());
  const profileComplete = missingProfileFields.length === 0;
  const qualificationComplete = missingQualificationFields.length === 0;
  const documentsComplete = missingDocuments.length === 0;
  const attachedDocumentCount =
    requiredDocuments.length - missingDocuments.length;
  const requirementItems =
    scholarship?.selectionCriteria?.length
      ? scholarship.selectionCriteria
      : scholarship?.requirements;
  const applicationSteps = [
    {
      title: "Profile",
      description: "Contact and study details",
      icon: UserRound,
      complete: profileComplete,
    },
    {
      title: "Qualifications",
      description: "Eligibility and statement",
      icon: ClipboardCheck,
      complete: qualificationComplete,
    },
    {
      title: "Documents",
      description: "Attachments and review",
      icon: Files,
      complete: documentsComplete,
    },
  ];
  const completedStepCount = applicationSteps.filter(
    (step) => step.complete,
  ).length;
  const progressPercentage = Math.round(
    (completedStepCount / applicationSteps.length) * 100,
  );

  useEffect(() => {
    if (!open) return;

    let isActive = true;
    const studentId = getStudentIdForApplication();
    const storedDocuments = getStoredStudentDocuments(studentId);

    setDocuments(storedDocuments);
    setFormData(getInitialApplicationForm(scholarship));
    setSubmitError("");
    setSubmitSuccess("");
    setAttemptedSubmit(false);
    setCurrentStep(0);

    const applyDocumentChoices = (availableDocuments: StudentDocument[]) => {
      const uploaded = availableDocuments.filter(
        (document) => document.status === "uploaded",
      );
      const nextChoices = requiredDocuments.reduce<
        Record<string, DocumentChoice>
      >((choices, requirement) => {
        const match = findMatchingUploadedDocument(requirement, uploaded);
        if (match) {
          choices[requirement] = {
            source: "EXISTING_PROFILE_DOCUMENT",
            documentId: match.id,
            documentName: match.name,
            fileName: match.fileName,
          };
        }
        return choices;
      }, {});

      setDocumentChoices(nextChoices);
    };

    applyDocumentChoices(storedDocuments);

    if (studentId) {
      scholarshipApi
        .getStudentDocuments(studentId)
        .then((response) => {
          if (!isActive) return;

          if (response.success) {
            const nextDocuments = mergeStudentDocuments(response.data ?? []);
            setDocuments(nextDocuments);
            saveStudentDocuments(nextDocuments, studentId);
            applyDocumentChoices(nextDocuments);
            return;
          }

          throw new Error(response.message || "Failed to load profile documents");
        })
        .catch((error) => {
          if (!isActive) return;
          console.error("Failed to load profile documents:", error);
        });
    }

    return () => {
      isActive = false;
    };
  }, [open, scholarship?.id]);

  const updateField = (
    field: keyof ApplicationFormState,
    value: string,
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleExistingDocumentChange = (
    requirement: string,
    documentId: string,
  ) => {
    const selectedDocument = uploadedDocuments.find(
      (document) => document.id === documentId,
    );

    setDocumentChoices((current) => {
      const next = { ...current };
      if (!selectedDocument) {
        delete next[requirement];
        return next;
      }

      next[requirement] = {
        source: "EXISTING_PROFILE_DOCUMENT",
        documentId: selectedDocument.id,
        documentName: selectedDocument.name,
        fileName: selectedDocument.fileName,
      };
      return next;
    });
  };

  const handleRequirementUpload = async (
    requirement: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget;
    const file = event.target.files?.[0];
    if (!file) return;

    setSubmitError("");

    const studentId = getStudentIdForApplication();
    if (!studentId) {
      setSubmitError("Please log in before uploading application documents.");
      input.value = "";
      return;
    }

    let fileDataUrl = "";
    try {
      fileDataUrl = await readStudentDocumentFile(file);
    } catch (error) {
      console.error("Failed to read selected document", error);
      setSubmitError("Could not read the selected document. Please try another file.");
      input.value = "";
      return;
    }

    const existingDocument = documents.find(
      (document) =>
        normalizeDocumentName(document.name) ===
        normalizeDocumentName(requirement),
    );
    const uploadedDocument: StudentDocument = {
      id:
        existingDocument?.id ||
        `application-${Date.now()}-${normalizeDocumentName(requirement)}`,
      name: requirement,
      status: "uploaded",
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileDataUrl,
      fileUrl: undefined,
      uploadedAt: new Date().toISOString(),
    };

    try {
      const response = await scholarshipApi.upsertStudentDocument(
        studentId,
        uploadedDocument,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to save document");
      }

      const savedDocument = response.data;
      const nextDocuments = mergeStudentDocuments(
        existingDocument
          ? documents.map((document) =>
              document.id === existingDocument.id ? savedDocument : document,
            )
          : [...documents, savedDocument],
      );

      setDocuments(nextDocuments);
      saveStudentDocuments(nextDocuments, studentId);
      setDocumentChoices((current) => ({
        ...current,
        [requirement]: {
          source: "NEW_UPLOAD",
          documentId: savedDocument.id,
          documentName: savedDocument.name,
          fileName: savedDocument.fileName,
        },
      }));
    } catch (error: any) {
      console.error("Failed to save application document", error);
      setSubmitError(
        error?.message || "Could not save this document to your profile. Please try again.",
      );
      input.value = "";
      return;
    }

    input.value = "";
  };

  const buildDocumentPayload = (): ApplicationDocumentDto[] =>
    requiredDocuments.map((requirement) => {
      const choice = documentChoices[requirement];
      return {
        requirementName: requirement,
        source: choice?.source ?? "NEW_UPLOAD",
        documentId: choice?.documentId,
        documentName: choice?.documentName ?? requirement,
        fileName: choice?.fileName,
      };
    });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!scholarship) return;

    const studentId = getStudentIdForApplication();

    setAttemptedSubmit(true);
    setSubmitError("");
    setSubmitSuccess("");

    if (scholarship.source !== "backend") {
      setSubmitError(
        "This sample scholarship cannot receive applications until the backend scholarship list is available.",
      );
      return;
    }

    if (!studentId) {
      setSubmitError(
        "Please log in or complete student registration before submitting an application.",
      );
      return;
    }

    if (missingProfileFields.length > 0) {
      setCurrentStep(0);
      setSubmitError(
        `Please complete your ${missingProfileFields
          .map((field) => field.label)
          .join(" and ")} before submitting.`,
      );
      return;
    }

    if (missingQualificationFields.length > 0) {
      setCurrentStep(1);
      setSubmitError("Please add a qualification summary before submitting.");
      return;
    }

    if (missingDocuments.length > 0) {
      setCurrentStep(2);
      setSubmitError(
        `Please attach documents for: ${missingDocuments.join(", ")}.`,
      );
      return;
    }

    const payload: ApplicationSubmitRequest = {
      ...formData,
      studentId,
      scholarshipId: scholarship.id,
      requiredDocuments,
      documents: buildDocumentPayload(),
    };

    setIsSubmitting(true);
    try {
      const response = await scholarshipApi.submitApplication(
        scholarship.id,
        payload,
      );
      setSubmitSuccess(
        response.data.updatedExistingApplication
          ? "Your existing application was updated successfully."
          : "Your application was submitted successfully.",
      );
      onApplicationSubmitted?.();
    } catch (error) {
      console.error("Failed to submit application:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not submit the application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPreviousStep = () => {
    setSubmitError("");
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const goToNextStep = () => {
    setSubmitError("");
    setCurrentStep((step) =>
      Math.min(step + 1, applicationSteps.length - 1),
    );
  };

  const renderInput = (
    field: keyof ApplicationFormState,
    label: string,
    options: {
      type?: string;
      placeholder?: string;
      required?: boolean;
    } = {},
  ) => {
    const hasError =
      attemptedSubmit && Boolean(options.required) && !formData[field].trim();

    return (
      <div
        className={`space-y-2.5 rounded-xl border bg-white p-4 shadow-sm transition ${
          hasError
            ? "border-red-300 ring-1 ring-red-100"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <Label
            htmlFor={`application-${String(field)}`}
            className="text-sm font-semibold tracking-wide text-slate-700"
          >
            {label}
          </Label>
          {options.required && (
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold uppercase text-blue-700">
              Required
            </span>
          )}
        </div>
        <Input
          id={`application-${String(field)}`}
          type={options.type}
          value={formData[field]}
          onChange={(event) => updateField(field, event.target.value)}
          placeholder={options.placeholder}
          className={`h-12 rounded-lg border bg-white px-4 text-base shadow-sm placeholder:text-slate-400 ${
            hasError
              ? "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200"
              : "border-slate-300 focus-visible:border-blue-500 focus-visible:ring-blue-200"
          }`}
        />
        {hasError && (
          <p className="text-sm font-semibold text-red-700">
            This field is required.
          </p>
        )}
      </div>
    );
  };

  const renderTextarea = (
    field: keyof ApplicationFormState,
    label: string,
    options: {
      placeholder?: string;
      required?: boolean;
      minHeight?: string;
    } = {},
  ) => {
    const hasError =
      attemptedSubmit && Boolean(options.required) && !formData[field].trim();

    return (
      <div
        className={`space-y-2.5 rounded-xl border bg-white p-4 shadow-sm transition ${
          hasError
            ? "border-red-300 ring-1 ring-red-100"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <Label
            htmlFor={`application-${String(field)}`}
            className="text-sm font-semibold tracking-wide text-slate-700"
          >
            {label}
          </Label>
          {options.required && (
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold uppercase text-blue-700">
              Required
            </span>
          )}
        </div>
        <Textarea
          id={`application-${String(field)}`}
          value={formData[field]}
          onChange={(event) => updateField(field, event.target.value)}
          className={`rounded-lg px-4 py-3 text-base leading-relaxed ${
            options.minHeight ?? "min-h-32"
          } ${
            hasError
              ? "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200"
              : "border-slate-300 focus-visible:border-blue-500 focus-visible:ring-blue-200"
          }`}
          placeholder={options.placeholder}
        />
        {hasError && (
          <p className="text-sm font-semibold text-red-700">
            This field is required.
          </p>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    if (!scholarship) return null;

    const activeScholarship = scholarship;

    if (currentStep === 0) {
      return (
        <section className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-blue-700">
              <UserRound className="h-6 w-6" />
              <h3 className="text-2xl font-bold text-slate-900">
                Applicant Profile
              </h3>
            </div>
            <p className="mt-2 text-base text-slate-600">
              Review the details that will identify this application.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 xl:grid-cols-2">
            {renderInput("fullName", "Full Name", {
              placeholder: "Your full name",
              required: true,
            })}
            {renderInput("email", "Email", {
              type: "email",
              placeholder: "you@example.com",
              required: true,
            })}
            {renderInput("phone", "Phone", {
              placeholder: "+94 ...",
            })}
            {renderInput("currentEducation", "Current Education", {
              placeholder: "A/L, Diploma, Undergraduate, etc.",
            })}
            {renderInput("intendedLevel", "Intended Level", {
              placeholder: "Undergraduate, Postgraduate, PhD",
            })}
            {renderInput("fieldOfStudy", "Field Of Study", {
              placeholder: "IT, Engineering, Medicine, etc.",
            })}
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-5">
            <p className="text-base font-semibold text-blue-950">
              Applying to {activeScholarship.title}
            </p>
            <div className="mt-4 grid gap-4 text-base text-blue-900 sm:grid-cols-3">
              <div>
                <p className="font-medium">Provider</p>
                <p>{activeScholarship.provider}</p>
              </div>
              <div>
                <p className="font-medium">Funding</p>
                <p>{activeScholarship.amount}</p>
              </div>
              <div>
                <p className="font-medium">Deadline</p>
                <p>{activeScholarship.deadline || "Not specified"}</p>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (currentStep === 1) {
      return (
        <section className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-blue-700">
              <ClipboardCheck className="h-6 w-6" />
              <h3 className="text-2xl font-bold text-slate-900">
                Qualifications
              </h3>
            </div>
            <p className="mt-2 text-base text-slate-600">
              Add the academic and eligibility details that support your match.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-base">
            <p className="mb-3 text-base font-semibold text-slate-900">
              Scholarship Requirements
            </p>
            <DetailList items={requirementItems} />
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 xl:grid-cols-2">
            {renderInput("alStream", "A/L Stream", {
              placeholder: "Science, Commerce, Arts, Technology",
            })}
            {renderInput("alResults", "A/L Results", {
              placeholder: "A, B, C or subject-wise results",
            })}
            {renderInput("zScore", "Z-Score", {
              placeholder: "Optional",
            })}
            {renderInput("gpa", "GPA / Average", {
              placeholder: "Optional",
            })}
            {renderInput("englishTest", "English Test", {
              placeholder: "IELTS, TOEFL, PTE",
            })}
            {renderInput("englishScore", "English Score", {
              placeholder: "Optional",
            })}
          </div>

          {renderInput("householdIncome", "Household Income", {
            placeholder: "Optional for need-based scholarships",
          })}
          {renderTextarea(
            "achievements",
            "Achievements, Leadership, Or Special Circumstances",
            {
              minHeight: "min-h-32",
              placeholder:
                "List projects, leadership roles, sports, awards, volunteering, or other relevant context.",
            },
          )}
          {renderTextarea("qualificationSummary", "Qualification Summary", {
            required: true,
            minHeight: "min-h-40",
            placeholder:
              "Explain how your qualifications meet this scholarship's requirements.",
          })}
          {renderTextarea(
            "coverLetter",
            "Cover Letter / Personal Statement",
            {
              minHeight: "min-h-44",
              placeholder:
                "Write the statement you want to submit with this scholarship application.",
            },
          )}
        </section>
      );
    }

    return (
      <section className="space-y-8">
        <div>
          <div className="flex items-center gap-2 text-blue-700">
            <Files className="h-6 w-6" />
            <h3 className="text-2xl font-bold text-slate-900">
              Documents And Review
            </h3>
          </div>
          <p className="mt-2 text-base text-slate-600">
            Attach the required documents and confirm the application summary.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-slate-900">
                Documents attached
              </p>
              <p className="text-base text-slate-600">
                {requiredDocuments.length === 0
                  ? "No required documents listed"
                  : `${attachedDocumentCount} of ${requiredDocuments.length} required documents ready`}
              </p>
            </div>
            <Badge
              className={
                documentsComplete
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-900"
              }
            >
              {documentsComplete ? "Complete" : "Needs documents"}
            </Badge>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width:
                  requiredDocuments.length === 0
                    ? "100%"
                    : `${Math.round(
                        (attachedDocumentCount / requiredDocuments.length) *
                          100,
                      )}%`,
              }}
            />
          </div>
        </div>

        {requiredDocuments.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-base text-slate-600">
            This scholarship has no required documents listed.
          </div>
        ) : (
          <div className="space-y-4">
            {requiredDocuments.map((requirement) => {
              const choice = documentChoices[requirement];
              const isAttached = Boolean(choice?.documentId || choice?.fileName);
              const inputId = `document-upload-${activeScholarship.id}-${normalizeDocumentName(
                requirement,
              )}`;

              return (
                <div
                  key={requirement}
                  className={`rounded-lg border p-5 ${
                    isAttached
                      ? "border-green-200 bg-green-50/70"
                      : attemptedSubmit
                        ? "border-red-200 bg-red-50/70"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <p className="text-base font-semibold text-slate-900">
                          {requirement}
                        </p>
                        {isAttached && (
                          <Badge className="bg-green-100 text-green-800">
                            Attached
                          </Badge>
                        )}
                      </div>
                      {choice?.fileName ? (
                        <p className="mt-2 text-base text-slate-600">
                          {choice.fileName}
                        </p>
                      ) : (
                        <p className="mt-2 text-base text-slate-500">
                          Choose an uploaded profile document or attach a new
                          file.
                        </p>
                      )}
                      {attemptedSubmit && !isAttached && (
                        <p className="mt-2 text-sm font-semibold text-red-700">
                          This document is required.
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem]">
                      <select
                        value={
                          choice?.source === "EXISTING_PROFILE_DOCUMENT"
                            ? choice.documentId ?? ""
                            : ""
                        }
                        onChange={(event) =>
                          handleExistingDocumentChange(
                            requirement,
                            event.target.value,
                          )
                        }
                        className="h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900"
                      >
                        <option value="">Use uploaded document</option>
                        {uploadedDocuments.map((document) => (
                          <option key={document.id} value={document.id}>
                            {document.name}
                            {document.fileName
                              ? ` - ${document.fileName}`
                              : ""}
                          </option>
                        ))}
                      </select>
                      <Label
                        htmlFor={inputId}
                        className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-base font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Label>
                      <Input
                        id={inputId}
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(event) =>
                          handleRequirementUpload(requirement, event)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {uploadedDocuments.length === 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-base text-amber-900">
            No profile documents are uploaded yet. Files attached here will be
            available from the profile document list later.
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="text-base font-semibold text-slate-900">
            Application Review
          </p>
          <div className="mt-4 grid gap-4 text-base text-slate-700 md:grid-cols-2">
            <div>
              <p className="font-medium text-slate-900">Applicant</p>
              <p>{formData.fullName || "Not entered"}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Email</p>
              <p>{formData.email || "Not entered"}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Level</p>
              <p>{formData.intendedLevel || "Not entered"}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Field</p>
              <p>{formData.fieldOfStudy || "Not entered"}</p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  if (!scholarship) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scholarship application</DialogTitle>
            <DialogDescription>
              Select a scholarship before starting an application.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[calc(100vh-2rem)] max-h-[calc(100vh-2rem)] overflow-hidden p-0"
        style={{
          width: "96vw",
          maxWidth: "108rem",
        }}
      >
        <div className="flex h-full min-h-0 flex-col bg-slate-50">
          <DialogHeader className="border-b border-slate-200 bg-white px-6 py-6 pr-16 shadow-sm sm:px-8 lg:px-12 lg:pr-20">
            <DialogTitle className="text-3xl leading-tight">
              Apply for {scholarship.title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-base">
              {scholarship.provider} - {scholarship.amount}
            </DialogDescription>
          </DialogHeader>

          {submitSuccess ? (
            <div className="space-y-6 px-6 py-8 sm:px-8 lg:px-12">
              <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-900">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold">{submitSuccess}</p>
                    <p className="mt-2 text-base">
                      You can continue tracking this application from the
                      Applied section in your profile.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="h-12 w-full text-base"
              >
                Done
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid min-h-full xl:grid-cols-[minmax(0,1fr)_24rem]">
                  <div className="bg-white px-6 py-8 pb-12 sm:px-8 lg:px-12">
                    {submitError && (
                      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-base text-red-800">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                          <p>{submitError}</p>
                        </div>
                      </div>
                    )}

                    <div className="mb-8 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
                      {applicationSteps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = currentStep === index;

                        return (
                          <button
                            key={step.title}
                            type="button"
                            onClick={() => setCurrentStep(index)}
                            className={`h-full rounded-xl border bg-white p-4 text-left shadow-sm transition ${
                              isActive
                                ? "border-blue-300 ring-1 ring-blue-200"
                                : "border-slate-200 hover:border-blue-200 hover:shadow"
                            }`}
                          >
                            <div className="flex h-full items-center gap-3">
                              <span
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                  step.complete
                                    ? "bg-green-100 text-green-700"
                                    : isActive
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {step.complete ? (
                                  <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                  <StepIcon className="h-5 w-5" />
                                )}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-base font-semibold text-slate-900">
                                  {step.title}
                                </span>
                                <span className="hidden text-sm text-slate-500 sm:block">
                                  {step.description}
                                </span>
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {renderStepContent()}
                  </div>

                  <aside className="hidden border-l border-slate-200 bg-slate-100 p-8 xl:block">
                    <div className="sticky top-4 space-y-5">
                      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-base font-semibold text-slate-900">
                          Application Progress
                        </p>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          {completedStepCount} of {applicationSteps.length} steps
                          ready
                        </p>
                      </div>

                      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        {applicationSteps.map((step, index) => (
                          <button
                            key={step.title}
                            type="button"
                            onClick={() => setCurrentStep(index)}
                            className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left ${
                              currentStep === index
                                ? "border-blue-300 bg-blue-50"
                                : "border-transparent bg-transparent hover:border-slate-200"
                            }`}
                          >
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                step.complete
                                  ? "bg-green-100 text-green-700"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {step.complete ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                index + 1
                              )}
                            </span>
                            <span>
                              <span className="block text-base font-semibold text-slate-900">
                                {step.title}
                              </span>
                              <span className="text-sm text-slate-500">
                                {step.description}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-5 text-base text-slate-700 shadow-sm">
                        <p className="font-semibold text-slate-900">
                          Scholarship Summary
                        </p>
                        <div className="mt-3 space-y-3">
                          <div className="flex items-start gap-2">
                            <DollarSign className="mt-0.5 h-5 w-5 text-blue-600" />
                            <span>{scholarship.amount}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Calendar className="mt-0.5 h-5 w-5 text-blue-600" />
                            <span>{scholarship.deadline || "Not specified"}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <FileText className="mt-0.5 h-5 w-5 text-blue-600" />
                            <span>
                              {requiredDocuments.length === 0
                                ? "No required documents"
                                : `${attachedDocumentCount} / ${requiredDocuments.length} documents attached`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>

              <div className="z-20 border-t border-slate-200 bg-white px-6 py-5 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] sm:px-8 lg:px-12 lg:py-6">
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="h-12 px-5 text-base"
                  >
                    Cancel
                  </Button>
                  <div className="flex flex-col-reverse gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPreviousStep}
                      disabled={currentStep === 0 || isSubmitting}
                      className="h-12 px-5 text-base"
                    >
                      <ChevronLeft className="mr-2 h-5 w-5" />
                      Back
                    </Button>
                    {currentStep < applicationSteps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={goToNextStep}
                        className="h-12 bg-blue-600 px-6 text-base text-white hover:bg-blue-700"
                      >
                        Next
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 bg-blue-600 px-6 text-base text-white hover:bg-blue-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Submitting
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ScholarshipCard({
  scholarship,
  index,
  featured,
  daysUntilDeadline,
  onViewDetails,
  onApplyNow,
}: {
  scholarship: BrowseScholarship;
  index: number;
  featured: boolean;
  daysUntilDeadline: number;
  onViewDetails: (scholarship: BrowseScholarship) => void;
  onApplyNow: (scholarship: BrowseScholarship) => void;
}) {
  const isUrgent = daysUntilDeadline <= 30 && daysUntilDeadline > 0;
  const isExpired = daysUntilDeadline < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group h-full"
    >
      <Card
        className={`overflow-hidden h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
          featured ? "border-2 border-blue-300" : "border hover:border-blue-200"
        }`}
      >
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={scholarship.imageUrl}
            alt={scholarship.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg">
                <Zap className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              className={`${
                scholarship.category === "Fully Funded"
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 text-white"
              } border-0 shadow-md`}
            >
              {scholarship.category}
            </Badge>
          </div>

          {/* Deadline Badge */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <Badge
              className={`${
                isExpired
                  ? "bg-red-500 text-white"
                  : isUrgent
                    ? "bg-yellow-500 text-white"
                    : "bg-blue-500 text-white"
              } border-0 shadow-md`}
            >
              <Clock className="w-3 h-3 mr-1" />
              {isExpired
                ? "Expired"
                : isUrgent
                  ? `${daysUntilDeadline} days left`
                  : scholarship.deadline
                    ? new Date(scholarship.deadline).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                        },
                      )
                    : "No deadline"}
            </Badge>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          {/* Title & Provider */}
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {scholarship.title}
          </h3>
          <p className="text-sm text-slate-600 mb-3">{scholarship.provider}</p>

          {/* Info Grid */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="line-clamp-1">{scholarship.country}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <GraduationCap className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="line-clamp-1">{scholarship.level}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <DollarSign className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span className="font-semibold line-clamp-1">
                {scholarship.amount}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">
            {scholarship.description}
          </p>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => onViewDetails(scholarship)}
              className="w-full"
            >
              View Details
            </Button>
            <Button
              onClick={() => onApplyNow(scholarship)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:opacity-90"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
