import React, { useState, useRef } from 'react';
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
import { WhyBetterShowcase } from '../comparison/WhyBetterShowcase';
import { generateProximityInventoryForSpot } from '../../services/placesService';
import { calculateHaversineDistance } from '../../services/spatialService';
import { GeminiTouristRecommendation } from '../../services/geminiService';

interface TravelerHomeProps {
  spots: TouristSpot[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  guides: Guide[];
  onSelectHotelForBooking?: (hotel: Hotel, matchedGuide?: Guide) => void;
  onBookingSuccess?: (booking: Booking) => void;
  onAddSpot?: (spot: TouristSpot) => void;
  onAddInventory?: (inventory: { hotels: Hotel[]; restaurants: Restaurant[]; guides: Guide[] }) => void;
}

export const TravelerHome: React.FC<TravelerHomeProps> = ({
  spots,
  hotels,
  restaurants,
  guides,
  onBookingSuccess,
  onAddSpot,
  onAddInventory
}) => {
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

  return (
    <div className="space-y-8 pb-16">
      
      {/* 4-Step Layer Wizard */}
      <StepWizard
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step === 'step4_payment') {
            setShowRazorpayModal(true);
          } else {
            setCurrentStep(step);
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
          onProceedToProximity={() => setCurrentStep('step2_proximity')}
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
          onBackToSpots={() => setCurrentStep('step1_spots')}
          onProceedToSummary={() => setCurrentStep('step3_summary')}
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
          onBackToRadar={() => setCurrentStep('step2_proximity')}
          onProceedToRazorpay={(tier, promo) => {
            if (tier) setAffordabilityTier(tier);
            if (promo) setAppliedPromoCode(promo);
            setShowRazorpayModal(true);
          }}
        />
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
        />
      )}

      {/* "Why It's 10x Better Than Other Websites" Comprehensive Section */}
      <div ref={comparisonSectionRef} id="why-better-section">
        <WhyBetterShowcase />
      </div>

    </div>
  );
};
