const ROWS = [
  { k: "Veículo 042", v: "Preventivo programado", accent: true },
  { k: "Próxima ação", v: "28 AGO", accent: false },
  { k: "Risco atual", v: "Baixo", accent: true },
  { k: "Origem", v: "Modelo demonstrativo", muted: true },
];

/**
 * Recorte operacional da dobra do hero (variante Corredor do redesign).
 */
export default function HeroOperationalData() {
  return (
    <div className="hero-aside">
      <aside className="op-chip" aria-label="Recorte operacional ilustrativo">
        <div className="op-chip-head">
          <span>Recorte operacional</span>
          <span className="op-status">Demonstrativo</span>
        </div>
        {ROWS.map((row) => (
          <div className="op-chip-row" key={row.k}>
            <span>{row.k}</span>
            <span className={row.muted ? "is-muted" : row.accent ? "is-accent" : undefined}>
              {row.v}
            </span>
          </div>
        ))}
      </aside>
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-value is-accent">~1.500</div>
          <div className="hero-stat-label">km de corredor</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">
            MT<span className="is-muted">·</span>RO
          </div>
          <div className="hero-stat-label">base em Sinop</div>
        </div>
      </div>
    </div>
  );
}
