import React, { useState, useRef, useEffect } from 'react';
import { 
  TouristSpot, 
  Hotel, 
  Restaurant, 
  Guide, 
  RoomType, 
  RestaurantPassSelection, 
  GuidePackageType,
  StepLayer,
  Booking
} from '../../types';
import { StepWizard } from './StepWizard';
import { AIPlaceRecommender } from './AIPlaceRecommender';
import { ProximityRadarView } from './ProximityRadarView';
import { TripPackageSummary } from './TripPackageSummary';
import { RazorpayCheckoutModal } from './RazorpayCheckoutModal';
import { BookedPlansBox } from './BookedPlansBox';
import { WhyBetterShowcase } from '../comparison/WhyBetterShowcase';
import { generateProximityInventoryForSpot } from '../../services/placesService';
import { calculateHaversineDistance } from '../../services/spatialService';
import { GeminiTouristRecommendation } from '../../services/geminiService';
import { Compass, Ticket } from 'lucide-react';

interface TravelerHomeProps {
  spots: TouristSpot[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  guides: Guide[];
  onSelectHotelForBooking?: (hotel: Hotel, matchedGuide?: Guide) => void;
  onBookingSuccess?: (booking: Booking) => void;
  onAddSpot?: (spot: TouristSpot) => void;
  onAddInventory?: (inventory: { hotels: Hotel[]; restaurants: Restaurant[]; guides: Guide[] }) => void;
  currentUser?: import('../../types').UserProfile | null;
  bookings?: Booking[];
}

export const TravelerHome: React.FC<TravelerHomeProps> = ({
  spots,
  hotels,
  restaurants,
  guides,
  onBookingSuccess,
  onAddSpot,
  onAddInventory,
  currentUser,
  bookings = []
}) => {
  // Filter bookings strictly for the current logged-in traveler
  const userBookings = React.useMemo(() => {
    if (!currentUser) return [];
    const currentUserId = currentUser.id ? currentUser.id.toLowerCase().trim() : '';
    const currentUserEmail = currentUser.email ? currentUser.email.toLowerCase().trim() : '';

    return bookings.filter((b) => {
      const bUserId = b.userId ? b.userId.toLowerCase().trim() : '';
      const bTravelerEmail = b.travelerEmail ? b.travelerEmail.toLowerCase().trim() : '';
      const bGuestEmail = (b as any).guestEmail ? (b as any).guestEmail.toLowerCase().trim() : '';

      const idMatch = !!(currentUserId && bUserId && bUserId === currentUserId);
      const emailMatch = !!(
        (currentUserEmail && bTravelerEmail && bTravelerEmail === currentUserEmail) ||
        (currentUserEmail && bGuestEmail && bGuestEmail === currentUserEmail)
      );

      return idMatch || emailMatch;
    });
  }, [bookings, currentUser]);

  // Active sub-tab inside Traveler View: 'planner' vs 'my_bookings'
  const [activeTab, setActiveTab] = useState<'planner' | 'my_bookings'>('planner');

  // Step layer state
  const [currentStep, setCurrentStep] = useState<StepLayer>('step1_spots');

  // User searched/typed place in Gemini AI box & AI State
  const [searchedPlace, setSearchedPlace] = useState<string>('');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [geminiResult, setGeminiResult] = useState<GeminiTouristRecommendation | null>(null);

  // Selected trip state
  const [selectedSpotId, setSelectedSpotId] = useState<string>(spots[0]?.id || '');
  const [activeSpotOverride, setActiveSpotOverride] = useState<TouristSpot | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(hotels[0] || null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(hotels[0]?.roomTypes[0] || null);
  const [selectedRestaurantPass, setSelectedRestaurantPass] = useState<RestaurantPassSelection | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [selectedGuidePackage, setSelectedGuidePackage] = useState<GuidePackageType>('half_day');
  const [nights, setNights] = useState<number>(2);
  const [affordabilityTier, setAffordabilityTier] = useState<'budget' | 'value' | 'luxury'>('budget');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('AFFORDABLEINDIA');

  // Modals
  const [showRazorpayModal, setShowRazorpayModal] = useState<boolean>(false);

  const comparisonSectionRef = useRef<HTMLDivElement>(null);

  const selectedSpot = activeSpotOverride || spots.find(s => s.id === selectedSpotId) || spots[0];

  const handleSelectSpot = (spotOrId: TouristSpot | string, customPlaceName?: string) => {
    let spot: TouristSpot | undefined;
    if (typeof spotOrId === 'string') {
      spot = spots.find(s => s.id === spotOrId);
    } else {
      spot = spotOrId;
    }

    if (!spot) return;

    setSelectedSpotId(spot.id);
    setActiveSpotOverride(spot);

    if (customPlaceName !== undefined) {
      setSearchedPlace(customPlaceName);
    }

    if (onAddSpot && !spots.some(s => s.id === spot!.id)) {
      onAddSpot(spot);
    }

    // Check if we have hotels in this city or in 15km proximity without cross-city contamination
    const spotCity = spot.city.toLowerCase().trim();
    const cityHotels = hotels.filter(h => {
      const hCity = h.city.toLowerCase().trim();
      const hAddr = h.address.toLowerCase();
      if (spotCity && (hCity === spotCity || hCity.includes(spotCity) || spotCity.includes(hCity) || hAddr.includes(spotCity))) {
        return true;
      }
      const dist = calculateHaversineDistance(spot!.location, h.location);
      if (dist <= 15) {
        const otherKnown = ['surat', 'lucknow', 'hyderabad', 'delhi', 'goa', 'jaipur', 'agra'];
        return !otherKnown.some(oc => (hCity.includes(oc) || hAddr.includes(oc)) && !spotCity.includes(oc));
      }
      return false;
    });

    if (cityHotels.length > 0) {
      const nonSynthetic = cityHotels.filter(h => !h.id.startsWith('hotel-dyn-'));
      const topHotel = nonSynthetic[0] || cityHotels[0];
      setSelectedHotel(topHotel);
      setSelectedRoom(topHotel.roomTypes[0]);
    } else {
      // Dynamically generate proximity inventory for this spot
      const dynamicInv = generateProximityInventoryForSpot(spot);
      if (onAddInventory) {
        onAddInventory(dynamicInv);
      }
      setSelectedHotel(dynamicInv.hotels[0]);
      setSelectedRoom(dynamicInv.hotels[0].roomTypes[0]);
    }
  };

  const handleAiPromptChange = (prompt: string) => {
    setAiPrompt(prompt);
    if (prompt.trim()) {
      setSearchedPlace(prompt.trim());
    }
  };

  const handleGeminiResultChange = (result: GeminiTouristRecommendation | null) => {
    setGeminiResult(result);
    if (result && result.matchedSpots && result.matchedSpots.length > 0) {
      const topSpot = result.matchedSpots[0];
      const placeName = result.destinationName || result.query || topSpot.city;
      handleSelectSpot(topSpot, placeName);
    }
  };

  const handleSelectHotel = (hotel: Hotel, room: RoomType) => {
    setSelectedHotel(hotel);
    setSelectedRoom(room);
  };

  const handleToggleRestaurantPass = (pass: RestaurantPassSelection | null) => {
    setSelectedRestaurantPass(pass);
  };

  const handleToggleGuide = (guide: Guide | null, packageType: GuidePackageType = 'half_day') => {
    setSelectedGuide(guide);
    setSelectedGuidePackage(packageType);
  };

  const handleBookingConfirmed = (booking: Booking) => {
    if (onBookingSuccess) {
      onBookingSuccess(booking);
    }
    setActiveTab('my_bookings');
    scrollToPageTop();
  };

  const handleAddHospitalityInventory = (newHotels: Hotel[], newRestaurants: Restaurant[]) => {
    if (newHotels.length > 0) {
      setSelectedHotel(newHotels[0]);
      setSelectedRoom(newHotels[0].roomTypes[0]);
    }
    if (onAddInventory) {
      onAddInventory({
        hotels: newHotels,
        restaurants: newRestaurants,
        guides: []
      });
    }
  };

  const topAnchorRef = useRef<HTMLDivElement>(null);

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
    }
  };

