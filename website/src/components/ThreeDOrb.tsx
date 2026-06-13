"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Text } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function OrbContent() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.5}
          roughness={0.1}
          transmission={1}
          ior={1.5}
          chromaticAberration={0.05}
          anisotropy={0.1}
          color="#030334"
        />

        <Text
          position={[0, 0, 0]}
          fontSize={1.2}
          color="#F5F27A"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          $
        </Text>
      </mesh>
    </Float>
  );
}

export default function ThreeDOrb() {
  return (
    <div className="w-[300px] h-[300px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#70AAE4" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#F5F27A" />
        <OrbContent />
      </Canvas>
    </div>
  );
}
