'use client';

import React from 'react';
import { ConfidenceLevel } from '@/lib/types';
import { ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function ConfidenceBadge({ confidence, minutesAgo }: { confidence: ConfidenceLevel; minutesAgo?: number }) {
  if (confidence === 'HIGH_CONFIDENCE') {
    return (
      <motion.span
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/90 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-800/80 shadow-sm font-mono tracking-wide"
      >
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        HIGH CONFIDENCE
        {minutesAgo !== undefined && (
          <span className="text-[10px] text-emerald-400/80">({minutesAgo}m ago via API)</span>
        )}
      </motion.span>
    );
  }

  if (confidence === 'MEDIUM_CONFIDENCE') {
    return (
      <motion.span
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/90 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-800/80 font-mono tracking-wide"
      >
        <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
        MEDIUM CONFIDENCE
        {minutesAgo !== undefined && (
          <span className="text-[10px] text-amber-400/80">({Math.round(minutesAgo / 60)}h ago partner)</span>
        )}
      </motion.span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-slate-400 border border-slate-700 font-mono tracking-wide">
      <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
      UNCONFIRMED
    </span>
  );
}
