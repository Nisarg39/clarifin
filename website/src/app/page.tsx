"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useScroll, useMotionValueEvent } from "framer-motion";
import CountUp from "react-countup";
import DiamondUI from "@/components/DiamondUI";
import WaveUI from "@/components/WaveUI";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Center, Environment } from "@react-three/drei";
import { Model as MazeBankTowerModel } from "@/components/MazeBankTowerModel";
import { Model as MoneyPalmTreeModel } from "@/components/MoneyPalmTreeModel";
import { Model as MazeModel } from "@/components/MazeModel";
import { Model as VintageClockModel } from "@/components/VintageClockModel";
import { useRef, useState } from "react";

import * as THREE from 'three';

function PassingStreetLights() {
  const lightRef1 = useRef<THREE.PointLight>(null);
  const lightRef2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    // Sync with the 1.2s road animation, but make streetlights further apart
    const duration = 4.8; // Takes 4 road dashes for one light to pass
    const t1 = (state.clock.elapsedTime / duration) % 1; 
    const t2 = ((state.clock.elapsedTime / duration) + 0.5) % 1; 

    if (lightRef1.current) {
      // Move from far (-15) to near (5)
      lightRef1.current.position.set(-3, 2, -15 + (t1 * 20));
    }
    if (lightRef2.current) {
      lightRef2.current.position.set(3, 2, -15 + (t2 * 20));
    }
  });

  return (
    <>
      <pointLight ref={lightRef1} intensity={10} color="#F97316" distance={10} decay={2} />
      <pointLight ref={lightRef2} intensity={10} color="#F97316" distance={10} decay={2} />
    </>
  );
}

