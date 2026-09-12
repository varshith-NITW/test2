import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  TrendingUp, 
  MapPin, 
  Utensils, 
  Compass, 
  CreditCard, 
  Users, 
  Sparkles, 
  Award, 
  ChevronRight,
  Flame
} from 'lucide-react';

export const WhyBetterShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'cards'>('cards');

  const comparisonRows = [
    {
      feature: 'Ranking & Recommendation Engine',
      tourmatch: '100% Verified Footfall Check-ins & Live Velocity (Zero Rating Bias)',
      others: 'Manipulated 1-5 Star Ratings prone to paid bots & review fraud',
      advantage: 'Authentic physical ground truth; immune to fake reviews'
    },
    {
      feature: 'Hyper-Local Proximity Bundling',
      tourmatch: '3-in-1 Spatial Radar: Hotel + Authentic Food + Certified Guide within 1-5 km',
      others: 'Isolated hotel listings only; requires 4 fragmented apps',
      advantage: 'Zero commute stress; everything curated at your landmark epicenter'
    },
    {
      feature: 'Certified Local Guides Integration',
      tourmatch: 'Verified State Tourism Department badges with 90% direct payout',
      others: 'No guide support; leaves tourists vulnerable to street touts',
      advantage: 'Dignified livelihood for local historians; safe & trusted for travelers'
    },
    {
      feature: 'Iconic Regional Dining Passes',
      tourmatch: 'Pre-bundled dining credits with 15% discount at legendary culinary spots',
      others: 'No food integration or dining discounts',
      advantage: 'Taste authentic regional specialties without waiting in long queues'
    },
    {
      feature: 'Unified Payment Checkout',
      tourmatch: 'Single-Window Razorpay Checkout with automated multi-party escrow split',
      others: 'Separate fragmented payments with 20-30% middleman markups',
      advantage: 'Pay once securely; hotels, restaurants, and guides get settled instantly'
    },
    {
      feature: 'Live Crowd Velocity Alerts',
      tourmatch: 'Real-time check-in surge index forecasting peak vs off-peak hours',
      others: 'Static listings with no crowd awareness',
      advantage: 'Visit monuments when crowds are 40% lower for peaceful exploration'
    }
  ];

  const valueCards = [
    {
      icon: Flame,
      title: 'Footfall Check-Ins > Star Ratings',
      subtitle: 'Eliminating Review Fraud',
      description: 'Traditional platforms are flooded with bought 5-star reviews. Our AI calculates real physical footfall check-ins and weekly check-in velocity to recommend genuine traveler favorites.',
      badge: 'Anti-Fraud Algorithm',
      gradient: 'from-amber-500 to-red-500'
    },
    {
      icon: MapPin,
      title: '3-in-1 Proximity Clustering',
      subtitle: 'Hotel + Food + Guide in 1 Spot',
      description: 'Pick your tourist attraction, and our spatial radar instantly surfaces stays, authentic restaurants, and certified guides within walking distance or a 5-minute auto ride.',
      badge: 'Spatial PostGIS ST_DWithin',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Compass,
      title: 'Direct Guide Empowerment',
      subtitle: 'Supporting Regional Storytellers',
      description: 'We formalize unorganized local guides with verified government licensing badges and route 90% of booking proceeds directly to them with zero middleman exploitation.',
      badge: 'Fair Trade Tourism',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Utensils,
      title: 'Curated Authentic Food Passes',
      subtitle: 'Iconic Local Flavors',
      description: 'No more generic hotel buffets. Discover historic cafes and generational family diners around your attraction, bundled with exclusive 15% dining vouchers.',
      badge: '15% Foodie Vouchers',
      gradient: 'from-orange-500 to-amber-600'
    },
    {
      icon: CreditCard,
      title: 'Unified Razorpay Split Engine',
      subtitle: 'Single Checkout, Instant Payouts',
      description: 'Book your entire trip (hotel + restaurant + guide) in one smooth Razorpay transaction. Our smart contract engine splits payments automatically into partner bank accounts.',
      badge: '256-Bit Escrow Payouts',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Award,
      title: 'Direct Website Super Discount',
      subtitle: 'Guaranteed Best Price',
      description: 'By connecting you directly with verified local suppliers, we pass platform savings straight to you: 15% off single stays, and up to 25% off complete 3-in-1 trip bundles.',
      badge: 'Up to 25% OFF',
      gradient: 'from-rose-500 to-pink-600'
    }
  ];

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 my-10 relative overflow-hidden">
      
      {/* Background glowing ambient elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Tourism & Hospitality Intelligence Platform</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Why TourMatch AI is <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">10x Better</span> Than Other Websites
        </h2>
        
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Traditional booking portals (MakeMyTrip, TripAdvisor, Booking.com) rely on easily manipulated star ratings and force you to juggle multiple disjointed apps. Here is how our check-in driven ecosystem changes tourism.
        </p>

        {/* View toggle tabs */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cards'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            6 Core Innovations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'matrix'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Side-by-Side Comparison Matrix
          </button>
        </div>
      </div>

      {/* Tab 1: 6 Innovation Cards */}
      {activeTab === 'cards' && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {valueCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/70 rounded-2xl p-5 hover:border-emerald-500/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-700/80 text-emerald-400 border border-slate-600">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                    {card.title}
                  </h3>
                  <div className="text-xs font-medium text-slate-400 mb-3">
                    {card.subtitle}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <span>Explore in live radar</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Interactive Comparison Matrix */}
      {activeTab === 'matrix' && (
        <div className="relative z-10 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/80 text-slate-400 font-semibold">
                  <th className="p-4 w-1/4">Key Dimension</th>
                  <th className="p-4 w-2/5 text-emerald-400 bg-emerald-950/20">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">TourMatch AI Platform</span>
                    </div>
                  </th>
                  <th className="p-4 w-1/3">Traditional Portals (MMT, TripAdvisor, etc.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-200">
                      {row.feature}
                    </td>
                    <td className="p-4 bg-emerald-950/15 text-slate-100">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-emerald-300">{row.tourmatch}</span>
                          <p className="text-[11px] text-slate-300 mt-0.5">{row.advantage}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{row.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom guarantee footer */}
      <div className="relative z-10 mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Paid Review Sponsorships &bull; Real Footfall Timestamp Verification</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-semibold">100% Secure Razorpay Payouts</span>
          <span>&bull;</span>
          <span>Verified Tourism Dept Guides</span>
        </div>
      </div>

    </section>
  );
};
