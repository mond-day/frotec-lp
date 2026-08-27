import Reveal from "@/components/motion/Reveal";

const PILARES = [
  {
    tag: "Economia de tempo",
    titulo: "O gestor sai do telefone",
    texto:
      "A rotina técnica passa a ser conduzida pela central: prioridade definida, oficina acionada, status visível.",
    features: ["Central técnica única", "Preventiva no calendário", "Histórico por veículo"],
  },
  {
    tag: "Previsibilidade financeira",
    titulo: "Manutenção volta ao orçamento",
    texto:
      "Menos serviço em urgência significa menos custo fora do plano — e um orçamento que se sustenta no mês.",
    features: ["Orçamento auditado", "Escopo em contrato", "Nota fiscal única"],
  },
  {
    tag: "Agilidade na decisão",
    titulo: "Intercorrência com resposta pronta",
    texto:
      "Quando algo acontece na estrada, existe rede credenciada, leitura técnica e caminho definido — não improviso.",
    features: ["Rede no corredor", "Leitura técnica da OS", "Canal para emergência"],
  },
];

export default function ManagerOutcome() {
  return (
    <section className="outcomes" id="ganhos" aria-labelledby="outcomes-title">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">O que muda na rotina</div>
          <h2 id="outcomes-title">Tempo do gestor, previsibilidade do caixa, agilidade na decisão.</h2>
          <p style={{ marginTop: 16, maxWidth: 540 }}>
            Três ganhos concretos — sem promessa absoluta de zero falha.
          </p>
        </Reveal>

        <div className="benefit-pillars">
          {PILARES.map((pilar, index) => (
            <Reveal key={pilar.titulo} delay={index * 0.06} className="benefit-pillar">
              <div className="benefit-tag">{pilar.tag}</div>
              <h3>{pilar.titulo}</h3>
              <p>{pilar.texto}</p>
              <ul>
                {pilar.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
