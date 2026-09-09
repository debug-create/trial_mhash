'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Activity, User, Stethoscope, Store, CheckCircle2 } from 'lucide-react';
import { useVanishingDose } from '@/context/VanishingDoseContext';

// Dynamic import for R3F Hero Pill Canvas without decorative particles
const HeroPillCanvas = dynamic(
  () => import('@/components/three/HeroPillCanvas').then((mod) => mod.HeroPillCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] w-full bg-slate-900/20 rounded-3xl animate-pulse flex items-center justify-center text-xs font-mono text-slate-600">
        Loading 3D Hero Mesh...
      </div>
    ),
  }
);

export default function Home() {
  const { patients } = useVanishingDose();

  const redCount = patients.filter((p) => p.riskStatus === 'RED').length;
  const orangeCount = patients.filter((p) => p.riskStatus === 'ORANGE').length;
  const greenCount = patients.filter((p) => p.riskStatus === 'GREEN').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* =========================================================================
          SECTION 01 / 04 — IDENTITY (HERO)
          ========================================================================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 border-b border-slate-900 overflow-hidden">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-8">
            {/* Numbered Section Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-xs font-mono text-cyan-400 font-semibold tracking-widest uppercase"
            >
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">01 / 04</span>
              <span>CLOSED-LOOP CLINICAL INTELLIGENCE</span>
            </motion.div>

            {/* Dominant Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
            >
              From Missed Dose to <span className="text-cyan-400">Resolved Dose.</span>
            </motion.h1>

            {/* Short Punchy Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl"
            >
              Existing systems stop at reminding or predicting non-adherence.{' '}
              <strong className="text-white font-medium">Vanishing Dose closes the loop</strong>: reconstruct why an intended dose failed, execute cause-specific recovery, and verify treatment execution restoration.
            </motion.p>

            {/* Solid / Outline Action Buttons (Zero Gradient Gimmicks) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link
                href="/doctor"
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-cyan-950/40"
              >
                <Stethoscope className="h-4 w-4" />
                Doctor Command Center
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/patient"
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <User className="h-4 w-4" />
                Patient Recovery App
              </Link>
            </motion.div>
          </div>

          {/* 3D Hero Object Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full h-[380px] sm:h-[420px] rounded-3xl border border-slate-900 bg-slate-950/60 p-4 relative overflow-hidden flex items-center justify-center">
              <HeroPillCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 / 04 — DETECT → EXPLAIN (FORENSICS ENGINE)
          ========================================================================= */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-24 border-b border-slate-900 bg-slate-950">
        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3 text-xs font-mono text-cyan-400 font-semibold tracking-widest uppercase">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">02 / 04</span>
              <span>EXECUTION FORENSICS ENGINE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Reconstruct the Cause Without Patient Self-Report.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              When an 8:00 AM dose window passes unconfirmed, Vanishing Dose doesn&apos;t assume apathy. It reconstructs temporal telemetry graph evidence—refill logs, wearable sleep/travel shifts, and post-dose symptom score spikes—to attribute root cause automatically.
            </p>

            {/* Classification & Attribution Taxonomy Matrix */}
            <div className="space-y-4 pt-4 font-mono text-xs">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                Attribution Taxonomy Categories:
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-900 bg-slate-900/60 text-slate-200">
                  <span className="text-cyan-400 font-bold block">ACCESS_EXHAUSTION</span>
                  <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">Refill overdue, physical supply 0</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-900 bg-slate-900/60 text-slate-200">
                  <span className="text-amber-400 font-bold block">SIDE_EFFECT_AVOIDANCE</span>
                  <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">Post-dose symptom spike detected</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-900 bg-slate-900/60 text-slate-200">
                  <span className="text-indigo-400 font-bold block">ROUTINE_DISRUPTION</span>
                  <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">Wearable timezone & sleep shifts</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-900 bg-slate-900/60 text-slate-200">
                  <span className="text-emerald-400 font-bold block">FORGETTING</span>
                  <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">Intermittent slip with normal stock</span>
                </div>
              </div>

              <div className="pt-2 text-slate-400 font-sans text-xs flex items-center gap-4">
                <span>Classification Types:</span>
                <span className="text-slate-200 font-mono font-semibold">INTERMITTENT_SLIP</span>
                <span>•</span>
                <span className="text-slate-200 font-mono font-semibold">STRUCTURAL_DRIFT</span>
                <span>•</span>
                <span className="text-slate-200 font-mono font-semibold">ACUTE_ABANDONMENT</span>
              </div>
            </div>
          </div>

          {/* Single Dominant Large Stat Callout (No badge cluster clutter) */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="w-full rounded-3xl border border-slate-900 bg-slate-900/40 p-8 sm:p-12 space-y-6 text-center shadow-2xl">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Forensic Attribution Certainty Rate
              </span>
              <div className="text-6xl sm:text-8xl font-extrabold font-mono text-cyan-400 tracking-tight">
                94%
              </div>
              <p className="text-sm text-slate-300 font-light max-w-md mx-auto">
                Evaluated against temporal telemetry graphs prior to clinician review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 / 04 — RESOLVE (FAILURE-SPECIFIC ACCESS RECOVERY)
          ========================================================================= */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-24 border-b border-slate-900 bg-slate-950">
        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 flex items-center justify-center">
            <div className="w-full rounded-3xl border border-slate-900 bg-slate-900/40 p-8 sm:p-12 space-y-6 text-center shadow-2xl">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Medication Access Recovery Network
              </span>
              <div className="text-5xl sm:text-7xl font-extrabold font-mono text-white tracking-tight">
                4 Stores
              </div>
              <p className="text-sm text-cyan-400 font-mono font-semibold">
                Live Stock Verified • 30-Minute Locked Holds
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-3 text-xs font-mono text-cyan-400 font-semibold tracking-widest uppercase">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">03 / 04</span>
              <span>FAILURE-SPECIFIC RESOLUTION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Never Send Another Generic Reminder.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              When access exhaustion is the root cause, reminders fail. Vanishing Dose immediately activates the Medication Access Recovery Network—surfacing verified nearby inventory, pricing comparisons, RxNorm generic safety checks, and 30-minute hold reservations.
            </p>

            <div className="pt-2">
              <Link
                href="/pharmacy"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition-all"
              >
                <Store className="h-4 w-4" />
                Explore Pharmacy Partner Network
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 / 04 — VERIFY (CLOSED-LOOP LEDGER)
          ========================================================================= */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-24 bg-slate-950">
        <div className="mx-auto max-w-5xl w-full space-y-12 text-center">
          <div className="inline-flex items-center gap-3 text-xs font-mono text-cyan-400 font-semibold tracking-widest uppercase mx-auto">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">04 / 04</span>
            <span>CLOSED-LOOP LEDGER VERIFICATION</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-3xl mx-auto">
            Prove Treatment Execution Was Restored.
          </h2>

          <p className="text-base sm:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            The loop is only closed when physical stock is restored (+30 Tablets) and subsequent dose telemetry confirms execution. Every event is audited on the immutable ledger.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/doctor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 text-base font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-950/50"
            >
              <Stethoscope className="h-5 w-5" />
              Launch Doctor Command Center
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/patient"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-8 py-4 text-base font-semibold text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition-all"
            >
              <User className="h-5 w-5" />
              Open Patient Recovery App
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


