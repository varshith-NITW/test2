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
  affordabilityTier?: 'budget' | 'value' | 'luxury';
  appliedPromoCode?: string;
  enableMaxDiscount?: boolean;
}

/**
 * Calculates real-time multi-party split payout breakdown with Maximum Affordability Discount:
 * - Hotel Stay Direct Partner Payout
 * - Authentic Restaurant Dining Voucher
 * - Certified Local Guide Direct Fee (90% direct to guide)
 * - Platform Net Revenue & Taxes
 * - Maximum Possible Discount Engine:
 *   * Direct Hotel Partnership Markdown (bypassing 22% OTA commissions)
 *   * Restaurant Voucher Credit
 *   * Guide Community Group Escrow
 *   * Instant Platform Subsidy Promo (AFFORDABLEINDIA)
 *   * Saves up to 40% - 48% compared to MakeMyTrip / Booking.com!
 */
export function calculateSplitBreakdown({
  hotel,
  nights,
  selectedRoomPrice,
  guide,
  guidePackageType,
  customGuideFee,
  restaurantPass,
  applyWebsiteDiscount = true,
  affordabilityTier = 'budget',
  appliedPromoCode = 'AFFORDABLEINDIA',
  enableMaxDiscount = true
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

  // Big Tech OTA comparison (MakeMyTrip / Booking.com rack rate + street guide markup)
  const otaMarketPrice = Math.round(
    hotelGrossOriginal * 1.28 + 
    guideGrossOriginal * 1.25 + 
    (restaurantPass ? restaurantPass.totalWorth * 1.15 : 0)
  );

  // Super Bundle items count
  let bundleItemsCount = 1; // Hotel base
  if (guide && guidePackageType) bundleItemsCount++;
  if (restaurantPass && restaurantPass.totalCost > 0) bundleItemsCount++;

  // Base discount percent tailored to affordability tier
  let baseDiscountPercent = 20;
  if (affordabilityTier === 'budget') {
    baseDiscountPercent = bundleItemsCount >= 3 ? 35 : bundleItemsCount === 2 ? 30 : 25;
  } else if (affordabilityTier === 'value') {
    baseDiscountPercent = bundleItemsCount >= 3 ? 28 : bundleItemsCount === 2 ? 22 : 18;
  } else if (affordabilityTier === 'luxury') {
    baseDiscountPercent = bundleItemsCount >= 3 ? 22 : bundleItemsCount === 2 ? 18 : 15;
  } else {
    baseDiscountPercent = bundleItemsCount >= 3 ? 28 : bundleItemsCount === 2 ? 22 : 18;
  }

  if (enableMaxDiscount) {
    baseDiscountPercent = Math.max(baseDiscountPercent, 35);
  }

  // Promo code / direct platform subsidy
  const promoNormalized = (appliedPromoCode || '').trim().toUpperCase();
  let platformSubsidyAmount = 0;
  if (enableMaxDiscount || promoNormalized === 'AFFORDABLEINDIA' || promoNormalized === 'MAXDISCOUNT') {
    platformSubsidyAmount = Math.min(Math.round(originalTotal * 0.08), 650);
  } else if (promoNormalized === 'STUDENT500' || promoNormalized === 'EXPLORE') {
    platformSubsidyAmount = 400;
  }

  let websiteDiscountAmount = applyWebsiteDiscount
    ? Math.round(originalTotal * (baseDiscountPercent / 100)) + platformSubsidyAmount
    : 0;

  // Cap at 45% to protect partner payouts
  const maxDiscountCap = Math.round(originalTotal * 0.45);
  if (websiteDiscountAmount > maxDiscountCap) {
    websiteDiscountAmount = maxDiscountCap;
  }

  const effectiveDiscountPercent = originalTotal > 0
    ? Math.round((websiteDiscountAmount / originalTotal) * 100)
    : baseDiscountPercent;

  const totalCharged = Math.max(0, originalTotal - websiteDiscountAmount);

  // Proportional discount distribution
  const hotelDiscountShare = originalTotal > 0
    ? Math.round(websiteDiscountAmount * (hotelGrossOriginal / originalTotal))
    : 0;
  const restaurantDiscountShare = originalTotal > 0
    ? Math.round(websiteDiscountAmount * (restaurantGrossOriginal / originalTotal))
    : 0;
  const guideDiscountShare = Math.max(0, websiteDiscountAmount - hotelDiscountShare - restaurantDiscountShare);

  const travelerSavingsAmount = Math.max(0, otaMarketPrice - totalCharged);
  const travelerSavingsPercent = otaMarketPrice > 0
    ? Math.round((travelerSavingsAmount / otaMarketPrice) * 100)
    : 0;

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
    websiteDiscountPercent: effectiveDiscountPercent,
    websiteDiscountAmount,
    affordabilityTier,
    hotelDiscountAmount: hotelDiscountShare,
    restaurantDiscountAmount: restaurantDiscountShare,
    guideDiscountAmount: guideDiscountShare,
    platformSubsidyAmount,
    otaMarketPrice,
    travelerSavingsAmount,
    travelerSavingsPercent,
    appliedPromoCode: promoNormalized,
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
