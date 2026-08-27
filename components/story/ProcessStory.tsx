"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { track } from "@/lib/analytics";

const ETAPAS = [
  {
    titulo: "Entendemos sua operação",
    texto:
      "Base, perfil de rota, tamanho da frota e categorias de veículo — para desenhar o acompanhamento certo.",
    meta: [
      ["Base", "Sinop / MT"],
      ["Perfil", "Grãos · longa distância"],
      ["Frota", "Diesel · pesados"],
      ["Corredor", "BR-163 / BR-364"],
    ],
  },
  {
    titulo: "Avaliamos cada caminhão",
    texto:
      "Checklist estruturado, evidências e classificação de risco para saber o que precisa de atenção primeiro.",
    meta: [
      ["Checklist", "Itens técnicos"],
      ["Evidências", "Fotos + observações"],
      ["Risco", "Prioridade por veículo"],
      ["Saída", "Laudo individual"],
    ],
  },
  {
    titulo: "Montamos a rotina",
    texto:
      "Preventiva programada, aprovações e calendário alinhados à operação — não ao improviso da urgência.",
    meta: [
      ["Calendário", "Preventiva"],
      ["Prioridade", "Crítico → planejado"],
      ["Aprovação", "Central técnica"],
      ["Rotina", "Acompanhamento contínuo"],
    ],
  },
  {
    titulo: "Acompanhamos os serviços",
    texto:
      "OS, itens, status e auditoria — para você decidir com mais informação antes de aprovar a oficina.",
    meta: [
      ["OS", "Itens detalhados"],
      ["Análise", "Auditoria técnica"],
      ["Status", "Visível na operação"],
      ["Decisão", "Sua, com mais dado"],
    ],
  },
];

function Painel({ etapa }: { etapa: (typeof ETAPAS)[number] }) {
  return (
    <div className="process-panel-card">
      <span className="demo-tag">Modelo demonstrativo</span>
      <h3>{etapa.titulo}</h3>
      <p>{etapa.texto}</p>
      <div className="process-panel-meta">
        {etapa.meta.map(([label, valor]) => (
          <div className="process-meta-row" key={label}>
            <span>{label}</span>
            <strong>{valor}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Histerese: entra no passo N um pouco depois do limite; volta só abaixo. */
function passoComHisterese(valor: number, atual: number, total: number): number {
  const size = 1 / total;
  // Limites com zona morta (~0.04 do progresso total ≈ plano 0.22/0.28)
  const enter = (i: number) => i * size + 0.04;
  const exitBack = (i: number) => i * size - 0.02;

  if (atual < total - 1 && valor >= enter(atual + 1)) {
    return Math.min(total - 1, atual + 1);
  }
  if (atual > 0 && valor < exitBack(atual)) {
    return Math.max(0, atual - 1);
  }
  // Inicial / salto
  if (valor === 0 && atual === 0) return 0;
  const raw = Math.min(total - 1, Math.floor(valor * total));
  if (Math.abs(raw - atual) > 1) return raw;
  return atual;
}

export default function ProcessStory() {
  const containerRef = useRef<HTMLElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const ativoRef = useRef(0);
  const tracked = useRef(false);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (valor) => {
    if (reduce) return;
    const next = passoComHisterese(valor, ativoRef.current, ETAPAS.length);
    if (next !== ativoRef.current) {
      ativoRef.current = next;
      setAtivo(next);
    }
    if (!tracked.current && valor > 0.05) {
      tracked.current = true;
      track("process_section_view");
    }
  });

  const visivel = preview ?? ativo;

  return (
    <section
      className="process-story"
      id="como-funciona"
      ref={containerRef}
      aria-labelledby="process-title"
      style={{ height: reduce ? undefined : `${ETAPAS.length * 100}vh` }}
    >
      <div className="process-story-inner">
        <div className="process-story-rail">
          <div className="process-progress">
            {String(visivel + 1).padStart(2, "0")} / {String(ETAPAS.length).padStart(2, "0")}
          </div>
          <div className="eyebrow" style={{ color: "#0a7a5f" }}>
            Como funciona
          </div>
          <div className="process-copy-stage">
            {ETAPAS.map((item, index) => (
              <div
                key={item.titulo}
                className={`process-copy-layer${index === visivel ? " is-active" : ""}`}
                aria-hidden={index !== visivel}
              >
                <h2 id={index === 0 ? "process-title" : undefined}>{item.titulo}</h2>
                <p>{item.texto}</p>
              </div>
            ))}
          </div>
          <div className="process-dots" role="tablist" aria-label="Etapas do processo">
            {ETAPAS.map((item, index) => (
              <button
                key={item.titulo}
                type="button"
                className={`process-dot${index === visivel ? " is-active" : ""}`}
                aria-label={`Etapa ${index + 1}: ${item.titulo}`}
                aria-current={index === ativo}
                onMouseEnter={() => setPreview(index)}
                onMouseLeave={() => setPreview(null)}
                onFocus={() => setPreview(index)}
                onBlur={() => setPreview(null)}
                onClick={() => {
                  const el = containerRef.current;
                  if (!el) return;
                  const top = el.offsetTop + (el.offsetHeight * (index + 0.5)) / ETAPAS.length;
                  window.scrollTo({ top, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>

        <div className="process-story-panels">
          <div className="process-panel-stage">
            {ETAPAS.map((item, index) => (
              <div
                key={item.titulo}
                className={`process-panel-layer${index === visivel ? " is-active" : ""}`}
                aria-hidden={index !== visivel}
              >
                <Painel etapa={item} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="process-mobile">
        <div className="eyebrow" style={{ color: "#0a7a5f" }}>
          Como funciona
        </div>
        <h2 style={{ marginBottom: 12 }}>Da operação à rotina técnica</h2>
        <p style={{ marginBottom: 24, color: "var(--ink-mut-on-light)" }}>
          Quatro etapas para sair do improviso e acompanhar a frota com método.
        </p>
        {ETAPAS.map((item, index) => (
          <div className="process-mobile-step" key={item.titulo}>
            <div className="process-progress" style={{ marginBottom: 10 }}>
              {String(index + 1).padStart(2, "0")} / 04
            </div>
            <Painel etapa={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
