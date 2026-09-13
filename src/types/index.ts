export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface TouristSpot {
  id: string;
  name: string;
  city: string;
  location: GeoPoint;
  description: string;
  tags: string[];
  openingHours: string;
  image: string;
  googlePlaceId: string;
  googleMapsUrl: string;
  monthlyCheckins: number;
  checkinTrend: 'surging' | 'high' | 'steady';
  bestTimeToVisit: string;
  catchyLine?: string;
  bestPic?: string;
  culturalTips?: string[];
  foodMustEats?: { name: string; spot: string; tip: string }[];
  survivalPhrases?: { phrase: string; translation: string; pronunciation: string; context: string }[];
  commuteTips?: { autoFare: string; metroAvailable: boolean; localAdvice: string };
}

export interface RoomType {
  id: string;
  name: string;
  pricePerNight: number;
  capacity: number;
  description: string;
  perks: string[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  location: GeoPoint;
  tier: 'Heritage Luxury' | 'Boutique Stay' | 'Urban Comfort' | 'Cultural Retreat';
  pricePerNight: number;
  commissionRate: number; // e.g. 0.15 = 15% platform commission
  status: 'verified' | 'pending';
  allowsIndependentGuides: boolean;
  perks: string[];
  roomTypes: RoomType[];
  inHouseGuideIds?: string[];
  amenities: string[];
  // Google Maps Check-In Driven Metrics (Strict non-rating model)
  checkinCount: number; // Google Maps place check-ins count
  weeklyCheckins: number; // Live weekly visitor check-in velocity
  googlePlaceId: string;
  googleMapsUrl: string;
  footfallRank: number; // #1, #2 based on local check-in density
  image: string;
  businessRegNumber: string; // GST / Tourism License ID
  partnershipModel: 'in_house_guides' | 'community_pool' | 'hybrid';
  guideReferralKickbackPercent: number; // typically 5% to 8%
  distanceKm?: number;
  // Hotel Partner Portal Authentication & Direct Program Fields
  managerName?: string;
  managerEmail?: string;
  managerPhone?: string;
  password?: string;
  joinedDirectProgram?: boolean;
  programDiscountPercent?: number;
  allowsGuideBundling?: boolean;
}

export interface DishItem {
  name: string;
  price: number;
  description: string;
  isVeg: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  address: string;
  location: GeoPoint;
  cuisine: string[];
  checkinCount: number; // Real physical diner check-in footfall
  weeklyCheckins: number;
  footfallRank: number;
  priceForTwo: number;
  status: 'verified' | 'pending';
  famousDishes: DishItem[];
  diningVoucherDiscountPercent: number; // e.g. 15% off voucher
  diningVoucherPrice: number; // e.g. ₹500 voucher credit priced at ₹425
  image: string;
  googleMapsUrl: string;
  distanceKm?: number;
  openingHours: string;
  seatingCapacity: number;
  tags: string[];
}

export type GuidePackageType = 'quick_walk' | 'half_day' | 'full_day' | 'photography_walk';

export interface GuidePackageOption {
  type: GuidePackageType;
  title: string;
  duration: string;
  price: number;
  description: string;
}

export interface Guide {
  id: string;
  name: string;
  languages: string[];
  hourlyRate: number;
  halfDayRate: number;
  fullDayRate: number;
  photoWalkRate: number;
  verificationId: string; // Tourism Dept Badge / License
  completedToursCount: number; // Verified completed tours
  bio: string;
  specialties: string[];
  affiliatedHotelId: string | null; // null if part of community pool
  avatar: string;
  badgeVerified: boolean;
  phone: string;
  distanceKm?: number;
  // Local Guide Authentication & Credentials
  email?: string;
  password?: string;
  location?: string;
  tourismDeptId?: string;
}

export interface HotelGuidePartnership {
  id: string;
  hotelId: string;
  guideId: string;
  revSharePercent: number;
  status: 'active' | 'pending';
}

export interface RestaurantPassSelection {
  restaurant: Restaurant;
  voucherQuantity: number;
  unitVoucherWorth: number; // e.g. ₹500 food worth
  unitPricePaid: number;    // e.g. ₹425 paid
  totalWorth: number;
  totalCost: number;
}

export interface SplitBreakdown {
  totalCharged: number;
  originalTotal?: number;
  websiteDiscountPercent?: number;
  websiteDiscountAmount?: number;
  // Maximum Affordability & Discount Engine
  affordabilityTier?: 'budget' | 'value' | 'luxury';
  hotelDiscountAmount?: number;
  restaurantDiscountAmount?: number;
  guideDiscountAmount?: number;
  platformSubsidyAmount?: number;
  otaMarketPrice?: number;
  travelerSavingsAmount?: number;
  travelerSavingsPercent?: number;
  appliedPromoCode?: string;
  // Hotel split
  hotelGross: number;
  hotelGrossOriginal?: number;
  hotelPlatformCut: number;
  hotelNet: number;
  // Guide split
  guideGross: number;
  guideGrossOriginal?: number;
  guidePlatformCut: number;
  hotelReferralKickback: number;
  hotelGuideReferral?: number;
  guideNet: number;
  // Restaurant split
  restaurantGross: number;
  restaurantGrossOriginal?: number;
  restaurantPlatformCut: number;
  restaurantNet: number;
  // Platform net
  platformNetRevenue: number;
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  hotelName: string;
  roomTypeId: string;
  roomTypeName: string;
  dates: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  guests: number;
  // Guide
  guideId: string | null;
  guideName: string | null;
  guidePackageType: GuidePackageType | null;
  guidePackageTitle: string | null;
  // Restaurant
  restaurantId?: string | null;
  restaurantName?: string | null;
  restaurantPassAmount?: number;
  // Totals & Razorpay
  totalAmount: number;
  originalAmount?: number;
  websiteDiscountAmount?: number;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  paymentMethod?: string;
  splitBreakdown: SplitBreakdown;
  status: 'confirmed' | 'pending';
  createdAt: string;
  meetingPointInfo?: string;
  touristSpotName?: string;
  // Traveler Contact Details (Transferred to Hotel & Restaurant; Password is NEVER included)
  travelerName?: string;
  travelerEmail?: string;
  travelerPhone?: string;
  travelerLocation?: string;
}

export interface AIQueryFilters {
  targetLandmarkId: string;
  maxBudgetPerNight: number;
  needsGuide: boolean;
  preferredLanguage: string;
  stayStyle: 'heritage' | 'foodie' | 'family' | 'luxury' | 'budget' | 'all';
  searchQuery?: string;
}

export interface HotelRecommendation {
  hotel: Hotel;
  distanceKm: number;
  commuteMinutes: number;
  checkinScore: number;
  rationale: string;
  matchedGuide?: Guide;
}

export interface AIRecommendationResponse {
  queryParsed: {
    landmarkName: string;
    maxBudget: number;
    needsGuide: boolean;
    preferredLanguage: string;
    travelVibe: string;
  };
  targetSpot: TouristSpot;
  recommendedHotels: HotelRecommendation[];
  customItinerary: {
    day: number;
    title: string;
    activities: string[];
    localTip: string;
  }[];
}

export type StepLayer = 'step1_spots' | 'step2_proximity' | 'step3_summary' | 'step4_payment';

// Authentication & User Profile Types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  location: string;
  createdAt?: string;
}

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  location: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
