import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { signUp, logIn } from '../../services/authService';
import { 
  Lock, 
  Key, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  Compass,
  Check
} from 'lucide-react';

interface TravelerAuthGateProps {
  onAuthSuccess: (user: UserProfile) => void;
}

export const TravelerAuthGate: React.FC<TravelerAuthGateProps> = ({ onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Sign Up Form States (All 5 terms required)
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  // Sign In Form States
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Status & Feedback
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please provide your username / full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Phone number is required for booking confirmations');
      return;
    }
    if (!location.trim()) {
      setError('Location / City is required');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp({
        username: username.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim(),
        location: location.trim()
      });

      if (result.success && result.user) {
        setSuccessMsg(`Account created! Welcome, ${result.user.username}.`);
        setTimeout(() => {
          onAuthSuccess(result.user!);
        }, 800);
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await logIn({
        email: loginEmail.trim(),
        password: loginPassword
      });

      if (result.success && result.user) {
        setSuccessMsg(`Welcome back, ${result.user.username}!`);
        setTimeout(() => {
          onAuthSuccess(result.user!);
        }, 800);
      } else {
        setError(result.error || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoUser: { email: string; pass: string }) => {
    setLoginEmail(demoUser.email);
    setLoginPassword(demoUser.pass);
    setError(null);
    setLoading(true);

    try {
      const result = await logIn({ email: demoUser.email, password: demoUser.pass });
      if (result.success && result.user) {
        setSuccessMsg(`Logged in as ${result.user.username}`);
        setTimeout(() => {
          onAuthSuccess(result.user!);
        }, 600);
      } else {
        setError(result.error || 'Demo login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Demo login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200 pb-16">
      
      {/* Top Banner: Locked Status */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Traveler View &bull; Authentication Required
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Firebase Cloud Firestore Secured
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Traveler Authentication Gateway
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Sign in or create your traveler profile to unlock Google Gemini travel recommendations, live footfall proximity radar, and direct hotel booking with split payments.
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <Compass className="w-7 h-7 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Main Auth Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Mode Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-indigo-950 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Key className="w-4 h-4 text-indigo-600" />
            <span>Traveler Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMode === 'signup'
                ? 'bg-white text-indigo-950 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Create Account (5 Terms)</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          
          {/* Alerts */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {authMode === 'login' ? (
            /* Sign In Form */
            <div className="space-y-6 max-w-md mx-auto py-2">
              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-base text-slate-900">Sign in to your Traveler Account</h3>
                <p className="text-xs text-slate-500">
                  Enter your email and password to access your bookings and travel dashboard.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. varshith@example.com"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Password *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs p-3 pr-10 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      <span>Sign In & Unlock Traveler View</span>
                    </>
                  )}
                </button>
              </form>

              {/* Instant Access Demo Travelers */}
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                  Or Instant Demo Access:
                </span>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin({ email: 'varshith@example.com', pass: 'demo12345' })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-left transition-all flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        V
                      </div>
                      <div>
                        <strong className="text-slate-900 group-hover:text-indigo-950 block">
                          Varshith Sharma
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          Surat, Gujarat &bull; varshith@example.com
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600">
                      Sign In &rarr;
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin({ email: 'varshith.demo@travelai.com', pass: 'demo12345' })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-left transition-all flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        V
                      </div>
                      <div>
                        <strong className="text-slate-900 group-hover:text-emerald-950 block">
                          Varshith (Cloud Firestore User)
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          Hyderabad, Telangana &bull; varshith.demo@travelai.com
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600">
                      Sign In &rarr;
                    </span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Sign Up Form (Takes 5 Required Terms) */
            <form onSubmit={handleSignUpSubmit} className="space-y-5">
              
              {/* Privacy Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-indigo-950 block">5-Term Traveler Registration</strong>
                  <span className="text-indigo-800 text-[11px] leading-relaxed block mt-0.5">
                    When you book a stay or package, only your name, email, phone number, and location are dispatched to the hotel and guide for check-in coordination. Passwords are encrypted in Firestore and strictly never shared.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Term 1: Username / Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Username / Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Varshith Sharma"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                {/* Term 2: Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. varshith@example.com"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                {/* Term 3: Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Password (min 6 characters) *</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs p-3 pr-10 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Term 4: Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number (For Check-in & Guide Meetup) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +91 98490 12345"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 font-mono"
                  />
                </div>

                {/* Term 5: Location / City */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Current City / Location *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Surat, Gujarat or Hyderabad, Telangana"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                  />
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Saves directly to Firebase Cloud Firestore</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Sign Up & Unlock Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
