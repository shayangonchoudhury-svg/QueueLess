import React from 'react';
import { CampusService } from '../types';
import { Sparkles, ArrowRight, Zap, Clock, Users, Building, ShieldCheck, Check } from 'lucide-react';

interface AlternativeServiceCardProps {
  currentService: CampusService;
  alternativeService: CampusService;
  savingsMinutes: number;
  onSelectAlternative: (service: CampusService) => void;
  onKeepCurrent: () => void;
  onBack: () => void;
}

export const AlternativeServiceCard: React.FC<AlternativeServiceCardProps> = ({
  currentService,
  alternativeService,
  savingsMinutes = 45,
  onSelectAlternative,
  onKeepCurrent,
  onBack,
}) => {
  const currentTotalMinutes =
    currentService.travelTimeMinutes +
    Math.round((currentService.queueCount * currentService.averageServiceTimeMinutes) / currentService.activeCounters);

  const alternativeTotalMinutes =
    alternativeService.travelTimeMinutes +
    Math.round((alternativeService.queueCount * alternativeService.averageServiceTimeMinutes) / alternativeService.activeCounters);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border-b border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors mb-4"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Intelligent Routing Suggestion</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            We found a better option
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Another campus facility handles equivalent certificate verification with faster queues and more open counters.
          </p>
        </div>

        {/* Centerpiece: "45 MINUTES SAVED" */}
        <div className="py-8 px-6 text-center bg-emerald-50/50 border-b border-emerald-100">
          <div className="inline-flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-400 shadow-md ring-4 ring-emerald-400/15">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-emerald-600 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-500" />
              Efficiency Boost
            </span>
            <div className="text-4xl sm:text-6xl font-black text-emerald-800 tracking-tight font-sans mt-1">
              {savingsMinutes} MINUTES SAVED
            </div>
            <p className="text-xs sm:text-sm text-emerald-700 font-semibold mt-1">
              Skip idle standing time and complete your paperwork faster
            </p>
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CURRENT OPTION */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 relative">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                CURRENT
              </span>
              <h3 className="text-lg font-bold text-slate-900">{currentService.office}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{currentService.block}</p>

              <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Queue in line:</span>
                  <span className="font-semibold text-slate-900">{currentService.queueCount} people</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Travel walk:</span>
                  <span className="font-semibold text-slate-900">{currentService.travelTimeMinutes} min</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-dashed border-slate-200">
                  <span>Total duration:</span>
                  <span className="text-slate-900">{currentTotalMinutes} min total</span>
                </div>
              </div>
            </div>

            {/* ALTERNATIVE OPTION */}
            <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/20 relative shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                  ALTERNATIVE
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{alternativeService.office}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{alternativeService.block}</p>

              <div className="mt-4 pt-3 border-t border-emerald-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Queue in line:</span>
                  <span className="font-bold text-emerald-700">{alternativeService.queueCount} people</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Travel walk:</span>
                  <span className="font-semibold text-slate-900">{alternativeService.travelTimeMinutes} min</span>
                </div>
                <div className="flex justify-between text-emerald-900 font-black text-sm pt-2 border-t border-dashed border-emerald-200">
                  <span>Total duration:</span>
                  <span className="text-emerald-700 font-black">{alternativeTotalMinutes} min total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onKeepCurrent}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl font-semibold text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Keep {currentService.office}
          </button>
          <button
            type="button"
            onClick={() => onSelectAlternative(alternativeService)}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Use {alternativeService.office}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
