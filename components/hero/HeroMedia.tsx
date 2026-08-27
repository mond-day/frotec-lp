"use client";

import { useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  HERO_HAS_VIDEO,
  HERO_POSTER_SRC,
  HERO_VIDEO_MOBILE_SRC,
  HERO_VIDEO_SRC,
} from "@/lib/media";
import { POLYLINE_BR163, POLYLINE_BR364 } from "@/lib/cobertura";

/**
 * Fundo do hero: rotas esquemáticas BR-163 / BR-364 (redesign).
 * Se HERO_HAS_VIDEO for true, o vídeo fica por baixo da arte.
 */
export default function HeroMedia() {
  const reduce = useReducedMotion();
  const [videoOk, setVideoOk] = useState(HERO_HAS_VIDEO);
  const showVideo = videoOk && !reduce;

  return (
    <>
      {showVideo ? (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_POSTER_SRC}
          onError={() => setVideoOk(false)}
        >
          <source src={HERO_VIDEO_MOBILE_SRC} type="video/mp4" media="(max-width: 760px)" />
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      ) : null}

      <div className="hero-art" aria-hidden="true">
        <div className="hero-art-wash" />
        <div className="hero-art-grid" />
        <svg
          className="hero-art-routes"
          viewBox="0 0 1000 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="heroR1" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#10e1b1" stopOpacity="0.15" />
              <stop offset="45%" stopColor="#10e1b1" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#7df3dc" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="heroR2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2d8cff" stopOpacity="0.1" />
              <stop offset="60%" stopColor="#2d8cff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2d8cff" stopOpacity="0.25" />
            </linearGradient>
            <filter id="heroGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="14" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g opacity="0.22" stroke="rgba(16,225,177,.5)" fill="none" strokeWidth="1">
            <path d="M 640 800 C 700 700, 640 600, 700 520 S 800 380, 840 240 S 900 120, 940 0" />
            <path d="M 560 800 C 620 690, 560 590, 620 500 S 740 360, 790 220 S 860 100, 890 0" />
            <path d="M 0 560 C 120 540, 240 560, 360 520 S 560 470, 660 520" />
            <path d="M 0 460 C 140 430, 260 470, 400 430 S 600 400, 700 450" />
          </g>
          <g filter="url(#heroGlow)" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <polyline points={POLYLINE_BR163} stroke="#10e1b1" strokeWidth="16" opacity="0.22" />
            <polyline points={POLYLINE_BR364} stroke="#2d8cff" strokeWidth="14" opacity="0.16" />
          </g>
          <polyline
            points={POLYLINE_BR163}
            fill="none"
            stroke="url(#heroR1)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={POLYLINE_BR364}
            fill="none"
            stroke="url(#heroR2)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            className="hero-art-dash"
            points={POLYLINE_BR163}
            fill="none"
            stroke="#d9fff6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 22"
            opacity="0.85"
          />
          <g>
            <circle className="hero-art-pulse" cx="822" cy="294" r="26" fill="none" stroke="#10e1b1" strokeOpacity="0.3" />
            <circle cx="822" cy="294" r="7" fill="#10e1b1" />
            <circle cx="726" cy="741" r="4.5" fill="#7df3dc" opacity="0.9" />
            <circle cx="919" cy="67" r="4.5" fill="#7df3dc" opacity="0.9" />
            <circle cx="73" cy="399" r="4.5" fill="#2d8cff" opacity="0.9" />
          </g>
        </svg>
      </div>

      <div className="hero-media-overlay" />
      <div className="hero-grain" />
    </>
  );
}
