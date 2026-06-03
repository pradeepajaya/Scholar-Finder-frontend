import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Award,
  CheckCircle,
  GraduationCap,
  Loader,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import apiClient from "../services/api";
import { matchesSearch } from "@/utils/search";

interface Testimonial {
  id: number;
  scholarName: string | null;
  scholarshipName: string;
  yearCompleted: number | null;
  fieldOfStudy: string | null;
  university: string | null;
  testimonialText: string;
  rating: number | null;
  isAnonymous: boolean;
  isFeatured: boolean;
  status: string;
  createdAt: string;
}

export function PreviousScholars() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    scholarship: "",
    year: "",
    field: "",
    university: "",
    email: "",
    isAnonymous: false,
    testimonial: "",
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const payload = await apiClient.get<Testimonial[]>("/testimonials");
        setTestimonials(payload.data ?? []);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        setTestimonials([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setIsDialogOpen(false);
      window.alert("Success story submitted for admin review.");

      setFormData({
        name: "",
        scholarship: "",
        year: "",
        field: "",
        university: "",
        email: "",
        isAnonymous: false,
        testimonial: "",
      });
    } catch {
      window.alert("Failed to submit your story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) =>
    matchesSearch(searchQuery, [
      testimonial.scholarName,
      testimonial.scholarshipName,
      testimonial.yearCompleted,
      testimonial.fieldOfStudy,
      testimonial.university,
      testimonial.testimonialText,
      testimonial.rating,
      testimonial.isAnonymous ? "Anonymous Scholar" : "",
    ]),
  );

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
              scholarships. Most choose to share anonymously to protect their
              privacy while inspiring others.
            </p>
          </div>

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
                  Inspire future scholars by sharing your journey. You can
                  choose to share anonymously to protect your privacy. Your
                  story will be reviewed by our admin team before publishing.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> All submissions are reviewed by our
                    admin team to ensure quality and authenticity. You will
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

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) =>
                        handleInputChange("isAnonymous", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-amber-300"
                    />
                    <span className="text-sm font-medium text-amber-900">
                      Share anonymously (your name will not be displayed
                      publicly, but we will use it for admin communication)
                    </span>
                  </label>
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
                      Year Completed <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="year"
                      type="number"
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
                    placeholder="Share your scholarship journey, what it meant to you, and the impact it had on your career..."
                    className="mt-1.5 min-h-[150px]"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Minimum 100 characters - be specific about your experience
                  </p>
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

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-900">
            <p className="font-medium">Are you a scholarship recipient?</p>
            <p className="text-green-800">
              Share your success story to inspire and guide future scholars on
              their journey! You can share anonymously to protect your privacy.
            </p>
          </div>
        </div>
      </div>

      {!isLoading && testimonials.length > 0 && (
        <Card className="p-4 mb-8 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search stories by scholar, scholarship, field, or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-6 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear success stories search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">
            No testimonials yet. Be the first to share your success story!
          </p>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No success stories found
          </h3>
          <p className="text-slate-600 mb-4">
            Try a different keyword or clear the search.
          </p>
          <Button
            onClick={() => setSearchQuery("")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Clear Search
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                <div className="p-6 bg-[rgba(15,140,252,0.12)]">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-blue-600 text-white text-lg font-bold">
                        {testimonial.isAnonymous
                          ? "AS"
                          : testimonial.scholarName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">
                        {testimonial.isAnonymous
                          ? "Anonymous Scholar"
                          : testimonial.scholarName || "Scholar"}
                      </h3>
                      {!!testimonial.rating && (
                        <div className="flex gap-0.5 mt-2">
                          {Array.from({ length: testimonial.rating }).map(
                            (_, i) => (
                              <span key={i} className="text-yellow-400 text-sm">
                                ★
                              </span>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[rgb(255,255,255)] rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-900">
                        {testimonial.scholarshipName}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                      {!!testimonial.yearCompleted && (
                        <div>
                          <span className="text-slate-500">Year:</span>{" "}
                          {testimonial.yearCompleted}
                        </div>
                      )}
                      {!!testimonial.fieldOfStudy && (
                        <div>
                          <span className="text-slate-500">Field:</span>{" "}
                          {testimonial.fieldOfStudy}
                        </div>
                      )}
                    </div>
                  </div>

                  {!!testimonial.university && (
                    <div className="flex items-start gap-2 mb-3 text-sm bg-[rgb(255,255,255)] rounded-[10px] p-3">
                      <GraduationCap className="w-4 h-4 text-slate-400 mt-0.5" />
                      <p className="font-medium text-slate-900">
                        {testimonial.university}
                      </p>
                    </div>
                  )}

                  <div className="border-l-4 border-blue-600 pl-4 py-2 mb-4">
                    <p className="text-sm text-slate-700">
                      "{testimonial.testimonialText}"
                    </p>
                  </div>

                  {testimonial.isAnonymous && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-900"
                    >
                      Anonymous
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
