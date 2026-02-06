import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
  "United Kingdom",
  "United States",
  "Germany",
  "Australia",
  "China",
  "Japan",
  "Multiple EU Countries",
];
const levels = ["All Levels", "Bachelors", "Masters", "PhD"];

export function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [showFilters, setShowFilters] = useState(false);

  // Temporary filter states (for the dropdowns before applying)
  const [tempCategory, setTempCategory] = useState("All");
  const [tempCountry, setTempCountry] = useState("All Countries");
  const [tempLevel, setTempLevel] = useState("All Levels");

  const featuredScholarships = scholarships.filter((s) => s.featured);
  const regularScholarships = scholarships.filter((s) => !s.featured);

  // Filter scholarships based on search and filters
  const filteredScholarships = regularScholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.fieldOfStudy
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || scholarship.category === selectedCategory;
    const matchesCountry =
      selectedCountry === "All Countries" ||
      scholarship.country === selectedCountry;
    const matchesLevel =
      selectedLevel === "All Levels" ||
      scholarship.level.includes(selectedLevel);

    return matchesSearch && matchesCategory && matchesCountry && matchesLevel;
  });

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

  const getDaysUntilDeadline = (deadline: string) => {
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
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Clear All Filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship, index) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                index={index}
                featured={false}
                daysUntilDeadline={getDaysUntilDeadline(scholarship.deadline)}
              />
            ))}
          </div>
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
    </div>
  );
}

function ScholarshipCard({
  scholarship,
  index,
  featured,
  daysUntilDeadline,
}: {
  scholarship: (typeof scholarships)[0];
  index: number;
  featured: boolean;
  daysUntilDeadline: number;
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
                  : new Date(scholarship.deadline).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
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
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white shadow-md">
            View Details
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
