"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/motion/Reveal";

const ITENS = [
  { nome: "Sensor NOx", valor: "R$ —", status: "review" as const, rotulo: "Revisar" },
  { nome: "Mão de obra", valor: "R$ —", status: "ok" as const, rotulo: "Ok" },
  { nome: "Item adicional", valor: "R$ —", status: "need" as const, rotulo: "Justificativa" },
];

export default function OSAuditDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section className="os-audit" id="auditoria" aria-labelledby="os-title">
      <div className="wrap">
        <div className="os-layout">
          <Reveal>
            <div className="eyebrow">Auditoria de OS</div>
            <h2 id="os-title">Antes de aprovar uma oficina, saiba o que você está aprovando.</h2>
            <p style={{ marginTop: 14, maxWidth: 440 }}>
              Peça, quantidade, mão de obra e observação passam por leitura técnica — para a decisão
              deixar de ser só urgência e preço.
            </p>
            <p className="os-footer-copy">
              A decisão continua sendo sua. A Frotec ajuda você a decidir com mais informação.
            </p>
          </Reveal>

          <div className="os-doc" ref={ref}>
            <div className="os-doc-head">
              <div>
                <div className="os-doc-title">Ordem de serviço</div>
                <div className="os-doc-id">#2194 · demonstrativo</div>
              </div>
              <span className="demo-tag">Exemplo ilustrativo</span>
            </div>

            {ITENS.map((item, index) => (
              <div
                key={item.nome}
                className={`os-item${inView ? " is-visible" : ""}`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <span className="os-item-name">{item.nome}</span>
                <span className="os-item-value">{item.valor}</span>
                <span className={`os-badge ${item.status}`}>{item.rotulo}</span>
              </div>
            ))}

            <div className={`os-note${inView ? " is-visible" : ""}`} style={{ opacity: inView ? 1 : 0, transition: "opacity 0.5s ease 0.45s" }}>
              Observação técnica: validar necessidade do item adicional e cruzar com histórico do
              veículo antes da aprovação.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
