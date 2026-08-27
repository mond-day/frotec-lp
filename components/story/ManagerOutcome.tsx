import Reveal from "@/components/motion/Reveal";

const PILARES = [
  {
    titulo: "Previsibilidade",
    texto: "Saiba o que precisa de atenção antes da urgência.",
    features: ["Preventiva programada", "Histórico por veículo", "Avaliação técnica"],
  },
  {
    titulo: "Decisão",
    texto: "Tenha uma segunda leitura técnica antes de autorizar o serviço.",
    features: ["Auditoria de OS", "Itens justificados", "Aprovação informada"],
  },
  {
    titulo: "Continuidade",
    texto: "Mantenha o atendimento conectado à rota.",
    features: ["Rede no corredor", "Redirecionamento", "Suporte operacional"],
  },
];

export default function ManagerOutcome() {
  return (
    <section className="outcomes theme-graphite band-edge" id="beneficios" aria-labelledby="outcomes-title">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">O que muda na rotina</div>
          <h2 id="outcomes-title">Menos decisão no improviso. Mais previsibilidade na estrada.</h2>
          <p style={{ marginTop: 14, maxWidth: 540 }}>
            Três eixos de negócio — sem promessa absoluta de zero falha.
          </p>
        </Reveal>

        <div className="benefit-pillars">
          {PILARES.map((pilar, index) => (
            <Reveal key={pilar.titulo} delay={index * 0.06} className="benefit-pillar">
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
