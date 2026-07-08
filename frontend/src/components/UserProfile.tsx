import { useEffect, useState, useRef, type ReactNode } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  createStudentDocumentPreviewUrl,
  getStoredStudentDocuments,
  mergeStudentDocuments,
  readStudentDocumentFile,
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
import {
  authApi,
  scholarshipApi,
  STUDENT_ID_KEY,
  studentProfileCache,
  tokenService,
  type ApplicationDocumentDto,
  type StudentApplicationResponse,
  type StudentProfileResponse,
} from "@/services/api";

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

const PROFILE_PICTURE_MAX_BYTES = 1024 * 1024;
const PROFILE_PICTURE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type AppliedScholarshipStatus =
  | "submitted"
  | "under-review"
  | "shortlisted"
  | "accepted"
  | "rejected";

interface AppliedScholarship {
  id: number;
  name: string;
  provider: string;
  appliedDate: string;
  lastUpdated: string;
  status: AppliedScholarshipStatus;
  referenceCode: string;
  nextUpdate: string;
  requiredAction: string;
  documents: string[];
  submittedDocuments: ApplicationDocumentDto[];
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
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
  matchPercentage?: number;
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const cachedStudentProfile = getCachedStudentProfileForActiveStudent();
  const initialStudentUserId = resolveStudentUserId();
  const [documents, setDocuments] = useState<StudentDocument[]>(
    () => getStoredStudentDocuments(initialStudentUserId),
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [studentProfile, setStudentProfile] =
    useState<StudentProfileResponse | null>(cachedStudentProfile);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(() =>
    mapStudentProfileToProfileData(cachedStudentProfile),
  );
  const [editForm, setEditForm] = useState<ProfileData>(() =>
    mapStudentProfileToProfileData(cachedStudentProfile),
  );
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
  const [isProfilePictureSaving, setIsProfilePictureSaving] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState("");

  const [applicationScholarship, setApplicationScholarship] =
    useState<BrowseScholarship | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [trackedApplication, setTrackedApplication] =
    useState<AppliedScholarship | null>(null);
  const [appliedScholarships, setAppliedScholarships] = useState<
    AppliedScholarship[]
  >([]);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState("");
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(false);

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [documentViewError, setDocumentViewError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  const uploadedCount = documents.filter((d) => d.status === "uploaded").length;
  const totalDocs = documents.length;
  const documentCompletion =
    totalDocs > 0 ? Math.round((uploadedCount / totalDocs) * 25) : 0;
  const backendProfileCompletion =
    studentProfile?.profileCompletionPercentage ?? 0;
  const profileCompletion = Math.min(
    100,
    Math.round(backendProfileCompletion * 0.75 + documentCompletion),
  );
  const allDocsUploaded = uploadedCount === totalDocs;

  const loadAppliedScholarships = async (
    studentUserId: number,
    shouldUpdate: () => boolean = () => true,
  ) => {
    setIsApplicationsLoading(true);
    setApplicationsError("");

    try {
      const response = await scholarshipApi.getStudentApplications(studentUserId);
      if (!shouldUpdate()) return;

      if (response.success && response.data) {
        setAppliedScholarships(
          response.data.map(mapStudentApplicationToAppliedScholarship),
        );
        return;
      }

      throw new Error(response.message || "Failed to load applications");
    } catch (err: any) {
      if (!shouldUpdate()) return;
      setAppliedScholarships([]);
      setApplicationsError(err?.message || "Could not load applications");
    } finally {
      if (shouldUpdate()) {
        setIsApplicationsLoading(false);
      }
    }
  };

  useEffect(() => {
    const studentUserId = resolveStudentUserId();
    const cachedProfile = studentProfileCache.getProfile(studentUserId);

    if (cachedProfile) {
      const nextProfile = mapStudentProfileToProfileData(cachedProfile);
      setStudentProfile(cachedProfile);
      setProfile(nextProfile);
      setEditForm(nextProfile);
      setProfileError("");
    }

    if (!studentUserId) {
      if (!cachedProfile) {
        setProfileError("Complete student registration to load your profile.");
      }
      return;
    }

    let isActive = true;
    setIsProfileLoading(true);
    setProfileError("");
    setIsMatchCountLoading(true);
    setMatchCountError("");
    setIsApplicationsLoading(true);
    setApplicationsError("");
    setIsDocumentsLoading(true);
    setDocumentViewError("");

    scholarshipApi
      .getStudentProfile(studentUserId)
      .then((response) => {
        if (!isActive) return;

        if (response.success && response.data) {
          studentProfileCache.setProfile(response.data);
          setStudentProfile(response.data);
          const nextProfile = mapStudentProfileToProfileData(response.data);
          setProfile(nextProfile);
          setEditForm(nextProfile);
          return;
        }

        throw new Error(response.message || "Failed to load profile");
      })
      .catch((err: any) => {
        if (!isActive) return;
        const fallbackProfile = studentProfileCache.getProfile(studentUserId);
        if (fallbackProfile) {
          const nextProfile = mapStudentProfileToProfileData(fallbackProfile);
          setStudentProfile(fallbackProfile);
          setProfile(nextProfile);
          setEditForm(nextProfile);
          setProfileError("");
          return;
        }

        setStudentProfile(null);
        setProfileError(err?.message || "Could not load your profile");
      })
      .finally(() => {
        if (isActive) {
          setIsProfileLoading(false);
        }
      });

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

    loadAppliedScholarships(studentUserId, () => isActive);

    scholarshipApi
      .getStudentDocuments(studentUserId)
      .then((response) => {
        if (!isActive) return;

        if (response.success) {
          const nextDocuments = mergeStudentDocuments(response.data ?? []);
          setDocuments(nextDocuments);
          saveStudentDocuments(nextDocuments, studentUserId);
          return;
        }

        throw new Error(response.message || "Failed to load documents");
      })
      .catch((err: any) => {
        if (!isActive) return;
        console.error("Failed to load student documents:", err);
        setDocuments(getStoredStudentDocuments(studentUserId));
        setDocumentViewError(
          err?.message || "Could not load saved documents from the database.",
        );
      })
      .finally(() => {
        if (isActive) {
          setIsDocumentsLoading(false);
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
    setDocumentViewError("");
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

  const handleApplicationSubmitted = () => {
    const studentUserId = resolveStudentUserId();
    if (studentUserId) {
      loadAppliedScholarships(studentUserId);
    }
    setActiveTab("applied");
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const selectedIndex = uploadingIndex;
    setUploadingIndex(null);

    if (file && selectedIndex !== null) {
      const studentUserId = resolveStudentUserId();
      if (!studentUserId) {
        setDocumentViewError("Please log in before uploading documents.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      try {
        const fileDataUrl = await readStudentDocumentFile(file);
        const uploadedDocument: StudentDocument = {
          ...documents[selectedIndex],
          status: "uploaded",
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileDataUrl,
          fileUrl: undefined,
          uploadedAt: new Date().toISOString(),
        };
        const optimisticDocuments = documents.map((doc, i) =>
          i === selectedIndex
            ? uploadedDocument
            : doc,
        );

        setDocuments(optimisticDocuments);
        const response = await scholarshipApi.upsertStudentDocument(
          studentUserId,
          uploadedDocument,
        );

        if (!response.success || !response.data) {
          throw new Error(response.message || "Failed to save document");
        }

        const nextDocuments = mergeStudentDocuments(
          optimisticDocuments.map((doc) =>
            doc.id === uploadedDocument.id ? response.data! : doc,
          ),
        );
        setDocuments(nextDocuments);
        saveStudentDocuments(nextDocuments, studentUserId);
        setDocumentViewError("");
      } catch (error: any) {
        console.error("Failed to save selected document", error);
        setDocuments(documents);
        setDocumentViewError(
          error?.message || "Could not save the selected document. Please try another file.",
        );
      }
    }

    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleViewDocument = (document: StudentDocument) => {
    setDocumentViewError("");

    let previewUrl: string | null = null;
    try {
      previewUrl = createStudentDocumentPreviewUrl(document);
    } catch (error) {
      console.error("Failed to prepare document preview", error);
    }

    if (!previewUrl) {
      setDocumentViewError(
        `${document.name} does not have a stored file to preview. Upload it again to view it here.`,
      );
      return;
    }

    const previewWindow = window.open(previewUrl, "_blank");
    if (!previewWindow) {
      setDocumentViewError("The document preview was blocked. Allow pop-ups and try again.");
      return;
    }

    previewWindow.opener = null;
    if (previewUrl.startsWith("blob:")) {
      window.setTimeout(() => URL.revokeObjectURL(previewUrl), 10 * 60 * 1000);
    }
  };

  const handleRemoveDocument = async (index: number) => {
    const documentToRemove = documents[index];
    if (!documentToRemove) return;

    const studentUserId = resolveStudentUserId();
    if (!studentUserId) {
      setDocumentViewError("Please log in before removing documents.");
      return;
    }

    const next = documents.map((doc, i) =>
      i === index
        ? {
            ...doc,
            status: "pending" as const,
            fileName: undefined,
            fileType: undefined,
            fileSize: undefined,
            fileDataUrl: undefined,
            fileUrl: undefined,
            uploadedAt: undefined,
          }
        : doc,
    );

    setDocuments(next);
    setDocumentViewError("");

    try {
      await scholarshipApi.deleteStudentDocument(studentUserId, documentToRemove.id);
      saveStudentDocuments(next, studentUserId);
    } catch (error: any) {
      console.error("Failed to remove student document", error);
      setDocuments(documents);
      setDocumentViewError(
        error?.message || "Could not remove the document from the database.",
      );
    }
  };

  const handleCompleteProfile = () => {
    setActiveTab("documents");
  };

  const handleEditClick = () => {
    onNavigate?.("student-register");
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    setProfile({ ...editForm });
    setIsEditing(false);
  };

  const handleProfilePictureUploadClick = () => {
    setProfilePictureError("");
    profilePictureInputRef.current?.click();
  };

  const handleProfilePictureSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (profilePictureInputRef.current) profilePictureInputRef.current.value = "";
    if (!file) return;

    if (!PROFILE_PICTURE_TYPES.has(file.type)) {
      setProfilePictureError("Choose a JPG, PNG, WebP, or GIF image.");
      return;
    }

    if (file.size > PROFILE_PICTURE_MAX_BYTES) {
      setProfilePictureError("Choose an image smaller than 1 MB.");
      return;
    }

    try {
      const profilePictureUrl = await readProfilePictureFile(file);
      await saveProfilePicture(profilePictureUrl);
    } catch (error: any) {
      console.error("Failed to update profile picture", error);
      setProfilePictureError(
        error?.message || "Could not update your profile picture.",
      );
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      await saveProfilePicture("");
    } catch (error: any) {
      console.error("Failed to remove profile picture", error);
      setProfilePictureError(
        error?.message || "Could not remove your profile picture.",
      );
    }
  };

  const saveProfilePicture = async (profilePictureUrl: string) => {
    const currentUser = getAuthenticatedStudentUser();
    if (!currentUser) {
      setProfilePictureError("Please sign in before updating your picture.");
      return;
    }

    setIsProfilePictureSaving(true);
    setProfilePictureError("");

    try {
      const authResponse = await authApi.updateProfilePicture({
        profilePictureUrl: profilePictureUrl || undefined,
      });

      if (!authResponse.success || !authResponse.data) {
        throw new Error(authResponse.message || "Failed to save profile picture");
      }

      const savedPictureUrl = authResponse.data.profilePictureUrl || "";
      const nextProfile = { ...profile, avatarUrl: savedPictureUrl };
      setProfile(nextProfile);
      setEditForm({ ...editForm, avatarUrl: savedPictureUrl });

      if (studentProfile) {
        const optimisticStudentProfile = {
          ...studentProfile,
          profilePictureUrl: savedPictureUrl,
        };
        setStudentProfile(optimisticStudentProfile);
        studentProfileCache.setProfile(optimisticStudentProfile);
      }

      const studentUserId = resolveStudentUserId();
      if (studentUserId && studentProfile) {
        try {
          const profileResponse = await scholarshipApi.updateStudentProfilePicture(
            studentUserId,
            { profilePictureUrl: savedPictureUrl || undefined },
          );

          if (profileResponse.success && profileResponse.data) {
            setStudentProfile(profileResponse.data);
            studentProfileCache.setProfile(profileResponse.data);
            setProfile(mapStudentProfileToProfileData(profileResponse.data));
            setEditForm(mapStudentProfileToProfileData(profileResponse.data));
          }
        } catch (syncError) {
          console.warn("Profile picture saved to auth but profile sync failed", syncError);
        }
      }
    } finally {
      setIsProfilePictureSaving(false);
    }
  };

  const handleRemoveSavedScholarship = (scholarshipId: number) => {
    setSavedScholarships(removeSavedScholarship(scholarshipId));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <input
        ref={profilePictureInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleProfilePictureSelected}
      />

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
            {isProfileLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Loader2 className="mb-3 h-6 w-6 animate-spin text-blue-600" />
                <p className="font-medium text-slate-900">Loading profile</p>
                <p className="mt-1 text-sm text-slate-600">
                  Fetching your saved registration details.
                </p>
              </div>
            ) : profileError ? (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
                {profileError}
              </div>
            ) : isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">Edit Profile</h3>
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center mb-4">
                  <Avatar className="w-24 h-24 mx-auto mb-2">
                    {editForm.avatarUrl && (
                      <AvatarImage src={editForm.avatarUrl} />
                    )}
                    <AvatarFallback>
                      {editForm.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleProfilePictureUploadClick}
                      disabled={isProfilePictureSaving}
                    >
                      {isProfilePictureSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Upload photo
                    </Button>
                    {editForm.avatarUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveProfilePicture}
                        disabled={isProfilePictureSaving}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  {profilePictureError && (
                    <p className="mt-2 text-xs text-red-600">
                      {profilePictureError}
                    </p>
                  )}
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
                    {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} />}
                    <AvatarFallback>
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mb-3 flex justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleProfilePictureUploadClick}
                      disabled={isProfilePictureSaving}
                    >
                      {isProfilePictureSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Upload photo
                    </Button>
                    {profile.avatarUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveProfilePicture}
                        disabled={isProfilePictureSaving}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  {profilePictureError && (
                    <p className="mb-3 text-xs text-red-600">
                      {profilePictureError}
                    </p>
                  )}
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
                    Edit Registration
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
                <div className="space-y-6">
                  <section>
                    <h4 className="mb-3 text-sm font-semibold uppercase text-slate-500">
                      Study Goals
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProfileField
                        label="Highest Education"
                        value={studentProfile?.highestEducation}
                      />
                      <ProfileField
                        label="Current Status"
                        value={studentProfile?.currentStatus}
                      />
                      <ProfileField
                        label="Intended Level"
                        value={formatEducationLevel(
                          studentProfile?.intendedLevel,
                        )}
                      />
                      <ProfileField
                        label="Intended Year"
                        value={studentProfile?.intendedYear}
                      />
                      <ProfileField
                        label="Preferred Mode"
                        value={studentProfile?.preferredMode}
                      />
                      <ProfileField
                        label="Preferred Location"
                        value={studentProfile?.preferredLocation}
                      />
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-3 text-sm font-semibold uppercase text-slate-500">
                      Ordinary Level
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProfileField label="Exam Year" value={studentProfile?.olYear} />
                      <ProfileField label="Exam Type" value={studentProfile?.olType} />
                      <ProfileField label="Medium" value={studentProfile?.olMedium} />
                      <ProfileField label="Passed Subjects" value={studentProfile?.olPassed} />
                      <ProfileField label="A Count" value={studentProfile?.olACount} />
                      <ProfileField label="B Count" value={studentProfile?.olBCount} />
                      <ProfileField label="C Count" value={studentProfile?.olCCount} />
                      <ProfileField label="Maths Grade" value={studentProfile?.mathsGrade} />
                      <ProfileField label="Science Grade" value={studentProfile?.scienceGrade} />
                      <ProfileField label="English Grade" value={studentProfile?.englishGrade} />
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-3 text-sm font-semibold uppercase text-slate-500">
                      Advanced Level
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProfileField label="Exam Year" value={studentProfile?.alYear} />
                      <ProfileField label="Stream" value={studentProfile?.alStream} />
                      <ProfileField label="Medium" value={studentProfile?.alMedium} />
                      <ProfileField label="Z-Score" value={studentProfile?.zScore} />
                      <ProfileField
                        label="Calculated GPA"
                        value={studentProfile?.calculatedGpa}
                      />
                      <ProfileField label="Subject 1" value={studentProfile?.subject1} />
                      <ProfileField label="Grade 1" value={studentProfile?.grade1} />
                      <ProfileField label="Subject 2" value={studentProfile?.subject2} />
                      <ProfileField label="Grade 2" value={studentProfile?.grade2} />
                      <ProfileField label="Subject 3" value={studentProfile?.subject3} />
                      <ProfileField label="Grade 3" value={studentProfile?.grade3} />
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-3 text-sm font-semibold uppercase text-slate-500">
                      English
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProfileField label="English Test" value={studentProfile?.englishTest} />
                      <ProfileField label="Overall Score" value={studentProfile?.overallScore} />
                      <ProfileField label="Exam Year" value={studentProfile?.examYear} />
                    </div>
                  </section>
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => onNavigate?.("student-register")}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Academic Info
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProfileField label="Full Name" value={studentProfile?.fullName} />
                  <ProfileField
                    label="Email"
                    value={studentProfile?.email || profile.email}
                  />
                  <ProfileField
                    label="NIC / Passport"
                    value={studentProfile?.nicPassport}
                  />
                  <ProfileField
                    label="Date of Birth"
                    value={formatSavedDate(studentProfile?.dateOfBirth)}
                  />
                  <ProfileField label="Age" value={studentProfile?.age} />
                  <ProfileField label="Gender" value={studentProfile?.gender} />
                  <ProfileField
                    label="Nationality"
                    value={studentProfile?.nationality}
                  />
                  <ProfileField label="District" value={studentProfile?.district} />
                  <ProfileField label="Province" value={studentProfile?.province} />
                  <ProfileField label="City" value={studentProfile?.city} />
                  <ProfileField label="Mobile" value={studentProfile?.mobile} />
                  <ProfileField
                    label="Preferred Language"
                    value={studentProfile?.preferredLanguage}
                  />
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => onNavigate?.("student-register")}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Personal Details
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Financial & Background
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProfileField
                    label="Monthly Household Income"
                    value={studentProfile?.householdIncome}
                  />
                  <ProfileField
                    label="Family Dependents"
                    value={studentProfile?.dependents}
                  />
                  <ProfileField
                    label="Employment Status"
                    value={studentProfile?.employmentStatus}
                  />
                  <ProfileField
                    label="Government Assistance"
                    value={studentProfile?.governmentAssistance}
                  />
                  <ProfileField label="Background" value={studentProfile?.background} />
                  <ProfileField label="Disability" value={studentProfile?.disability} />
                  <ProfileField
                    label="Sports Achievements"
                    value={studentProfile?.sports}
                  />
                  <ProfileField
                    label="Leadership Experience"
                    value={studentProfile?.leadership}
                  />
                  <ProfileField
                    label="First-Generation University Student"
                    value={studentProfile?.firstGeneration}
                  />
                </div>
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
                      {studentProfile?.preferredCountries?.length ? (
                        studentProfile.preferredCountries.map((country) => (
                          <Badge key={country}>{country}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">
                          Not specified
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">
                      Fields of Interest
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {studentProfile?.preferredFields?.length ? (
                        studentProfile.preferredFields.map((field) => (
                          <Badge key={field}>{field}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">
                          Not specified
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">
                      Scholarship Type
                    </p>
                    <Badge>
                      {formatScholarshipType(studentProfile?.scholarshipType)}
                    </Badge>
                  </div>
                  <ProfileField
                    label="Willing to Return to Sri Lanka"
                    value={studentProfile?.willingToReturn}
                  />
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => onNavigate?.("student-register")}
                >
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
                {isApplicationsLoading ? (
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-4 text-sm text-slate-600">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    Loading your submitted applications...
                  </div>
                ) : applicationsError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {applicationsError}
                  </div>
                ) : appliedScholarships.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
                    <p className="font-medium text-slate-900">
                      No applications submitted yet
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Scholarships you apply for will appear here.
                    </p>
                    <Button
                      className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                      size="sm"
                      onClick={() => onNavigate?.("scholarships")}
                    >
                      Browse Scholarships
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appliedScholarships.map((scholarship) => (
                      <div
                        key={scholarship.id}
                        className="p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="min-w-0">
                            <h4 className="break-words font-semibold text-slate-900">
                              {scholarship.name}
                            </h4>
                            <p className="break-words text-sm text-slate-600">
                              {scholarship.provider}
                            </p>
                          </div>
                          <Badge
                            className={`${getApplicationStatusClass(
                              scholarship.status,
                            )} flex-shrink-0 whitespace-nowrap`}
                          >
                            {getApplicationStatusLabel(scholarship.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          Applied on: {formatSavedDate(scholarship.appliedDate)}
                        </p>
                        <div className="mb-4 grid gap-3 rounded-lg bg-slate-50 p-3 text-sm sm:grid-cols-3">
                          <div className="min-w-0">
                            <p className="font-medium text-slate-500">Reference</p>
                            <p className="break-words text-slate-900">
                              {scholarship.referenceCode}
                            </p>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-500">Applicant</p>
                            <p className="break-words text-slate-900">
                              {scholarship.applicantName || "Not specified"}
                            </p>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-500">Match</p>
                            <p className="text-slate-900">
                              {formatApplicationMatch(scholarship.matchPercentage)}
                            </p>
                          </div>
                        </div>
                        {scholarship.submittedDocuments.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {scholarship.submittedDocuments.map((document, index) => (
                              <Badge
                                key={`${getApplicationDocumentKey(document)}-${index}`}
                                variant="secondary"
                                className="max-w-full whitespace-normal break-words px-2.5 py-1 text-left"
                              >
                                <FileText className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                                {formatApplicationDocument(document)}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setTrackedApplication(scholarship)}
                        >
                          View Application Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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

                {isDocumentsLoading && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                    <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                    Loading saved documents...
                  </div>
                )}

                {documentViewError && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <XCircle className="h-4 w-4 flex-shrink-0" />
                    {documentViewError}
                  </div>
                )}

                <div className="space-y-3">
                  {documents.map((doc, index) => {
                    const hasPreview = Boolean(doc.fileDataUrl || doc.fileUrl);

                    return (
                      <div
                        key={doc.id}
                        className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                          doc.status === "pending"
                            ? "border-orange-200 bg-orange-50/50"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {doc.status === "uploaded" ? (
                            <button
                              type="button"
                              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border transition-colors ${
                                hasPreview
                                  ? "border-green-100 bg-green-50 text-green-600 hover:bg-green-100"
                                  : "cursor-not-allowed border-transparent text-green-500 opacity-70"
                              }`}
                              onClick={() => handleViewDocument(doc)}
                              aria-label={
                                hasPreview
                                  ? `View ${doc.name}`
                                  : `${doc.name} preview unavailable`
                              }
                              title={
                                hasPreview
                                  ? `View ${doc.name}`
                                  : "Upload this document again to preview it"
                              }
                            >
                              <FileText className="w-5 h-5" />
                            </button>
                          ) : (
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-slate-400">
                              <FileText className="w-5 h-5" />
                            </span>
                          )}
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
                    );
                  })}
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
        contentClassName="max-w-6xl"
      />
      <ScholarshipApplicationDialog
        scholarship={applicationScholarship}
        open={isApplicationOpen}
        onOpenChange={setIsApplicationOpen}
        onApplicationSubmitted={handleApplicationSubmitted}
      />
      <Dialog
        open={trackedApplication !== null}
        onOpenChange={(open) => {
          if (!open) {
            setTrackedApplication(null);
          }
        }}
      >
        <DialogContent className="max-h-[calc(100vh-2rem)] max-w-4xl overflow-hidden p-0">
          {trackedApplication && (
            <>
              <DialogHeader className="border-b border-slate-200 bg-white px-6 py-5 pr-14">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <DialogTitle className="break-words text-2xl leading-tight text-slate-950">
                      {trackedApplication.name}
                    </DialogTitle>
                    <DialogDescription className="mt-2 break-words text-sm text-slate-600">
                      {trackedApplication.provider} - {trackedApplication.referenceCode}
                    </DialogDescription>
                  </div>
                  <Badge
                    className={`${getApplicationStatusClass(
                      trackedApplication.status,
                    )} w-fit flex-shrink-0 whitespace-nowrap`}
                  >
                    {getApplicationStatusLabel(trackedApplication.status)}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="max-h-[calc(100vh-9rem)] overflow-y-auto px-6 py-5">
                <div className="space-y-6">
                  <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                    <ApplicationDetailField
                      label="Status"
                      value={getApplicationStatusLabel(trackedApplication.status)}
                      compact
                    />
                    <ApplicationDetailField
                      label="Applied on"
                      value={formatSavedDate(trackedApplication.appliedDate)}
                      compact
                    />
                    <ApplicationDetailField
                      label="Last updated"
                      value={formatSavedDate(trackedApplication.lastUpdated)}
                      compact
                    />
                  </div>

                  <ApplicationSection title="Applicant">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <ApplicationDetailField
                        label="Applicant"
                        value={trackedApplication.applicantName}
                      />
                      <ApplicationDetailField
                        label="Email"
                        value={trackedApplication.applicantEmail}
                      />
                      <ApplicationDetailField
                        label="Phone"
                        value={trackedApplication.applicantPhone}
                      />
                      <ApplicationDetailField
                        label="Household income"
                        value={trackedApplication.householdIncome}
                      />
                    </div>
                  </ApplicationSection>

                  <ApplicationSection title="Education and match">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <ApplicationDetailField
                        label="Current education"
                        value={trackedApplication.currentEducation}
                      />
                      <ApplicationDetailField
                        label="Intended level"
                        value={trackedApplication.intendedLevel}
                      />
                      <ApplicationDetailField
                        label="Field of study"
                        value={trackedApplication.fieldOfStudy}
                      />
                      <ApplicationDetailField
                        label="A/L stream"
                        value={trackedApplication.alStream}
                      />
                      <ApplicationDetailField
                        label="A/L results"
                        value={trackedApplication.alResults}
                      />
                      <ApplicationDetailField
                        label="Z-score"
                        value={trackedApplication.zScore}
                      />
                      <ApplicationDetailField
                        label="GPA / average"
                        value={trackedApplication.gpa}
                      />
                      <ApplicationDetailField
                        label="Match"
                        value={formatApplicationMatch(
                          trackedApplication.matchPercentage,
                        )}
                      />
                      <ApplicationDetailField
                        label="English test"
                        value={trackedApplication.englishTest}
                      />
                      <ApplicationDetailField
                        label="English score"
                        value={trackedApplication.englishScore}
                      />
                    </div>
                  </ApplicationSection>

                  {(trackedApplication.qualificationSummary ||
                    trackedApplication.coverLetter ||
                    trackedApplication.achievements) && (
                    <ApplicationSection title="Submitted statements">
                      <div className="space-y-3">
                        {trackedApplication.qualificationSummary && (
                          <ApplicationTextBlock
                            label="Qualification summary"
                            value={trackedApplication.qualificationSummary}
                          />
                        )}
                        {trackedApplication.coverLetter && (
                          <ApplicationTextBlock
                            label="Cover letter / personal statement"
                            value={trackedApplication.coverLetter}
                          />
                        )}
                        {trackedApplication.achievements && (
                          <ApplicationTextBlock
                            label="Achievements and special circumstances"
                            value={trackedApplication.achievements}
                          />
                        )}
                      </div>
                    </ApplicationSection>
                  )}

                  <ApplicationSection title="Application timeline">
                    <div className="space-y-3">
                      {getApplicationTrackingSteps(trackedApplication).map(
                        (step) => (
                          <div key={step.title} className="flex gap-3">
                            <div
                              className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                                step.isRejected
                                  ? "bg-red-100 text-red-700"
                                  : step.isActive
                                  ? "bg-blue-100 text-blue-700"
                                  : step.isComplete
                                    ? "bg-green-100 text-green-700"
                                    : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {step.isRejected ? (
                                <XCircle className="h-4 w-4" />
                              ) : step.isComplete ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                              <p className="break-words font-medium text-slate-900">
                                {step.title}
                              </p>
                              <p className="mt-1 break-words text-sm text-slate-600">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </ApplicationSection>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="min-w-0 rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <p className="text-sm font-semibold text-blue-950">
                        Next update
                      </p>
                      <p className="mt-1 break-words text-sm text-blue-900">
                        {trackedApplication.nextUpdate}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-lg border border-orange-200 bg-orange-50 p-4">
                      <p className="text-sm font-semibold text-orange-950">
                        Required action
                      </p>
                      <p className="mt-1 break-words text-sm text-orange-900">
                        {trackedApplication.requiredAction}
                      </p>
                    </div>
                  </div>

                  <ApplicationSection title="Submitted documents">
                    {trackedApplication.submittedDocuments.length > 0 ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {trackedApplication.submittedDocuments.map((document, index) => (
                          <div
                            key={`${getApplicationDocumentKey(document)}-${index}`}
                            className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3"
                          >
                            <p className="break-words text-sm font-semibold text-slate-900">
                              {document.requirementName ||
                                document.documentName ||
                                "Submitted document"}
                            </p>
                            <p className="mt-1 break-words text-sm text-slate-600">
                              {formatApplicationDocument(document)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : trackedApplication.documents.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {trackedApplication.documents.map((document) => (
                          <Badge
                            key={document}
                            variant="secondary"
                            className="max-w-full whitespace-normal break-words px-3 py-1 text-left"
                          >
                            <FileText className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                            {document}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-600">
                        No documents were attached to this application.
                      </p>
                    )}
                  </ApplicationSection>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
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

function formatApplicationMatch(value?: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${Math.round(value)}%`
    : "Not available";
}

function getApplicationDocumentKey(document: ApplicationDocumentDto) {
  return [
    document.requirementName,
    document.documentId,
    document.fileName,
    document.documentName,
  ]
    .filter(Boolean)
    .join("-");
}

function formatApplicationDocument(document: ApplicationDocumentDto) {
  const name = document.documentName || document.requirementName;
  if (document.fileName && name && document.fileName !== name) {
    return `${name} (${document.fileName})`;
  }
  return document.fileName || name || "Submitted document";
}

function ApplicationDetailField({
  label,
  value,
  compact = false,
}: {
  label: string;
  value?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-lg ${
        compact ? "bg-transparent p-0" : "border border-slate-200 bg-white p-3"
      }`}
    >
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
        {value?.trim() || "Not specified"}
      </p>
    </div>
  );
}

function ApplicationSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 break-words font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}

function ApplicationTextBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="break-words text-sm font-semibold text-slate-900">{label}</p>
      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
        {value}
      </p>
    </div>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) {
  const isEmpty = value === undefined || value === null || value === "";

  return (
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <div className="font-medium text-slate-900">
        {isEmpty ? "Not specified" : value}
      </div>
    </div>
  );
}

function BadgeList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <span className="text-sm text-slate-500">Not specified</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => (
        <Badge key={item} variant="secondary">
          {item}
        </Badge>
      ))}
    </div>
  );
}

function resolveStudentUserId() {
  const currentUser = getAuthenticatedStudentUser();
  if (currentUser) {
    localStorage.setItem(STUDENT_ID_KEY, String(currentUser.id));
    return currentUser.id;
  }

  const storedId = Number(localStorage.getItem(STUDENT_ID_KEY));
  if (Number.isFinite(storedId) && storedId > 0) {
    return storedId;
  }

  const cachedProfile = studentProfileCache.getProfile();
  if (cachedProfile?.userId) {
    localStorage.setItem(STUDENT_ID_KEY, String(cachedProfile.userId));
    return cachedProfile.userId;
  }

  return null;
}

function getCachedStudentProfileForActiveStudent() {
  const currentUser = getAuthenticatedStudentUser();
  if (currentUser) {
    return studentProfileCache.getProfile(currentUser.id);
  }

  const storedId = Number(localStorage.getItem(STUDENT_ID_KEY));
  if (Number.isFinite(storedId) && storedId > 0) {
    return studentProfileCache.getProfile(storedId);
  }

  return studentProfileCache.getProfile();
}

function mapStudentProfileToProfileData(
  profile: StudentProfileResponse | null,
): ProfileData {
  const currentUser = getAuthenticatedStudentUser();
  const location = [
    profile?.city,
    profile?.district,
    profile?.province ? `${profile.province} Province` : "",
  ].filter(Boolean);

  const streamParts = [
    profile?.currentStatus,
    profile?.alStream ? `${profile.alStream} Stream` : "",
    profile?.intendedLevel
      ? `Target: ${formatEducationLevel(profile.intendedLevel)}`
      : "",
  ].filter(Boolean);

  return {
    name: profile?.fullName || "Student",
    email: profile?.email || currentUser?.email || "Email not available",
    phone: profile?.mobile || "Phone not specified",
    location: location.length > 0 ? location.join(", ") : "Location not specified",
    stream:
      streamParts.length > 0 ? streamParts.join(" - ") : "Academic profile not specified",
    avatarUrl: currentUser?.profilePictureUrl || profile?.profilePictureUrl || "",
  };
}

function readProfilePictureFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read the selected image."));
      }
    };
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

function getAuthenticatedStudentUser() {
  const currentUser = tokenService.isAuthenticated()
    ? tokenService.getUser()
    : null;

  return currentUser?.role === "STUDENT" ? currentUser : null;
}

function displayText(value?: string | number | null) {
  if (value === undefined || value === null || value === "") {
    return "Not specified";
  }
  return String(value);
}

function formatEducationLevel(value?: string | null) {
  if (!value) return "Not specified";
  const normalized = value.toUpperCase();
  if (normalized === "UNDERGRADUATE") return "Bachelor's / Undergraduate";
  if (normalized === "POSTGRADUATE") return "Master's / Postgraduate";
  if (normalized === "PHD") return "PhD";
  return value;
}

function formatScholarshipType(value?: string | null) {
  if (!value) return "Not specified";
  const labels: Record<string, string> = {
    FULL: "Fully Funded",
    PARTIAL: "Partial Funding",
    TUITION: "Tuition Only",
    LIVING_EXPENSES: "Living Allowance",
  };
  return labels[value] || value;
}

function formatEnglishProficiency(profile: StudentProfileResponse | null) {
  if (!profile?.englishTest) return "Not specified";
  return profile.overallScore
    ? `${profile.englishTest} ${profile.overallScore}`
    : profile.englishTest;
}

function formatOlCounts(profile: StudentProfileResponse | null) {
  const counts = [
    profile?.olACount !== undefined ? `A: ${profile.olACount}` : "",
    profile?.olBCount !== undefined ? `B: ${profile.olBCount}` : "",
    profile?.olCCount !== undefined ? `C: ${profile.olCCount}` : "",
  ].filter(Boolean);

  return counts.length > 0 ? counts.join(", ") : "Not specified";
}

function formatCoreOlGrades(profile: StudentProfileResponse | null) {
  const grades = [
    profile?.mathsGrade ? `Maths: ${profile.mathsGrade}` : "",
    profile?.scienceGrade ? `Science: ${profile.scienceGrade}` : "",
    profile?.englishGrade ? `English: ${profile.englishGrade}` : "",
  ].filter(Boolean);

  return grades.length > 0 ? grades.join(", ") : "Not specified";
}

function getAlSubjectBadges(profile: StudentProfileResponse | null) {
  if (!profile) return [];
  return [
    [profile.subject1, profile.grade1],
    [profile.subject2, profile.grade2],
    [profile.subject3, profile.grade3],
  ]
    .filter(([subject]) => subject)
    .map(([subject, grade]) => (grade ? `${subject} (${grade})` : String(subject)));
}

function mapStudentApplicationToAppliedScholarship(
  application: StudentApplicationResponse,
): AppliedScholarship {
  const status = normalizeApplicationStatus(application.status);

  return {
    id: application.applicationId,
    name: application.scholarshipTitle || "Unknown Scholarship",
    provider: application.providerName || "Scholarship provider",
    appliedDate: application.appliedAt,
    lastUpdated: application.updatedAt || application.appliedAt,
    status,
    referenceCode: `APP-${application.applicationId}`,
    nextUpdate: getApplicationNextUpdate(status),
    requiredAction: getApplicationRequiredAction(status),
    documents: application.requiredDocuments || [],
    submittedDocuments: application.submittedDocuments || [],
    applicantName: application.applicantName || "",
    applicantEmail: application.applicantEmail || "",
    applicantPhone: application.applicantPhone || "",
    currentEducation: application.currentEducation || "",
    intendedLevel: application.intendedLevel || "",
    fieldOfStudy: application.fieldOfStudy || "",
    alStream: application.alStream || "",
    alResults: application.alResults || "",
    zScore: application.zScore || "",
    gpa: application.gpa || "",
    englishTest: application.englishTest || "",
    englishScore: application.englishScore || "",
    householdIncome: application.householdIncome || "",
    achievements: application.achievements || "",
    qualificationSummary: application.qualificationSummary || "",
    coverLetter: application.coverLetter || "",
    matchPercentage: application.matchPercentage,
  };
}

function normalizeApplicationStatus(status?: string): AppliedScholarshipStatus {
  const normalized = (status || "SUBMITTED").toLowerCase().replace(/_/g, "-");
  if (
    normalized === "submitted" ||
    normalized === "under-review" ||
    normalized === "shortlisted" ||
    normalized === "accepted" ||
    normalized === "rejected"
  ) {
    return normalized;
  }

  return "submitted";
}

function getApplicationNextUpdate(status: AppliedScholarshipStatus) {
  const messages: Record<AppliedScholarshipStatus, string> = {
    submitted: "The provider has received your application.",
    "under-review": "The provider is reviewing your eligibility and documents.",
    shortlisted: "Watch for interview, document verification, or final decision updates.",
    accepted: "Your application has been accepted.",
    rejected: "A final decision has been recorded for this application.",
  };

  return messages[status];
}

function getApplicationRequiredAction(status: AppliedScholarshipStatus) {
  const messages: Record<AppliedScholarshipStatus, string> = {
    submitted: "No action is needed unless the provider requests more information.",
    "under-review": "Keep your documents ready for verification.",
    shortlisted: "Prepare for the next selection step from the provider.",
    accepted: "Follow the provider's acceptance instructions.",
    rejected: "No action is required for this application.",
  };

  return messages[status];
}

function getApplicationStatusLabel(status: AppliedScholarshipStatus) {
  const labels: Record<AppliedScholarshipStatus, string> = {
    submitted: "Submitted",
    "under-review": "Under Review",
    shortlisted: "Shortlisted",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  return labels[status];
}

function getApplicationStatusClass(status: AppliedScholarshipStatus) {
  const classes: Record<AppliedScholarshipStatus, string> = {
    submitted: "bg-blue-100 text-blue-700",
    "under-review": "bg-orange-100 text-orange-700",
    shortlisted: "bg-purple-100 text-purple-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return classes[status];
}

function getApplicationTrackingSteps(application: AppliedScholarship) {
  const currentStepIndex: Record<AppliedScholarshipStatus, number> = {
    submitted: 0,
    "under-review": 1,
    shortlisted: 2,
    accepted: 3,
    rejected: 3,
  };

  const finalStepDescription =
    application.status === "accepted"
      ? "Your application has been accepted by the scholarship provider."
      : application.status === "rejected"
        ? "Your application was not selected in this round."
        : "Final decision will appear here after review is complete.";

  const steps = [
    {
      title: "Submitted",
      description: `Application received on ${formatSavedDate(application.appliedDate)}.`,
    },
    {
      title: "Under review",
      description:
        "The provider is checking eligibility, documents, and scholarship fit.",
    },
    {
      title: "Shortlist",
      description:
        "Reviewers compare applications and prepare interview or shortlist decisions.",
    },
    {
      title: application.status === "rejected" ? "Decision issued" : "Decision",
      description: finalStepDescription,
    },
  ];

  const activeIndex = currentStepIndex[application.status];

  return steps.map((step, index) => ({
    ...step,
    isActive: index === activeIndex && application.status !== "accepted",
    isComplete: index < activeIndex || application.status === "accepted",
    isRejected: application.status === "rejected" && index === activeIndex,
  }));
}
