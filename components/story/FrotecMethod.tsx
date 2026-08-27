import Reveal from "@/components/motion/Reveal";

const CICLO = [
  { titulo: "Diagnosticar", pergunta: "O que precisa de atenção agora?", glyph: "◎" },
  { titulo: "Priorizar", pergunta: "O que pode esperar e o que não pode?", glyph: "◈" },
  { titulo: "Prevenir", pergunta: "Quando intervir antes de parar?", glyph: "◇" },
  { titulo: "Auditar", pergunta: "O serviço e o orçamento fazem sentido?", glyph: "◱" },
  { titulo: "Acompanhar", pergunta: "O que aconteceu com cada veículo?", glyph: "◷" },
];

export default function FrotecMethod() {
  return (
    <section className="method-section theme-graphite band-edge" id="metodo" aria-labelledby="metodo-title">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">A virada</div>
          <h2 id="metodo-title">Troque manutenção reativa por rotina técnica previsível.</h2>
          <p style={{ marginTop: 16, maxWidth: 560 }}>
            Um ciclo de cinco perguntas que a operação passa a responder com método — não com
            improviso.
          </p>
        </Reveal>

        <div className="method-cycle">
          {CICLO.map((etapa, index) => (
            <Reveal key={etapa.titulo} delay={index * 0.06} className="method-step">
              <div className="method-n">{String(index + 1).padStart(2, "0")}</div>
              <div className="method-index">{etapa.glyph}</div>
              <h3>{etapa.titulo}</h3>
              <p>{etapa.pergunta}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
