"use client";

import { useMotionValueEvent, useScroll, type MotionValue } from "framer-motion";
import { useRef, useState, type RefObject } from "react";

type Band = { enter: number; exit: number };

/**
 * Um único scrollYProgress com bandas + histerese.
 * Evita flicker tipico de varios IntersectionObservers independentes.
 */
export function useScrollStep(
  stepCount: number,
  options?: {
    offset?: [string, string];
    /** Largura da zona morta entre passos (0–1 do progresso). */
    hysteresis?: number;
  },
): {
  ref: RefObject<HTMLElement | null>;
  progress: MotionValue<number>;
  step: number;
  setStep: (n: number) => void;
} {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const hysteresis = options?.hysteresis ?? 0.04;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: (options?.offset ?? ["start start", "end end"]) as ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (valor) => {
    const size = 1 / stepCount;
    const current = stepRef.current;

    const bands: Band[] = Array.from({ length: stepCount }, (_, i) => {
      const mid = (i + 0.5) * size;
      return {
        enter: Math.max(0, mid - size / 2 + hysteresis / 2),
        exit: Math.min(1, mid + size / 2 - hysteresis / 2),
      };
    });

    let next = current;
    if (valor > bands[current]?.exit && current < stepCount - 1) {
      next = Math.min(stepCount - 1, Math.floor(valor * stepCount + hysteresis));
    } else if (valor < bands[current]?.enter && current > 0) {
      next = Math.max(0, Math.floor(valor * stepCount - hysteresis));
    } else {
      // Primeira leitura / salto grande
      next = Math.min(stepCount - 1, Math.max(0, Math.floor(valor * stepCount)));
    }

    // Clamp com histerese nos limites entre vizinhos
    if (next !== current) {
      const boundary = next > current ? next * size : current * size;
      if (next > current && valor < boundary + hysteresis / 2) return;
      if (next < current && valor > boundary - hysteresis / 2) return;
      stepRef.current = next;
      setStep(next);
    }
  });

  return { ref, progress: scrollYProgress, step, setStep };
}
