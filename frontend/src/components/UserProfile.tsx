import { useState, useRef } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
  Award,
  X,
  Save,
  Upload,
  Trash2,
} from "lucide-react";
import {
  getStoredStudentDocuments,
  saveStudentDocuments,
  type StudentDocument,
} from "@/utils/studentDocuments";

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
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadedCount = documents.filter((d) => d.status === "uploaded").length;
  const totalDocs = documents.length;
  // Profile completion: personal info (25%) + academics (25%) + english (25%) + documents (25% scaled by upload ratio)
  const profileCompletion = Math.round(75 + (uploadedCount / totalDocs) * 25);
  const allDocsUploaded = uploadedCount === totalDocs;

  const handleUploadClick = (index: number) => {
    setUploadingIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const savedScholarships = [
    {
      id: 1,
      name: "Commonwealth Master's Scholarship",
      deadline: "2026-03-31",
      status: "saved",
    },
    {
      id: 2,
      name: "Australia Awards Scholarship",
      deadline: "2026-04-30",
      status: "saved",
    },
  ];

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
            <p className="text-3xl font-bold text-blue-600 mb-1">5</p>
            <p className="text-sm text-slate-600">
              scholarships match your profile
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
                <div className="space-y-4">
                  {savedScholarships.map((scholarship) => (
                    <div
                      key={scholarship.id}
                      className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">
                            {scholarship.name}
                          </h4>
                          <p className="text-sm text-slate-600">
                            Deadline:{" "}
                            {new Date(scholarship.deadline).toLocaleDateString(
                              "en-GB",
                            )}
                          </p>
                        </div>
                        <Bookmark className="w-5 h-5 text-blue-600 fill-blue-600" />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Apply Now
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
    </div>
  );
}
