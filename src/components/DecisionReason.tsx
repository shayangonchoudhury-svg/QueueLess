import React from 'react';
import { DecisionReasonDetail } from '../types';
import { Check, AlertTriangle, X } from 'lucide-react';

interface DecisionReasonProps {
  reason: DecisionReasonDetail;
}

export const DecisionReason: React.FC<DecisionReasonProps> = ({ reason }) => {
  const iconConfig = {
    pass: {
      bg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: Check,
    },
    warn: {
      bg: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: AlertTriangle,
    },
    fail: {
      bg: 'bg-rose-100 text-rose-700 border-rose-200',
      icon: X,
    },
  }[reason.status];

  const Icon = iconConfig.icon;

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-50 transition-colors">
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border mt-0.5 ${iconConfig.bg}`}
      >
        <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 leading-tight">
          {reason.label}
        </p>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          {reason.detail}
        </p>
      </div>
    </div>
  );
};
