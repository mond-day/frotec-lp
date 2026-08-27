import LeadForm from "./LeadForm";
import { CONTATO } from "@/lib/contato";

export default function Contato() {
  return (
    <section id="contato" className="cta-section">
      <div className="wrap">
        <div className="form-grid reveal">
          <div>
            <div className="eyebrow">Fale com a gente</div>
            <h2>Receba um diagnóstico gratuito da sua frota.</h2>
            <p style={{ marginTop: "16px", maxWidth: "440px" }}>
              Preencha os dados abaixo. Um consultor Frotec entra em contato para entender o perfil
              da frota e mostrar onde você pode reduzir custos — sem compromisso.
            </p>
            <p style={{ marginTop: "16px", maxWidth: "440px", fontSize: "14px" }}>
              Nesta fase, a operação atende apenas o corredor da <strong>BR-163</strong>, entre
              Mato Grosso e Rondônia, com base em Sinop/MT.
            </p>

            <div className="contact-list">
              <span>{CONTATO.cidade}</span>
              <a href={CONTATO.telefoneLink}>{CONTATO.telefone}</a>
              <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a>
            </div>
          </div>

          <LeadForm />
        </div>
      </div>
    </section>
  );
}
