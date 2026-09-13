import React, { useState } from 'react';
import { Guide } from '../../types';
import { 
  Users, 
  Lock, 
  ShieldCheck, 
  Key, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  ArrowRight, 
  AlertCircle, 
  DollarSign, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface GuideAuthGateProps {
  existingGuides: Guide[];
  onAuthSuccess: (guide: Guide) => void;
}

export const GuideAuthGate: React.FC<GuideAuthGateProps> = ({
  existingGuides,
  onAuthSuccess
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  // Guide Registration Form State (Requires Tourism Dept ID + Traveler-like terms)
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('Hyderabad');
  const [tourismDeptId, setTourismDeptId] = useState<string>('');
  const [languages, setLanguages] = useState<string>('English, Hindi, Telugu');
  const [specialty, setSpecialty] = useState<string>('Heritage Architecture & Historical Storytelling');
  const [halfDayRate, setHalfDayRate] = useState<number>(1800);
  const [fullDayRate, setFullDayRate] = useState<number>(3200);
  const [bio, setBio] = useState<string>('');

  // Guide Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newGuide: Guide = {
      id: `guide-reg-${Date.now()}`,
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      phone: phone.trim() || '+91 98491 22910',
      location: location.trim() || 'Hyderabad',
      verificationId: tourismDeptId.trim().toUpperCase(),
      tourismDeptId: tourismDeptId.trim().toUpperCase(),
      badgeVerified: true,
      languages: languages.split(',').map(l => l.trim()).filter(Boolean),
      hourlyRate: 500,
      halfDayRate: halfDayRate,
      fullDayRate: fullDayRate,
      photoWalkRate: 2200,
      completedToursCount: 24,
      bio: bio.trim() || `Certified Tourism Department Guide in ${location}, specializing in ${specialty}.`,
      specialties: [specialty.trim(), 'Historic Storytelling', 'Local Heritage Walks'],
      affiliatedHotelId: null, // Community pool guide
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };

    onAuthSuccess(newGuide);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const input = loginIdentifier.trim().toLowerCase();
    const found = existingGuides.find(g => 
      (g.email && g.email.toLowerCase() === input) ||
      (g.verificationId && g.verificationId.toLowerCase() === input) ||
      g.name.toLowerCase() === input ||
      g.name.toLowerCase().includes(input)
    );

    if (found) {
      onAuthSuccess(found);
    } else {
      setLoginError('No certified guide found with this Email or Tourism Dept ID. Please register your license badge or select a demo guide below.');
    }
  };

  const handleDemoSelect = (guide: Guide) => {
    onAuthSuccess(guide);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner: Locked Status */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Guide Portal &bull; Authentication Required
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Tourism Dept ID Verified
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Certified Local Guide Portal
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Sign in with your verified credentials or register your official Tourism Department License ID to receive direct and hotel-bundled tour requests.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Tabs: Register with Tourism Dept ID vs Sign In */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMode === 'register'
                ? 'bg-white text-amber-950 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>Register with Tourism Dept ID</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-amber-950 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Key className="w-4 h-4 text-amber-600" />
            <span>Guide Sign In</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {authMode === 'register' ? (
            /* Guide Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              
              {/* Mandatory Tourism Department ID Callout */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-amber-950 block">Official Tourism Department Verification</strong>
                  <span className="text-amber-800 text-[11px]">
                    All guides on TravelAI must possess a valid State/National Tourism Department badge ID or license to protect travelers against unauthorized touts.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Tourism Dept ID (Required) */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Tourism Department ID / License Badge ID *</span>
                    <span className="text-[10px] text-amber-700 font-extrabold uppercase">Mandatory Verification</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tourismDeptId}
                    onChange={(e) => setTourismDeptId(e.target.value)}
                    placeholder="e.g. TS-TOUR-GOV-8819 or TG-LIC-4421"
                    className="w-full text-xs p-3 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono uppercase bg-amber-50/30"
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Guide Full Name / Username *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vikram Rao"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Business Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. vikram.guide@travelai.com"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Portal Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number (For Traveler Meetup) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98491 22910"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600 font-mono"
                  />
                </div>

                {/* Location / City */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Operational City / Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Hyderabad, Surat, Jaipur"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600"
                  />
                </div>

                {/* Languages */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Languages Spoken *</label>
                  <input
                    type="text"
                    required
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="e.g. English, Hindi, Telugu"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600"
                  />
                </div>

                {/* Tour Specialty */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tour Specialty & Experience</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Heritage Architecture, Monument Walks, Street Food Navigation"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600"
                  />
                </div>

                {/* Rates */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Half-Day Tour Rate (₹) *</label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={halfDayRate}
                    onChange={(e) => setHalfDayRate(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full-Day Tour Rate (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={fullDayRate}
                    onChange={(e) => setFullDayRate(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 font-bold text-slate-900"
                  />
                </div>

              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Your profile will be verified & paired with partner hotels.</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Register & Unlock Guide Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          ) : (
            /* Guide Sign In Form */
            <div className="space-y-6 max-w-md mx-auto py-4">
              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-base text-slate-900">Sign In as Certified Guide</h3>
                <p className="text-xs text-slate-500">
                  Enter your registered Email or Tourism Department ID to manage tour bookings.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email or Tourism Dept ID</label>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. vikram.guide@travelai.com or TS-TOUR-8819"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Sign In & Unlock Portal</span>
                </button>
              </form>

              {/* Instant Access Demo Guides */}
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                  Or Instant Access Demo Certified Guides:
                </span>

                <div className="space-y-2">
                  {existingGuides.slice(0, 3).map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleDemoSelect(g)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 text-left transition-all flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={g.avatar} 
                          alt={g.name} 
                          className="w-8 h-8 rounded-lg object-cover" 
                        />
                        <div>
                          <strong className="text-slate-900 group-hover:text-amber-950 block truncate">
                            {g.name}
                          </strong>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            {g.verificationId}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-700">
                        Sign In &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
