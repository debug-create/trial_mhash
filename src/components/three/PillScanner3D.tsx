'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';

function ParticleBurst() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 2;
    groupRef.current.rotation.x += delta * 1;
  });

  return (
    <group ref={groupRef}>
      <DreiSparkles count={80} scale={3} size={4} speed={0.8} color="#10b981" />
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={0.5}
          roughness={0.1}
          transmission={0.6}
          thickness={0.4}
        />
      </mesh>
    </group>
  );
}

export function PillScanner3D({ onScanComplete }: { onScanComplete: () => void }) {
  const [scanning, setScanning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setCompleted(true);
      onScanComplete();
    }, 1800);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center space-y-4 relative overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
          Pill Box Photo Lock-On Scanner
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
          3D Particle Verification
        </span>
      </div>

      <div className="relative w-full h-[200px] bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
        {/* Scanner Viewfinder Reticle */}
        <div className="absolute inset-4 border-2 border-dashed border-cyan-500/40 rounded-lg pointer-events-none flex items-center justify-center">
          <div className={`w-12 h-12 border-2 border-cyan-400 rounded-full ${scanning ? 'animate-ping' : ''}`} />
        </div>

        {/* Laser Scanning Line */}
        {scanning && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-pulse top-1/2" />
        )}

        {/* 3D Particle Canvas on Match */}
        {completed ? (
          <Canvas camera={{ position: [0, 0, 3] }}>
            <ambientLight intensity={1} />
            <directionalLight position={[2, 2, 2]} intensity={1.5} />
            <ParticleBurst />
          </Canvas>
        ) : (
          <div className="text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-200">Point camera at prescribed packaging</p>
            <p className="text-[11px] font-mono text-slate-500">Auto-matches brand, generic CUI & excipient matrix</p>
          </div>
        )}
      </div>

      <button
        onClick={handleScan}
        disabled={scanning || completed}
        className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all shadow-lg ${
          completed
            ? 'bg-emerald-600 text-white shadow-emerald-950/50'
            : scanning
            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 cursor-wait'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-cyan-950/50'
        }`}
      >
        {completed ? '✓ Brand Packaging Verified (+30 Doses Restored)' : scanning ? 'Scanning Packaging & RxCUI Matches...' : 'Simulate Packaging Scan (100% Match)'}
      </button>
    </div>
  );
}
