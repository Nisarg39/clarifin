"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stage, Center } from "@react-three/drei";
import { Model as OneChaseManhattanBankModel } from "@/components/OneChaseManhattanBankModel";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export default function SandboxPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll specifically for the sticky section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Fade in the text at the very end of the scroll (0.7 to 1.0)
  const textOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  return (
    <main className="relative bg-[var(--color-navy-base)] text-white">
      
      {/* --- LAYER 1: AURORA BACKGROUND GLOWS --- */}
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-[var(--color-accent-yellow)] opacity-10 blur-[150px] pointer-events-none" />

      {/* TOP SECTION: Sticky Scroll Wrapper */}
      <div ref={containerRef} className="relative h-[250vh] w-full">
        
        {/* The pinned 3D Canvas area */}
        <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
          {/* Subtle blue gradient glow behind the model */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-[var(--color-sky-blue)] opacity-20 blur-[150px] pointer-events-none" />
          
          <Canvas camera={{ position: [150, 150, 225], fov: 45 }} className="w-full h-full">
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={2} />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
            <Environment preset="city" />
            <Center>
              <OneChaseManhattanBankModel />
            </Center>
            <OrbitControls 
              makeDefault
              enablePan={true} 
              enableZoom={true}
              minDistance={0.1}
              maxDistance={2000}
              enableRotate={true}
              autoRotate={false}
              autoRotateSpeed={1.5}
              target={[0, 0, 0]}
            />
          </Canvas>


        </div>
      </div>

      {/* BOTTOM SECTION: Instructions (Below the fold) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto py-24 px-8 flex flex-col text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          3D Model Sandbox
        </h1>
        <p className="text-zinc-400 mb-12 max-w-2xl">
          This is your playground for testing downloaded 3D models. Follow the instructions below to replace the placeholder box with your own model.
        </p>

        <div className="bg-[#111]/50 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-[var(--color-sky-blue)]">How to add your model:</h2>
          <ol className="list-decimal list-inside space-y-6 text-zinc-300 text-lg">
            <li>Download a <strong>.glb</strong> file from Sketchfab (make sure to choose the glTF/GLB format).</li>
            <li>Place the downloaded file into your <code>website/public/</code> folder (e.g., <code>website/public/model.glb</code>).</li>
            <li className="leading-relaxed">
              Open a terminal in the <code>website/</code> folder and run: <br/>
              <code className="bg-black/50 text-[var(--color-sky-blue)] px-4 py-2 rounded-lg mt-3 inline-block border border-white/5 font-mono text-base">
                npx gltfjsx public/model.glb -o src/components/YourModel.tsx
              </code>
            </li>
            <li>Import <code>YourModel</code> at the top of this file.</li>
            <li>Replace the <code>&lt;DiamondModel /&gt;</code> in the code with <code>&lt;YourModel /&gt;</code>.</li>
          </ol>
        </div>
      </div>

    </main>
  );
}
