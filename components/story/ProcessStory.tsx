"use client";

import { useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import { track } from "@/lib/analytics";

const ETAPAS = [
  {
    titulo: "Entendemos sua operação",
    texto: "Base, perfil de rota, tamanho da frota e categorias de veículo — para desenhar o acompanhamento certo.",
    meta: [
      ["Base", "Sinop / MT"],
      ["Perfil", "Grãos · longa distância"],
      ["Frota", "Diesel · pesados"],
      ["Corredor", "BR-163 / BR-364"],
    ],
  },
  {
    titulo: "Avaliamos cada caminhão",
    texto: "Checklist estruturado, evidências e classificação de risco para saber o que precisa de atenção primeiro.",
    meta: [
      ["Checklist", "Itens técnicos"],
      ["Evidências", "Fotos + observações"],
      ["Risco", "Prioridade por veículo"],
      ["Saída", "Laudo individual"],
    ],
  },
  {
    titulo: "Montamos a rotina",
    texto: "Preventiva programada, aprovações e calendário alinhados à operação — não ao improviso da urgência.",
    meta: [
      ["Calendário", "Preventiva"],
      ["Prioridade", "Crítico → planejado"],
      ["Aprovação", "Central técnica"],
      ["Rotina", "Acompanhamento contínuo"],
    ],
  },
  {
    titulo: "Acompanhamos os serviços",
    texto: "OS, itens, status e auditoria — para você decidir com mais informação antes de aprovar a oficina.",
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

export default function ProcessStory() {
  const containerRef = useRef<HTMLElement>(null);
  const [ativo, setAtivo] = useState(0);
  const tracked = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (valor) => {
    const indice = Math.min(ETAPAS.length - 1, Math.floor(valor * ETAPAS.length));
    setAtivo(indice);
    if (!tracked.current && valor > 0.05) {
      tracked.current = true;
      track("process_section_view");
    }
  });

  const etapa = ETAPAS[ativo];

  return (
    <section
      className="process-story"
      id="como-funciona"
      ref={containerRef}
      aria-labelledby="process-title"
      style={{ height: `${ETAPAS.length * 100}vh` }}
    >
      <div className="process-story-inner" style={{ position: "sticky", top: 0, height: "100vh" }}>
        <div className="process-story-rail">
          <div className="process-progress">
            {String(ativo + 1).padStart(2, "0")} / {String(ETAPAS.length).padStart(2, "0")}
          </div>
          <div className="eyebrow" style={{ color: "#0a7a5f" }}>
            Como funciona
          </div>
          <h2 id="process-title">{etapa.titulo}</h2>
          <p>{etapa.texto}</p>
          <div className="process-dots" role="tablist" aria-label="Etapas do processo">
            {ETAPAS.map((item, index) => (
              <button
                key={item.titulo}
                type="button"
                className={`process-dot${index === ativo ? " is-active" : ""}`}
                aria-label={`Etapa ${index + 1}: ${item.titulo}`}
                aria-current={index === ativo}
                onClick={() => {
                  const el = containerRef.current;
                  if (!el) return;
                  const top = el.offsetTop + (el.offsetHeight * index) / ETAPAS.length;
                  window.scrollTo({ top, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>
        <div className="process-story-panels">
          <div className="process-panel">
            <Painel etapa={etapa} />
          </div>
        </div>
      </div>

      {/* Mobile: etapas verticais (CSS esconde sticky) */}
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
