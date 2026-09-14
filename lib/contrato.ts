import { apenasDigitos, cnpjValido, formatarCnpj } from "./cnpj";
import { dataBrValida, formatarDataDigitada, paraDataBr } from "./proposta";

export const COTA_MINIMA_FROTA = 50;

export type VeiculoFrota = {
  placa: string;
  marcaModelo: string;
  ano: string;
  faixa: string;
  dataAtivacao: string;
};

export type DadosContrato = {
  empresaRazaoSocial: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  uf: string;
  cep: string;
  representanteNome: string;
  representanteCpf: string;
  dataAssinatura: string;
  testemunha1Nome: string;
  testemunha1Cpf: string;
  testemunha2Nome: string;
  testemunha2Cpf: string;
  veiculos: VeiculoFrota[];
};

export const VEICULO_FROTA_VAZIO: VeiculoFrota = {
  placa: "",
  marcaModelo: "",
  ano: "",
  faixa: "",
  dataAtivacao: "",
};

export const CONTRATO_VAZIO: DadosContrato = {
  empresaRazaoSocial: "",
  cnpj: "",
  endereco: "",
  cidade: "",
  uf: "",
  cep: "",
  representanteNome: "",
  representanteCpf: "",
  dataAssinatura: "",
  testemunha1Nome: "",
  testemunha1Cpf: "",
  testemunha2Nome: "",
  testemunha2Cpf: "",
  veiculos: [{ ...VEICULO_FROTA_VAZIO }],
};

/** Dados fictícios para conferir o PDF sem digitar a frota toda. A cota de 50 não bloqueia. */
export const CONTRATO_EXEMPLO: DadosContrato = {
  empresaRazaoSocial: "Transportadora Horizonte Norte Ltda",
  cnpj: "11.222.333/0001-81",
  endereco: "Avenida das Torres, 1500, Sala 12",
  cidade: "Sinop",
  uf: "MT",
  cep: "78550-142",
  representanteNome: "Carla Mendes da Silva",
  representanteCpf: "529.982.247-25",
  dataAssinatura: "15/03/2026",
  testemunha1Nome: "Paulo Henrique Costa",
  testemunha1Cpf: "390.533.447-05",
  testemunha2Nome: "",
  testemunha2Cpf: "",
  veiculos: [
    { placa: "QWE1A23", marcaModelo: "Volvo FH 540", ano: "2022", faixa: "A", dataAtivacao: "01/09/2026" },
    { placa: "RTY2B45", marcaModelo: "Scania R 450", ano: "2021", faixa: "B", dataAtivacao: "01/09/2026" },
    { placa: "UIO3C67", marcaModelo: "Mercedes-Benz Actros 2651", ano: "2023", faixa: "A", dataAtivacao: "15/09/2026" },
  ],
};

export type ErrosContrato = Partial<Record<keyof DadosContrato, string>> & {
  veiculosLinha?: string;
};

export function formatarCpf(valor: string): string {
  const digitos = apenasDigitos(valor).slice(0, 11);
  if (digitos.length <= 3) return digitos;
  if (digitos.length <= 6) return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
  if (digitos.length <= 9) return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
}

