"use client";

import { useState, type FormEvent } from "react";
import {
  CONTRATO_EXEMPLO,
  CONTRATO_VAZIO,
  COTA_MINIMA_FROTA,
  VEICULO_FROTA_VAZIO,
  formatarCep,
  formatarCnpj,
  formatarCpf,
  formatarDataDigitada,
  validarContrato,
  type DadosContrato,
  type ErrosContrato,
  type VeiculoFrota,
} from "@/lib/contrato";

const ETAPAS = ["Cadastro", "Representante", "Frota", "Assinatura"] as const;

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const FAIXAS = ["A", "B", "C", "D"];

type LinhaVeiculo = VeiculoFrota & { chave: string };
type DadosFormContrato = Omit<DadosContrato, "veiculos"> & { veiculos: LinhaVeiculo[] };

function novaLinha(): LinhaVeiculo {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `v-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return { ...VEICULO_FROTA_VAZIO, chave: id };
}

function contratoInicial(): DadosFormContrato {
  return { ...CONTRATO_VAZIO, veiculos: [novaLinha()] };
}

export default function ContratoForm() {
  const [dados, setDados] = useState<DadosFormContrato>(contratoInicial);
  const [etapa, setEtapa] = useState<1 | 2 | 3 | 4>(1);
  const [erros, setErros] = useState<ErrosContrato>({});
  const [mensagem, setMensagem] = useState("");
  const [gerando, setGerando] = useState(false);

  function campo<K extends Exclude<keyof DadosContrato, "veiculos">>(nome: K, valor: DadosContrato[K]) {
    setDados((d) => ({ ...d, [nome]: valor }));
    setErros((e) => ({ ...e, [nome]: undefined }));
  }

  function veiculo(chave: string, nome: keyof VeiculoFrota, valor: string) {
    setDados((d) => ({
      ...d,
      veiculos: d.veiculos.map((item) =>
        item.chave === chave ? { ...item, [nome]: valor, chave: item.chave } : item,
      ),
    }));
    setErros((e) => ({ ...e, veiculosLinha: undefined }));
  }

  function adicionarVeiculo() {
    setDados((d) => ({ ...d, veiculos: [...d.veiculos, novaLinha()] }));
    setErros((e) => ({ ...e, veiculosLinha: undefined }));
  }

  function removerVeiculo(chave: string) {
    setDados((d) => {
      if (d.veiculos.length <= 1) return d;
      return { ...d, veiculos: d.veiculos.filter((item) => item.chave !== chave) };
    });
    setErros((e) => ({ ...e, veiculosLinha: undefined }));
  }

  function preencherExemplo() {
    setDados({
      ...CONTRATO_EXEMPLO,
      veiculos: CONTRATO_EXEMPLO.veiculos.map((item) => ({ ...item, chave: novaLinha().chave })),
    });
    setErros({});
    setMensagem("Exemplo com 3 veículos. A cota de 50 não impede gerar o PDF.");
    setEtapa(4);
  }

  function avancar() {
    const encontrados = validarContrato(dados, etapa);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      setMensagem("Revise os campos destacados antes de continuar.");
      return;
    }
    setMensagem("");
    setEtapa((e) => Math.min(4, e + 1) as typeof etapa);
  }

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    if (etapa < 4) {
      avancar();
      return;
    }
    const encontrados = validarContrato(dados);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      setMensagem("Revise os campos destacados antes de gerar o PDF.");
      return;
    }
    setGerando(true);
    setMensagem("");
    try {
      const resposta = await fetch("/api/propostas/gerar-contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dados,
          veiculos: dados.veiculos.map((item) => ({
            placa: item.placa,
            marcaModelo: item.marcaModelo,
            ano: item.ano,
            faixa: item.faixa,
            dataAtivacao: item.dataAtivacao,
          })),
        }),
      });
      if (!resposta.ok) {
        const corpo = (await resposta.json().catch(() => ({}))) as { erro?: string };
        throw new Error(corpo.erro ?? "Falha ao gerar PDF");
      }
      const blob = await resposta.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const slug = dados.empresaRazaoSocial
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40);
      a.href = url;
      a.download = `contrato-frotec-${slug || "empresa"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setMensagem("PDF gerado. O download deve ter iniciado.");
    } catch (erro) {
      setMensagem(erro instanceof Error ? erro.message : "Não foi possível gerar o PDF.");
    } finally {
      setGerando(false);
    }
  }

  const abaixoDaCota = dados.veiculos.length < COTA_MINIMA_FROTA;

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
          <legend>Contratante</legend>
          <div className="field">
            <label htmlFor="empresaRazaoSocial">Razão social</label>
            <input
              id="empresaRazaoSocial"
              value={dados.empresaRazaoSocial}
              onChange={(e) => campo("empresaRazaoSocial", e.target.value)}
            />
            {erros.empresaRazaoSocial ? <span className="field-error">{erros.empresaRazaoSocial}</span> : null}
          </div>
          <div className="field">
            <label htmlFor="cnpj">CNPJ</label>
            <input
              id="cnpj"
              inputMode="numeric"
              autoComplete="off"
              value={dados.cnpj}
              onChange={(e) => campo("cnpj", formatarCnpj(e.target.value))}
            />
            {erros.cnpj ? <span className="field-error">{erros.cnpj}</span> : null}
          </div>
          <div className="field">
            <label htmlFor="endereco">Endereço</label>
            <input
              id="endereco"
              value={dados.endereco}
              onChange={(e) => campo("endereco", e.target.value)}
            />
            {erros.endereco ? <span className="field-error">{erros.endereco}</span> : null}
          </div>
          <div className="row-2">
            <div className="field">
              <label htmlFor="cidade">Cidade</label>
              <input id="cidade" value={dados.cidade} onChange={(e) => campo("cidade", e.target.value)} />
              {erros.cidade ? <span className="field-error">{erros.cidade}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="uf">UF</label>
              <select id="uf" value={dados.uf} onChange={(e) => campo("uf", e.target.value)}>
                <option value="">Selecione</option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
              {erros.uf ? <span className="field-error">{erros.uf}</span> : null}
            </div>
          </div>
          <div className="field">
            <label htmlFor="cep">CEP</label>
            <input
              id="cep"
              inputMode="numeric"
              autoComplete="off"
              maxLength={9}
              value={dados.cep}
              onChange={(e) => campo("cep", formatarCep(e.target.value))}
            />
            {erros.cep ? <span className="field-error">{erros.cep}</span> : null}
          </div>
        </fieldset>
      ) : null}

      {etapa === 2 ? (
        <fieldset className="proposta-bloco">
          <legend>Representante legal</legend>
          <div className="field">
            <label htmlFor="representanteNome">Nome</label>
            <input
              id="representanteNome"
              value={dados.representanteNome}
              onChange={(e) => campo("representanteNome", e.target.value)}
            />
            {erros.representanteNome ? <span className="field-error">{erros.representanteNome}</span> : null}
          </div>
          <div className="field">
            <label htmlFor="representanteCpf">CPF</label>
            <input
              id="representanteCpf"
              inputMode="numeric"
              autoComplete="off"
              value={dados.representanteCpf}
              onChange={(e) => campo("representanteCpf", formatarCpf(e.target.value))}
            />
            {erros.representanteCpf ? <span className="field-error">{erros.representanteCpf}</span> : null}
          </div>
        </fieldset>
      ) : null}

      {etapa === 3 ? (
        <fieldset className="proposta-bloco">
          <legend>Frota — Anexo I</legend>
          <p className="proposta-hint">
            Cada linha vira um veículo no Anexo I. A cota mínima da Cláusula 3.1 é {COTA_MINIMA_FROTA} veículos;
            o aviso abaixo não impede gerar o PDF.
          </p>
          {dados.veiculos.map((item, i) => (
            <div className="proposta-veiculo" key={item.chave}>
              <div className="proposta-veiculo-head">
                <strong>Veículo {i + 1}</strong>
                <button
                  type="button"
                  className="btn btn-ghost proposta-veiculo-remover"
                  disabled={dados.veiculos.length <= 1}
                  onClick={(evento) => {
                    evento.preventDefault();
                    evento.stopPropagation();
                    removerVeiculo(item.chave);
                  }}
                >
                  Remover
                </button>
              </div>
              <div className="proposta-veiculo-grid">
                <div className="field">
                  <label htmlFor={`placa-${item.chave}`}>Placa</label>
                  <input
                    id={`placa-${item.chave}`}
                    value={item.placa}
                    onChange={(e) => veiculo(item.chave, "placa", e.target.value.toUpperCase())}
                  />
                </div>
                <div className="field">
                  <label htmlFor={`marca-${item.chave}`}>Marca / modelo</label>
                  <input
                    id={`marca-${item.chave}`}
                    value={item.marcaModelo}
                    onChange={(e) => veiculo(item.chave, "marcaModelo", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor={`ano-${item.chave}`}>Ano</label>
                  <input
                    id={`ano-${item.chave}`}
                    inputMode="numeric"
                    maxLength={4}
                    value={item.ano}
                    onChange={(e) => veiculo(item.chave, "ano", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  />
                </div>
                <div className="field">
                  <label htmlFor={`faixa-${item.chave}`}>Faixa</label>
                  <select
                    id={`faixa-${item.chave}`}
                    value={item.faixa}
                    onChange={(e) => veiculo(item.chave, "faixa", e.target.value)}
                  >
                    <option value="">Selecione</option>
                    {FAIXAS.map((faixa) => (
                      <option key={faixa} value={faixa}>
                        {faixa}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor={`ativacao-${item.chave}`}>Data de ativação</label>
                  <input
                    id={`ativacao-${item.chave}`}
                    inputMode="numeric"
                    placeholder="dd/mm/aaaa"
                    autoComplete="off"
                    maxLength={10}
                    value={item.dataAtivacao}
                    onChange={(e) => veiculo(item.chave, "dataAtivacao", formatarDataDigitada(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
          {erros.veiculosLinha ? <span className="field-error">{erros.veiculosLinha}</span> : null}
          {abaixoDaCota ? (
            <p className="proposta-warn">
              A frota tem {dados.veiculos.length} veículo(s). A Cláusula 3.1 pede no mínimo {COTA_MINIMA_FROTA}.
              Você ainda pode gerar a minuta.
            </p>
          ) : null}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={(evento) => {
              evento.preventDefault();
              evento.stopPropagation();
              adicionarVeiculo();
            }}
          >
            Adicionar veículo
          </button>
        </fieldset>
      ) : null}

      {etapa === 4 ? (
        <fieldset className="proposta-bloco">
          <legend>Assinatura e testemunhas</legend>
          <div className="field">
            <label htmlFor="dataAssinatura">Data de assinatura</label>
            <input
              id="dataAssinatura"
              inputMode="numeric"
              placeholder="dd/mm/aaaa"
              autoComplete="off"
              maxLength={10}
              value={dados.dataAssinatura}
              onChange={(e) => campo("dataAssinatura", formatarDataDigitada(e.target.value))}
            />
            {erros.dataAssinatura ? <span className="field-error">{erros.dataAssinatura}</span> : null}
            <p className="proposta-hint">No PDF aparece como Sinop/MT, dia de mês de ano (dois dígitos).</p>
          </div>
          <div className="row-2">
            <div className="field">
              <label htmlFor="testemunha1Nome">Testemunha 1 — nome (opcional)</label>
              <input
                id="testemunha1Nome"
                value={dados.testemunha1Nome}
                onChange={(e) => campo("testemunha1Nome", e.target.value)}
              />
              {erros.testemunha1Nome ? <span className="field-error">{erros.testemunha1Nome}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="testemunha1Cpf">Testemunha 1 — CPF</label>
              <input
                id="testemunha1Cpf"
                inputMode="numeric"
                autoComplete="off"
                value={dados.testemunha1Cpf}
                onChange={(e) => campo("testemunha1Cpf", formatarCpf(e.target.value))}
              />
              {erros.testemunha1Cpf ? <span className="field-error">{erros.testemunha1Cpf}</span> : null}
            </div>
          </div>
          <div className="row-2">
            <div className="field">
              <label htmlFor="testemunha2Nome">Testemunha 2 — nome (opcional)</label>
              <input
                id="testemunha2Nome"
                value={dados.testemunha2Nome}
                onChange={(e) => campo("testemunha2Nome", e.target.value)}
              />
              {erros.testemunha2Nome ? <span className="field-error">{erros.testemunha2Nome}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="testemunha2Cpf">Testemunha 2 — CPF</label>
              <input
                id="testemunha2Cpf"
                inputMode="numeric"
                autoComplete="off"
                value={dados.testemunha2Cpf}
                onChange={(e) => campo("testemunha2Cpf", formatarCpf(e.target.value))}
              />
              {erros.testemunha2Cpf ? <span className="field-error">{erros.testemunha2Cpf}</span> : null}
            </div>
          </div>
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
        <button type="button" className="btn btn-ghost" onClick={preencherExemplo}>
          Preencher exemplo
        </button>
        <button type="submit" className="btn btn-primary" disabled={gerando}>
          {etapa < 4 ? "Continuar" : gerando ? "Gerando PDF..." : "Gerar PDF"}
        </button>
      </div>
    </form>
  );
}
