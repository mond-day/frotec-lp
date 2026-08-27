import { MotionReveal } from "./MotionReveal";

const SEM_FROTEC = [
  "Parada não planejada de 3 dias na estrada",
  "Guincho e hospedagem do motorista",
  "Peças superfaturadas sem auditoria",
  "Frete perdido e cliente insatisfeito",
];

const COM_FROTEC = [
  "Prevenção programada no pátio",
  "Peças com desconto da rede credenciada",
  "Auditoria técnica de toda Ordem de Serviço",
  "Custo previsível e controlado",
];

export default function Comparativo() {
  return (
    <section id="comparativo">
      <div className="wrap">
        <MotionReveal className="section-head">
          <div className="eyebrow">O custo de operar sem gestão</div>
          <h2>Uma parada não planejada pode custar mais que um ano de convênio.</h2>
          <p>
            Compare o que acontece quando a frota opera no improviso versus com a gestão técnica
            Frotec+.
          </p>
        </MotionReveal>

        <MotionReveal className="compare-grid" delay={0.1}>
          <div className="compare-col compare-bad">
            <div className="compare-label">Sem Frotec</div>
            <ul>
              {SEM_FROTEC.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="compare-cost">
              <span className="compare-cost-label">Custo médio de uma parada</span>
              <span className="compare-cost-value compare-cost-bad">R$ 15.000</span>
            </div>
          </div>

          <div className="compare-col compare-good">
            <div className="compare-label">Com Frotec+</div>
            <ul>
              {COM_FROTEC.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="compare-cost">
              <span className="compare-cost-label">Seu investimento</span>
              <span className="compare-cost-value compare-cost-good">Previsível e controlado</span>
            </div>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.2}>
          <p className="compare-note">
            Valor de referência ilustrativo para uma parada não planejada com guincho, peças e frete
            perdido. O retorno do convênio varia conforme o porte e o perfil da frota.
          </p>
        </MotionReveal>
      </div>
    </section>
  );
}
