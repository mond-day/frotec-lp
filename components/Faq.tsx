"use client";

import { useEffect, useId, useRef, useState } from "react";

const PERGUNTAS = [
  {
    pergunta: "O convênio Frotec é um seguro?",
    resposta:
      "Não. A Frotec presta um serviço de gestão técnica e consultoria em manutenção de frotas: avaliação técnica, manutenção preventiva programada, diagnóstico e acesso à rede credenciada. Não é seguro, não é garantia estendida e não constitui operação securitária.",
  },
  {
    pergunta: "Qualquer conserto está incluso no plano?",
    resposta:
      "Não. Cada plano tem escopo, limites e exclusões definidos em contrato, e toda ordem de serviço passa por aprovação técnica da central antes da execução. O que está fora do escopo é orçado separadamente e aprovado por você antes de qualquer serviço.",
  },
  {
    pergunta: "Meu caminhão tem um problema antigo. Ele entra no plano assim mesmo?",
    resposta:
      "Não sem regularização prévia. Se a vistoria inicial identificar uma irregularidade técnica, a ativação daquele veículo fica bloqueada até o acerto. A regularização é tratada como serviço separado, com orçamento próprio, e não entra na mensalidade do convênio.",
  },
  {
    pergunta: "Como funciona a avaliação técnica inicial?",
    resposta:
      "Um avaliador realiza um checklist estruturado veículo a veículo — sistema ARLA, SCR, sensores NOx, bomba e tanque, cristalização, códigos de falha, indícios de adulteração, motor, chicotes e conectores — com fotos e observações. O resultado é um laudo individual e uma faixa de risco por caminhão. O valor de referência é de R$ 350 por veículo.",
  },
  {
    pergunta: "Como funciona a rede de oficinas credenciadas?",
    resposta:
      "As oficinas são avaliadas antes do credenciamento. Ao abrir uma ordem de serviço, a oficina envia diagnóstico e orçamento para a central Frotec, que aprova e audita antes da execução. Se a oficina acionada não responder, a central redireciona a OS para outra da rede.",
  },
  {
    pergunta: "Quem emite a nota fiscal do serviço?",
    resposta:
      "A Frotec. A oficina credenciada fatura para a Frotec e a Frotec emite a nota final para a sua empresa, com um único interlocutor e um único documento fiscal por serviço.",
  },
  {
    pergunta: "E se der problema fora do horário comercial?",
    resposta:
      "O atendimento comercial funciona em horário comercial, e há um canal de WhatsApp para emergências fora dele, usado para acionar a rede credenciada e destravar o atendimento na estrada.",
  },
  {
    pergunta: "Qual o porte de frota atendido?",
    resposta:
      "O modelo é voltado a operações com frotas grandes, geralmente acima de 50 caminhões, atuando no corredor da BR-163 entre Mato Grosso e Rondônia, com base em Sinop/MT.",
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

  // Anima a altura ate o conteudo real, como no HTML de referencia.
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

export default function Faq() {
  const [abertoIndex, setAbertoIndex] = useState<number | null>(null);

  return (
    <section id="faq">
      <div className="wrap" style={{ maxWidth: "820px" }}>
        <div className="section-head reveal">
          <div className="eyebrow">Perguntas frequentes</div>
          <h2>Ainda com dúvidas?</h2>
        </div>

        <div className="reveal">
          {PERGUNTAS.map((item, index) => (
            <FaqItem
              key={item.pergunta}
              pergunta={item.pergunta}
              resposta={item.resposta}
              aberto={abertoIndex === index}
              aoAlternar={() => setAbertoIndex(abertoIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
