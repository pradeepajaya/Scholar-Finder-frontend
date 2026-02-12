import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowLeft, Users, FileText, BarChart3 } from 'lucide-react';

interface InstitutionLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function InstitutionLogin({ onLogin, onBack }: InstitutionLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Institution login attempt:', credentials);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 flex items-center justify-center p-6">
      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

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
          {/* Left Side - Institution Portal Info */}
          <Card className="p-8 lg:p-12 bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Building2 className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Institution Portal</h1>
                  <p className="text-purple-100">Scholar-Finder</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Empower Students Worldwide</h2>
              <p className="text-purple-100 text-lg mb-8">
                Access your institution dashboard to manage scholarship programs, review applications, and connect with talented students from Sri Lanka.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                <div className="bg-white/20 p-3 rounded-lg mt-1">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Manage Scholarships</h3>
                  <p className="text-sm text-purple-100">
                    Create, edit, and manage your scholarship programs with ease
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                <div className="bg-white/20 p-3 rounded-lg mt-1">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Review Applications</h3>
                  <p className="text-sm text-purple-100">
                    Access qualified student applications and streamline your selection process
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                <div className="bg-white/20 p-3 rounded-lg mt-1">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Analytics & Insights</h3>
                  <p className="text-sm text-purple-100">
                    Track application metrics and optimize your scholarship programs
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Side - Login Form */}
          <Card className="p-8 lg:p-12 bg-white shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Building2 className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Institution Login</h3>
                  <p className="text-slate-600">Access your institution dashboard</p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Test Credentials Card */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">TEST</div>
                  <p className="text-sm font-semibold text-purple-900">Demo Credentials</p>
                </div>
                <div className="space-y-1 text-sm text-purple-800">
                  <p><span className="font-medium">Email:</span> institution@scholarfinder.lk</p>
                  <p><span className="font-medium">Password:</span> institution123</p>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-700">Institution Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="institution@university.edu"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-semibold"
              >
                Sign In to Institution Portal
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                New institution?{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Register Your Institution
                </a>
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">Or login as</span>
              </div>
            </div>

            {/* Other Login Options */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Student
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Admin
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}