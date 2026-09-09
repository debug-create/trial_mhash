'use client';

import React, { useState } from 'react';
import { LayerBCauseHypothesis } from '@/lib/types';
import { CheckCircle2, XCircle, HelpCircle, ShieldAlert, GitCommit } from 'lucide-react';

interface HypothesisTreeProps {
  hypotheses: LayerBCauseHypothesis[];
}

export function HypothesisTree({ hypotheses }: HypothesisTreeProps) {
  const [selectedCause, setSelectedCause] = useState<string>(hypotheses[0]?.causeName || '');

  const current = hypotheses.find((h) => h.causeName === selectedCause) || hypotheses[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">
              LAYER B — CAUSE & EVIDENCE MODEL
            </span>
            <span className="text-xs text-slate-400">Explicit Deterministic Rule Graph</span>
          </div>
          <h3 className="text-base font-semibold text-slate-100 mt-1 flex items-center gap-2">
            Clinical Hypothesis & Evidence Assessment
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Non-SHAP Derived</span>
      </div>

      {/* Cause Selector Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-1">
        {hypotheses.map((h) => {
          const isSelected = h.causeName === selectedCause;
          return (
            <button
              key={h.causeName}
              onClick={() => setSelectedCause(h.causeName)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all whitespace-nowrap flex items-center space-x-2 ${
                isSelected
                  ? 'bg-purple-950 text-purple-300 border-purple-700 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5 text-purple-400" />
              <span>{h.title}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  h.assessment === 'HIGH_CERTAINTY'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : h.assessment === 'PLAUSIBLE'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {h.assessment}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Hypothesis Detail */}
      {current && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-100">{current.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{current.assessmentReason}</p>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold font-mono border ${
                current.assessment === 'HIGH_CERTAINTY'
                  ? 'bg-rose-950 text-rose-400 border-rose-800'
                  : current.assessment === 'PLAUSIBLE'
                  ? 'bg-amber-950 text-amber-400 border-amber-800'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {current.assessment}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supporting Evidence */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-emerald-950/60">
              <h5 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Supporting Evidence ({current.supportingEvidence.length})
              </h5>
              {current.supportingEvidence.length > 0 ? (
                <div className="space-y-2">
                  {current.supportingEvidence.map((item) => (
                    <div key={item.id} className="text-xs bg-slate-950 p-2.5 rounded border border-slate-800">
                      <p className="text-slate-200 font-medium">{item.text}</p>
                      <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-500 font-mono">
                        <span className="text-emerald-400/90">{item.provenance}</span>
                        <span>Source: {item.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No supporting evidence logged.</p>
              )}
            </div>

            {/* Contradicting Evidence */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-rose-950/60">
              <h5 className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 mb-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                Contradicting Evidence ({current.contradictingEvidence.length})
              </h5>
              {current.contradictingEvidence.length > 0 ? (
                <div className="space-y-2">
                  {current.contradictingEvidence.map((item) => (
                    <div key={item.id} className="text-xs bg-slate-950 p-2.5 rounded border border-slate-800">
                      <p className="text-slate-200 font-medium">{item.text}</p>
                      <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-500 font-mono">
                        <span className="text-rose-400/90">{item.provenance}</span>
                        <span>Source: {item.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No contradicting evidence identified.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
