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
  ChevronRight
} from 'lucide-react';
import { askGeminiTouristRecommendations, GeminiTouristRecommendation } from '../../services/geminiService';

interface AIPlaceRecommenderProps {
  spots: TouristSpot[];
  selectedSpotId: string;
  onSelectSpot: (spotId: string) => void;
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

  const suggestionChips = [
    { label: '🔥 Top Footfall Check-ins', query: 'highest checkin footfall spots' },
    { label: '🏛️ Historic Forts & Royal Palaces', query: 'historic forts and royal palaces' },
    { label: '🛕 UNESCO & Spiritual Temples', query: 'spiritual unesco temples' },
    { label: '🍲 Legendary Foodie Corridors', query: 'street food and authentic culinary spots' }
  ];

  // Run initial Gemini recommendation on mount
  useEffect(() => {
    let isMounted = true;
    askGeminiTouristRecommendations('Top verified check-in destinations', spots).then(res => {
      if (isMounted) setGeminiResult(res);
    });
    return () => { isMounted = false; };
  }, [spots]);

  const handleAskGemini = async (customQuery?: string) => {
    const q = customQuery !== undefined ? customQuery : aiPrompt;
    setIsGeminiThinking(true);
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

  // Determine spots to display
  const displaySpots = (geminiResult && geminiResult.matchedSpots.length > 0)
    ? geminiResult.matchedSpots.filter(spot => {
        if (selectedCity !== 'All' && spot.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
        return true;
      })
    : spots.filter(spot => {
        if (selectedCity !== 'All' && spot.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
        return true;
      }).sort((a, b) => b.monthlyCheckins - a.monthlyCheckins);

  return (
    <div className="space-y-8">
      
      {/* Gemini AI Header Section */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-indigo-900/50">
        
        {/* Glowing animated background orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          
          {/* Google Gemini AI Model Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-extrabold mb-3 shadow-sm">
            <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Powered by Google Gemini 2.5 Flash &bull; Real Check-In Footfall Engine</span>
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

        {/* Floating Gemini Badge Card */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center p-5 bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 text-center max-w-[220px] shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-emerald-400 text-white flex items-center justify-center mb-2.5 shadow-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div className="text-sm font-black text-white">Gemini 2.5 Flash</div>
          <div className="text-[11px] text-indigo-200 mt-1 font-semibold">
            Real Footfall Ranking
          </div>
          <div className="text-[10px] text-slate-300 mt-1 leading-tight">
            100% immune to fake bot reviews. Ranks strictly by physical visits.
          </div>
        </div>
      </div>

      {/* Live Gemini AI Intelligence Response Card */}
      {geminiResult && (
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

            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              Model: {geminiResult.model}
            </span>
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
          </div>

        </div>
      )}

      {/* Tourist Spots Grid (Ranked Strictly by Check-Ins) */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>Destinations Recommended by Gemini</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {displaySpots.length} High-Footfall Places
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked in real-time by total monthly verified physical visitor check-ins (Zero star rating bias)
            </p>
          </div>

          {/* Quick City Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All', 'Hyderabad', 'Warangal', 'Jaipur'].map(city => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCity === city
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySpots.map((spot, idx) => {
            const isSelected = spot.id === selectedSpotId;

            return (
              <div
                key={spot.id}
                onClick={() => onSelectSpot(spot.id)}
                className={`group bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Spot Image with Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Check-In Metric Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white border border-white/20 shadow-md">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-bold">{spot.monthlyCheckins.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-300">Check-ins/mo</span>
                    </div>

                    {/* Gemini Footfall Rank Badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-emerald-500 text-white font-black text-xs flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3 text-amber-200" />
                      <span>#{idx + 1}</span>
                    </div>

                    {/* Spot Title Over Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-medium mb-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{spot.city}</span>
                      </div>
                      <h4 className="text-base font-bold truncate">{spot.name}</h4>
                    </div>
                  </div>

                  {/* Spot Details */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {spot.description}
                    </p>

                    {/* Catchy Local Line */}
                    {spot.catchyLine && (
                      <div className="text-[11px] italic text-slate-500 border-l-2 border-emerald-500 pl-2.5">
                        &ldquo;{spot.catchyLine}&rdquo;
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {spot.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Best Time to Visit */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{spot.bestTimeToVisit}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSpot(spot.id);
                      onProceedToProximity();
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md hover:bg-emerald-700'
                        : 'bg-slate-100 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <span>{isSelected ? 'Spot Selected &bull; Open Radar' : 'Select Spot & Explore Proximity'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
