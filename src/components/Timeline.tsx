import React, { useState } from 'react';
import { VisitDecision, CampusService } from '../types';
import {
  Footprints,
  Users,
  CheckCircle2,
  Clock,
  DoorClosed,
  ArrowRight,
  Bell,
  Sparkles,
  Ticket,
  ChevronRight,
  ShieldCheck,
  CalendarCheck,
  MapPin,
  Compass,
} from 'lucide-react';

interface TimelineProps {
  decision: VisitDecision;
  service: CampusService;
  onJoinQueue: () => void;
  onRemindMe: () => void;
  onBack: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  decision,
  service,
  onJoinQueue,
  onRemindMe,
  onBack,
}) => {
  const [reminderSet, setReminderSet] = useState(false);

  const handleReminderClick = () => {
    setReminderSet(true);
    onRemindMe();
  };

  const steps = [
    {
      time: decision.recommendedDeparture,
      title: 'LEAVE',
      subtitle: `Depart your current location`,
      icon: Footprints,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badge: `${decision.travelTime} min walk`,
      phase: 'Travel Phase',
      isCurrent: true,
    },
    {
      time: decision.estimatedArrival,
      title: 'ARRIVE',
      subtitle: `${service.office}, ${service.block}`,
      icon: MapPin,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      badge: `${decision.queueAhead} in line`,
      phase: 'Arrival',
      isCurrent: false,
    },
    {
      time: decision.estimatedTurn,
      title: 'ESTIMATED TURN',
      subtitle: `${service.counterNumber || 'Counter 2'} announced`,
      icon: Users,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: `${decision.estimatedWait} min wait`,
      phase: 'Queue Window',
      isCurrent: false,
    },
    {
      time: decision.estimatedCompletion,
      title: 'COMPLETE',
      subtitle: 'Issued & verified',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badge: `${decision.serviceTime} min service`,
      phase: 'Completion',
      isCurrent: false,
    },
    {
      time: decision.closingTime,
      title: 'OFFICE CLOSES',
      subtitle: 'Official counter shutdown',
      icon: DoorClosed,
      color: 'text-slate-600 bg-slate-100 border-slate-200',
      badge: 'Safe window',
      phase: 'Closure',
      isCurrent: false,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle Map Line Watermark Background */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0,100 Q 250,50 500,120 T 1000,90" fill="none" stroke="#6366f1" strokeWidth="4" />
          </svg>
        </div>

        {/* Navigation back */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
          >
            ← Back to decision card
          </button>
          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Optimal Window Calculated</span>
          </div>
        </div>

        {/* Centerpiece Departure Time */}
        <div className="text-center mb-10 relative z-10">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-200/80 shadow-2xs">
            BEST TIME TO LEAVE
          </span>

          <div className="mt-4">
            <h1 className="text-6xl sm:text-8xl font-black text-slate-900 tracking-tight font-mono">
              {decision.recommendedDeparture}
            </h1>
          </div>

          <p className="text-base sm:text-lg text-slate-600 mt-2 max-w-lg mx-auto font-medium">
            Leaving at <span className="font-extrabold text-slate-900">{decision.recommendedDeparture}</span> synchronizes your arrival with the current queue velocity.
          </p>

          {/* Phase progress strip */}
          <div className="mt-6 flex items-center justify-center gap-2 flex-wrap text-xs font-semibold text-slate-500">
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80">
              Walk ({decision.travelTime}m)
            </span>
            <span className="text-slate-300">→</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80">
              Queue ({decision.estimatedWait}m)
            </span>
            <span className="text-slate-300">→</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80">
              Counter ({decision.serviceTime}m)
            </span>
            <span className="text-slate-300">→</span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              Done Before {decision.closingTime}
            </span>
          </div>
        </div>

        {/* SECTION 9: HORIZONTAL CAMPUS JOURNEY TIMELINE */}
        <div className="my-10 relative z-10">
          {/* Animated Connecting Track for Desktop */}
          <div className="hidden md:block absolute top-[26px] left-12 right-12 h-1 bg-slate-200 z-0 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-3 relative z-10">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={idx}
                  className={`flex md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-2.5 p-4 md:p-3 rounded-2xl border transition-all duration-200 ${
                    step.isCurrent
                      ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-white/80 border-slate-200/80 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`relative w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs flex-shrink-0 transition-transform hover:scale-105 ${step.color}`}
                  >
                    <StepIcon className="w-5 h-5" />
                    {step.isCurrent && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 md:flex-initial">
                    <span className="text-xs font-mono font-black text-indigo-600 block">
                      {step.time}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-snug mt-0.5">
                      {step.title}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-500 block truncate mt-0.5">
                      {step.subtitle}
                    </span>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                      {step.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <button
            type="button"
            onClick={onJoinQueue}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>Join queue</span>
          </button>

          <button
            type="button"
            onClick={handleReminderClick}
            disabled={reminderSet}
            className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-sm border transition-all flex items-center justify-center gap-2 cursor-pointer ${
              reminderSet
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            {reminderSet ? (
              <>
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>Reminder set for {decision.recommendedDeparture}</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-slate-500" />
                <span>Remind me</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
