"use client";

import { useEffect, useRef, useState } from "react";
import CoverageMapClient from "@/components/CoverageMapClient";
import CorridorMap from "@/components/proof/CorridorMap";
import Reveal from "@/components/motion/Reveal";
import { track } from "@/lib/analytics";
import { EXTENSAO_APROXIMADA } from "@/lib/cobertura";

const STATS = [
  { valor: EXTENSAO_APROXIMADA, label: "de corredor atendido", cor: "var(--primary)" },
  { valor: "2", label: "eixos: BR-163 e BR-364", cor: "var(--trail)" },
  { valor: "MT · RO", label: "estados na fase atual", cor: "var(--ink)" },
  { valor: "Sinop/MT", label: "base da operação", cor: "var(--ink)" },
];

/**
 * Cobertura: mapa esquemático 3D do redesign como protagonista.
 * Leaflet permanece como vista geográfica opcional (mesmos eixos BR-163 / BR-364).
 */
export default function CoverageSection() {
  const ref = useRef<HTMLElement>(null);
  const tracked = useRef(false);
  const [modo, setModo] = useState<"esquema" | "geo">("esquema");
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!tracked.current) {
            tracked.current = true;
            track("coverage_view");
          }
          setMapReady(true);
        }
      },
      { threshold: 0.15, rootMargin: "200px 0px" },
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
        </Reveal>
        <Reveal delay={0.08}>
          <p>
            Da base em Sinop/MT acompanhamos o eixo da BR-163 — de Cuiabá ao norte do estado — e o
            ramal da BR-364 até Vilhena, em Rondônia. Toque em uma cidade para aproximar.
          </p>
        </Reveal>
      </div>

      <div className="coverage-map-shell">
        {modo === "esquema" ? (
          <CorridorMap
            onExplorarGeo={() => {
              setMapReady(true);
              setModo("geo");
              track("coverage_explore");
            }}
          />
        ) : (
          <div className="coverage-geo">
            {mapReady ? <CoverageMapClient /> : null}
            <div className="coverage-map-callouts" aria-hidden="true">
              <div className="coverage-callout">
                <span className="coverage-callout-kicker">Corredor BR-163 · MT–RO</span>
                <strong>Sinop · BR-163 · BR-364 · Vilhena</strong>
              </div>
            </div>
            <button
              type="button"
              className="coverage-back-btn btn btn-ghost"
              onClick={() => setModo("esquema")}
            >
              Ver corredor esquemático
            </button>
          </div>
        )}
      </div>

      <div className="coverage-stats">
        {STATS.map((stat) => (
          <div className="coverage-stat" key={stat.label}>
            <div className="coverage-stat-value" style={{ color: stat.cor }}>
              {stat.valor}
            </div>
            <div className="coverage-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <p className="coverage-note">
        <strong style={{ color: "var(--ink)" }}>O atendimento é por rota, não por cidade fixa.</strong>{" "}
        Nesta fase a operação atende o eixo BR-163 entre Mato Grosso e Rondônia. Empresas de fora
        podem se cadastrar: o contato fica registrado para quando a expansão chegar.
      </p>
    </section>
  );
}
