import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  GraduationCap,
  FileText,
  Globe,
  DollarSign,
  Star,
  Info,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface FormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  nicPassport: string;
  district: string;
  province: string;
  city: string;
  email: string;
  mobile: string;
  preferredLanguage: string;
  highestEducation: string;
  currentStatus: string;
  intendedLevel: string;
  intendedYear: string;
  preferredMode: string;
  preferredLocation: string;
  olYear: string;
  olType: string;
  olMedium: string;
  olPassed: string;
  olA: string;
  olB: string;
  olC: string;
  mathsGrade: string;
  scienceGrade: string;
  englishGrade: string;
  alYear: string;
  alStream: string;
  alMedium: string;
  subject1: string;
  grade1: string;
  subject2: string;
  grade2: string;
  subject3: string;
  grade3: string;
  zScore: string;
  englishTest: string;
  overallScore: string;
  examYear: string;
  householdIncome: string;
  dependents: string;
  employmentStatus: string;
  governmentAssistance: string;
  background: string;
  disability: string;
  sports: string;
  leadership: string;
  firstGeneration: string;
  preferredCountries: string[];
  preferredFields: string[];
  scholarshipType: string;
  willingToReturn: string;
}

const steps = [
  {
    id: 1,
    name: "Personal Info",
    icon: User,
    description: "Basic details about you",
  },
  {
    id: 2,
    name: "Academic Level",
    icon: GraduationCap,
    description: "Your study goals",
  },
  {
    id: 3,
    name: "Qualifications",
    icon: FileText,
    description: "O/L & A/L results",
  },
  {
    id: 4,
    name: "English & Research",
    icon: Globe,
    description: "Language proficiency",
  },
  {
    id: 5,
    name: "Financial Info",
    icon: DollarSign,
    description: "Optional but helpful",
  },
  {
    id: 6,
    name: "Preferences",
    icon: Star,
    description: "Your scholarship preferences",
  },
];

