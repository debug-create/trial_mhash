'use client';

import React, { useState } from 'react';
import { ForensicsAttribution, Patient, DriftEpisode } from '@/lib/types';
import { ConfidenceBadge, ClinicalStateBadge } from './ConfidenceBadge';
import { exportHL7FHIR_R4 } from '@/lib/forensicsEngine';
import { useVanishingDose } from '@/context/VanishingDoseContext';
import { Cpu, FileJson, UserCheck, Edit3, X, ChevronDown, ChevronUp, Layers, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export function ForensicsTimeline({ patient }: { patient: Patient }) {
  const { triggerAshaEscalation, modifyRegimen } = useVanishingDose();
  const attribution: ForensicsAttribution | undefined = patient.activeAttribution;

  const [showFhir, setShowFhir] = useState(false);
  const [showRegimenModal, setShowRegimenModal] = useState(false);
  const [newDosageInput, setNewDosageInput] = useState(patient.supply.dosage);
  const [expandedEpisodeId, setExpandedEpisodeId] = useState<string | null>(patient.episodes[0]?.id || null);

  if (!attribution) {
    return <div className="text-slate-400 text-sm">No forensic analysis active.</div>;
  }

  const fhirJson = exportHL7FHIR_R4(attribution, patient.name);

  const handleModifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    modifyRegimen(patient.id, newDosageInput);
    setShowRegimenModal(false);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md shadow-2xl">
      {/* Header & Attribution Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-base">Execution Forensics Reasoning Output</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Passive signal synthesis & non-SHAP derived causality rules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ClinicalStateBadge state={patient.clinicalState} label={patient.actionLabel} />
          <ConfidenceBadge confidence={attribution.confidenceLevel} />
        </div>
      </div>

      {/* Triage Leverage & Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">PRIORITY LEVERAGE SCORE</span>
          <div className="text-xl font-bold text-cyan-400 font-mono flex items-center justify-between">
            <span>{patient.priorityLeverageScore} / 100</span>
            <span className="text-[10px] text-slate-500 font-normal">Leverage Rank</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">LAYER A DRIFT RISK</span>
          <div className="text-xl font-bold text-purple-400 font-mono">{attribution.driftRiskPercent}%</div>
        </div>

        <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">TOP CAUSE HYPOTHESIS</span>
          <div className="text-sm font-bold text-slate-200 font-mono truncate">
            {attribution.detectedCause.replace(/_/g, ' ')}
          </div>
        </div>
      </div>

      {/* Expandable Drift Episode Grouping */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
          <span>Drift Episodes ({patient.episodes.length})</span>
          <span className="text-[10px] text-slate-500 font-mono">Expandable Episode Containers</span>
        </h4>

        <div className="space-y-3">
          {patient.episodes.map((ep) => {
            const isExpanded = expandedEpisodeId === ep.id;
            return (
              <div
                key={ep.id}
                className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden transition-all"
              >
                {/* Episode Card Header */}
                <div
                  onClick={() => setExpandedEpisodeId(isExpanded ? null : ep.id)}
                  className="p-4 cursor-pointer hover:bg-slate-900/60 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-950 rounded-lg border border-cyan-800">
                      <Layers className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-100">{ep.title}</h5>
                      <p className="text-xs text-slate-400 font-mono">
                        Trigger: {ep.triggerSignal} · Start: {ep.startTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <ClinicalStateBadge state={ep.clinicalState} />
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Episode Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-4">
                    {/* Provenance Evidence Items */}
                    <div>
                      <h6 className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                        Evidence Provenance Chain
                      </h6>
                      <div className="space-y-2">
                        {attribution.evidence.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs"
                          >
                            <span className="text-slate-200 font-medium">{item.text}</span>
                            <div className="flex items-center space-x-2 font-mono text-[10px]">
                              <span className="text-cyan-400">{item.source}</span>
                              <span
                                className={`px-1.5 py-0.5 rounded ${
                                  item.provenance === 'OBSERVED'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : item.provenance === 'DERIVED'
                                    ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                    : 'bg-purple-950 text-purple-400 border border-purple-800'
                                }`}
                              >
                                {item.provenance}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Asha Escalation Toolbar */}
      <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3.5 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-purple-400" />
          <span>
            Community Asha Worker Escalation:{' '}
            <strong className={patient.ashaEscalated ? 'text-purple-400 font-bold' : 'text-slate-400 font-medium'}>
              {patient.ashaEscalated ? 'ALERT DISPATCHED' : 'Standby'}
            </strong>
          </span>
        </div>
        {!patient.ashaEscalated && (
          <button
            onClick={() => triggerAshaEscalation(patient.id)}
            className="rounded-lg bg-purple-950 px-3 py-1.5 text-[11px] font-bold text-purple-300 border border-purple-800 hover:bg-purple-900 transition-colors"
          >
            Dispatch Asha Fallback Alert
          </button>
        )}
      </div>

      {/* Clinical Toolbar & FHIR Export */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4 flex-wrap gap-2">
        <button
          onClick={() => setShowRegimenModal(true)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
        >
          <Edit3 className="h-3.5 w-3.5 text-cyan-400" />
          Modify Dosage / Regimen
        </button>

        <button
          onClick={() => setShowFhir(!showFhir)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all"
        >
          <FileJson className="h-3.5 w-3.5 text-emerald-400" />
          {showFhir ? 'Hide FHIR R4 JSON' : 'Export HL7 FHIR R4 JSON'}
        </button>
      </div>

      {/* FHIR JSON Export Box */}
      {showFhir && (
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span>HL7 FHIR R4 Compliant Bundle Resource</span>
            <span className="text-[10px] text-emerald-400">Standard Spec Export</span>
          </div>
          <pre className="max-h-48 overflow-y-auto rounded-lg bg-slate-900 p-3 text-[11px] text-slate-300">
            {JSON.stringify(fhirJson, null, 2)}
          </pre>
        </div>
      )}

      {/* Regimen Modification Modal */}
      {showRegimenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm">Clinician Regimen Modification</h4>
              <button onClick={() => setShowRegimenModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleModifySubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Medication Name</label>
                <input
                  disabled
                  value={patient.supply.medicationName}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">New Dosage Instructions</label>
                <input
                  value={newDosageInput}
                  onChange={(e) => setNewDosageInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                Apply Clinical Regimen Change
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
