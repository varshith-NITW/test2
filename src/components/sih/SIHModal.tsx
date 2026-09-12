import React from 'react';
import { X, Award, CheckCircle2, Building2, Users, Compass, Utensils, Zap, ExternalLink } from 'lucide-react';

interface SIHModalProps {
  onClose: () => void;
}

export const SIHModal: React.FC<SIHModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Smart India Hackathon 2026
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            Problem ID: SIH26204
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
          AICTE Student Innovation: Boosting the Tourism & Hospitality Industry
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          <strong>Problem Statement:</strong> A solution/idea that can boost the current situation of the tourism industries including hotels, travel, dining and others (AICTE).
        </p>

        {/* 4 Pillars of Solution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5 font-bold text-slate-800 text-sm mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              Anti-Review-Fraud Check-In Ranking
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eliminates fake ratings and bot manipulation by evaluating verified physical footfall check-ins, restoring consumer trust.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5 font-bold text-slate-800 text-sm mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              3-in-1 Hyper-Local Proximity Radar
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Directly binds local hotels, authentic restaurants, and guides within 1-5km of monuments using PostGIS spatial algorithms.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5 font-bold text-slate-800 text-sm mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              Local Guide Formalization & Payouts
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides digital identity to unorganized licensed guides with 90% direct escrow payouts, preventing street tout exploitation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5 font-bold text-slate-800 text-sm mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              Unified Single-Window Razorpay Split
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              One single transaction settles hotel stay, meal passes, and guide fees simultaneously without fragmenting payments.
            </p>
          </div>

        </div>

        {/* Tech Stack Summary */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 text-xs mb-6">
          <div className="font-bold text-emerald-400 mb-2">Technical Architecture:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
            <div>&bull; React 18 + Vite</div>
            <div>&bull; Tailwind CSS</div>
            <div>&bull; Razorpay Gateway</div>
            <div>&bull; Leaflet Radar</div>
            <div>&bull; Node.js Express</div>
            <div>&bull; Google Gemini AI</div>
            <div>&bull; PostGIS Proximity</div>
            <div>&bull; PyTorch Model</div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
          >
            Explore Live Application
          </button>
        </div>

      </div>
    </div>
  );
};
