import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Sparkles,
  Ticket,
  Clock,
  ShieldAlert,
  UserCheck,
  Menu,
  X,
  ChevronDown,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';

interface HeaderProps {
  onOpenDemoToolbar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDemoToolbar }) => {
  const {
    activeView,
    setActiveView,
    activeTicket,
    simulatedTime,
    setSimulatedTime,
    services,
    setSelectedService,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Dashboard' },
    { id: 'services_catalog', label: 'Campus Services' },
    {
      id: 'my_visits',
      label: 'My Visits',
      badge: activeTicket ? `#${activeTicket.tokenNumber}` : null,
    },
    {
      id: 'staff_portal',
      label: 'Staff Portal',
      isStaff: true,
    },
  ];

  const handleNav = (id: string) => {
    setActiveView(id as any);
    setMobileMenuOpen(false);
  };

  const timeOptions = [
    { label: '2:30 PM (Midday)', value: '14:30' },
    { label: '3:20 PM (Normal Demo)', value: '15:20' },
    { label: '4:15 PM (Late Afternoon)', value: '16:15' },
    { label: '4:48 PM (Near Closing)', value: '16:48' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <span className="font-mono font-black text-lg">Q</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 font-sans group-hover:text-indigo-600 transition-colors">
                  QueueLess
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block leading-none -mt-0.5 hidden sm:block">
                Don't wait. Know when to go.
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                activeView === item.id ||
                (item.id === 'home' &&
                  ['service_detail', 'requirements', 'decision', 'timeline', 'alternative', 'queue_confirmation'].includes(
                    activeView
                  ));

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  } ${item.isStaff ? 'border border-dashed border-slate-300 ml-1' : ''}`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {item.isStaff && (
                    <span className="text-[9px] uppercase px-1 rounded bg-slate-200 text-slate-700">
                      Ops
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Utilities: Campus Time & Demo presets */}
          <div className="flex items-center gap-2">
            {/* Campus Time Simulator Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setTimePickerOpen(!timePickerOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                title="Adjust Simulated Campus Time"
              >
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-mono font-bold">{simulatedTime}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {timePickerOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Simulated Campus Time
                  </div>
                  {timeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSimulatedTime(opt.value);
                        setTimePickerOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                        simulatedTime === opt.value
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span className="font-mono text-[11px] text-slate-400">{opt.value}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Demo Presets Trigger */}
            {onOpenDemoToolbar && (
              <button
                type="button"
                onClick={onOpenDemoToolbar}
                className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                title="Quick Decision Testing Presets"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
