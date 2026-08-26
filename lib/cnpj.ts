/** Mascara e validacao de CNPJ, sem dependencia externa. */

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Formata progressivamente enquanto o usuario digita: 00.000.000/0000-00 */
export function formatarCnpj(valor: string): string {
  const digitos = apenasDigitos(valor).slice(0, 14);

  return digitos
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
}

/** Calcula um digito verificador do CNPJ a partir dos pesos da posicao. */
function digitoVerificador(base: string, pesos: number[]): number {
  const soma = pesos.reduce((total, peso, indice) => total + Number(base[indice]) * peso, 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function cnpjValido(valor: string): boolean {
  const digitos = apenasDigitos(valor);

  if (digitos.length !== 14) return false;
  // Sequencias como 00000000000000 passam no calculo, mas nao existem.
  if (/^(\d)\1{13}$/.test(digitos)) return false;

  const primeiro = digitoVerificador(digitos, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const segundo = digitoVerificador(digitos, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return primeiro === Number(digitos[12]) && segundo === Number(digitos[13]);
}
