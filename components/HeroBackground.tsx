"use client";

import { useEffect, useState } from "react";

/**
 * Vídeo de fundo do hero com fallback elegante (poster + gradiente).
 * Coloque hero-bg.mp4 em /public para ativar o loop automático.
 */
export default function HeroBackground() {
  const [videoDisponivel, setVideoDisponivel] = useState(false);

  useEffect(() => {
    fetch("/hero-bg.mp4", { method: "HEAD" })
      .then((resposta) => setVideoDisponivel(resposta.ok))
      .catch(() => setVideoDisponivel(false));
  }, []);

  return (
    <div className="hero-media" aria-hidden="true">
      {videoDisponivel ? (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.svg"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
      ) : (
        <img className="hero-poster" src="/hero-poster.svg" alt="" />
      )}
      <div className="hero-media-overlay" />
    </div>
  );
}
