import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthUser } from '../../types';
import { 
  Box, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Laptop, 
  KeyRound, 
  QrCode, 
  Users,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickLogin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your work email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Simple Nav */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-600/20">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white">ACIPL/IPNET</span>
            <span className="text-xs text-sky-400 font-mono ml-2 px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-800/60">
              IMS v2.4
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="inline-flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
            System Online
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Branding, Capabilities & Value */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Enterprise IT Asset & Logistics Infrastructure</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Secure sign in to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300">Inventory Console</span>
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                Manage physical hardware, license compliance, barcode scans, event deployments, and multi-facility hardware dispatching with end-to-end accountability.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
                <Laptop className="w-5 h-5 text-sky-400 mb-2" />
                <h2 className="text-xs font-semibold text-slate-200">Hardware Fleet</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Laptops, servers, displays, and checkout workflows.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
                <QrCode className="w-5 h-5 text-emerald-400 mb-2" />
                <h2 className="text-xs font-semibold text-slate-200">Barcode & QR Hub</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Live optical scanning, label sheets, and audit trails.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
                <KeyRound className="w-5 h-5 text-purple-400 mb-2" />
                <h2 className="text-xs font-semibold text-slate-200">Seat Allocations</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Software seats, accessories stock, and consumables.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
                <Users className="w-5 h-5 text-amber-400 mb-2" />
                <h2 className="text-xs font-semibold text-slate-200">Event Dispatch</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Batch issue equipment to attendees and requesters.</p>
              </div>
            </div>

            {/* Security Guarantee badge */}
            <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
                Role-based access control
              </span>
              <span>•</span>
              <span>Session encrypted</span>
              <span>•</span>
              <span>Tamper-proof audit logs</span>
            </div>
          </div>

          {/* Right Column: Login Card & Quick Login Profiles */}
          <div className="lg:col-span-6 w-full">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white tracking-tight">Account Login</h2>
                <p className="text-xs text-slate-400">Enter your credentials below</p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div 
                  id="login-error-alert" 
                  className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2.5 animate-in fade-in duration-150"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="login-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@acipl.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-xs font-medium text-slate-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center space-x-2 text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
                    />
                    <span>Remember this device</span>
                  </label>
                  <span className="text-slate-400">Enterprise SSO Ready</span>
                </div>

                {/* Submit Button */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>



            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-800/60 bg-slate-900/30 text-center text-xs text-slate-400">
        ACIPL/IPNET Inventory Management System • Authorized Enterprise Personnel Only • &copy; {new Date().getFullYear()} ACIPL / IPNET Inc.
      </footer>
    </div>
  );
};
