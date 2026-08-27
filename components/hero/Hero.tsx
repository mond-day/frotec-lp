"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { track } from "@/lib/analytics";
import HeroMedia from "./HeroMedia";
import HeroOperationalData from "./HeroOperationalData";
import RouteLine from "./RouteLine";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.04]);
  const transitionOpacity = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);

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
                Frota parada custa mais do que manutenção.
              </motion.span>
              <motion.span
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              >
                Custa prazo, margem e confiança.
              </motion.span>
            </h1>

            <motion.p
              className="lead"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.52 }}
            >
              A Frotec acompanha o estado técnico da sua frota, organiza a prevenção e audita os
              serviços para você operar com mais previsibilidade — antes que uma falha vire
              emergência na estrada.
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.68 }}
            >
              <a
                href="#contato"
                className="btn btn-primary"
                onClick={() => track("hero_cta_click", { source: "hero" })}
              >
                Quero diagnosticar minha frota
              </a>
              <a
                href="#como-funciona"
                className="btn btn-ghost"
                onClick={() => track("secondary_cta_click", { source: "hero" })}
              >
                Ver como funciona
              </a>
            </motion.div>

            <p className="hero-micro">Para transportadoras e operações com frota diesel.</p>

            <motion.p className="hero-transition" style={{ opacity: transitionOpacity }}>
              Quando um caminhão para, a operação inteira sente.
            </motion.p>
          </div>

          <HeroOperationalData />
        </div>
      </motion.div>
    </section>
  );
}
