import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  BookOpen,
  Target,
  Bell,
} from "lucide-react";
import { authApi, STUDENT_ID_KEY } from "@/services/api";

interface StudentLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const StudentLogin = ({ onLogin, onBack }: StudentLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.login({
        email,
        password,
        rememberMe,
      });
      if (response.success && response.data) {
        if (response.data.user.role !== "STUDENT") {
          throw new Error(
            "Access denied. Please make sure you are registered as a student.",
          );
        }

        localStorage.setItem(STUDENT_ID_KEY, String(response.data.user.id));
        onLogin();
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (err.response?.status === 403) {
        setError(
          "Access denied. Please make sure you are registered as a student.",
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("alice@scholarfinder.lk");
    setPassword("alice123");
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.login({
        email: "alice@scholarfinder.lk",
        password: "alice123",
        rememberMe: false,
      });
      if (response.success && response.data) {
        if (response.data.user.role !== "STUDENT") {
          throw new Error(
            "Access denied. Please make sure you are registered as a student.",
          );
        }

        localStorage.setItem(STUDENT_ID_KEY, String(response.data.user.id));
        onLogin();
      } else {
        throw new Error(response.message || "Demo login failed");
      }
    } catch (err: any) {
      console.error("Demo login error:", err);
      setError(err?.message || "Demo login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-6">
      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />

      <div className="w-full max-w-6xl relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-white/80 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Student Portal Info */}
          <Card className="p-8 lg:p-12 bg-blue-600 text-white flex flex-col justify-center border-none shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <GraduationCap className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Student Portal</h1>
                  <p className="text-blue-100">Scholar-Finder</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Welcome Back, Scholar!
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Continue your journey to educational success. Access your
                personalized scholarship dashboard and discover opportunities
                matched just for you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                <div className="bg-white/20 p-3 rounded-lg mt-1">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Personalized Matches
                  </h3>
                  <p className="text-sm text-blue-100">
                    Get scholarship recommendations tailored to your academic
                    profile and goals
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                <div className="bg-white/20 p-3 rounded-lg mt-1">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Track Applications
                  </h3>
                  <p className="text-sm text-blue-100">
                    Monitor application statuses and manage deadlines all in one
                    place
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                <div className="bg-white/20 p-3 rounded-lg mt-1">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Deadline Reminders
                  </h3>
                  <p className="text-sm text-blue-100">
                    Never miss an opportunity with timely alerts for upcoming
                    scholarship deadlines
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Side - Login Form */}
          <Card className="p-8 lg:p-12 bg-white shadow-2xl border-none">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Student Login
                  </h3>
                  <p className="text-slate-600">
                    Sign in to your student account
                  </p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Demo Credentials Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    DEMO
                  </div>
                  <p className="text-sm font-semibold text-blue-900">
                    Quick Access
                  </p>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Try the platform instantly with a demo account.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  Try Demo Account
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="email" className="text-slate-700">
                  Email Address
                </Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onBack}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Register as Student
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">
                  Or login as
                </span>
              </div>
            </div>

            {/* Other Login Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
                onClick={onBack}
              >
                Institution
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
                onClick={onBack}
              >
                Admin
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
