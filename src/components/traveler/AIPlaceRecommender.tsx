import React, { useState, useEffect } from 'react';
import { TouristSpot, Hotel, Restaurant } from '../../types';
import { 
  Sparkles, 
  MapPin, 
  Flame, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Compass, 
  Bot, 
  ExternalLink, 
  Building2, 
  Utensils, 
  Calendar, 
  Users, 
  Wallet,
  CheckCircle2,
  Check
} from 'lucide-react';
import { 
  askGeminiTouristRecommendations, 
  GeminiTouristRecommendation,
  fetchGeminiDestinations,
  fetchGeminiHospitality,
  convertGeminiDestinationToSpot,
  convertHospitalityHotelsToHotels,
  convertHospitalityRestaurantsToRestaurants,
  GeminiRecommendedDestination,
  GeminiHospitalityResult
} from '../../services/geminiService';

interface AIPlaceRecommenderProps {
  spots: TouristSpot[];
  selectedSpotId: string;
  aiPrompt: string;
  geminiResult: GeminiTouristRecommendation | null;
  onAiPromptChange: (prompt: string) => void;
  onGeminiResultChange: (result: GeminiTouristRecommendation | null) => void;
  onSelectSpot: (spot: TouristSpot, searchedPlaceName?: string) => void;
  onProceedToProximity: () => void;
  onAddHospitalityInventory?: (hotels: Hotel[], restaurants: Restaurant[]) => void;
}

