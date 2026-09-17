import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Ticket,
  ChevronRight,
  Star,
  Layers,
} from 'lucide-react';

interface LiveQueueViewProps {
  onOpenStaffPortal: () => void;
  onBackToDashboard: () => void;
}

export const LiveQueueView: React.FC<LiveQueueViewProps> = ({
  onOpenStaffPortal,
  onBackToDashboard,
}) => {
  const {
    activeTicket,
    servingToken,
    waitingTokens,
    selectedService,
    staffServeNext,
  } = useApp();

  const userTokenNumber = activeTicket?.tokenNumber ?? 42;
  const isBeingServed = servingToken === userTokenNumber;
  const isCompleted = servingToken > userTokenNumber;

  // Calculate people ahead of user
  const peopleAhead = Math.max(0, userTokenNumber - servingToken - 1);
  const estimatedWait = Math.max(
    0,
    peopleAhead * (selectedService.averageServiceTimeMinutes || 7)
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Top Breadcrumb & Switch to Staff View banner */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
        >
          ← Back to Dashboard
        </button>

        <button
          type="button"
          onClick={onOpenStaffPortal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 transition-all shadow-2xs cursor-pointer"
        >
          <span>Staff Counter Portal</span>
          <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
        </button>
      </div>

      {/* Primary Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Header with facility info */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                LIVE QUEUE FEED
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              {selectedService.office}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedService.building} • {selectedService.counterNumber || 'Counter 4'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/90 px-4 py-3 rounded-2xl border border-slate-700/80">
            <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Est. Wait</span>
              <span className="text-xl font-black text-white font-mono leading-none">
                {isBeingServed ? '0 min' : isCompleted ? 'Completed' : `~${estimatedWait} min`}
              </span>
            </div>
          </div>
        </div>

        {/* Serving Alert Banner if User's Token is Active */}
        {isBeingServed && (
          <div className="p-6 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-base font-black uppercase tracking-wide">
                  You're being served!
                </h4>
                <p className="text-xs text-emerald-100">
                  Please proceed directly to {selectedService.counterNumber || 'Counter 4'} with your documents.
                </p>
              </div>
            </div>
            <span className="text-2xl font-black font-mono bg-white text-emerald-800 px-3.5 py-1 rounded-xl shadow-md">
              #{userTokenNumber}
            </span>
          </div>
        )}

        {isCompleted && (
          <div className="p-4 bg-slate-100 border-b border-slate-200 text-slate-700 text-xs font-bold text-center">
            ✓ Your visit for Token #{userTokenNumber} is marked complete.
          </div>
        )}

        {/* SECTION 10: CONNECTED QUEUE PATH VISUALIZATION */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* NOW SERVING BEACON */}
          <div className="relative text-center p-6 rounded-3xl bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200/80 shadow-xs">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              NOW SERVING
            </span>

            <div className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight font-mono my-2">
              #{servingToken}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              At {selectedService.counterNumber || 'Counter 4'} • Document verification underway
            </p>
          </div>

          {/* CONNECTED QUEUE PATH */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>CONNECTED QUEUE TRACK</span>
              </h3>
              <span className="text-xs font-bold text-slate-600 font-mono">
                {waitingTokens.length} waiting
              </span>
            </div>

            {/* Visual connected vertical path */}
            <div className="relative pl-6 sm:pl-8 space-y-4">
              {/* Connected Line connecting tokens */}
              <div className="absolute left-[19px] sm:left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-400 via-indigo-300 to-slate-200 z-0" />

              {waitingTokens.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 text-center text-xs text-slate-500 border border-slate-200">
                  Queue is clear. No waiting tokens right now.
                </div>
              ) : (
                waitingTokens.map((tokenNum, idx) => {
                  const isUser = tokenNum === userTokenNumber;
                  return (
                    <div
                      key={tokenNum}
                      className={`relative z-10 flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                        isUser
                          ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 text-white border-indigo-700 shadow-xl ring-4 ring-indigo-500/20 scale-[1.02]'
                          : 'bg-white border-slate-200/90 text-slate-800 shadow-2xs hover:bg-slate-50'
                      }`}
                    >
                      {/* Token node with connected dot */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isUser
                              ? 'bg-emerald-400 text-slate-950 font-black ring-2 ring-white'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {isUser ? <Star className="w-3.5 h-3.5 fill-current" /> : idx + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-lg font-black font-mono tracking-tight ${
                                isUser ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              #{tokenNum}
                            </span>

                            {isUser && (
                              <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span>YOU</span>
                              </span>
                            )}
                          </div>

                          <span
                            className={`text-[11px] block mt-0.5 ${
                              isUser ? 'text-indigo-200 font-semibold' : 'text-slate-400'
                            }`}
                          >
                            {isUser
                              ? idx === 0
                                ? 'Next in line — proceed towards counter!'
                                : `${idx} person${idx > 1 ? 's' : ''} ahead of you`
                              : `Position #${idx + 1} in line`}
                          </span>
                        </div>
                      </div>

                      {/* Estimated wait badge */}
                      <div className="text-right">
                        <span
                          className={`text-xs font-bold font-mono ${
                            isUser ? 'text-emerald-300' : 'text-slate-600'
                          }`}
                        >
                          {isUser
                            ? `~${estimatedWait}m wait`
                            : `~${(idx + 1) * (selectedService.averageServiceTimeMinutes || 7)}m`}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Quick simulation helper footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 font-medium">
            Simulate counter desk advancing the queue:
          </span>
          <button
            type="button"
            onClick={() => staffServeNext()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>SERVE NEXT (Advance Queue)</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
