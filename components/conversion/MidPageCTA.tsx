"use client";

import { track } from "@/lib/analytics";
import Reveal from "@/components/motion/Reveal";

export default function MidPageCTA() {
  return (
    <section className="mid-cta" aria-labelledby="mid-cta-title">
      <div className="wrap">
        <Reveal>
          <h2 id="mid-cta-title">Quanto da sua rotina hoje ainda depende de apagar incêndio?</h2>
          <p>
            Uma conversa inicial para entender operação, frota e principais pontos de perda de
            previsibilidade.
          </p>
          <a
            href="#contato"
            className="btn btn-primary"
            onClick={() => track("hero_cta_click", { source: "mid_cta" })}
          >
            Quero avaliar minha frota
          </a>
        </Reveal>
      </div>
    </section>
  );
}
