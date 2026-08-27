"use client";

import { MotionConfig as FMConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Easing e duração padrão — evita timings divergentes entre seções. */
export const MOTION = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  fast: 0.22,
  slow: 0.72,
};

type Props = { children: ReactNode };

export default function MotionConfigProvider({ children }: Props) {
  return (
    <FMConfig reducedMotion="user" transition={{ duration: MOTION.duration, ease: MOTION.ease }}>
      {children}
    </FMConfig>
  );
}
