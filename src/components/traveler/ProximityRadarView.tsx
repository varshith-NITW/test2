import React, { useState, useMemo } from 'react';
import { 
  TouristSpot, 
  Hotel, 
  Restaurant, 
  Guide, 
  RoomType, 
  RestaurantPassSelection, 
  GuidePackageType 
} from '../../types';
import { 
  filterHotelsByRadius, 
  filterRestaurantsByRadius, 
  filterGuidesByProximity 
} from '../../services/spatialService';
import { generateProximityInventoryForSpot } from '../../services/placesService';
import { InteractiveMap } from '../common/InteractiveMap';
import { 
  Building2, 
  Utensils, 
  Compass, 
  MapPin, 
  Flame, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  SlidersHorizontal,
  Navigation,
  Clock,
  Sparkles,
  Plus
} from 'lucide-react';

interface ProximityRadarViewProps {
  selectedSpot: TouristSpot;
  searchedPlace?: string;
  hotels: Hotel[];
  restaurants: Restaurant[];
  guides: Guide[];
  // Selected state
  selectedHotel: Hotel | null;
  selectedRoom: RoomType | null;
  selectedRestaurantPass: RestaurantPassSelection | null;
  selectedGuide: Guide | null;
  selectedGuidePackage: GuidePackageType;
  // Handlers
  onSelectHotel: (hotel: Hotel, room: RoomType) => void;
  onToggleRestaurantPass: (pass: RestaurantPassSelection | null) => void;
  onToggleGuide: (guide: Guide | null, packageType?: GuidePackageType) => void;
  onBackToSpots: () => void;
  onProceedToSummary: () => void;
}