export function StudentRegistration({
  onComplete,
}: {
  onComplete: (data: FormData) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "Sri Lankan",
    nicPassport: "",
    district: "",
    province: "",
    city: "",
    email: "",
    mobile: "",
    preferredLanguage: "English",
    highestEducation: "",
    currentStatus: "",
    intendedLevel: "",
    intendedYear: "",
    preferredMode: "",
    preferredLocation: "",
    olYear: "",
    olType: "",
    olMedium: "",
    olPassed: "",
    olA: "",
    olB: "",
    olC: "",
    mathsGrade: "",
    scienceGrade: "",
    englishGrade: "",
    alYear: "",
    alStream: "",
    alMedium: "",
    subject1: "",
    grade1: "",
    subject2: "",
    grade2: "",
    subject3: "",
    grade3: "",
    zScore: "",
    englishTest: "",
    overallScore: "",
    examYear: "",
    householdIncome: "",
    dependents: "",
    employmentStatus: "",
    governmentAssistance: "",
    background: "",
    disability: "No",
    sports: "No",
    leadership: "No",
    firstGeneration: "No",
    preferredCountries: [],
    preferredFields: [],
    scholarshipType: "",
    willingToReturn: "",
  });

  const [savedProgress, setSavedProgress] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const saveProgress = () => {
    localStorage.setItem("scholarFinderProgress", JSON.stringify(formData));
    setSavedProgress(true);
    setTimeout(() => setSavedProgress(false), 3000);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.fullName &&
          formData.dateOfBirth &&
          formData.email &&
          formData.mobile
        );
      case 2:
        return (
          formData.highestEducation &&
          formData.currentStatus &&
          formData.intendedLevel
        );
      default:
        return true;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Student Registration
            </h2>
            <p className="text-slate-600 mt-1">
              {steps[currentStep - 1].description}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={saveProgress}
            className="hidden md:flex"
          >
            {savedProgress ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Progress
              </>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-slate-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2.5" />
        </div>

        {/* Step Indicators - Desktop */}
        <div className="hidden lg:flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`flex flex-col items-center flex-1 ${
                  step.id === currentStep
                    ? "text-blue-600"
                    : step.id < currentStep
                      ? "text-green-600"
                      : "text-slate-400"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    step.id === currentStep
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : step.id < currentStep
                        ? "bg-green-600 text-white"
                        : "bg-slate-200"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <span className="text-xs font-medium text-center">
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 mb-8 ${step.id < currentStep ? "bg-green-600" : "bg-slate-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Indicators - Mobile */}
        <div className="lg:hidden flex items-center gap-2 mt-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`h-2 flex-1 rounded-full transition-all ${
                step.id === currentStep
                  ? "bg-blue-600"
                  : step.id < currentStep
                    ? "bg-green-600"
                    : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card className="p-4 md:p-8 mb-6 shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      Personal Information
                    </h3>
                    <p className="text-sm text-slate-600">
                      Tell us about yourself
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">
                      Why we need this information
                    </p>
                    <p className="text-blue-800">
                      This information helps us verify your identity and match
                      you with scholarships that are available in your region.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label
                      htmlFor="fullName"
                      className="flex items-center gap-2"
                    >
                      Full Name <span className="text-red-500">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-slate-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Enter your name exactly as it appears on your NIC
                              or Passport
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        updateFormData("fullName", e.target.value)
                      }
                      placeholder="e.g., Saman Kumara Perera"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="dateOfBirth"
                      className="flex items-center gap-2"
                    >
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        updateFormData("dateOfBirth", e.target.value)
                      }
                      className="mt-1.5 text-base cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:scale-125 [&::-webkit-calendar-picker-indicator]:hover:bg-blue-500/5 [&::-webkit-calendar-picker-indicator]:hover:opacity-20 [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:brightness-0 text-[rgb(29,28,28)]"
                      max={new Date().toISOString().split("T")[0]}
                    />
                    {formData.dateOfBirth && (
                      <p className="text-sm text-slate-600 mt-1">
                        Age: {calculateAge(formData.dateOfBirth)} years
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gender" className="flex items-center gap-2">
                      Gender{" "}
                      <span className="text-slate-400 text-xs">(Optional)</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => updateFormData("gender", value)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="nationality"
                      className="flex items-center gap-2"
                    >
                      Nationality <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(value) =>
                        updateFormData("nationality", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sri Lankan">Sri Lankan</SelectItem>
                        <SelectItem value="Dual Citizen">
                          Dual Citizen
                        </SelectItem>
                        <SelectItem value="International">
                          International
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="nicPassport"
                      className="flex items-center gap-2"
                    >
                      NIC / Passport Number{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nicPassport"
                      value={formData.nicPassport}
                      onChange={(e) =>
                        updateFormData("nicPassport", e.target.value)
                      }
                      placeholder="e.g., 199912345678 or N1234567"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="district">
                      District <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) =>
                        updateFormData("district", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Colombo">Colombo</SelectItem>
                        <SelectItem value="Gampaha">Gampaha</SelectItem>
                        <SelectItem value="Kalutara">Kalutara</SelectItem>
                        <SelectItem value="Kandy">Kandy</SelectItem>
                        <SelectItem value="Matale">Matale</SelectItem>
                        <SelectItem value="Nuwara Eliya">
                          Nuwara Eliya
                        </SelectItem>
                        <SelectItem value="Galle">Galle</SelectItem>
                        <SelectItem value="Matara">Matara</SelectItem>
                        <SelectItem value="Hambantota">Hambantota</SelectItem>
                        <SelectItem value="Jaffna">Jaffna</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="province">Province</Label>
                    <Select
                      value={formData.province}
                      onValueChange={(value) =>
                        updateFormData("province", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Western">Western</SelectItem>
                        <SelectItem value="Central">Central</SelectItem>
                        <SelectItem value="Southern">Southern</SelectItem>
                        <SelectItem value="Northern">Northern</SelectItem>
                        <SelectItem value="Eastern">Eastern</SelectItem>
                        <SelectItem value="North Western">
                          North Western
                        </SelectItem>
                        <SelectItem value="North Central">
                          North Central
                        </SelectItem>
                        <SelectItem value="Uva">Uva</SelectItem>
                        <SelectItem value="Sabaragamuwa">
                          Sabaragamuwa
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="city">Current City / Town</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      placeholder="e.g., Colombo"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="your.email@example.com"
                      className="mt-1.5"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      We'll send scholarship matches to this email
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="mobile" className="flex items-center gap-2">
                      Mobile Number <span className="text-red-500">*</span>
                      <span className="text-xs text-slate-500">
                        (WhatsApp preferred)
                      </span>
                    </Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) => updateFormData("mobile", e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferredLanguage">
                      Preferred Language
                    </Label>
                    <Select
                      value={formData.preferredLanguage}
                      onValueChange={(value) =>
                        updateFormData("preferredLanguage", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sinhala">Sinhala</SelectItem>
                        <SelectItem value="Tamil">Tamil</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Academic Level */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      Academic Level & Study Goals
                    </h3>
                    <p className="text-sm text-slate-600">
                      Help us understand your educational journey
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-900">
                    <p className="font-medium mb-1">
                      This is crucial for matching
                    </p>
                    <p className="text-green-800">
                      Your current education level and target study level
                      determine which scholarships you're eligible for.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="highestEducation"
                      className="flex items-center gap-2"
                    >
                      Highest Education Level Completed{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.highestEducation}
                      onValueChange={(value) =>
                        updateFormData("highestEducation", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select your highest level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O/L">
                          O/L (Ordinary Level)
                        </SelectItem>
                        <SelectItem value="A/L">
                          A/L (Advanced Level)
                        </SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Bachelor">
                          Bachelor's Degree
                        </SelectItem>
                        <SelectItem value="Master">Master's Degree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="currentStatus"
                      className="flex items-center gap-2"
                    >
                      Current Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.currentStatus}
                      onValueChange={(value) =>
                        updateFormData("currentStatus", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="What are you doing now?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="School Student">
                          School Student (O/L)
                        </SelectItem>
                        <SelectItem value="A/L Student">A/L Student</SelectItem>
                        <SelectItem value="Undergraduate">
                          Undergraduate Student
                        </SelectItem>
                        <SelectItem value="Graduate">
                          Graduate (Completed Degree)
                        </SelectItem>
                        <SelectItem value="Employed">
                          Employed Professional
                        </SelectItem>
                        <SelectItem value="Researcher">Researcher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="intendedLevel"
                      className="flex items-center gap-2"
                    >
                      What do you want to study?{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.intendedLevel}
                      onValueChange={(value) =>
                        updateFormData("intendedLevel", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select your target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bachelor's">
                          Bachelor's Degree
                        </SelectItem>
                        <SelectItem value="Master's">
                          Master's Degree
                        </SelectItem>
                        <SelectItem value="PhD">PhD (Doctorate)</SelectItem>
                        <SelectItem value="Postgraduate Diploma">
                          Postgraduate Diploma
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1">
                      This is your scholarship goal
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="intendedYear">
                      When do you want to start?
                    </Label>
                    <Select
                      value={formData.intendedYear}
                      onValueChange={(value) =>
                        updateFormData("intendedYear", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                        <SelectItem value="2029">2029</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="preferredMode">Preferred Study Mode</Label>
                    <Select
                      value={formData.preferredMode}
                      onValueChange={(value) =>
                        updateFormData("preferredMode", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="How do you want to study?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Research-based">
                          Research-based
                        </SelectItem>
                        <SelectItem value="Online">
                          Online / Distance
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="preferredLocation">
                      Where do you want to study?
                    </Label>
                    <Select
                      value={formData.preferredLocation}
                      onValueChange={(value) =>
                        updateFormData("preferredLocation", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sri Lanka">
                          Sri Lanka only
                        </SelectItem>
                        <SelectItem value="Abroad">Abroad only</SelectItem>
                        <SelectItem value="Either">
                          No preference (Either)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: O/L and A/L Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      Your Qualifications
                    </h3>
                    <p className="text-sm text-slate-600">
                      O/L and A/L examination results
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <p className="font-medium mb-1">Fill what applies to you</p>
                    <p className="text-amber-800">
                      If you haven't completed A/Ls yet, just fill the O/L
                      section. You can update this later.
                    </p>
                  </div>
                </div>

                {/* O/L Section */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-blue-600 text-white p-2 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-blue-900 text-lg">
                      Ordinary Level (O/L)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="olYear">Examination Year</Label>
                      <Input
                        id="olYear"
                        type="number"
                        value={formData.olYear}
                        onChange={(e) =>
                          updateFormData("olYear", e.target.value)
                        }
                        placeholder="e.g., 2020"
                        className="mt-1.5 bg-white"
                        min="2000"
                        max={new Date().getFullYear()}
                      />
                    </div>

                    <div>
                      <Label htmlFor="olMedium">Medium</Label>
                      <Select
                        value={formData.olMedium}
                        onValueChange={(value) =>
                          updateFormData("olMedium", value)
                        }
                      >
                        <SelectTrigger className="mt-1.5 bg-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sinhala">Sinhala</SelectItem>
                          <SelectItem value="Tamil">Tamil</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="olPassed">Subjects Passed</Label>
                      <Input
                        id="olPassed"
                        type="number"
                        value={formData.olPassed}
                        onChange={(e) =>
                          updateFormData("olPassed", e.target.value)
                        }
                        placeholder="e.g., 9"
                        className="mt-1.5 bg-white"
                        min="0"
                        max="15"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mathsGrade">Mathematics Grade</Label>
                      <Select
                        value={formData.mathsGrade}
                        onValueChange={(value) =>
                          updateFormData("mathsGrade", value)
                        }
                      >
                        <SelectTrigger className="mt-1.5 bg-white">
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="S">S (Fail)</SelectItem>
                          <SelectItem value="W">W (Absent)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="scienceGrade">Science Grade</Label>
                      <Select
                        value={formData.scienceGrade}
                        onValueChange={(value) =>
                          updateFormData("scienceGrade", value)
                        }
                      >
                        <SelectTrigger className="mt-1.5 bg-white">
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="S">S (Fail)</SelectItem>
                          <SelectItem value="W">W (Absent)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="englishGrade">English Grade</Label>
                      <Select
                        value={formData.englishGrade}
                        onValueChange={(value) =>
                          updateFormData("englishGrade", value)
                        }
                      >
                        <SelectTrigger className="mt-1.5 bg-white">
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="S">S (Fail)</SelectItem>
                          <SelectItem value="W">W (Absent)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* A/L Section */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-green-600 text-white p-2 rounded-lg">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-green-900 text-lg">
                      Advanced Level (A/L)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="alYear">Examination Year</Label>
                      <Input
                        id="alYear"
                        type="number"
                        value={formData.alYear}
                        onChange={(e) =>
                          updateFormData("alYear", e.target.value)
                        }
                        placeholder="e.g., 2023"
                        className="mt-1.5 bg-white"
                        min="2000"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>

                    <div>
                      <Label htmlFor="alStream">Stream</Label>
                      <Select
                        value={formData.alStream}
                        onValueChange={(value) =>
                          updateFormData("alStream", value)
                        }
                      >
                        <SelectTrigger className="mt-1.5 bg-white">
                          <SelectValue placeholder="Select stream" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Science">
                            Science (Physical/Biological)
                          </SelectItem>
                          <SelectItem value="Commerce">Commerce</SelectItem>
                          <SelectItem value="Arts">Arts</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject1">Subject 1</Label>
                        <Input
                          id="subject1"
                          value={formData.subject1}
                          onChange={(e) =>
                            updateFormData("subject1", e.target.value)
                          }
                          placeholder="e.g., Physics"
                          className="mt-1.5 bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="grade1">Grade 1</Label>
                        <Select
                          value={formData.grade1}
                          onValueChange={(value) =>
                            updateFormData("grade1", value)
                          }
                        >
                          <SelectTrigger className="mt-1.5 bg-white">
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="S">S (Fail)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject2">Subject 2</Label>
                        <Input
                          id="subject2"
                          value={formData.subject2}
                          onChange={(e) =>
                            updateFormData("subject2", e.target.value)
                          }
                          placeholder="e.g., Chemistry"
                          className="mt-1.5 bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="grade2">Grade 2</Label>
                        <Select
                          value={formData.grade2}
                          onValueChange={(value) =>
                            updateFormData("grade2", value)
                          }
                        >
                          <SelectTrigger className="mt-1.5 bg-white">
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="S">S (Fail)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject3">Subject 3</Label>
                        <Input
                          id="subject3"
                          value={formData.subject3}
                          onChange={(e) =>
                            updateFormData("subject3", e.target.value)
                          }
                          placeholder="e.g., Biology"
                          className="mt-1.5 bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="grade3">Grade 3</Label>
                        <Select
                          value={formData.grade3}
                          onValueChange={(value) =>
                            updateFormData("grade3", value)
                          }
                        >
                          <SelectTrigger className="mt-1.5 bg-white">
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="S">S (Fail)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="zScore"
                        className="flex items-center gap-2"
                      >
                        Z-Score
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Your standardized Z-score for university
                                admission
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="zScore"
                        value={formData.zScore}
                        onChange={(e) =>
                          updateFormData("zScore", e.target.value)
                        }
                        placeholder="e.g., 1.5234"
                        className="mt-1.5 bg-white"
                        step="0.0001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: English & Research */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Globe className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      English Proficiency
                    </h3>
                    <p className="text-sm text-slate-600">
                      Critical for international scholarships
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-indigo-900">
                    <p className="font-medium mb-1">
                      English tests open more opportunities
                    </p>
                    <p className="text-indigo-800">
                      Most international scholarships require IELTS, TOEFL, or
                      PTE. If you haven't taken one yet, you can skip this for
                      now.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="englishTest">English Test Type</Label>
                    <Select
                      value={formData.englishTest}
                      onValueChange={(value) =>
                        updateFormData("englishTest", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select test" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IELTS">IELTS (Academic)</SelectItem>
                        <SelectItem value="TOEFL">TOEFL iBT</SelectItem>
                        <SelectItem value="PTE">PTE Academic</SelectItem>
                        <SelectItem value="O/L A/L Only">
                          O/L / A/L English Only
                        </SelectItem>
                        <SelectItem value="None">Haven't taken yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.englishTest &&
                    formData.englishTest !== "None" &&
                    formData.englishTest !== "O/L A/L Only" && (
                      <>
                        <div>
                          <Label htmlFor="overallScore">Overall Score</Label>
                          <Input
                            id="overallScore"
                            value={formData.overallScore}
                            onChange={(e) =>
                              updateFormData("overallScore", e.target.value)
                            }
                            placeholder={
                              formData.englishTest === "IELTS"
                                ? "e.g., 7.5"
                                : "e.g., 95"
                            }
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label htmlFor="examYear">Test Year</Label>
                          <Input
                            id="examYear"
                            type="number"
                            value={formData.examYear}
                            onChange={(e) =>
                              updateFormData("examYear", e.target.value)
                            }
                            placeholder="2024"
                            className="mt-1.5"
                            min="2020"
                            max={new Date().getFullYear()}
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Most tests are valid for 2 years
                          </p>
                        </div>
                      </>
                    )}
                </div>

                {formData.englishTest === "None" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-900">
                      <strong>Pro tip:</strong> Consider taking IELTS or TOEFL
                      soon if you're planning to study abroad. Many scholarships
                      require minimum scores of 6.5-7.0 (IELTS) or 90-100
                      (TOEFL).
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Financial Information */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      Financial & Background Information
                    </h3>
                    <p className="text-sm text-slate-600">
                      Optional but unlocks need-based scholarships
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-900">
                    <p className="font-medium mb-1">
                      This information is confidential and optional
                    </p>
                    <p className="text-orange-800">
                      Many scholarships prioritize students from lower-income
                      families. Providing this information can significantly
                      increase your matches.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="householdIncome">
                      Monthly Household Income
                    </Label>
                    <Select
                      value={formData.householdIncome}
                      onValueChange={(value) =>
                        updateFormData("householdIncome", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Below 50,000">
                          Below LKR 50,000
                        </SelectItem>
                        <SelectItem value="50,000-100,000">
                          LKR 50,000 - 100,000
                        </SelectItem>
                        <SelectItem value="100,000-200,000">
                          LKR 100,000 - 200,000
                        </SelectItem>
                        <SelectItem value="Above 200,000">
                          Above LKR 200,000
                        </SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dependents">Family Dependents</Label>
                    <Input
                      id="dependents"
                      type="number"
                      value={formData.dependents}
                      onChange={(e) =>
                        updateFormData("dependents", e.target.value)
                      }
                      placeholder="Number of people dependent on income"
                      className="mt-1.5"
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="employmentStatus">
                      Your Employment Status
                    </Label>
                    <Select
                      value={formData.employmentStatus}
                      onValueChange={(value) =>
                        updateFormData("employmentStatus", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Unemployed">
                          Unemployed / Student
                        </SelectItem>
                        <SelectItem value="Part-time">
                          Part-time Employed
                        </SelectItem>
                        <SelectItem value="Full-time">
                          Full-time Employed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="governmentAssistance">
                      Government Assistance (Samurdhi etc.)
                    </Label>
                    <Select
                      value={formData.governmentAssistance}
                      onValueChange={(value) =>
                        updateFormData("governmentAssistance", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="background">Background</Label>
                    <Select
                      value={formData.background}
                      onValueChange={(value) =>
                        updateFormData("background", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rural">Rural Area</SelectItem>
                        <SelectItem value="Urban">Urban Area</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="firstGeneration">
                      First-Generation University Student?
                    </Label>
                    <Select
                      value={formData.firstGeneration}
                      onValueChange={(value) =>
                        updateFormData("firstGeneration", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">
                          Yes (First in family to attend university)
                        </SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-slate-900 mb-4">
                    Special Categories
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">
                    These can unlock additional scholarship opportunities
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sports">Sports Achievements</Label>
                      <Select
                        value={formData.sports}
                        onValueChange={(value) =>
                          updateFormData("sports", value)
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">
                            Yes (District/National level)
                          </SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="leadership">Leadership Experience</Label>
                      <Select
                        value={formData.leadership}
                        onValueChange={(value) =>
                          updateFormData("leadership", value)
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">
                            Yes (Prefect, Club president, etc.)
                          </SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Preferences */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <Star className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      Your Scholarship Preferences
                    </h3>
                    <p className="text-sm text-slate-600">
                      Tell us what you're looking for
                    </p>
                  </div>
                </div>

                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-pink-900">
                    <p className="font-medium mb-1">Final step!</p>
                    <p className="text-pink-800">
                      These preferences help us show you the most relevant
                      scholarship matches first.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="scholarshipType">
                      Scholarship Type Preference
                    </Label>
                    <Select
                      value={formData.scholarshipType}
                      onValueChange={(value) =>
                        updateFormData("scholarshipType", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="What kind of funding?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fully Funded">
                          Fully Funded (Tuition + Living)
                        </SelectItem>
                        <SelectItem value="Partial">Partial Funding</SelectItem>
                        <SelectItem value="Tuition Only">
                          Tuition Fee Only
                        </SelectItem>
                        <SelectItem value="Living Allowance">
                          Living Allowance Only
                        </SelectItem>
                        <SelectItem value="Any">Any Type</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="willingToReturn">
                      Willing to Return to Sri Lanka After Study?
                    </Label>
                    <Select
                      value={formData.willingToReturn}
                      onValueChange={(value) =>
                        updateFormData("willingToReturn", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes, definitely</SelectItem>
                        <SelectItem value="Maybe">Maybe / Flexible</SelectItem>
                        <SelectItem value="No">No preference</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1">
                      Some scholarships require you to work in your home country
                      for a period
                    </p>
                  </div>

                  <div>
                    <Label>
                      Preferred Countries (Select all that interest you)
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        "Sri Lanka",
                        "USA",
                        "UK",
                        "Australia",
                        "Canada",
                        "Germany",
                        "Singapore",
                        "Japan",
                        "Netherlands",
                        "Sweden",
                        "South Korea",
                        "New Zealand",
                      ].map((country) => (
                        <Badge
                          key={country}
                          onClick={() => {
                            const current = formData.preferredCountries;
                            if (current.includes(country)) {
                              updateFormData(
                                "preferredCountries",
                                current.filter((c) => c !== country),
                              );
                            } else {
                              updateFormData("preferredCountries", [
                                ...current,
                                country,
                              ]);
                            }
                          }}
                          className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                            formData.preferredCountries.includes(country)
                              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          {formData.preferredCountries.includes(country) && (
                            <Check className="w-3 h-3 mr-1" />
                          )}
                          {country}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {formData.preferredCountries.length > 0
                        ? `${formData.preferredCountries.length} countries selected`
                        : "Click to select countries"}
                    </p>
                  </div>

                  <div>
                    <Label>Fields of Study (Select your interests)</Label>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        "Engineering",
                        "Medicine",
                        "IT & Computer Science",
                        "Business & Management",
                        "Natural Sciences",
                        "Social Sciences",
                        "Arts & Humanities",
                        "Law",
                        "Education",
                        "Agriculture",
                        "Architecture",
                      ].map((field) => (
                        <Badge
                          key={field}
                          onClick={() => {
                            const current = formData.preferredFields;
                            if (current.includes(field)) {
                              updateFormData(
                                "preferredFields",
                                current.filter((f) => f !== field),
                              );
                            } else {
                              updateFormData("preferredFields", [
                                ...current,
                                field,
                              ]);
                            }
                          }}
                          className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                            formData.preferredFields.includes(field)
                              ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          {formData.preferredFields.includes(field) && (
                            <Check className="w-3 h-3 mr-1" />
                          )}
                          {field}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {formData.preferredFields.length > 0
                        ? `${formData.preferredFields.length} fields selected`
                        : "Click to select fields of interest"}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 mt-8">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-900 text-lg">
                        Almost Done!
                      </h4>
                      <p className="text-sm text-green-700">
                        Click "Complete Registration" to see your scholarship
                        matches
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="text-center flex-1 md:hidden">
          <Button variant="ghost" size="sm" onClick={saveProgress}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>

        <Button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`px-8 ${currentStep === steps.length ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
        >
          {currentStep === steps.length ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Complete Registration
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center mt-6 text-sm text-slate-500">
        <p>
          Need help? Contact us at{" "}
          <a
            href="mailto:support@scholarfinder.lk"
            className="text-blue-600 hover:underline"
          >
            support@scholarfinder.lk
          </a>
        </p>
      </div>
    </div>
  );
}
