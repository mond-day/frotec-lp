"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function HeroOperationalData() {
  const reduce = useReducedMotion();

  return (
    <motion.aside
      className="op-chip"
      aria-label="Recorte operacional ilustrativo"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
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
    </motion.aside>
  );
}
