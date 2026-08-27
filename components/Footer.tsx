import Image from "next/image";
import { CONTATO } from "@/lib/contato";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <Image
            className="brand-logo"
            src="/frotec-logo.png"
            alt="Frotec"
            width={936}
            height={149}
            style={{ height: "24px" }}
          />

          <div className="foot-cols">
            <div className="foot-col">
              <h4>Navegação</h4>
              <a href="#como-funciona">Como funciona</a>
              <a href="#beneficios">Benefícios</a>
              <a href="#cobertura">Onde atuamos</a>
              <a href="#servico">O serviço</a>
              <a href="#faq">Perguntas</a>
            </div>
            <div className="foot-col">
              <h4>Contato</h4>
              <a href="#contato">Falar com um Consultor</a>
              <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a>
              <a href={CONTATO.telefoneLink}>{CONTATO.telefone}</a>
            </div>
          </div>
        </div>

        <p style={{ fontSize: "12.5px", marginBottom: "22px", maxWidth: "760px" }}>
          A Frotec presta serviços de gestão técnica e consultoria em manutenção de frotas. O
          convênio não é seguro, não é garantia estendida e não constitui operação securitária. As
          condições, limites e exclusões de cada plano são definidos em contrato.
        </p>

        <div className="foot-bottom">
          <span>
            © {new Date().getFullYear()} {CONTATO.marca}. {CONTATO.cidade} — atuação em MT e RO.
          </span>
          <span>Desenvolvido por Sonder.Corp</span>
        </div>
      </div>
    </footer>
  );
}
