import CoverageMapClient from "./CoverageMapClient";
import { InfoIcon } from "./icons";
import { EXTENSAO_APROXIMADA } from "@/lib/cobertura";

export default function Cobertura() {
  return (
    <section className="band" id="cobertura">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Onde atuamos</div>
          <h2>Um eixo logístico, uma gestão técnica única.</h2>
          <p>
            Da base em Sinop/MT, acompanhamos a frota ao longo do corredor da BR-163 — de Cuiabá
            ao norte do estado — e pelo ramal da BR-364 até Vilhena, em Rondônia. É nesse eixo que
            estão as maiores operações de transporte da região.
          </p>
        </div>

        <div className="map-card reveal">
          <CoverageMapClient />
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
          <div className="map-stat">
            <div className="stat-n">{EXTENSAO_APROXIMADA}</div>
            <div className="stat-l">de corredor atendido</div>
          </div>
        </div>

        <div className="notice info" style={{ marginTop: "32px" }}>
          <InfoIcon size={20} />
          <p>
            <strong>O atendimento é por rota, não por cidade fixa.</strong> Frotas graneleiras
            mudam de trecho conforme a safra e circulam entre MT, RO, PA e AM ao longo do ano — o
            convênio acompanha o caminhão no corredor, e não um endereço. Nesta fase, a operação
            atende apenas o eixo BR-163 entre Mato Grosso e Rondônia. Empresas de fora dessa
            região podem se cadastrar mesmo assim: o contato fica registrado para quando a
            expansão chegar até lá.
          </p>
        </div>
      </div>
    </section>
  );
}