export const ProximityRadarView: React.FC<ProximityRadarViewProps> = ({
  selectedSpot,
  searchedPlace,
  hotels,
  restaurants,
  guides,
  selectedHotel,
  selectedRoom,
  selectedRestaurantPass,
  selectedGuide,
  selectedGuidePackage,
  onSelectHotel,
  onToggleRestaurantPass,
  onToggleGuide,
  onBackToSpots,
  onProceedToSummary
}) => {
  const [radiusKm, setRadiusKm] = useState<number>(6.0);
  const [activeCategory, setActiveCategory] = useState<'all' | 'hotels' | 'restaurants' | 'guides'>('all');

  // Dynamic fallback inventory ensures properties are always guaranteed for this destination
  const dynamicFallback = useMemo(() => {
    return generateProximityInventoryForSpot(selectedSpot);
  }, [selectedSpot]);

  // Merge parent state with spot-specific inventory
  const allAvailableHotels = useMemo(() => {
    const combined = [...hotels];
    for (const h of dynamicFallback.hotels) {
      if (!combined.some(existing => existing.id === h.id)) {
        combined.push(h);
      }
    }
    return combined;
  }, [hotels, dynamicFallback]);

  const allAvailableRestaurants = useMemo(() => {
    const combined = [...restaurants];
    for (const r of dynamicFallback.restaurants) {
      if (!combined.some(existing => existing.id === r.id)) {
        combined.push(r);
      }
    }
    return combined;
  }, [restaurants, dynamicFallback]);

  const allAvailableGuides = useMemo(() => {
    const combined = [...guides];
    for (const g of dynamicFallback.guides) {
      if (!combined.some(existing => existing.id === g.id)) {
        combined.push(g);
      }
    }
    return combined;
  }, [guides, dynamicFallback]);

  // Compute proximity items strictly based on selected tourist spot location
  const nearbyHotels = useMemo(() => {
    const filtered = filterHotelsByRadius(selectedSpot, allAvailableHotels, radiusKm);
    if (filtered.length > 0) return filtered;
    return filterHotelsByRadius(selectedSpot, allAvailableHotels, 25);
  }, [selectedSpot, allAvailableHotels, radiusKm]);

  const nearbyRestaurants = useMemo(() => {
    const filtered = filterRestaurantsByRadius(selectedSpot, allAvailableRestaurants, radiusKm);
    if (filtered.length > 0) return filtered;
    return filterRestaurantsByRadius(selectedSpot, allAvailableRestaurants, 25);
  }, [selectedSpot, allAvailableRestaurants, radiusKm]);

  const nearbyGuides = useMemo(() => {
    const rawHotels = nearbyHotels.map(h => h.hotel);
    return filterGuidesByProximity(selectedSpot, allAvailableGuides, rawHotels);
  }, [selectedSpot, allAvailableGuides, nearbyHotels]);

  // Set default selected hotel if none selected or if previously selected hotel is from another city
  React.useEffect(() => {
    const isHotelInCurrentCity = selectedHotel && 
      (selectedHotel.city.toLowerCase() === selectedSpot.city.toLowerCase() ||
       nearbyHotels.some(nh => nh.hotel.id === selectedHotel.id));

    if ((!selectedHotel || !isHotelInCurrentCity) && nearbyHotels.length > 0) {
      const topHotel = nearbyHotels[0].hotel;
      onSelectHotel(topHotel, topHotel.roomTypes[0]);
    }
  }, [nearbyHotels, selectedHotel, selectedSpot, onSelectHotel]);

  return (
    <div className="space-y-8">
      
      {/* Top Header with Selected Spot & Radius Slider */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToSpots}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Back to Tourist Spots"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <MapPin className="w-3.5 h-3.5" />
                <span>Epicenter: {selectedSpot.city}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Proximity Radar: {searchedPlace && searchedPlace.trim() ? `${searchedPlace.trim()} (${selectedSpot.name})` : selectedSpot.name}
              </h2>
            </div>
          </div>

          {/* Radius Slider */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
            <div className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>Spatial Radius:</span>
              <span className="text-emerald-700 font-extrabold">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
              className="w-28 sm:w-36 accent-emerald-600 cursor-pointer"
            />
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Proximity ({nearbyHotels.length + nearbyRestaurants.length + nearbyGuides.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('hotels')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeCategory === 'hotels'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hotels ({nearbyHotels.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('restaurants')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeCategory === 'restaurants'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Restaurants ({nearbyRestaurants.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('guides')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeCategory === 'guides'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Local Guides ({nearbyGuides.length})</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Visualizer */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-3 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Spatial Map (PostGIS Distance Cluster)</span>
          </div>
          <span className="text-slate-400 text-[11px]">
            {nearbyHotels.length} Stays &bull; {nearbyRestaurants.length} Food Spots &bull; {nearbyGuides.length} Guides
          </span>
        </div>

        <InteractiveMap
          spot={selectedSpot}
          hotels={nearbyHotels.map(h => h.hotel)}
          selectedHotelId={selectedHotel?.id}
          onSelectHotel={(hotel) => onSelectHotel(hotel, hotel.roomTypes[0])}
          radiusKm={radiusKm}
        />
      </div>

      {/* 3 Categories Grid */}
      <div className="space-y-8">

        {/* Category 1: Nearby Hotels */}
        {(activeCategory === 'all' || activeCategory === 'hotels') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Proximity Hotels & Heritage Stays
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ranked by verified Google Maps check-in footfall (Strictly zero rating bias)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {nearbyHotels.map(({ hotel, distanceKm, commute }) => {
                const isSelected = selectedHotel?.id === hotel.id;

                return (
                  <div
                    key={hotel.id}
                    className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-bold shadow-md">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>{hotel.checkinCount.toLocaleString()} Check-ins</span>
                        </div>

                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold shadow-md">
                          {commute.label}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                            {hotel.tier}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-slate-900 text-base leading-tight">
                            {hotel.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {hotel.address}
                          </p>
                        </div>

                        {/* Room selection */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-slate-700">Available Room:</span>
                          <div className="space-y-1.5">
                            {hotel.roomTypes.map(room => (
                              <button
                                key={room.id}
                                type="button"
                                onClick={() => onSelectHotel(hotel, room)}
                                className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                                  isSelected && selectedRoom?.id === room.id
                                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span className="truncate pr-2">{room.name}</span>
                                <span className="font-bold text-slate-900 shrink-0">
                                  ₹{room.pricePerNight.toLocaleString()}<span className="text-[10px] font-normal text-slate-500">/nt</span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        type="button"
                        onClick={() => onSelectHotel(hotel, hotel.roomTypes[0])}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-800 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : null}
                        <span>{isSelected ? 'Stay Selected' : 'Select This Stay'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category 2: Nearby Authentic Restaurants (Brand New Requested Feature) */}
        {(activeCategory === 'all' || activeCategory === 'restaurants') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Proximity Authentic Restaurants & Food Corridors
                  </h3>
                  <p className="text-xs text-slate-500">
                    Curated culinary favorites in walking distance with exclusive 15% dining vouchers
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {nearbyRestaurants.map(({ restaurant, distanceKm, commute }) => {
                const isPassSelected = selectedRestaurantPass?.restaurant.id === restaurant.id;

                return (
                  <div
                    key={restaurant.id}
                    className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                      isPassSelected
                        ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-bold shadow-md">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>{restaurant.checkinCount.toLocaleString()} Check-ins</span>
                        </div>

                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-amber-600 text-white text-[11px] font-bold shadow-md">
                          {commute.label}
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 text-base leading-tight">
                              {restaurant.name}
                            </h4>
                            <span className="text-[11px] font-semibold text-slate-500">
                              ₹{restaurant.priceForTwo} for 2
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {restaurant.cuisine.map((c, cIdx) => (
                              <span key={cIdx} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-semibold">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Famous Dishes */}
                        <div className="space-y-1 pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-slate-700">Must-Try Specialties:</span>
                          <div className="space-y-1">
                            {restaurant.famousDishes.slice(0, 2).map((dish, dIdx) => (
                              <div key={dIdx} className="text-xs text-slate-600 flex items-center justify-between">
                                <span className="truncate pr-2">&bull; {dish.name}</span>
                                <span className="text-slate-400 font-medium">₹{dish.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Dining Voucher Offer Box */}
                        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs">
                          <div className="flex items-center justify-between font-bold text-amber-900 mb-1">
                            <span>VIP Food Pass Voucher:</span>
                            <span className="text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                              {restaurant.diningVoucherDiscountPercent}% OFF
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-800">
                            Get ₹{restaurant.diningVoucherPrice + 75} dining credit for only <strong>₹{restaurant.diningVoucherPrice}</strong>.
                          </p>
                        </div>

                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (isPassSelected) {
                            onToggleRestaurantPass(null);
                          } else {
                            onToggleRestaurantPass({
                              restaurant,
                              voucherQuantity: 1,
                              unitVoucherWorth: restaurant.diningVoucherPrice + 75,
                              unitPricePaid: restaurant.diningVoucherPrice,
                              totalWorth: restaurant.diningVoucherPrice + 75,
                              totalCost: restaurant.diningVoucherPrice
                            });
                          }
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          isPassSelected
                            ? 'bg-amber-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-800 hover:bg-amber-50 hover:text-amber-800'
                        }`}
                      >
                        {isPassSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        <span>{isPassSelected ? 'Dining Voucher Added (₹' + restaurant.diningVoucherPrice + ')' : 'Add VIP Food Pass (+₹' + restaurant.diningVoucherPrice + ')'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category 3: Nearby Certified Local Guides */}
        {(activeCategory === 'all' || activeCategory === 'guides') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Proximity Certified Local Guides
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tourism Department licensed storytellers &bull; 90% direct payout fair trade
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {nearbyGuides.map(({ guide, distanceKm }) => {
                const isSelected = selectedGuide?.id === guide.id;

                return (
                  <div
                    key={guide.id}
                    className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-start gap-3.5 mb-3">
                        <img
                          src={guide.avatar}
                          alt={guide.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-900 text-base truncate">
                              {guide.name}
                            </h4>
                            <span title="Govt Tourism Dept Verified">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block truncate">
                            Lic: {guide.verificationId}
                          </span>
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 mt-1">
                            {guide.completedToursCount}+ Completed Tours
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        {guide.bio}
                      </p>

                      <div className="text-[11px] text-slate-500 mb-3">
                        <strong className="text-slate-700">Languages:</strong> {guide.languages.join(', ')}
                      </div>

                      {/* Package selector */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-700">Select Tour Duration:</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => onToggleGuide(guide, 'half_day')}
                            className={`p-2 rounded-xl text-left border text-xs transition-all ${
                              isSelected && selectedGuidePackage === 'half_day'
                                ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="text-[10px] text-slate-500">Half-Day (4h)</div>
                            <div className="font-extrabold text-slate-900">₹{guide.halfDayRate}</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleGuide(guide, 'full_day')}
                            className={`p-2 rounded-xl text-left border text-xs transition-all ${
                              isSelected && selectedGuidePackage === 'full_day'
                                ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="text-[10px] text-slate-500">Full-Day (8h)</div>
                            <div className="font-extrabold text-slate-900">₹{guide.fullDayRate}</div>
                          </button>
                        </div>
                      </div>

                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            onToggleGuide(null);
                          } else {
                            onToggleGuide(guide, 'half_day');
                          }
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-800 hover:bg-emerald-50 hover:text-emerald-800'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        <span>{isSelected ? 'Certified Guide Added' : 'Add Certified Guide'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Bottom Action Bar to Advance to Step 3 */}
      <div className="sticky bottom-4 z-40 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selected Proximity Bundle:</span>
          </div>
          <div className="text-sm font-semibold text-slate-200 mt-0.5 flex flex-wrap items-center gap-2">
            <span>🏨 {selectedHotel?.name || 'No stay chosen'}</span>
            <span>&bull;</span>
            <span>🍽️ {selectedRestaurantPass ? selectedRestaurantPass.restaurant.name : 'No dining pass'}</span>
            <span>&bull;</span>
            <span>🧭 {selectedGuide ? selectedGuide.name : 'No guide added'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onBackToSpots}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Change Destination
          </button>
          <button
            type="button"
            disabled={!selectedHotel}
            onClick={onProceedToSummary}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
          >
            <span>Build Affordable Package (Max Discounts)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
