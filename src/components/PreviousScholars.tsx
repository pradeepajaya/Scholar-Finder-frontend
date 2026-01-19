import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  GraduationCap,
  MapPin,
  Award,
  Facebook,
  Linkedin,
  ExternalLink,
  Plus,
  Send,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner@2.0.3";

const previousScholars = [
  {
    id: 1,
    name: "Nimali Perera",
    scholarship: "Commonwealth Master's Scholarship",
    year: "2023",
    field: "Computer Science",
    university: "University of Cambridge",
    country: "United Kingdom",
    currentRole: "AI Research Scientist at DeepMind",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    facebook: "https://facebook.com/nimali.perera",
    linkedin: "https://linkedin.com/in/nimali-perera",
    testimonial:
      "The Commonwealth Scholarship opened doors I never imagined. It wasn't just about the education - it was about the network, the exposure, and the confidence to pursue my dreams.",
  },
  {
    id: 2,
    name: "Kasun Bandara",
    scholarship: "Australia Awards Scholarship",
    year: "2022",
    field: "Environmental Engineering",
    university: "University of Melbourne",
    country: "Australia",
    currentRole: "Senior Environmental Consultant, Ministry of Environment",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    facebook: "https://facebook.com/kasun.bandara",
    linkedin: "https://linkedin.com/in/kasun-bandara",
    testimonial:
      "Returning to Sri Lanka after my Master's was the best decision. I'm now using everything I learned to make a real impact on environmental policy.",
  },
  {
    id: 3,
    name: "Thilini Jayawardena",
    scholarship: "Fulbright Scholarship",
    year: "2024",
    field: "Public Health",
    university: "Johns Hopkins University",
    country: "United States",
    currentRole: "PhD Candidate & Research Assistant",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    facebook: "https://facebook.com/thilini.j",
    linkedin: "https://linkedin.com/in/thilini-jayawardena",
    testimonial:
      "Fulbright gave me more than funding - it gave me a platform to conduct research that matters. I'm working on healthcare solutions for underserved communities.",
  },
  {
    id: 4,
    name: "Ravindu Silva",
    scholarship: "DAAD Master's Scholarship",
    year: "2023",
    field: "Mechanical Engineering",
    university: "Technical University of Munich",
    country: "Germany",
    currentRole: "Automotive Engineer at BMW",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    facebook: "https://facebook.com/ravindu.silva",
    linkedin: "https://linkedin.com/in/ravindu-silva",
    testimonial:
      "The DAAD scholarship was life-changing. The German education system and industry connections helped me land my dream job in automotive engineering.",
  },
  {
    id: 5,
    name: "Sachini Fernando",
    scholarship: "Chevening Scholarship",
    year: "2021",
    field: "International Relations",
    university: "London School of Economics",
    country: "United Kingdom",
    currentRole: "Foreign Service Officer, Ministry of Foreign Affairs",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
    facebook: "https://facebook.com/sachini.fernando",
    linkedin: "https://linkedin.com/in/sachini-fernando",
    testimonial:
      "Chevening connected me with future leaders from around the world. The network I built continues to be invaluable in my diplomatic career.",
  },
  {
    id: 6,
    name: "Dinesh Rajapaksa",
    scholarship: "Japanese Government (MEXT) Scholarship",
    year: "2022",
    field: "Robotics",
    university: "University of Tokyo",
    country: "Japan",
    currentRole: "Robotics Engineer & PhD Researcher",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    facebook: "https://facebook.com/dinesh.r",
    linkedin: "https://linkedin.com/in/dinesh-rajapaksa",
    testimonial:
      "The MEXT scholarship gave me access to cutting-edge robotics research. Japan's technology ecosystem is unparalleled and I'm grateful for this opportunity.",
  },
];

