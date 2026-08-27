import { CheckIcon } from "./icons";
import { MotionReveal } from "./MotionReveal";

const RECURSOS = [
  "Status individual de cada caminhão da frota",
  "Histórico de manutenções e ordens de serviço",
  "Laudos e classificação de risco por veículo",
  "Contrato do convênio e anexos técnicos",
  "Faturas e situação dos pagamentos",
];

export default function Portal() {
  return (
    <section id="portal">
      <div className="wrap grid-2 align-center portal-grid">
        <MotionReveal>
          <div className="eyebrow">Portal do cliente</div>
          <h2>Acompanhe cada caminhão, do checklist à manutenção.</h2>
          <p style={{ marginTop: "16px" }}>
            No portal Frotec, o gestor de frota vê a situação de cada veículo — em avaliação,
            ativo, em manutenção ou aguardando aprovação de serviço — junto do histórico completo
            de ordens de serviço, laudos técnicos, contrato e pagamentos.
          </p>
          <ul className="checklist single" style={{ marginTop: "24px" }}>
            {RECURSOS.map((recurso) => (
              <li key={recurso}>
                <CheckIcon />
                {recurso}
              </li>
            ))}
          </ul>
          <a href="#contato" className="btn btn-primary" style={{ marginTop: "28px" }}>
            Falar com um Consultor
          </a>
        </MotionReveal>

        <MotionReveal className="device-mockup-wrap" delay={0.15}>
          <div className="device-mockup">
            <div className="device-laptop">
              <div className="device-laptop-screen">
                <img
                  src="/portal-mockup.svg"
                  alt="Interface do portal Frotec+ no desktop"
                  className="device-screen-img"
                  width={780}
                  height={480}
                />
              </div>
              <div className="device-laptop-base" aria-hidden="true" />
            </div>
            <div className="device-phone">
              <div className="device-phone-notch" aria-hidden="true" />
              <img
                src="/portal-mockup.svg"
                alt="Interface do portal Frotec+ no celular"
                className="device-screen-img"
                width={390}
                height={780}
              />
            </div>
          </div>
          <p className="device-caption">
            Substitua por screenshot ou vídeo MP4 real do portal quando disponível.
          </p>
        </MotionReveal>
      </div>
    </section>
  );
}
