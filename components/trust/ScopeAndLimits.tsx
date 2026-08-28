import Reveal from "@/components/motion/Reveal";

const FAZ = [
  "Avaliação técnica da frota",
  "Classificação de risco por veículo",
  "Organização da preventiva",
  "Auditoria técnica de ordens de serviço",
  "Acesso à rede conforme cobertura",
  "Acompanhamento previsto em contrato",
];

const NAO_E = [
  "Seguro",
  "Garantia mecânica",
  "Substituto da responsabilidade do proprietário",
  "Promessa de zero falhas",
  "Cobertura ilimitada de qualquer serviço",
];

export default function ScopeAndLimits() {
  return (
    <section className="theme-light" id="escopo" aria-labelledby="escopo-title">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Escopo e limites</div>
          <h2 id="escopo-title">O que a Frotec faz — e o que não promete.</h2>
          <p style={{ marginTop: 14, maxWidth: 540 }}>
            Clareza também é saber o que está dentro e fora. Isso protege a operação e a relação
            comercial.
          </p>
        </Reveal>

        <div className="scope-grid">
          <Reveal className="scope-col scope-yes">
            <h3>Faz</h3>
            <ul className="scope-list yes">
              {FAZ.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="scope-col scope-no" delay={0.08}>
            <h3>Não é</h3>
            <ul className="scope-list no">
              {NAO_E.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
