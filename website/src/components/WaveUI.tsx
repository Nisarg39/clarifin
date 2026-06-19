import { motion } from "framer-motion";

export default function WaveUI() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
      className="absolute bottom-0 left-0 w-full h-[25vh] z-30 pointer-events-none"
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
  );
}
