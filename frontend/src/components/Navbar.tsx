import { useState } from "react";
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";

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

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  isRegistered: boolean;
  userType: "student" | "institution" | "admin" | null;
  onLogout?: () => void;
}

interface NavItem {
  label: string;
  page: Page;
  showWhen?: "always" | "registered" | "loggedIn";
}

const mainNavItems: NavItem[] = [
  { label: "Home", page: "home", showWhen: "always" },
  { label: "Scholarships", page: "scholarships", showWhen: "always" },
  { label: "My Matches", page: "matches", showWhen: "always" },
  { label: "Success Stories", page: "success-stories", showWhen: "always" },
  { label: "News", page: "news", showWhen: "always" },
  { label: "Blog", page: "blog", showWhen: "always" },
  { label: "Contact", page: "contact", showWhen: "always" },
];

export function Navbar({
  currentPage,
  onNavigate,
  isLoggedIn,
  isRegistered,
  userType,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setLoginDropdownOpen(false);
  };

  const shouldShowItem = (item: NavItem): boolean => {
    if (item.showWhen === "registered") return isRegistered;
    if (item.showWhen === "loggedIn") return isLoggedIn;
    return true;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick("home")}
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                Scholar-Finder
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Find Your Perfect Scholarship
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavItems.filter(shouldShowItem).map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`
                  relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200
                  ${
                    currentPage === item.page
                      ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25"
                      : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                  }
                `}
              >
                {item.label}
                {currentPage === item.page && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            ))}

            {/* Profile link for registered users */}
            {isRegistered && (
              <button
                onClick={() => handleNavClick("profile")}
                className={`
                  relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200
                  ${
                    currentPage === "profile"
                      ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25"
                      : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                  }
                `}
              >
                My Profile
              </button>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                {/* Login Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                    onBlur={() =>
                      setTimeout(() => setLoginDropdownOpen(false), 150)
                    }
                    className={`flex items-center gap-1.5 px-8 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${
                      loginDropdownOpen
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                    }`}
                  >
                    Login
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        loginDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {loginDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl shadow-slate-300/50 border border-slate-200 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="px-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Login As
                      </p>
                      <button
                        onClick={() => handleNavClick("student-login")}
                        className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-3 group"
                      >
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          🎓
                        </span>
                        Student Login
                      </button>
                      <button
                        onClick={() => handleNavClick("institution-login")}
                        className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3 group"
                      >
                        <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          🏛️
                        </span>
                        Institution Login
                      </button>
                      <div className="border-t border-slate-200 my-2 mx-3" />
                      <button
                        onClick={() => handleNavClick("admin-login")}
                        className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center gap-3 group"
                      >
                        <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-slate-600 group-hover:text-white transition-colors">
                          ⚙️
                        </span>
                        Admin Login
                      </button>
                    </div>
                  )}
                </div>

                {/* Register Button */}
                <Button
                  onClick={() => handleNavClick("student-register")}
                  className={`
                    px-8 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shadow-md
                    ${
                      currentPage === "student-register"
                        ? "bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    }
                    text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5
                  `}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                {/* User Menu when logged in */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 capitalize">
                    {userType}
                  </span>
                </div>
                {onLogout && (
                  <Button
                    onClick={onLogout}
                    variant="ghost"
                    className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1">
              {mainNavItems.filter(shouldShowItem).map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200
                    ${
                      currentPage === item.page
                        ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md"
                        : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}

              {isRegistered && (
                <button
                  onClick={() => handleNavClick("profile")}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200
                    ${
                      currentPage === "profile"
                        ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md"
                        : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                    }
                  `}
                >
                  My Profile
                </button>
              )}

              {/* Mobile Auth Section */}
              <div className="border-t border-slate-100 mt-3 pt-3">
                {!isLoggedIn ? (
                  <>
                    <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Login As
                    </p>
                    <button
                      onClick={() => handleNavClick("student-login")}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    >
                      Student
                    </button>
                    <button
                      onClick={() => handleNavClick("institution-login")}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    >
                      Institution
                    </button>
                    <button
                      onClick={() => handleNavClick("admin-login")}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200"
                    >
                      Admin
                    </button>
                    <div className="px-4 pt-3">
                      <Button
                        onClick={() => handleNavClick("student-register")}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md"
                      >
                        Get Started
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 capitalize">
                          {userType} Account
                        </p>
                        <p className="text-xs text-slate-500">Logged in</p>
                      </div>
                    </div>
                    {onLogout && (
                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
