import { MotionReveal, MotionStagger } from "./MotionReveal";

const DEPOIMENTOS = [
  {
    nome: "Carlos Mendes",
    cargo: "Dono · Transportadora Mendes Grãos",
    citacao:
      "Antes do Frotec+, eu vivia na mão de oficina na beira da estrada. Hoje sei exatamente o que cada caminhão precisa — e ninguém me passa a perna no orçamento.",
    videoSrc: undefined as string | undefined,
    youtubeId: undefined as string | undefined,
  },
  {
    nome: "Ana Ribeiro",
    cargo: "Gerente de frota · 62 caminhões",
    citacao:
      "O portal mudou minha rotina. Em vez de correr atrás de status por WhatsApp, abro o celular e vejo tudo: manutenção, laudo, OS pendente.",
    videoSrc: undefined,
    youtubeId: undefined,
  },
  {
    nome: "João Pereira",
    cargo: "Diretor operacional · Corredor BR-163",
    citacao:
      "O ROI apareceu no primeiro trimestre. Menos parada não planejada, menos multa por emissão — e o frete chega no prazo.",
    videoSrc: undefined,
    youtubeId: undefined,
  },
];

function DepoimentoMidia({
  videoSrc,
  youtubeId,
  nome,
}: {
  videoSrc?: string;
  youtubeId?: string;
  nome: string;
}) {
  if (youtubeId) {
    return (
      <div className="depoimento-video">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={`Depoimento de ${nome}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (videoSrc) {
    return (
      <div className="depoimento-video">
        <video controls playsInline preload="metadata" poster="/hero-poster.svg">
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div className="depoimento-video depoimento-placeholder">
      <div className="depoimento-play" aria-hidden="true">
        ▶
      </div>
      <span>Vídeo em breve</span>
    </div>
  );
}

export default function Depoimentos() {
  return (
    <section id="depoimentos" className="band">
      <div className="wrap">
        <MotionReveal className="section-head">
          <div className="eyebrow">Prova social</div>
          <h2>Quem já não perde sono com manutenção.</h2>
          <p>
            Donos de transportadora e gerentes de frota que deixaram de apagar incêndio na estrada
            e passaram a operar com previsibilidade.
          </p>
        </MotionReveal>

        <MotionStagger className="depoimentos-grid">
          {DEPOIMENTOS.map((depoimento) => (
            <article className="depoimento-card" key={depoimento.nome}>
              <DepoimentoMidia
                videoSrc={depoimento.videoSrc}
                youtubeId={depoimento.youtubeId}
                nome={depoimento.nome}
              />
              <blockquote>&ldquo;{depoimento.citacao}&rdquo;</blockquote>
              <footer>
                <strong>{depoimento.nome}</strong>
                <span>{depoimento.cargo}</span>
              </footer>
            </article>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