  const handleStepTransition = (step: StepLayer) => {
    setCurrentStep(step);
    scrollToPageTop();
  };

  // Automatically scroll to top of page whenever active step changes
  useEffect(() => {
    scrollToPageTop();
    const frameId = requestAnimationFrame(() => {
      scrollToPageTop();
    });
    const timer = setTimeout(() => {
      scrollToPageTop();
    }, 50);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [currentStep]);

  return (
    <div ref={topAnchorRef} className="space-y-6 pb-16">
      
      {/* Top Traveler Sub-Nav Switcher (Explore & Build vs My Booked Plans Box) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('planner');
              scrollToPageTop();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'planner'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Explore & Build Trip</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('my_bookings');
              scrollToPageTop();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my_bookings'
                ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Ticket className="w-4 h-4 text-emerald-400" />
            <span>My Booked Plans</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'my_bookings' ? 'bg-emerald-400 text-slate-950' : 'bg-slate-200 text-slate-700'
            }`}>
              {userBookings.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 pr-2">
          {userBookings.length > 0 && activeTab === 'planner' && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('my_bookings');
                scrollToPageTop();
              }}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer text-xs"
            >
              <span>🎒 View {userBookings.length} Confirmed Plan{userBookings.length > 1 ? 's' : ''} &rarr;</span>
            </button>
          )}
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-sky-700 font-semibold flex items-center gap-1 text-[11px]">
            ☁️ Google Cloud Firestore Live Sync
          </span>
        </div>
      </div>

      {/* Tab 1: Dedicated Booked Plans Box */}
      {activeTab === 'my_bookings' && (
        <div className="space-y-6">
          <BookedPlansBox
            bookings={userBookings}
            onOpenPlanner={() => {
              setActiveTab('planner');
              scrollToPageTop();
            }}
          />
        </div>
      )}

      {/* Tab 2: Trip Planner Wizard */}
      {activeTab === 'planner' && (
        <div className="space-y-8">
          {/* 4-Step Layer Wizard */}
          <StepWizard
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step === 'step4_payment') {
                setShowRazorpayModal(true);
              } else {
                handleStepTransition(step);
              }
            }}
            hasSpotSelected={!!selectedSpot}
            hasHotelSelected={!!selectedHotel}
          />

          {/* Layer Step 1: Ask AI & Select Tourist Place */}
          {currentStep === 'step1_spots' && (
            <AIPlaceRecommender
              spots={spots}
              selectedSpotId={selectedSpotId}
              aiPrompt={aiPrompt}
              geminiResult={geminiResult}
              onAiPromptChange={handleAiPromptChange}
              onGeminiResultChange={handleGeminiResultChange}
              onSelectSpot={handleSelectSpot}
              onProceedToProximity={() => handleStepTransition('step2_proximity')}
              onAddHospitalityInventory={handleAddHospitalityInventory}
            />
          )}

          {/* Layer Step 2: Proximity Radar (Hotels, Restaurants, Certified Guides) */}
          {currentStep === 'step2_proximity' && selectedSpot && (
            <ProximityRadarView
              selectedSpot={selectedSpot}
              searchedPlace={searchedPlace}
              hotels={hotels}
              restaurants={restaurants}
              guides={guides}
              selectedHotel={selectedHotel}
              selectedRoom={selectedRoom}
              selectedRestaurantPass={selectedRestaurantPass}
              selectedGuide={selectedGuide}
              selectedGuidePackage={selectedGuidePackage}
              onSelectHotel={handleSelectHotel}
              onToggleRestaurantPass={handleToggleRestaurantPass}
              onToggleGuide={handleToggleGuide}
              onBackToSpots={() => handleStepTransition('step1_spots')}
              onProceedToSummary={() => handleStepTransition('step3_summary')}
            />
          )}

          {/* Layer Step 3: Unified Itinerary & Package Summary */}
          {currentStep === 'step3_summary' && selectedSpot && selectedHotel && selectedRoom && (
            <TripPackageSummary
              spot={selectedSpot}
              searchedPlace={searchedPlace}
              hotel={selectedHotel}
              room={selectedRoom}
              nights={nights}
              restaurantPass={selectedRestaurantPass}
              guide={selectedGuide}
              guidePackage={selectedGuidePackage}
              onBackToRadar={() => handleStepTransition('step2_proximity')}
              onProceedToRazorpay={(tier, promo) => {
                if (tier) setAffordabilityTier(tier);
                if (promo) setAppliedPromoCode(promo);
                setShowRazorpayModal(true);
              }}
            />
          )}

          {/* Dedicated Booked Plans Box also rendered on the main page when bookings exist */}
          {userBookings.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <BookedPlansBox
                bookings={userBookings}
                onOpenPlanner={() => {
                  setActiveTab('planner');
                  scrollToPageTop();
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Layer Step 4: Razorpay Payment Gateway Modal */}
      {showRazorpayModal && selectedSpot && selectedHotel && selectedRoom && (
        <RazorpayCheckoutModal
          spot={selectedSpot}
          searchedPlace={searchedPlace}
          hotel={selectedHotel}
          selectedRoom={selectedRoom}
          nights={nights}
          restaurantPass={selectedRestaurantPass}
          selectedGuide={selectedGuide}
          selectedPackage={selectedGuidePackage}
          affordabilityTier={affordabilityTier}
          appliedPromoCode={appliedPromoCode}
          onClose={() => setShowRazorpayModal(false)}
          onBookingConfirmed={handleBookingConfirmed}
          currentUser={currentUser}
        />
      )}

      {/* "Why It's 10x Better Than Other Websites" Comprehensive Section */}
      <div ref={comparisonSectionRef} id="why-better-section">
        <WhyBetterShowcase />
      </div>

    </div>
  );
};
