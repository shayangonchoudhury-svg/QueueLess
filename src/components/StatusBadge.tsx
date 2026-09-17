import React from 'react';
import { DecisionStatus } from '../types';
import { CheckCircle2, Clock, AlertOctagon } from 'lucide-react';

interface StatusBadgeProps {
  status: DecisionStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const config = {
    GO: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'GO',
      icon: CheckCircle2,
      pulse: 'ring-emerald-400',
    },
    WAIT: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      label: 'WAIT',
      icon: Clock,
      pulse: 'ring-amber-400',
    },
    DONT_GO: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500',
      label: "DON'T GO",
      icon: AlertOctagon,
      pulse: 'ring-rose-400',
    },
  }[status];

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 font-semibold gap-1.5',
    md: 'text-sm px-3.5 py-1 font-bold gap-2',
    lg: 'text-base px-4 py-1.5 font-bold gap-2.5',
  }[size];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs transition-colors ${config.bg} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      {showIcon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      <span className="tracking-wide whitespace-nowrap">{config.label}</span>
    </span>
  );
};
