import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { CONTATO } from "@/lib/contato";

export const metadata: Metadata = {
  title: "Política de Privacidade | Frotec",
  description:
    "Como a Frotec trata dados pessoais coletados no formulário de diagnóstico de frota e no contato comercial.",
};

export default function PrivacidadePage() {
  return (
    <>
      <header className="legal-topbar">
        <div className="wrap legal-topbar-inner">
          <Link href="/" className="legal-brand">
            <Image src="/frotec-logo.png" alt="Frotec" width={936} height={149} />
          </Link>
          <Link href="/#contato" className="btn btn-ghost">
            Voltar ao site
          </Link>
        </div>
      </header>

      <main className="legal-page">
        <div className="wrap legal-content">
          <p className="eyebrow">Legal</p>
          <h1>Política de Privacidade</h1>
          <p className="legal-updated">Última atualização: agosto de 2026</p>

          <p>
            Esta política descreve como a <strong>{CONTATO.marca}</strong> trata dados pessoais
            coletados nesta landing page, em especial pelo formulário de diagnóstico de frota e
            pelos canais de contato publicados no site.
          </p>

          <h2>1. Quem é o controlador</h2>
          <p>
            Controlador: <strong>{CONTATO.marca}</strong>, com atuação comercial em{" "}
            {CONTATO.cidade} ({CONTATO.atuacao}).
          </p>
          <p>
            Contato para assuntos de privacidade:{" "}
            <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a>
            {CONTATO.telefone.includes("0000")
              ? " (e-mail preferencial; telefone ainda é placeholder nesta página)."
              : ` ou ${CONTATO.telefone}.`}
          </p>
          <p>
            O CNPJ da Frotec ainda está em processo de registro. Enquanto isso, dados societários
            completos podem ser fornecidos sob demanda no contato comercial.
          </p>

          <h2>2. Quais dados coletamos</h2>
          <p>No formulário de leads, podemos coletar:</p>
          <ul>
            <li>Nome</li>
            <li>Empresa</li>
            <li>WhatsApp / telefone</li>
            <li>E-mail corporativo (opcional)</li>
            <li>CNPJ (opcional)</li>
            <li>Quantidade de veículos da frota</li>
            <li>Região / corredor de operação</li>
            <li>Problema operacional informado</li>
            <li>Mensagem livre (opcional)</li>
          </ul>
          <p>
            Também podemos registrar metadados técnicos mínimos do envio (por exemplo, data/hora)
            para operação do atendimento. Não usamos o formulário para criar perfil de
            navegação comportamental avançado nesta página.
          </p>

          <h2>3. Para que usamos os dados</h2>
          <ul>
            <li>Responder solicitações de diagnóstico e contato comercial</li>
            <li>Qualificar se a operação está no corredor atendido (BR-163 / MT–RO)</li>
            <li>Registrar interesse de empresas fora da área atual para expansão futura</li>
            <li>Enviar confirmações e comunicações relacionadas à solicitação</li>
          </ul>
          <p>
            Base legal principal (LGPD): legítimo interesse e/ou execução de procedimentos
            preliminares relacionados a pedido do titular (art. 7º). Quando aplicável, consentimento
            para comunicações específicas.
          </p>

          <h2>4. Como os dados são enviados e armazenados</h2>
          <p>
            O envio do formulário passa pela API interna do site e pode gerar notificação por
            e-mail via SMTP para a equipe comercial. Os dados são tratados para atendimento do
            lead — não para venda a terceiros.
          </p>
          <p>
            Mantemos apenas o necessário para o ciclo comercial e de suporte. Prazos concretos de
            retenção podem variar conforme a natureza do contato; sob solicitação, informamos o
            status do seu cadastro.
          </p>

          <h2>5. Compartilhamento</h2>
          <p>
            Podemos compartilhar dados com prestadores estritamente necessários à operação do site
            e do e-mail (hospedagem, infraestrutura e envio SMTP), sob obrigação de confidencialidade
            e finalidade limitada. Não vendemos listas de leads.
          </p>

          <h2>6. Seus direitos</h2>
          <p>
            Nos termos da LGPD, você pode solicitar confirmação de tratamento, acesso, correção,
            anonimização, portabilidade, eliminação de dados desnecessários, informação sobre
            compartilhamentos e oposição, quando cabível. Para exercer direitos, escreva para{" "}
            <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a>.
          </p>

          <h2>7. Cookies e métricas</h2>
          <p>
            Esta página pode usar eventos de analytics de primeira parte para entender uso do site
            (ex.: visualização de seções e envio de formulário). Não dependemos de remarketing de
            terceiros para o funcionamento do formulário.
          </p>

          <h2>8. Atualizações</h2>
          <p>
            Esta política pode ser atualizada para refletir mudanças no produto, na operação ou na
            legislação. A data no topo indica a versão vigente.
          </p>

          <p className="legal-back">
            <Link href="/">← Voltar para a página inicial</Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
