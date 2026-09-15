import { formatarTelefone } from "./lead";

export const VISTORIA_PADRAO = "340";

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
  valorMensal: string;
  vigencia: string;
  validadeDias: string;
  dataProposta: string;
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
  valorMensal: "",
  vigencia: "",
  validadeDias: "",
  dataProposta: "",
};

export type ErrosProposta = Partial<Record<keyof DadosProposta, string>>;

export type EtapaProposta = 1 | 2 | 3 | 4;

function dinheiroValido(valor: string): boolean {
  const n = Number(String(valor).replace(",", "."));
  return Number.isFinite(n) && n >= 0;
}

export function numeroDinheiro(valor: string): number {
  return Number(String(valor).replace(",", "."));
}

export function totalMensalFrota(quantidade: string, valorMensal: string): number {
  return Number(quantidade) * numeroDinheiro(valorMensal);
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

export function validarProposta(dados: DadosProposta, etapa?: EtapaProposta): ErrosProposta {
  const erros: ErrosProposta = {};
  const ate = etapa ?? 4;

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
    if (!dinheiroValido(dados.valorMensal) || numeroDinheiro(dados.valorMensal) <= 0) {
      erros.valorMensal = "Informe o valor mensal por veículo.";
    }
    if (!dataBrValida(dados.vigencia)) {
      erros.vigencia = "Informe a data de vigência no formato dd/mm/aaaa.";
    }
    const validade = dados.validadeDias.trim();
    if (validade) {
      const dias = Number(validade);
      if (!Number.isInteger(dias) || dias < 1 || dias > 365) {
        erros.validadeDias = "Informe a validade em dias (1 a 365) ou deixe em branco.";
      }
    }
  }

  return erros;
}

export function normalizarProposta(corpo: unknown): DadosProposta {
  const bruto = (corpo ?? {}) as Record<string, unknown>;
  const dados: DadosProposta = {
    ...PROPOSTA_VAZIA,
    aceiteVistoria: Boolean(bruto.aceiteVistoria),
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
    "valorMensal",
    "vigencia",
    "validadeDias",
    "dataProposta",
  ];
  for (const campo of textos) {
    const valor = bruto[campo];
    dados[campo] = (typeof valor === "string" ? valor : valor == null ? "" : String(valor)) as never;
  }

  dados.whatsapp = formatarTelefone(dados.whatsapp);
  dados.vigencia = paraDataBr(dados.vigencia);
  dados.dataProposta = paraDataBr(dados.dataProposta);
  dados.validadeDias = dados.validadeDias.replace(/\D/g, "").slice(0, 3);
  return dados;
}

export function formatarMoeda(valor: string | number): string {
  const n = typeof valor === "number" ? valor : numeroDinheiro(valor);
  if (!Number.isFinite(n)) return String(valor);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