export default function Home() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Hero Scroll Transition Setup
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroContainerRef,
    offset: ["start start", "end start"]
  });
  
  // Transform scale and opacity for the Apple-style depth transition
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.85]);
  const heroOpacity = useTransform(heroScrollProgress, [0.5, 1], [1, 0]);

  const mazeContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mazeScrollProgress } = useScroll({
    target: mazeContainerRef,
    offset: ["start end", "end end"]
  });
  const textRef = useRef<HTMLDivElement>(null);

  // Fade out the scroll hint as they start scrolling through the maze
  const mazeScrollIndicatorOpacity = useTransform(mazeScrollProgress, [0.29, 0.40], [1, 0]);

  useMotionValueEvent(mazeScrollProgress, "change", (latest) => {
    if (textRef.current) {
      // Delay text reveal until 0.40 (maze starts burning at 0.29)
      if (latest <= 0.40) {
        textRef.current.style.opacity = "0";
        textRef.current.style.pointerEvents = "none";
      } else if (latest >= 0.70) {
        textRef.current.style.opacity = "1";
        textRef.current.style.pointerEvents = "auto";
      } else {
        // Map scroll from 0.40 -> 0.70 to opacity 0 -> 1
        const opacity = (latest - 0.40) / (0.70 - 0.40);
        textRef.current.style.opacity = opacity.toString();
        textRef.current.style.pointerEvents = "none";
      }
    }
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = (clientY / window.innerHeight) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  const gridX = useTransform(smoothX, [-1, 1], [-30, 30]);
  const gridY = useTransform(smoothY, [-1, 1], [-30, 30]);

  return (
    <div className="w-full bg-[var(--color-navy-base)] text-white">

      {/* --- HERO SECTION (Wrapped for scroll transition) --- */}
      <div ref={heroContainerRef} className="relative w-full h-screen">
        <section 
          className="sticky top-0 h-screen flex flex-col w-full overflow-hidden"
          onMouseMove={handleMouseMove}
        >

        {/* --- LAYER 1: AURORA BACKGROUND GLOWS --- */}
        {/* Placed outside the scaling wrapper so it doesn't shrink and create hard edges */}
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[50%] h-[50%] rounded-full bg-[var(--color-sky-blue)] opacity-20 blur-[150px] pointer-events-none" />

        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="w-full flex-1 flex flex-col z-10"
        >

        {/* --- TOP NAVIGATION --- */}
        <nav className="relative z-50 w-full flex items-center justify-between px-8 lg:px-12 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3"
          >
            <div className="relative w-10 h-10 overflow-hidden rounded-xl">
              <Image
                src="/icon.png"
                alt="Clarifin Logo"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold tracking-tight">Clarifin</span>
          </motion.div>

        </nav>

        {/* --- LAYER 3: TYPOGRAPHIC INTERFACE (Main Content) --- */}
        <main className="relative z-40 flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-32 lg:pt-20">

          {/* FADED NET MESH BACKGROUND */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] md:w-[1200px] md:h-[800px] z-0 pointer-events-none"
            style={{
              x: gridX,
              y: gridY,
              backgroundImage: `
                linear-gradient(to right, rgba(112, 170, 228, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(112, 170, 228, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 0%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 0%, transparent 100%)',
            }}
          />

          {/* Massive Centered Headline */}
          <div className="flex flex-col items-center text-center max-w-[90rem] w-full mx-auto relative">

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative z-10 flex justify-center w-full mb-0 px-4"
            >
              <svg 
                viewBox="0 0 900 95" 
                className="w-full max-w-[85rem] h-auto drop-shadow-2xl"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text 
                  x="50%" 
                  y="50%" 
                  dominantBaseline="middle" 
                  textAnchor="middle" 
                  className="font-bold tracking-tight"
                  style={{ fontFamily: "inherit", fontWeight: "bold" }}
                >
                  <tspan fill="var(--color-sky-blue)" style={{ fontSize: "5.5rem" }}>Clar</tspan>
                  <motion.tspan 
                    initial={{ fontSize: "0rem", opacity: 0 }}
                    animate={{ fontSize: "5.5rem", opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    fill="#ffffff"
                  >
                    {"ity\u00A0"}
                  </motion.tspan>
                  <tspan fill="var(--color-sky-blue)">
                    <motion.tspan 
                      initial={{ fontSize: "5.5rem", opacity: 1 }}
                      animate={{ fontSize: "0rem", opacity: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    >
                      i
                    </motion.tspan>
                    <motion.tspan 
                      initial={{ fontSize: "0rem", opacity: 0 }}
                      animate={{ fontSize: "5.5rem", opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    >
                      I
                    </motion.tspan>
                  </tspan>
                  <motion.tspan 
                    initial={{ fontSize: "0rem", opacity: 0 }}
                    animate={{ fontSize: "5.5rem", opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    fill="#ffffff"
                  >
                    {"n\u00A0"}
                  </motion.tspan>
                  <tspan fill="var(--color-sky-blue)">
                    <motion.tspan 
                      initial={{ fontSize: "5.5rem", opacity: 1 }}
                      animate={{ fontSize: "0rem", opacity: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    >
                      f
                    </motion.tspan>
                    <motion.tspan 
                      initial={{ fontSize: "0rem", opacity: 0 }}
                      animate={{ fontSize: "5.5rem", opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    >
                      F
                    </motion.tspan>
                  </tspan>
                  <tspan fill="var(--color-sky-blue)" style={{ fontSize: "5.5rem" }}>in</tspan>
                  <motion.tspan 
                    initial={{ fontSize: "0rem", opacity: 0 }}
                    animate={{ fontSize: "5.5rem", opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    fill="#ffffff"
                  >
                    ance.
                  </motion.tspan>
                </text>
              </svg>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="text-body-base text-lg lg:text-xl max-w-2xl mx-auto mt-4 relative z-10"
            >
              The intelligent, AI-driven financial education app built for absolute clarity. Stop guessing, start understanding.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="pt-8 relative z-10"
            >
              <motion.a 
                href="https://play.google.com/store/apps/details?id=com.clarifin.app"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, boxShadow: "0px 0px 25px rgba(111, 178, 230, 0.6)" }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary px-10 py-4 text-lg flex items-center justify-center gap-3"
              >
                <svg viewBox="0 0 512 512" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <span>Download Now</span>
              </motion.a>
            </motion.div>
          </div>

          {/* Floating Raw Data */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            className="w-full max-w-7xl mx-auto mt-24 lg:mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 px-4 text-center"
          >
            <div className="flex flex-col items-center">
              <span className="text-mono-xl text-white md:text-4xl lg:text-5xl font-medium flex">
                $<CountUp end={2.4} decimals={1} duration={1.5} />B
              </span>
              <span className="text-body-sm mt-2 tracking-wide uppercase opacity-80">Managed Volume</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-mono-xl text-[var(--color-return-positive)] md:text-4xl lg:text-5xl font-medium flex">
                +<CountUp end={18.4} decimals={1} duration={1.5} />%
              </span>
              <span className="text-body-sm mt-2 tracking-wide uppercase opacity-80">Avg. Annual Yield</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-mono-xl text-white md:text-4xl lg:text-5xl font-medium flex">
                <CountUp end={99.9} decimals={1} duration={1.5} />%
              </span>
              <span className="text-body-sm mt-2 tracking-wide uppercase opacity-80">Execution Rate</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-mono-xl text-white md:text-4xl lg:text-5xl font-medium flex">
                <CountUp end={140} duration={1.5} />+
              </span>
              <span className="text-body-sm mt-2 tracking-wide uppercase opacity-80">Markets Supported</span>
            </div>
          </motion.div>
        </main>
        </motion.div>

        {/* --- LAYER 2: EDGE-TO-EDGE DATA VISUALIZATION --- */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0">
          <WaveUI />
        </div>
        </section>
      </div>

      {/* --- NEW SECTION WITH DIAMOND UI --- */}
      <section className="relative w-full min-h-screen bg-[var(--color-navy-base)] flex flex-col md:flex-row items-center justify-between overflow-hidden px-8 lg:px-24">

        {/* Content on the left */}
        <div className="relative z-10 w-full md:w-1/2 flex flex-col items-start text-left pt-32 md:pt-0">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-tight"
          >
            True<br /><span className="text-purple-500">Wealth.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-lg"
          >
            A rich person is not someone who has a lot of money. A truly rich person is someone who has a lot of wealth.
          </motion.p>
        </div>

        {/* 3D Diamond on the right */}
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-screen flex items-center justify-center">
          {/* Subtle purple gradient glow behind the diamond */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-purple-600 opacity-50 blur-[120px] pointer-events-none" />
          <DiamondUI />
        </div>

        {/* Subtle top/bottom gradient overlays to blend the section */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--color-navy-base)] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--color-navy-base)] to-transparent pointer-events-none" />
      </section>

      {/* --- NEW SECTION: LEGACY BANKING --- */}
      <section className="relative w-full min-h-screen bg-[var(--color-navy-base)] flex flex-col-reverse md:flex-row items-center justify-between overflow-hidden px-8 lg:px-24">
        
        {/* 3D Bank Tower on the Left */}
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-screen flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-[var(--color-return-negative)] opacity-10 blur-[120px] pointer-events-none" />
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <group scale={18} position={[0, -0.1, 0]}>
              <MazeBankTowerModel />
            </group>
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate={true} 
              autoRotateSpeed={1.5} 
            />
          </Canvas>
        </div>

        {/* Content on the Right */}
        <div className="relative z-10 w-full md:w-1/2 flex flex-col items-start text-left pt-32 md:pt-0 md:pl-16">
          <motion.h2
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-tight"
          >
            Traditional Banking is <span className="text-[var(--color-return-negative)]">Dead.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-lg"
          >
            Inflation is quietly eating your savings. Keeping money in legacy institutions guarantees a negative real return. It&apos;s time to escape the stagnant yields of the past and leverage AI to actively compound your wealth.
          </motion.p>
        </div>

        {/* Subtle top/bottom gradient overlays to blend the section */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--color-navy-base)] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--color-navy-base)] to-transparent pointer-events-none" />
      </section>

      {/* --- NEW SECTION: MONEY TREE --- */}
      <section className="relative w-full min-h-screen bg-[var(--color-navy-base)] flex items-center justify-center overflow-hidden px-8 lg:px-24">
        
        {/* 3D Money Tree in the Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl h-[90%] rounded-full bg-[var(--color-return-positive)] opacity-15 blur-[150px] pointer-events-none" />
          <Canvas gl={{ localClippingEnabled: true }} camera={{ position: [0, 3.5, 7], fov: 45 }} className="pointer-events-auto">
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
            <Center>
              <group scale={0.8} rotation={[0, Math.PI / 1.5, 0]}>
                <MoneyPalmTreeModel />
              </group>
            </Center>
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate={true}
              autoRotateSpeed={2}
              target={[0, 1.2, 0]}
            />
          </Canvas>
          {/* Depth overlay moved behind text or made very subtle to not darken the tree itself */}
        </div>

        {/* Massive Background Typography Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none w-full h-full overflow-hidden">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-[16vw] md:text-[14vw] lg:text-[12vw] font-black tracking-tighter text-white/95 leading-[0.85] text-center drop-shadow-2xl uppercase select-none w-full whitespace-nowrap mt-[25vh]"
          >
            MONEY DOESN&apos;T<br />
            <span className="text-[var(--color-return-positive)] block mt-[-1vw]">GROW ON TREES.</span>
          </motion.h2>
        </div>

        {/* Floating Subheader */}
        <div className="absolute bottom-12 z-30 w-full px-8 pointer-events-none flex justify-center">
           <motion.p
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="text-base md:text-lg lg:text-xl text-zinc-300 max-w-3xl text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-medium"
           >
             Wealth isn&apos;t magically generated overnight. Real money only grows when you actively invest it. Our AI continuously analyzes markets, discovering high-yield opportunities so you can cultivate a portfolio that naturally scales.
           </motion.p>
        </div>
        
        {/* Top gradient overlay to blend the section */}
        <div className="absolute top-0 left-0 w-full h-32 z-20 bg-gradient-to-b from-[var(--color-navy-base)] to-transparent pointer-events-none" />
        
        {/* Massive bottom fade to smoothly hide the cut stem and improve subheader legibility */}
        <div className="absolute bottom-0 left-0 w-full h-64 md:h-[40vh] z-20 bg-gradient-to-t from-[var(--color-navy-base)] via-[var(--color-navy-base)]/80 to-transparent pointer-events-none" />
      </section>

      {/* --- NEW SECTION: MAZE DISSOLVE --- */}
      {/* Sticky Scroll Wrapper with 350vh for extra scroll time (Enter -> Hold -> Dissolve) */}
      <section ref={mazeContainerRef} className="relative h-[350vh] w-full bg-[var(--color-navy-base)]">
        
        {/* The pinned 3D Canvas area */}
        <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
          {/* Subtle magenta gradient glow behind the model */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-fuchsia-500 opacity-15 blur-[120px] pointer-events-none" />
          
          <Canvas camera={{ position: [0, -0.2, 7], fov: 60 }} className="w-full h-full">
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
            <Center>
              <group scale={1.2} position={[0, -1, 0]}>
                <MazeModel scrollProgress={mazeScrollProgress} />
              </group>
            </Center>
            <OrbitControls 
              makeDefault
              enablePan={true} 
              enableZoom={false}
              minDistance={0.1}
              maxDistance={30}
              enableRotate={true}
              autoRotate={false}
              target={[0, -0.2, 0]}
              minPolarAngle={Math.PI / 2}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>

          {/* Fading Text Content */}
          <div 
            ref={textRef}
            style={{ opacity: 0, pointerEvents: 'none' }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 px-8 text-center"
          >
            <h2 className="text-[14vw] md:text-[12vw] lg:text-[10vw] whitespace-nowrap font-bold mb-6 tracking-tight text-fuchsia-500 leading-none drop-shadow-2xl">
              Escape The Maze
            </h2>
            <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-medium">
              Find your way out. Try the Clarifin app, where we break down complex finance into simple, easy-to-understand steps.
            </p>
            <motion.div className="mt-10 pointer-events-auto">
              <motion.a 
                href="https://play.google.com/store/apps/details?id=com.clarifin.app"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, boxShadow: "0px 0px 25px rgba(217, 70, 239, 0.6)" }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-colors duration-300"
              >
                <svg viewBox="0 0 512 512" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <span>Download the App</span>
              </motion.a>
            </motion.div>
          </div>

          {/* Scroll Indicator Hint */}
          <motion.div 
            style={{ opacity: mazeScrollIndicatorOpacity }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/50 tracking-[0.2em] text-[10px] sm:text-xs uppercase z-20 pointer-events-none"
          >
            <span>Scroll down to escape</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-[1px] h-10 bg-gradient-to-b from-white/50 to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* --- NEW SECTION: VINTAGE CLOCK --- */}
      <section className="relative w-full min-h-screen bg-[var(--color-navy-base)] flex items-center justify-center overflow-hidden px-8 lg:px-24">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col items-center justify-end z-0">
          {/* Moving TRON-style Perspective Road */}
          <div className="absolute bottom-0 w-full h-[60vh] [mask-image:linear-gradient(to_top,black_10%,transparent_100%)] opacity-50">
            <div 
              className="w-full h-full relative"
              style={{
                transform: 'perspective(500px) rotateX(60deg) scale(3)',
                transformOrigin: 'bottom center'
              }}
            >
              {/* Left boundary */}
              <div className="absolute left-[calc(50%-150px)] top-0 bottom-0 w-[2px] bg-[#F97316] opacity-40" />
              {/* Right boundary */}
              <div className="absolute left-[calc(50%+150px)] top-0 bottom-0 w-[2px] bg-[#F97316] opacity-40" />
              {/* Center dashed line */}
              <motion.div 
                animate={{ backgroundPosition: ['0px 0px', '0px 128px'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="absolute left-[calc(50%-2px)] top-0 bottom-0 w-[4px]"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, transparent 0%, transparent 50%, #F97316 50%, #F97316 100%)',
                  backgroundSize: '100% 128px'
                }}
              />
            </div>
          </div>
        </div>

        {/* 3D Clock Centered */}
        <div className="relative w-full h-screen flex items-center justify-center z-10">
          {/* Subtle orange gradient glow behind the clock */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-4xl h-[70%] rounded-full bg-orange-600 opacity-20 blur-[120px] pointer-events-none" />
          
          <Canvas camera={{ position: [2.5, -1.8, 3.5], fov: 60 }} className="w-full h-full">
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={3} color="#F97316" />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} />
            <PassingStreetLights />
            <Environment preset="city" />
            <Center>
              <group rotation={[0, 0, Math.PI / 2]}>
                <VintageClockModel rotation={[Math.PI / 2, 0, 0]} />
              </group>
            </Center>
            <OrbitControls 
              makeDefault
              enablePan={false} 
              enableZoom={false}
              minDistance={0.1}
              maxDistance={30}
              enableRotate={true}
              autoRotate={false}
              target={[0, 0, 0]}
            />
          </Canvas>
        </div>

        {/* Text Overlay (Left & Right) */}
        <div className="absolute inset-0 z-10 flex flex-col md:flex-row items-center justify-between pointer-events-none px-4 md:px-8 w-full max-w-6xl mx-auto h-full">
          {/* Left Text */}
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-none drop-shadow-2xl text-center md:text-left mt-24 md:mt-0 uppercase"
          >
            DON&apos;T <br className="hidden md:block" /> WASTE
          </motion.h2>

          {/* Right Text */}
          <motion.h2
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none drop-shadow-2xl text-center md:text-right mb-24 md:mb-0"
          >
            <span className="text-transparent [-webkit-text-stroke:2px_#F97316] italic">INVEST <br className="hidden md:block" /> NOW.</span>
          </motion.h2>
        </div>

        {/* Subtle top/bottom gradient overlays to blend the section */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--color-navy-base)] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--color-navy-base)] to-transparent pointer-events-none" />
      </section>

    </div>
  );
}
