import React from "react";
import { motion, useScroll } from "motion/react";

export default function BrandTracksBackground() {
  // Captures the user's scroll progress from 0 (top) to 1 (bottom)
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <svg 
        viewBox="0 0 1440 1000" 
        preserveAspectRatio="xMidYMid slice" 
        className="w-full h-full opacity-35"
      >
        {/* Track 1: Faria Pink */}
        <motion.path
          d="M -200,100 C 400,100 800,800 1600,800"
          fill="none"
          stroke="#E837AC"
          strokeWidth="80"
          strokeLinecap="round"
          style={{ pathLength: scrollYProgress }}
        />
        
        {/* Track 2: Faria Orange */}
        <motion.path
          d="M -200,200 C 400,200 800,900 1600,900"
          fill="none"
          stroke="#F78843"
          strokeWidth="80"
          strokeLinecap="round"
          style={{ pathLength: scrollYProgress }}
        />
        
        {/* Track 3: Faria Yellow */}
        <motion.path
          d="M -200,300 C 400,300 800,1000 1600,1000"
          fill="none"
          stroke="#F7D35F"
          strokeWidth="80"
          strokeLinecap="round"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
    </div>
  );
}
