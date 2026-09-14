import type { Metadata } from "next";
import Link from "next/link";
import PropostaTopbar from "@/components/propostas/PropostaTopbar";
import { exigirSessaoPropostas } from "@/lib/area-propostas";

export const metadata: Metadata = {
  title: "Área interna | Frotec",
  robots: { index: false, follow: false },
};

export default async function HubPropostasPage() {
  await exigirSessaoPropostas("/propostas");

  return (
    <>
      <PropostaTopbar />
      <main className="proposta-page">
        <div className="wrap">
          <p className="eyebrow">Comercial</p>
          <h1>O que deseja gerar?</h1>
          <p className="proposta-lead">
            Escolha o documento. O PDF é gerado na hora e não fica salvo neste servidor.
          </p>
          <div className="proposta-hub">
            <Link href="/propostas/proposta" className="proposta-hub-card">
              <span className="proposta-hub-n">01</span>
              <h2>Gerar proposta</h2>
              <p>Proposta comercial em PDF, com o visual da marca.</p>
            </Link>
            <Link href="/propostas/contrato" className="proposta-hub-card">
              <span className="proposta-hub-n">02</span>
              <h2>Gerar contrato</h2>
              <p>Contrato de adesão em PDF, com os dados do contratante.</p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
