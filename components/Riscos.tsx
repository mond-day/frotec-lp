import { BrokenChartIcon, ClockIcon, WarningIcon } from "./icons";

export default function Riscos() {
  return (
    <section className="band">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">O risco de operar sem gestão técnica</div>
          <h2>Frota parada é frete atrasado, multa e cliente insatisfeito.</h2>
          <p>
            Em operações com dezenas de caminhões, cada falha não planejada tem efeito em cadeia
            — na rota, no contrato e no caixa da empresa.
          </p>
        </div>

        <div className="grid-3 reveal-stagger">
          <div className="card">
            <div className="icon-tile warn">
              <WarningIcon />
            </div>
            <h3>Parada não planejada</h3>
            <p>
              Uma falha na estrada não avisa antes. Sem manutenção preventiva, o caminhão para na
              pior hora — e o frete atrasa.
            </p>
          </div>
          <div className="card">
            <div className="icon-tile warn">
              <ClockIcon />
            </div>
            <h3>Multas e caminhões retidos</h3>
            <p>
              Sistemas de emissão (ARLA) desregulados são o caminho mais rápido para autuações
              pesadas e cargas paradas na fiscalização. Nós monitoramos isso para você.
            </p>
          </div>
          <div className="card">
            <div className="icon-tile warn">
              <BrokenChartIcon />
            </div>
            <h3>Orçamentos de oficina sem transparência</h3>
            <p>
              Sabe aquele conserto que sempre fica mais caro do que deveria? Nossa equipe de
              engenheiros audita toda Ordem de Serviço (OS) antes de você pagar a conta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
