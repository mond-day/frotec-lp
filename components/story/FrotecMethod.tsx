import Reveal from "@/components/motion/Reveal";

const CICLO = [
  { titulo: "Diagnosticar", pergunta: "O que precisa de atenção agora?" },
  { titulo: "Priorizar", pergunta: "O que pode esperar e o que não pode?" },
  { titulo: "Prevenir", pergunta: "Quando intervir antes de parar?" },
  { titulo: "Auditar", pergunta: "O serviço e o orçamento fazem sentido?" },
  { titulo: "Acompanhar", pergunta: "O que aconteceu com cada veículo?" },
];

export default function FrotecMethod() {
  return (
    <section className="method-section theme-graphite band-edge" id="metodo" aria-labelledby="metodo-title">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">A virada</div>
          <h2 id="metodo-title">Troque manutenção reativa por uma rotina técnica previsível.</h2>
          <p style={{ marginTop: 14, maxWidth: 560 }}>
            A Frotec organiza o ciclo de cuidado da frota para que decisões técnicas deixem de
            acontecer no improviso.
          </p>
        </Reveal>

        <div className="method-cycle">
          {CICLO.map((etapa, index) => (
            <Reveal key={etapa.titulo} delay={index * 0.06} className="method-step">
              <div className="method-index">{String(index + 1).padStart(2, "0")}</div>
              <h3>{etapa.titulo}</h3>
              <p>{etapa.pergunta}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
