import React from "react";
import { motion, MotionValue, useScroll, useTransform } from "motion/react";

/*
  BACK LAYER — prominent flowing brand curves.
  Big gradient arcs that sweep across the page, gently sway on their own,
  and drift / rotate as you scroll (parallax). This is the "background motion"
  that lives behind the front feature content.
*/
export default function BrandTracksBackground() {
  const { scrollYProgress } = useScroll();
  // Scroll-driven parallax for the whole curve layer
  const y      = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 7]);
  const scale  = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 1, y, rotate, scale }}
    >
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full brand-sway">
        <defs>
          <linearGradient id="bt-pink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#F78B43" />
            <stop offset="50%"  stopColor="#E837AC" />
            <stop offset="100%" stopColor="#9b1c7a" />
          </linearGradient>
          <linearGradient id="bt-orange" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#F7D35F" />
            <stop offset="55%"  stopColor="#F78B43" />
            <stop offset="100%" stopColor="#E837AC" />
          </linearGradient>
          <linearGradient id="bt-yellow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#F7D35F" />
            <stop offset="100%" stopColor="#F78B43" />
          </linearGradient>
          <filter id="bt-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>

        {/* PINK — broad arch sweeping across the upper third */}
        <path d="M -200,560 C 360,80 1080,80 1660,470"
          fill="none" stroke="url(#bt-pink)" strokeWidth="110" strokeLinecap="round"
          opacity="0.22" filter="url(#bt-glow)" />
        <motion.path d="M -200,560 C 360,80 1080,80 1660,470"
          fill="none" stroke="url(#bt-pink)" strokeWidth="78" strokeLinecap="round" opacity="0.6"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }} />

        {/* ORANGE — mid arch */}
        <path d="M -180,820 C 440,400 1060,400 1680,760"
          fill="none" stroke="url(#bt-orange)" strokeWidth="80" strokeLinecap="round"
          opacity="0.18" filter="url(#bt-glow)" />
        <motion.path d="M -180,820 C 440,400 1060,400 1680,760"
          fill="none" stroke="url(#bt-orange)" strokeWidth="54" strokeLinecap="round" opacity="0.52"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.18, ease: [0.22, 1, 0.36, 1] }} />

        {/* YELLOW — slim lower arch */}
        <motion.path d="M -120,1020 C 460,690 1040,690 1620,980"
          fill="none" stroke="url(#bt-yellow)" strokeWidth="34" strokeLinecap="round" opacity="0.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.36, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
    </motion.div>
  );
}

/*
  Scroll-driven section track — a flowing curve that sweeps in from the right,
  holds while the section is read, then exits left. A mini feature card sits at
  the on-screen tip (the "mouth") of the curve.
*/
export function SectionTrack({
  progress, color, strokeWidth = 70, pathD, mouthX, mouthY, children,
}: {
  progress: MotionValue<number>;
  color: string;
  strokeWidth?: number;
  pathD: string;
  mouthX: number;
  mouthY: number;
  children?: React.ReactNode;
}) {
  const x       = useTransform(progress, [0, 0.14, 0.86, 1], [1200, 0, 0, -1300]);
  const opacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ x, opacity, position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 2 }}
    >
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full">
        {/* Glow halo */}
        <path d={pathD} fill="none" stroke={color}
          strokeWidth={strokeWidth * 2.6} strokeLinecap="round" opacity={0.1} />
        {/* Main arc */}
        <path d={pathD} fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeLinecap="round" opacity={0.55} />
        {/* Bright core line */}
        <path d={pathD} fill="none" stroke="#ffffff"
          strokeWidth={strokeWidth * 0.16} strokeLinecap="round" opacity={0.25} />
      </svg>

      {children && (
        <div
          style={{
            position: "absolute",
            left: `${(mouthX / 1440) * 100}%`,
            top:  `${(mouthY / 900)  * 100}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 3,
          }}
        >
          {children}
        </div>
      )}
    </motion.div>
  );
}
