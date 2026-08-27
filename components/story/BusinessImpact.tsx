"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/motion/Reveal";

const ELOS = [
  "Falha",
  "Caminhão parado",
  "Carga atrasada",
  "Custo extra",
  "Cliente pressionando",
  "Margem reduzida",
];

const CUSTOS = [
  {
    tag: "Tempo",
    titulo: "A agenda do gestor",
    texto:
      "Ligação para oficina, cotação, guincho, remanejo de rota. O dia inteiro consumido por uma ocorrência que já aconteceu.",
    cor: "#f0a93c",
  },
  {
    tag: "Caixa",
    titulo: "O custo fora do plano",
    texto:
      "Peça em urgência, mão de obra emergencial, deslocamento e frete alternativo entram sem passar pelo orçamento.",
    cor: "#ff6b6b",
  },
  {
    tag: "Relação",
    titulo: "A confiança do cliente",
    texto:
      "Prazo perdido cobra caro depois: renegociação, prioridade menor na próxima carga, margem apertada.",
    cor: "#2d8cff",
  },
];

export default function BusinessImpact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section className="impact-section theme-paper" id="dor" aria-labelledby="impacto-title">
      <div className="wrap">
        <div className="impact-intro">
          <Reveal>
            <div className="eyebrow">O custo invisível</div>
            <h2 id="impacto-title">
              Um problema técnico
              <br />
              raramente termina
              <br />
              na oficina.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              Quando a manutenção só acontece depois da falha, o gestor não compra apenas uma peça.
              Ele absorve urgência, parada, deslocamento, negociação de oficina e risco de atraso —
              tudo no mesmo dia, tudo fora do orçamento.
            </p>
            <p className="impact-aside">É a parte da conta que ninguém coloca na planilha.</p>
          </Reveal>
        </div>

        <div className="chain" ref={ref} aria-label="Cadeia de impacto de uma falha">
          {ELOS.map((elo, index) => (
            <span key={elo} style={{ display: "contents" }}>
              <span
                className={`chain-node${inView ? " is-active" : ""}`}
                style={{ transitionDelay: `${index * 110}ms` }}
              >
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

        <div className="impact-cards">
          {CUSTOS.map((custo, index) => (
            <Reveal key={custo.tag} delay={index * 0.06} className="cost-card">
              <div className="cost-card-bar" style={{ background: custo.cor }} />
              <div className="cost-card-tag">{custo.tag}</div>
              <h3>{custo.titulo}</h3>
              <p>{custo.texto}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
