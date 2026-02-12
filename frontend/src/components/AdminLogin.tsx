import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Database, Settings } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin login attempt:', credentials);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />

      <div className="w-full max-w-6xl relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-white/10 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Admin Portal Info */}
          <Card className="p-8 lg:p-12 bg-gradient-to-br from-red-600 to-orange-600 text-white flex flex-col justify-center border-none">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Shield className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Admin Portal</h1>
                  <p className="text-red-100">Scholar-Finder</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Secure Administrative Access</h2>
              <p className="text-red-100 text-lg mb-8">
                This portal is restricted to authorized administrators only. All access attempts are logged and monitored for security purposes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20">
                <div className="bg-white/20 p-3 rounded-lg mt-1">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Platform Management</h3>
                  <p className="text-sm text-red-100">
                    Full control over users, institutions, scholarships, and content
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20">
                <div className="bg-white/20 p-3 rounded-lg mt-1">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Data Analytics</h3>
                  <p className="text-sm text-red-100">
                    Access comprehensive reports and platform-wide statistics
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20">
                <div className="bg-white/20 p-3 rounded-lg mt-1">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">System Configuration</h3>
                  <p className="text-sm text-red-100">
                    Manage platform settings, security, and system preferences
                  </p>
                </div>
              </div>
            </div>

            {/* Security Warning */}
            <div className="mt-8 p-4 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-300 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-100 mb-1">Security Notice</h4>
                  <p className="text-sm text-yellow-200">
                    This is a restricted area. Unauthorized access attempts will be reported and may result in legal action.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Side - Login Form */}
          <Card className="p-8 lg:p-12 bg-white shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-xl">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Administrator Login</h3>
                  <p className="text-slate-600">Authorized personnel only</p>
                </div>
              </div>
            </div>

            {/* Security Alert */}
            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">
                    <strong>Warning:</strong> All login attempts are monitored and logged.
                  </p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Test Credentials Card */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">TEST</div>
                  <p className="text-sm font-semibold text-red-900">Demo Credentials</p>
                </div>
                <div className="space-y-1 text-sm text-red-800">
                  <p><span className="font-medium">Email:</span> admin@scholarfinder.lk</p>
                  <p><span className="font-medium">Password:</span> admin123</p>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-700">Administrator Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@scholar-finder.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="pl-10 h-12 border-slate-300"
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
                    placeholder="Enter your secure password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="pl-10 pr-10 h-12 border-slate-300"
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
                  <input type="checkbox" className="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                  <span className="text-sm text-slate-600">Remember this device</span>
                </label>
                <a href="#" className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Contact IT Support
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base font-semibold shadow-lg"
              >
                <Shield className="w-5 h-5 mr-2" />
                Sign In to Admin Portal
              </Button>
            </form>

            {/* Additional Security Info */}
            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2 text-sm">Security Features Active:</h4>
              <ul className="space-y-1 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Two-factor authentication enabled
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Login activity monitoring
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Encrypted data transmission
                </li>
              </ul>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">Other portals</span>
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
                Student Portal
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Institution Portal
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}