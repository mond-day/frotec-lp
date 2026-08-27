"use client";

import dynamic from "next/dynamic";

const CoverageMap = dynamic(() => import("./CoverageMap"), {
  ssr: false,
  loading: () => (
    <div
      className="map-canvas map-canvas-loading"
      aria-label="Carregando mapa de cobertura"
      aria-busy="true"
    />
  ),
});

export default function CoverageMapClient() {
  return <CoverageMap />;
}
