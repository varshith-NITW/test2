import React, { useState } from 'react';
import { Hotel, RoomType } from '../../types';
import { 
  Building, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Percent, 
  TrendingUp, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Key, 
  DollarSign, 
  FileText,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

interface HotelAuthGateProps {
  existingHotels: Hotel[];
  onAuthSuccess: (hotel: Hotel) => void;
}

export const HotelAuthGate: React.FC<HotelAuthGateProps> = ({
  existingHotels,
  onAuthSuccess
}) => {
  // Current Phase: 'auth' | 'program_invitation'
  const [phase, setPhase] = useState<'auth' | 'program_invitation'>('auth');
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  // Registration Form State
  const [hotelName, setHotelName] = useState<string>('');
  const [city, setCity] = useState<string>('Surat');
  const [address, setAddress] = useState<string>('');
  const [managerName, setManagerName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [tier, setTier] = useState<Hotel['tier']>('Boutique Stay');
  const [basePrice, setBasePrice] = useState<number>(3500);
  const [gstId, setGstId] = useState<string>('');
  const [amenities, setAmenities] = useState<string[]>([
    'Free High-Speed Wi-Fi',
    'Air Conditioning',
    'Complimentary Breakfast',
    '24/7 Front Desk'
  ]);

  // Rooms Configuration State (Spec: "should ask name of hotel, rooms, and all relevant details")
  const [rooms, setRooms] = useState<RoomType[]>([
    {
      id: 'room-1',
      name: 'Deluxe Heritage Room',
      pricePerNight: 3500,
      capacity: 2,
      description: 'Comfortable air-conditioned room with king bed, high-speed Wi-Fi, and en-suite bath.',
      perks: ['Complimentary Breakfast', 'Free Wi-Fi']
    },
    {
      id: 'room-2',
      name: 'Royal Executive Suite',
      pricePerNight: 5500,
      capacity: 3,
      description: 'Spacious premium suite featuring panoramic city views and heritage furnishings.',
      perks: ['Breakfast & High-Tea', 'Priority Check-in']
    }
  ]);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Pending Authenticated Hotel (before accepting or skipping the Direct Program)
  const [pendingHotel, setPendingHotel] = useState<Hotel | null>(null);

  // Program Invitation Details State (Spec: "ask if they are willing to join the program and details after joining the program for example about the discounts and everything else")
  const [selectedDiscount, setSelectedDiscount] = useState<number>(15);
  const [enableGuideBundling, setEnableGuideBundling] = useState<boolean>(true);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);

  // Available amenities to toggle
  const availableAmenities = [
    'Free High-Speed Wi-Fi',
    'Swimming Pool',
    'Complimentary Breakfast',
    'Air Conditioning',
    'Valet Parking',
    '24/7 Front Desk',
    'Spa & Wellness',
    'Airport Shuttle Service'
  ];

  const toggleAmenity = (item: string) => {
    setAmenities(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleAddRoom = () => {
    const newRoom: RoomType = {
      id: `room-${Date.now()}`,
      name: 'Standard Twin Room',
      pricePerNight: basePrice,
      capacity: 2,
      description: 'Cozy room with two single beds and modern amenities.',
      perks: ['Free Wi-Fi']
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const handleUpdateRoom = (index: number, field: keyof RoomType, value: any) => {
    setRooms(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveRoom = (index: number) => {
    if (rooms.length <= 1) return;
    setRooms(prev => prev.filter((_, i) => i !== index));
  };

  // Phase 1: Complete Registration & advance to Program Invitation
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newHotel: Hotel = {
      id: `hotel-partner-${Date.now()}`,
      name: hotelName.trim(),
      city: city.trim() || 'Surat',
      address: address.trim() || 'City Center, Near Main Landmark',
      location: { lat: 21.1702, lng: 72.8311 }, // Default fallback coordinates
      tier,
      pricePerNight: rooms[0]?.pricePerNight || basePrice,
      commissionRate: 0.15,
      status: 'verified',
      allowsIndependentGuides: true,
      perks: ['Direct Check-In Guarantee', 'Verified Property Badge'],
      amenities,
      checkinCount: 840,
      weeklyCheckins: 75,
      googlePlaceId: `ChIJ_${hotelName.replace(/\s+/g, '_')}`,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelName)}`,
      footfallRank: existingHotels.length + 1,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
      businessRegNumber: gstId.trim() || 'GST24AAACT1234F1Z9',
      partnershipModel: 'community_pool',
      guideReferralKickbackPercent: 0.05,
      roomTypes: rooms,
      // Authentication credentials & manager details
      managerName: managerName.trim() || 'Hotel General Manager',
      managerEmail: email.trim().toLowerCase(),
      managerPhone: phone.trim() || '+91 98250 12345',
      password: password,
      joinedDirectProgram: false,
      programDiscountPercent: 15,
      allowsGuideBundling: true
    };

    setPendingHotel(newHotel);
    // Transition immediately to Phase 2: Program Invitation & Terms
    setPhase('program_invitation');
  };

  // Phase 1: Log in with existing hotel or demo hotel
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const found = existingHotels.find(h => 
      h.managerEmail?.toLowerCase() === loginEmail.trim().toLowerCase() ||
      h.name.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (found) {
      onAuthSuccess(found);
    } else {
      // Allow demo login by matching first word or selecting demo hotel
      const fuzzyMatch = existingHotels.find(h => 
        h.name.toLowerCase().includes(loginEmail.trim().toLowerCase())
      );
      if (fuzzyMatch) {
        onAuthSuccess(fuzzyMatch);
      } else {
        setLoginError('No registered property found with this email. Please register your hotel or select a demo property below.');
      }
    }
  };

  const handleQuickDemoSelect = (hotel: Hotel) => {
    onAuthSuccess(hotel);
  };

  // Phase 2: Accept Direct Partner Program & Complete Onboarding
  const handleJoinProgram = (join: boolean) => {
    if (!pendingHotel) return;

    const finalizedHotel: Hotel = {
      ...pendingHotel,
      joinedDirectProgram: join,
      programDiscountPercent: join ? selectedDiscount : 0,
      allowsGuideBundling: enableGuideBundling,
      commissionRate: join ? 0.05 : 0.15 // 5% fee when in program vs 15% standard
    };

    onAuthSuccess(finalizedHotel);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner: Locked Status */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Hotel Partner Portal &bull; Authentication Required
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Direct Host Platform
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {phase === 'auth' 
                ? 'Welcome to the Hotel Partner Portal' 
                : 'Direct Partner Program Invitation'}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              {phase === 'auth'
                ? 'Register your property, configure available rooms, and join our direct booking ecosystem with zero OTA intermediaries.'
                : `Review program terms, traveler discounts, and commission savings for ${pendingHotel?.name}.`}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PHASE 1: HOTEL AUTHENTICATION & PROPERTY ONBOARDING */}
      {/* ========================================================================= */}
      {phase === 'auth' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Mode Tabs: Register vs Sign In */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-indigo-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Register New Hotel Property</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-indigo-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Key className="w-4 h-4 text-indigo-600" />
              <span>Partner Sign In</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {authMode === 'register' ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                
                {/* Section 1: Property Identity & City */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <Building className="w-4 h-4 text-indigo-600" />
                    <span>1. Property Identity & Location</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-700">Name of Hotel *</label>
                      <input
                        type="text"
                        required
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        placeholder="e.g. Taj Gateway Palace, Surat"
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">City / Destination *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Surat, Hyderabad, London"
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Hotel Category / Tier *</label>
                      <select
                        value={tier}
                        onChange={(e) => setTier(e.target.value as Hotel['tier'])}
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 bg-white"
                      >
                        <option value="Heritage Luxury">Heritage Luxury (5-Star / Palace)</option>
                        <option value="Boutique Stay">Boutique Stay (Curated Comfort)</option>
                        <option value="Urban Comfort">Urban Comfort (Business & City)</option>
                        <option value="Cultural Retreat">Cultural Retreat (Experiential)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-700">Physical Street Address *</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Ring Road, Athwa Lines, Near Riverfront"
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Manager & Reception Contact (for guest credential dispatch) */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>2. Manager Credentials & Front Desk Contact</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Manager / Owner Name *</label>
                      <input
                        type="text"
                        required
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                        placeholder="e.g. Rajesh Mehta"
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Reception Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98251 23456"
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Business Email (Login) *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. manager@tajgateway.com"
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Partner Account Password *</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-700">GST / Tourism License Number *</label>
                      <input
                        type="text"
                        required
                        value={gstId}
                        onChange={(e) => setGstId(e.target.value)}
                        placeholder="e.g. GST24AABCT1234F1Z9"
                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Rooms Configuration (Spec: "rooms, and all relevant details") */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-600" />
                        <span>3. Rooms Configuration & Pricing</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Define the room types, nightly base rates, and guest capacities for your property.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddRoom}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1 border border-indigo-200 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Another Room</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {rooms.map((room, idx) => (
                      <div key={room.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800">
                            Room #{idx + 1}
                          </span>
                          {rooms.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRoom(idx)}
                              className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">Room Name *</label>
                            <input
                              type="text"
                              required
                              value={room.name}
                              onChange={(e) => handleUpdateRoom(idx, 'name', e.target.value)}
                              placeholder="e.g. Deluxe Heritage Double"
                              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">Price per Night (₹) *</label>
                            <input
                              type="number"
                              required
                              min={500}
                              value={room.pricePerNight}
                              onChange={(e) => handleUpdateRoom(idx, 'pricePerNight', Number(e.target.value))}
                              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">Max Guests *</label>
                            <select
                              value={room.capacity}
                              onChange={(e) => handleUpdateRoom(idx, 'capacity', Number(e.target.value))}
                              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                            >
                              <option value={1}>1 Guest</option>
                              <option value={2}>2 Guests</option>
                              <option value={3}>3 Guests</option>
                              <option value={4}>4 Guests (Family)</option>
                            </select>
                          </div>

                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[11px] font-bold text-slate-600">Room Description & Inclusions</label>
                            <input
                              type="text"
                              value={room.description}
                              onChange={(e) => handleUpdateRoom(idx, 'description', e.target.value)}
                              placeholder="e.g. King-sized bed, high-speed Wi-Fi, city view, and breakfast included."
                              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Amenities & Features */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    4. Hotel Amenities & Services
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {availableAmenities.map((amenity) => {
                      const isSelected = amenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-[11px]">{amenity}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Next: Review Direct Partner Program & Discount Terms</span>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Authenticate & Review Program Terms</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            ) : (
              /* Sign In Form */
              <div className="space-y-6 max-w-md mx-auto py-4">
                <div className="text-center space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900">Sign In to Your Hotel Dashboard</h3>
                  <p className="text-xs text-slate-500">
                    Enter your partner account email and password to access bookings and settlements.
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
                    <label className="text-xs font-bold text-slate-700">Business Email</label>
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. manager@tajgateway.com or Hotel Name"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
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
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Sign In & Unlock Portal</span>
                  </button>
                </form>

                {/* Quick Pre-seeded Demo Property Switcher */}
                <div className="pt-6 border-t border-slate-200 space-y-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                    Or Instant Access Demo Registered Properties:
                  </span>

                  <div className="space-y-2">
                    {existingHotels.slice(0, 3).map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => handleQuickDemoSelect(h)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-left transition-all flex items-center justify-between text-xs cursor-pointer group"
                      >
                        <div>
                          <strong className="text-slate-900 group-hover:text-indigo-900 block truncate">
                            {h.name}
                          </strong>
                          <span className="text-[10px] text-slate-500">
                            {h.city} &bull; ₹{h.pricePerNight.toLocaleString()}/night &bull; {h.tier}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-indigo-600">
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
      {/* PHASE 2: DIRECT PARTNER PROGRAM INVITATION & DETAILS */}
      {/* ========================================================================= */}
      {phase === 'program_invitation' && pendingHotel && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-2 pb-4 border-b border-slate-100">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Step 2: Partner Program Invitation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Would you like {pendingHotel.name} to join the TravelAI Direct Partner Program?
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Join thousands of independent and boutique hotels who bypass 22% OTA commissions by giving travelers genuine direct discounts and receiving direct guest reservations.
            </p>
          </div>

          {/* Program Features & Details Cards (Discounts, Commission, Guide Bundling, Settlements) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Direct Traveler Discount Selection */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-indigo-700" />
                  <h4 className="font-extrabold text-xs text-indigo-950 uppercase tracking-wide">
                    1. Direct Website Discount
                  </h4>
                </div>
                <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded">
                  Search Rank Booster
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Offer an exclusive direct discount to travelers. By offering 10%–20% off, your hotel appears at the top of proximity radars and converts more bookings.
              </p>
              
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[10, 15, 20].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setSelectedDiscount(rate)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                      selectedDiscount === rate
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div>{rate}% Off</div>
                    <div className="text-[9px] opacity-80 font-normal">
                      {rate === 15 ? 'Recommended' : rate === 20 ? 'Top Surge' : 'Standard'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Commission Comparison (5% vs 20% OTA) */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  <h4 className="font-extrabold text-xs text-emerald-950 uppercase tracking-wide">
                    2. Commission Advantage
                  </h4>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                  95% Net Retention
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Traditional OTAs (MakeMyTrip, Booking.com) charge <strong className="text-red-600">18%–25% commission</strong>.
                TravelAI charges only a flat <strong className="text-emerald-700">5% escrow fee</strong>. You keep 95% of gross revenue!
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">On a ₹5,000 Room Booking:</span>
                <span className="font-bold text-emerald-800">You Save ₹750+ per room night</span>
              </div>
            </div>

            {/* 3. Local Guide Bundling & Referral Kickback */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-700" />
                  <h4 className="font-extrabold text-xs text-amber-950 uppercase tracking-wide">
                    3. Local Guide Bundling
                  </h4>
                </div>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                  +₹150 to ₹300 Kickback
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Pair your rooms with certified local community guides. When a traveler books a guided tour with your room, your hotel earns a <strong>5% referral kickback</strong>!
              </p>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={enableGuideBundling}
                  onChange={(e) => setEnableGuideBundling(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
                <span>Enable Community Guide Matching for {pendingHotel.name}</span>
              </label>
            </div>

            {/* 4. Real-time Escrow Settlements & Direct Contact */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-700" />
                  <h4 className="font-extrabold text-xs text-sky-950 uppercase tracking-wide">
                    4. Direct Guest Sharing & 24h Payouts
                  </h4>
                </div>
                <span className="text-[10px] bg-sky-200 text-sky-900 font-bold px-2 py-0.5 rounded">
                  Razorpay Escrow
                </span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li><strong>Direct Guest Phone & Email:</strong> Dispatched instantly to front desk upon payment.</li>
                <li><strong>24-Hour Settlement:</strong> Payouts transferred directly to your bank account via Razorpay.</li>
                <li><strong>Zero Rating Extortion:</strong> Ranked strictly on physical Google check-in footfalls.</li>
              </ul>
            </div>

          </div>

          {/* Agreement Checkbox */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 mt-0.5 shrink-0"
              />
              <span>
                Yes, I agree to join the <strong>TravelAI Direct Partner Program</strong> for <strong>{pendingHotel.name}</strong> with an exclusive <strong>{selectedDiscount}% Direct Traveler Discount</strong> and automated 5% platform escrow settlements.
              </span>
            </label>
          </div>

          {/* Dual Action Buttons: Join Program vs Skip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleJoinProgram(false)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Skip & Continue as Standard Listing
            </button>

            <button
              type="button"
              disabled={!agreedToTerms}
              onClick={() => handleJoinProgram(true)}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                agreedToTerms
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept Terms & Activate Direct Program (Recommended)</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
