import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Flame,
  X,
} from 'lucide-react';

interface DemoTestBannerProps {
  onClose?: () => void;
}

export const DemoTestBanner: React.FC<DemoTestBannerProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const {
    applyDemoPreset,
    resetAllToDefault,
    staffServeNext,
    servingToken,
    userDocuments,
    selectedService,
    currentDecision,
    setActiveView,
    activeTicket,
  } = useApp();

  return (
    <div className="fixed bottom-3 right-3 sm:right-6 z-50 max-w-lg w-full sm:w-auto animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-slate-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden">
        {/* Banner Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 text-xs font-bold">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="uppercase tracking-wider text-emerald-400 font-extrabold">
              Dev Test Evaluator
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              Current: {currentDecision.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                title="Dismiss panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-3.5 space-y-3 text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Quick-Test Core Decisions:</span>
              <button
                type="button"
                onClick={() => resetAllToDefault()}
                className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>

            {/* Decision Test Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {/* Preset 1: GO */}
              <button
                type="button"
                onClick={() => {
                  applyDemoPreset('normal_go');
                  setActiveView('decision');
                }}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  currentDecision.status === 'GO'
                    ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400'
                    : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-extrabold text-[11px]">1. Test GO</span>
                <span className="text-[9px] text-slate-400">4/4 Ready</span>
              </button>

              {/* Preset 2: DONT_GO (Missing Requirement) */}
              <button
                type="button"
                onClick={() => {
                  applyDemoPreset('missing_photo');
                  setActiveView('decision');
                }}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  currentDecision.status === 'DONT_GO' && !currentDecision.isClosingRisk
                    ? 'bg-rose-600/30 border-rose-400 text-rose-200 ring-1 ring-rose-400'
                    : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="font-extrabold text-[11px]">2. Missing Doc</span>
                <span className="text-[9px] text-slate-400">No Photo → 🔴</span>
              </button>

              {/* Preset 3: WAIT (Queue > 20) */}
              <button
                type="button"
                onClick={() => {
                  applyDemoPreset('crowded_wait');
                  setActiveView('decision');
                }}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  currentDecision.status === 'WAIT'
                    ? 'bg-amber-600/30 border-amber-400 text-amber-200 ring-1 ring-amber-400'
                    : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-extrabold text-[11px]">3. Test WAIT</span>
                <span className="text-[9px] text-slate-400">Queue &gt; 20 → 🟡</span>
              </button>

              {/* Preset 4: DONT_GO (Office Closes) */}
              <button
                type="button"
                onClick={() => {
                  applyDemoPreset('near_closing');
                  setActiveView('decision');
                }}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  currentDecision.status === 'DONT_GO' && currentDecision.isClosingRisk
                    ? 'bg-rose-600/30 border-rose-400 text-rose-200 ring-1 ring-rose-400'
                    : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="font-extrabold text-[11px]">4. Closing Soon</span>
                <span className="text-[9px] text-slate-400">Late trip → 🔴</span>
              </button>
            </div>

            {/* Quick Live Queue Sync Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">
                Active: <span className="font-mono text-white font-bold">#{servingToken}</span>
              </span>
              <button
                type="button"
                onClick={() => staffServeNext()}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <span>Call Next Ticket</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
