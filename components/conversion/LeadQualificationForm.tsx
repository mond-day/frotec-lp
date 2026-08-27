"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { formatarCnpj } from "@/lib/cnpj";
import { track } from "@/lib/analytics";
import {
  buscarRota,
  CAMPO_ISCA,
  formatarTelefone,
  LEAD_VAZIO,
  OPCOES_PROBLEMA,
  OPCOES_ROTA,
  validarLead,
  type DadosLead,
  type ErrosLead,
} from "@/lib/lead";

type Situacao = "parado" | "enviando" | "enviado" | "erro";

export default function LeadQualificationForm() {
  const [dados, setDados] = useState<DadosLead>(LEAD_VAZIO);
  const [isca, setIsca] = useState("");
  const [erros, setErros] = useState<ErrosLead>({});
  const [iniciou, setIniciou] = useState(false);
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [situacao, setSituacao] = useState<Situacao>("parado");
  const [mensagemEnvio, setMensagemEnvio] = useState("");

  const rotaSelecionada = buscarRota(dados.rota);
  const foraDeArea = rotaSelecionada?.foraDeArea ?? false;

  function marcarInicio() {
    if (iniciou) return;
    setIniciou(true);
    track("form_start");
  }

  function alterar(campo: Exclude<keyof DadosLead, "problemas">, valor: string) {
    marcarInicio();
    setDados((anterior) => ({ ...anterior, [campo]: valor }));
    setErros((anterior) => ({ ...anterior, [campo]: undefined }));
  }

  function alternarProblema(valor: string) {
    marcarInicio();
    setDados((anterior) => {
      const jaTem = anterior.problemas.includes(valor);
      const problemas = jaTem
        ? anterior.problemas.filter((p) => p !== valor)
        : [...anterior.problemas, valor];
      return { ...anterior, problemas };
    });
    setErros((anterior) => ({ ...anterior, problemas: undefined }));
  }

  function aoDigitar(campo: Exclude<keyof DadosLead, "problemas">) {
    return (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      alterar(campo, evento.target.value);
  }

  function avancarEtapa() {
    const errosEtapa = validarLead(dados, 1);
    setErros(errosEtapa);
    if (Object.keys(errosEtapa).length > 0) {
      setSituacao("erro");
      setMensagemEnvio("Revise os campos da operação antes de continuar.");
      return;
    }
    setSituacao("parado");
    setMensagemEnvio("");
    setEtapa(2);
    track("form_step_1_complete");
  }

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (etapa === 1) {
      avancarEtapa();
      return;
    }

    const errosEncontrados = validarLead(dados);
    setErros(errosEncontrados);

    if (Object.keys(errosEncontrados).length > 0) {
      setSituacao("erro");
      setMensagemEnvio("Revise os campos destacados antes de enviar.");
      return;
    }

    setSituacao("enviando");
    setMensagemEnvio("");

    try {
      const resposta = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dados, [CAMPO_ISCA]: isca }),
      });

      if (!resposta.ok) throw new Error("Falha no envio");

      track("form_submit");
      setSituacao("enviado");
      setMensagemEnvio(
        foraDeArea
          ? "Recebemos seus dados. Sua região ainda não é atendida, mas o contato ficou registrado para a próxima expansão."
          : "Recebemos seus dados. Nosso time entra em contato para entender a operação e os pontos de perda de previsibilidade.",
      );
      setDados(LEAD_VAZIO);
      setEtapa(1);
    } catch {
      setSituacao("erro");
      setMensagemEnvio(
        "Não foi possível enviar agora. Tente novamente em instantes ou fale com a gente pelo WhatsApp.",
      );
    }
  }

  const enviando = situacao === "enviando";

  if (situacao === "enviado") {
    return (
      <div className="form-shell form-success" role="status" aria-live="polite">
        <div className="form-success-icon" aria-hidden="true">
          ✓
        </div>
        <h3>Solicitação recebida</h3>
        <p>{mensagemEnvio}</p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setSituacao("parado");
            setMensagemEnvio("");
            setErros({});
          }}
        >
          Enviar outro diagnóstico
        </button>
      </div>
    );
  }

  return (
    <form className="form-shell" onSubmit={aoEnviar} noValidate>
      <div className="form-steps">
        <span>Etapa {etapa} de 2</span>
        <div className="form-step-pills" aria-hidden="true">
          <span className={`form-step-pill${etapa >= 1 ? " is-active" : ""}`} />
          <span className={`form-step-pill${etapa >= 2 ? " is-active" : ""}`} />
        </div>
      </div>

      {etapa === 1 ? (
        <>
          <div className={`field${erros.veiculos ? " has-error" : ""}`}>
            <label htmlFor="veiculos">Quantos veículos sua frota possui?</label>
            <input
              id="veiculos"
              name="veiculos"
              type="number"
              min={1}
              max={10000}
              inputMode="numeric"
              placeholder="Ex.: 60"
              value={dados.veiculos}
              onChange={aoDigitar("veiculos")}
              aria-invalid={Boolean(erros.veiculos)}
            />
            {erros.veiculos && <span className="field-error">{erros.veiculos}</span>}
          </div>

          <div className={`field${erros.rota ? " has-error" : ""}`}>
            <label htmlFor="rota">Onde está a base da operação?</label>
            <select
              id="rota"
              name="rota"
              value={dados.rota}
              onChange={(evento) => alterar("rota", evento.target.value)}
              aria-invalid={Boolean(erros.rota)}
            >
              <option value="" disabled>
                Selecione a região
              </option>
              {OPCOES_ROTA.map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.rotulo}
                </option>
              ))}
            </select>
            {erros.rota && <span className="field-error">{erros.rota}</span>}
          </div>

          {foraDeArea && (
            <p className="form-alert" role="status">
              Nesta fase a Frotec atende o corredor da BR-163 entre Mato Grosso e Rondônia. Você pode
              enviar os dados mesmo assim — registramos para a expansão.
            </p>
          )}

          <fieldset className={`field problem-fieldset${erros.problemas ? " has-error" : ""}`}>
            <legend>Quais problemas você enfrenta hoje?</legend>
            <p className="problem-hint">Pode selecionar mais de um.</p>
            <div className="problem-list" role="group" aria-label="Problemas atuais">
              {OPCOES_PROBLEMA.map((opcao) => {
                const selecionado = dados.problemas.includes(opcao.valor);
                return (
                  <label
                    key={opcao.valor}
                    className={`problem-item${selecionado ? " is-selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      name="problemas"
                      value={opcao.valor}
                      checked={selecionado}
                      onChange={() => alternarProblema(opcao.valor)}
                    />
                    <span>{opcao.rotulo}</span>
                  </label>
                );
              })}
            </div>
            {erros.problemas && <span className="field-error">{erros.problemas}</span>}
          </fieldset>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block">
              Continuar
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="row-2">
            <div className={`field${erros.nome ? " has-error" : ""}`}>
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome"
                value={dados.nome}
                onChange={aoDigitar("nome")}
                aria-invalid={Boolean(erros.nome)}
              />
              {erros.nome && <span className="field-error">{erros.nome}</span>}
            </div>
            <div className={`field${erros.empresa ? " has-error" : ""}`}>
              <label htmlFor="empresa">Empresa</label>
              <input
                id="empresa"
                name="empresa"
                type="text"
                placeholder="Razão social ou nome fantasia"
                value={dados.empresa}
                onChange={aoDigitar("empresa")}
                aria-invalid={Boolean(erros.empresa)}
              />
              {erros.empresa && <span className="field-error">{erros.empresa}</span>}
            </div>
          </div>

          <div className="row-2">
            <div className={`field${erros.whatsapp ? " has-error" : ""}`}>
              <label htmlFor="whatsapp">WhatsApp</label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                inputMode="tel"
                placeholder="(66) 99999-0000"
                value={dados.whatsapp}
                onChange={(evento) => alterar("whatsapp", formatarTelefone(evento.target.value))}
                aria-invalid={Boolean(erros.whatsapp)}
              />
              {erros.whatsapp && <span className="field-error">{erros.whatsapp}</span>}
            </div>
            <div className={`field${erros.email ? " has-error" : ""}`}>
              <label htmlFor="email">E-mail corporativo (opcional)</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="voce@empresa.com.br"
                value={dados.email}
                onChange={aoDigitar("email")}
                aria-invalid={Boolean(erros.email)}
              />
              {erros.email && <span className="field-error">{erros.email}</span>}
            </div>
          </div>

          <div className={`field${erros.cnpj ? " has-error" : ""}`}>
            <label htmlFor="cnpj">CNPJ (opcional)</label>
            <input
              id="cnpj"
              name="cnpj"
              type="text"
              inputMode="numeric"
              placeholder="00.000.000/0000-00"
              value={dados.cnpj}
              onChange={(evento) => alterar("cnpj", formatarCnpj(evento.target.value))}
              aria-invalid={Boolean(erros.cnpj)}
            />
            {erros.cnpj && <span className="field-error">{erros.cnpj}</span>}
          </div>

          <div className={`field${erros.mensagem ? " has-error" : ""}`}>
            <label htmlFor="mensagem">Algo mais que ajude o diagnóstico? (opcional)</label>
            <textarea
              id="mensagem"
              name="mensagem"
              placeholder="Tipo de carga, trechos mais rodados, dores recorrentes…"
              value={dados.mensagem}
              onChange={aoDigitar("mensagem")}
              aria-invalid={Boolean(erros.mensagem)}
            />
            {erros.mensagem && <span className="field-error">{erros.mensagem}</span>}
          </div>

          <div className="campo-isca" aria-hidden="true">
            <label htmlFor={CAMPO_ISCA}>Não preencha este campo</label>
            <input
              id={CAMPO_ISCA}
              name={CAMPO_ISCA}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={isca}
              onChange={(evento) => setIsca(evento.target.value)}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setEtapa(1);
                setMensagemEnvio("");
                setSituacao("parado");
              }}
            >
              Voltar
            </button>
            <button type="submit" className="btn btn-primary" disabled={enviando} style={{ flex: 1 }}>
              {enviando ? (
                <span className="btn-spinner-label">
                  <span className="btn-spinner" aria-hidden="true" />
                  Enviando…
                </span>
              ) : (
                "Avaliar minha frota"
              )}
            </button>
          </div>
        </>
      )}

      {situacao === "erro" && mensagemEnvio && (
        <div className="form-msg err" role="alert" aria-live="assertive">
          {mensagemEnvio}
        </div>
      )}
    </form>
  );
}
