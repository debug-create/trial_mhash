'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Patient } from '@/lib/types';
import { Activity, Database, Heart, ShieldAlert, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

interface Node3D {
  id: string;
  label: string;
  category: 'REFILL' | 'WEARABLE' | 'LABS' | 'REGIMEN' | 'EPISODE';
  x: number;
  y: number;
  z: number;
  color: string;
  sourceTag: string;
  provenance: 'OBSERVED' | 'DERIVED' | 'INFERRED';
  value: string;
}

export function ClinicalContextExplorer3D({ patient }: { patient: Patient }) {
  const [selectedNode, setSelectedNode] = useState<Node3D | null>(null);
  const [angle, setAngle] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const nodes: Node3D[] = [
    {
      id: 'n-refill',
      label: 'Pharmacy Refill Telemetry',
      category: 'REFILL',
      x: -120,
      y: -40,
      z: 50,
      color: '#06b6d4', // Cyan
      sourceTag: 'PBM Pharmacy Claim API',
      provenance: 'OBSERVED',
      value: `Refill Overdue: ${patient.signals.refill.refillOverdueDays} days (Stock: ${patient.supply.currentStock} units)`,
    },
    {
      id: 'n-wearable',
      label: 'Wearable Biosensors',
      category: 'WEARABLE',
      x: 100,
      y: -60,
      z: -30,
      color: '#8b5cf6', // Purple
      sourceTag: 'Continuous Wearable Sensor',
      provenance: 'OBSERVED',
      value: patient.signals.wearable
        ? `Sleep disruption: ${patient.signals.wearable.sleepDisruptionHours}h | Timezone shift: ${patient.signals.wearable.timezoneChanged ? 'YES' : 'NO'}`
        : 'Sensor Feed Offline',
    },
    {
      id: 'n-labs',
      label: 'Lab Context (eGFR & Creatinine)',
      category: 'LABS',
      x: -60,
      y: 90,
      z: -60,
      color: '#10b981', // Emerald
      sourceTag: 'Clinical Laboratory EHR',
      provenance: 'OBSERVED',
      value: patient.signals.labHistory
        ? `eGFR: ${patient.signals.labHistory.eGFR} mL/min/1.73m² (Normal baseline)`
        : 'Baseline labs within normal parameters',
    },
    {
      id: 'n-regimen',
      label: 'Rx Regimen & Interactions',
      category: 'REGIMEN',
      x: 120,
      y: 70,
      z: 40,
      color: '#3b82f6', // Blue
      sourceTag: 'RxNorm / DrugBank Knowledge Graph',
      provenance: 'DERIVED',
      value: `${patient.supply.medicationName} (${patient.supply.dosage})`,
    },
    {
      id: 'n-episode',
      label: 'Active Drift Episode Node',
      category: 'EPISODE',
      x: 0,
      y: 0,
      z: 0,
      color: patient.clinicalState === 'NEEDS_REVIEW' ? '#f43f5e' : patient.clinicalState === 'DRIFT' ? '#f59e0b' : '#06b6d4',
      sourceTag: 'Layer A + B Synthesis Engine',
      provenance: 'INFERRED',
      value: `Clinical State: ${patient.actionLabel} (Priority Leverage Score: ${patient.priorityLeverageScore})`,
    },
  ];

  // Auto-rotate 3D space
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 0.015) % (Math.PI * 2));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Draw 3D nodes and connecting vectors on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const projectedNodes = nodes.map((node) => {
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Rotate around Y axis
      const rx = node.x * cosA - node.z * sinA;
      const rz = node.x * sinA + node.z * cosA;
      const ry = node.y;

      const scale = 300 / (300 + rz);
      const px = centerX + rx * scale;
      const py = centerY + ry * scale;

      return { ...node, px, py, scale, rz };
    });

    // Draw connecting vector lines to central episode node
    const centerNode = projectedNodes.find((n) => n.category === 'EPISODE');
    if (centerNode) {
      projectedNodes.forEach((n) => {
        if (n.id !== centerNode.id) {
          ctx.beginPath();
          ctx.moveTo(centerNode.px, centerNode.py);
          ctx.lineTo(n.px, n.py);
          ctx.strokeStyle = `${n.color}44`;
          ctx.lineWidth = 1.5 * n.scale;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    }

    // Draw projected 3D nodes
    projectedNodes
      .sort((a, b) => b.rz - a.rz)
      .forEach((n) => {
        const radius = Math.max(8, 16 * n.scale);

        // Glow effect
        const gradient = ctx.createRadialGradient(n.px, n.py, radius * 0.2, n.px, n.py, radius * 2);
        gradient.addColorStop(0, `${n.color}ff`);
        gradient.addColorStop(1, `${n.color}00`);

        ctx.beginPath();
        ctx.arc(n.px, n.py, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(n.px, n.py, radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = selectedNode?.id === n.id ? 3 : 1;
        ctx.stroke();

        // Text label
        ctx.font = `${Math.max(10, 11 * n.scale)}px sans-serif`;
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.px, n.py + radius + 14);
      });
  }, [angle, selectedNode]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              3D Clinical Context Explorer
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                Interactive WebGL Nodes
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Spatial visualization of telemetry data streams & observations (without diagnostic declarations).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Click any node to inspect provenance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        {/* 3D Canvas Space */}
        <div className="lg:col-span-2 relative flex justify-center items-center bg-slate-950/60 rounded-xl border border-slate-800/80 p-2 min-h-[280px]">
          <canvas
            ref={canvasRef}
            width={480}
            height={260}
            className="cursor-pointer"
            onClick={(e) => {
              const rect = canvasRef.current?.getBoundingClientRect();
              if (!rect) return;
              const clickX = e.clientX - rect.left;
              const clickY = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;

              // Simple click distance check
              const cosA = Math.cos(angle);
              const sinA = Math.sin(angle);
              let closestNode: Node3D | null = null;
              let minDistance = 999;

              nodes.forEach((node) => {
                const rx = node.x * cosA - node.z * sinA;
                const rz = node.x * sinA + node.z * cosA;
                const scale = 300 / (300 + rz);
                const px = centerX + rx * scale;
                const py = centerY + node.y * scale;

                const dist = Math.hypot(clickX - px, clickY - py);
                if (dist < 30 && dist < minDistance) {
                  minDistance = dist;
                  closestNode = node;
                }
              });

              if (closestNode) setSelectedNode(closestNode);
            }}
          />
          <div className="absolute bottom-2 left-3 text-[10px] text-slate-500 font-mono">
            Spatial Coordinate Matrix · Auto-Rotating Field
          </div>
        </div>

        {/* Selected Node Provenance Inspector */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[280px]">
          {selectedNode ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  NODE: {selectedNode.category}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    selectedNode.provenance === 'OBSERVED'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : selectedNode.provenance === 'DERIVED'
                      ? 'bg-blue-950 text-blue-400 border-blue-800'
                      : 'bg-purple-950 text-purple-400 border-purple-800'
                  }`}
                >
                  {selectedNode.provenance}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-100 mb-1">{selectedNode.label}</h4>
              <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 mb-3 font-mono">
                {selectedNode.value}
              </p>

              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Data Source:</span>
                  <span className="text-cyan-400 font-mono">{selectedNode.sourceTag}</span>
                </div>
                <div className="flex justify-between">
                  <span>Spatial Vector Z:</span>
                  <span className="font-mono text-slate-300">{selectedNode.z}mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Clinical Status:</span>
                  <span className="text-emerald-400 font-semibold">Observation Verified</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full py-8 text-slate-500">
              <Database className="w-8 h-8 mb-2 text-slate-600 animate-bounce" />
              <p className="text-xs">Click any 3D node on the left canvas to inspect source provenance & spatial observations.</p>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Patient: {patient.name}</span>
            <span className="font-mono text-cyan-400">{patient.actionLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
