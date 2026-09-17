import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCard } from './ServiceCard';
import { CampusPulse } from './CampusPulse';
import { CampusService } from '../types';
import {
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building,
  MapPin,
  TrendingDown,
  Users,
  Footprints,
  DoorClosed,
  Navigation,
  Compass,
  CornerDownLeft,
} from 'lucide-react';

interface HomeLandingViewProps {
  onServiceSelect: (service: CampusService) => void;
  onCheckForMe: (service: CampusService) => void;
}

export const HomeLandingView: React.FC<HomeLandingViewProps> = ({
  onServiceSelect,
  onCheckForMe,
}) => {
  const { services, selectServiceAndNavigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const suggestions = [
    'Migration Certificate',
    'Bonafide Certificate',
    'Fee Payment',
    'Student ID Replacement',
    'Transcript Request',
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();

    // Find closest service match
    const matched =
      services.find(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.office.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query)
      ) || services[0];

    onCheckForMe(matched);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    const matched = services.find((s) => s.name.toLowerCase() === suggestion.toLowerCase());
    if (matched) {
      onCheckForMe(matched);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 py-2 sm:py-6">
      {/* HERO SECTION WITH ABSTRACT TRANSIT PATH & FLOATING TELEMETRY */}
      <section className="relative rounded-3xl p-6 sm:p-12 border border-indigo-100/80 bg-gradient-to-b from-white/95 via-white/85 to-indigo-50/20 shadow-sm backdrop-blur-md overflow-hidden">
        {/* Subtle Decorative Campus Route Vectors Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {/* Abstract campus transit arcs */}
            <path
              d="M -50,180 C 150,40 350,220 600,120 S 950,260 1200,80"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="2.5"
              strokeDasharray="6 8"
            />
            <path
              d="M -20,280 C 220,160 480,320 780,210 S 1050,150 1300,240"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Floating Telemetry Badge 1: 7 waiting */}
        <div className="hidden lg:flex items-center gap-2.5 absolute top-10 left-10 p-3 rounded-2xl bg-white/95 border border-indigo-100 shadow-md backdrop-blur-md animate-float-1 z-10">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-slate-900">7 waiting</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Academic Admin • est.</span>
          </div>
        </div>

        {/* Floating Telemetry Badge 2: 22 min wait */}
        <div className="hidden lg:flex items-center gap-2.5 absolute top-12 right-12 p-3 rounded-2xl bg-white/95 border border-amber-100 shadow-md backdrop-blur-md animate-float-2 z-10">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900">22 min</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 rounded">est. wait</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Fast-moving line</span>
          </div>
        </div>

        {/* Floating Telemetry Badge 3: 14 min walk */}
        <div className="hidden lg:flex items-center gap-2.5 absolute bottom-12 left-12 p-3 rounded-2xl bg-white/95 border border-sky-100 shadow-md backdrop-blur-md animate-float-3 z-10">
          <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
            <Footprints className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900">14 min walk</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Library to Block A</span>
          </div>
        </div>

        {/* Floating Telemetry Badge 4: Open until 5:00 PM */}
        <div className="hidden lg:flex items-center gap-2.5 absolute bottom-14 right-10 p-3 rounded-2xl bg-white/95 border border-emerald-100 shadow-md backdrop-blur-md animate-float-1 z-10">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <DoorClosed className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900">Open until 5:00 PM</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Ample buffer time</span>
          </div>
        </div>

        {/* Hero Content Center */}
        <div className="relative z-20 text-center max-w-3xl mx-auto space-y-6">
          {/* Subtle Abstract Route Indicator Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-200/80 text-indigo-800 text-xs font-bold tracking-wide shadow-2xs">
            <div className="flex items-center gap-1 text-[11px] font-mono text-indigo-700">
              <span>You</span>
              <span>→</span>
              <span>Campus Path</span>
              <span>→</span>
              <span>Queue Counter</span>
              <span>→</span>
              <span className="text-emerald-700 font-bold">Served</span>
            </div>
          </div>

          {/* Hero Headline */}
          <div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] font-sans">
              Don't wait.<br />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 bg-clip-text text-transparent">
                Know when to go.
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Tell QueueLess what you need to get done. We'll check the requirements, queue and timing before you make the trip.
          </p>

          {/* Elevated Large Search Input Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-3xl border-2 border-indigo-200/90 shadow-xl shadow-indigo-500/8 hover:border-indigo-400 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-500/15 transition-all"
            >
              <div className="flex items-center gap-3 w-full pl-4 py-2 sm:py-0">
                <Search className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you need to get done?"
                  className="w-full text-base sm:text-lg font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto pr-1">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-98 flex-shrink-0 cursor-pointer"
                >
                  <span>Check for me</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Suggestions */}
            <div className="flex items-center justify-center gap-2 flex-wrap mt-4 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                Try checking:
              </span>
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className="px-3 py-1 rounded-full bg-white/90 hover:bg-indigo-50 border border-slate-200/90 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Quick 3-Pillar Confidence Strip */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                🟢
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Document Check</div>
                <div className="text-[11px] text-slate-500">Flags missing forms first</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                🟡
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Queue Congestion</div>
                <div className="text-[11px] text-slate-500">Delays departure if jammed</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                🔴
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Closing Guard</div>
                <div className="text-[11px] text-slate-500">Prevents locked door trips</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAMPUS SERVICES SECTION */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
                CAMPUS HUB DIRECTORY
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              CAMPUS SERVICES
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md sm:text-right">
            Select a service to verify required paperwork, live line status, and the optimal departure window.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={onServiceSelect}
              onCheckForMe={onCheckForMe}
            />
          ))}
        </div>
      </section>

      {/* LIVE CAMPUS PULSE SECTION */}
      <CampusPulse />
    </div>
  );
};
