import Reveal from "@/components/motion/Reveal";

const PARES = [
  {
    antes: "Eu descubro o problema quando o caminhão já parou.",
    depois: "Eu sei o que precisa de atenção antes de virar urgência.",
  },
  {
    antes: "A oficina diz o preço e eu preciso decidir rápido.",
    depois: "Tenho uma segunda leitura técnica antes de aprovar o serviço.",
  },
  {
    antes: "Cada veículo está em uma situação diferente e a informação fica espalhada.",
    depois: "Tenho uma rotina organizada de acompanhamento.",
  },
  {
    antes: "Manutenção vira apagar incêndio o tempo todo.",
    depois: "A preventiva entra na operação como rotina, não como surpresa.",
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
            O valor não está no jargão técnico. Está no que muda no dia a dia do gestor.
          </p>
        </Reveal>

        <div className="outcome-list">
          {PARES.map((par, index) => (
            <Reveal key={par.antes} delay={index * 0.05} className="outcome-row">
              <div className="outcome-before">
                <div className="outcome-label">Antes</div>
                <p>{par.antes}</p>
              </div>
              <div className="outcome-arrow" aria-hidden="true">
                →
              </div>
              <div className="outcome-after">
                <div className="outcome-label">Depois</div>
                <p>{par.depois}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
