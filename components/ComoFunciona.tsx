const ETAPAS = [
  {
    numero: "01",
    titulo: "Cadastro e diagnóstico",
    texto:
      "Cadastramos sua empresa e a frota, entendendo perfil operacional, rotas e volume de caminhões.",
  },
  {
    numero: "02",
    titulo: "Avaliação técnica",
    texto:
      "Checklist técnico veículo a veículo, com fotos, laudo e classificação de risco por caminhão.",
  },
  {
    numero: "03",
    titulo: "Proposta e contrato",
    texto:
      "Geramos a proposta conforme o perfil da frota, com contrato para assinatura digital.",
  },
  {
    numero: "04",
    titulo: "Frota ativa",
    texto:
      "Manutenção preventiva programada e acesso à rede credenciada, com auditoria técnica em cada OS.",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Como funciona</div>
          <h2>Da avaliação técnica à frota sob controle.</h2>
          <p>
            Um processo estruturado, pensado para frotas grandes que não podem parar por falta de
            gestão técnica.
          </p>
        </div>

        <div className="steps reveal-stagger">
          {ETAPAS.map((etapa) => (
            <div className="step" key={etapa.numero}>
              <div className="step-dot">{etapa.numero}</div>
              <h3>{etapa.titulo}</h3>
              <p>{etapa.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
