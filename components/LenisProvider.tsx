"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Rolagem suave global. Respeita prefers-reduced-motion (Lenis + check local).
 */
export default function LenisProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      // Suave, mas sem double-smoothing pesado sobre Framer scroll stories
      lerp: 0.085,
      smoothWheel: true,
    });

    let frameId = 0;

    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return null;
}
