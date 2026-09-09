import React from 'react';
import { ConfidenceLevel, ActionLabel, ClinicalState } from '@/lib/types';
import { ShieldCheck, AlertCircle, HelpCircle, Eye, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

export function ConfidenceBadge({ confidence, minutesAgo }: { confidence: ConfidenceLevel; minutesAgo?: number }) {
  if (confidence === 'HIGH_CONFIDENCE') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/80 px-2 py-1 text-xs font-medium text-emerald-400 border border-emerald-800/60 font-mono">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        HIGH CONFIDENCE
        {minutesAgo !== undefined && (
          <span className="text-[10px] text-emerald-500/80">({minutesAgo}m ago via API)</span>
        )}
      </span>
    );
  }

  if (confidence === 'MEDIUM_CONFIDENCE') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/80 px-2 py-1 text-xs font-medium text-amber-400 border border-amber-800/60 font-mono">
        <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
        MEDIUM CONFIDENCE
        {minutesAgo !== undefined && (
          <span className="text-[10px] text-amber-500/80">({Math.round(minutesAgo / 60)}h ago partner)</span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-slate-400 border border-slate-700 font-mono">
      <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
      UNCONFIRMED
    </span>
  );
}

export function ClinicalStateBadge({ state, label }: { state: ClinicalState; label?: ActionLabel }) {
  const displayLabel = label || (state === 'NEEDS_REVIEW' ? 'REVIEW NOW' : state === 'DRIFT' ? 'WATCH' : state === 'COVERAGE_GAP' ? 'COVERAGE GAP' : state === 'RECOVERED' ? 'RECOVERED' : 'STABLE');

  if (state === 'NEEDS_REVIEW') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-950/90 px-3 py-1 text-xs font-bold text-rose-300 border border-rose-800 shadow-sm font-mono tracking-wide">
        <AlertTriangle className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
        {displayLabel}
      </span>
    );
  }

  if (state === 'DRIFT') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/90 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-800 font-mono tracking-wide">
        <Eye className="h-3.5 w-3.5 text-amber-400" />
        {displayLabel}
      </span>
    );
  }

  if (state === 'COVERAGE_GAP') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-950/90 px-3 py-1 text-xs font-bold text-purple-300 border border-purple-800 font-mono tracking-wide">
        <Radio className="h-3.5 w-3.5 text-purple-400" />
        {displayLabel}
      </span>
    );
  }

  if (state === 'RECOVERED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/90 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-800 font-mono tracking-wide">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
        {displayLabel}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-slate-300 border border-slate-700 font-mono tracking-wide">
      <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
      {displayLabel}
    </span>
  );
}
