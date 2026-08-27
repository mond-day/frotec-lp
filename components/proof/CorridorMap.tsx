"use client";

import { useEffect, useState } from "react";
import {
  CIDADES_ESQUEMA,
  POLYLINE_BR163,
  POLYLINE_BR364,
} from "@/lib/cobertura";

const VX = 30;
const VY = 20;
const VW = 940;
const VH = 770;
const BASE_TILT = 17;
const foundBase = CIDADES_ESQUEMA.findIndex((c) => c.base);
const SINOP_INDEX = foundBase >= 0 ? foundBase : 2;
const LABEL_BELOW = new Set(["Cuiabá", "Diamantino", "Comodoro"]);

type Props = {
  onExplorarGeo?: () => void;
};

export default function CorridorMap({ onExplorarGeo }: Props) {
  const [cidade, setCidade] = useState(SINOP_INDEX);
  const [zoom, setZoom] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const sync = () => setNarrow(window.innerWidth < 720);
    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  const tilt = narrow ? Math.min(BASE_TILT, 9) : BASE_TILT;
  const active = CIDADES_ESQUEMA[cidade] ?? CIDADES_ESQUEMA[SINOP_INDEX];

  let plateTransform = `rotateX(${tilt}deg) scale(1)`;
  if (zoom && active) {
    const dx = (50 - ((active.x - VX) / VW) * 100) * 1.15;
    const dy = (50 - ((active.y - VY) / VH) * 100) * 1.15;
    plateTransform = `rotateX(${tilt}deg) scale(1.9) translate(${dx}%, ${dy}%)`;
  }

  function escolherCidade(index: number) {
    if (cidade === index && zoom) {
      setZoom(false);
      return;
    }
    setCidade(index);
    setZoom(true);
  }

  return (
    <div className="corridor-frame">
      <div className="corridor-grid" aria-hidden="true" />
      <div className="corridor-vignette" aria-hidden="true" />

      <div className="corridor-stage">
        <div
          className="corridor-plate"
          style={{ transform: plateTransform }}
        >
          <svg
            viewBox="30 20 940 770"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="corridor-svg"
          >
            <defs>
              <linearGradient id="mapR163" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#0e9c7c" />
                <stop offset="50%" stopColor="#10e1b1" />
                <stop offset="100%" stopColor="#9df7e4" />
              </linearGradient>
              <linearGradient id="mapR364" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1d5fb8" />
                <stop offset="60%" stopColor="#2d8cff" />
                <stop offset="100%" stopColor="#8ec4ff" />
              </linearGradient>
              <filter id="mapGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="16" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g opacity="0.5" fill="none" stroke="rgba(16,225,177,.16)" strokeWidth="1.2">
              <path d="M 40 720 C 220 690, 330 620, 520 600 S 760 560, 980 470" />
              <path d="M 20 640 C 200 610, 320 540, 500 520 S 740 480, 980 390" />
              <path d="M 60 300 C 240 320, 380 260, 560 250 S 800 200, 990 150" />
              <path d="M 100 180 C 260 200, 420 150, 600 140 S 820 100, 995 60" />
            </g>
            <g opacity="0.22" fill="none" stroke="rgba(45,140,255,.3)" strokeWidth="1">
              <path d="M 0 470 C 160 460, 300 500, 440 480 S 640 440, 740 470" />
              <path d="M 0 380 C 150 360, 290 400, 430 380 S 620 340, 720 380" />
            </g>

            <g filter="url(#mapGlow)" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points={POLYLINE_BR163} stroke="#10e1b1" strokeWidth="30" opacity="0.13" />
              <polyline points={POLYLINE_BR364} stroke="#2d8cff" strokeWidth="26" opacity="0.1" />
            </g>
            <polyline
              points={POLYLINE_BR163}
              fill="none"
              stroke="rgba(0,0,0,.55)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(4,7)"
            />
            <polyline
              points={POLYLINE_BR364}
              fill="none"
              stroke="rgba(0,0,0,.55)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(4,7)"
            />
            <polyline
              points={POLYLINE_BR163}
              fill="none"
              stroke="url(#mapR163)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={POLYLINE_BR364}
              fill="none"
              stroke="url(#mapR364)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              className="corridor-dash"
              points={POLYLINE_BR163}
              fill="none"
              stroke="#eafff9"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="3 20"
              opacity="0.9"
            />
            <polyline
              className="corridor-dash corridor-dash-slow"
              points={POLYLINE_BR364}
              fill="none"
              stroke="#dcecff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="3 20"
              opacity="0.7"
            />
          </svg>

          {CIDADES_ESQUEMA.map((c, i) => {
            const on = i === cidade;
            const size = (c.base ? 16 : 10) + (on ? 4 : 0);
            const cor = c.uf === "RO" ? "#2d8cff" : "#10e1b1";
            const px = ((c.x - VX) / VW) * 100;
            const py = ((c.y - VY) / VH) * 100;
            const hideLabel = narrow && !c.base && !on;
            const below = LABEL_BELOW.has(c.nome);

            return (
              <button
                key={c.nome}
                type="button"
                className={`corridor-marker${c.base ? " is-base" : ""}${on ? " is-on" : ""}`}
                style={{
                  left: `${px}%`,
                  top: `${py}%`,
                  width: size,
                  height: size,
                  background: c.base || on ? cor : "#0d1016",
                  borderColor: cor,
                  transform: `translate(-50%, -50%) rotateX(-${tilt}deg)`,
                  zIndex: on ? 30 : c.base ? 20 : 10,
                  boxShadow:
                    c.base || on
                      ? `0 6px 14px rgba(0,0,0,.6), 0 0 20px ${c.uf === "RO" ? "rgba(45,140,255,.65)" : "rgba(16,225,177,.65)"}`
                      : "0 6px 14px rgba(0,0,0,.6)",
                }}
                title={c.nome}
                aria-pressed={on}
                onClick={() => escolherCidade(i)}
              >
                <span
                  className="corridor-stem"
                  style={{
                    height: c.base ? 30 : on ? 22 : 12,
                    background: `linear-gradient(180deg, transparent, ${cor})`,
                  }}
                />
                <span
                  className={`corridor-label${below ? " is-below" : ""}${hideLabel ? " is-hidden" : ""}`}
                  style={{
                    fontSize: c.base ? 12 : 10.5,
                    fontWeight: c.base ? 600 : 500,
                    color: on || c.base ? "#edf3f1" : "rgba(237,243,241,.6)",
                    background: on ? "rgba(16,225,177,.16)" : "transparent",
                  }}
                >
                  {c.nome}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="corridor-legend">
        <div className="corridor-legend-card">
          <div className="corridor-legend-kicker">Corredor atendido</div>
          <div className="corridor-legend-rows">
            <div>
              <span className="corridor-swatch corridor-swatch-163" />
              BR-163 · Cuiabá ↔ Guarantã do Norte
            </div>
            <div>
              <span className="corridor-swatch corridor-swatch-364" />
              BR-364 · ramal até Vilhena/RO
            </div>
            <div>
              <span className="corridor-swatch corridor-swatch-base" />
              Base operacional · Sinop/MT
            </div>
          </div>
        </div>
      </div>

      <div className="corridor-card">
        <div className="corridor-card-head">
          <span className="corridor-card-tag">{active?.tag}</span>
          <span className="corridor-card-uf">{active?.uf}</span>
        </div>
        <div className="corridor-card-name">{active?.nome}</div>
        <p className="corridor-card-desc">{active?.desc}</p>
        <div className="corridor-card-actions">
          <button
            type="button"
            className="btn btn-ghost corridor-reset"
            onClick={() => {
              setZoom(false);
              setCidade(SINOP_INDEX);
            }}
          >
            Ver corredor completo
          </button>
          {onExplorarGeo ? (
            <button type="button" className="btn btn-ghost corridor-reset" onClick={onExplorarGeo}>
              Ver mapa geográfico
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
