import React, { useState } from 'react';
import { 
  TouristSpot, 
  Hotel, 
  RoomType, 
  RestaurantPassSelection, 
  Guide, 
  GuidePackageType,
  SplitBreakdown 
} from '../../types';
import { calculateSplitBreakdown } from '../../services/paymentSplitService';
import { 
  Building2, 
  Utensils, 
  Compass, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  CreditCard, 
  Sparkles, 
  TrendingDown, 
  Check, 
  Calendar,
  Users,
  Info,
  BadgePercent,
  Zap,
  Tag,
  Gift,
  CheckCircle2
} from 'lucide-react';

interface TripPackageSummaryProps {
  spot: TouristSpot;
  searchedPlace?: string;
  hotel: Hotel;
  room: RoomType;
  nights: number;
  restaurantPass: RestaurantPassSelection | null;
  guide: Guide | null;
  guidePackage: GuidePackageType;
  onBackToRadar: () => void;
  onProceedToRazorpay: (tier?: 'budget' | 'value' | 'luxury', promo?: string) => void;
}

export const TripPackageSummary: React.FC<TripPackageSummaryProps> = ({
  spot,
  searchedPlace,
  hotel,
  room,
  nights,
  restaurantPass,
  guide,
  guidePackage,
  onBackToRadar,
  onProceedToRazorpay
}) => {
  // Affordability & Discount Engine States
  const [affordabilityTier, setAffordabilityTier] = useState<'budget' | 'value' | 'luxury'>('budget');
  const [enableMaxDiscount, setEnableMaxDiscount] = useState<boolean>(true);
  const [appliedPromo, setAppliedPromo] = useState<string>('AFFORDABLEINDIA');

  // Calculate live multi-party split breakdown with Maximum Affordability Engine
  const split: SplitBreakdown = calculateSplitBreakdown({
    hotel,
    nights,
    selectedRoomPrice: room.pricePerNight,
    guide,
    guidePackageType: guidePackage,
    restaurantPass,
    applyWebsiteDiscount: true,
    affordabilityTier,
    appliedPromoCode: appliedPromo,
    enableMaxDiscount
  });

  const handleApplyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    setAppliedPromo(clean);
  };

  const getPackageTitle = (pkg: GuidePackageType) => {
    switch (pkg) {
      case 'quick_walk': return 'Quick 2-Hour Heritage Walk';
      case 'half_day': return 'Half-Day Heritage & Bazaar Walk (4 Hours)';
      case 'full_day': return 'Full-Day Cultural Deep Dive (8 Hours)';
      case 'photography_walk': return 'Sunset Photography Tour (3.5 Hours)';
    }
  };

  const monthlyEmi3 = Math.round(split.totalCharged / 3);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToRadar}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Proximity Radar</span>
        </button>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-600/20 text-emerald-800 border border-emerald-300 text-xs font-black shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Maximum Affordability Engine Active: Up to {split.travelerSavingsPercent}% Off OTA Rack Rates</span>
        </div>
      </div>

      {/* Page Title & Mission */}
      {(() => {
        const formatDestination = (str: string) => {
          if (!str) return '';
          return str
            .trim()
            .split(/\s+/)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
        };

        const displayDestination = searchedPlace && searchedPlace.trim()
          ? formatDestination(searchedPlace)
          : spot.name;

        const hasDifferentSpot = Boolean(
          searchedPlace && 
          searchedPlace.trim() && 
          spot.name.toLowerCase() !== searchedPlace.trim().toLowerCase()
        );

        return (
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Step 3: Direct-Supplier Smart Package</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Your Customized & Affordable Package for {displayDestination}
            </h2>
            {hasDifferentSpot && (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Epicenter Spot: {spot.name} ({spot.city})</span>
              </div>
            )}
            <p className="text-xs sm:text-sm text-slate-500">
              We eliminated the 22% OTA commissions from Booking.com & MakeMyTrip and aggregated direct local discounts so 
              <strong className="text-slate-800"> anyone can afford to travel</strong> with certified safety and authentic local experiences.
            </p>
          </div>
        );
      })()}

      {/* Affordability Tier Switcher & Max Discount Master Toggle */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-500/30 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <BadgePercent className="w-4 h-4" />
                <span>Affordability Optimizer</span>
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Choose Your Affordability & Budget Tier
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tailor package savings to your budget without compromising on safety or proximity.
              </p>
            </div>

            {/* 1-Click Max Discount Toggle */}
            <div className="flex items-center gap-3 bg-white/10 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl border border-white/15 backdrop-blur-md self-start md:self-auto">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-amber-300 block leading-tight">1-Click Guarantee</span>
                <span className="text-xs font-black text-white">Max Possible Discount</span>
              </div>
              <button
                type="button"
                onClick={() => setEnableMaxDiscount(!enableMaxDiscount)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  enableMaxDiscount ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    enableMaxDiscount ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 3 Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Tier 1: Student / Budget */}
            <div
              onClick={() => setAffordabilityTier('budget')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                affordabilityTier === 'budget'
                  ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-500/40'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🎒</span>
                {affordabilityTier === 'budget' ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                    Active Tier
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-400 font-bold">Highest Savings</span>
                )}
              </div>
              <div className="font-extrabold text-white text-sm">Student & Budget Explorer</div>
              <div className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Max direct markdowns (35-42% off) + platform direct grant. Ideal for students and cost-conscious travelers.
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 text-emerald-400 text-xs font-black flex items-center justify-between">
                <span>Total Discount:</span>
                <span>Up to 45% OFF</span>
              </div>
            </div>

            {/* Tier 2: Smart Value */}
            <div
              onClick={() => setAffordabilityTier('value')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                affordabilityTier === 'value'
                  ? 'bg-blue-500/20 border-blue-400 ring-2 ring-blue-500/40'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">🌟</span>
                {affordabilityTier === 'value' ? (
                  <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white text-[10px] font-black uppercase">
                    Active Tier
                  </span>
                ) : (
                  <span className="text-[11px] text-blue-300 font-bold">Most Popular</span>
                )}
              </div>
              <div className="font-extrabold text-white text-sm">Smart Value Explorer</div>
              <div className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Optimal balance of comfort room upgrades, complete dining vouchers, and authentic guided historic trail.
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 text-blue-300 text-xs font-black flex items-center justify-between">
                <span>Total Discount:</span>
                <span>30% - 35% OFF</span>
              </div>
            </div>

            {/* Tier 3: Heritage Luxury */}
            <div
              onClick={() => setAffordabilityTier('luxury')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                affordabilityTier === 'luxury'
                  ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-500/40'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">👑</span>
                {affordabilityTier === 'luxury' ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                    Active Tier
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-300 font-bold">Premium Comfort</span>
                )}
              </div>
              <div className="font-extrabold text-white text-sm">Heritage & Deluxe Explorer</div>
              <div className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Full-day master historian guide, premium suites, and signature multi-course tasting experience.
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 text-amber-300 text-xs font-black flex items-center justify-between">
                <span>Total Discount:</span>
                <span>22% - 25% OFF</span>
              </div>
            </div>
          </div>

          {/* Instant Coupon Code Chips */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-bold flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Vouchers:</span>
            </span>
            {[
              { code: 'AFFORDABLEINDIA', label: 'AFFORDABLEINDIA (-₹650 Extra)' },
              { code: 'STUDENT500', label: 'STUDENT500 (-₹400 Extra)' },
              { code: 'MAXDISCOUNT', label: 'MAXDISCOUNT (Super Saver)' }
            ].map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleApplyPromo(c.code)}
                className={`px-3 py-1 rounded-xl font-bold transition-all text-[11px] flex items-center gap-1 ${
                  appliedPromo === c.code
                    ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300 shadow-md font-black'
                    : 'bg-white/15 text-slate-200 hover:bg-white/25'
                }`}
              >
                {appliedPromo === c.code && <Check className="w-3 h-3 text-slate-950" />}
                <span>{c.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 3 Bundled Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Hotel Stay */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Accommodation</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Stay
              </span>
            </div>

            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-32 object-cover rounded-xl mb-3"
            />

            <h4 className="font-extrabold text-slate-900 text-base leading-tight mb-1">
              {hotel.name}
            </h4>
            <div className="text-xs text-slate-500 flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{hotel.city} &bull; {hotel.tier}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Room Type:</span>
                <strong className="text-slate-800">{room.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <strong className="text-slate-800">{nights} Night(s)</strong>
              </div>
              <div className="flex justify-between">
                <span>Check-in Footfall:</span>
                <strong className="text-emerald-700">{hotel.checkinCount.toLocaleString()} visits</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Gross Price:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              ₹{(room.pricePerNight * nights).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 2: Authentic Restaurant Dining Pass */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" />
                <span>Culinary Pass</span>
              </span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                15% Food Credit
              </span>
            </div>

            {restaurantPass ? (
              <>
                <img
                  src={restaurantPass.restaurant.image}
                  alt={restaurantPass.restaurant.name}
                  className="w-full h-32 object-cover rounded-xl mb-3"
                />

                <h4 className="font-extrabold text-slate-900 text-base leading-tight mb-1">
                  {restaurantPass.restaurant.name}
                </h4>
                <div className="text-xs text-slate-500 mb-2">
                  {restaurantPass.restaurant.cuisine.join(', ')}
                </div>

                <div className="p-3 bg-amber-50/50 rounded-xl space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Dining Voucher Value:</span>
                    <strong className="text-emerald-700 font-bold">₹{restaurantPass.totalWorth}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Discounted Cost:</span>
                    <strong className="text-slate-800">₹{restaurantPass.totalCost}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Proximity:</span>
                    <strong className="text-slate-800">Walking distance from stay</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Utensils className="w-8 h-8 text-slate-300 mb-2" />
                <div className="text-xs font-bold text-slate-700">No Food Pass Added</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  You can add a local culinary voucher from the proximity radar.
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Dining Pass Cost:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              ₹{restaurantPass ? restaurantPass.totalCost.toLocaleString() : '0'}
            </span>
          </div>
        </div>

        {/* Card 3: Certified Local Guide */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Certified Guide</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Tourism Dept
              </span>
            </div>

            {guide ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                      {guide.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 block">
                      Lic: {guide.verificationId}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {guide.completedToursCount}+ Tours Completed
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-xl space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <strong className="text-slate-800">{getPackageTitle(guidePackage)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Languages:</span>
                    <strong className="text-slate-800">{guide.languages.slice(0, 2).join(', ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct Payout Share:</span>
                    <strong className="text-emerald-700">90% Direct to Guide</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Compass className="w-8 h-8 text-slate-300 mb-2" />
                <div className="text-xs font-bold text-slate-700">No Guide Added</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  You can explore self-guided, or add a certified historian in Step 2.
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Guide Fee:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              ₹{guide ? split.guideGrossOriginal?.toLocaleString() : '0'}
            </span>
          </div>
        </div>

      </div>

      {/* 4-Source Maximum Discount Breakdown Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-black uppercase tracking-wider">
              <Gift className="w-4 h-4" />
              <span>Multi-Source Affordability Breakdown</span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">
              How We Made This Package 100% Affordable
            </h3>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Every discount source combined to offer you the lowest possible direct cost.
            </p>
          </div>
          <div className="bg-emerald-500/20 px-4 py-2 rounded-2xl border border-emerald-400/40 text-right">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">Total Traveler Discount</span>
            <span className="text-xl font-black text-emerald-300">
              -₹{split.websiteDiscountAmount?.toLocaleString()} ({split.websiteDiscountPercent}% OFF)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Discount Source 1: Hotel Direct */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-emerald-300 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hotel Direct</span>
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/30">Zero Commission</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">
                Bypassed standard 22% OTA intermediary fees.
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 text-emerald-400 font-black text-sm">
              -₹{split.hotelDiscountAmount?.toLocaleString() || '0'}
            </div>
          </div>

          {/* Discount Source 2: Restaurant Bonus */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Culinary Credit</span>
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/30">+15% Bonus</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">
                Exclusive culinary pass discount & voucher value.
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 text-amber-300 font-black text-sm">
              -₹{split.restaurantDiscountAmount?.toLocaleString() || '0'}
            </div>
          </div>

          {/* Discount Source 3: Guide Escrow Community */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-teal-300 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Direct Guide</span>
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-teal-500/30">Fair Share</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">
                90% payout direct to guide without tour agency markups.
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 text-teal-300 font-black text-sm">
              -₹{split.guideDiscountAmount?.toLocaleString() || '0'}
            </div>
          </div>

          {/* Discount Source 4: Platform Subsidy Promo */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-pink-300 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Platform Voucher</span>
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-pink-500/30">Direct Grant</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">
                Instant promo code voucher applied to checkout.
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 text-pink-300 font-black text-sm">
              -₹{split.platformSubsidyAmount?.toLocaleString() || '0'}
            </div>
          </div>
        </div>
      </div>

      {/* Big Tech OTA Price Match Box & Savings Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex-1 space-y-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <span>Big Tech OTA Rate Comparison</span>
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Why Pay More on MakeMyTrip or Booking.com?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              OTAs inflate rack prices with high commissions and street guide markups. By bundling accommodation, dining, and local guides directly at the source, you save maximum money.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
            {/* OTA Market Price */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">MakeMyTrip / OTA</span>
              <div className="text-lg sm:text-xl font-bold text-slate-400 line-through mt-0.5">
                ₹{split.otaMarketPrice?.toLocaleString()}
              </div>
              <span className="text-[10px] text-rose-500 font-semibold block mt-0.5">Standard OTA rack rate</span>
            </div>

            {/* Our Direct Price */}
            <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-2xl text-center shadow-sm relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider">
                Direct Super-Bundle
              </span>
              <span className="text-[10px] text-emerald-800 font-bold uppercase block mt-1">Our Direct Price</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">
                ₹{split.totalCharged.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                You save ₹{split.travelerSavingsAmount?.toLocaleString()} ({split.travelerSavingsPercent}% OFF)!
              </span>
            </div>
          </div>

        </div>

        {/* No-Cost EMI & Student Friendly Banner */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              0%
            </div>
            <div>
              <span className="font-extrabold text-blue-950 block">Razorpay No-Cost EMI Available</span>
              <span className="text-[11px] text-blue-700">
                Pay as low as <strong className="text-blue-950 font-black">₹{monthlyEmi3.toLocaleString()}/month</strong> for 3 months with 0% interest on credit/debit cards.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-200 text-blue-900 px-3 py-1.5 rounded-xl shrink-0">
            Instant Approval
          </span>
        </div>
      </div>

      {/* Transparent Price & Escrow Split Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Itemized Cost & Multi-Party Escrow Settlement
            </h3>
            <p className="text-xs text-slate-500">
              One single Razorpay transaction automatically distributed to stakeholders
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">Total Amount</span>
            <div className="text-2xl font-black text-emerald-600">
              ₹{split.totalCharged.toLocaleString()}
            </div>
            {split.websiteDiscountAmount ? (
              <span className="text-xs text-rose-600 line-through">
                ₹{split.originalTotal?.toLocaleString()}
              </span>
            ) : null}
          </div>
        </div>

        {/* Pricing Table */}
        <div className="space-y-2.5 text-xs text-slate-600 mb-6">
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span>Hotel Stay ({nights} night(s) &bull; {room.name})</span>
            <span className="font-bold text-slate-800">₹{(room.pricePerNight * nights).toLocaleString()}</span>
          </div>

          {restaurantPass && (
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Authentic Food Pass ({restaurantPass.restaurant.name})</span>
              <span className="font-bold text-slate-800">₹{restaurantPass.totalCost.toLocaleString()}</span>
            </div>
          )}

          {guide && (
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Certified Guide Tour ({getPackageTitle(guidePackage)})</span>
              <span className="font-bold text-slate-800">₹{split.guideGrossOriginal?.toLocaleString()}</span>
            </div>
          )}

          {split.websiteDiscountAmount ? (
            <div className="flex justify-between py-1 text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg">
              <span className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" />
                <span>Exclusive Direct Website Discount ({split.websiteDiscountPercent}% Super-Bundle)</span>
              </span>
              <span>-₹{split.websiteDiscountAmount.toLocaleString()}</span>
            </div>
          ) : null}
        </div>

        {/* Transparent Escrow Split Diagram */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
          <div className="font-bold text-slate-700 flex items-center gap-1.5 mb-2.5">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Automated Payout Distribution via Smart Split:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="text-slate-500">🏨 Hotel Partner:</div>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5">₹{split.hotelNet.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Direct Net Payout</div>
            </div>

            {restaurantPass && (
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="text-slate-500">🍽️ Restaurant Partner:</div>
                <div className="font-extrabold text-slate-900 text-sm mt-0.5">₹{split.restaurantNet.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">90% Direct Food Credit</div>
              </div>
            )}

            {guide && (
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="text-slate-500">🧭 Certified Guide:</div>
                <div className="font-extrabold text-slate-900 text-sm mt-0.5">₹{split.guideNet.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Direct Escrow Deposit</div>
              </div>
            )}

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="text-slate-500">⚡ Platform & GST:</div>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5">₹{split.platformNetRevenue.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Gateway & Tech Fee</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted Razorpay Checkout Gateway</span>
          </div>

          <button
            type="button"
            onClick={() => onProceedToRazorpay(affordabilityTier, appliedPromo)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/25 transition-all"
          >
            <CreditCard className="w-4 h-4" />
            <span>Proceed to Razorpay Payment (₹{split.totalCharged.toLocaleString()})</span>
          </button>
        </div>

      </div>

    </div>
  );
};
