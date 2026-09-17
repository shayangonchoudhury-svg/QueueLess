import React from 'react';
import { ServiceRequirement } from '../types';
import { Check, X, ShieldAlert, Sparkles } from 'lucide-react';

interface RequirementItemProps {
  requirement: ServiceRequirement;
  isReady: boolean;
  onToggle: () => void;
}

export const RequirementItem: React.FC<RequirementItemProps> = ({
  requirement,
  isReady,
  onToggle,
}) => {
  return (
    <div
      onClick={onToggle}
      className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
        isReady
          ? 'bg-white border-emerald-200/90 shadow-xs hover:border-emerald-300 hover:bg-emerald-50/20'
          : 'bg-rose-50/30 border-rose-200 shadow-xs hover:border-rose-300 hover:bg-rose-50/50'
      }`}
    >
      <div className="flex items-start gap-3.5 pr-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border transition-transform duration-150 group-hover:scale-105 active:scale-95 ${
            isReady
              ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs'
              : 'bg-rose-500 border-rose-600 text-white shadow-xs'
          }`}
          aria-label={isReady ? 'Mark as missing' : 'Mark as ready'}
        >
          {isReady ? (
            <Check className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <X className="w-5 h-5 stroke-[2.5]" />
          )}
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-bold text-base tracking-tight ${
                isReady ? 'text-slate-900' : 'text-slate-800 line-through decoration-rose-400 decoration-2'
              }`}
            >
              {requirement.name}
            </span>
            {requirement.isMandatory ? (
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                Required
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
                Optional
              </span>
            )}
          </div>
          {requirement.description && (
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              {requirement.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 ml-3">
        <button
          type="button"
          className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-colors shadow-xs ${
            isReady
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 group-hover:bg-emerald-200'
              : 'bg-rose-100 text-rose-800 border border-rose-200 group-hover:bg-rose-200'
          }`}
        >
          {isReady ? 'READY' : 'MISSING'}
        </button>
      </div>
    </div>
  );
};
