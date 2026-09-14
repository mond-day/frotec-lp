import type { Metadata } from "next";
import PropostaForm from "@/components/propostas/PropostaForm";
import PropostaTopbar from "@/components/propostas/PropostaTopbar";
import { exigirSessaoPropostas } from "@/lib/area-propostas";

export const metadata: Metadata = {
  title: "Gerador de propostas | Frotec",
  robots: { index: false, follow: false },
};

export default async function PaginaProposta() {
  await exigirSessaoPropostas("/propostas/proposta");

  return (
    <>
      <PropostaTopbar />
      <main className="proposta-page">
        <div className="wrap">
          <p className="eyebrow">Comercial</p>
          <h1>Montar proposta</h1>
          <p className="proposta-lead">
            Preencha os blocos. O PDF é gerado na hora e não fica salvo neste servidor.
          </p>
          <PropostaForm />
        </div>
      </main>
    </>
  );
}
