import { BoxIcon, GearIcon, LockIcon, TruckIcon } from "./icons";

const FAIXAS_DE_RISCO = [
  {
    letra: "A",
    classe: "",
    titulo: "Aprovado",
    texto: "Veículo dentro dos padrões técnicos. Entra no convênio na ativação.",
  },
  {
    letra: "B",
    classe: "band-b",
    titulo: "Aprovado com ressalva",
    texto: "Entra no convênio com pontos de atenção monitorados e prazo para correção.",
  },
  {
    letra: "C",
    classe: "band-c",
    titulo: "Regularização obrigatória",
    texto: "Ativação bloqueada até a irregularidade técnica ser corrigida.",
  },
  {
    letra: "D",
    classe: "band-d",
    titulo: "Reprovado",
    texto: "Indício de fraude, adulteração ou dano grave. Não entra nesta avaliação.",
  },
];

export default function Servico() {
  return (
    <section id="servico" className="band">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">O serviço</div>
          <h2>O que entra no convênio — e o que não entra.</h2>
          <p>
            O convênio é uma prestação de serviço de gestão técnica, com escopo definido em
            contrato. Nada é aprovado por presunção: cada veículo passa por avaliação antes de ser
            ativado, e cada serviço passa por aprovação técnica antes de ser executado.
          </p>
        </div>

        <div className="scope-price reveal">
          <span className="stat-n">R$ 350</span>
          <span>
            valor de referência da vistoria técnica inicial, por veículo,
            <br />
            cobrada antes da entrada no convênio
          </span>
        </div>

        <div className="grid-3 reveal-stagger">
          <div className="card">
            <div className="icon-tile">
              <GearIcon />
            </div>
            <h3>Catalisador SCR no plano</h3>
            <p>
              O catalisador do sistema SCR entra no escopo de peças do convênio. É um componente
              de vida útil longa, com garantia do próprio fabricante superior a um ano, e troca
              rara fora de eventos excepcionais.
            </p>
          </div>
          <div className="card">
            <div className="icon-tile">
              <BoxIcon />
            </div>
            <h3>Estoque próprio de peças</h3>
            <p>
              Componentes de maior giro ficam em estoque para reposição imediata. A peça
              substituída é recolhida para recondicionamento e fica rastreada no sistema.
            </p>
          </div>
          <div className="card">
            <div className="icon-tile">
              <TruckIcon />
            </div>
            <h3>Regras por marca e modelo</h3>
            <p>
              Cada marca tem um perfil de desgaste diferente. Os alertas preventivos são
              parametrizados por marca, modelo e quilometragem do caminhão.
            </p>
          </div>
        </div>

        <div className="section-sub reveal">
          <h3>Classificação de risco por veículo</h3>
          <p>
            O checklist técnico gera automaticamente uma faixa de risco por caminhão. O gestor vê
            a situação da frota sem precisar revisar item a item.
          </p>
        </div>

        <div className="risk-list reveal-stagger">
          {FAIXAS_DE_RISCO.map((faixa) => (
            <div className={`risk-item ${faixa.classe}`.trim()} key={faixa.letra}>
              <div className="risk-letter">{faixa.letra}</div>
              <h3>{faixa.titulo}</h3>
              <p>{faixa.texto}</p>
            </div>
          ))}
        </div>

        <div className="notice reveal" style={{ marginTop: "32px" }}>
          <LockIcon size={20} />
          <p>
            <strong>Nenhum veículo é ativado com irregularidade técnica em aberto.</strong> Se a
            vistoria encontrar um problema, a ativação daquele caminhão fica bloqueada até a
            regularização. Esse acerto é orçado e contratado à parte — não está incluído na
            mensalidade do convênio.
          </p>
        </div>
      </div>
    </section>
  );
}
