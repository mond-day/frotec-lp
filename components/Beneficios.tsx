import {
  CalendarIcon,
  ChatIcon,
  GearIcon,
  ReportIcon,
  RerouteIcon,
  TrendIcon,
} from "./icons";

export default function Beneficios() {
  return (
    <section id="beneficios" className="band">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Benefícios</div>
          <h2>Frota diesel com menos surpresa, mais controle.</h2>
        </div>

        <div className="grid-3 reveal-stagger">
          <div className="card">
            <div className="icon-tile">
              <CalendarIcon />
            </div>
            <h3>Preventiva 2x por ano</h3>
            <p>
              Cada veículo do convênio entra em um calendário de manutenção preventiva com duas
              intervenções programadas por ano.
            </p>
          </div>
          <div className="card">
            <div className="icon-tile">
              <ReportIcon />
            </div>
            <h3>Histórico por veículo</h3>
            <p>
              Diagnóstico, laudos, peças aplicadas e ordens de serviço ficam registrados caminhão
              a caminhão — não na memória do mecânico.
            </p>
          </div>
          <div className="card">
            <div className="icon-tile">
              <GearIcon />
            </div>
            <h3>Rede de oficinas credenciadas</h3>
            <p>
              Acesso a oficinas avaliadas e auditadas tecnicamente pela central Frotec ao longo do
              corredor de operação.
            </p>
          </div>
          <div className="card">
            <div className="icon-tile">
              <ChatIcon />
            </div>
            <h3>WhatsApp fora do horário</h3>
            <p>
              Atendimento comercial em horário comercial e um canal de WhatsApp para emergências
              fora dele — porque a estrada não segue expediente.
            </p>
          </div>
          <div className="card">
            <div className="icon-tile">
              <RerouteIcon />
            </div>
            <h3>Redirecionamento de OS</h3>
            <p>
              Se a oficina credenciada acionada não responder, a central redireciona a ordem de
              serviço para outra da rede sem travar o atendimento.
            </p>
          </div>
          <div className="card">
            <div className="icon-tile">
              <TrendIcon />
            </div>
            <h3>Auditoria técnica das OS</h3>
            <p>
              Toda ordem de serviço passa por aprovação e auditoria da central antes da execução e
              no encerramento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
