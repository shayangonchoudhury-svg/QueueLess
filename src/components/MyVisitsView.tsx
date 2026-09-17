import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Trash2,
  Building,
  Calendar,
  Sparkles,
  QrCode,
  MapPin,
  Footprints,
} from 'lucide-react';

interface MyVisitsViewProps {
  onViewLiveQueue: () => void;
  onExploreServices: () => void;
}

export const MyVisitsView: React.FC<MyVisitsViewProps> = ({
  onViewLiveQueue,
  onExploreServices,
}) => {
  const { activeTicket, servingToken, cancelQueueTicket } = useApp();

  const isServing = activeTicket && servingToken === activeTicket.tokenNumber;
  const isCompleted = activeTicket && servingToken > activeTicket.tokenNumber;
  const peopleAhead = activeTicket ? Math.max(0, activeTicket.tokenNumber - servingToken - 1) : 0;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          My Campus Visits
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Active virtual queue boarding passes and historical visit audits.
        </p>
      </div>

      {/* ACTIVE TICKET PASS */}
      {activeTicket ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Ticket className="w-3.5 h-3.5 text-indigo-500" />
              <span>ACTIVE VIRTUAL QUEUE PASS</span>
            </h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
              Live Synchronized
            </span>
          </div>

          {/* Premium Digital Queue Pass Card with Map Watermark & Notches */}
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-500/30 overflow-hidden">
            {/* Subtle Map Watermark Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-15">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,50 Q 200,180 500,40 T 900,160" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeDasharray="6 6" />
                <circle cx="20%" cy="40%" r="60" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="80%" cy="70%" r="90" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* Ticket Header */}
            <div className="relative z-10 p-6 sm:p-8 border-b border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                  DIGITAL PASS TOKEN
                </span>
                <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white mt-0.5 drop-shadow-sm">
                  #{activeTicket.tokenNumber}
                </div>
              </div>

              <div className="sm:text-right space-y-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs ${
                    isServing
                      ? 'bg-emerald-400 text-slate-950 animate-pulse'
                      : isCompleted
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/40'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isServing ? 'bg-slate-950' : 'bg-emerald-400'}`} />
                  {isServing ? 'NOW SERVING YOU' : isCompleted ? 'VISIT COMPLETED' : 'WAITING IN QUEUE'}
                </span>

                <p className="text-xs text-indigo-300 font-mono">
                  Issued at {activeTicket.issuedAt}
                </p>
              </div>
            </div>

            {/* Ticket Middle Section */}
            <div className="relative z-10 p-6 sm:p-8 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  SERVICE & COUNTER
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5 tracking-tight">
                  {activeTicket.serviceName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-indigo-200 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{activeTicket.officeName} • {activeTicket.building}</span>
                </div>
              </div>

              {/* Mini Queue Progress Visualization */}
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-indigo-300">
                  <span>Queue Turn Progress</span>
                  <span className="font-mono font-bold text-white">
                    {isServing ? 'At Counter' : `${peopleAhead} ahead`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-indigo-950/80 border border-indigo-800/80 p-0.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-emerald-400 transition-all duration-500"
                    style={{
                      width: isServing
                        ? '100%'
                        : isCompleted
                        ? '100%'
                        : `${Math.max(15, 100 - peopleAhead * 20)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Data Grid with physical pass look */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-indigo-900/40 border border-indigo-800/60 p-3 rounded-2xl">
                  <span className="text-indigo-400 text-[10px] font-bold uppercase block">Now Serving</span>
                  <span className="font-mono font-black text-lg text-white">#{servingToken}</span>
                </div>

                <div className="bg-indigo-900/40 border border-indigo-800/60 p-3 rounded-2xl">
                  <span className="text-indigo-400 text-[10px] font-bold uppercase block">People Ahead</span>
                  <span className="font-black text-lg text-white">{peopleAhead}</span>
                </div>

                <div className="bg-indigo-900/40 border border-indigo-800/60 p-3 rounded-2xl col-span-2 sm:col-span-1">
                  <span className="text-indigo-400 text-[10px] font-bold uppercase block">Recommended Walk</span>
                  <span className="font-bold text-base text-white">{activeTicket.recommendedDeparture}</span>
                </div>
              </div>
            </div>

            {/* Ticket Footer Actions */}
            <div className="relative z-10 p-6 sm:p-8 bg-black/30 border-t border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={onViewLiveQueue}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm text-slate-950 bg-white hover:bg-indigo-50 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open Live Queue Display</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={cancelQueueTicket}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl font-bold text-xs text-rose-300 hover:text-white hover:bg-rose-950/60 border border-rose-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel Virtual Pass</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-8 sm:p-12 rounded-3xl bg-white/95 border border-slate-200/90 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">No active queue tokens</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You don't currently have a waiting pass. Select a campus service to audit your documents and get an immediate visit decision.
          </p>
          <button
            type="button"
            onClick={onExploreServices}
            className="px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <span>Explore Campus Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Historical Visits / Verified Completed Visits */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
          HISTORICAL CAMPUS VISITS
        </h2>

        <div className="bg-white/95 rounded-3xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Bonafide Certificate</h4>
                <p className="text-xs text-slate-500">Student Service Centre • Completed in 12m</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-600 block">Yesterday</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Served at Counter 2</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Tuition Semester Payment</h4>
                <p className="text-xs text-slate-500">Finance Office • Completed in 8m</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-600 block">3 days ago</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Challan Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
