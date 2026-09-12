import React from 'react';
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
  Info
} from 'lucide-react';

interface TripPackageSummaryProps {
  spot: TouristSpot;
  hotel: Hotel;
  room: RoomType;
  nights: number;
  restaurantPass: RestaurantPassSelection | null;
  guide: Guide | null;
  guidePackage: GuidePackageType;
  onBackToRadar: () => void;
  onProceedToRazorpay: () => void;
}

export const TripPackageSummary: React.FC<TripPackageSummaryProps> = ({
  spot,
  hotel,
  room,
  nights,
  restaurantPass,
  guide,
  guidePackage,
  onBackToRadar,
  onProceedToRazorpay
}) => {
  // Calculate live multi-party split breakdown
  const split: SplitBreakdown = calculateSplitBreakdown({
    hotel,
    nights,
    selectedRoomPrice: room.pricePerNight,
    guide,
    guidePackageType: guidePackage,
    restaurantPass,
    applyWebsiteDiscount: true
  });

  const getPackageTitle = (pkg: GuidePackageType) => {
    switch (pkg) {
      case 'quick_walk': return 'Quick 2-Hour Heritage Walk';
      case 'half_day': return 'Half-Day Heritage & Bazaar Walk (4 Hours)';
      case 'full_day': return 'Full-Day Cultural Deep Dive (8 Hours)';
      case 'photography_walk': return 'Sunset Photography Tour (3.5 Hours)';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToRadar}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Proximity Radar</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Direct Website Super-Bundle Applied</span>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          Your Customized 3-in-1 Trip Itinerary
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Curated around <strong className="text-slate-800">{spot.name}</strong>. Everything in close proximity, backed by real footfall check-ins and fair supplier payouts.
        </p>
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
            onClick={onProceedToRazorpay}
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
