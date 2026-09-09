'use client';

import React, { useState } from 'react';
import { useVanishingDose } from '@/context/VanishingDoseContext';
import { ForensicsTimeline } from '@/components/ForensicsTimeline';
import { ClinicalContextExplorer3D } from '@/components/ClinicalContextExplorer3D';
import { ShapWaterfall } from '@/components/ShapWaterfall';
import { HypothesisTree } from '@/components/HypothesisTree';
import { CounterfactualSimulator } from '@/components/CounterfactualSimulator';
import { ClinicalStateBadge } from '@/components/ConfidenceBadge';
import { Stethoscope, ChevronRight, Cpu, Layers, GitCommit, Sliders, ArrowUpRight } from 'lucide-react';

export default function DoctorPage() {
  const { patients, selectedPatientId, setSelectedPatientId } = useVanishingDose();
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Sort patients by Priority Leverage Score (Persistence * Completeness * Opportunity)
  const sortedPatients = [...patients].sort((a, b) => b.priorityLeverageScore - a.priorityLeverageScore);

  const reviewCount = patients.filter((p) => p.clinicalState === 'NEEDS_REVIEW').length;
  const watchCount = patients.filter((p) => p.clinicalState === 'DRIFT').length;
  const gapCount = patients.filter((p) => p.clinicalState === 'COVERAGE_GAP').length;
  const stableCount = patients.filter((p) => p.clinicalState === 'NORMAL' || p.clinicalState === 'RECOVERED').length;

  const [activeTab, setActiveTab] = useState<'3D' | 'LAYER_A' | 'LAYER_B' | 'COUNTERFACTUAL' | 'EPISODES'>('3D');

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-950 text-blue-400 border border-blue-800">
                <Stethoscope className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Clinical Treatment Command Center</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Priority leverage triage queue • Layer A (SHAP Risk) & Layer B (Causality Graph) • 3D Context Explorer
            </p>
          </div>

          {/* Quick Panel Summary */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="rounded-xl border border-rose-800/80 bg-rose-950/40 px-3.5 py-2 text-center font-mono">
              <span className="text-[10px] uppercase font-semibold text-rose-300 block">Review Now</span>
              <span className="text-xl font-extrabold text-rose-400">{reviewCount}</span>
            </div>
            <div className="rounded-xl border border-amber-800/80 bg-amber-950/40 px-3.5 py-2 text-center font-mono">
              <span className="text-[10px] uppercase font-semibold text-amber-300 block">Watch</span>
              <span className="text-xl font-extrabold text-amber-400">{watchCount}</span>
            </div>
            <div className="rounded-xl border border-purple-800/80 bg-purple-950/40 px-3.5 py-2 text-center font-mono">
              <span className="text-[10px] uppercase font-semibold text-purple-300 block">Coverage Gap</span>
              <span className="text-xl font-extrabold text-purple-400">{gapCount}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-center font-mono">
              <span className="text-[10px] uppercase font-semibold text-cyan-300 block">Stable/Recovered</span>
              <span className="text-xl font-extrabold text-cyan-400">{stableCount}</span>
            </div>
          </div>
        </div>

        {/* Priority Leverage Explanation Banner */}
        <div className="rounded-xl border border-cyan-800/60 bg-cyan-950/30 p-4 text-xs text-cyan-200 flex items-center justify-between font-mono">
          <div>
            <strong>PRODUCT DECISION:</strong> Triage order is computed from{' '}
            <span className="text-white">Persistence × Evidence Strength × Intervention Opportunity</span> (Priority Leverage Score), not raw risk score alone.
          </div>
          <span className="hidden md:inline text-[10px] text-cyan-400 font-bold border border-cyan-800 px-2 py-0.5 rounded">
            v2 SPEC ALIGNED
          </span>
        </div>

        {/* Patient Triage List & Detailed Audit View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Triage List (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Priority Leverage Queue</span>
              <span>Sorted by Leverage</span>
            </h3>

            <div className="space-y-3">
              {sortedPatients.map((p, idx) => {
                const isSelected = p.id === selectedPatientId;
                const attrib = p.activeAttribution;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`group cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500 shadow-lg'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-slate-500">#{idx + 1}</span>
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm group-hover:text-cyan-400 transition-colors">
                            {p.name}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {p.supply.medicationName} • Stock: <span className="font-mono">{p.supply.currentStock}</span>
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`h-5 w-5 transition-transform ${
                          isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                        }`}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                      <ClinicalStateBadge state={p.clinicalState} label={p.actionLabel} />
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block font-mono">LEVERAGE SCORE</span>
                        <span className="font-mono font-bold text-cyan-400">{p.priorityLeverageScore}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Deep Inspection Panels (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Patient Profile Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {selectedPatient.name}
                  <span className="text-xs text-slate-400 font-normal">({selectedPatient.age}y/o · {selectedPatient.condition})</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Regimen: {selectedPatient.supply.brandName} ({selectedPatient.supply.dosage})
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <ClinicalStateBadge state={selectedPatient.clinicalState} label={selectedPatient.actionLabel} />
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                  Leverage: {selectedPatient.priorityLeverageScore}
                </span>
              </div>
            </div>

            {/* Navigation Tabs for Deep Components */}
            <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('3D')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  activeTab === '3D'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                3D Context Explorer
              </button>

              <button
                onClick={() => setActiveTab('LAYER_A')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  activeTab === 'LAYER_A'
                    ? 'bg-purple-950 text-purple-300 border border-purple-800 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4 text-purple-400" />
                Layer A (SHAP Risk)
              </button>

              <button
                onClick={() => setActiveTab('LAYER_B')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  activeTab === 'LAYER_B'
                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-800 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitCommit className="w-4 h-4 text-indigo-400" />
                Layer B (Causality Graph)
              </button>

              <button
                onClick={() => setActiveTab('COUNTERFACTUAL')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  activeTab === 'COUNTERFACTUAL'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4 text-emerald-400" />
                Counterfactual Simulator
              </button>

              <button
                onClick={() => setActiveTab('EPISODES')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                  activeTab === 'EPISODES'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-blue-400" />
                Drift Episodes & FHIR
              </button>
            </div>

            {/* Active Tab Component Render */}
            {activeTab === '3D' && <ClinicalContextExplorer3D patient={selectedPatient} />}

            {activeTab === 'LAYER_A' && selectedPatient.activeAttribution && (
              <ShapWaterfall
                driftRiskPercent={selectedPatient.activeAttribution.driftRiskPercent}
                shapFeatures={selectedPatient.activeAttribution.shapFeatures}
              />
            )}

            {activeTab === 'LAYER_B' && selectedPatient.activeAttribution && (
              <HypothesisTree hypotheses={selectedPatient.activeAttribution.hypotheses} />
            )}

            {activeTab === 'COUNTERFACTUAL' && <CounterfactualSimulator patient={selectedPatient} />}

            {activeTab === 'EPISODES' && <ForensicsTimeline patient={selectedPatient} />}
          </div>
        </div>
      </div>
    </div>
  );
}
