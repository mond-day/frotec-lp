import { CheckIcon } from "./icons";
import { MotionReveal, MotionStagger } from "./MotionReveal";

const ETAPAS_CONTRATO = [
  {
    titulo: "Diagnóstico da frota",
    texto: "Avaliamos cada caminhão e mapeamos riscos, custos e oportunidades de economia.",
  },
  {
    titulo: "Proposta personalizada",
    texto: "Montamos o escopo conforme o tamanho e o perfil da sua operação — sem pacote genérico.",
  },
  {
    titulo: "Contrato transparente",
    texto: "Tudo documentado: o que está incluso, limites, exclusões e valores. Sem taxas escondidas.",
  },
  {
    titulo: "Ativação e acompanhamento",
    texto: "Com a assinatura digital, a frota entra no calendário preventivo e no portal do cliente.",
  },
];

export default function Contrato() {
  return (
    <section id="contrato">
      <div className="wrap">
        <MotionReveal className="section-head">
          <div className="eyebrow">Como contratamos</div>
          <h2>Como estruturamos o seu contrato.</h2>
          <p>
            O investimento depende do tamanho e do perfil da frota — mas a forma de contratar é
            sempre clara. Preço sob consulta, com escopo detalhado antes de você assinar.
          </p>
        </MotionReveal>

        <MotionStagger className="plan-grid">
          {ETAPAS_CONTRATO.map((etapa) => (
            <div className="plan" key={etapa.titulo}>
              <h3>{etapa.titulo}</h3>
              <p>{etapa.texto}</p>
            </div>
          ))}
        </MotionStagger>

        <MotionReveal className="plan-highlight" delay={0.15}>
          <div className="scope-price">
            <span className="stat-n">Sob consulta</span>
            <span>Valor mensal conforme tamanho da frota</span>
          </div>
          <ul className="checklist single">
            <li>
              <CheckIcon />
              Sem taxa de adesão escondida
            </li>
            <li>
              <CheckIcon />
              Escopo e limites definidos em contrato antes da assinatura
            </li>
            <li>
              <CheckIcon />
              Um único interlocutor comercial e técnico
            </li>
          </ul>
          <a href="#contato" className="btn btn-primary" style={{ marginTop: "28px" }}>
            Receber Diagnóstico Gratuito
          </a>
        </MotionReveal>
      </div>
    </section>
  );
}
