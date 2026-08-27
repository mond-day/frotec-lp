import LeadQualificationForm from "@/components/conversion/LeadQualificationForm";
import Reveal from "@/components/motion/Reveal";
import { CONTATO } from "@/lib/contato";

export default function Contato() {
  return (
    <section id="contato" className="cta-section" aria-labelledby="contato-title">
      <div className="wrap">
        <div className="form-grid">
          <Reveal>
            <div className="eyebrow">Diagnóstico</div>
            <h2 id="contato-title">Conte como sua frota opera hoje.</h2>
            <p style={{ marginTop: "16px", maxWidth: "440px" }}>
              Com algumas informações conseguimos direcionar a conversa para os pontos que mais
              impactam sua operação.
            </p>
            <p style={{ marginTop: "16px", maxWidth: "440px", fontSize: "14px" }}>
              Nesta fase, a operação atende o corredor da <strong>BR-163</strong>, entre Mato Grosso
              e Rondônia, com base em Sinop/MT.
            </p>

            <div className="contact-list">
              <span>{CONTATO.cidade}</span>
              <a href={CONTATO.telefoneLink}>{CONTATO.telefone}</a>
              <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a>
            </div>
          </Reveal>

          <LeadQualificationForm />
        </div>
      </div>
    </section>
  );
}
