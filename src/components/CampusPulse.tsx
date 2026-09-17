import React from 'react';
import { useApp } from '../context/AppContext';
import { Radio, Users, Clock, ArrowUpRight, ArrowDownRight, Minus, Sparkles, Building2, Share2, Compass } from 'lucide-react';

export const CampusPulse: React.FC = () => {
  const { pulseHubs, selectServiceAndNavigate, services } = useApp();

  const getStatusBadge = (status: 'optimal' | 'moderate' | 'congested') => {
    switch (status) {
      case 'optimal':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          ring: 'border-emerald-300',
          label: 'Normal Flow',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          ring: 'border-amber-300',
          label: 'Moderate Traffic',
        };
      case 'congested':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          ring: 'border-rose-300',
          label: 'Congested',
        };
    }
  };

  const getTrendIcon = (trend: 'rising' | 'falling' | 'stable') => {
    switch (trend) {
      case 'rising':
        return (
          <span className="flex items-center gap-0.5 text-rose-600 text-[11px] font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>Surging</span>
          </span>
        );
      case 'falling':
        return (
          <span className="flex items-center gap-0.5 text-emerald-600 text-[11px] font-bold">
            <ArrowDownRight className="w-3 h-3" />
            <span>Clearing</span>
          </span>
        );
      case 'stable':
        return (
          <span className="flex items-center gap-0.5 text-slate-400 text-[11px] font-medium">
            <Minus className="w-3 h-3" />
            <span>Steady</span>
          </span>
        );
    }
  };

  return (
    <section className="relative rounded-3xl p-6 sm:p-8 bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-md overflow-hidden space-y-6">
      {/* Faint Route/Map-like Topology Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="25%" y1="20%" x2="75%" y2="80%" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="20%" cy="50%" r="5" fill="#6366f1" />
          <circle cx="45%" cy="50%" r="5" fill="#6366f1" />
          <circle cx="70%" cy="50%" r="5" fill="#6366f1" />
          <circle cx="90%" cy="50%" r="5" fill="#6366f1" />
        </svg>
      </div>

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-700">
              LIVE CAMPUS PULSE
            </h2>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">• Network Topology</span>
          </div>
          <p className="text-sm font-bold text-slate-900 mt-0.5">
            Connected Campus Operations Telemetry
          </p>
        </div>

        {/* Honest Simulated Campus Environment Notice */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Simulated campus environment</span>
        </div>
      </div>

      {/* Connected Network Nodes Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pulseHubs.map((hub) => {
          const status = getStatusBadge(hub.status);
          const matchedService = services.find((s) => s.office === hub.name);

          return (
            <div
              key={hub.id}
              onClick={() => {
                if (matchedService) {
                  selectServiceAndNavigate(matchedService, 'service_detail');
                }
              }}
              className={`relative p-5 rounded-2xl border bg-white/95 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                matchedService ? 'cursor-pointer hover:border-indigo-400' : 'border-slate-200/80'
              }`}
            >
              {/* Top Node Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {hub.building}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 truncate mt-0.5">
                    {hub.name}
                  </h4>
                </div>
                <div>{getTrendIcon(hub.trend)}</div>
              </div>

              {/* Occupancy and Wait Numbers */}
              <div className="flex items-baseline justify-between py-2 border-y border-slate-100/90">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.dot} opacity-75`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${status.dot}`} />
                  </span>
                  <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                    {hub.currentWaiting}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold ml-0.5">waiting</span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800">
                    ~{hub.estimatedWaitMinutes} min
                  </span>
                  <span className="text-[10px] text-slate-400 block -mt-0.5">est. wait</span>
                </div>
              </div>

              {/* Status footer with connection pulse */}
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span
                  className={`inline-flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-md border ${status.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>

                {matchedService && (
                  <span className="text-indigo-600 font-bold text-[10px] hover:underline">
                    View Counter →
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
