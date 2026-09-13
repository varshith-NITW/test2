import React, { useState, useEffect } from 'react';
import { PersonaType, Navbar } from './components/Navbar';
import { TouristSpot, Hotel, Guide, Restaurant, Booking, RoomType, GuidePackageType, UserProfile } from './types';
import { INITIAL_TOURIST_SPOTS, INITIAL_HOTELS, INITIAL_GUIDES, INITIAL_RESTAURANTS } from './data/mockData';
import { TravelerHome } from './components/traveler/TravelerHome';
import { GuideAddonModal } from './components/traveler/GuideAddonModal';
import { CheckoutModal } from './components/traveler/CheckoutModal';
import { HotelPartnerPortal } from './components/hotel/HotelPartnerPortal';
import { LocalGuidePortal } from './components/guide/LocalGuidePortal';
import { AuthModal } from './components/auth/AuthModal';
import { getCurrentUser, logOut } from './services/authService';
import { saveBookingToCloud, subscribeToCloudBookings } from './services/cloudStorageService';
import { calculateSplitBreakdown } from './services/paymentSplitService';
import { createBookingViaNodeAPI } from './services/apiClient';
import { loadGoogleMapsScript } from './services/googleMapsService';

export function App() {
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('traveler');
  
  // Traveler Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; tab: 'login' | 'signup' }>({
    isOpen: false,
    tab: 'login'
  });

  // Load Google Maps API script on application mount
  useEffect(() => {
    loadGoogleMapsScript().catch((e) => {
      console.warn('Google Maps script load note:', e);
    });
  }, []);

  // Real-time Cloud Storage (Firestore) Live Booking Listener
  useEffect(() => {
    const unsubscribe = subscribeToCloudBookings((cloudBookings) => {
      if (cloudBookings && cloudBookings.length > 0) {
        setBookings((prev) => {
          const merged = [...prev];
          cloudBookings.forEach((cb) => {
            const idx = merged.findIndex((b) => b.id === cb.id);
            if (idx >= 0) {
              merged[idx] = cb;
            } else {
              merged.unshift(cb);
            }
          });
          return merged;
        });
      }
    });
    return () => unsubscribe();
  }, []);

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
      // Traveler Details (Safely dispatched to Hotel Reception & Restaurant Concierge; NO password)
      travelerName: 'Varshith Sharma',
      travelerEmail: 'varshith@example.com',
      travelerPhone: '+91 98490 12345',
      travelerLocation: 'Surat, Gujarat',
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

    // 1. Persist directly to Google Cloud Firestore
    saveBookingToCloud(newBooking).catch((err) => {
      console.info('Cloud Firestore sync note:', err.message);
    });

    // 2. Asynchronously synchronize booking record with backend Node.js API Gateway
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
      websiteDiscountAmount: newBooking.websiteDiscountAmount,
      // Pass safe traveler details (strictly excluding sensitive credentials)
      travelerName: newBooking.travelerName || currentUser?.username || 'Varshith Sharma',
      travelerEmail: newBooking.travelerEmail || currentUser?.email || 'varshith@example.com',
      travelerPhone: newBooking.travelerPhone || currentUser?.phoneNumber || '+91 98490 12345',
      travelerLocation: newBooking.travelerLocation || currentUser?.location || 'Surat, Gujarat'
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
        currentUser={currentUser}
        onOpenAuth={(tab) => setAuthModalState({ isOpen: true, tab: tab || 'login' })}
        onSignOut={() => {
          logOut();
          setCurrentUser(null);
        }}
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
            currentUser={currentUser}
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

      {/* Traveler Authentication Modal (Sign Up with 5 terms / Sign In with 2 terms) */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialTab={authModalState.tab}
        onClose={() => setAuthModalState(prev => ({ ...prev, isOpen: false }))}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* Persistent Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">TravelAI Ecosystem</span>
            <span>&bull;</span>
            <span className="text-sky-700 font-semibold flex items-center gap-1">
              ☁️ Google Cloud Firestore Storage (Live Serverless Sync)
            </span>
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
