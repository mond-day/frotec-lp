import Reveal from "@/components/motion/Reveal";

const FAZ_SENTIDO = [
  "Muitos veículos para acompanhar ao mesmo tempo",
  "Rotas longas, com impacto alto quando um caminhão para",
  "Manutenção distribuída entre oficinas e interlocutores",
  "Dificuldade em validar orçamento com calma",
  "Paradas que afetam prazo e relação comercial",
  "Necessidade de rotina preventiva, não só corretiva",
];

const TALVEZ_NAO = [
  "Poucos veículos e toda manutenção já acompanhada de perto",
  "Busca apenas por um seguro",
  "Espera garantia de quebra zero",
  "Quer somente desconto em peça",
  "Não deseja seguir uma rotina preventiva",
];

export default function FitSection() {
  return (
    <section className="theme-graphite band-edge" id="para-quem" aria-labelledby="fit-title" style={{ padding: "100px 0" }}>
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Qualificação</div>
          <h2 id="fit-title">A Frotec faz mais sentido quando a manutenção já impacta a operação.</h2>
        </Reveal>

        <div className="fit-grid">
          <Reveal>
            <h3>Situações em que encaixa</h3>
            <ul className="fit-list">
              {FAZ_SENTIDO.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <h3>Talvez não seja para você se…</h3>
            <ul className="fit-list">
              {TALVEZ_NAO.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
