"use client";

import Reveal from "@/components/motion/Reveal";
import MockupDemo from "@/components/proof/MockupDemo";

const PROVAS = [
  {
    titulo: "Laudo demonstrativo",
    texto: "Avaliação veículo a veículo com classificação de risco e prioridades claras.",
  },
  {
    titulo: "Checklist técnico",
    texto: "Itens estruturados, evidências e observações — base para decidir o que prevenir primeiro.",
  },
  {
    titulo: "Fluxo de OS",
    texto: "Da abertura à análise e aprovação: transparência no que está sendo autorizado.",
  },
];

export default function OperationalProof() {
  return (
    <section
      className="theme-paper band-edge proof-section"
      id="prova"
      aria-labelledby="prova-title"
    >
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Prova operacional</div>
          <h2 id="prova-title">A confiança vem do processo.</h2>
          <p style={{ marginTop: 14, maxWidth: 520 }}>
            Portal do gestor e app do avaliador — modelo demonstrativo do que será entregue na
            Fase B.
          </p>
        </Reveal>

        <MockupDemo />

        <div className="proof-grid">
          {PROVAS.map((item, index) => (
            <Reveal key={item.titulo} delay={index * 0.06} className="proof-item">
              <span className="demo-tag" style={{ marginBottom: 14 }}>
                Modelo demonstrativo
              </span>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
