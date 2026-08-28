"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import Reveal from "@/components/motion/Reveal";

const STEPS = [
  {
    title: "Falha",
    copy: "Um sinal técnico que poderia ter sido antecipado vira ocorrência na estrada.",
  },
  {
    title: "Caminhão parado",
    copy: "O ativo para. A rota atrasa. A operação começa a improvisar.",
  },
  {
    title: "Carga atrasa",
    copy: "Prazo comercial fica sob pressão — e o telefone não para.",
  },
  {
    title: "Operação reage",
    copy: "Guincho, oficina de emergência, hospedagem, frete alternativo.",
  },
  {
    title: "Custo aumenta",
    copy: "O prejuízo da parada come o que o frete deveria proteger.",
  },
  {
    title: "Cliente é impactado",
    copy: "A relação comercial sente o impacto da falha operacional.",
  },
];

/** Path horizontal desktop — viewBox com padding lateral. */
const DESKTOP_PATH =
  "M 60 150 C 140 150, 160 60, 250 60 S 350 210, 440 210 S 540 60, 630 60 S 730 210, 820 210 S 930 150, 1020 150";

const NODE_POSITIONS = [
  { x: 60, y: 150 },
  { x: 250, y: 60 },
  { x: 440, y: 210 },
  { x: 630, y: 60 },
  { x: 820, y: 210 },
  { x: 1020, y: 150 },
];

/** viewBox width/height usados no posicionamento % do overlay HTML. */
const VB_W = 1080;
const VB_H = 300;

export default function FailureChain() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [ativo, setAtivo] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.45"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) {
      setAtivo(STEPS.length - 1);
      return;
    }
    const idx = Math.min(STEPS.length - 1, Math.floor(v * STEPS.length));
    setAtivo(idx);
  });

  const destaque = hovered ?? ativo;

  return (
    <section
      className="failure-section"
      ref={sectionRef}
      aria-labelledby="cadeia-title"
    >
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Cadeia de impacto</div>
          <h2 id="cadeia-title">Operar reagindo multiplica o custo de cada falha.</h2>
          <p style={{ marginTop: 16, maxWidth: 560 }}>
            Não é só o conserto. É a sequência que começa depois que o caminhão já parou — role
            para ver ela acontecer.
          </p>
        </Reveal>

        <div className="failure-desktop" aria-hidden={false}>
          <div className="failure-canvas">
            <svg
              className="failure-svg"
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              role="img"
              aria-label="Cadeia de causa e consequência de uma falha operacional"
              overflow="visible"
            >
              <path
                d={DESKTOP_PATH}
                fill="none"
                stroke="rgba(234,240,238,0.09)"
                strokeWidth="2"
                strokeDasharray="6 8"
              />
              <motion.path
                d={DESKTOP_PATH}
                fill="none"
                stroke="url(#failGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#failGlow)"
                style={{ pathLength: reduce ? 1 : pathLength }}
              />
              <defs>
                <linearGradient id="failGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f0a93c" />
                  <stop offset="55%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#ff6b6b" />
                </linearGradient>
                <filter id="failGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {NODE_POSITIONS.map((pos, i) => {
                const on = i <= destaque;
                return (
                  <g key={STEPS[i].title}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={on ? 8 : 6}
                      fill={on ? (i === destaque ? "#ff6b6b" : "#f0a93c") : "#0d1016"}
                      stroke="#f0a93c"
                      strokeWidth="2"
                      opacity={on ? 1 : 0.3}
                    />
                    {on && i === destaque && !reduce && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={16}
                        fill="none"
                        stroke="#f0a93c"
                        strokeOpacity="0.35"
                      >
                        <animate
                          attributeName="r"
                          values="12;18;12"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="stroke-opacity"
                          values="0.4;0;0.4"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="failure-labels" aria-hidden="false">
              {NODE_POSITIONS.map((pos, i) => {
                const on = i <= destaque;
                const above = i % 2 !== 0;
                return (
                  <button
                    type="button"
                    key={STEPS[i].title}
                    className={`failure-node-label${on ? " is-on" : ""}${above ? " is-above" : " is-below"}`}
                    style={{
                      left: `${(pos.x / VB_W) * 100}%`,
                      top: `${(pos.y / VB_H) * 100}%`,
                    }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    aria-pressed={i === destaque}
                  >
                    {STEPS[i].title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="failure-active-copy" aria-live="polite">
            <div className="failure-index">
              ETAPA {String(destaque + 1).padStart(2, "0")} / 06
            </div>
            <strong>{STEPS[destaque].title}</strong>
            <p>{STEPS[destaque].copy}</p>
          </div>
        </div>

        <div className="failure-track failure-mobile">
          <div
            className="failure-line-fill"
            style={{
              height: reduce
                ? "100%"
                : `${((ativo + 1) / STEPS.length) * 100}%`,
            }}
          />
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className={`failure-step${index <= ativo || reduce ? " is-active" : ""}`}
            >
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
