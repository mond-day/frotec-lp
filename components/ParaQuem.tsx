const PERFIS = [
  {
    numero: "01",
    texto: "Transportadoras e empresas com frota própria de caminhões diesel",
  },
  {
    numero: "02",
    texto: "Frotas geralmente acima de 50 caminhões",
  },
  {
    numero: "03",
    texto: "Operação no eixo BR-163, entre Mato Grosso e Rondônia, com base em Sinop/MT",
  },
  {
    numero: "04",
    texto: "Empresas que sentem o custo de paradas e de manutenção sem padrão técnico",
  },
];

export default function ParaQuem() {
  return (
    <section>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Para quem é o convênio</div>
          <h2>Feito para operações que não podem parar.</h2>
          <p>
            O modelo Frotec é pensado para poucos clientes com frotas grandes — não para
            atendimento pulverizado de veículo avulso.
          </p>
        </div>

        <div className="grid-4 reveal-stagger">
          {PERFIS.map((perfil) => (
            <div className="qualify-item" key={perfil.numero}>
              <div className="qualify-n">{perfil.numero}</div>
              <p>{perfil.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
