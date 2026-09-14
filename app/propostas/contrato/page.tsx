import type { Metadata } from "next";
import ContratoForm from "@/components/propostas/ContratoForm";
import PropostaTopbar from "@/components/propostas/PropostaTopbar";
import { exigirSessaoPropostas } from "@/lib/area-propostas";

export const metadata: Metadata = {
  title: "Gerador de contrato | Frotec",
  robots: { index: false, follow: false },
};

export default async function PaginaContrato() {
  await exigirSessaoPropostas("/propostas/contrato");

  return (
    <>
      <PropostaTopbar />
      <main className="proposta-page">
        <div className="wrap">
          <p className="eyebrow">Comercial</p>
          <h1>Montar contrato</h1>
          <p className="proposta-lead">
            Preencha os dados do contratante. O texto jurídico não é editável aqui.
          </p>
          <ContratoForm />
        </div>
      </main>
    </>
  );
}
