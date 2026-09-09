'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  ShieldCheck,
  Activity,
  Cpu,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  User,
  Stethoscope,
  Store,
  HelpCircle,
  Zap,
  Radio,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useVanishingDose } from '@/context/VanishingDoseContext';

// Dynamic import for R3F Canvases to ensure clean SSR / static prerendering
const HeroPillCanvas = dynamic(
  () => import('@/components/three/HeroPillCanvas').then((mod) => mod.HeroPillCanvas),
  { ssr: false, loading: () => <div className="h-[360px] w-full bg-slate-900/40 rounded-3xl animate-pulse flex items-center justify-center text-xs text-slate-500 font-mono">Loading 3D Canvas...</div> }
);

const PipelineNodeCanvas = dynamic(
  () => import('@/components/three/PipelineNodeCanvas').then((mod) => mod.PipelineNodeCanvas),
  { ssr: false, loading: () => <div className="h-[260px] w-full bg-slate-900/40 rounded-2xl animate-pulse flex items-center justify-center text-xs text-slate-500 font-mono">Loading Spatial Pipeline...</div> }
);

const STAGES = [
  {
    id: 0,
    tag: 'STAGE 01 — DETECT',
    title: 'Execution Divergence Detection',
    subtitle: 'Identifies missing execution timestamp without waiting for patient self-report',
    desc: 'Real-time regimen telemetry logs unconfirmed dose windows at 8:00 AM. Triggers non-intrusive surveillance without immediate alert fatigue.',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/60',
    stat: '8:00 AM Dose Unconfirmed',
  },
  {
    id: 1,
    tag: 'STAGE 02 — EXPLAIN',
    title: 'Temporal Evidence Forensics Engine',
    subtitle: 'Reconstructs root cause via wearable telemetry & inventory delta graphs',
    desc: 'Evaluates estimated pill depletion against last refill timestamp, travel timezone shifts, and post-dose symptom score spikes.',
    badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-950/60',
    stat: 'Reasoning: ACCESS_EXHAUSTION (94% Certainty)',
  },
  {
    id: 2,
    tag: 'STAGE 03 — RESOLVE',
    title: 'Failure-Specific Access Recovery',
    subtitle: 'Contextual intervention routing based on root cause attribution',
    desc: 'Surfaces nearby verified pharmacy network candidates with live stock verification, RxNorm generic safety checks, and locked 30-min holds.',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/60',
    stat: 'Intervention: 4 Verified Pharmacies Found',
  },
  {
    id: 3,
    tag: 'STAGE 04 — VERIFY',
    title: 'Closed-Loop Ledger Verification',
    subtitle: 'Proves treatment execution was physically restored',
    desc: 'Locks physical stock acquisition (+30 Tablets) and registers dose restoration onto the immutable adherence ledger.',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/60',
    stat: 'Ledger: VERIFIED_SUCCESS (+30 Restored)',
  },
];

