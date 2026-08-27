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
            <p style={{ marginTop: 18, maxWidth: "44ch" }}>
              Com algumas informações conseguimos direcionar a conversa para os pontos que mais
              impactam sua operação.
            </p>
            <div className="contact-coverage">
              <div className="contact-coverage-kicker">Cobertura desta fase</div>
              <p>
                Corredor da <strong>BR-163</strong>, entre Mato Grosso e Rondônia, com base em
                Sinop/MT. Fora dessa área o contato fica registrado para a próxima expansão.
              </p>
            </div>

            <div className="contact-list">
              <div>
                <span>Base</span>
                {CONTATO.cidade}
              </div>
              <div>
                <span>Telefone</span>
                <a href={CONTATO.telefoneLink}>{CONTATO.telefone}</a>
              </div>
              <div>
                <span>E-mail</span>
                <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a>
              </div>
            </div>
          </Reveal>

          <LeadQualificationForm />
        </div>
      </div>
    </section>
  );
}
