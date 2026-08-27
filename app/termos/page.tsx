import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { CONTATO } from "@/lib/contato";

export const metadata: Metadata = {
  title: "Termos de Uso | Frotec",
  description:
    "Termos de uso desta landing page e condições gerais sobre solicitação de diagnóstico e uso de dados de contato.",
};

export default function TermosPage() {
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
          <h1>Termos de Uso</h1>
          <p className="legal-updated">Última atualização: agosto de 2026</p>

          <p>
            Estes termos regem o uso desta landing page da <strong>{CONTATO.marca}</strong> e o
            envio de solicitações de diagnóstico / contato comercial. Ao utilizar o site ou enviar
            o formulário, você declara ter lido estas condições.
          </p>

          <h2>1. Objeto do site</h2>
          <p>
            O site apresenta informações comerciais sobre gestão técnica e consultoria em manutenção
            de frotas, com atuação descrita em {CONTATO.cidade} e no corredor {CONTATO.atuacao}.
            Conteúdos marcados como “demonstrativo”, “ilustrativo” ou “modelo futuro” não
            representam, por si só, um produto já operacional em produção.
          </p>

          <h2>2. Natureza do serviço</h2>
          <p>
            A Frotec presta serviços de gestão técnica e consultoria. O convênio ou planos
            apresentados <strong>não são seguro</strong>, não são garantia estendida e não
            constituem operação securitária. Condições, limites e exclusões de qualquer plano são
            definidos em contrato específico.
          </p>

          <h2>3. Formulário e leads</h2>
          <p>
            O formulário coleta dados para contato comercial (nome, empresa, região, frota e
            canais de comunicação). O envio não cria, automaticamente, vínculo contratual nem
            obrigação de prestação de serviço. A equipe pode recusar ou reagendar atendimentos
            conforme capacidade, escopo geográfico e análise técnica.
          </p>
          <p>
            Empresas fora do corredor atual podem se cadastrar: o contato fica registrado para
            expansão futura, sem garantia de prazo de atendimento.
          </p>

          <h2>4. Uso aceitável</h2>
          <ul>
            <li>Não envie dados falsos de forma deliberada ou conteúdo ilícito</li>
            <li>Não utilize o formulário para spam, scraping ou testes abusivos</li>
            <li>Não tente explorar vulnerabilidades da API ou da infraestrutura</li>
          </ul>

          <h2>5. Propriedade intelectual</h2>
          <p>
            Marca, textos, layout e materiais do site pertencem à Frotec ou a licenciadores.
            Reprodução não autorizada para fins comerciais é vedada.
          </p>

          <h2>6. Limitação</h2>
          <p>
            Informações do site são fornecidas para fins comerciais e informativos. Não
            substituem laudo técnico presencial, contrato assinado ou parecer jurídico. Em caso de
            divergência entre o site e um contrato firmado, prevalece o contrato.
          </p>

          <h2>7. Contato</h2>
          <p>
            Dúvidas sobre estes termos:{" "}
            <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a>
            {CONTATO.telefone.includes("0000")
              ? ". O telefone publicado no rodapé ainda é placeholder."
              : ` · ${CONTATO.telefone}.`}
          </p>
          <p>
            Dados institucionais (CNPJ completo / endereço fiscal) serão atualizados quando o
            registro societário estiver concluído.
          </p>

          <h2>8. Privacidade</h2>
          <p>
            O tratamento de dados pessoais segue a{" "}
            <Link href="/privacidade">Política de Privacidade</Link>.
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
