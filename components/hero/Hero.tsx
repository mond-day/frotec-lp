"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import HeroMedia from "./HeroMedia";
import HeroOperationalData from "./HeroOperationalData";
import HeroTimeline from "./HeroTimeline";

const VARIANTES = [
  { id: 0, n: "01", nome: "Corredor" },
  { id: 1, n: "02", nome: "Editorial" },
  { id: 2, n: "03", nome: "Linha do tempo" },
] as const;

/** Padrão do export: Editorial. */
const VARIANTE_PADRAO = 1;

function Ctas({
  source,
  secondary = true,
}: {
  source: string;
  secondary?: boolean;
}) {
  return (
    <div className="hero-cta">
      <a
        href="#contato"
        className="btn btn-primary"
        onClick={() => track("hero_cta_click", { source })}
      >
        Avaliar minha frota <span className="btn-arrow" aria-hidden="true">→</span>
      </a>
      {secondary ? (
        <a
          href="#como-funciona"
          className="btn btn-ghost"
          onClick={() => track("secondary_cta_click", { source })}
        >
          Ver como funciona
        </a>
      ) : null}
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [variante, setVariante] = useState(VARIANTE_PADRAO);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 64]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.05]);
  const layoutClass =
    variante === 1 ? " is-editorial" : variante === 2 ? " is-timeline" : "";

  return (
    <section
      className={`hero${layoutClass}`}
      id="topo"
      ref={ref}
      data-hero-variante={VARIANTES[variante]?.nome}
    >
      <motion.div className="hero-media" style={{ scale: mediaScale }} aria-hidden="true">
        <HeroMedia />
      </motion.div>

      <motion.div className="hero-content" style={{ y: contentY }}>
        {variante === 0 ? (
          <div className="wrap hero-layout" key="corredor">
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
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.53 }}
              >
                <Ctas source="hero-corredor" />
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
        ) : null}

        {variante === 1 ? (
          <div className="wrap hero-layout" key="editorial">
            <div className="hero-copy">
              <motion.div
                className="hero-editorial-kicker"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.14 }}
              >
                <span aria-hidden="true" />
                Gestão técnica de frotas diesel
                <span aria-hidden="true" />
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
                Previsibilidade técnica para quem não pode ter caminhão parado no corredor da
                BR-163.
              </motion.p>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.53 }}
              >
                <Ctas source="hero-editorial" />
              </motion.div>

              <motion.ul
                className="hero-chips"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.6 }}
              >
                <li>Avaliação técnica</li>
                <li>Preventiva programada</li>
                <li>Auditoria de OS</li>
                <li>Rede no corredor</li>
              </motion.ul>
            </div>
          </div>
        ) : null}

        {variante === 2 ? (
          <div className="wrap hero-layout" key="timeline">
            <div className="hero-copy">
              <motion.div
                className="hero-timeline-kicker"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.14 }}
              >
                01 — O sinal
              </motion.div>

              <h1>
                <motion.span
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.27, ease: [0.16, 1, 0.3, 1] }}
                >
                  Toda parada na estrada começa semanas antes.
                </motion.span>
              </h1>

              <motion.p
                className="lead"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                A Frotec transforma esse intervalo em rotina: diagnóstico, prioridade, preventiva e
                auditoria de orçamento no corredor onde sua frota roda.
              </motion.p>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.53 }}
              >
                <Ctas source="hero-timeline" secondary={false} />
              </motion.div>
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <HeroTimeline />
            </motion.div>
          </div>
        ) : null}

        <div className="wrap hero-foot">
          <p className="hero-micro">
            <span className="hero-micro-dot" aria-hidden="true" />
            Base Sinop/MT · rede credenciada no corredor · modelo demonstrativo de rotina técnica
          </p>
          <div className="hero-variants" role="group" aria-label="Variantes do hero">
            <span className="hero-variants-label">Hero</span>
            {VARIANTES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`hero-variant${variante === item.id ? " is-active" : ""}`}
                title={item.nome}
                aria-pressed={variante === item.id}
                aria-label={`Variante ${item.nome}`}
                onClick={() => setVariante(item.id)}
              >
                {item.n}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
