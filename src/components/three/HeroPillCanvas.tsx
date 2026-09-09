'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function InteractivePill({ mousePos }: { mousePos: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Parallax tilt based on cursor position
    const targetX = mousePos.x * 0.4;
    const targetY = mousePos.y * 0.4;
    meshRef.current.rotation.y += (targetX - meshRef.current.rotation.y) * 0.05;
    meshRef.current.rotation.x += (targetY - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.z += delta * 0.2;
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        {/* Top Half of Capsule */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 1.2, 32]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            roughness={0.15}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.4}
            thickness={0.5}
          />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            roughness={0.15}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.4}
            thickness={0.5}
          />
        </mesh>

        {/* Bottom Half of Capsule */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 1.2, 32]} />
          <meshPhysicalMaterial
            color="#0284c7"
            roughness={0.2}
            metalness={0.3}
            clearcoat={0.8}
          />
        </mesh>
        <mesh position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#0284c7"
            roughness={0.2}
            metalness={0.3}
            clearcoat={0.8}
          />
        </mesh>

        {/* Outer Orbiting Data Particles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 1.6;
          return (
            <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.4, Math.sin(angle) * radius]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

export function HeroPillCanvas() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX / innerWidth) * 2 - 1,
        y: -(e.clientY / innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full h-[320px] sm:h-[400px] relative">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#38bdf8" />
        <InteractivePill mousePos={mousePos} />
      </Canvas>
    </div>
  );
}