export const AIPlaceRecommender: React.FC<AIPlaceRecommenderProps> = ({
  spots,
  selectedSpotId,
  aiPrompt,
  geminiResult,
  onAiPromptChange,
  onGeminiResultChange,
  onSelectSpot,
  onProceedToProximity,
  onAddHospitalityInventory
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [isGeminiThinking, setIsGeminiThinking] = useState<boolean>(false);

  // Gemini 2-Step Workflow States (from Gemini Share Integration)
  const [budgetTier, setBudgetTier] = useState<string>('Moderate');
  const [durationDays, setDurationDays] = useState<number>(4);
  const [companions, setCompanions] = useState<string>('Solo');

  // Step 1: Gemini Recommended Destinations
  const [geminiDestinations, setGeminiDestinations] = useState<GeminiRecommendedDestination[]>([]);
  const [selectedDestinationName, setSelectedDestinationName] = useState<string>('');

  // Step 2: Gemini Recommended Hospitality (Hotels & Restaurants)
  const [hospitalityData, setHospitalityData] = useState<GeminiHospitalityResult | null>(null);
  const [isLoadingHospitality, setIsLoadingHospitality] = useState<boolean>(false);

  const popularDestinations = [
    { name: 'Kochi', icon: '🌴', subtitle: 'Fort Kochi & Backwaters' },
    { name: 'Lucknow', icon: '🏛️', subtitle: 'Bara Imambara & Nawabi' },
    { name: 'Delhi', icon: '🕌', subtitle: 'Qutub Minar & Red Fort' },
    { name: 'Goa', icon: '🏖️', subtitle: 'Calangute & Aguada' },
    { name: 'Jaipur', icon: '👑', subtitle: 'Hawa Mahal & Amber Fort' },
    { name: 'Varanasi', icon: '🛕', subtitle: 'Ganga Ghats & Kashi' },
    { name: 'Hyderabad', icon: '🏰', subtitle: 'Charminar & Golconda' },
    { name: 'Agra', icon: '🤍', subtitle: 'Taj Mahal & Fort' }
  ];

  const suggestionChips = [
    { label: '🌴 Kochi & Kerala Backwaters', query: 'I want calm scenic backwaters and beach lagoons with seafood' },
    { label: '🏛️ Lucknow Nawabi Heritage', query: 'I love 18th-century architecture, labyrinth corridors and melt-in-mouth kebabs' },
    { label: '🕌 Delhi Imperial Trail', query: 'Historic UNESCO minarets, grand forts and bustling food streets' },
    { label: '🏖️ Goa Coastal Escape', query: 'Relaxed beaches with sunset shacks, Portuguese villas and fresh seafood' },
    { label: '👑 Jaipur Pink City', query: 'Majestic hilltop forts with mirror palaces and vibrant handicraft bazaars' },
    { label: '🛕 Varanasi Sacred Ghats', query: 'Spiritual riverfront ghats with evening oil lamp aarti and morning classical music' }
  ];

  // Fetch hospitality (hotels & restaurants) for a selected destination
  const fetchAndApplyHospitality = async (destName: string, spot: TouristSpot) => {
    setIsLoadingHospitality(true);
    setSelectedDestinationName(destName);
    try {
      const data = await fetchGeminiHospitality({
        destinationName: destName,
        userBudget: budgetTier,
        foodPreferences: 'Local cuisines and popular dining'
      });
      setHospitalityData(data);

      if (onAddHospitalityInventory && data.hotels.length > 0) {
        const platformHotels = convertHospitalityHotelsToHotels(data.hotels, spot);
        const platformRestaurants = convertHospitalityRestaurantsToRestaurants(data.restaurants, spot);
        onAddHospitalityInventory(platformHotels, platformRestaurants);
      }
    } catch (err) {
      console.warn('Error fetching hospitality recommendations:', err);
    } finally {
      setIsLoadingHospitality(false);
    }
  };

  // Main 2-Step Gemini Search Handler
  const handleFindPlaces = async (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : aiPrompt).trim();
    if (!q) {
      onGeminiResultChange(null);
      setGeminiDestinations([]);
      setHospitalityData(null);
      setIsGeminiThinking(false);
      return;
    }

    setIsGeminiThinking(true);
    setSelectedCity('All');
    setHospitalityData(null);

    try {
      // 1. Call Gemini structured API endpoint (/api/recommend-places)
      const placesPromise = fetchGeminiDestinations({
        preferences: q,
        budget: budgetTier,
        days: durationDays,
        companions
      });

      // 2. Call local footfall engine in parallel
      const footfallPromise = askGeminiTouristRecommendations(q, spots);

      const [destResult, footfallResult] = await Promise.all([placesPromise, footfallPromise]);

      setGeminiDestinations(destResult.destinations);
      onGeminiResultChange(footfallResult);

      // Automatically select the first destination and fetch its hotels & restaurants
      if (destResult.destinations.length > 0) {
        const topDest = destResult.destinations[0];
        const spot = convertGeminiDestinationToSpot(topDest, 0);
        onSelectSpot(spot, topDest.name);
        fetchAndApplyHospitality(topDest.name, spot);
      } else if (footfallResult.matchedSpots.length > 0) {
        const topSpot = footfallResult.matchedSpots[0];
        const placeName = footfallResult.destinationName || q;
        onSelectSpot(topSpot, placeName);
        fetchAndApplyHospitality(placeName, topSpot);
      }
    } catch (err) {
      console.warn('Gemini query error:', err);
    } finally {
      setIsGeminiThinking(false);
    }
  };

  const handleChipClick = (query: string) => {
    onAiPromptChange(query);
    handleFindPlaces(query);
  };

  const handleSelectDestinationCard = (dest: GeminiRecommendedDestination, idx: number) => {
    const spot = convertGeminiDestinationToSpot(dest, idx);
    onSelectSpot(spot, dest.name);
    fetchAndApplyHospitality(dest.name, spot);
  };

  // Determine spots to display
  const displaySpots = (geminiResult && geminiResult.matchedSpots && geminiResult.matchedSpots.length > 0)
    ? geminiResult.matchedSpots.filter(spot => {
        if (selectedCity !== 'All' && spot.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
        return true;
      })
    : [];

  return (
    <div className="space-y-8">
      
      {/* Gemini AI Header & Input Section */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-indigo-900/50">
        
        {/* Glowing background orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          
          {/* Badge */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-extrabold shadow-sm">
              <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Powered by Google Gemini 2.5 Flash &bull; Real Check-In Footfall Engine</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Where would you like to go?
          </h1>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Share your travel preferences, budget, and companion plans. Google Gemini evaluates authentic check-ins to recommend top tourist destinations, then curates the best hotels and local dining.
          </p>

          {/* Gemini AI Multi-line Prompt & Opinion Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleFindPlaces();
            }}
            className="space-y-4"
          >
            <div className="relative">
              <textarea
                id="prefs"
                rows={3}
                value={aiPrompt}
                onChange={(e) => onAiPromptChange(e.target.value)}
                placeholder="e.g., I want calm, scenic mountain places with lakes, moderate budget for 4 days..."
                className="w-full p-4 bg-white/10 hover:bg-white/15 focus:bg-slate-900 text-white placeholder:text-slate-400 rounded-2xl border border-indigo-400/30 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 text-sm backdrop-blur-md transition-all shadow-inner resize-none"
              />
              {aiPrompt && (
                <button
                  type="button"
                  onClick={() => {
                    onAiPromptChange('');
                    onGeminiResultChange(null);
                    setGeminiDestinations([]);
                    setHospitalityData(null);
                  }}
                  className="absolute right-3 bottom-3 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-md bg-white/10 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Travel Parameters (Budget, Duration, Companions) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Budget */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-1.5">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Budget:</span>
                </div>
                <div className="flex gap-1">
                  {(['Budget', 'Moderate', 'Luxury'] as const).map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudgetTier(b)}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all ${
                        budgetTier === b 
                          ? 'bg-emerald-500 text-white shadow-sm' 
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>Duration:</span>
                </div>
                <div className="flex gap-1">
                  {[2, 3, 4, 7].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDurationDays(d)}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all ${
                        durationDays === d 
                          ? 'bg-sky-500 text-white shadow-sm' 
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Companions */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Traveling With:</span>
                </div>
                <div className="flex gap-1">
                  {(['Solo', 'Couple', 'Family', 'Friends'] as const).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCompanions(c)}
                      className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        companions === c 
                          ? 'bg-indigo-500 text-white shadow-sm' 
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Find Places Button */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isGeminiThinking}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-60"
              >
                {isGeminiThinking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Gemini is Finding Places...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Find Places with Gemini</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Prompts Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <span className="text-xs text-slate-400 font-medium">Quick Prompts:</span>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip.query)}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Thinking State */}
      {isGeminiThinking && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center border border-indigo-800/60 shadow-xl space-y-3">
          <div className="w-9 h-9 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto text-indigo-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            Gemini 2.5 Flash is analyzing your preferences: &ldquo;{aiPrompt}&rdquo;...
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Structuring destinations with verified check-ins &bull; Curating hotels and local dining
          </p>
        </div>
      )}

      {/* Initial Empty State (before user searches) */}
      {!isGeminiThinking && !geminiResult && geminiDestinations.length === 0 && (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <Compass className="w-7 h-7" />
          </div>
          <div className="max-w-lg mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Describe Your Ideal Trip Above to Start
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
              Tell Gemini your travel opinion or click a popular destination below. Gemini will recommend top places and curates hotels and restaurants once a place is chosen.
            </p>
          </div>

          {/* Quick Popular Destination Badges */}
          <div className="pt-2">
            <div className="text-xs text-slate-400 font-semibold mb-3">Popular Destinations (Click to explore):</div>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {popularDestinations.map((dest, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(dest.name)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-900/50 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 hover:border-indigo-500 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02]"
                >
                  <span>{dest.icon}</span>
                  <span>{dest.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Gemini Recommended Destinations Grid */}
      {!isGeminiThinking && geminiDestinations.length > 0 && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/60 shadow-xl space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-900/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>Step 1: Select a Destination</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Gemini 2.5 Flash
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  Recommended based on your preferences &bull; Ranked by verified check-in footfalls
                </p>
              </div>
            </div>

            <span className="text-xs text-emerald-400 font-bold self-start sm:self-auto bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/40">
              {geminiDestinations.length} Tailored Options
            </span>
          </div>

          {/* Destinations Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {geminiDestinations.map((dest, idx) => {
              const isSelected = selectedDestinationName.toLowerCase().includes(dest.name.toLowerCase()) ||
                dest.name.toLowerCase().includes(selectedDestinationName.toLowerCase());

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-950/50 border-emerald-400 ring-2 ring-emerald-400/60 shadow-lg'
                      : 'bg-slate-800/80 border-slate-700/80 hover:border-indigo-400'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-base font-bold text-white">{dest.name}</h4>
                        <span className="text-xs text-indigo-300 font-medium">{dest.stateOrCountry}</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        #{idx + 1}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {dest.shortDescription}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1.5 mb-3">
                      <div className="text-[11px] font-semibold text-slate-400">Highlights:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {dest.highlights.map((h, hIdx) => (
                          <span
                            key={hIdx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-200 border border-indigo-800/50 font-medium"
                          >
                            &bull; {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Best Time */}
                    {dest.bestTimeToVisit && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium mb-3">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Best time: {dest.bestTimeToVisit}</span>
                      </div>
                    )}
                  </div>

                  {/* Select Destination Button */}
                  <div className="pt-3 border-t border-slate-700/60">
                    <button
                      type="button"
                      onClick={() => handleSelectDestinationCard(dest, idx)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                          <span>Selected Destination</span>
                        </>
                      ) : (
                        <>
                          <span>Select {dest.name.split('&')[0].trim()}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* STEP 2: Gemini Recommended Hospitality (Hotels & Restaurants) */}
      {isLoadingHospitality && (
        <div className="bg-slate-900 text-white rounded-3xl p-8 text-center border border-indigo-900 shadow-xl space-y-2">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto text-emerald-400" />
          <h4 className="text-sm font-bold text-white">
            Gemini is finding top stays &amp; dining for &ldquo;{selectedDestinationName}&rdquo;...
          </h4>
          <p className="text-xs text-slate-400">
            Querying /api/recommend-hospitality with structured JSON schema
          </p>
        </div>
      )}

      {!isLoadingHospitality && hospitalityData && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/50 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step 2: Recommended Stays &amp; Dining</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                Recommendations for {hospitalityData.destinationName}
              </h3>
            </div>

            <button
              type="button"
              onClick={onProceedToProximity}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer self-start sm:self-auto"
            >
              <span>Explore in Proximity Radar (Step 2)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recommended Hotels */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Recommended Hotels ({hospitalityData.hotels.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {hospitalityData.hotels.map((h, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-white">{h.name}</h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 shrink-0">
                      {h.category}
                    </span>
                  </div>

                  <div className="text-xs font-extrabold text-emerald-400">
                    {h.priceRange}
                  </div>

                  <div className="text-[11px] text-slate-300">
                    <strong className="text-slate-400">Area:</strong> {h.locationArea}
                  </div>

                  {h.features && h.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {h.features.slice(0, 3).map((f, fIdx) => (
                        <span key={fIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-700/60 text-slate-300">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Restaurants & Cafes */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Recommended Restaurants &amp; Cafes ({hospitalityData.restaurants.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {hospitalityData.restaurants.map((r, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-white">{r.name}</h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                      {r.cuisineType.split('&')[0].trim()}
                    </span>
                  </div>

                  {r.mustTryDishes && r.mustTryDishes.length > 0 && (
                    <div className="text-[11px] text-slate-300">
                      <strong className="text-amber-300">Must try:</strong> {r.mustTryDishes.join(', ')}
                    </div>
                  )}

                  {r.atmosphere && (
                    <div className="text-[11px] text-slate-400 italic line-clamp-2">
                      &ldquo;{r.atmosphere}&rdquo;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Hotels and restaurants are synced with Proximity Radar &amp; Smart Split Checkout.</span>
            </div>

            <button
              type="button"
              onClick={onProceedToProximity}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Proceed to Proximity Radar &bull; Step 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Classic Footfalls Places Grid (when searching specific spots) */}
      {!isGeminiThinking && geminiResult && displaySpots.length > 0 && geminiDestinations.length === 0 && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-indigo-800/60 shadow-xl space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-900/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>Google Gemini Travel Intelligence</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Inference
                  </span>
                </h3>
                <span className="text-xs text-indigo-300">
                  Query: &ldquo;{geminiResult.query}&rdquo;
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] font-mono text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg">
                Model: {geminiResult.model}
              </span>
            </div>
          </div>

          {/* Gemini AI Reasoning Content */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p className="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-900/40 text-slate-100 font-medium">
              ✨ <strong className="text-indigo-300">Gemini Analysis:</strong> {geminiResult.geminiReasoning}
            </p>

            {/* Places Grid */}
            <div className="pt-3 border-t border-indigo-900/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Destinations (Ranked by Check-in Footfalls):</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Zero Star-Rating Bias &bull; Real Footfalls
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {displaySpots.map((spot, idx) => {
                  const isSelected = spot.id === selectedSpotId;

                  return (
                    <div
                      key={spot.id}
                      onClick={() => {
                        onSelectSpot(spot, geminiResult?.destinationName || aiPrompt || spot.city);
                        fetchAndApplyHospitality(geminiResult?.destinationName || spot.city, spot);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-400 ring-1 ring-emerald-400 shadow-md'
                          : 'bg-slate-800/80 border-slate-700/80 hover:border-indigo-400 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-start gap-3 mb-2.5">
                          <img
                            src={spot.image}
                            alt={spot.name}
                            className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-700"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] text-indigo-300 font-medium">{spot.city}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                #{idx + 1}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white truncate mt-0.5">{spot.name}</h4>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 mt-1">
                              <Flame className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>{spot.monthlyCheckins.toLocaleString()} Check-ins/mo</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-3">
                          {spot.description}
                        </p>
                      </div>

                      <div className="space-y-2 mt-2 pt-2.5 border-t border-slate-700/60">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSpot(spot, geminiResult?.destinationName || aiPrompt || spot.city);
                            fetchAndApplyHospitality(geminiResult?.destinationName || spot.city, spot);
                            onProceedToProximity();
                          }}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                              : 'bg-indigo-600/80 hover:bg-indigo-600 text-white'
                          }`}
                        >
                          <span>{isSelected ? 'Selected • Open Proximity Radar' : 'Select Spot & Explore Proximity'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
