import { Hotel, Guide, SplitBreakdown, GuidePackageType, RestaurantPassSelection } from '../types';

export interface SplitCalculationParams {
  hotel: Hotel;
  nights: number;
  selectedRoomPrice: number;
  guide?: Guide | null;
  guidePackageType?: GuidePackageType | null;
  customGuideFee?: number;
  restaurantPass?: RestaurantPassSelection | null;
  applyWebsiteDiscount?: boolean;
}

/**
 * Calculates real-time multi-party split payout breakdown with Direct Website Discount:
 * - Hotel Stay Payout
 * - Authentic Restaurant Dining Voucher
 * - Certified Local Guide Direct Fee (90% direct to guide)
 * - Platform Net Revenue & Taxes
 * - Exclusive Website Booking Discount: Flat 15% single, 20% for 2 bundled, 25% for complete 3-in-1 ecosystem!
 */
export function calculateSplitBreakdown({
  hotel,
  nights,
  selectedRoomPrice,
  guide,
  guidePackageType,
  customGuideFee,
  restaurantPass,
  applyWebsiteDiscount = true
}: SplitCalculationParams): SplitBreakdown {
  const hotelGrossOriginal = selectedRoomPrice * Math.max(1, nights);

  let guideGrossOriginal = 0;
  if (guide && guidePackageType) {
    if (customGuideFee && customGuideFee > 0) {
      guideGrossOriginal = customGuideFee;
    } else {
      switch (guidePackageType) {
        case 'quick_walk':
          guideGrossOriginal = guide.hourlyRate * 2;
          break;
        case 'half_day':
          guideGrossOriginal = guide.halfDayRate;
          break;
        case 'full_day':
          guideGrossOriginal = guide.fullDayRate;
          break;
        case 'photography_walk':
          guideGrossOriginal = guide.photoWalkRate;
          break;
        default:
          guideGrossOriginal = guide.halfDayRate;
      }
    }
  }

  const restaurantGrossOriginal = restaurantPass ? restaurantPass.totalCost : 0;

  const originalTotal = hotelGrossOriginal + guideGrossOriginal + restaurantGrossOriginal;

  // Super Bundle Discount Calculation:
  // 1 item = 15%, 2 items = 20%, 3 items (Hotel + Restaurant + Guide) = 25% Super Discount
  let bundleItemsCount = 1; // Hotel is base
  if (guide && guidePackageType) bundleItemsCount++;
  if (restaurantPass && restaurantPass.totalCost > 0) bundleItemsCount++;

  let websiteDiscountPercent = 15;
  if (bundleItemsCount === 2) websiteDiscountPercent = 20;
  if (bundleItemsCount >= 3) websiteDiscountPercent = 25;

  const websiteDiscountAmount = applyWebsiteDiscount
    ? Math.round(originalTotal * (websiteDiscountPercent / 100))
    : 0;

  const totalCharged = Math.max(0, originalTotal - websiteDiscountAmount);

  // Proportional discount distribution
  const hotelDiscountShare = originalTotal > 0
    ? Math.round(websiteDiscountAmount * (hotelGrossOriginal / originalTotal))
    : 0;
  const restaurantDiscountShare = originalTotal > 0
    ? Math.round(websiteDiscountAmount * (restaurantGrossOriginal / originalTotal))
    : 0;
  const guideDiscountShare = Math.max(0, websiteDiscountAmount - hotelDiscountShare - restaurantDiscountShare);

  // Hotel Split
  const hotelGross = Math.max(0, hotelGrossOriginal - hotelDiscountShare);
  const hotelCommissionRate = hotel.commissionRate || 0.15;
  const hotelPlatformCut = Math.round(hotelGross * hotelCommissionRate);
  const hotelNet = hotelGross - hotelPlatformCut;

  // Restaurant Split (10% platform, 90% direct to restaurant partner)
  const restaurantGross = Math.max(0, restaurantGrossOriginal - restaurantDiscountShare);
  const restaurantPlatformCut = Math.round(restaurantGross * 0.10);
  const restaurantNet = restaurantGross - restaurantPlatformCut;

  // Guide Split (10% platform, 5% hotel kickback, 85-90% direct to guide)
  let guideGross = 0;
  let guidePlatformCut = 0;
  let hotelReferralKickback = 0;
  let guideNet = 0;

  if (guide && guidePackageType) {
    guideGross = Math.max(0, guideGrossOriginal - guideDiscountShare);
    const GUIDE_PLATFORM_FEE_RATE = 0.10;
    guidePlatformCut = Math.round(guideGross * GUIDE_PLATFORM_FEE_RATE);

    const referralRate = hotel.guideReferralKickbackPercent ? hotel.guideReferralKickbackPercent / 100 : 0.05;
    hotelReferralKickback = Math.round(guideGross * referralRate);

    guideNet = guideGross - guidePlatformCut - hotelReferralKickback;
  }

  const platformNetRevenue = hotelPlatformCut + guidePlatformCut + restaurantPlatformCut;

  return {
    totalCharged,
    originalTotal,
    websiteDiscountPercent,
    websiteDiscountAmount,
    hotelGross,
    hotelGrossOriginal,
    hotelPlatformCut,
    hotelNet,
    guideGross,
    guideGrossOriginal,
    guidePlatformCut,
    hotelReferralKickback,
    guideNet,
    restaurantGross,
    restaurantGrossOriginal,
    restaurantPlatformCut,
    restaurantNet,
    platformNetRevenue
  };
}
