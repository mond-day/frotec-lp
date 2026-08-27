"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { formatarCnpj } from "@/lib/cnpj";
import {
  buscarRota,
  CAMPO_ISCA,
  formatarTelefone,
  LEAD_VAZIO,
  OPCOES_ROTA,
  validarLead,
  type DadosLead,
  type ErrosLead,
} from "@/lib/lead";

type Situacao = "parado" | "enviando" | "enviado" | "erro";

export default function LeadForm() {
  const [dados, setDados] = useState<DadosLead>(LEAD_VAZIO);
  const [isca, setIsca] = useState("");
  const [erros, setErros] = useState<ErrosLead>({});
  const [situacao, setSituacao] = useState<Situacao>("parado");
  const [mensagemEnvio, setMensagemEnvio] = useState("");

  const rotaSelecionada = buscarRota(dados.rota);
  const foraDeArea = rotaSelecionada?.foraDeArea ?? false;

  function alterar(campo: keyof DadosLead, valor: string) {
    setDados((anterior) => ({ ...anterior, [campo]: valor }));
    setErros((anterior) => ({ ...anterior, [campo]: undefined }));
  }

  function aoDigitar(campo: keyof DadosLead) {
    return (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      alterar(campo, evento.target.value);
  }

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

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

      setSituacao("enviado");
      setMensagemEnvio(
        foraDeArea
          ? "Recebemos seus dados. Sua região ainda não é atendida, mas o contato ficou registrado para a próxima expansão."
          : "Recebemos seus dados. Nosso time entra em contato para o diagnóstico gratuito da sua frota.",
      );
      setDados(LEAD_VAZIO);
    } catch {
      setSituacao("erro");
      setMensagemEnvio(
        "Não foi possível enviar agora. Tente novamente em instantes ou fale com a gente pelo WhatsApp.",
      );
    }
  }

  const enviando = situacao === "enviando";

  return (
    <form onSubmit={aoEnviar} noValidate>
      <div className="row-2">
        <div className="field">
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
        <div className="field">
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
        <div className="field">
          <label htmlFor="cnpj">CNPJ</label>
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
        <div className="field">
          <label htmlFor="veiculos">Caminhões na frota</label>
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
      </div>

      <div className="row-2">
        <div className="field">
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
        <div className="field">
          <label htmlFor="email">E-mail</label>
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

      <div className="field">
        <label htmlFor="rota">Rota / região de operação</label>
        <select
          id="rota"
          name="rota"
          value={dados.rota}
          onChange={aoDigitar("rota")}
          aria-invalid={Boolean(erros.rota)}
        >
          <option value="" disabled>
            Selecione onde a frota opera
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
          Nesta fase a Frotec atende apenas o corredor da BR-163, entre Mato Grosso e Rondônia.
          Você pode enviar seus dados mesmo assim — o contato fica registrado e avisamos assim que
          a operação chegar à sua região.
        </p>
      )}

      <div className="field">
        <label htmlFor="mensagem">Mensagem (opcional)</label>
        <textarea
          id="mensagem"
          name="mensagem"
          placeholder="Conte um pouco sobre a operação: tipo de carga, trechos mais rodados, principais dores da frota."
          value={dados.mensagem}
          onChange={aoDigitar("mensagem")}
          aria-invalid={Boolean(erros.mensagem)}
        />
        {erros.mensagem && <span className="field-error">{erros.mensagem}</span>}
      </div>

      {/* Fora da tela e fora da ordem de tabulacao: so um robo preenche. */}
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

      <button
        type="submit"
        className="btn btn-primary"
        style={{ marginTop: "8px" }}
        disabled={enviando}
      >
        {enviando ? "Enviando..." : "Quero Reduzir Meus Custos"}
      </button>

      <div
        className={`form-msg${situacao === "enviado" ? " ok" : ""}${situacao === "erro" ? " err" : ""}`}
        role="status"
        aria-live="polite"
      >
        {mensagemEnvio}
      </div>
    </form>
  );
}
