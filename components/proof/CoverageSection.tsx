"use client";

import { useEffect, useRef } from "react";
import CoverageMapClient from "@/components/CoverageMapClient";
import Reveal from "@/components/motion/Reveal";
import { track } from "@/lib/analytics";
import { EXTENSAO_APROXIMADA } from "@/lib/cobertura";

export default function CoverageSection() {
  const ref = useRef<HTMLElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !tracked.current) {
          tracked.current = true;
          track("coverage_view");
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="coverage-section" id="cobertura" ref={ref} aria-labelledby="cobertura-title">
      <div className="coverage-head">
        <Reveal>
          <div className="eyebrow">Cobertura</div>
          <h2 id="cobertura-title">Gestão técnica conectada à rota da sua operação.</h2>
          <p style={{ marginTop: 14, maxWidth: 560 }}>
            Da base em Sinop/MT, acompanhamos o corredor da BR-163 — de Cuiabá ao norte do estado —
            e o ramal da BR-364 até Vilhena, em Rondônia.
          </p>
        </Reveal>
      </div>

      <div className="coverage-map-bleed">
        <CoverageMapClient />
      </div>

      <div className="coverage-meta">
        <div className="map-legend">
          <div className="map-legend-item">
            <span className="dot dot-primary" />
            Sede Frotec — Sinop, MT
          </div>
          <div className="map-legend-item">
            <span className="dot dot-area" />
            Eixo BR-163 — Cuiabá ↔ Guarantã do Norte
          </div>
          <div className="map-legend-item">
            <span className="dot dot-trail" />
            Ramal BR-364 — até Vilhena, RO
          </div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 22, color: "var(--primary)", fontWeight: 600 }}>
            {EXTENSAO_APROXIMADA}
          </div>
          <div className="section-kicker">de corredor atendido</div>
        </div>
      </div>

      <p className="coverage-note">
        <strong style={{ color: "var(--ink)" }}>O atendimento é por rota, não por cidade fixa.</strong>{" "}
        Nesta fase, a operação atende o eixo BR-163 entre Mato Grosso e Rondônia. Empresas de fora
        podem se cadastrar: o contato fica registrado para quando a expansão chegar.
      </p>
    </section>
  );
}
