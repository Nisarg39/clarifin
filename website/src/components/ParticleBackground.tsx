"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate a soft circular texture for the particles so they aren't pixelated squares
  const particleTexture = useMemo(() => {
    // Only run in browser
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0.8)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const particleCount = 4000; // slightly reduced for a cleaner look
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 15;
      const branchAngle = (i % 3) * ((2 * Math.PI) / 3);
      const spinAngle = radius * 0.4;
      
      const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
      const randomY = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
      const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.5;

      pos[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      pos[i * 3 + 1] = randomY * (2 / (radius + 0.5));
      pos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    }
    return pos;
  }, [particleCount]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03; // slowed down rotation
      pointsRef.current.rotation.z -= delta * 0.01;
    }
  });

  return (
    // Shifted down and pushed back on the Z axis so it sits behind the text better
    <points ref={pointsRef} rotation={[0.4, 0, 0]} position={[0, -2, -6]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15} // slightly larger but soft
        color="#70aae4"
        transparent
        opacity={0.3} // Much lower opacity so it doesn't clash with text
        map={particleTexture || undefined}
        alphaMap={particleTexture || undefined}
        alphaTest={0.001}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 1, 10], fov: 60 }}>
        <Particles />
      </Canvas>
    </div>
  );
}
