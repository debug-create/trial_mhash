'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVanishingDose } from '@/context/VanishingDoseContext';
import { ForensicsTimeline } from '@/components/ForensicsTimeline';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import {
  Stethoscope,
  ShieldAlert,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  User,
  ChevronRight,
  Activity,
  PieChart,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function DoctorPage() {
  const { patients, selectedPatientId, setSelectedPatientId } = useVanishingDose();
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const redPatients = patients.filter((p) => p.riskStatus === 'RED');
  const orangePatients = patients.filter((p) => p.riskStatus === 'ORANGE');
  const greenPatients = patients.filter((p) => p.riskStatus === 'GREEN');

  // Breakdown metrics
  const accessCount = patients.filter((p) => p.activeAttribution?.detectedCause === 'ACCESS_EXHAUSTION').length;
  const symptomCount = patients.filter((p) => p.activeAttribution?.detectedCause === 'SIDE_EFFECT_AVOIDANCE').length;
  const routineCount = patients.filter((p) => p.activeAttribution?.detectedCause === 'ROUTINE_DISRUPTION').length;
  const forgettingCount = patients.filter((p) => p.activeAttribution?.detectedCause === 'FORGETTING').length;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/80 shadow-lg shadow-blue-950/50">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Clinical Treatment Command Center
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Multi-signal adherence telemetry • Non-judgmental root-cause attribution • Closed-loop verification audit
                </p>
              </div>
            </div>
          </div>

          {/* Quick Panel Summary */}
          <div className="flex items-center gap-3 font-mono">
            <div className="rounded-2xl border border-rose-800/80 bg-rose-950/40 px-4 py-2 text-center shadow-lg">
              <span className="text-[10px] uppercase font-semibold text-rose-300 block">Critical Access Risk</span>
              <span className="text-xl font-extrabold text-rose-400">{redPatients.length}</span>
            </div>
            <div className="rounded-2xl border border-amber-800/80 bg-amber-950/40 px-4 py-2 text-center shadow-lg">
              <span className="text-[10px] uppercase font-semibold text-amber-300 block">Emerging Disruption</span>
              <span className="text-xl font-extrabold text-amber-400">{orangePatients.length}</span>
            </div>
            <div className="rounded-2xl border border-emerald-800/80 bg-emerald-950/40 px-4 py-2 text-center shadow-lg">
              <span className="text-[10px] uppercase font-semibold text-emerald-300 block">Verified Restored</span>
              <span className="text-xl font-extrabold text-emerald-400">{greenPatients.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Panel Aggregated Failure Breakdown Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 font-mono">
              <PieChart className="h-4 w-4 text-cyan-400" />
              Failure Cause Distribution Across Active Cohort
            </h3>
            <span className="text-xs text-slate-400 font-mono">Identified via Execution Forensics Engine</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1 shadow-inner">
              <span className="text-xs text-rose-400 font-semibold block">Access Failure / Depletion</span>
              <span className="text-2xl font-bold font-mono text-white">{accessCount}</span>
              <span className="text-[10px] text-slate-500 block">Pharmacies surfaced for recovery</span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1 shadow-inner">
              <span className="text-xs text-amber-400 font-semibold block">Side-Effect Avoidance</span>
              <span className="text-2xl font-bold font-mono text-white">{symptomCount}</span>
              <span className="text-[10px] text-slate-500 block">Symptom score spikes post-dose</span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1 shadow-inner">
              <span className="text-xs text-indigo-400 font-semibold block">Routine Disruption</span>
              <span className="text-2xl font-bold font-mono text-white">{routineCount}</span>
              <span className="text-[10px] text-slate-500 block">Wearable travel & sleep shifts</span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1 shadow-inner">
              <span className="text-xs text-cyan-400 font-semibold block">Intermittent Forgetting</span>
              <span className="text-2xl font-bold font-mono text-white">{forgettingCount}</span>
              <span className="text-[10px] text-slate-500 block">Normal stock, reminder nudge sent</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Patient Triage List & Detailed Audit View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Triage List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              Patient Triage Board (Select for Audit)
            </h3>

            <div className="space-y-3">
              {patients.map((p) => {
                const isSelected = p.id === selectedPatientId;
                const cause = p.activeAttribution?.detectedCause;

                return (
                  <motion.div
                    key={p.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`group cursor-pointer rounded-2xl border p-4 transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500/50 shadow-xl'
                        : 'border-slate-800/80 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full shrink-0 ${
                            p.riskStatus === 'RED'
                              ? 'bg-rose-500 animate-pulse shadow-md shadow-rose-500/50'
                              : p.riskStatus === 'ORANGE'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm group-hover:text-cyan-400 transition-colors">
                            {p.name}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            {p.supply.medicationName} • Stock: <span className="text-slate-200">{p.supply.currentStock}</span>
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`h-5 w-5 transition-transform ${
                          isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600 group-hover:text-slate-400'
                        }`}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] border-t border-slate-800/80 pt-2 text-slate-400 font-mono">
                      <span>Attributed Cause:</span>
                      <span className="font-semibold text-slate-200">{cause?.replace('_', ' ')}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Forensics Audit & Signals View (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Forensic Evidence & Uncertainty Audit</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Patient: <span className="font-bold text-cyan-400">{selectedPatient.name}</span> ({selectedPatient.condition})
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-mono font-bold shrink-0 ${
                    selectedPatient.verificationStatus === 'VERIFIED_SUCCESS'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  VERIFICATION: {selectedPatient.verificationStatus}
                </span>
              </div>

              {/* Forensics Component */}
              <ForensicsTimeline patient={selectedPatient} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