export function cpfValido(valor: string): boolean {
  const d = apenasDigitos(valor);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;
  const calc = (base: string, fator: number) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (fator - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  if (calc(d.slice(0, 9), 10) !== Number(d[9])) return false;
  return calc(d.slice(0, 10), 11) === Number(d[10]);
}

export function formatarCep(valor: string): string {
  const d = apenasDigitos(valor).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

const UFS = new Set([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]);

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** "Sinop/MT, 15 de março de 26" — formato do bloco de assinatura do v3.1. */
export function formatarDataAssinatura(dataBr: string): string {
  const m = paraDataBr(dataBr).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "Sinop/MT, ______ de __________________ de 20____.";
  const dia = String(Number(m[1]));
  const mes = MESES[Number(m[2]) - 1];
  const ano2 = m[3].slice(2);
  return `Sinop/MT, ${dia} de ${mes} de ${ano2}.`;
}

const UNIDADES = [
  "zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove",
  "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove",
];
const DEZENAS = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const CENTENAS = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

function extensoAte999(n: number): string {
  if (n < 20) return UNIDADES[n];
  if (n < 100) {
    const u = n % 10;
    return u === 0 ? DEZENAS[Math.floor(n / 10)] : `${DEZENAS[Math.floor(n / 10)]} e ${UNIDADES[u]}`;
  }
  if (n === 100) return "cem";
  const c = Math.floor(n / 100);
  const r = n % 100;
  return r === 0 ? CENTENAS[c] : `${CENTENAS[c]} e ${extensoAte999(r)}`;
}

export function numeroPorExtenso(n: number): string {
  if (!Number.isInteger(n) || n < 0) return String(n);
  if (n < 1000) return extensoAte999(n);
  if (n < 1_000_000) {
    const mil = Math.floor(n / 1000);
    const r = n % 1000;
    const prefixo = mil === 1 ? "mil" : `${extensoAte999(mil)} mil`;
    return r === 0 ? prefixo : `${prefixo} e ${extensoAte999(r)}`;
  }
  return String(n);
}

export function minutaAprovada(): boolean {
  return process.env.CONTRATO_MINUTA_APROVADA?.trim().toLowerCase() === "true";
}

export function validarContrato(dados: DadosContrato, etapa?: 1 | 2 | 3 | 4): ErrosContrato {
  const erros: ErrosContrato = {};
  const ate = etapa ?? 4;

  if (ate >= 1) {
    if (dados.empresaRazaoSocial.trim().length < 2) {
      erros.empresaRazaoSocial = "Informe a razão social.";
    }
    if (!cnpjValido(dados.cnpj)) erros.cnpj = "CNPJ inválido.";
    if (dados.endereco.trim().length < 5) erros.endereco = "Informe o endereço completo.";
    if (dados.cidade.trim().length < 2) erros.cidade = "Informe a cidade.";
    if (!UFS.has(dados.uf.trim().toUpperCase())) erros.uf = "Informe a UF.";
    if (apenasDigitos(dados.cep).length !== 8) erros.cep = "Informe o CEP com 8 dígitos.";
  }

  if (ate >= 2) {
    if (dados.representanteNome.trim().length < 2) {
      erros.representanteNome = "Informe o nome do representante legal.";
    }
    if (!cpfValido(dados.representanteCpf)) erros.representanteCpf = "CPF inválido.";
  }

  if (ate >= 3) {
    if (dados.veiculos.length < 1) {
      erros.veiculosLinha = "Inclua ao menos um veículo.";
    } else {
      const incompleto = dados.veiculos.some(
        (v) =>
          !v.placa.trim() ||
          !v.marcaModelo.trim() ||
          !v.ano.trim() ||
          !v.faixa.trim() ||
          !dataBrValida(v.dataAtivacao),
      );
      if (incompleto) {
        erros.veiculosLinha = "Preencha placa, marca/modelo, ano, faixa e data de ativação (dd/mm/aaaa) de cada veículo.";
      }
    }
  }

  if (ate >= 4) {
    if (!dataBrValida(dados.dataAssinatura)) {
      erros.dataAssinatura = "Informe a data de assinatura no formato dd/mm/aaaa.";
    }
    if (dados.testemunha1Nome.trim() && !cpfValido(dados.testemunha1Cpf)) {
      erros.testemunha1Cpf = "CPF da testemunha 1 inválido.";
    }
    if (dados.testemunha2Nome.trim() && !cpfValido(dados.testemunha2Cpf)) {
      erros.testemunha2Cpf = "CPF da testemunha 2 inválido.";
    }
    if (dados.testemunha1Cpf.trim() && !dados.testemunha1Nome.trim()) {
      erros.testemunha1Nome = "Informe o nome da testemunha 1.";
    }
    if (dados.testemunha2Cpf.trim() && !dados.testemunha2Nome.trim()) {
      erros.testemunha2Nome = "Informe o nome da testemunha 2.";
    }
  }

  return erros;
}

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor : valor == null ? "" : String(valor);
}

export function normalizarContrato(corpo: unknown): DadosContrato {
  const bruto = (corpo ?? {}) as Record<string, unknown>;
  const dados: DadosContrato = { ...CONTRATO_VAZIO, veiculos: [] };

  dados.empresaRazaoSocial = texto(bruto.empresaRazaoSocial);
  dados.cnpj = formatarCnpj(texto(bruto.cnpj));
  dados.endereco = texto(bruto.endereco);
  dados.cidade = texto(bruto.cidade);
  dados.uf = texto(bruto.uf).trim().toUpperCase().slice(0, 2);
  dados.cep = formatarCep(texto(bruto.cep));
  dados.representanteNome = texto(bruto.representanteNome);
  dados.representanteCpf = formatarCpf(texto(bruto.representanteCpf));
  dados.dataAssinatura = paraDataBr(texto(bruto.dataAssinatura));
  dados.testemunha1Nome = texto(bruto.testemunha1Nome);
  dados.testemunha1Cpf = formatarCpf(texto(bruto.testemunha1Cpf));
  dados.testemunha2Nome = texto(bruto.testemunha2Nome);
  dados.testemunha2Cpf = formatarCpf(texto(bruto.testemunha2Cpf));

  const lista = Array.isArray(bruto.veiculos) ? bruto.veiculos : [];
  dados.veiculos = lista.map((item) => {
    const v = (item ?? {}) as Record<string, unknown>;
    return {
      placa: texto(v.placa),
      marcaModelo: texto(v.marcaModelo),
      ano: apenasDigitos(texto(v.ano)).slice(0, 4),
      faixa: texto(v.faixa),
      dataAtivacao: paraDataBr(texto(v.dataAtivacao)),
    };
  });
  if (dados.veiculos.length === 0) dados.veiculos = [{ ...VEICULO_FROTA_VAZIO }];

  return dados;
}

export function linhaOuTraco(valor: string, vazio = "______________________"): string {
  const t = valor.trim();
  return t ? t : vazio;
}

export { formatarCnpj, formatarDataDigitada };
