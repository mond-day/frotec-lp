"use client";

import { useEffect, useId, useRef, useState } from "react";
import { track } from "@/lib/analytics";

const PERGUNTAS = [
  {
    pergunta: "O convênio Frotec é um seguro?",
    resposta:
      "Não. A Frotec presta um serviço de gestão técnica e consultoria em manutenção de frotas: avaliação técnica, manutenção preventiva programada, diagnóstico e acesso à rede conforme cobertura. Não é seguro, não é garantia estendida e não constitui operação securitária.",
  },
  {
    pergunta: "Qualquer conserto está incluso no plano?",
    resposta:
      "Não. Cada plano tem escopo, limites e exclusões definidos em contrato, e toda ordem de serviço passa por aprovação técnica da central antes da execução. O que está fora do escopo é orçado separadamente e aprovado por você antes de qualquer serviço.",
  },
  {
    pergunta: "Meu caminhão tem um problema antigo. Ele entra no plano assim mesmo?",
    resposta:
      "Não sem regularização prévia. Se a vistoria inicial identificar uma irregularidade técnica, a ativação daquele veículo fica condicionada ao acerto. A regularização é tratada como serviço separado, com orçamento próprio.",
  },
  {
    pergunta: "Como funciona a avaliação técnica inicial?",
    resposta:
      "Um avaliador realiza um checklist estruturado veículo a veículo — sistemas críticos, evidências e observações. O resultado é um laudo individual e uma classificação de risco por caminhão, para priorizar o que precisa de atenção.",
  },
  {
    pergunta: "Como funciona a rede de oficinas?",
    resposta:
      "As oficinas passam por avaliação antes do credenciamento, dentro da área de cobertura. Ao abrir uma ordem de serviço, diagnóstico e orçamento passam pela central Frotec para auditoria antes da execução.",
  },
  {
    pergunta: "Quem emite a nota fiscal do serviço?",
    resposta:
      "A Frotec. A oficina credenciada fatura para a Frotec e a Frotec emite a nota final para a sua empresa, com um único interlocutor por serviço.",
  },
  {
    pergunta: "E se der problema fora do horário comercial?",
    resposta:
      "Há canal de WhatsApp para emergências fora do horário comercial, usado para acionar a rede credenciada e destravar o atendimento na estrada, dentro da cobertura.",
  },
  {
    pergunta: "Para quem o modelo faz mais sentido?",
    resposta:
      "Para operações em que a manutenção já impacta prazo, margem e rotina do gestor — em especial frotas diesel no corredor da BR-163 entre Mato Grosso e Rondônia, com base em Sinop/MT.",
  },
];

type ItemProps = {
  pergunta: string;
  resposta: string;
  aberto: boolean;
  aoAlternar: () => void;
};

function FaqItem({ pergunta, resposta, aberto, aoAlternar }: ItemProps) {
  const respostaRef = useRef<HTMLDivElement>(null);
  const respostaId = useId();

  useEffect(() => {
    const elemento = respostaRef.current;
    if (!elemento) return;
    elemento.style.maxHeight = aberto ? `${elemento.scrollHeight}px` : "0px";
  }, [aberto]);

  return (
    <div className="faq-item">
      <button
        type="button"
        className={`faq-q${aberto ? " open" : ""}`}
        onClick={aoAlternar}
        aria-expanded={aberto}
        aria-controls={respostaId}
      >
        {pergunta}
        <span className="plus" aria-hidden="true">
          +
        </span>
      </button>
      <div className="faq-a" id={respostaId} ref={respostaRef}>
        <p>{resposta}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [abertoIndex, setAbertoIndex] = useState<number | null>(null);

  return (
    <section id="faq" aria-labelledby="faq-title" style={{ padding: "100px 0" }}>
      <div className="wrap" style={{ maxWidth: "820px" }}>
        <div className="section-head">
          <div className="eyebrow">Perguntas frequentes</div>
          <h2 id="faq-title">Ainda com dúvidas?</h2>
        </div>

        <div>
          {PERGUNTAS.map((item, index) => (
            <FaqItem
              key={item.pergunta}
              pergunta={item.pergunta}
              resposta={item.resposta}
              aberto={abertoIndex === index}
              aoAlternar={() => {
                const abrindo = abertoIndex !== index;
                setAbertoIndex(abrindo ? index : null);
                if (abrindo) track("faq_open", { index });
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
