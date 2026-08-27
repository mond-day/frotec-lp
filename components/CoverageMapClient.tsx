"use client";

import dynamic from "next/dynamic";

const CoverageMap = dynamic(() => import("./CoverageMap"), {
  ssr: false,
  loading: () => (
    <div
      className="map-canvas map-canvas-loading"
      role="img"
      aria-label="Carregando mapa de cobertura"
    />
  ),
});

export default function CoverageMapClient() {
  return <CoverageMap />;
}
