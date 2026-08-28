const PASSOS = [
  { when: "D-21", what: "O sinal aparece no checklist", tom: "mint" as const },
  { when: "D-14", what: "Preventiva entra no calendário", tom: "mint-soft" as const },
  { when: "D-3", what: "Orçamento auditado antes da execução", tom: "amber" as const },
  { when: "D-0", what: "O caminhão segue rodando", tom: "trail" as const },
];

export default function HeroTimeline() {
  return (
    <ol className="hero-timeline" aria-label="Linha do tempo ilustrativa até a falha evitada">
      {PASSOS.map((passo) => (
        <li key={passo.when} className="hero-timeline-item">
          <span className={`hero-timeline-dot is-${passo.tom}`} aria-hidden="true" />
          <div>
            <div className="hero-timeline-when">{passo.when}</div>
            <div className="hero-timeline-what">{passo.what}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
