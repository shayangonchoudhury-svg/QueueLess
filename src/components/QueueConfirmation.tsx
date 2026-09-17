import React from 'react';
import { QueueTicket } from '../types';
import { Ticket, Users, Clock, Footprints, ArrowRight, CheckCircle2, QrCode } from 'lucide-react';

interface QueueConfirmationProps {
  ticket: QueueTicket;
  onViewLiveQueue: () => void;
  onGoHome: () => void;
}

export const QueueConfirmation: React.FC<QueueConfirmationProps> = ({
  ticket,
  onViewLiveQueue,
  onGoHome,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden text-center">
        {/* Top green confirmation banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent border-b border-slate-100">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-4 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            You're in the queue!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Your spot has been secured. We'll track your queue movement in real-time.
          </p>
        </div>

        {/* The Digital Token Card */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-700/40 overflow-hidden">
            {/* Background subtle watermark */}
            <div className="absolute -right-6 -bottom-8 opacity-10 pointer-events-none">
              <Ticket className="w-48 h-48" />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-indigo-300 mb-4">
              <span className="uppercase tracking-widest">DIGITAL PASS</span>
              <span className="font-mono bg-indigo-800/60 px-2.5 py-1 rounded-md border border-indigo-700/50">
                {ticket.ticketId}
              </span>
            </div>

            <div className="py-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-200 block">
                YOUR TOKEN
              </span>
              <div className="text-5xl sm:text-6xl font-black tracking-tight font-mono text-white mt-1">
                TOKEN #{ticket.tokenNumber}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-800/80 text-left">
              <div className="text-base font-bold text-white">{ticket.serviceName}</div>
              <div className="text-xs text-indigo-300 font-medium">
                {ticket.officeName} • {ticket.building}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 uppercase">
                <Users className="w-3 h-3 text-slate-400" />
                <span>Ahead</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                {ticket.initialQueuePosition} people
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-500 uppercase">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Est. Wait</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                {ticket.estimatedWaitMinutes} min
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-800 uppercase">
                <Footprints className="w-3 h-3 text-amber-600" />
                <span>Depart</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold text-amber-950 font-mono mt-1">
                {ticket.recommendedDeparture}
              </p>
            </div>
          </div>

          {/* View Live Queue Button */}
          <button
            type="button"
            onClick={onViewLiveQueue}
            className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <span>View live queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
