import { GeoPoint, Hotel, TouristSpot, Restaurant, Guide } from '../types';

/**
 * Calculates straight-line distance in kilometers using the Haversine formula
 * (Equivalent to PostGIS ST_DistanceSphere / ST_DWithin)
 */
export function calculateHaversineDistance(pt1: GeoPoint, pt2: GeoPoint): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((pt2.lat - pt1.lat) * Math.PI) / 180;
  const dLng = ((pt2.lng - pt1.lng) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pt1.lat * Math.PI) / 180) *
      Math.cos((pt2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // 2 decimal places
}

/**
 * Estimates commute time in minutes based on distance and typical urban traffic
 */
export function estimateCommuteTime(distanceKm: number): {
  minutes: number;
  mode: 'walk' | 'auto' | 'cab';
  label: string;
} {
  if (distanceKm <= 1.0) {
    const walkMins = Math.max(2, Math.round((distanceKm / 4.5) * 60));
    return {
      minutes: walkMins,
      mode: 'walk',
      label: `${walkMins} min walk (${Math.round(distanceKm * 1000)}m)`
    };
  } else if (distanceKm <= 3.0) {
    const autoMins = Math.max(5, Math.round((distanceKm / 16) * 60));
    return {
      minutes: autoMins,
      mode: 'auto',
      label: `${autoMins} min auto (${distanceKm} km)`
    };
  } else {
    const cabMins = Math.max(10, Math.round((distanceKm / 22) * 60));
    return {
      minutes: cabMins,
      mode: 'cab',
      label: `${cabMins} min cab (${distanceKm} km)`
    };
  }
}

/**
 * Filters and annotates hotels within radius (PostGIS ST_DWithin equivalent)
 */
export function filterHotelsByRadius(
  spot: TouristSpot,
  hotels: Hotel[],
  radiusKm: number = 8.0
): Array<{ hotel: Hotel; distanceKm: number; commute: ReturnType<typeof estimateCommuteTime> }> {
  const spotCity = (spot.city || '').toLowerCase().trim();

  return hotels
    .filter((hotel) => {
      const hotelCity = (hotel.city || '').toLowerCase().trim();
      const hotelAddr = (hotel.address || '').toLowerCase();
      
      // Strict Cross-City Rejection: Never show properties from completely unrelated cities
      if (spotCity && hotelCity && spotCity !== hotelCity) {
        const isMatch = spotCity.includes(hotelCity) || hotelCity.includes(spotCity);
        if (!isMatch) {
          const knownCities = [
            'surat', 'lucknow', 'hyderabad', 'delhi', 'goa', 'jaipur', 
            'mumbai', 'bengaluru', 'kolkata', 'chennai', 'kochi', 'agra', 
            'varanasi', 'london', 'paris', 'tokyo', 'new york', 'dubai', 'rome'
          ];
          for (const kc of knownCities) {
            if ((hotelCity.includes(kc) || hotelAddr.includes(kc)) && !spotCity.includes(kc)) {
              return false;
            }
          }
        }
      }
      return true;
    })
    .map((hotel) => {
      const distanceKm = calculateHaversineDistance(spot.location, hotel.location);
      return {
        hotel: { ...hotel, distanceKm },
        distanceKm,
        commute: estimateCommuteTime(distanceKm)
      };
    })
    .filter((item) => item.distanceKm <= radiusKm)
    .sort((a, b) => b.hotel.checkinCount - a.hotel.checkinCount); // Ranked strictly by checkin footfall
}

/**
 * Filters and annotates restaurants within radius of the selected tourist spot
 */
export function filterRestaurantsByRadius(
  spot: TouristSpot,
  restaurants: Restaurant[],
  radiusKm: number = 8.0
): Array<{ restaurant: Restaurant; distanceKm: number; commute: ReturnType<typeof estimateCommuteTime> }> {
  const spotCity = (spot.city || '').toLowerCase().trim();

  return restaurants
    .filter((rest) => {
      const restCity = (rest.city || '').toLowerCase().trim();
      const restAddr = (rest.address || '').toLowerCase();
      
      if (spotCity && restCity && spotCity !== restCity) {
        const isMatch = spotCity.includes(restCity) || restCity.includes(spotCity);
        if (!isMatch) {
          const knownCities = [
            'surat', 'lucknow', 'hyderabad', 'delhi', 'goa', 'jaipur', 
            'mumbai', 'bengaluru', 'kolkata', 'chennai', 'kochi', 'agra', 
            'varanasi', 'london', 'paris', 'tokyo', 'new york', 'dubai', 'rome'
          ];
          for (const kc of knownCities) {
            if ((restCity.includes(kc) || restAddr.includes(kc)) && !spotCity.includes(kc)) {
              return false;
            }
          }
        }
      }
      return true;
    })
    .map((rest) => {
      const distanceKm = calculateHaversineDistance(spot.location, rest.location);
      return {
        restaurant: { ...rest, distanceKm },
        distanceKm,
        commute: estimateCommuteTime(distanceKm)
      };
    })
    .filter((item) => item.distanceKm <= radiusKm)
    .sort((a, b) => b.restaurant.checkinCount - a.restaurant.checkinCount); // Ranked strictly by checkin footfall
}

/**
 * Matches certified local guides within proximity or affiliated with nearby hotels
 */
export function filterGuidesByProximity(
  spot: TouristSpot,
  guides: Guide[],
  nearbyHotels: Hotel[]
): Array<{ guide: Guide; distanceKm: number; affiliatedWithNearbyHotel: boolean }> {
  const nearbyHotelIds = new Set(nearbyHotels.map(h => h.id));
  const spotCity = (spot.city || '').toLowerCase().trim();

  // Prioritize certified guides belonging to the selected spot's city or affiliated hotels
  const cityMatchingGuides = guides.filter(g => {
    const bio = g.bio.toLowerCase();
    const verif = g.verificationId.toLowerCase();
    const name = g.name.toLowerCase();
    const isAffiliated = g.affiliatedHotelId ? nearbyHotelIds.has(g.affiliatedHotelId) : false;
    
    if (isAffiliated) return true;
    if (spotCity) {
      if (bio.includes(spotCity) || verif.includes(spotCity.slice(0, 3)) || name.includes(spotCity)) {
        return true;
      }
    }
    return false;
  });

  // Only fallback if no matching guides AND guide doesn't mention conflicting cities
  const candidates = cityMatchingGuides.length > 0 
    ? cityMatchingGuides 
    : guides.filter(g => {
        const bio = g.bio.toLowerCase();
        const otherCities = ['surat', 'hyderabad', 'lucknow', 'delhi', 'jaipur', 'agra'];
        return !otherCities.some(oc => bio.includes(oc) && !spotCity.includes(oc));
      });
  
  return (candidates.length > 0 ? candidates : guides).map((guide, idx) => {
    const isAffiliated = guide.affiliatedHotelId ? nearbyHotelIds.has(guide.affiliatedHotelId) : false;
    const baseDist = isAffiliated ? 0.6 : (idx * 0.9 + 0.4);
    const distanceKm = Math.round(baseDist * 10) / 10;
    
    return {
      guide: { ...guide, distanceKm },
      distanceKm,
      affiliatedWithNearbyHotel: isAffiliated
    };
  }).sort((a, b) => b.guide.completedToursCount - a.guide.completedToursCount);
}

/**
 * Builds a Google Maps Directions URL
 */
export function getGoogleMapsDirectionsUrl(origin: GeoPoint, destination: GeoPoint, destName?: string): string {
  const originParam = `${origin.lat},${origin.lng}`;
  const destParam = `${destination.lat},${destination.lng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destParam}${destName ? `&destination_place_id=${encodeURIComponent(destName)}` : ''}`;
}
