"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sphere, Points, PointMaterial } from "@react-three/drei";

export function BlackHoleModel() {
  const diskRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (diskRef.current) {
      // Smooth continuous rotation of the entire disk system
      diskRef.current.rotation.y -= delta * 0.2;
    }
    if (particlesRef.current) {
      // Orbiting particles move a bit faster
      particlesRef.current.rotation.y -= delta * 0.3;
    }
  });

  // Generate dense realistic dust particles for the accretion disk
  const particleCount = 8000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Gaussian distribution for radius, denser near the center
      const r = 1.6 + Math.pow(Math.random(), 2) * 5.0; 
      const theta = Math.random() * 2 * Math.PI;
      
      // Taper the disk thickness (thinner near center, slightly thicker further out, but overall very thin)
      const thickness = (r - 1.5) * 0.05;
      const y = (Math.random() - 0.5) * thickness + (Math.random() - 0.5) * 0.05;
      
      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = r * Math.sin(theta);
    }
    return pos;
  }, []);

  return (
    <group scale={1.2}>
      
      {/* 1. Photon Ring / Glow behind the event horizon to simulate lensing */}
      <Sphere args={[1.65, 64, 64]}>
        <meshBasicMaterial 
          color="#ff6600" 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
      <Sphere args={[1.55, 64, 64]}>
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>

      {/* 2. The Event Horizon (Pure Black Void) */}
      <Sphere args={[1.5, 64, 64]}>
        <meshBasicMaterial color="black" />
      </Sphere>

      {/* 3. The Accretion Disk System (Tilted to match Interstellar-like view) */}
      <group rotation={[0.1, 0, 0.4]} ref={diskRef}>
        
        {/* Core Hot Disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.6, 2.5, 128]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.8} 
            side={THREE.DoubleSide} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Orange Outer Fade */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 4.5, 128]} />
          <meshBasicMaterial 
            color="#ff6600" 
            transparent 
            opacity={0.4} 
            side={THREE.DoubleSide} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Reddish Distant Fade */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.0, 6.0, 128]} />
          <meshBasicMaterial 
            color="#aa2200" 
            transparent 
            opacity={0.2} 
            side={THREE.DoubleSide} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Dense Particle Swarm orbiting the black hole */}
        <Points ref={particlesRef} positions={positions}>
          <PointMaterial 
            transparent 
            color="#ffdd88" 
            size={0.015} 
            sizeAttenuation={true} 
            depthWrite={false} 
            blending={THREE.AdditiveBlending} 
            opacity={0.8}
          />
        </Points>
      </group>
      
      {/* Intense light radiating from the accretion disk */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#ff8800" distance={20} />
    </group>
  );
}
