import React from 'react';
import { VisitDecision, CampusService } from '../types';
import { DecisionReason } from './DecisionReason';
import {
  CheckCircle2,
  Clock,
  AlertOctagon,
  ArrowRight,
  BellRing,
  RotateCcw,
  Compass,
  Users,
  Footprints,
  Hourglass,
  DoorClosed,
  ChevronRight,
  ShieldCheck,
  Building,
  FileCheck2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DecisionCardProps {
  decision: VisitDecision;
  service: CampusService;
  onSeeBestTime: () => void;
  onViewQueue: () => void;
  onSetReminder: () => void;
  onFixRequirement: () => void;
  onFindAnotherOption: () => void;
  onBackToDetails: () => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  decision,
  service,
  onSeeBestTime,
  onViewQueue,
  onSetReminder,
  onFixRequirement,
  onFindAnotherOption,
  onBackToDetails,
}) => {
  const isGo = decision.status === 'GO';
  const isWait = decision.status === 'WAIT';
  const isDontGo = decision.status === 'DONT_GO';

  // State-specific visual themes and atmospheric glow
  const theme = isGo
    ? {
        cardGlow: 'glow-go',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        dotBg: 'bg-emerald-500',
        bannerGradient: 'from-emerald-500/12 via-emerald-500/5 to-transparent',
        accentBorder: 'border-emerald-300/80',
        icon: CheckCircle2,
        primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30',
        title: 'GO',
        subtitle: "You're ready to visit.",
        textColor: 'text-emerald-700',
      }
    : isWait
    ? {
        cardGlow: 'glow-wait',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
        dotBg: 'bg-amber-500',
        bannerGradient: 'from-amber-500/12 via-amber-500/5 to-transparent',
        accentBorder: 'border-amber-300/80',
        icon: Clock,
        primaryBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/30',
        title: 'WAIT',
        subtitle: "It's too early to leave.",
        textColor: 'text-amber-700',
      }
    : {
        cardGlow: 'glow-dont-go',
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-300',
        dotBg: 'bg-rose-500',
        bannerGradient: 'from-rose-500/12 via-rose-500/5 to-transparent',
        accentBorder: 'border-rose-300/80',
        icon: AlertOctagon,
        primaryBtn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30',
        title: "DON'T GO",
        subtitle: decision.headline,
        textColor: 'text-rose-700',
      };

  const IconComponent = theme.icon;

  // Multi-signal checklist evaluation
  const allDocsReady = decision.missingCount === 0;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToDetails}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
        >
          ← Back to {service.name} checklist
        </button>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          <span>{service.office} • {service.block}</span>
        </div>
      </div>

      {/* Main Decision Signature Card */}
      <div
        className={`bg-white rounded-3xl border ${theme.accentBorder} ${theme.cardGlow} shadow-xl overflow-hidden transition-all duration-300`}
      >
        {/* Top Header Banner */}
        <div className={`p-6 sm:p-8 bg-gradient-to-b ${theme.bannerGradient} border-b border-slate-100`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-2">
              {/* Massive Signature Status Typography */}
              <div className="flex items-center gap-3">
                <span className="relative flex h-6 w-6">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.dotBg}`}
                  />
                  <span className={`relative inline-flex rounded-full h-6 w-6 ${theme.dotBg}`} />
                </span>
                <h1 className={`text-5xl sm:text-6xl font-black tracking-tight font-sans ${theme.textColor}`}>
                  {theme.title}
                </h1>
              </div>

              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {theme.subtitle}
              </p>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                {decision.reason}
              </p>
            </div>

            {/* Prominent Recommended Departure Box */}
            <div
              className={`sm:self-center p-4 rounded-2xl border text-center sm:text-right shadow-xs ${
                isGo
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : isWait
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                {isGo ? 'Best Departure' : isWait ? 'Recommended Departure' : 'Next Departure'}
              </span>
              <span className="text-3xl font-black font-mono mt-0.5 block tracking-tight">
                {decision.recommendedDeparture}
              </span>
              <span className="text-xs text-slate-600 font-medium block mt-0.5">
                {isGo
                  ? 'Walk now for minimal line'
                  : isWait
                  ? `Avoids ~${decision.estimatedWait}m congestion`
                  : 'Fix prerequisite first'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 8: MULTI-SIGNAL DECISION BREAKDOWN (Requirements, Queue, Travel, Service, Office) */}
        <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>Multi-Signal Decision Breakdown</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Evaluated at {decision.currentTime}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {/* Signal 1: Requirements */}
            <div className={`p-3 rounded-2xl border bg-white shadow-2xs ${allDocsReady ? 'border-emerald-200' : 'border-rose-200'}`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Requirements
              </div>
              <div className="flex items-center gap-1.5 mt-1 font-bold text-xs">
                {allDocsReady ? (
                  <span className="text-emerald-700 flex items-center gap-1 font-extrabold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Ready</span>
                  </span>
                ) : (
                  <span className="text-rose-700 flex items-center gap-1 font-extrabold">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>✗ Missing</span>
                  </span>
                )}
              </div>
            </div>

            {/* Signal 2: Queue */}
            <div className="p-3 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Queue
              </div>
              <div className="text-sm font-black text-slate-900 mt-1">
                {decision.queueAhead} waiting
              </div>
            </div>

            {/* Signal 3: Travel */}
            <div className="p-3 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Travel
              </div>
              <div className="text-sm font-black text-slate-900 mt-1">
                {decision.travelTime} min
              </div>
            </div>

            {/* Signal 4: Service */}
            <div className="p-3 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Service
              </div>
              <div className="text-sm font-black text-slate-900 mt-1">
                {service.averageServiceTimeMinutes} min
              </div>
            </div>

            {/* Signal 5: Office */}
            <div className="p-3 rounded-2xl border border-slate-200/80 bg-white shadow-2xs col-span-2 sm:col-span-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Office
              </div>
              <div className="text-xs font-black text-slate-900 mt-1 truncate">
                Until {decision.closingTime}
              </div>
            </div>
          </div>

          {/* Synthesis Banner */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              QueueLess evaluated campus readiness signals:
            </span>
            <div className="flex items-center gap-1.5 font-black text-slate-900">
              <span className="text-slate-500 font-semibold">QueueLess recommends</span>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase ${
                  isGo
                    ? 'bg-emerald-100 text-emerald-800'
                    : isWait
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {decision.status}
              </span>
            </div>
          </div>
        </div>

        {/* WHY QUEUELESS DECIDED THIS */}
        <div className="p-6 sm:p-8 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>WHY QUEUELESS DECIDED THIS</span>
          </h3>

          <div className="grid gap-2.5">
            {decision.reasonsList.map((reason, idx) => (
              <DecisionReason key={idx} reason={reason} />
            ))}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {isGo && (
            <>
              <button
                type="button"
                onClick={onSeeBestTime}
                className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${theme.primaryBtn}`}
              >
                <span>See best time to leave</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onViewQueue}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-sm text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View queue</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </>
          )}

          {isWait && (
            <>
              <button
                type="button"
                onClick={onSetReminder}
                className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${theme.primaryBtn}`}
              >
                <BellRing className="w-4 h-4" />
                <span>Set reminder for {decision.recommendedDeparture}</span>
              </button>
              <button
                type="button"
                onClick={onViewQueue}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-sm text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View queue</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </>
          )}

          {isDontGo && (
            <>
              <button
                type="button"
                onClick={onFixRequirement}
                className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${theme.primaryBtn}`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Fix requirement</span>
              </button>
              <button
                type="button"
                onClick={onFindAnotherOption}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-sm text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-indigo-500" />
                <span>Find another option</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
