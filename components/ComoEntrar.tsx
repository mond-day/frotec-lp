const ETAPAS = [
  {
    numero: "01",
    titulo: "Contato inicial",
    texto:
      "Você preenche o formulário do site ou fala com o time comercial pelo WhatsApp.",
  },
  {
    numero: "02",
    titulo: "Cadastro da empresa e da frota",
    texto:
      "Reunimos os dados da empresa, dos responsáveis e a lista de caminhões que farão parte do convênio.",
  },
  {
    numero: "03",
    titulo: "Agendamento da avaliação",
    texto:
      "Um avaliador técnico vai até a frota, ou ao local combinado, para o checklist veículo a veículo.",
  },
  {
    numero: "04",
    titulo: "Checklist e laudo técnico",
    texto:
      "Cada caminhão é inspecionado com fotos e observações, gerando um laudo técnico individual.",
  },
  {
    numero: "05",
    titulo: "Classificação de risco",
    texto:
      "O checklist gera a faixa de risco de cada veículo e aponta as irregularidades encontradas.",
  },
  {
    numero: "06",
    titulo: "Proposta do convênio",
    texto:
      "A central monta a proposta conforme o perfil da frota, com validade e escopo detalhados.",
  },
  {
    numero: "07",
    titulo: "Contrato e assinatura digital",
    texto:
      "O contrato e os anexos técnicos por veículo são assinados digitalmente, sem papel.",
  },
  {
    numero: "08",
    titulo: "Ativação da frota",
    texto:
      "Com o contrato assinado, os veículos aprovados são ativados e entram no calendário preventivo.",
  },
];

export default function ComoEntrar() {
  return (
    <section id="como-entrar">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Como entrar no convênio</div>
          <h2>Do primeiro contato à frota ativa.</h2>
          <p>
            Um processo estruturado, sem letras miúdas — cada etapa é validada com você antes de
            avançar para a próxima.
          </p>
        </div>

        <div className="process reveal-stagger">
          {ETAPAS.map((etapa) => (
            <div className="process-item" key={etapa.numero}>
              <div className="process-num">{etapa.numero}</div>
              <h3>{etapa.titulo}</h3>
              <p>{etapa.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
