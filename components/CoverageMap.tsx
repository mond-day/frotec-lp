"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import {
  EXTREMIDADES,
  ROTA_BR163,
  ROTA_BR364,
  SEDE,
  type Ponto,
} from "@/lib/cobertura";

const COR_BR163 = "#10E1B1";
const COR_BR364 = "#2D8CFF";

/**
 * Mapa do corredor de atuacao.
 *
 * O Leaflet acessa `window` assim que o modulo carrega, entao ele e importado
 * dentro do useEffect (so roda no navegador) em vez de no topo do arquivo.
 */
export default function CoverageMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mapa: import("leaflet").Map | undefined;
    let cancelado = false;

    import("leaflet").then((L) => {
      if (cancelado || !container) return;

      mapa = L.map(container, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });

      // Basemap escuro da Esri: aberto, sem necessidade de API key.
      // (O dark_all do CARTO, usado no HTML de referencia, passou a exigir chave
      // e carimba "API KEY REQ" sobre os tiles.)
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; Esri", maxZoom: 16 },
      ).addTo(mapa);

      // Camada so de rotulos, para aparecerem os nomes das cidades.
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 16, pane: "shadowPane" },
      ).addTo(mapa);

      const desenharRota = (pontos: Ponto[], cor: string) => {
        // Faixa larga e translucida por baixo = area de cobertura ao redor da rota.
        L.polyline(pontos, {
          color: cor,
          weight: 26,
          opacity: 0.1,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(mapa!);

        L.polyline(pontos, {
          color: cor,
          weight: 3,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(mapa!);
      };

      desenharRota(ROTA_BR163, COR_BR163);
      desenharRota(ROTA_BR364, COR_BR364);

      L.marker(SEDE.coords, {
        icon: L.divIcon({ className: "", html: '<div class="hq-marker"></div>', iconSize: [15, 15] }),
        title: SEDE.nome,
      })
        .addTo(mapa)
        .bindPopup(`<strong>${SEDE.nome}</strong><br>${SEDE.descricao}`);

      EXTREMIDADES.forEach((ponta) => {
        L.marker(ponta.coords, {
          icon: L.divIcon({
            className: "",
            html: '<div class="dest-marker"></div>',
            iconSize: [12, 12],
          }),
          title: ponta.nome,
        })
          .addTo(mapa!)
          .bindPopup(`<strong>${ponta.nome}</strong><br>${ponta.descricao}`);
      });

      mapa.fitBounds(L.latLngBounds([...ROTA_BR163, ...ROTA_BR364]), {
        padding: [40, 40],
      });
    });

    return () => {
      cancelado = true;
      mapa?.remove();
    };
  }, []);

  return <div ref={containerRef} className="map-canvas" role="img" aria-label="Mapa do corredor de atuação da Frotec na BR-163, entre Mato Grosso e Rondônia" />;
}
