import React from 'react';
import { StepLayer } from '../../types';
import { Sparkles, Radar, FileCheck, CreditCard, Check } from 'lucide-react';

interface StepWizardProps {
  currentStep: StepLayer;
  onStepClick: (step: StepLayer) => void;
  hasSpotSelected: boolean;
  hasHotelSelected: boolean;
}

export const StepWizard: React.FC<StepWizardProps> = ({
  currentStep,
  onStepClick,
  hasSpotSelected,
  hasHotelSelected
}) => {
  const steps: Array<{
    id: StepLayer;
    label: string;
    subLabel: string;
    icon: React.ElementType;
    number: number;
    enabled: boolean;
  }> = [
    {
      id: 'step1_spots',
      label: 'Step 1: Ask AI & Places',
      subLabel: 'Ranked by Check-ins (No Fake Ratings)',
      icon: Sparkles,
      number: 1,
      enabled: true
    },
    {
      id: 'step2_proximity',
      label: 'Step 2: Proximity Radar',
      subLabel: 'Hotels, Food & Local Guides',
      icon: Radar,
      number: 2,
      enabled: hasSpotSelected
    },
    {
      id: 'step3_summary',
      label: 'Step 3: Package Summary',
      subLabel: 'Unified 3-in-1 Itinerary & Split',
      icon: FileCheck,
      number: 3,
      enabled: hasSpotSelected && hasHotelSelected
    },
    {
      id: 'step4_payment',
      label: 'Step 4: Razorpay Payment',
      subLabel: 'Instant Payout Split & Digital Pass',
      icon: CreditCard,
      number: 4,
      enabled: hasSpotSelected && hasHotelSelected
    }
  ];

  const getStepIndex = (step: StepLayer) => {
    switch (step) {
      case 'step1_spots': return 0;
      case 'step2_proximity': return 1;
      case 'step3_summary': return 2;
      case 'step4_payment': return 3;
    }
  };

  const currentIdx = getStepIndex(currentStep);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-8">
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = currentStep === step.id;
          const isCompleted = idx < currentIdx;
          const isClickable = step.enabled;

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <div className={`hidden md:block flex-1 h-0.5 mx-2 transition-colors ${idx <= currentIdx ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}

              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-emerald-50 border border-emerald-300 shadow-sm text-emerald-950'
                    : isCompleted
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 cursor-pointer border border-transparent'
                    : isClickable
                    ? 'hover:bg-slate-50 text-slate-600 cursor-pointer border border-transparent'
                    : 'text-slate-400 opacity-60 cursor-not-allowed border border-transparent'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300 ring-offset-1'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold tracking-wide flex items-center gap-1.5">
                    <span className={isCurrent ? 'text-emerald-700' : 'text-slate-700'}>{step.label}</span>
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[190px]">
                    {step.subLabel}
                  </div>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