export default function Home() {
  const { patients } = useVanishingDose();
  const [activeStage, setActiveStage] = useState(0);

  const redCount = patients.filter((p) => p.riskStatus === 'RED').length;
  const orangeCount = patients.filter((p) => p.riskStatus === 'ORANGE').length;
  const greenCount = patients.filter((p) => p.riskStatus === 'GREEN').length;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Pitch Hero Header */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-12 shadow-2xl">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-4 py-1.5 text-xs font-mono font-semibold text-cyan-400 backdrop-blur-md shadow-lg shadow-cyan-950/50"
              >
                <Radio className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
                <span>THE VANISHING DOSE ARCHITECTURE</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-[1.15]"
              >
                From Missed Dose to{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Resolved Dose.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-slate-300 leading-relaxed font-light"
              >
                Existing medication systems largely stop at reminding, detecting, or predicting non-adherence.{' '}
                <strong className="text-white font-semibold">Vanishing Dose closes the loop:</strong> it reconstructs why an intended dose failed, selects a cause-specific recovery path—from contextual intervention to medication access—and verifies whether treatment execution was actually restored.
              </motion.p>

              {/* Quote Pitch Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-cyan-800/60 bg-cyan-950/30 p-4 text-xs sm:text-sm text-cyan-200 font-mono shadow-inner relative overflow-hidden group"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-cyan-400 group-hover:bg-cyan-300 transition-colors" />
                <p className="pl-3 italic">
                  &quot;Don&apos;t just detect the vanishing dose. Explain where it vanished, remove the obstacle, and prove that it came back.&quot;
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link
                  href="/doctor"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-400/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Stethoscope className="h-4 w-4" />
                  Launch Doctor Command Center
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/patient"
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-700/80 hover:border-slate-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <User className="h-4 w-4" />
                  View Patient Recovery App
                </Link>
              </motion.div>
            </div>

            {/* 3D Interactive Capsule Canvas Column */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full relative rounded-2xl border border-slate-800/80 bg-slate-950/60 p-2 backdrop-blur-md shadow-2xl overflow-hidden group">
                <div className="absolute top-3 left-4 z-10 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                    Interactive WebGL Capsule Engine
                  </span>
                </div>
                <HeroPillCanvas />
                <div className="absolute bottom-3 inset-x-4 text-center pointer-events-none">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full">
                    Move cursor to rotate molecular structure
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The 3 Core USPs */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              Core Architectural Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">The Three Differentiating USP Layers</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built directly on top of the foundational prescription & reminder problem statement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* USP 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 space-y-4 shadow-xl backdrop-blur-md hover:border-cyan-500/40 transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 font-mono font-extrabold text-lg group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                Execution Forensics
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Reconstructs why a dose diverged from its intended execution using surrounding temporal evidence graph (refill history, inventory logs, wearable sleep/timezone shifts, and post-dose symptom spikes) <strong className="text-slate-200 font-medium">without manual patient self-report</strong>.
              </p>
              <div className="rounded-xl bg-slate-950/90 p-3 text-[11px] font-mono text-cyan-300 border border-slate-800 shadow-inner flex items-center justify-between">
                <span>Reasoning Output:</span>
                <span className="font-bold text-cyan-400">ACCESS_EXHAUSTION (94%)</span>
              </div>
            </motion.div>

            {/* USP 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 space-y-4 shadow-xl backdrop-blur-md hover:border-amber-500/40 transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-950/80 border border-amber-800/80 text-amber-400 font-mono font-extrabold text-lg group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Failure-Specific Recovery
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Routes each detected failure to the appropriate resolution path instead of sending another generic reminder. When access is the cause, launches the <strong className="text-slate-200 font-medium">Medication Access Network</strong> with availability confidence ratings, pricing, and generic safety checks.
              </p>
              <div className="rounded-xl bg-slate-950/90 p-3 text-[11px] font-mono text-amber-300 border border-slate-800 shadow-inner flex items-center justify-between">
                <span>Intervention:</span>
                <span className="font-bold text-amber-400">4 Verified Pharmacies</span>
              </div>
            </motion.div>

            {/* USP 3 */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 space-y-4 shadow-xl backdrop-blur-md hover:border-emerald-500/40 transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 font-mono font-extrabold text-lg group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Closed-Loop Verification
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Tracks the complete lifecycle: <strong className="text-slate-200 font-medium">Problem &rarr; Cause &rarr; Intervention &rarr; Outcome</strong>. Verifies whether the recovery action actually restored physical stock and treatment execution.
              </p>
              <div className="rounded-xl bg-slate-950/90 p-3 text-[11px] font-mono text-emerald-300 border border-slate-800 shadow-inner flex items-center justify-between">
                <span>Ledger Status:</span>
                <span className="font-bold text-emerald-400">VERIFIED (+30 Restored)</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3D Spatial 4-Stage Pipeline Visualizer */}
        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 sm:p-10 space-y-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Spatial Architecture Engine
              </span>
              <h3 className="text-xl font-extrabold text-white">4-Stage Closed-Loop Execution Pipeline</h3>
              <p className="text-xs text-slate-400 mt-1">
                Click any pipeline stage to inspect real-time state transformation and telemetry signals
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold font-mono">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> {redCount} Red (Access)
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> {orangeCount} Orange (Routine)
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> {greenCount} Green (Restored)
              </span>
            </div>
          </div>

          {/* 3D WebGL Pipeline Canvas */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-2 overflow-hidden shadow-inner">
            <PipelineNodeCanvas activeStage={activeStage} />
          </div>

          {/* Interactive Pipeline Stage Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STAGES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveStage(idx)}
                className={`rounded-2xl border p-4 text-left transition-all relative overflow-hidden ${
                  activeStage === idx
                    ? 'border-cyan-500 bg-slate-800/90 shadow-lg ring-1 ring-cyan-500/50'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${s.badgeColor}`}>
                    {s.tag}
                  </span>
                  {activeStage === idx && <Sparkles className="h-4 w-4 text-cyan-400" />}
                </div>
                <h4 className="font-bold text-sm text-slate-100 mt-2">{s.title}</h4>
                <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">{s.stat}</p>
              </button>
            ))}
          </div>

          {/* Active Stage Technical Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-slate-800 bg-slate-950/90 p-6 space-y-3 font-mono text-xs shadow-inner"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-cyan-400 font-bold uppercase">{STAGES[activeStage].tag} TECHNICAL DEEP DIVE</span>
                <span className="text-slate-500 text-[11px]">Subsystem: VanishingDoseCore</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white font-sans">{STAGES[activeStage].title}</h4>
                <p className="text-slate-300 font-sans leading-relaxed text-xs">{STAGES[activeStage].desc}</p>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Telemetry State: {STAGES[activeStage].stat}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Navigation Portal Cards */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-extrabold text-white">Explore Role-Based Interfaces</h3>
            <p className="text-xs text-slate-400">Step into the live multi-persona demonstration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/patient"
              className="group rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 space-y-4 hover:border-cyan-500/50 hover:bg-slate-900 transition-all shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 group-hover:scale-110 transition-transform">
                  <User className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Patient Recovery App
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Interactive dose tracker, pre-empted depletion alerts, and direct Medication Access Recovery flow.
                </p>
              </div>
            </Link>

            <Link
              href="/doctor"
              className="group rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 space-y-4 hover:border-blue-500/50 hover:bg-slate-900 transition-all shadow-lg hover:shadow-blue-500/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 border border-blue-800 text-blue-400 group-hover:scale-110 transition-transform">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  Doctor Command Center
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Patient risk triage (🔴/🟠/🟢), multi-signal forensic timelines, uncertainty metrics, and recovery audits.
                </p>
              </div>
            </Link>

            <Link
              href="/pharmacy"
              className="group rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 space-y-4 hover:border-emerald-500/50 hover:bg-slate-900 transition-all shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Store className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Pharmacy Partner Portal
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Live stock verification, price updates, and inventory API integration for high confidence availability.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

