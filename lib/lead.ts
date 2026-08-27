import { apenasDigitos, cnpjValido } from "./cnpj";

/**
 * Regioes aceitas no formulario.
 *
 * Nesta fase a operacao atende so o eixo BR-163 entre Mato Grosso e Rondonia.
 * "Outra regiao" continua sendo aceita, mas o lead vai marcado com fora_area
 * para o time comercial tratar como expansao futura.
 */
export const OPCOES_ROTA = [
  { valor: "br163-sinop", rotulo: "BR-163 — Sinop e região (MT)", foraDeArea: false },
  {
    valor: "br163-norte",
    rotulo: "BR-163 — norte do MT (Sorriso, Guarantã do Norte)",
    foraDeArea: false,
  },
  {
    valor: "br163-sul",
    rotulo: "BR-163 — sul do MT (Cuiabá, Nova Mutum)",
    foraDeArea: false,
  },
  {
    valor: "br364-ro",
    rotulo: "BR-364 — Rondônia (Vilhena, Ji-Paraná, Porto Velho)",
    foraDeArea: false,
  },
  { valor: "outra", rotulo: "Outra região", foraDeArea: true },
] as const;

export type ValorRota = (typeof OPCOES_ROTA)[number]["valor"];

export const OPCOES_PROBLEMA = [
  { valor: "paradas", rotulo: "Paradas inesperadas" },
  { valor: "preventiva", rotulo: "Preventiva desorganizada" },
  { valor: "orcamento", rotulo: "Orçamento de oficina" },
  { valor: "emissoes", rotulo: "ARLA/SCR/emissões" },
  { valor: "acompanhamento", rotulo: "Acompanhamento da frota" },
  { valor: "outro", rotulo: "Outro" },
] as const;

export type ValorProblema = (typeof OPCOES_PROBLEMA)[number]["valor"];

export type DadosLead = {
  nome: string;
  empresa: string;
  cnpj: string;
  whatsapp: string;
  email: string;
  veiculos: string;
  rota: string;
  /** Multiselect: um ou mais problemas operacionais. */
  problemas: string[];
  mensagem: string;
};

export const LEAD_VAZIO: DadosLead = {
  nome: "",
  empresa: "",
  cnpj: "",
  whatsapp: "",
  email: "",
  veiculos: "",
  rota: "",
  problemas: [],
  mensagem: "",
};

export function buscarRota(valor: string) {
  return OPCOES_ROTA.find((opcao) => opcao.valor === valor);
}

export function buscarProblema(valor: string) {
  return OPCOES_PROBLEMA.find((opcao) => opcao.valor === valor);
}

/** Aceita array ou string legada; devolve só valores conhecidos, sem duplicata. */
export function normalizarProblemas(valor: unknown): string[] {
  const bruto = Array.isArray(valor)
    ? valor
    : typeof valor === "string"
      ? valor.split(/[,;|]/).map((s) => s.trim())
      : [];

  const unicos = new Set<string>();
  for (const item of bruto) {
    if (typeof item !== "string") continue;
    const limpo = item.trim();
    if (buscarProblema(limpo)) unicos.add(limpo);
  }
  return [...unicos];
}

export function rotulosProblemas(valores: string[]): string {
  return valores
    .map((v) => buscarProblema(v)?.rotulo)
    .filter(Boolean)
    .join("; ");
}

/** Formata progressivamente: (66) 99999-0000 */
export function formatarTelefone(valor: string): string {
  const digitos = apenasDigitos(valor).slice(0, 11);

  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export type ErrosLead = Partial<Record<keyof DadosLead, string>>;

/**
 * Validacao usada no formulario e repetida na rota /api/lead, para o servidor
 * nao confiar no que chega do navegador.
 */
export function validarLead(dados: DadosLead, etapa?: 1 | 2): ErrosLead {
  const erros: ErrosLead = {};
  const validarTudo = etapa == null;

  if (validarTudo || etapa === 1) {
    const veiculos = Number(dados.veiculos);
    if (!Number.isInteger(veiculos) || veiculos < 1 || veiculos > 10000) {
      erros.veiculos = "Informe a quantidade de caminhões da frota.";
    }

    if (!buscarRota(dados.rota)) {
      erros.rota = "Selecione a região de operação da frota.";
    }

    if (!dados.problemas.length || dados.problemas.some((p) => !buscarProblema(p))) {
      erros.problemas = "Selecione ao menos um problema.";
    }
  }

  if (validarTudo || etapa === 2) {
    if (dados.nome.trim().length < 2) {
      erros.nome = "Informe seu nome.";
    }

    if (dados.empresa.trim().length < 2) {
      erros.empresa = "Informe o nome da empresa.";
    }

    if (dados.cnpj.trim() && !cnpjValido(dados.cnpj)) {
      erros.cnpj = "CNPJ inválido. Confira os números digitados.";
    }

    const digitosTelefone = apenasDigitos(dados.whatsapp);
    if (digitosTelefone.length < 10 || digitosTelefone.length > 11) {
      erros.whatsapp = "Informe o WhatsApp com DDD.";
    }

    const email = dados.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      erros.email = "Informe um e-mail válido.";
    }

    if (dados.mensagem.length > 1000) {
      erros.mensagem = "Mensagem muito longa (máximo de 1000 caracteres).";
    }
  }

  return erros;
}

/**
 * Campo isca contra robos de spam: fica escondido no formulario, entao so um
 * preenchedor automatico o completa. Vindo preenchido, a rota descarta o envio.
 */
export const CAMPO_ISCA = "website";

/** Formato normalizado do lead, usado para montar o e-mail. */
export type PayloadLead = {
  nome: string;
  empresa: string;
  cnpj: string;
  whatsapp: string;
  email: string;
  veiculos: number;
  rota: string;
  rota_label: string;
  fora_area: boolean;
  problemas: string[];
  problemas_label: string;
  mensagem: string;
  origem: string;
  data_envio: string;
};

export function montarPayload(dados: DadosLead): PayloadLead {
  const rota = buscarRota(dados.rota);
  const problemas = normalizarProblemas(dados.problemas);

  return {
    nome: dados.nome.trim(),
    empresa: dados.empresa.trim(),
    cnpj: apenasDigitos(dados.cnpj),
    whatsapp: dados.whatsapp.trim(),
    email: dados.email.trim(),
    veiculos: Number(dados.veiculos),
    rota: dados.rota,
    rota_label: rota?.rotulo ?? "",
    fora_area: rota?.foraDeArea ?? false,
    problemas,
    problemas_label: rotulosProblemas(problemas),
    mensagem: dados.mensagem.trim(),
    origem: "site-frotec",
    data_envio: new Date().toISOString(),
  };
}
