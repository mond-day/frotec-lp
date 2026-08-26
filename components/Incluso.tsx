import { CheckIcon } from "./icons";

const ITENS = [
  "Avaliação técnica inicial com checklist e laudo",
  "Classificação de risco por veículo",
  "Manutenção preventiva programada 2x por ano",
  "Acesso à rede de oficinas credenciadas",
  "Auditoria técnica de cada ordem de serviço",
  "Portal de acompanhamento da frota",
];

export default function Incluso() {
  return (
    <section>
      <div className="wrap grid-2 align-center">
        <div>
          <div className="eyebrow">O que está incluso</div>
          <h2>Gestão técnica completa, do diagnóstico à auditoria.</h2>
          <p style={{ marginTop: "16px" }}>
            O convênio Frotec é gestão técnica recorrente: reduz falhas, paradas e custo
            inesperado. O que entra e o que fica de fora está definido em contrato, item a item.
          </p>
          <a href="#servico" className="btn btn-primary" style={{ marginTop: "28px" }}>
            Ver o escopo do convênio
          </a>
        </div>

        <ul className="checklist reveal-stagger">
          {ITENS.map((item) => (
            <li key={item}>
              <CheckIcon />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
