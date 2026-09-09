'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

interface PipelineNodeProps {
  activeStage: number;
}

const STAGES = [
  { label: '01 DETECT', desc: 'Dose Divergence', color: '#06b6d4', pos: [-3, 0, 0] as [number, number, number] },
  { label: '02 EXPLAIN', desc: 'Forensics Engine', color: '#3b82f6', pos: [-1, 0.5, 0] as [number, number, number] },
  { label: '03 RESOLVE', desc: 'Access Recovery', color: '#f59e0b', pos: [1, -0.5, 0] as [number, number, number] },
  { label: '04 VERIFY', desc: 'Closed-Loop Ledger', color: '#10b981', pos: [3, 0, 0] as [number, number, number] },
];

function NodeMesh({ stage, isActive }: { stage: typeof STAGES[0]; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * (isActive ? 1.5 : 0.4);
  });

  return (
    <group position={stage.pos}>
      <Float speed={isActive ? 3 : 1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={meshRef} scale={isActive ? 1.2 : 0.9}>
          <octahedronGeometry args={[0.5]} />
          <meshPhysicalMaterial
            color={stage.color}
            roughness={0.2}
            metalness={0.5}
            clearcoat={1}
            wireframe={!isActive}
          />
        </mesh>

        <Text
          position={[0, 0.9, 0]}
          fontSize={0.24}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
        >
          {stage.label}
        </Text>
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.16}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {stage.desc}
        </Text>
      </Float>
    </group>
  );
}

function ConnectingLines() {
  const points: [number, number, number][] = STAGES.map((s) => s.pos);

  return (
    <Line
      points={points}
      color="#38bdf8"
      lineWidth={2}
      dashed={true}
      dashScale={5}
      dashSize={0.2}
    />
  );
}

export function PipelineNodeCanvas({ activeStage }: PipelineNodeProps) {
  return (
    <div className="w-full h-[240px] sm:h-[280px] relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <ConnectingLines />
        {STAGES.map((stage, idx) => (
          <NodeMesh key={stage.label} stage={stage} isActive={activeStage === idx} />
        ))}
      </Canvas>
    </div>
  );
}
