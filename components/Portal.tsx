import { CheckIcon } from "./icons";

const RECURSOS = [
  "Status individual de cada caminhão da frota",
  "Histórico de manutenções e ordens de serviço",
  "Laudos e classificação de risco por veículo",
  "Contrato do convênio e anexos técnicos",
  "Faturas e situação dos pagamentos",
];

const VEICULOS = [
  { placa: "MT-0231 CAV", status: "Ativo" },
  { placa: "MT-0198 CAV", status: "Em manutenção" },
  { placa: "MT-0355 CAV", status: "Aguardando aprovação de OS" },
  { placa: "MT-0402 CAV", status: "Avaliação agendada" },
];

export default function Portal() {
  return (
    <section id="portal">
      <div className="wrap grid-2 align-center">
        <div className="reveal">
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
            Agendar avaliação técnica
          </a>
        </div>

        <div className="eval-card reveal" style={{ transitionDelay: ".15s" }}>
          <div className="eval-top">
            <span className="eval-tag">Portal Frotec · Frota ativa</span>
            <span className="eval-id">18 veículos</span>
          </div>
          {VEICULOS.map((veiculo) => (
            <div className="eval-row" key={veiculo.placa}>
              <span>{veiculo.placa}</span>
              <span className="eval-ok">
                <CheckIcon size={13} strokeWidth={3} />
                {veiculo.status}
              </span>
            </div>
          ))}
          <div className="eval-result">
            <span style={{ fontSize: "12px", color: "var(--ink-mut)" }}>Última atualização</span>
            <span className="risk-badge">Há 4 min</span>
          </div>
          <div className="eval-caption">
            Atualizado a cada nova ordem de serviço ou avaliação
          </div>
        </div>
      </div>
    </section>
  );
}
