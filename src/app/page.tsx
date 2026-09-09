'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Activity, Cpu, ArrowRight, User, Stethoscope, Store, Sparkles, CheckCircle2, AlertTriangle, Eye, Radio, GitCommit, BarChart3 } from 'lucide-react';
import { useVanishingDose } from '@/context/VanishingDoseContext';

export default function Home() {
  const { patients } = useVanishingDose();

  const reviewCount = patients.filter((p) => p.clinicalState === 'NEEDS_REVIEW').length;
  const watchCount = patients.filter((p) => p.clinicalState === 'DRIFT').length;
  const gapCount = patients.filter((p) => p.clinicalState === 'COVERAGE_GAP').length;
  const stableCount = patients.filter((p) => p.clinicalState === 'NORMAL' || p.clinicalState === 'RECOVERED').length;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Pitch Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-3.5 py-1 text-xs font-semibold text-cyan-400 font-mono">
              <Activity className="h-3.5 w-3.5" />
              <span>VANISHING DOSE v2 SYSTEM SPECIFICATION</span>
            </div>

            <h1 className="font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Detecting Medication Non-Adherence <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Without Asking.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Detect adherence drift early using surrounding passive telemetry streams—pharmacy refills, wearable biometrics, and eMAR history. <strong className="text-white">Detection never asks the patient anything.</strong> Clinicians review actionable evidence graphs and optionally initiate follow-up confirmation.
            </p>

            {/* The Two Headlines Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-cyan-800/60 bg-cyan-950/40 p-4 space-y-1">
                <div className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">HEADLINE 1</div>
                <div className="text-sm font-semibold text-cyan-100">
                  &quot;Detect the drift before it becomes a pattern.&quot;
                </div>
                <p className="text-xs text-cyan-300/80">Early-warning clinical signal synthesis, not retrospective reporting.</p>
              </div>

              <div className="rounded-xl border border-purple-800/60 bg-purple-950/40 p-4 space-y-1">
                <div className="text-xs font-bold text-purple-400 font-mono uppercase tracking-wider">HEADLINE 2</div>
                <div className="text-sm font-semibold text-purple-100">
                  &quot;Never confuse silence with stability.&quot;
                </div>
                <p className="text-xs text-purple-300/80">Missing/stale feeds trigger explicit COVERAGE GAP state, never low risk.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/doctor"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                <Stethoscope className="h-4 w-4" />
                Launch Doctor Command Center
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/patient"
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 transition-all"
              >
                <User className="h-4 w-4" />
                View Patient Recovery App
              </Link>
            </div>
          </div>
        </div>

        {/* 5-State System & Cohort Counters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Clinical 5-State System
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  No Traffic Light Labels
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Replaces red/amber/green alerts with precise clinical status labels to prevent CDS alert fatigue.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-rose-800/60 bg-rose-950/30 p-4 space-y-1">
              <span className="text-xs font-bold font-mono text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                REVIEW NOW
              </span>
              <div className="text-2xl font-extrabold text-white font-mono">{reviewCount}</div>
              <p className="text-[11px] text-slate-400">Corroborated persistent drift requiring review</p>
            </div>

            <div className="rounded-xl border border-amber-800/60 bg-amber-950/30 p-4 space-y-1">
              <span className="text-xs font-bold font-mono text-amber-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-400" />
                WATCH
              </span>
              <div className="text-2xl font-extrabold text-white font-mono">{watchCount}</div>
              <p className="text-[11px] text-slate-400">Early deviation detected; monitoring</p>
            </div>

            <div className="rounded-xl border border-purple-800/60 bg-purple-950/30 p-4 space-y-1">
              <span className="text-xs font-bold font-mono text-purple-400 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-purple-400" />
                COVERAGE GAP
              </span>
              <div className="text-2xl font-extrabold text-white font-mono">{gapCount}</div>
              <p className="text-[11px] text-slate-400">Feed stale or wearable sensor offline</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-1">
              <span className="text-xs font-bold font-mono text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                STABLE / RECOVERED
              </span>
              <div className="text-2xl font-extrabold text-white font-mono">{stableCount}</div>
              <p className="text-[11px] text-slate-400">Execution within baseline variance</p>
            </div>
          </div>
        </div>

        {/* Core Architecture Split: Layer A vs Layer B */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-white">The Core Correction: Layer A vs Layer B Split</h2>
            <p className="text-xs text-slate-400">SHAP explains the risk score (Layer A); causality is evaluated separately via explicit rule graphs (Layer B).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Layer A Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  LAYER A — ADHERENCE DRIFT RISK
                </span>
                <BarChart3 className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Calibrated Logistic Regression</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trained on a synthetic cohort of ~200 patients with noisy labels. Uses <strong className="text-slate-200">Platt Scaling calibration ($ECE &lt; 0.05$)</strong> and SHAP to explain feature attribution towards the <em>risk score</em> (e.g., Refill delay $+31\%$, Dose-time variance $+22\%$). Deployed in TypeScript for live browser inference.
              </p>
              <div className="rounded-lg bg-slate-950 p-3 text-xs font-mono text-cyan-300 border border-slate-800 space-y-1">
                <div>Model: Logistic Regression + Platt Scaling</div>
                <div>PR-AUC: 0.89 | Precision: 0.86 | ECE: 0.038</div>
              </div>
            </div>

            {/* Layer B Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-purple-950 text-purple-400 border border-purple-800">
                  LAYER B — CAUSE & EVIDENCE MODEL
                </span>
                <GitCommit className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Explicit Rule Matrix Graph</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Determines plausible explanations (Treatment Intolerance, Access Exhaustion, Routine Disruption, Cognitive Slip) using explicit rules. Each candidate hypothesis carries <strong className="text-slate-200">supporting & contradicting evidence chains with provenance source tags</strong>. Completely non-SHAP derived.
              </p>
              <div className="rounded-lg bg-slate-950 p-3 text-xs font-mono text-purple-300 border border-slate-800 space-y-1">
                <div>Output: Plausible / Unlikely / High Certainty</div>
                <div>Provenance Tags: Observed (PBM API) vs Derived</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/patient"
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 text-cyan-400">
                <User className="h-5 w-5" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-base font-bold text-white">Patient App Interface</h4>
            <p className="text-xs text-slate-400">
              Passive telemetry monitoring, clinician follow-up confirmation workflow, and cause-specific access recovery drawer.
            </p>
          </Link>

          <Link
            href="/doctor"
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-blue-400">
                <Stethoscope className="h-5 w-5" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-base font-bold text-white">Doctor Command Center</h4>
            <p className="text-xs text-slate-400">
              Leverage priority queue ranking, 3D Context Explorer, Layer A SHAP waterfall, Layer B hypothesis tree, and HL7 FHIR export.
            </p>
          </Link>

          <Link
            href="/pharmacy"
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400">
                <Store className="h-5 w-5" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-base font-bold text-white">Pharmacy Partner Network</h4>
            <p className="text-xs text-slate-400">
              Direct inventory API sync verification, 30-minute stock hold queue, and coverage gap alerts.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
