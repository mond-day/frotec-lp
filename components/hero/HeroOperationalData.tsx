"use client";

/**
 * Microprova operacional — mantida fora da dobra principal do Hero.
 * Usada abaixo do Hero quando precisamos reforçar status sem poluir a 1ª viewport.
 */
export default function HeroOperationalData() {
  return (
    <aside className="op-chip" aria-label="Recorte operacional ilustrativo">
      <div className="op-chip-label">Veículo 042 · status técnico</div>
      <div className="op-chip-row">
        <span>Situação</span>
        <span className="op-status">Preventivo programado</span>
      </div>
      <div className="op-chip-row">
        <span>Próxima ação</span>
        <span>28 AGO</span>
      </div>
      <div className="op-chip-row">
        <span>Origem</span>
        <span>Modelo demonstrativo</span>
      </div>
    </aside>
  );
}
