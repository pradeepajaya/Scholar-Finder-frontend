import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  DollarSign,
  MapPin,
  ExternalLink,
  GraduationCap,
  Award,
  TrendingUp,
  Lock,
  UserPlus,
  Bookmark,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  MatchResponse,
  ScholarshipMatchDto,
  STUDENT_ID_KEY,
  scholarshipApi,
  tokenService,
} from "@/services/api";
import {
  getStoredSavedScholarships,
  saveScholarship,
} from "@/utils/savedScholarships";
import {
  BrowseScholarship,
  ScholarshipDetailsDialog,
  ScholarshipApplicationDialog,
  mapBackendScholarship,
} from "./ScholarshipsPage";

interface ScholarshipMatch {
  id: number;
  name: string;
  provider: string;
  country: string;
  amount: string;
  type: string;
  matchPercentage: number;
  deadline: string;
  matchedCriteria: string[];
  unmatchedCriteria: string[];
  applyLink: string;
  description: string;
  imageUrl: string;
}

interface ScholarshipMatchingProps {
  isRegistered: boolean;
  onNavigate: (
    page:
      | "home"
      | "student-register"
      | "institution-register"
      | "matches"
      | "scholarships"
      | "news"
      | "blog"
      | "success-stories"
      | "contact"
      | "profile",
  ) => void;
}

const mapMatchToCard = (match: ScholarshipMatchDto): ScholarshipMatch => {
  const amountDisplay = match.amountDisplay?.trim();
  const fallbackAmount =
    match.amount && match.currency
      ? `${match.currency} ${match.amount}`
      : "Contact for details";

  return {
    id: match.id,
    name: match.title,
    provider: match.provider || "Scholarship Provider",
    country: match.country || "Multiple",
    amount: amountDisplay || fallbackAmount,
    type: match.scholarshipType || "Scholarship",
    matchPercentage: Number(match.matchPercentage || 0),
    deadline: match.applicationDeadline || match.deadlineDisplay || "",
    matchedCriteria: match.matchedCriteria || [],
    unmatchedCriteria: match.unmatchedCriteria || [],
    applyLink: match.applyLink || "",
    description: match.description || "",
    imageUrl: match.imageUrl || "",
  };
};

