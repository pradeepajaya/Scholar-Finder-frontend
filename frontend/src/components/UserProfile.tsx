import { useEffect, useState, useRef, type FormEvent } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  User,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Edit,
  FileText,
  Bookmark,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  Award,
  X,
  XCircle,
  Save,
  Upload,
  Trash2,
  Loader2,
  Send,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  getStoredStudentDocuments,
  saveStudentDocuments,
  type StudentDocument,
} from "@/utils/studentDocuments";
import {
  getStoredSavedScholarships,
  removeSavedScholarship,
  type SavedScholarship,
} from "@/utils/savedScholarships";
import {
  BrowseScholarship,
  ScholarshipDetailsDialog,
  ScholarshipApplicationDialog,
  mapBackendScholarship,
} from "./ScholarshipsPage";
import { scholarshipApi, STUDENT_ID_KEY, tokenService } from "@/services/api";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  stream: string;
  avatarUrl: string;
}

interface UserProfileProps {
  onNavigate?: (page: string) => void;
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const [documents, setDocuments] = useState<StudentDocument[]>(
    getStoredStudentDocuments,
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [isMatchCountLoading, setIsMatchCountLoading] = useState(false);
  const [matchCountError, setMatchCountError] = useState("");
  const [savedScholarships, setSavedScholarships] = useState<
    SavedScholarship[]
  >(getStoredSavedScholarships);
  const [selectedSavedScholarship, setSelectedSavedScholarship] =
    useState<BrowseScholarship | null>(null);
  const [isSavedDetailsOpen, setIsSavedDetailsOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const [applicationScholarship, setApplicationScholarship] =
    useState<BrowseScholarship | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadedCount = documents.filter((d) => d.status === "uploaded").length;
  const totalDocs = documents.length;
  // Profile completion: personal info (25%) + academics (25%) + english (25%) + documents (25% scaled by upload ratio)
  const profileCompletion = Math.round(75 + (uploadedCount / totalDocs) * 25);
  const allDocsUploaded = uploadedCount === totalDocs;

  useEffect(() => {
    const storedStudentId = localStorage.getItem(STUDENT_ID_KEY);
    const currentUser = tokenService.getUser();
    const studentUserId = storedStudentId
      ? Number(storedStudentId)
      : currentUser?.role === "STUDENT"
        ? currentUser.id
        : null;

    if (!studentUserId) {
      return;
    }

    if (!storedStudentId) {
      localStorage.setItem(STUDENT_ID_KEY, String(studentUserId));
    }

    let isActive = true;
    setIsMatchCountLoading(true);
    setMatchCountError("");

    scholarshipApi
      .getMatches({
        studentUserId,
        minimumMatchPercentage: 50,
        limit: 20,
        sortBy: "MATCH_DESC",
      })
      .then((response) => {
        if (!isActive) return;

        if (response.success && response.data) {
          setMatchCount(response.data.matchesFound);
          return;
        }

        throw new Error(response.message || "Failed to load matches");
      })
      .catch((err: any) => {
        if (!isActive) return;
        setMatchCount(null);
        setMatchCountError(err?.message || "Could not load matches");
      })
      .finally(() => {
        if (isActive) {
          setIsMatchCountLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (activeTab === "saved") {
      setSavedScholarships(getStoredSavedScholarships());
    }
  }, [activeTab]);

  const handleUploadClick = (index: number) => {
    setUploadingIndex(index);
    fileInputRef.current?.click();
  };

  const openSavedDetails = async (scholarship: SavedScholarship) => {
    setIsSavedDetailsOpen(true);
    setDetailsError("");
    setIsDetailsLoading(true);
    try {
      const response = await scholarshipApi.getScholarship(scholarship.id);
      setSelectedSavedScholarship(mapBackendScholarship(response.data));
    } catch (error) {
      console.error("Failed to load scholarship details:", error);
      setDetailsError("Could not load details from the server.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const openSavedApplication = async (scholarship: SavedScholarship | BrowseScholarship) => {
    setIsApplicationOpen(true);
    setIsSavedDetailsOpen(false);
    try {
      const response = await scholarshipApi.getScholarship(scholarship.id);
      setApplicationScholarship(mapBackendScholarship(response.data));
    } catch (error) {
      console.error("Failed to refresh scholarship before applying:", error);
    }
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && uploadingIndex !== null) {
      setDocuments((prev) => {
        const next = prev.map((doc, i) =>
          i === uploadingIndex
            ? {
                ...doc,
                status: "uploaded" as const,
                fileName: file.name,
                uploadedAt: new Date().toISOString(),
              }
            : doc,
        );
        saveStudentDocuments(next);
        return next;
      });
    }
    setUploadingIndex(null);
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments((prev) => {
      const next = prev.map((doc, i) =>
        i === index
          ? { ...doc, status: "pending" as const, fileName: undefined }
          : doc,
      );
      saveStudentDocuments(next);
      return next;
    });
  };

  const handleCompleteProfile = () => {
    setActiveTab("documents");
  };

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "Saman Perera",
    email: "saman.perera@email.com",
    phone: "+94 77 123 4567",
    location: "Colombo, Sri Lanka",
    stream: "A/L - Science Stream",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  });
  const [editForm, setEditForm] = useState<ProfileData>({ ...profile });

  const handleEditClick = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    setProfile({ ...editForm });
    setIsEditing(false);
  };

  const handleRemoveSavedScholarship = (scholarshipId: number) => {
    setSavedScholarships(removeSavedScholarship(scholarshipId));
  };

  const getStudentIdForApplication = () => {
    const storedId = Number(localStorage.getItem(STUDENT_ID_KEY));
    if (Number.isFinite(storedId) && storedId > 0) {
      return storedId;
    }

    const userId = tokenService.getUser()?.id;
    return userId && userId > 0 ? userId : null;
  };

  const openSavedDetails = (scholarship: SavedScholarship) => {
    setSelectedSavedScholarship(scholarship);
    setIsSavedDetailsOpen(true);
  };

  const openSavedApplication = (scholarship: SavedScholarship) => {
    const currentUser = tokenService.getUser();

    setApplicationScholarship(scholarship);
    setApplicationForm({
      fullName: profile.name,
      email: currentUser?.email || profile.email,
      phone: profile.phone,
      currentEducation: profile.stream,
      intendedLevel: "",
      fieldOfStudy: "",
      qualificationSummary: "",
      coverLetter: "",
    });
    setApplicationError("");
    setApplicationSuccess("");
    setIsApplicationOpen(true);
    setIsSavedDetailsOpen(false);
  };

  const updateApplicationField = (
    field: keyof SavedApplicationForm,
    value: string,
  ) => {
    setApplicationForm((current) => ({ ...current, [field]: value }));
  };

  const handleSavedApplicationSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!applicationScholarship) return;

    const studentId = getStudentIdForApplication();

    setApplicationError("");
    setApplicationSuccess("");

    if (!studentId) {
      setApplicationError(
        "Please log in or complete student registration before submitting an application.",
      );
      return;
    }

    if (
      !applicationForm.fullName.trim() ||
      !applicationForm.email.trim() ||
      !applicationForm.qualificationSummary.trim()
    ) {
      setApplicationError(
        "Please complete your name, email, and qualification summary.",
      );
      return;
    }

    setIsSubmittingApplication(true);
    try {
      const response = await scholarshipApi.submitApplication(
        applicationScholarship.id,
        {
          studentId,
          scholarshipId: applicationScholarship.id,
          ...applicationForm,
          requiredDocuments: [],
          documents: [],
        },
      );

      setApplicationSuccess(
        response.data.updatedExistingApplication
          ? "Your existing application was updated successfully."
          : "Your application was submitted successfully.",
      );
    } catch (error) {
      setApplicationError(
        error instanceof Error
          ? error.message
          : "Could not submit the application. Please try again.",
      );
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const appliedScholarships = [
    {
      id: 1,
      name: "Fulbright Scholarship",
      appliedDate: "2026-01-10",
      status: "under-review",
    },
    {
      id: 2,
      name: "DAAD Master's Scholarship",
      appliedDate: "2026-01-05",
      status: "submitted",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
        <p className="text-slate-600">
          Manage your information and track your scholarship applications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">Edit Profile</h3>
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center mb-4">
                  <Avatar className="w-24 h-24 mx-auto mb-2">
                    <AvatarImage src={editForm.avatarUrl} />
                    <AvatarFallback>
                      {editForm.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label
                      htmlFor="edit-name"
                      className="text-sm text-slate-600"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="edit-name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="edit-email"
                      className="text-sm text-slate-600"
                    >
                      Email
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="edit-phone"
                      className="text-sm text-slate-600"
                    >
                      Phone
                    </Label>
                    <Input
                      id="edit-phone"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="edit-location"
                      className="text-sm text-slate-600"
                    >
                      Location
                    </Label>
                    <Input
                      id="edit-location"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="edit-stream"
                      className="text-sm text-slate-600"
                    >
                      Stream
                    </Label>
                    <Input
                      id="edit-stream"
                      value={editForm.stream}
                      onChange={(e) =>
                        setEditForm({ ...editForm, stream: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-4">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback>
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-slate-900">
                    {profile.name}
                  </h2>
                  <p className="text-sm text-slate-600">{profile.email}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={handleEditClick}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{profile.stream}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{profile.phone}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Profile Completion
            </h3>
            <Progress value={profileCompletion} className="h-2 mb-2" />
            <p className="text-sm text-slate-600 mb-4">
              {profileCompletion}% complete
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-slate-700">Personal Information</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-slate-700">Academic Qualifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-slate-700">English Proficiency</span>
              </div>
              <div className="flex items-center gap-2">
                {allDocsUploaded ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Clock className="w-4 h-4 text-orange-500" />
                )}
                <span className="text-slate-700">
                  Upload Documents ({uploadedCount}/{totalDocs})
                </span>
              </div>
            </div>
            {!allDocsUploaded && (
              <Button
                variant="outline"
                className="w-full mt-4"
                size="sm"
                onClick={handleCompleteProfile}
              >
                Complete Profile
              </Button>
            )}
            {allDocsUploaded && (
              <div className="mt-4 flex items-center gap-2 text-sm text-green-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Profile Complete!
              </div>
            )}
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900">
                Scholarship Matches
              </h3>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {isMatchCountLoading ? "..." : matchCount ?? "--"}
            </p>
            <p className="text-sm text-slate-600">
              {matchCountError
                ? "matches could not be loaded"
                : "scholarships match your profile"}
            </p>
            <Button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
              onClick={() => onNavigate?.("matches")}
            >
              View Matches
            </Button>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="applied">Applied</TabsTrigger>
              <TabsTrigger value="documents">
                Documents
                {!allDocsUploaded && (
                  <span className="ml-1.5 w-2 h-2 rounded-full bg-orange-500 inline-block" />
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Academic Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Current Status
                    </p>
                    <p className="font-medium text-slate-900">A/L Student</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Intended Level
                    </p>
                    <p className="font-medium text-slate-900">
                      Bachelor's Degree
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Stream</p>
                    <p className="font-medium text-slate-900">Science</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Z-Score</p>
                    <p className="font-medium text-slate-900">1.8523</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">A/L Subjects</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">Physics (A)</Badge>
                      <Badge variant="secondary">Chemistry (A)</Badge>
                      <Badge variant="secondary">Biology (B)</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      English Proficiency
                    </p>
                    <p className="font-medium text-slate-900">IELTS 7.5</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Academic Info
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Preferences
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">
                      Preferred Countries
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>USA</Badge>
                      <Badge>UK</Badge>
                      <Badge>Australia</Badge>
                      <Badge>Canada</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">
                      Fields of Interest
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Engineering</Badge>
                      <Badge>Computer Science</Badge>
                      <Badge>Medicine</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">
                      Scholarship Type
                    </p>
                    <Badge>Fully Funded</Badge>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Preferences
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="saved">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Saved Scholarships ({savedScholarships.length})
                </h3>
                {savedScholarships.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                    <Bookmark className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                    <p className="font-medium text-slate-900">
                      No saved scholarships yet
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Save scholarships from your matches to review them here.
                    </p>
                    <Button
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                      onClick={() => onNavigate?.("matches")}
                    >
                      View Matches
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {savedScholarships.map((scholarship) => {
                      const matchPercentage = scholarship.matchPercentage ?? 0;
                      const matchLabel =
                        matchPercentage >= 90
                          ? "Excellent Match"
                          : matchPercentage >= 80
                            ? "Good Match"
                            : "Fair Match";

                      return (
                        <div
                          key={scholarship.id}
                          className="overflow-hidden rounded-lg border-2 border-slate-200 transition-all hover:border-blue-300 hover:shadow-xl"
                        >
                          <div className="relative h-44 overflow-hidden">
                            <ImageWithFallback
                              src={scholarship.imageUrl}
                              alt={scholarship.title}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            <div className="absolute right-4 top-4">
                              <div className="relative">
                                <svg className="h-16 w-16 -rotate-90">
                                  <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="rgba(255,255,255,0.3)"
                                    strokeWidth="5"
                                    fill="none"
                                  />
                                  <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke={
                                      matchPercentage >= 90
                                        ? "#10b981"
                                        : matchPercentage >= 80
                                          ? "#3b82f6"
                                          : "#f59e0b"
                                    }
                                    strokeWidth="5"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 28}`}
                                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - matchPercentage / 100)}`}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-center">
                                    <div>
                                      <span className="block text-base font-bold leading-none text-slate-900">
                                        {matchPercentage}
                                      </span>
                                      <span className="block text-[10px] leading-none text-slate-600">
                                        %
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                              <Badge className="bg-white/95 text-slate-900 backdrop-blur-sm">
                                <MapPin className="mr-1 h-3 w-3" />
                                {scholarship.country}
                              </Badge>
                              <Badge className="bg-blue-600/95 text-white backdrop-blur-sm">
                                {scholarship.scholarshipType}
                              </Badge>
                            </div>
                          </div>

                          <div className="p-5">
                            <div className="mb-4">
                              <div className="mb-2 flex items-start justify-between gap-3">
                                <h4 className="line-clamp-2 text-lg font-bold text-slate-900">
                                  {scholarship.title}
                                </h4>
                                <Bookmark className="mt-1 h-5 w-5 flex-shrink-0 fill-blue-600 text-blue-600" />
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center text-sm text-slate-600">
                                  <GraduationCap className="mr-1.5 h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">
                                    {scholarship.provider}
                                  </span>
                                </div>
                                <Badge
                                  className={`border ${
                                    matchPercentage >= 90
                                      ? "border-green-300 bg-green-100 text-green-700"
                                      : matchPercentage >= 80
                                        ? "border-blue-300 bg-blue-100 text-blue-700"
                                        : "border-orange-300 bg-orange-100 text-orange-700"
                                  }`}
                                >
                                  {matchLabel}
                                </Badge>
                              </div>
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-3 border-b pb-4">
                              <div className="rounded-lg bg-green-50 p-3">
                                <div className="mb-1 flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <span className="text-xs font-medium text-green-900">
                                    Amount
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-green-900">
                                  {scholarship.amount}
                                </p>
                              </div>

                              <div className="rounded-lg bg-orange-50 p-3">
                                <div className="mb-1 flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-orange-600" />
                                  <span className="text-xs font-medium text-orange-900">
                                    Deadline
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-orange-900">
                                  {scholarship.deadline
                                    ? formatSavedDate(scholarship.deadline)
                                    : "No deadline"}
                                </p>
                              </div>
                            </div>

                            <p className="mb-4 line-clamp-3 text-sm text-slate-600">
                              {scholarship.description ||
                                "Scholarship details are being updated."}
                            </p>

                            <div className="mt-auto pt-4 border-t border-slate-100">
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                <Button
                                  variant="outline"
                                  onClick={() => openSavedDetails(scholarship)}
                                  className="w-full"
                                >
                                  View Details
                                </Button>
                                <Button
                                  onClick={() => openSavedApplication(scholarship)}
                                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:opacity-90"
                                >
                                  Apply Now
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                onClick={() => handleRemoveSavedScholarship(scholarship.id)}
                                className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50"
                                size="sm"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove from Saved
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="applied">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Applied Scholarships ({appliedScholarships.length})
                </h3>
                <div className="space-y-4">
                  {appliedScholarships.map((scholarship) => (
                    <div
                      key={scholarship.id}
                      className="p-4 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">
                          {scholarship.name}
                        </h4>
                        <Badge
                          className={
                            scholarship.status === "under-review"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {scholarship.status === "under-review"
                            ? "Under Review"
                            : "Submitted"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        Applied on:{" "}
                        {new Date(scholarship.appliedDate).toLocaleDateString(
                          "en-GB",
                        )}
                      </p>
                      <Button size="sm" variant="outline">
                        Track Application
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-900">
                    My Documents
                  </h3>
                  <span className="text-sm text-slate-500">
                    {uploadedCount}/{totalDocs} uploaded
                  </span>
                </div>

                {!allDocsUploaded && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    Please upload the remaining documents to complete your
                    profile.
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileSelected}
                />

                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                        doc.status === "pending"
                          ? "border-orange-200 bg-orange-50/50"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText
                          className={`w-5 h-5 flex-shrink-0 ${
                            doc.status === "uploaded"
                              ? "text-green-500"
                              : "text-slate-400"
                          }`}
                        />
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-slate-900 block">
                            {doc.name}
                          </span>
                          {doc.fileName && (
                            <span className="text-xs text-slate-500 truncate block">
                              {doc.fileName}
                            </span>
                          )}
                        </div>
                      </div>
                      {doc.status === "uploaded" ? (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className="bg-green-100 text-green-700">
                            Uploaded
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-400 hover:text-red-500 h-8 w-8 p-0"
                            onClick={() => handleRemoveDocument(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUploadClick(index)}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Upload
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {allDocsUploaded && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    All documents uploaded! Your profile is now complete.
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ScholarshipDetailsDialog
        scholarship={selectedSavedScholarship}
        open={isSavedDetailsOpen}
        onOpenChange={setIsSavedDetailsOpen}
        isLoading={isDetailsLoading}
        error={detailsError}
        onApplyNow={openSavedApplication}
      />
      <ScholarshipApplicationDialog
        scholarship={applicationScholarship}
        open={isApplicationOpen}
        onOpenChange={setIsApplicationOpen}
      />
    </div>
  );
}

function formatSavedDate(date?: string) {
  if (!date) return "Not specified";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

