import { formatarTelefone } from "./lead";

export const VISTORIA_PADRAO = "350";

export const SOCORRO_PADRAO =
  "Em caso de parada, o gestor aciona a central Frotec pelo WhatsApp. A central aciona a rede credenciada no corredor, audita diagnóstico e orçamento e autoriza a execução. Fora da área de atendimento, o atendimento é orçado à parte, com aprovação prévia.";

export type DadosProposta = {
  empresa: string;
  responsavel: string;
  cargo: string;
  email: string;
  whatsapp: string;
  rotas: string;
  quantidade: string;
  faixa: string;
  valorVistoria: string;
  aceiteVistoria: boolean;
  irregularidades: string;
  cobreScr: boolean;
  tipoMotor: string;
  fluxoSocorro: string;
  alarmeModulo: boolean;
  parafusosSegredo: boolean;
  valorMensal: string;
  vigencia: string;
  aceitePreventiva: boolean;
};

export const PROPOSTA_VAZIA: DadosProposta = {
  empresa: "",
  responsavel: "",
  cargo: "",
  email: "",
  whatsapp: "",
  rotas: "",
  quantidade: "",
  faixa: "",
  valorVistoria: VISTORIA_PADRAO,
  aceiteVistoria: false,
  irregularidades: "",
  cobreScr: false,
  tipoMotor: "",
  fluxoSocorro: SOCORRO_PADRAO,
  alarmeModulo: false,
  parafusosSegredo: false,
  valorMensal: "",
  vigencia: "",
  aceitePreventiva: false,
};

export type ErrosProposta = Partial<Record<keyof DadosProposta, string>>;

function dinheiroValido(valor: string): boolean {
  const n = Number(String(valor).replace(",", "."));
  return Number.isFinite(n) && n >= 0;
}

/** Máscara progressiva: dd/mm/aaaa */
export function formatarDataDigitada(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

/** Converte yyyy-mm-dd (ou texto digitado) para dd/mm/yyyy. */
export function paraDataBr(valor: string): string {
  const t = valor.trim();
  if (!t) return "";
  const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  return formatarDataDigitada(t);
}

function calendarioValido(dia: number, mes: number, ano: number): boolean {
  if (ano < 2000 || ano > 2100) return false;
  const data = new Date(ano, mes - 1, dia);
  return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

export function dataBrValida(valor: string): boolean {
  const br = paraDataBr(valor);
  const m = br.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  return calendarioValido(Number(m[1]), Number(m[2]), Number(m[3]));
}

/** Sempre dd/mm/yyyy. Aceita Date, yyyy-mm-dd ou dd/mm/yyyy. */
export function formatarDataBr(valor: string | Date): string {
  if (valor instanceof Date) {
    const partes = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Cuiaba",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).formatToParts(valor);
    const dia = partes.find((p) => p.type === "day")?.value ?? "";
    const mes = partes.find((p) => p.type === "month")?.value ?? "";
    const ano = partes.find((p) => p.type === "year")?.value ?? "";
    return `${dia}/${mes}/${ano}`;
  }
  return paraDataBr(valor) || "—";
}

export function validarProposta(dados: DadosProposta, etapa?: 1 | 2 | 3 | 4 | 5 | 6): ErrosProposta {
  const erros: ErrosProposta = {};
  const ate = etapa ?? 6;

  if (ate >= 1) {
    if (dados.empresa.trim().length < 2) erros.empresa = "Informe a razão social ou o nome da empresa.";
    if (dados.responsavel.trim().length < 2) erros.responsavel = "Informe o responsável.";
    if (dados.cargo.trim().length < 2) erros.cargo = "Informe o cargo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(dados.email.trim())) {
      erros.email = "Informe um e-mail válido.";
    }
    const tel = dados.whatsapp.replace(/\D/g, "");
    if (tel.length < 10 || tel.length > 11) erros.whatsapp = "Informe o WhatsApp com DDD.";
    if (dados.rotas.trim().length < 2) erros.rotas = "Informe a região e as rotas de operação.";
  }

  if (ate >= 2) {
    const qtd = Number(dados.quantidade);
    if (!Number.isInteger(qtd) || qtd < 1 || qtd > 10000) {
      erros.quantidade = "Informe a quantidade de veículos.";
    }
  }

  if (ate >= 3) {
    if (!dinheiroValido(dados.valorVistoria)) erros.valorVistoria = "Informe o valor da vistoria.";
    if (!dados.aceiteVistoria) {
      erros.aceiteVistoria = "A vistoria antecipada é condição de ativação.";
    }
  }

  if (ate >= 4) {
    if (dados.fluxoSocorro.trim().length < 10) {
      erros.fluxoSocorro = "Descreva o fluxo de assistência.";
    }
  }

  if (ate >= 6) {
    if (!dinheiroValido(dados.valorMensal) || Number(String(dados.valorMensal).replace(",", ".")) <= 0) {
      erros.valorMensal = "Informe o valor mensal.";
    }
    if (!dataBrValida(dados.vigencia)) {
      erros.vigencia = "Informe a data de vigência no formato dd/mm/aaaa.";
    }
    if (!dados.aceitePreventiva) {
      erros.aceitePreventiva = "O calendário de preventivas é condição do plano.";
    }
  }

  return erros;
}

export function normalizarProposta(corpo: unknown): DadosProposta {
  const bruto = (corpo ?? {}) as Record<string, unknown>;
  const dados: DadosProposta = {
    ...PROPOSTA_VAZIA,
    aceiteVistoria: Boolean(bruto.aceiteVistoria),
    cobreScr: Boolean(bruto.cobreScr),
    alarmeModulo: Boolean(bruto.alarmeModulo),
    parafusosSegredo: Boolean(bruto.parafusosSegredo),
    aceitePreventiva: Boolean(bruto.aceitePreventiva),
  };

  const textos: (keyof DadosProposta)[] = [
    "empresa",
    "responsavel",
    "cargo",
    "email",
    "whatsapp",
    "rotas",
    "quantidade",
    "faixa",
    "valorVistoria",
    "irregularidades",
    "tipoMotor",
    "fluxoSocorro",
    "valorMensal",
    "vigencia",
  ];
  for (const campo of textos) {
    const valor = bruto[campo];
    dados[campo] = (typeof valor === "string" ? valor : valor == null ? "" : String(valor)) as never;
  }

  dados.whatsapp = formatarTelefone(dados.whatsapp);
  dados.vigencia = paraDataBr(dados.vigencia);
  return dados;
}

export function formatarMoeda(valor: string): string {
  const n = Number(String(valor).replace(",", "."));
  if (!Number.isFinite(n)) return valor;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