export function ScholarshipMatching({
  isRegistered,
  onNavigate,
}: ScholarshipMatchingProps) {
  const [studentUserId] = useState<number | null>(() => {
    const stored = localStorage.getItem(STUDENT_ID_KEY);
    if (stored) {
      return Number(stored);
    }

    const currentUser = tokenService.getUser();
    if (currentUser?.role === "STUDENT") {
      localStorage.setItem(STUDENT_ID_KEY, String(currentUser.id));
      return currentUser.id;
    }

    return null;
  });
  const [scholarships, setScholarships] = useState<ScholarshipMatch[]>([]);
  const [matchResponse, setMatchResponse] = useState<MatchResponse | null>(
    null,
  );
  const [savedScholarshipIds, setSavedScholarshipIds] = useState<number[]>(() =>
    getStoredSavedScholarships().map((scholarship) => scholarship.id),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [selectedScholarship, setSelectedScholarship] = useState<BrowseScholarship | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const [applicationScholarship, setApplicationScholarship] = useState<BrowseScholarship | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const handleSaveScholarship = (scholarship: ScholarshipMatch) => {
    const nextSaved = saveScholarship({
      id: scholarship.id,
      title: scholarship.name,
      provider: scholarship.provider,
      country: scholarship.country,
      amount: scholarship.amount,
      scholarshipType: scholarship.type,
      deadline: scholarship.deadline,
      applyLink: scholarship.applyLink,
      description: scholarship.description,
      imageUrl: scholarship.imageUrl,
      matchPercentage: scholarship.matchPercentage,
      matchedCriteria: scholarship.matchedCriteria,
      unmatchedCriteria: scholarship.unmatchedCriteria,
    });

    setSavedScholarshipIds(nextSaved.map((item) => item.id));
  };

  const handleViewDetails = async (match: ScholarshipMatch) => {
    setIsDetailsOpen(true);
    setDetailsError("");
    setIsDetailsLoading(true);
    try {
      const response = await scholarshipApi.getScholarship(match.id);
      setSelectedScholarship(mapBackendScholarship(response.data));
    } catch (error) {
      console.error("Failed to load scholarship details:", error);
      setDetailsError("Could not load details from the server.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleApplyNow = async (match: ScholarshipMatch | BrowseScholarship) => {
    setIsApplicationOpen(true);
    setIsDetailsOpen(false);
    try {
      const response = await scholarshipApi.getScholarship(match.id);
      setApplicationScholarship(mapBackendScholarship(response.data));
    } catch (error) {
      console.error("Failed to refresh scholarship before applying:", error);
    }
  };

  const fetchMatches = async () => {
    if (!studentUserId) {
      return;
    }

    setIsLoading(true);
    setLoadError("");
    try {
      const response = await scholarshipApi.getMatches({
        studentUserId,
        minimumMatchPercentage: 50,
        limit: 20,
        sortBy: "MATCH_DESC",
      });

      if (response.success && response.data) {
        setMatchResponse(response.data);
        setScholarships(response.data.scholarships.map(mapMatchToCard));
      } else {
        throw new Error(response.message || "Failed to load matches");
      }
    } catch (err: any) {
      setLoadError(err?.message || "Failed to load your matches.");
      setScholarships([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studentUserId) {
      fetchMatches();
    }
  }, [studentUserId]);

  const canShowMatches = Boolean(studentUserId) || isRegistered;

  // If user is not registered, show registration prompt
  if (!canShowMatches || !studentUserId) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-2 border-blue-200">
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <Lock className="w-16 h-16 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Unlock Your Scholarship Matches
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Register now to access personalized scholarship recommendations
                tailored to your qualifications
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Personalized Matches
                  </h3>
                  <p className="text-sm text-slate-600">
                    Get scholarships matched to your exact qualifications and
                    goals
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Match Percentage
                  </h3>
                  <p className="text-sm text-slate-600">
                    See exactly how well you match with each scholarship
                    opportunity
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Detailed Criteria
                  </h3>
                  <p className="text-sm text-slate-600">
                    View which requirements you meet and which ones to improve
                  </p>
                </div>
              </div>

              {/* Feature List */}
              <div className="bg-slate-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-slate-900 mb-4 text-center">
                  What You'll Get After Registration:
                </h3>
                <ul className="space-y-3 max-w-xl mx-auto">
                  <li className="flex items-start text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>
                      Access to 500+ scholarship opportunities worldwide
                    </span>
                  </li>
                  <li className="flex items-start text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>
                      Intelligent matching algorithm with percentage scores
                    </span>
                  </li>
                  <li className="flex items-start text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>
                      Detailed breakdowns of matched and unmatched criteria
                    </span>
                  </li>
                  <li className="flex items-start text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>
                      Save and track your favorite scholarship opportunities
                    </span>
                  </li>
                  <li className="flex items-start text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Personalized profile to update as you progress</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => onNavigate("student-register")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
                  size="lg"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Register Now - It's Free
                </Button>
                <Button
                  onClick={() => onNavigate("scholarships")}
                  variant="outline"
                  className="px-8 py-6 text-lg border-slate-300"
                  size="lg"
                >
                  Browse All Scholarships
                </Button>
              </div>

              {/* Additional Info */}
              <p className="text-center text-sm text-slate-500 mt-6">
                Registration takes only 5-10 minutes and gives you lifetime
                access to our platform
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <Card className="p-6 text-center">
          <p className="text-slate-600">Loading your matches...</p>
        </Card>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <Card className="p-6 text-center space-y-4">
          <p className="text-red-600">{loadError}</p>
          <Button
            onClick={fetchMatches}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // Matched scholarships view for registered users
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Your Matched Scholarships
            </h2>
            <p className="text-slate-600 mt-1">
              Based on your profile, we found {scholarships.length} scholarships
              that match your qualifications
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {matchResponse?.excellentMatches ??
                    scholarships.filter((s) => s.matchPercentage >= 90).length}
                </p>
                <p className="text-sm text-green-700">
                  Excellent Matches (90%+)
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {
                    scholarships.filter((s) =>
                      s.amount.toLowerCase().includes("fully"),
                    ).length
                  }
                </p>
                <p className="text-sm text-blue-700">
                  Fully Funded Scholarships
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {
                    scholarships.filter(
                      (s) => s.deadline && new Date(s.deadline) > new Date(),
                    ).length
                  }
                </p>
                <p className="text-sm text-purple-700">Applications Open Now</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {scholarships.length === 0 && (
        <Card className="p-8 text-center text-slate-600 mb-6">
          No matches yet. Update your profile and try again.
        </Card>
      )}

      {/* Scholarship Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scholarships.map((scholarship, index) => (
          <motion.div
            key={scholarship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-2 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={scholarship.imageUrl}
                  alt={scholarship.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Match Badge */}
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke={
                          scholarship.matchPercentage >= 90
                            ? "#10b981"
                            : scholarship.matchPercentage >= 80
                              ? "#3b82f6"
                              : "#f59e0b"
                        }
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - scholarship.matchPercentage / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center bg-white rounded-full w-16 h-16 flex items-center justify-center">
                        <div>
                          <span className="text-xl font-bold text-slate-900">
                            {scholarship.matchPercentage}
                          </span>
                          <span className="text-xs text-slate-600 block leading-none">
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Country & Type Badges */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <Badge className="bg-white/95 text-slate-900 backdrop-blur-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {scholarship.country}
                  </Badge>
                  <Badge className="bg-blue-600/95 text-white backdrop-blur-sm">
                    {scholarship.type}
                  </Badge>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                    {scholarship.name}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <GraduationCap className="w-4 h-4 mr-1.5" />
                      {scholarship.provider}
                    </div>
                    <Badge
                      className={`${
                        scholarship.matchPercentage >= 90
                          ? "bg-green-100 text-green-700 border-green-300"
                          : scholarship.matchPercentage >= 80
                            ? "bg-blue-100 text-blue-700 border-blue-300"
                            : "bg-orange-100 text-orange-700 border-orange-300"
                      } border`}
                    >
                      {scholarship.matchPercentage >= 90
                        ? "Excellent Match"
                        : scholarship.matchPercentage >= 80
                          ? "Good Match"
                          : "Fair Match"}
                    </Badge>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-900">
                        Amount
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-green-900">
                      {scholarship.amount}
                    </p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span className="text-xs font-medium text-orange-900">
                        Deadline
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-orange-900">
                      {scholarship.deadline
                        ? new Date(scholarship.deadline).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "No deadline"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                  {scholarship.description}
                </p>

                {/* Match Details Accordion */}
                <Accordion type="single" collapsible className="mb-4">
                  <AccordionItem value="criteria" className="border-slate-200">
                    <AccordionTrigger className="text-sm font-semibold text-slate-900 py-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        View Match Details
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {/* Matched Criteria */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-900 mb-3 flex items-center text-sm">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            You Meet ({scholarship.matchedCriteria.length})
                          </h4>
                          <ul className="space-y-2">
                            {scholarship.matchedCriteria.map(
                              (criteria, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start text-xs text-green-800"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                                  <span>{criteria}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>

                        {/* Unmatched Criteria */}
                        {scholarship.unmatchedCriteria.length > 0 && (
                          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <h4 className="font-semibold text-orange-900 mb-3 flex items-center text-sm">
                              <XCircle className="w-4 h-4 mr-2" />
                              To Improve ({scholarship.unmatchedCriteria.length}
                              )
                            </h4>
                            <ul className="space-y-2">
                              {scholarship.unmatchedCriteria.map(
                                (criteria, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start text-xs text-orange-800"
                                  >
                                    <XCircle className="w-3.5 h-3.5 mr-2 mt-0.5 flex-shrink-0 text-orange-600" />
                                    <span>{criteria}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Action Buttons */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(scholarship)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleApplyNow(scholarship)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:opacity-90"
                    >
                      Apply Now
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleSaveScholarship(scholarship)}
                    disabled={savedScholarshipIds.includes(scholarship.id)}
                    className="w-full text-slate-500 hover:text-blue-600 disabled:opacity-100"
                    size="sm"
                  >
                    <Bookmark
                      className={`w-4 h-4 mr-2 ${
                        savedScholarshipIds.includes(scholarship.id)
                          ? "fill-blue-600 text-blue-600"
                          : ""
                      }`}
                    />
                    {savedScholarshipIds.includes(scholarship.id)
                      ? "Saved to Profile"
                      : "Save Scholarship"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">
          Can't find what you're looking for?
        </h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Update your profile or adjust your preferences to see more scholarship
          matches tailored to your goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            className="bg-white text-blue-600 hover:bg-blue-50"
            onClick={() => onNavigate("student-register")}
          >
            Update Profile
          </Button>
          <Button
            variant="outline"
            className="border-white text-[rgb(15,15,15)] hover:bg-white/10"
            onClick={() => onNavigate("scholarships")}
          >
            Browse All Scholarships
          </Button>
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
