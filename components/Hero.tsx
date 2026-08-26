import { CheckIcon } from "./icons";

const ITENS_LAUDO = [
  { area: "Sistema ARLA/SCR", status: "Regular" },
  { area: "Sensores NOx", status: "Aprovado" },
  { area: "Bomba e tanque ARLA", status: "Regular" },
  { area: "Motor e injeção", status: "Aprovado" },
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="blueprint" />
      <svg
        className="hero-trails"
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="tg1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10E1B1" stopOpacity="0" />
            <stop offset="60%" stopColor="#10E1B1" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#10E1B1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tg2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2D8CFF" stopOpacity="0" />
            <stop offset="60%" stopColor="#2D8CFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2D8CFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M -100 380 C 300 380, 500 320, 900 240" stroke="url(#tg1)" strokeWidth="2" fill="none" />
        <path d="M -100 420 C 320 420, 520 360, 950 260" stroke="url(#tg1)" strokeWidth="1.5" fill="none" />
        <path d="M -100 450 C 340 450, 540 400, 1000 300" stroke="url(#tg2)" strokeWidth="1.5" fill="none" />
        <path d="M -100 480 C 360 480, 560 440, 1050 340" stroke="url(#tg2)" strokeWidth="1" fill="none" />
      </svg>

      <div className="wrap hero-grid">
        <div className="hero-inner">
          <div className="eyebrow">Convênio de gestão técnica de frotas</div>
          <h1>
            Sua frota de caminhões,
            <br />
            sob gestão técnica constante.
          </h1>
          <p className="lead">
            A Frotec une avaliação técnica, manutenção preventiva programada e uma rede de
            oficinas credenciadas para reduzir falhas, paradas e custos inesperados na sua frota
            diesel — com auditoria técnica em cada serviço.
          </p>
          <div className="hero-cta">
            <a href="#contato" className="btn btn-primary">
              Agendar avaliação técnica
            </a>
            <a href="#como-funciona" className="btn btn-ghost">
              Ver como funciona
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-n">50+</div>
              <div className="stat-l">caminhões por frota, em média</div>
            </div>
            <div>
              <div className="stat-n">2x/ano</div>
              <div className="stat-l">manutenção preventiva por veículo</div>
            </div>
            <div>
              <div className="stat-n">BR-163</div>
              <div className="stat-l">eixo MT–RO atendido</div>
            </div>
          </div>
          <p className="hero-note">
            O convênio Frotec é um serviço de gestão técnica recorrente da frota. Não é seguro,
            não é garantia e não substitui a responsabilidade do proprietário sobre o veículo.
          </p>
        </div>

        <div className="eval-card reveal" style={{ transitionDelay: ".3s" }}>
          <div className="eval-top">
            <span className="eval-tag">Avaliação técnica</span>
            <span className="eval-id">#FT-0482</span>
          </div>
          {ITENS_LAUDO.map((item) => (
            <div className="eval-row" key={item.area}>
              <span>{item.area}</span>
              <span className="eval-ok">
                <CheckIcon size={13} strokeWidth={3} />
                {item.status}
              </span>
            </div>
          ))}
          <div className="eval-result">
            <span style={{ fontSize: "12px", color: "var(--ink-mut)" }}>
              Classificação de risco
            </span>
            <span className="risk-badge">Faixa A</span>
          </div>
          <div className="eval-caption">
            Laudo gerado após o checklist técnico veículo a veículo
          </div>
        </div>
      </div>
    </section>
  );
}
