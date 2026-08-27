import Reveal from "@/components/motion/Reveal";

const PROVAS = [
  {
    titulo: "Laudo demonstrativo",
    texto: "Avaliação veículo a veículo com classificação de risco e prioridades claras.",
  },
  {
    titulo: "Checklist técnico",
    texto: "Itens estruturados, evidências e observações — base para decidir o que prevenir primeiro.",
  },
  {
    titulo: "Fluxo de OS",
    texto: "Da abertura à análise e aprovação: transparência no que está sendo autorizado.",
  },
];

export default function OperationalProof() {
  return (
    <section className="theme-paper band-edge" id="prova" aria-labelledby="prova-title" style={{ padding: "100px 0" }}>
      <div className="wrap">
        <Reveal>
          <div className="eyebrow">Prova operacional</div>
          <h2 id="prova-title">A confiança vem do processo.</h2>
          <p style={{ marginTop: 14, maxWidth: 520 }}>
            Enquanto reunimos depoimentos autorizados, mostramos o que sustenta a operação: método,
            documentação e cobertura real.
          </p>
        </Reveal>

        <div className="proof-grid">
          {PROVAS.map((item, index) => (
            <Reveal key={item.titulo} delay={index * 0.06} className="proof-item">
              <span className="demo-tag" style={{ marginBottom: 14 }}>
                Modelo demonstrativo
              </span>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