export function PreviousScholars() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    scholarship: "",
    year: "",
    field: "",
    university: "",
    country: "",
    currentRole: "",
    email: "",
    facebook: "",
    linkedin: "",
    testimonial: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending to admin for review
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDialogOpen(false);
      toast.success("Success Story Submitted!", {
        description:
          "Your story has been sent to our admin team for review. We'll notify you once it's approved.",
        duration: 5000,
      });

      // Reset form
      setFormData({
        name: "",
        scholarship: "",
        year: "",
        field: "",
        university: "",
        country: "",
        currentRole: "",
        email: "",
        facebook: "",
        linkedin: "",
        testimonial: "",
      });
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Success Stories
            </h2>
            <p className="text-slate-600">
              Meet our scholars who have achieved their dreams through
              scholarships and are now making a difference
            </p>
          </div>

          {/* Share Your Story Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Share Your Story
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Share Your Success Story
                </DialogTitle>
                <DialogDescription>
                  Inspire future scholars by sharing your journey. Your story
                  will be reviewed by our admin team before publishing.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> All submissions are reviewed by our
                    admin team to ensure quality and authenticity. You'll
                    receive an email notification once your story is approved.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Your full name"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="your.email@example.com"
                      className="mt-1.5"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      For admin communication only
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scholarship">
                      Scholarship Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="scholarship"
                      required
                      value={formData.scholarship}
                      onChange={(e) =>
                        handleInputChange("scholarship", e.target.value)
                      }
                      placeholder="e.g., Commonwealth Master's Scholarship"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="year">
                      Year Received <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="year"
                      required
                      value={formData.year}
                      onChange={(e) =>
                        handleInputChange("year", e.target.value)
                      }
                      placeholder="e.g., 2023"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="field">
                      Field of Study <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="field"
                      required
                      value={formData.field}
                      onChange={(e) =>
                        handleInputChange("field", e.target.value)
                      }
                      placeholder="e.g., Computer Science"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="university">
                      University <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="university"
                      required
                      value={formData.university}
                      onChange={(e) =>
                        handleInputChange("university", e.target.value)
                      }
                      placeholder="e.g., University of Cambridge"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="country"
                      required
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      placeholder="e.g., United Kingdom"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentRole">
                      Current Role/Position{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="currentRole"
                      required
                      value={formData.currentRole}
                      onChange={(e) =>
                        handleInputChange("currentRole", e.target.value)
                      }
                      placeholder="e.g., AI Research Scientist at DeepMind"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="testimonial">
                    Your Story & Testimonial{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="testimonial"
                    required
                    value={formData.testimonial}
                    onChange={(e) =>
                      handleInputChange("testimonial", e.target.value)
                    }
                    placeholder="Share your scholarship journey, what it meant to you, and how it has impacted your career..."
                    className="mt-1.5 min-h-[120px]"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Minimum 100 characters
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Social Media Links (Optional)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="facebook">Facebook Profile</Label>
                      <Input
                        id="facebook"
                        value={formData.facebook}
                        onChange={(e) =>
                          handleInputChange("facebook", e.target.value)
                        }
                        placeholder="https://facebook.com/yourprofile"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) =>
                          handleInputChange("linkedin", e.target.value)
                        }
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit for Review
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-900">
            <p className="font-medium">Are you a scholarship recipient?</p>
            <p className="text-green-800">
              Share your success story to inspire and guide future scholars on
              their journey!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {previousScholars.map((scholar, index) => (
          <motion.div
            key={scholar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
              <div className="p-6 bg-[rgba(15,140,252,0.12)]">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={scholar.image} alt={scholar.name} />
                    <AvatarFallback>
                      {scholar.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      {scholar.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {scholar.currentRole}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        asChild
                      >
                        <a
                          href={scholar.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        asChild
                      >
                        <a
                          href={scholar.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Scholarship Details */}
                <div className="bg-[rgb(255,255,255)] rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">
                      {scholar.scholarship}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                    <div>
                      <span className="text-slate-500">Year:</span>{" "}
                      {scholar.year}
                    </div>
                    <div>
                      <span className="text-slate-500">Field:</span>{" "}
                      {scholar.field}
                    </div>
                  </div>
                </div>

                {/* University */}
                <div className="flex items-start gap-2 mb-3 text-sm bg-[rgb(255,255,255)] rounded-[10px]">
                  <GraduationCap className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">
                      {scholar.university}
                    </p>
                    <div className="flex items-center text-slate-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      {scholar.country}
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="border-l-4 border-blue-600 pl-4 py-2 mb-4">
                  <p className="text-sm text-slate-700 italic">
                    "{scholar.testimonial}"
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="sm"
                    asChild
                  >
                    <a
                      href={scholar.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="sm"
                    asChild
                  >
                    <a
                      href={scholar.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
