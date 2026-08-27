"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
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
    title: "Carga atrasada",
    copy: "Prazo comercial fica sob pressão — e o telefone não para.",
  },
  {
    title: "Custo extra",
    copy: "Guincho, oficina de emergência, hospedagem, frete alternativo.",
  },
  {
    title: "Cliente pressionando",
    copy: "A relação comercial sente o impacto da falha operacional.",
  },
  {
    title: "Margem do frete reduzida",
    copy: "O prejuízo da parada come o que o frete deveria proteger.",
  },
];

function FailureStep({
  title,
  copy,
  index,
}: {
  title: string;
  copy: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6, margin: "0px 0px -10% 0px" });

  return (
    <div
      ref={ref}
      className={`failure-step${inView ? " is-active" : ""}`}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  );
}

export default function FailureChain() {
  return (
    <section className="failure-section" aria-labelledby="cadeia-title">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Cadeia de impacto</div>
          <h2 id="cadeia-title">Operar reagindo multiplica o custo de cada falha.</h2>
          <p style={{ marginTop: 14, maxWidth: 520 }}>
            Não é só o conserto. É a sequência que começa depois que o caminhão já parou.
          </p>
        </Reveal>

        <div className="failure-track">
          {STEPS.map((step, index) => (
            <FailureStep key={step.title} title={step.title} copy={step.copy} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
