"use client";

import { Canvas } from "@react-three/fiber";
import { Stage, OrbitControls } from "@react-three/drei";
import { DiamondModel } from "@/components/DiamondModel";

export default function DiamondUI() {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
      <Canvas>
        {/* We use the exact same Stage settings as the sandbox page to ensure the size matches */}
        <Stage environment="night" intensity={0.6} adjustCamera={1.2} shadows={false}>
          <DiamondModel />
          {/* Neon light pointing up at the bottom tip to highlight edges */}
          <pointLight position={[0, -2, 0]} intensity={100} color="#C084FC" distance={5} decay={2} />
        </Stage>

        {/* Auto-rotate for a dynamic holographic feel */}
        <OrbitControls 
          makeDefault
          enablePan={false} 
          enableZoom={false} 
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  );
}
