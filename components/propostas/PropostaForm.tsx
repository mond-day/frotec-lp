"use client";

import { useState, type FormEvent } from "react";
import { formatarTelefone } from "@/lib/lead";
import {
  PROPOSTA_VAZIA,
  formatarDataDigitada,
  validarProposta,
  type DadosProposta,
  type ErrosProposta,
} from "@/lib/proposta";

const ETAPAS = [
  "Cadastro",
  "Frota",
  "Vistoria",
  "Escopo",
  "Opcionais",
  "Comercial",
] as const;

export default function PropostaForm() {
  const [dados, setDados] = useState<DadosProposta>(PROPOSTA_VAZIA);
  const [etapa, setEtapa] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [erros, setErros] = useState<ErrosProposta>({});
  const [mensagem, setMensagem] = useState("");
  const [gerando, setGerando] = useState(false);

  function campo<K extends keyof DadosProposta>(nome: K, valor: DadosProposta[K]) {
    setDados((d) => ({ ...d, [nome]: valor }));
    setErros((e) => ({ ...e, [nome]: undefined }));
  }

  function avancar() {
    const encontrados = validarProposta(dados, etapa);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      setMensagem("Revise os campos destacados antes de continuar.");
      return;
    }
    setMensagem("");
    setEtapa((e) => Math.min(6, e + 1) as typeof etapa);
  }

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    if (etapa < 6) {
      avancar();
      return;
    }
    const encontrados = validarProposta(dados);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      setMensagem("Revise os campos destacados antes de gerar o PDF.");
      return;
    }
    setGerando(true);
    setMensagem("");
    try {
      const resposta = await fetch("/api/propostas/gerar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!resposta.ok) {
        const corpo = (await resposta.json().catch(() => ({}))) as { erro?: string };
        throw new Error(corpo.erro ?? "Falha ao gerar PDF");
      }
      const blob = await resposta.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const slug = dados.empresa.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
      a.href = url;
      a.download = `proposta-frotec-${slug || "cliente"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setMensagem("PDF gerado. O download deve ter iniciado.");
    } catch (erro) {
      setMensagem(erro instanceof Error ? erro.message : "Não foi possível gerar o PDF.");
    } finally {
      setGerando(false);
    }
  }

  return (
    <form className="proposta-form" onSubmit={aoEnviar} noValidate>
      <ol className="proposta-steps" aria-label="Etapas">
        {ETAPAS.map((nome, i) => (
          <li key={nome} className={i + 1 === etapa ? "is-on" : i + 1 < etapa ? "is-done" : ""}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {nome}
          </li>
        ))}
      </ol>

      {etapa === 1 ? (
        <fieldset className="proposta-bloco">
          <legend>Dados cadastrais e de contato</legend>
          <div className="field">
            <label htmlFor="empresa">Razão social / empresa</label>
            <input
              id="empresa"
              value={dados.empresa}
              onChange={(e) => campo("empresa", e.target.value)}
            />
            {erros.empresa ? <span className="field-error">{erros.empresa}</span> : null}
          </div>
          <div className="row-2">
            <div className="field">
              <label htmlFor="responsavel">Responsável / gestor da frota</label>
              <input
                id="responsavel"
                value={dados.responsavel}
                onChange={(e) => campo("responsavel", e.target.value)}
              />
              {erros.responsavel ? <span className="field-error">{erros.responsavel}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="cargo">Cargo</label>
              <input id="cargo" value={dados.cargo} onChange={(e) => campo("cargo", e.target.value)} />
              {erros.cargo ? <span className="field-error">{erros.cargo}</span> : null}
            </div>
          </div>
          <div className="row-2">
            <div className="field">
              <label htmlFor="email">E-mail comercial</label>
              <input
                id="email"
                type="email"
                value={dados.email}
                onChange={(e) => campo("email", e.target.value)}
              />
              {erros.email ? <span className="field-error">{erros.email}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Telefone / WhatsApp</label>
              <input
                id="whatsapp"
                value={dados.whatsapp}
                onChange={(e) => campo("whatsapp", formatarTelefone(e.target.value))}
              />
              {erros.whatsapp ? <span className="field-error">{erros.whatsapp}</span> : null}
            </div>
          </div>
          <div className="field">
            <label htmlFor="rotas">Região e rotas de operação</label>
            <textarea
              id="rotas"
              rows={3}
              placeholder="Ex.: BR-163, trechos MT–PA–RO"
              value={dados.rotas}
              onChange={(e) => campo("rotas", e.target.value)}
            />
            {erros.rotas ? <span className="field-error">{erros.rotas}</span> : null}
          </div>
        </fieldset>
      ) : null}

      {etapa === 2 ? (
        <fieldset className="proposta-bloco">
          <legend>Frota e perfil técnico</legend>
          <div className="row-2">
            <div className="field">
              <label htmlFor="quantidade">Quantidade total de veículos</label>
              <input
                id="quantidade"
                type="number"
                min={1}
                value={dados.quantidade}
                onChange={(e) => campo("quantidade", e.target.value)}
              />
              {erros.quantidade ? <span className="field-error">{erros.quantidade}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="faixa">Faixa de categoria / marca</label>
              <input
                id="faixa"
                placeholder="Texto livre — ex.: Mercedes Actros / faixa combinada"
                value={dados.faixa}
                onChange={(e) => campo("faixa", e.target.value)}
              />
            </div>
          </div>
          <p className="proposta-hint">
            A proposta descreve a frota em conjunto. Não é necessário cadastrar placa a placa.
          </p>
        </fieldset>
      ) : null}

      {etapa === 3 ? (
        <fieldset className="proposta-bloco">
          <legend>Vistoria inicial e condições de entrada</legend>
          <div className="field">
            <label htmlFor="valorVistoria">Valor da vistoria por veículo (R$)</label>
            <input
              id="valorVistoria"
              value={dados.valorVistoria}
              onChange={(e) => campo("valorVistoria", e.target.value)}
            />
            {erros.valorVistoria ? <span className="field-error">{erros.valorVistoria}</span> : null}
          </div>
          <label className="proposta-check">
            <input
              type="checkbox"
              checked={dados.aceiteVistoria}
              onChange={(e) => campo("aceiteVistoria", e.target.checked)}
            />
            Pagamento antecipado da vistoria como condição de ativação
          </label>
          {erros.aceiteVistoria ? <span className="field-error">{erros.aceiteVistoria}</span> : null}
          <div className="field">
            <label htmlFor="irregularidades">Checklist / irregularidades identificadas</label>
            <textarea
              id="irregularidades"
              rows={4}
              value={dados.irregularidades}
              onChange={(e) => campo("irregularidades", e.target.value)}
            />
          </div>
        </fieldset>
      ) : null}

      {etapa === 4 ? (
        <fieldset className="proposta-bloco">
          <legend>Escopo do plano</legend>
          <label className="proposta-check">
            <input
              type="checkbox"
              checked={dados.cobreScr}
              onChange={(e) => campo("cobreScr", e.target.checked)}
            />
            Peças críticas do sistema catalisador SCR / Arla 32 no escopo combinado
          </label>
          <div className="field">
            <label htmlFor="tipoMotor">Tipo de motor / anexos técnicos</label>
            <input
              id="tipoMotor"
              value={dados.tipoMotor}
              onChange={(e) => campo("tipoMotor", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="fluxoSocorro">Fluxo de assistência / socorro</label>
            <textarea
              id="fluxoSocorro"
              rows={5}
              value={dados.fluxoSocorro}
              onChange={(e) => campo("fluxoSocorro", e.target.value)}
            />
            {erros.fluxoSocorro ? <span className="field-error">{erros.fluxoSocorro}</span> : null}
          </div>
        </fieldset>
      ) : null}

      {etapa === 5 ? (
        <fieldset className="proposta-bloco">
          <legend>Serviços adicionais opcionais</legend>
          <label className="proposta-check">
            <input
              type="checkbox"
              checked={dados.alarmeModulo}
              onChange={(e) => campo("alarmeModulo", e.target.checked)}
            />
            Sistema de segurança para módulo (alarme antifurto)
          </label>
          <label className="proposta-check">
            <input
              type="checkbox"
              checked={dados.parafusosSegredo}
              onChange={(e) => campo("parafusosSegredo", e.target.checked)}
            />
            Parafusos de segredo (antifurto de rodas/componentes)
          </label>
        </fieldset>
      ) : null}

      {etapa === 6 ? (
        <fieldset className="proposta-bloco">
          <legend>Condições comerciais e vigência</legend>
          <div className="row-2">
            <div className="field">
              <label htmlFor="valorMensal">Valor mensal (R$)</label>
              <input
                id="valorMensal"
                value={dados.valorMensal}
                onChange={(e) => campo("valorMensal", e.target.value)}
              />
              {erros.valorMensal ? <span className="field-error">{erros.valorMensal}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="vigencia">Início de vigência</label>
              <input
                id="vigencia"
                inputMode="numeric"
                placeholder="dd/mm/aaaa"
                autoComplete="off"
                maxLength={10}
                value={dados.vigencia}
                onChange={(e) => campo("vigencia", formatarDataDigitada(e.target.value))}
              />
              {erros.vigencia ? <span className="field-error">{erros.vigencia}</span> : null}
            </div>
          </div>
          <label className="proposta-check">
            <input
              type="checkbox"
              checked={dados.aceitePreventiva}
              onChange={(e) => campo("aceitePreventiva", e.target.checked)}
            />
            Aceite do calendário de manutenções preventivas obrigatórias
          </label>
          {erros.aceitePreventiva ? (
            <span className="field-error">{erros.aceitePreventiva}</span>
          ) : null}
        </fieldset>
      ) : null}

      {mensagem ? (
        <p className={`form-msg${gerando ? "" : mensagem.includes("PDF gerado") ? " ok" : " err"}`}>
          {mensagem}
        </p>
      ) : null}

      <div className="proposta-actions">
        {etapa > 1 ? (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setMensagem("");
              setEtapa((e) => Math.max(1, e - 1) as typeof etapa);
            }}
          >
            Voltar
          </button>
        ) : null}
        <button type="submit" className="btn btn-primary" disabled={gerando}>
          {etapa < 6 ? "Continuar" : gerando ? "Gerando PDF..." : "Gerar PDF"}
        </button>
      </div>
    </form>
  );
}
