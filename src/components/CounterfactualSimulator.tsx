'use client';

import React, { useState } from 'react';
import { Patient } from '@/lib/types';
import { Sliders, RotateCcw, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface CounterfactualSimulatorProps {
  patient: Patient;
  onApplyStateChange?: (simulatedState: string) => void;
}

export function CounterfactualSimulator({ patient }: { patient: Patient }) {
  const [stockReserved, setStockReserved] = useState(false);
  const [patientResponded, setPatientResponded] = useState(false);
  const [feedRestored, setFeedRestored] = useState(true);

  // Compute counterfactual clinical state
  let simulatedState = patient.clinicalState;
  let simulatedLabel = patient.actionLabel;
  let explanationText = 'Current empirical baseline state.';

  if (!feedRestored) {
    simulatedState = 'COVERAGE_GAP';
    simulatedLabel = 'COVERAGE GAP';
    explanationText = 'PBM feed offline or stale (>24h). System abstains from risk classification.';
  } else if (stockReserved && patientResponded) {
    simulatedState = 'RECOVERED';
    simulatedLabel = 'RECOVERED';
    explanationText = '30-minute pharmacy hold placed + patient confirmed acquisition. Adherence restored.';
  } else if (stockReserved) {
    simulatedState = 'DRIFT';
    simulatedLabel = 'WATCH';
    explanationText = 'Pharmacy stock hold confirmed. Verification ledger awaiting physical pickup.';
  } else if (patientResponded) {
    simulatedState = 'NORMAL';
    simulatedLabel = 'STABLE';
    explanationText = 'Clinician-initiated follow-up confirmed benign temporary delay.';
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              COUNTERFACTUAL WORKFLOW SIMULATOR
            </span>
            <span className="text-xs text-slate-400">Evidence State Counterfactual</span>
          </div>
          <h3 className="text-base font-semibold text-slate-100 mt-1 flex items-center gap-2">
            Interactive Evidence State Simulator
          </h3>
        </div>
        <button
          onClick={() => {
            setStockReserved(false);
            setPatientResponded(false);
            setFeedRestored(true);
          }}
          className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Counterfactual
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Simulation Controls */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Simulate Evidence Inputs
          </h4>

          {/* Control 1: Stock Hold */}
          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
            <div>
              <div className="text-xs font-semibold text-slate-200">30-Min Local Stock Reservation</div>
              <div className="text-[11px] text-slate-400">Clinician places hold on nearby pharmacy inventory</div>
            </div>
            <input
              type="checkbox"
              checked={stockReserved}
              onChange={(e) => setStockReserved(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </label>

          {/* Control 2: Patient Confirmation */}
          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
            <div>
              <div className="text-xs font-semibold text-slate-200">Patient Response & Confirmation</div>
              <div className="text-[11px] text-slate-400">Patient responds to clinician follow-up request</div>
            </div>
            <input
              type="checkbox"
              checked={patientResponded}
              onChange={(e) => setPatientResponded(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </label>

          {/* Control 3: Feed Staleness */}
          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
            <div>
              <div className="text-xs font-semibold text-slate-200">Pharmacy Data Feed Active</div>
              <div className="text-[11px] text-slate-400">PBM claims feed & inventory API active</div>
            </div>
            <input
              type="checkbox"
              checked={feedRestored}
              onChange={(e) => setFeedRestored(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Counterfactual Output Display */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Classification State Output
            </span>

            <div className="flex items-center space-x-3 my-3">
              <span className="text-xs px-2.5 py-1 rounded font-mono bg-slate-800 text-slate-400">
                {patient.actionLabel}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span
                className={`text-xs px-3 py-1 rounded font-bold font-mono border ${
                  simulatedState === 'NEEDS_REVIEW'
                    ? 'bg-rose-950 text-rose-400 border-rose-800'
                    : simulatedState === 'DRIFT'
                    ? 'bg-amber-950 text-amber-400 border-amber-800'
                    : simulatedState === 'COVERAGE_GAP'
                    ? 'bg-purple-950 text-purple-400 border-purple-800'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                }`}
              >
                {simulatedLabel}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed font-mono">
              {explanationText}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Workflow Simulation Engine</span>
            <span className="text-cyan-400 font-mono">State Reassessment Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
