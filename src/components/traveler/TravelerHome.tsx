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

  const handleSelectSpot = (spotOrId: TouristSpot | string) => {
    let spot: TouristSpot | undefined;
    if (typeof spotOrId === 'string') {
      spot = spots.find(s => s.id === spotOrId);
    } else {
      spot = spotOrId;
    }

    if (!spot) return;

    setSelectedSpotId(spot.id);
    setActiveSpotOverride(spot);

    if (onAddSpot && !spots.some(s => s.id === spot!.id)) {
      onAddSpot(spot);
    }

    // Check if we have hotels in this city or in 15km proximity
    const cityHotels = hotels.filter(h => 
      h.city.toLowerCase() === spot!.city.toLowerCase() ||
      calculateHaversineDistance(spot!.location, h.location) <= 15
    );

    if (cityHotels.length > 0) {
      setSelectedHotel(cityHotels[0]);
      setSelectedRoom(cityHotels[0].roomTypes[0]);
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
          onSelectSpot={handleSelectSpot}
          onProceedToProximity={() => setCurrentStep('step2_proximity')}
        />
      )}

      {/* Layer Step 2: Proximity Radar (Hotels, Restaurants, Certified Guides) */}
      {currentStep === 'step2_proximity' && selectedSpot && (
        <ProximityRadarView
          selectedSpot={selectedSpot}
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
