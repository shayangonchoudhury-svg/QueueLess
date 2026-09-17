import React from 'react';
import { useApp } from '../context/AppContext';
import { RequirementItem } from './RequirementItem';
import {
  Users,
  Clock,
  Footprints,
  DoorClosed,
  Hourglass,
  Building,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';

interface ServiceDetailViewProps {
  onCheckMyVisit: () => void;
  onBack: () => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  onCheckMyVisit,
  onBack,
}) => {
  const {
    selectedService,
    userDocuments,
    toggleRequirement,
    setDocumentState,
    simulatedTime,
    currentDecision,
  } = useApp();

  const totalReqs = selectedService.requirements.length;
  const readyCount = selectedService.requirements.filter(
    (r) => userDocuments[r.id]
  ).length;
  const allMandatoryReady = selectedService.requirements
    .filter((r) => r.isMandatory)
    .every((r) => userDocuments[r.id]);

  const estimatedWait = Math.round(
    (selectedService.queueCount * selectedService.averageServiceTimeMinutes) /
      (selectedService.activeCounters || 1)
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
      >
        ← Back to Campus Services
      </button>

      {/* Main Service Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Building className="w-4 h-4" />
            <span>{selectedService.office} • {selectedService.block}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {selectedService.name}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {selectedService.building} • Designated {selectedService.counterNumber || 'Counter 4'}
          </p>
        </div>

        {/* SCREEN 2 Metrics Bar: Current queue, Estimated wait, Average service time, Office closes, Travel time */}
        <div className="p-6 sm:p-8 bg-slate-50/60 border-b border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                Current queue
              </span>
              <p className="text-lg font-black text-slate-900 mt-1">
                {selectedService.queueCount} people
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1">
                <Hourglass className="w-3.5 h-3.5 text-slate-400" />
                Estimated wait
              </span>
              <p className="text-lg font-black text-slate-900 mt-1">
                {estimatedWait} min
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Avg service
              </span>
              <p className="text-lg font-black text-slate-900 mt-1">
                {selectedService.averageServiceTimeMinutes} min
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1">
                <DoorClosed className="w-3.5 h-3.5 text-slate-400" />
                Office closes
              </span>
              <p className="text-lg font-black text-slate-900 mt-1">
                {selectedService.closingTime}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-slate-400" />
                Travel time
              </span>
              <p className="text-lg font-black text-slate-900 mt-1">
                {selectedService.travelTimeMinutes} min walk
              </p>
            </div>
          </div>
        </div>

        {/* SCREEN 3: REQUIREMENTS SECTION */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Before you go...
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Toggle your physical or digital documents to verify counter readiness.
              </p>
            </div>

            {/* Ready counter indicator */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div
                className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-2xs ${
                  readyCount === totalReqs
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                {readyCount === totalReqs ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <FileCheck2 className="w-4 h-4 text-amber-600" />
                )}
                <span>
                  {readyCount} / {totalReqs} ready
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Requirements List */}
          <div className="space-y-3">
            {selectedService.requirements.map((req) => (
              <RequirementItem
                key={req.id}
                requirement={req}
                isReady={!!userDocuments[req.id]}
                onToggle={() => toggleRequirement(req.id)}
              />
            ))}
          </div>

          {/* Quick toggle helpers */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
            <span>Click any document above to toggle READY or MISSING.</span>
            <button
              type="button"
              onClick={() => {
                selectedService.requirements.forEach((r) => setDocumentState(r.id, true));
              }}
              className="text-indigo-600 font-bold hover:underline"
            >
              Mark all ready
            </button>
          </div>
        </div>

        {/* Primary Action Button: "Check my visit" */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Current campus time: <span className="font-bold text-slate-800 font-mono">{simulatedTime}</span>
          </div>

          <button
            type="button"
            onClick={onCheckMyVisit}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-3 active:scale-98"
          >
            <span>Check my visit</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
