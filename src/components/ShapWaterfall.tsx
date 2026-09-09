'use client';

import React from 'react';
import { LayerAShapFeature } from '@/lib/types';
import { TrendingUp, Info } from 'lucide-react';

interface ShapWaterfallProps {
  driftRiskPercent: number;
  shapFeatures: LayerAShapFeature[];
}

export function ShapWaterfall({ driftRiskPercent, shapFeatures }: ShapWaterfallProps) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              LAYER A — ADHERENCE DRIFT RISK MODEL
            </span>
            <span className="text-xs text-slate-400">Calibrated Logistic Regression</span>
          </div>
          <h3 className="text-base font-semibold text-slate-100 mt-1 flex items-center gap-2">
            SHAP Risk Score Explanation
          </h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 font-mono">Calibrated Risk Score</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">{driftRiskPercent}%</div>
        </div>
      </div>

      <div className="mb-3 text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 flex items-start space-x-2">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <span>
          <strong>Technical Note:</strong> SHAP values explain feature contributions to the <em>risk score</em>, nothing more. Causality is evaluated separately in Layer B.
        </span>
      </div>

      <div className="space-y-3">
        {shapFeatures.map((feat, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                {feat.featureName}
                <span className="text-slate-500 font-normal text-[11px]">({feat.description})</span>
              </span>
              <span className="font-mono font-bold text-cyan-400">+{feat.impactPercent}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, feat.impactPercent * 2.5)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
