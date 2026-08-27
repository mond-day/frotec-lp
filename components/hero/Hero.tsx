"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { track } from "@/lib/analytics";
import HeroMedia from "./HeroMedia";
import HeroOperationalData from "./HeroOperationalData";

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

      <motion.div className="hero-content" style={{ y: contentY }}>
        <div className="wrap hero-layout">
          <div className="hero-copy">
            <motion.div
              className="live-badge"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14 }}
            >
              <span className="live-badge-dot" aria-hidden="true" />
              Corredor BR-163 · MT–RO
            </motion.div>

            <h1>
              <motion.span
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.27, ease: [0.16, 1, 0.3, 1] }}
              >
                Antes da quebra,
              </motion.span>
              <motion.span
                className="hero-accent"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                existe um sinal.
              </motion.span>
            </h1>

            <motion.p
              className="lead"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              A Frotec lê esse sinal antes da estrada. Avaliação técnica, preventiva organizada e
              auditoria de orçamento — para manutenção deixar de ser emergência e voltar a ser
              decisão.
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.53 }}
            >
              <a
                href="#contato"
                className="btn btn-primary"
                onClick={() => track("hero_cta_click", { source: "hero" })}
              >
                Avaliar minha frota <span className="btn-arrow" aria-hidden="true">→</span>
              </a>
              <a
                href="#como-funciona"
                className="btn btn-ghost"
                onClick={() => track("secondary_cta_click", { source: "hero" })}
              >
                Ver como funciona
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <HeroOperationalData />
          </motion.div>
        </div>

        <div className="wrap hero-foot">
          <p className="hero-micro">
            <span className="hero-micro-dot" aria-hidden="true" />
            Base Sinop/MT · rede credenciada no corredor · modelo demonstrativo de rotina técnica
          </p>
        </div>
      </motion.div>
    </section>
  );
}
