import React, { useState } from 'react';
import { PersonaType, Navbar } from './components/Navbar';
import { TouristSpot, Hotel, Guide, Restaurant, Booking, RoomType, GuidePackageType } from './types';
import { INITIAL_TOURIST_SPOTS, INITIAL_HOTELS, INITIAL_GUIDES, INITIAL_RESTAURANTS } from './data/mockData';
import { TravelerHome } from './components/traveler/TravelerHome';
import { GuideAddonModal } from './components/traveler/GuideAddonModal';
import { CheckoutModal } from './components/traveler/CheckoutModal';
import { HotelPartnerPortal } from './components/hotel/HotelPartnerPortal';
import { LocalGuidePortal } from './components/guide/LocalGuidePortal';
import { SplitPaymentSimulator } from './components/split/SplitPaymentSimulator';
import { calculateSplitBreakdown } from './services/paymentSplitService';
import { createBookingViaNodeAPI } from './services/apiClient';

export function App() {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('traveler');
  const [spots, setSpots] = useState<TouristSpot[]>(INITIAL_TOURIST_SPOTS);
  const [hotels, setHotels] = useState<Hotel[]>(INITIAL_HOTELS);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [guides, setGuides] = useState<Guide[]>(INITIAL_GUIDES);

  // Initial seed booking to populate hotel and guide portals immediately
  const initialBookingSplit = calculateSplitBreakdown({
    hotel: INITIAL_HOTELS[0],
    nights: 2,
    selectedRoomPrice: INITIAL_HOTELS[0].pricePerNight,
    guide: INITIAL_GUIDES[2],
    guidePackageType: 'half_day'
  });

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'BK-RPZ-781920',
      userId: 'user-demo-1',
      hotelId: INITIAL_HOTELS[0].id,
      hotelName: INITIAL_HOTELS[0].name,
      roomTypeId: 'tf-palace-room',
      roomTypeName: 'Historic Palace Room',
      dates: {
        checkIn: '2026-09-16',
        checkOut: '2026-09-18',
        nights: 2
      },
      guests: 2,
      guideId: INITIAL_GUIDES[2].id,
      guideName: INITIAL_GUIDES[2].name,
      guidePackageType: 'half_day',
      guidePackageTitle: 'Half-Day Heritage & Bazaar Walk (4 Hours)',
      restaurantId: INITIAL_RESTAURANTS[0].id,
      restaurantName: INITIAL_RESTAURANTS[0].name,
      restaurantPassAmount: 200,
      totalAmount: initialBookingSplit.totalCharged,
      splitBreakdown: initialBookingSplit,
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      meetingPointInfo: 'Hotel Concierge Desk at 09:30 AM',
      touristSpotName: 'Charminar & Old City Bazaars'
    }
  ]);

  // Modal flow states
  const [activeGuideAddonHotel, setActiveGuideAddonHotel] = useState<Hotel | null>(null);
  const [activePreselectedGuide, setActivePreselectedGuide] = useState<Guide | undefined>(undefined);
  const [checkoutModalData, setCheckoutModalData] = useState<{
    hotel: Hotel;
    selectedRoom: RoomType;
    nights: number;
    includeGuide: boolean;
    selectedGuide: Guide | null;
    selectedPackage: GuidePackageType;
  } | null>(null);

  // Handlers
  const handleSelectHotelForBooking = (hotel: Hotel, matchedGuide?: Guide) => {
    setActiveGuideAddonHotel(hotel);
    setActivePreselectedGuide(matchedGuide);
  };

  const handleProceedToCheckoutFromAddon = (params: {
    hotel: Hotel;
    selectedRoom: RoomType;
    nights: number;
    includeGuide: boolean;
    selectedGuide: Guide | null;
    selectedPackage: GuidePackageType;
  }) => {
    setActiveGuideAddonHotel(null);
    setCheckoutModalData(params);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Asynchronously synchronize booking record with backend Node.js API Gateway
    createBookingViaNodeAPI({
      hotelId: newBooking.hotelId,
      hotelName: newBooking.hotelName,
      roomName: newBooking.roomTypeName,
      nights: newBooking.dates.nights,
      roomPrice: newBooking.totalAmount,
      guideId: newBooking.guideId,
      guideName: newBooking.guideName,
      guidePackageTitle: newBooking.guidePackageTitle,
      razorpayPaymentId: newBooking.razorpayPaymentId,
      razorpayOrderId: newBooking.razorpayOrderId,
      websiteDiscountAmount: newBooking.websiteDiscountAmount
    }).catch((err) => console.info('Booking API background sync:', err.message));
  };

  const handleRegisterNewHotel = (newHotel: Hotel) => {
    setHotels((prev) => [newHotel, ...prev]);
  };

  const handleRegisterNewGuide = (newGuide: Guide) => {
    setGuides((prev) => [newGuide, ...prev]);
  };

  const handleAddSpot = (spot: TouristSpot) => {
    setSpots((prev) => (prev.some((s) => s.id === spot.id) ? prev : [spot, ...prev]));
  };

  const handleAddInventory = (inv: { hotels: Hotel[]; restaurants: Restaurant[]; guides: Guide[] }) => {
    setHotels((prev) => [...inv.hotels.filter(nh => !prev.some(h => h.id === nh.id)), ...prev]);
    setRestaurants((prev) => [...inv.restaurants.filter(nr => !prev.some(r => r.id === nr.id)), ...prev]);
    setGuides((prev) => [...inv.guides.filter(ng => !prev.some(g => g.id === ng.id)), ...prev]);
  };

  const handleScrollToComparison = () => {
    const el = document.getElementById('why-better-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Top Global Navbar with Persona Switcher & Quick Navigation */}
      <Navbar
        currentPersona={currentPersona}
        onSelectPersona={(persona) => setCurrentPersona(persona)}
        bookingCount={bookings.length}
        onScrollToComparison={handleScrollToComparison}
      />

      {/* Main Persona View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {currentPersona === 'traveler' && (
          <TravelerHome
            spots={spots}
            hotels={hotels}
            restaurants={restaurants}
            guides={guides}
            onSelectHotelForBooking={handleSelectHotelForBooking}
            onBookingSuccess={handleBookingConfirmed}
            onAddSpot={handleAddSpot}
            onAddInventory={handleAddInventory}
          />
        )}

        {currentPersona === 'hotel' && (
          <HotelPartnerPortal
            hotels={hotels}
            guides={guides}
            bookings={bookings}
            onRegisterNewHotel={handleRegisterNewHotel}
          />
        )}

        {currentPersona === 'guide' && (
          <LocalGuidePortal
            guides={guides}
            hotels={hotels}
            bookings={bookings}
            onUpdateGuidePackages={() => {}}
            onRegisterNewGuide={handleRegisterNewGuide}
          />
        )}

        {currentPersona === 'split' && (
          <SplitPaymentSimulator />
        )}

      </main>

      {/* Step 1: Customize Stay & Pair with Local Guide Modal */}
      {activeGuideAddonHotel && (
        <GuideAddonModal
          hotel={activeGuideAddonHotel}
          availableGuides={guides}
          preselectedGuide={activePreselectedGuide}
          onClose={() => setActiveGuideAddonHotel(null)}
          onProceedToCheckout={handleProceedToCheckoutFromAddon}
        />
      )}

      {/* Step 2: Unified Checkout Modal with Real-time Split Breakdown */}
      {checkoutModalData && (
        <CheckoutModal
          hotel={checkoutModalData.hotel}
          selectedRoom={checkoutModalData.selectedRoom}
          nights={checkoutModalData.nights}
          initialIncludeGuide={checkoutModalData.includeGuide}
          selectedGuide={checkoutModalData.selectedGuide}
          selectedPackage={checkoutModalData.selectedPackage}
          onClose={() => setCheckoutModalData(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* Persistent Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">TourMatch AI Ecosystem</span>
            <span>&bull;</span>
            <span>Direct Proximity & Footfall Verification</span>
            <span>&bull;</span>
            <span className="text-emerald-700 font-semibold">100% Real Footfall Check-Ins Ranked</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Powered by Razorpay Escrow Splits</span>
            <span>&bull;</span>
            <span>PostGIS Proximity Radius</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
