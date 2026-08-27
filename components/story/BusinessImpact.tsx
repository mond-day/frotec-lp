"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/motion/Reveal";

const ELOS = ["Falha", "Caminhão parado", "Carga atrasada", "Custo extra", "Cliente pressionando", "Margem reduzida"];

export default function BusinessImpact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section className="impact-section theme-light" id="impacto" aria-labelledby="impacto-title">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">O custo invisível</div>
          <h2 id="impacto-title">Um problema técnico raramente termina na oficina.</h2>
        </Reveal>

        <div className="chain" ref={ref} aria-label="Cadeia de impacto de uma falha">
          {ELOS.map((elo, index) => (
            <span key={elo} style={{ display: "contents" }}>
              <span className={`chain-node${inView ? " is-active" : ""}`} style={{ transitionDelay: `${index * 90}ms` }}>
                {elo}
              </span>
              {index < ELOS.length - 1 && (
                <span className="chain-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </span>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="impact-copy">
            Quando a manutenção só acontece depois da falha, o gestor não compra apenas uma peça. Ele
            absorve urgência, parada, deslocamento, negociação de oficina e risco de atraso.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
