'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useVanishingDose } from '@/context/VanishingDoseContext';
import { AccessRecoveryModal } from '@/components/AccessRecoveryModal';
import { AnimatedDepletionMeter } from '@/components/AnimatedDepletionMeter';
import { calculateDepletionInterruptionRisk } from '@/lib/accessRecoveryEngine';
import {
  Pill,
  Clock,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Activity,
  Calendar,
  Camera,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const PillScanner3D = dynamic(
  () => import('@/components/three/PillScanner3D').then((mod) => mod.PillScanner3D),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] w-full bg-slate-900/40 rounded-2xl animate-pulse flex items-center justify-center text-xs text-slate-500 font-mono">
        Loading 3D Pill Scanner...
      </div>
    ),
  }
);

export default function PatientPage() {
  const { patients, selectedPatientId, setSelectedPatientId, triggerRecoveryAction } = useVanishingDose();
  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const depletionAnalysis = calculateDepletionInterruptionRisk(patient.supply);
  const missedDose = patient.doses.find((d) => d.status === 'MISSED');
  const isAccessFailure = patient.activeAttribution?.detectedCause === 'ACCESS_EXHAUSTION';

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Patient Switcher & Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-950/80 px-3 py-1 text-xs font-mono font-semibold text-cyan-400 border border-cyan-800/80 shadow-md">
                PATIENT RECOVERY PORTAL
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-mono font-bold border shadow-md ${
                  patient.riskStatus === 'RED'
                    ? 'bg-rose-950/80 text-rose-400 border-rose-800/80 animate-pulse'
                    : patient.riskStatus === 'ORANGE'
                    ? 'bg-amber-950/80 text-amber-400 border-amber-800/80'
                    : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                }`}
              >
                STATUS: {patient.riskStatus}
              </span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{patient.name}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              {patient.age} yrs • Condition: {patient.condition} • Refill Cycle: {patient.supply.lastRefillDate}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/60 p-2 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono pl-2">Switch Demo Patient:</span>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.activeAttribution?.detectedCause.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Depletion Interruption Alert Banner */}
        {depletionAnalysis.interruptionRisk !== 'LOW_RISK' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition-all relative overflow-hidden ${
              depletionAnalysis.interruptionRisk === 'HIGH_RISK'
                ? 'border-rose-800/80 bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 text-rose-200'
                : 'border-amber-800/80 bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 text-amber-200'
            }`}
          >
            <div className="flex items-start gap-4 relative z-10">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold shadow-lg ${
                  depletionAnalysis.interruptionRisk === 'HIGH_RISK'
                    ? 'bg-rose-900/80 text-rose-400 border border-rose-700'
                    : 'bg-amber-900/80 text-amber-400 border border-amber-700'
                }`}
              >
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-white">
                    Projected Treatment Interruption Warning
                  </h3>
                  <span className="font-mono text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-slate-950/60 border border-slate-800 shrink-0">
                    {depletionAnalysis.depletionHours} Hours Remaining
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {depletionAnalysis.summaryMessage}
                </p>

                {isAccessFailure && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 px-5 py-3 text-xs font-bold text-white shadow-xl shadow-rose-950/60 hover:from-amber-400 hover:to-rose-500 transition-all transform hover:-translate-y-0.5"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Launch Access Recovery (4 Verified Local Pharmacies)
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Real-time Liquid Fill Depletion Meter */}
        <AnimatedDepletionMeter supply={patient.supply} />

        {/* Pill Box 3D Lock-On Scanner Trigger Accordion */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 space-y-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Visual Package Verification Scanner</h3>
                <p className="text-xs text-slate-400">3D Particle Lock-on & RxCUI Packaging Verification</p>
              </div>
            </div>
            <button
              onClick={() => setShowScanner(!showScanner)}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-mono font-bold text-cyan-400 hover:bg-slate-700 transition-all"
            >
              {showScanner ? 'Close Scanner' : 'Launch 3D Scanner'}
              <ChevronDown className={`h-4 w-4 transition-transform ${showScanner ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <AnimatePresence>
            {showScanner && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden pt-2"
              >
                <PillScanner3D
                  onScanComplete={() => {
                    triggerRecoveryAction(patient.id, 'RESTORE_STOCK');
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prescription Regimen Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 space-y-2 backdrop-blur-md">
            <span className="text-xs text-slate-400 block font-mono">Prescribed Regimen</span>
            <h4 className="text-lg font-bold text-white">{patient.supply.medicationName}</h4>
            <p className="text-xs text-cyan-400 font-mono font-semibold">{patient.supply.dosage}</p>
            <span className="text-[11px] text-slate-500 block">Brand: {patient.supply.brandName}</span>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 space-y-2 backdrop-blur-md">
            <span className="text-xs text-slate-400 block font-mono">Estimated Remaining Stock</span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-extrabold font-mono ${
                  patient.supply.currentStock === 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {patient.supply.currentStock}
              </span>
              <span className="text-xs text-slate-400">tablets remaining</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Refill lead time: {patient.supply.deliveryLeadTimeHours} hours
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 space-y-2 backdrop-blur-md">
            <span className="text-xs text-slate-400 block font-mono">Forensic Status</span>
            <h4 className="text-sm font-bold text-white">
              {patient.activeAttribution?.detectedCause.replace('_', ' ')}
            </h4>
            <span className="inline-block rounded-md bg-cyan-950 px-2 py-0.5 font-mono text-[10px] text-cyan-300 border border-cyan-800">
              Confidence: {patient.activeAttribution?.confidenceScore}%
            </span>
          </div>
        </div>

        {/* Today's Schedule & Missed Dose Detection */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 space-y-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-cyan-400" />
              <h3 className="font-bold text-slate-100 text-base">Today&apos;s Execution Schedule</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Real-time Dose Monitor</span>
          </div>

          <div className="space-y-3">
            {patient.doses.map((dose) => (
              <div
                key={dose.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                  dose.status === 'MISSED'
                    ? 'border-rose-800/80 bg-rose-950/30'
                    : dose.status === 'RECOVERED'
                    ? 'border-emerald-800/80 bg-emerald-950/30'
                    : 'border-slate-800 bg-slate-950/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold shadow-md ${
                      dose.status === 'MISSED'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : dose.status === 'RECOVERED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}
                  >
                    <Pill className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{dose.medicationName}</h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Scheduled: <span className="text-slate-200">{dose.scheduledTime}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 font-mono">
                  {dose.status === 'MISSED' && (
                    <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/20">
                      ⚠️ Dose Unconfirmed
                    </span>
                  )}
                  {dose.status === 'RECOVERED' && (
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Execution Restored
                    </span>
                  )}
                  {dose.status === 'TAKEN' && (
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20">
                      ✓ Logged On-Time ({dose.takenAt})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Cause Specific Resolution Trigger Box */}
          {missedDose && missedDose.status === 'MISSED' && isAccessFailure && (
            <div className="rounded-2xl border border-cyan-800/80 bg-cyan-950/40 p-5 space-y-3 shadow-inner">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <ShieldAlert className="h-5 w-5 text-cyan-400" />
                <span>Forensics Output: Access Failure Detected</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rather than sending another generic reminder, Vanishing Dose has identified that your medication supply is exhausted. Click below to launch verified nearby pharmacy recovery.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all"
              >
                <ShoppingBag className="h-4 w-4" />
                Find Verified Local Stock (Price & Distance Comparison)
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        <AccessRecoveryModal
          patientId={patient.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}

