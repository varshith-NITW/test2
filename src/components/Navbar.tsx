import React, { useState } from 'react';
import { Compass, Hotel, Users, ShieldCheck, Sparkles, MapPin, Zap, User, LogOut, ChevronDown, Phone, Mail, Cloud, Lock } from 'lucide-react';
import { UserProfile } from '../types';

export type PersonaType = 'traveler' | 'hotel' | 'guide';

interface NavbarProps {
  currentPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
  bookingCount: number;
  onScrollToComparison?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (tab?: 'login' | 'signup') => void;
  onSignOut?: () => void;
  authenticatedHotel?: import('../types').Hotel | null;
  onHotelSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPersona,
  onSelectPersona,
  bookingCount,
  onScrollToComparison,
  currentUser,
  onOpenAuth,
  onSignOut,
  authenticatedHotel,
  onHotelSignOut
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Ecosystem Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Compass className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  Travel<span className="text-emerald-600">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full">
                  <Cloud className="w-3 h-3 text-sky-600" /> Cloud Storage
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <MapPin className="w-3 h-3" /> Real Check-In Footfalls
                </span>
                <span>&bull;</span>
                <span className="text-slate-500">Zero Rating Bias</span>
              </div>
            </div>
          </div>

          {/* Quick Action Button (Why Better) */}
          <div className="hidden lg:flex items-center gap-2">
            {onScrollToComparison && (
              <button
                type="button"
                onClick={onScrollToComparison}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Why We're Better</span>
              </button>
            )}
          </div>

          {/* Right Navigation & Auth Area */}
          <div className="flex items-center gap-3">
            {/* Persona Switcher Tabs */}
            <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => onSelectPersona('traveler')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPersona === 'traveler'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Compass className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Traveler View</span>
              </button>

              <button
                onClick={() => onSelectPersona('hotel')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPersona === 'hotel'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Hotel className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Hotel Portal</span>
              </button>

              <button
                onClick={() => onSelectPersona('guide')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPersona === 'guide'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Users className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Guide Portal</span>
              </button>
            </nav>

            {/* Traveler Authentication Status Chip & Dropdown (Strictly Traveler View Only) */}
            {currentPersona === 'traveler' && (
              <div className="relative">
                {currentUser ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden sm:block leading-tight">
                        <div className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                          {currentUser.username}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[110px]">
                          📍 {currentUser.location}
                        </div>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Profile Popover Menu */}
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                            {currentUser.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-black text-slate-900 truncate">
                              {currentUser.username}
                            </h4>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                              Active Traveler
                            </span>
                          </div>
                        </div>

                        <div className="py-3 space-y-2 text-xs text-slate-600 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate text-[11px] text-slate-700 font-medium">{currentUser.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-[11px] text-slate-700 font-medium">{currentUser.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-[11px] text-slate-700 font-medium">{currentUser.location}</span>
                          </div>
                        </div>

                        <div className="pt-3 space-y-2">
                          <div className="text-[10px] text-sky-700 bg-sky-50 px-2 py-1.5 rounded-lg border border-sky-200 flex items-center gap-1.5 font-semibold">
                            <Cloud className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>Google Cloud Firestore Storage (Live Sync)</span>
                          </div>

                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Contact details dispatched on booking. Password encrypted.</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setShowProfileMenu(false);
                              onOpenAuth?.('signup');
                            }}
                            className="w-full text-left px-2.5 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition-colors cursor-pointer"
                          >
                            + Switch / Register New Traveler
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowProfileMenu(false);
                              onSignOut?.();
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors cursor-pointer"
                          >
                            <span>Sign Out</span>
                            <LogOut className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenAuth?.('login')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-600/20 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            )}

            {/* Hotel Authentication Status Chip in Navbar (When on Hotel Portal) */}
            {currentPersona === 'hotel' && (
              <div className="relative">
                {authenticatedHotel ? (
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      🏨
                    </div>
                    <div className="hidden sm:block leading-tight">
                      <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                        {authenticatedHotel.name}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold truncate max-w-[120px]">
                        {authenticatedHotel.joinedDirectProgram ? '✓ Direct Partner' : 'Standard Host'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Portal Locked</span>
                  </span>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

