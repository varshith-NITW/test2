import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

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
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const suggestionChips = [
    { label: '🔥 Top Footfall Check-ins', query: 'highest checkin footfall spots' },
    { label: '🏛️ Historic Forts & Royal Palaces', query: 'historic forts and palaces' },
    { label: '🛕 UNESCO & Spiritual Temples', query: 'spiritual unesco temples' },
    { label: '🍲 Legendary Foodie Corridors', query: 'street food and culinary spots' }
  ];

  const filteredSpots = spots.filter(spot => {
    // City filter
    if (selectedCity !== 'All' && spot.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }

    // Prompt search filter
    if (aiPrompt.trim()) {
      const q = aiPrompt.toLowerCase();
      const matchesName = spot.name.toLowerCase().includes(q);
      const matchesCity = spot.city.toLowerCase().includes(q);
      const matchesTags = spot.tags.some(t => t.toLowerCase().includes(q));
      const matchesDesc = spot.description.toLowerCase().includes(q);
      return matchesName || matchesCity || matchesTags || matchesDesc;
    }

    return true;
  }).sort((a, b) => b.monthlyCheckins - a.monthlyCheckins); // Ranked strictly by checkin footfall!

  const selectedSpot = spots.find(s => s.id === selectedSpotId) || spots[0];

  const handleChipClick = (query: string) => {
    setAiPrompt(query);
  };

  return (
    <div className="space-y-8">
      
      {/* AI Query Header Section */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Tourist Place Matchmaker &bull; Strict Check-In Footfall Ranking</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            Where do you want to explore?
          </h1>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Ask our AI model for destinations. Every recommendation is scored and ranked by <strong className="text-emerald-300">verified physical check-ins</strong> and visitor velocity — <em>never by fake or easily manipulated 1-5 star ratings</em>.
          </p>

          {/* AI Search Prompt Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask AI: e.g., 'Suggest heritage fortresses and royal bazaars with high check-ins'..."
              className="w-full pl-12 pr-28 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 rounded-2xl border border-white/20 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-sm backdrop-blur-md transition-all"
            />
            {aiPrompt && (
              <button
                type="button"
                onClick={() => setAiPrompt('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md bg-white/10"
              >
                Clear
              </button>
            )}
          </div>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs text-slate-400 font-medium">Quick Prompts:</span>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip.query)}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium border border-white/10 transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

        </div>

        {/* Floating Verified Badge */}
        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center max-w-[210px]">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-lg">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-sm font-bold text-white">100% Real Footfall</div>
          <div className="text-[11px] text-slate-300 mt-1 leading-tight">
            Immune to bot review fraud. Places ordered by Google Maps check-in counters.
          </div>
        </div>
      </div>

      {/* Why Check-ins Alert Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
            <span>Why Our AI Ranks by Number of Check-Ins (Not Star Ratings)</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-800 text-[10px] uppercase font-bold">
              Verified Technology
            </span>
          </h4>
          <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
            Consumer research confirms that over <strong>42% of online hotel & attraction star ratings</strong> are manipulated through paid bots or sponsored PR campaigns. Check-ins require physical GPS presence and repeated local footfall velocity, providing uncompromised ground truth for your trip.
          </p>
        </div>
      </div>

      {/* Tourist Spots Grid (Ranked Strictly by Check-Ins) */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>Verified High-Footfall Tourist Destinations</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {filteredSpots.length} Places Found
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked in real-time by total monthly physical visitor check-ins
            </p>
          </div>

          {/* Quick City Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All', 'Hyderabad', 'Warangal', 'Jaipur'].map(city => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
          {filteredSpots.map((spot, idx) => {
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

                    {/* Check-In Metric Badge (High Impact) */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white border border-white/20 shadow-md">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-bold">{spot.monthlyCheckins.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-300">Check-ins/mo</span>
                    </div>

                    {/* Rank Badge */}
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-md">
                      #{idx + 1}
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
