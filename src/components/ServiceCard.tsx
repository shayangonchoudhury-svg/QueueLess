import React from 'react';
import { CampusService } from '../types';
import {
  GraduationCap,
  FileCheck,
  CreditCard,
  BadgeAlert,
  ScrollText,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  Footprints,
  DoorClosed,
} from 'lucide-react';

interface ServiceCardProps {
  service: CampusService;
  isSelected?: boolean;
  onSelect: (service: CampusService) => void;
  onCheckForMe?: (service: CampusService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected = false,
  onSelect,
  onCheckForMe,
}) => {
  // Dynamic icon mapping with distinctive container styling
  const renderIcon = () => {
    switch (service.iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-indigo-600" />;
      case 'FileCheck':
        return <FileCheck className="w-6 h-6 text-emerald-600" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-amber-600" />;
      case 'BadgeAlert':
        return <BadgeAlert className="w-6 h-6 text-rose-600" />;
      case 'ScrollText':
        return <ScrollText className="w-6 h-6 text-sky-600" />;
      default:
        return <FileCheck className="w-6 h-6 text-indigo-600" />;
    }
  };

  // Selective accent color depending on queue condition
  const getQueueTheme = () => {
    if (service.queueCount <= 6) {
      return {
        level: 'LOW QUEUE',
        accentBorder: 'hover:border-emerald-300',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/90',
        dotBg: 'bg-emerald-500',
        barActive: 'bg-emerald-500',
        glow: 'group-hover:shadow-emerald-500/10',
      };
    }
    if (service.queueCount <= 15) {
      return {
        level: 'MODERATE',
        accentBorder: 'hover:border-amber-300',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200/90',
        dotBg: 'bg-amber-500',
        barActive: 'bg-amber-500',
        glow: 'group-hover:shadow-amber-500/10',
      };
    }
    return {
      level: 'HIGH QUEUE',
      accentBorder: 'hover:border-rose-300',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200/90',
      dotBg: 'bg-rose-500',
      barActive: 'bg-rose-500',
      glow: 'group-hover:shadow-rose-500/10',
    };
  };

  const theme = getQueueTheme();
  const estimatedWait = Math.round(
  service.queueCount * service.averageServiceTimeMinutes
);

  return (
    <div
      onClick={() => onSelect(service)}
      className={`group relative flex flex-col justify-between p-6 rounded-3xl border bg-white/95 backdrop-blur-xs transition-all duration-300 cursor-pointer text-left ${
        isSelected
          ? 'border-indigo-600 ring-2 ring-indigo-500/25 shadow-lg'
          : `border-slate-200/90 hover:-translate-y-1 hover:shadow-xl ${theme.accentBorder} ${theme.glow}`
      }`}
    >
      <div>
        {/* Top bar: Icon & Queue Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-sm">
            {renderIcon()}
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${theme.badgeBg}`}
          >
            <span className={`w-2 h-2 rounded-full ${theme.dotBg} animate-pulse`} />
            <span className="font-mono font-black">{service.queueCount}</span>
            <span>waiting</span>
          </span>
        </div>

        {/* Title and Location */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
          {service.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">{service.office} • {service.block}</span>
        </div>
      </div>

      {/* Metrics, mini queue visualization and closing time */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{service.queueCount} people in line</span>
          </div>
          <div className="flex items-center gap-1 text-slate-900 font-bold">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>~{estimatedWait} min wait</span>
          </div>
        </div>

        {/* Mini queue visualization */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1 overflow-hidden h-2 rounded-full bg-slate-100 p-0.5">
            {Array.from({ length: 12 }).map((_, idx) => {
              const isFilled = idx < Math.min(12, Math.ceil((service.queueCount / 24) * 12));
              return (
                <div
                  key={idx}
                  className={`h-full flex-1 rounded-full transition-all duration-300 ${
                    isFilled ? theme.barActive : 'bg-transparent'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <DoorClosed className="w-3 h-3 text-slate-400" />
              Closes {service.closingTime}
            </span>
            <span className="flex items-center gap-1">
              <Footprints className="w-3 h-3 text-slate-400" />
              {service.travelTimeMinutes} min walk
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onCheckForMe) {
              onCheckForMe(service);
            } else {
              onSelect(service);
            }
          }}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-indigo-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white shadow-2xs group-hover:shadow-md cursor-pointer"
        >
          <span>Check requirements & timing</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
