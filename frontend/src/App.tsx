import { useState } from "react";
import { Button } from "./components/ui/button";
import { GraduationCap } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { StudentRegistration } from "./components/StudentRegistration";
import { InstitutionRegistration } from "./components/InstitutionRegistration";
import { ScholarshipMatching } from "./components/ScholarshipMatching";
import { ScholarshipsPage } from "./components/ScholarshipsPage";
import { NewsPage } from "./components/NewsPage";
import { BlogPage } from "./components/BlogPage";
import { PreviousScholars } from "./components/PreviousScholars";
import { ContactPage } from "./components/ContactPage";
import { UserProfile } from "./components/UserProfile";
import { AdminPortal } from "./components/AdminPortal";
import StudentLogin from "./components/StudentLogin";
import { InstitutionLogin } from "./components/InstitutionLogin";
import { AdminLogin } from "./components/AdminLogin";
import { InstitutionDashboard } from "./components/InstitutionDashboard";

type Page =
  | "home"
  | "student-register"
  | "institution-register"
  | "matches"
  | "scholarships"
  | "news"
  | "blog"
  | "success-stories"
  | "contact"
  | "profile"
  | "admin"
  | "student-login"
  | "institution-login"
  | "admin-login"
  | "institution-dashboard";
type UserType = "student" | "institution" | "admin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setIsRegistered(false);
    setCurrentPage("home");
  };

  const handleStudentRegistration = (data: any) => {
    console.log("Student registration data:", data);
    setIsRegistered(true);
    setCurrentPage("matches");
  };

  const handleLogin = (type: UserType) => {
    setIsLoggedIn(true);
    setUserType(type);
    if (type === "admin") {
      setCurrentPage("admin");
    } else if (type === "student") {
      setIsRegistered(true);
      setCurrentPage("profile");
    } else if (type === "institution") {
      setCurrentPage("institution-dashboard");
    }
  };

  const handleStudentLogin = () => {
    handleLogin("student");
  };

  const handleInstitutionLogin = () => {
    handleLogin("institution");
  };

  const handleAdminLogin = () => {
    handleLogin("admin");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "student-login":
        return (
          <StudentLogin
            onLogin={handleStudentLogin}
            onBack={() => setCurrentPage("home")}
          />
        );
      case "institution-login":
        return (
          <InstitutionLogin
            onLogin={handleInstitutionLogin}
            onBack={() => setCurrentPage("home")}
          />
        );
      case "admin-login":
        return (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBack={() => setCurrentPage("home")}
          />
        );
      case "student-register":
        return <StudentRegistration onComplete={handleStudentRegistration} />;
      case "institution-register":
        return <InstitutionRegistration />;
      case "matches":
        return (
          <ScholarshipMatching
            isRegistered={isRegistered}
            onNavigate={setCurrentPage}
          />
        );
      case "scholarships":
        return <ScholarshipsPage />;
      case "news":
        return <NewsPage />;
      case "blog":
        return <BlogPage />;
      case "success-stories":
        return <PreviousScholars />;
      case "contact":
        return <ContactPage />;
      case "profile":
        return <UserProfile />;
      case "admin":
        return <AdminPortal />;
      case "institution-dashboard":
        return <InstitutionDashboard />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation Bar - Only show for non-institution and non-admin users */}
      {userType !== "institution" && userType !== "admin" && (
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isLoggedIn={isLoggedIn}
          isRegistered={isRegistered}
          userType={userType}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)]">{renderPage()}</main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 bg-[rgba(154,213,255,0.58)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900">Scholar-Finder</h3>
              </div>
              <p className="text-sm text-slate-600">
                Connecting Sri Lankan students with scholarship opportunities
                worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCurrentPage("home")}
                  className="text-sm text-slate-600 hover:text-blue-600 text-left"
                >
                  Home
                </button>
                <button
                  onClick={() => setCurrentPage("matches")}
                  className="text-sm text-slate-600 hover:text-blue-600 text-left"
                >
                  Find Scholarships
                </button>
                <button
                  onClick={() => setCurrentPage("success-stories")}
                  className="text-sm text-slate-600 hover:text-blue-600 text-left"
                >
                  Success Stories
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setCurrentPage("news")}
                  className="text-sm text-slate-600 hover:text-blue-600 text-left"
                >
                  News & Updates
                </button>
                <button
                  onClick={() => setCurrentPage("blog")}
                  className="text-sm text-slate-600 hover:text-blue-600 text-left"
                >
                  Blog
                </button>
                <button
                  onClick={() => setCurrentPage("contact")}
                  className="text-sm text-slate-600 hover:text-blue-600 text-left"
                >
                  Contact Us
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">
                For Institutions
              </h4>
              <div className="flex flex-col gap-2">
                {userType === "institution" && (
                  <button
                    onClick={() => setCurrentPage("institution-register")}
                    className="text-sm text-slate-600 hover:text-blue-600 text-left"
                  >
                    Post Scholarship
                  </button>
                )}
                <button
                  onClick={() => setCurrentPage("institution-login")}
                  className="text-sm text-slate-600 hover:text-blue-600 text-left"
                >
                  Institution Login
                </button>
                <button
                  onClick={() => setCurrentPage("admin-login")}
                  className="text-sm text-slate-600 hover:text-blue-600 text-left"
                >
                  Admin Portal
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-8 pt-8 text-center">
            <p className="text-sm text-slate-600">
              © 2026 Scholar-Finder. All rights reserved. Empowering Sri Lankan
              students to achieve their educational dreams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Your Dream Scholarship
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Awaits You
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Scholar-Finder matches Sri Lankan students with the perfect
              scholarship opportunities based on your qualifications,
              preferences, and goals. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onNavigate("student-register")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              >
                Register as Student
              </Button>
              <Button
                onClick={() => onNavigate("institution-register")}
                variant="outline"
                className="px-8 py-6 text-lg border-slate-300"
              >
                Register as Institution
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { value: "500+", label: "Active Scholarships" },
              { value: "10,000+", label: "Registered Students" },
              { value: "95%", label: "Match Accuracy" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 text-center"
              >
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            How It Works
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Three simple steps to find your perfect scholarship match
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Create Your Profile",
              description:
                "Complete our comprehensive registration form with your academic qualifications, preferences, and goals.",
            },
            {
              step: "2",
              title: "Get Matched",
              description:
                "Our intelligent algorithm analyzes your profile and matches you with suitable scholarships.",
            },
            {
              step: "3",
              title: "Apply & Succeed",
              description:
                "Review your matches, see what requirements you meet, and apply directly to scholarships.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-[rgba(7,111,248,0.57)] p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4">
                {feature.step}
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h4>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Scholarship?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Sri Lankan students who have found their perfect
            scholarship match
          </p>
          <Button
            onClick={() => onNavigate("student-register")}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
          >
            Get Started - It's Free
          </Button>
        </div>
      </section>
    </div>
  );
}
