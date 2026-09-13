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
  CheckCircle2,
  Building,
  Clock,
  Compass
} from 'lucide-react';

interface GuideAuthGateProps {
  existingGuides: Guide[];
  onAuthSuccess: (guide: Guide) => void;
}

export const GuideAuthGate: React.FC<GuideAuthGateProps> = ({
  existingGuides,
  onAuthSuccess
}) => {
  // Phase 1: 'auth' | Phase 2: 'program_invitation'
  const [phase, setPhase] = useState<'auth' | 'program_invitation'>('auth');
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

  // Pending Guide for Phase 2
  const [pendingGuide, setPendingGuide] = useState<Guide | null>(null);

  // Phase 2: Program Terms State
  const [enableHotelBundling, setEnableHotelBundling] = useState<boolean>(true);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);

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

    setPendingGuide(newGuide);
    // Advance to Phase 2: Program Invitation
    setPhase('program_invitation');
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

  const handleCompleteProgramInvitation = (joinedProgram: boolean) => {
    if (!pendingGuide) return;
    const finalGuide: Guide = {
      ...pendingGuide,
      badgeVerified: true
    };
    onAuthSuccess(finalGuide);
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
              {phase === 'auth' ? 'Certified Local Guide Portal' : 'Certified Guide Guild & Hotel Bundling Program'}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              {phase === 'auth'
                ? 'Sign in with your verified credentials or register your official Tourism Department License ID to receive direct and hotel-bundled tour requests.'
                : `Review partnership terms, hotel concierge bundling, and 90% payout routing for ${pendingGuide?.name}.`}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PHASE 1: GUIDE AUTHENTICATION & TOURISM DEPT ID REGISTRATION */}
      {/* ========================================================================= */}
      {phase === 'auth' && (
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
                    <span>Next: Review Guide Guild & Hotel Bundling Terms</span>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Verify Credentials & Review Terms</span>
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
      )}

      {/* ========================================================================= */}
      {/* PHASE 2: CERTIFIED GUIDE GUILD & HOTEL BUNDLING INVITATION */}
      {/* ========================================================================= */}
      {phase === 'program_invitation' && pendingGuide && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-2 pb-4 border-b border-slate-100">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Step 2: Guild & Hotel Bundling Partnership</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Would you like {pendingGuide.name} to join the TravelAI Certified Guide Guild?
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Partner with boutique & heritage hotels in {pendingGuide.location} to receive automated tour bookings bundled directly with hotel room checkouts.
            </p>
          </div>

          {/* Program Features & Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. 90% Net Revenue Retention */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  <h4 className="font-extrabold text-xs text-emerald-950 uppercase tracking-wide">
                    1. 90% Net Take-Home
                  </h4>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                  0% Listing Fee
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Traditional tour agencies take <strong className="text-red-600">25%–35% of your fees</strong>.
                TravelAI charges only a 5% escrow fee and shares 5% with the hotel that brought you the guest. You take home <strong className="text-emerald-800 font-bold">90% net revenue</strong>!
              </p>
            </div>

            {/* 2. Hotel Concierge Bundling */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-700" />
                  <h4 className="font-extrabold text-xs text-amber-950 uppercase tracking-wide">
                    2. Hotel Concierge Bundling
                  </h4>
                </div>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                  Automated Demand
                </span>
              </div>
              <p className="text-xs text-slate-600">
                When travelers book a room in {pendingGuide.location}, your guided walking tour is offered directly at checkout. Guests meet you at the hotel concierge desk at 09:30 AM.
              </p>
            </div>

            {/* 3. Official Tourism Dept Verification Badge */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <h4 className="font-extrabold text-xs text-indigo-950 uppercase tracking-wide">
                    3. Tourism Dept Verification
                  </h4>
                </div>
                <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded">
                  Badge: {pendingGuide.verificationId}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Your license badge is prominently featured on the proximity radar and tourist spot maps, guaranteeing tourists authentic, authorized storytelling.
              </p>
            </div>

            {/* 4. Direct Traveler Contact & 24h Payouts */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-700" />
                  <h4 className="font-extrabold text-xs text-sky-950 uppercase tracking-wide">
                    4. Direct Meetup Contact
                  </h4>
                </div>
                <span className="text-[10px] bg-sky-200 text-sky-900 font-bold px-2 py-0.5 rounded">
                  Razorpay Escrow
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Get traveler phone number and email instantly upon booking. Payouts are routed directly to your bank account within 24 hours of tour completion.
              </p>
            </div>

          </div>

          {/* Agreement Checkbox */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 mt-0.5 shrink-0"
              />
              <span>
                Yes, I agree to join the <strong>TravelAI Certified Guide Guild</strong> for <strong>{pendingGuide.name}</strong> (Tourism Dept ID: <strong>{pendingGuide.verificationId}</strong>) with automated hotel partner bundling and 90% net take-home payouts.
              </span>
            </label>
          </div>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleCompleteProgramInvitation(false)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Skip & Continue as Independent Guide
            </button>

            <button
              type="button"
              disabled={!agreedToTerms}
              onClick={() => handleCompleteProgramInvitation(true)}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                agreedToTerms
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                  : 'bg-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept Terms & Activate Certified Guide Profile (Recommended)</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
