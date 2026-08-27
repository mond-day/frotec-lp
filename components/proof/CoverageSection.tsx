"use client";

import { useEffect, useRef, useState } from "react";
import CoverageMapClient from "@/components/CoverageMapClient";
import Reveal from "@/components/motion/Reveal";
import { track } from "@/lib/analytics";
import { EXTENSAO_APROXIMADA } from "@/lib/cobertura";
import {
  COVERAGE_HAS_VIDEO,
  COVERAGE_VIDEO_MOBILE_SRC,
  COVERAGE_VIDEO_SRC,
} from "@/lib/media";

/**
 * Cobertura: Leaflet full-bleed como protagonista.
 * Se COVERAGE_HAS_VIDEO / route.mp4 existir, mostra vídeo com CTA para o mapa.
 */
export default function CoverageSection() {
  const ref = useRef<HTMLElement>(null);
  const tracked = useRef(false);
  const [mapReady, setMapReady] = useState(!COVERAGE_HAS_VIDEO);
  const [videoOk, setVideoOk] = useState(COVERAGE_HAS_VIDEO);
  const [showVideo, setShowVideo] = useState(COVERAGE_HAS_VIDEO);

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

  const usarVideo = showVideo && videoOk;

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
        <div className={`coverage-stage${usarVideo ? " is-video" : " is-map"}`}>
          {usarVideo && (
            <div className="coverage-stage-layer coverage-stage-journey">
              <div className="coverage-journey">
                <video
                  className="coverage-journey-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={() => {
                    setVideoOk(false);
                    setShowVideo(false);
                  }}
                >
                  <source
                    src={COVERAGE_VIDEO_MOBILE_SRC}
                    type="video/mp4"
                    media="(max-width: 760px)"
                  />
                  <source src={COVERAGE_VIDEO_SRC} type="video/mp4" />
                </video>
                <div className="coverage-hud">
                  <div className="coverage-hud-block">
                    <span className="coverage-hud-label">Corredor</span>
                    <strong>BR-163 · MT–RO</strong>
                  </div>
                </div>
                <div className="coverage-journey-copy">
                  <p>A operação muda de trecho. A gestão acompanha a rota.</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setMapReady(true);
                      setShowVideo(false);
                      track("coverage_explore");
                    }}
                  >
                    Ver mapa
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            className="coverage-stage-layer coverage-stage-map"
            aria-hidden={usarVideo}
            {...(usarVideo ? { inert: true } : {})}
          >
            {mapReady || !usarVideo ? <CoverageMapClient /> : null}
            <div className="coverage-map-callouts" aria-hidden="true">
              <div className="coverage-callout">
                <span className="coverage-callout-kicker">Corredor BR-163 · MT–RO</span>
                <strong>Sinop · BR-163 · BR-364 · Vilhena</strong>
              </div>
            </div>
            {COVERAGE_HAS_VIDEO && !usarVideo && (
              <button
                type="button"
                className="coverage-back-btn btn btn-ghost"
                onClick={() => setShowVideo(true)}
              >
                Ver vídeo da rota
              </button>
            )}
          </div>
        </div>
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
