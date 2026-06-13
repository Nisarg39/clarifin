"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[var(--color-navy-base)] text-white">
      
      {/* --- LAYER 1: AURORA BACKGROUND GLOWS --- */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-sky-blue)] opacity-20 blur-[150px] pointer-events-none" />
      <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] rounded-full bg-[var(--color-accent-yellow)] opacity-10 blur-[150px] pointer-events-none" />

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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <button className="btn-secondary hidden sm:block">Log In</button>
          <button className="btn-primary py-3 px-6 text-sm">Get Started</button>
        </motion.div>
      </nav>

      {/* --- LAYER 3: TYPOGRAPHIC INTERFACE (Main Content) --- */}
      <main className="relative z-40 flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-32 lg:pt-20">
        
        {/* Massive Centered Headline */}
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto relative">

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-display-hero relative z-10"
          >
            <span className="text-[var(--color-sky-blue)]">Clari</span>ty In <span className="text-[var(--color-sky-blue)]">Fin</span>ance.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="text-body-base text-lg lg:text-xl max-w-2xl mx-auto mt-8 relative z-10"
          >
            The premium, AI-driven portfolio manager built for those who demand precision over noise. Stop guessing, start executing.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="pt-8 relative z-10"
          >
            <button className="btn-primary text-lg px-10 py-4 shadow-[0_0_40px_rgba(112,170,228,0.5)]">
              Start Investing
            </button>
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
              $<CountUp end={2.4} decimals={1} duration={2.5} />B
            </span>
            <span className="text-body-sm mt-2 tracking-wide uppercase opacity-80">Managed Volume</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-mono-xl text-[var(--color-return-positive)] md:text-4xl lg:text-5xl font-medium flex">
              +<CountUp end={18.4} decimals={1} duration={2.5} />%
            </span>
            <span className="text-body-sm mt-2 tracking-wide uppercase opacity-80">Avg. Annual Yield</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-mono-xl text-white md:text-4xl lg:text-5xl font-medium flex">
              <CountUp end={99.9} decimals={1} duration={2.5} />%
            </span>
            <span className="text-body-sm mt-2 tracking-wide uppercase opacity-80">Execution Rate</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-mono-xl text-white md:text-4xl lg:text-5xl font-medium flex">
              <CountUp end={140} duration={2.5} />+
            </span>
            <span className="text-body-sm mt-2 tracking-wide uppercase opacity-80">Markets Supported</span>
          </div>
        </motion.div>
      </main>

      {/* --- LAYER 2: EDGE-TO-EDGE DATA VISUALIZATION --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
        className="absolute bottom-0 left-0 w-full h-[40vh] z-30 pointer-events-none"
      >
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-sky-blue)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-navy-base)" stopOpacity="0" />
            </linearGradient>
            
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <path
            d="M0 350 C 200 350, 300 200, 500 250 C 700 300, 800 50, 1000 150 C 1200 250, 1300 100, 1440 100 L 1440 400 L 0 400 Z"
            fill="url(#chart-gradient)"
          />
          <path
            d="M0 350 C 200 350, 300 200, 500 250 C 700 300, 800 50, 1000 150 C 1200 250, 1300 100, 1440 100"
            fill="none"
            stroke="var(--color-sky-blue)"
            strokeWidth="4"
            filter="url(#neon-glow)"
          />
          
          <circle 
             r="6" 
             fill="white" 
             stroke="var(--color-sky-blue)" 
             strokeWidth="4" 
             filter="url(#neon-glow)"
          >
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              path="M0 350 C 200 350, 300 200, 500 250 C 700 300, 800 50, 1000 150 C 1200 250, 1300 100, 1440 100"
            />
          </circle>
        </svg>
      </motion.div>

    </div>
  );
}
