"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function RouteLine() {
  const reduce = useReducedMotion();

  return (
    <svg
      className="hero-route motion-safe-only"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10E1B1" stopOpacity="0" />
          <stop offset="45%" stopColor="#10E1B1" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#2D8CFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M -40 520 C 220 500, 380 420, 560 360 S 900 250, 1240 210"
        stroke="url(#routeGrad)"
        strokeWidth="2"
        fill="none"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
      />
      <motion.path
        d="M -40 560 C 260 540, 420 460, 600 400 S 940 290, 1240 250"
        stroke="url(#routeGrad)"
        strokeWidth="1.2"
        fill="none"
        opacity={0.45}
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
      />
    </svg>
  );
}
