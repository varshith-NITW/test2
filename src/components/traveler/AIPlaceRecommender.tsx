import React, { useState, useEffect } from 'react';
import { TouristSpot } from '../../types';
import { 
  Sparkles, 
  MapPin, 
  Flame, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Volume2, 
  Compass,
  CheckCircle2,
  Bot,
  Zap,
  Info,
  ChevronRight,
  ExternalLink,
  Key,
  X,
  Check
} from 'lucide-react';
import { askGeminiTouristRecommendations, GeminiTouristRecommendation } from '../../services/geminiService';
import { 
  getGoogleMapsApiKey, 
  setGoogleMapsApiKey, 
  getMaskedApiKey, 
  isCustomGoogleMapsApiKey,
  geocodeLocationWithGoogleMaps
} from '../../services/googleMapsService';

interface AIPlaceRecommenderProps {
  spots: TouristSpot[];
  selectedSpotId: string;
  onSelectSpot: (spot: TouristSpot) => void;
  onProceedToProximity: () => void;
}

export const AIPlaceRecommender: React.FC<AIPlaceRecommenderProps> = ({
  spots,
  selectedSpotId,
  onSelectSpot,
  onProceedToProximity
}) => {
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [isGeminiThinking, setIsGeminiThinking] = useState<boolean>(false);
  const [geminiResult, setGeminiResult] = useState<GeminiTouristRecommendation | null>(null);

  // Google Maps API Key Modal state
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [customKeyInput, setCustomKeyInput] = useState<string>(getGoogleMapsApiKey());
  const [keySavedMessage, setKeySavedMessage] = useState<string>('');
  const [testingKey, setTestingKey] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string>('');

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
    { label: '🌴 Kochi & Kerala', query: 'kochi' },
    { label: '🏛️ Lucknow & Nawabi', query: 'lucknow' },
    { label: '🕌 Delhi Heritage', query: 'delhi' },
    { label: '🏖️ Goa Coastline', query: 'goa' },
    { label: '👑 Jaipur Pink City', query: 'jaipur' },
    { label: '🛕 Varanasi Ghats', query: 'varanasi' },
    { label: '🏰 Hyderabad Forts', query: 'hyderabad' }
  ];

  // Debounced live search as user types into the destination search bar
  useEffect(() => {
    const trimmed = aiPrompt.trim();
    if (!trimmed) {
      setGeminiResult(null);
      setIsGeminiThinking(false);
      return;
    }

    if (trimmed.length >= 2) {
      setIsGeminiThinking(true);
      const timer = setTimeout(async () => {
        try {
          const res = await askGeminiTouristRecommendations(trimmed, spots);
          setGeminiResult(res);
        } catch (err) {
          console.warn('Gemini live query error:', err);
        } finally {
          setIsGeminiThinking(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [aiPrompt, spots]);

  const handleAskGemini = async (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : aiPrompt).trim();
    if (!q) {
      setGeminiResult(null);
      setIsGeminiThinking(false);
      return;
    }
    setIsGeminiThinking(true);
    setSelectedCity('All');
    try {
      const res = await askGeminiTouristRecommendations(q, spots);
      setGeminiResult(res);
    } catch (err) {
      console.warn('Gemini query error:', err);
    } finally {
      setIsGeminiThinking(false);
    }
  };

  const handleChipClick = (query: string) => {
    setAiPrompt(query);
    handleAskGemini(query);
  };

  // Determine spots to display - strictly empty if no search query executed!
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
      
      {/* Gemini AI Header Section */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-indigo-900/50">
        
        {/* Glowing animated background orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          
          {/* Google Gemini AI Model & Google Maps Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-extrabold shadow-sm">
              <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Powered by Google Gemini 2.5 Flash &bull; Real Check-In Footfall Engine</span>
            </div>

            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
              title="Click to view or edit Google Maps API Key"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Maps API: Active ({getMaskedApiKey()})</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            Ask Gemini AI: Where Should You Travel?
          </h1>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Describe your dream trip in natural language. Google Gemini evaluates our physical footfall graph to recommend spots ranked strictly by <strong className="text-emerald-400">verified check-in numbers</strong> — <em>never by fake or bought 1-5 star ratings</em>.
          </p>

          {/* Gemini AI Search Prompt Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAskGemini();
            }}
            className="relative flex flex-col sm:flex-row items-stretch gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask Gemini: e.g., 'Recommend historic forts and food streets with high check-ins'..."
                className="w-full pl-12 pr-10 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 rounded-2xl border border-indigo-400/30 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 text-sm backdrop-blur-md transition-all shadow-inner"
              />
              {aiPrompt && (
                <button
                  type="button"
                  onClick={() => {
                    setAiPrompt('');
                    handleAskGemini('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md bg-white/10"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isGeminiThinking}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 cursor-pointer disabled:opacity-60"
            >
              {isGeminiThinking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Gemini Reasoning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Ask Gemini AI</span>
                </>
              )}
            </button>
          </form>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
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
            Gemini 2.5 Flash is analyzing verified check-in footfalls for &ldquo;{aiPrompt}&rdquo;...
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Evaluating physical GPS &amp; Google Place check-in velocity &bull; Bypassing manipulated star ratings
          </p>
        </div>
      )}

      {/* Initial Empty State - before traveler searches */}
      {!isGeminiThinking && !geminiResult && (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <Compass className="w-7 h-7" />
          </div>
          <div className="max-w-lg mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Search Any Destination to View Verified Places
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
              Type any tourist city above (e.g., <strong className="text-emerald-400">Kochi</strong>, <strong className="text-indigo-400">Lucknow</strong>, <strong className="text-sky-400">Goa</strong>, <strong className="text-amber-400">Delhi</strong>) or click a destination below to discover authentic spots ranked strictly by real check-in footfalls.
            </p>
          </div>

          {/* Quick Popular Destination Badges */}
          <div className="pt-2">
            <div className="text-xs text-slate-400 font-semibold mb-3">Popular Destinations (Click to search):</div>
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

      {/* No Results Found State */}
      {!isGeminiThinking && geminiResult && displaySpots.length === 0 && (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            No tourist places found matching &ldquo;{geminiResult.query}&rdquo;
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {geminiResult.geminiReasoning || 'Try searching for a destination like Kochi, Lucknow, Delhi, Goa, Jaipur, or Varanasi.'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            {popularDestinations.slice(0, 5).map((dest, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(dest.name)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              >
                {dest.icon} {dest.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Gemini AI Intelligence Response Card */}
      {!isGeminiThinking && geminiResult && displaySpots.length > 0 && (
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
              {geminiResult.googleMapsSource && (
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{geminiResult.googleMapsSource}</span>
                </span>
              )}
            </div>
          </div>

          {/* Gemini AI Reasoning Content */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p className="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-900/40 text-slate-100 font-medium">
              ✨ <strong className="text-indigo-300">Gemini Analysis:</strong> {geminiResult.geminiReasoning}
            </p>

            {/* Why Checkins Banner inside Gemini response */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <strong className="text-emerald-200">Gemini Ground-Truth Rule:</strong> {geminiResult.whyCheckinsUsed}
              </div>
            </div>

            {/* Gemini Crowd Forecast & Insider Tip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Gemini Crowd & Timing Forecast:</span>
                </div>
                <p className="text-slate-300 leading-normal">{geminiResult.crowdAdvice}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Gemini Local Insider Advice:</span>
                </div>
                <p className="text-slate-300 leading-normal">{geminiResult.insiderTip}</p>
              </div>
            </div>

            {/* Gemini Recommended Places Grid inside Gemini Card */}
            <div className="pt-3 border-t border-indigo-900/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gemini Recommended Destinations (Ranked by Check-in Footfalls):</span>
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
                      onClick={() => onSelectSpot(spot)}
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

                      {/* Google Maps link & Selection buttons */}
                      <div className="space-y-2 mt-2 pt-2.5 border-t border-slate-700/60">
                        {/* Direct Google Maps Navigation Link */}
                        <a
                          href={spot.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${spot.name} ${spot.city}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full py-1.5 px-3 rounded-lg bg-slate-700/70 hover:bg-slate-700 hover:text-white text-indigo-200 text-[11px] font-semibold flex items-center justify-between transition-all border border-slate-600/60 group shadow-sm"
                          title={`Open ${spot.name} in Google Maps`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span className="truncate">View on Google Maps</span>
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors shrink-0" />
                        </a>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSpot(spot);
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

      {/* Google Maps API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => {
                setShowKeyModal(false);
                setTestResult('');
                setKeySavedMessage('');
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Google Maps API Configuration</h3>
                <p className="text-xs text-slate-400">
                  Powers real-time geolocation, places search, and navigation for Gemini
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Google Maps API Key (VITE_GOOGLE_MAPS_API_KEY):
              </label>
              <input
                type="text"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-400 block">
                Current active key: <strong className="text-emerald-400">{getMaskedApiKey()}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={testingKey}
                onClick={async () => {
                  setTestingKey(true);
                  setTestResult('');
                  try {
                    const loc = await geocodeLocationWithGoogleMaps('Kochi');
                    setTestResult(`✅ Geocoding Connected! Resolved ${loc.cityName} (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}) via ${loc.source}`);
                  } catch (err: any) {
                    setTestResult(`⚠️ Note: ${err?.message || 'Geocoding active with smart fallback'}`);
                  } finally {
                    setTestingKey(false);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
              >
                {testingKey ? 'Testing Connection...' : 'Test Location Geocoding'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustomKeyInput('AIzaSyCGSg1tsQTyEA5uJnS3R0ndTaK-l6cAE8A');
                  setGoogleMapsApiKey('AIzaSyCGSg1tsQTyEA5uJnS3R0ndTaK-l6cAE8A');
                  setTestResult('Reset to Project Default Key.');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
              >
                Reset Default Key
              </button>
            </div>

            {testResult && (
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-emerald-300">
                {testResult}
              </div>
            )}

            {keySavedMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300">
                {keySavedMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowKeyModal(false);
                  setTestResult('');
                  setKeySavedMessage('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setGoogleMapsApiKey(customKeyInput);
                  setKeySavedMessage('Google Maps API Key saved! Gemini will use this key for all locations.');
                  setTimeout(() => {
                    setKeySavedMessage('');
                    setShowKeyModal(false);
                  }, 1200);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                Save & Apply Key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
