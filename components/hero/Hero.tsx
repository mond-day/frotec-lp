"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { track } from "@/lib/analytics";
import HeroMedia from "./HeroMedia";
import RouteLine from "./RouteLine";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 64]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.05]);

  return (
    <section className="hero" id="topo" ref={ref}>
      <motion.div className="hero-media" style={{ scale: mediaScale }} aria-hidden="true">
        <HeroMedia />
      </motion.div>
      <RouteLine />

      <motion.div className="hero-content" style={{ y: contentY }}>
        <div className="wrap hero-layout">
          <div className="hero-copy">
            <motion.div
              className="eyebrow"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              Gestão técnica para frotas que não podem parar
            </motion.div>

            <h1>
              <motion.span
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                Antes da quebra, existe um sinal.
              </motion.span>
            </h1>

            <motion.p
              className="lead"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
            >
              A Frotec ajuda sua operação a identificar riscos, organizar a preventiva e validar
              serviços antes que manutenção vire emergência.
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.58 }}
            >
              <a
                href="#contato"
                className="btn btn-primary"
                onClick={() => track("hero_cta_click", { source: "hero" })}
              >
                Avaliar minha frota
              </a>
              <a
                href="#como-funciona"
                className="btn btn-ghost"
                onClick={() => track("secondary_cta_click", { source: "hero" })}
              >
                Ver como funciona
              </a>
            </motion.div>

            <motion.p
              className="hero-micro"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.72 }}
            >
              <span className="hero-micro-dot" aria-hidden="true" />
              Corredor BR-163 · base em Sinop/MT · modelo demonstrativo de rotina técnica
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
