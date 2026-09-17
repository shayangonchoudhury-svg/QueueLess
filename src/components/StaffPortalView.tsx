import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Building,
  RotateCcw,
  Sliders,
  ExternalLink,
  Plus,
  Minus,
  Activity,
  Radio,
} from 'lucide-react';

interface StaffPortalViewProps {
  onReturnToLiveQueue: () => void;
  onReturnToDashboard: () => void;
}

export const StaffPortalView: React.FC<StaffPortalViewProps> = ({
  onReturnToLiveQueue,
  onReturnToDashboard,
}) => {
  const {
    services,
    selectedService,
    setSelectedService,
    servingToken,
    waitingTokens,
    staffServeNext,
    activeTicket,
    updateQueueCount,
  } = useApp();

  const userTokenNumber = activeTicket?.tokenNumber ?? 42;
  const isUserBeingServed = servingToken === userTokenNumber;

  const peopleWaiting = waitingTokens.length;
  const averageWait = Math.round(peopleWaiting * (selectedService.averageServiceTimeMinutes || 7));
  const serviceTime = selectedService.averageServiceTimeMinutes || 10;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Staff Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              OPERATIONS CONSOLE
            </span>
            <span className="text-xs text-slate-500 font-medium">• Counter Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Staff Dispatch Station
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {activeTicket && (
            <button
              type="button"
              onClick={onReturnToLiveQueue}
              className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>View Student Live Feed</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onReturnToDashboard}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 transition-colors shadow-2xs cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Main Staff Card */}
      <div className="rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden bg-white">
        {/* DARK UPPER OPERATIONS PANEL */}
        <div className="p-6 sm:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
          {/* Subtle Grid / Telemetry Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-campus-grid" />

          {/* Facility Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 block tracking-wider">
                  ACTIVE DESK
                </span>
                <h3 className="text-lg font-black text-white">{selectedService.office}</h3>
              </div>
            </div>

            {/* Quick facility switch */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Switch Facility:</span>
              <select
                value={selectedService.id}
                onChange={(e) => {
                  const found = services.find((s) => s.id === e.target.value);
                  if (found) setSelectedService(found);
                }}
                className="bg-slate-900/90 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {services.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.office} ({svc.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Serving Alert Banner if student is active */}
          {isUserBeingServed && (
            <div className="relative z-10 my-4 p-4 rounded-2xl bg-emerald-500 text-white text-center font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg animate-pulse">
              <CheckCircle2 className="w-5 h-5" />
              <span>Currently Serving Student Token #{userTokenNumber} (Alex Rivera) at Counter!</span>
            </div>
          )}

          {/* Counter Centerpiece: NOW SERVING + SERVE NEXT ACTION */}
          <div className="relative z-10 py-8 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-600/40 shadow-inner mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              NOW SERVING
            </div>

            <div className="text-7xl sm:text-9xl font-black text-white tracking-tight font-mono my-2 drop-shadow-md">
              #{servingToken}
            </div>

            <p className="text-xs text-indigo-200 font-medium">
              Station {selectedService.counterNumber || 'Counter 4'} • Active Student Verification
            </p>

            {/* Big SERVE NEXT Primary Button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={() => staffServeNext()}
                className="w-full sm:w-auto px-12 py-5 rounded-2xl font-black text-base uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
              >
                <span>SERVE NEXT TICKET</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Advances queue, updates student waiting pass, and marks current token finished.
              </p>
            </div>
          </div>

          {/* Telemetry Numbers Inside Operations Panel */}
          <div className="relative z-10 grid grid-cols-3 gap-3 pt-6 border-t border-slate-800 text-center">
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">People Waiting</span>
              <div className="text-2xl font-black text-white mt-0.5">{peopleWaiting}</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg. Wait</span>
              <div className="text-2xl font-black text-white mt-0.5">{averageWait}m</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Service</span>
              <div className="text-2xl font-black text-white mt-0.5">{serviceTime}m</div>
            </div>
          </div>
        </div>

        {/* BRIGHT LOWER QUEUE WORKSPACE */}
        <div className="p-6 sm:p-8 bg-slate-50 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                ACTIVE QUEUE WORKSPACE
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Waiting line ordered by time of arrival
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              {waitingTokens.length} students waiting
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {waitingTokens.map((tok, idx) => {
              const isUser = tok === userTokenNumber;
              return (
                <div
                  key={tok}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    isUser
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400/30'
                      : 'bg-white text-slate-800 border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="text-lg font-black font-mono">#{tok}</div>
                  <span
                    className={`text-[11px] block mt-1 font-semibold ${
                      isUser ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {isUser ? '★ Student You' : `Position ${idx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Queue Size Simulator for Testing */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold">Simulate Counter Congestion Level:</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQueueCount(selectedService.id, 7)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-bold hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Queue = 7 (Optimal flow)
              </button>
              <button
                type="button"
                onClick={() => updateQueueCount(selectedService.id, 24)}
                className="px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 font-bold text-amber-900 hover:bg-amber-200 cursor-pointer"
              >
                Queue = 24 (Triggers WAIT)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
