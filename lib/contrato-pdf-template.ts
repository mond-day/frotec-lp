import { readFileSync } from "node:fs";
import { join } from "node:path";
import { htmlAnexosFixos } from "./contrato-pdf-anexos";
import { htmlCorpoContratoB } from "./contrato-pdf-clausulas-b";
import { htmlCorpoContratoC } from "./contrato-pdf-clausulas-c";
import { htmlCorpoContrato } from "./contrato-pdf-clausulas";
import {
  formatarDataAssinatura,
  linhaOuTraco,
  minutaAprovada,
  numeroPorExtenso,
  type DadosContrato,
} from "./contrato";

function escapar(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pngDataUri(caminho: string): string {
  try {
    const bytes = readFileSync(caminho);
    return `data:image/png;base64,${bytes.toString("base64")}`;
  } catch {
    return "";
  }
}

function logoSrc(): string {
  return pngDataUri(join(process.cwd(), "public", "frotec-logo.png"));
}

function cssContrato(comMarcaDagua: boolean): string {
  return `
    @page { size: A4; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      color: #1a1c1e;
      font-family: Georgia, "Times New Roman", Times, serif;
      font-size: 11pt;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc { margin: 0; }
    table.jur thead { display: table-header-group; }
    table.jur tr { break-inside: avoid; page-break-inside: avoid; }
    h1 {
      font-size: 13.5pt;
      font-weight: 700;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      margin: 0 0 6px;
      line-height: 1.3;
    }
    .versao {
      text-align: center;
      font-size: 10.5pt;
      font-weight: 700;
      margin: 0 0 2px;
    }
    .aviso-minuta {
      text-align: center;
      font-size: 9.5pt;
      font-weight: 700;
      letter-spacing: 0.04em;
      margin: 0 0 12px;
    }
    .provisorio, .preambulo {
      text-align: justify;
      margin: 0 0 10px;
    }
    h2 {
      font-size: 11.5pt;
      font-weight: 700;
      text-transform: uppercase;
      margin: 16px 0 8px;
      page-break-after: avoid;
    }
    h3 {
      font-size: 11pt;
      font-weight: 700;
      margin: 12px 0 6px;
      page-break-after: avoid;
    }
    p {
      margin: 0 0 8px;
      text-align: justify;
    }
    table.jur, table.anexo-i {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 12px;
      font-size: 9pt;
      line-height: 1.3;
    }
    table.jur th, table.jur td,
    table.anexo-i th, table.anexo-i td {
      border: 1px solid #2a2e32;
      padding: 5px 6px;
      vertical-align: top;
      text-align: left;
    }
    table.jur th, table.anexo-i th {
      background: #eef3f1;
      font-family: Georgia, "Times New Roman", Times, serif;
      font-weight: 700;
    }
    table.anexo-i thead { display: table-header-group; }
    table.anexo-i tr { break-inside: avoid; page-break-inside: avoid; }
    .bloco-assina {
      margin-top: 22px;
      page-break-inside: avoid;
    }
    .assina-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 22px 28px;
      margin-top: 28px;
    }
    .assina-parte { text-align: center; font-size: 10pt; }
    .assina-linha {
      border-bottom: 1px solid #1a1c1e;
      min-height: 28px;
      margin-bottom: 6px;
    }
    .testemunhas { margin-top: 28px; font-size: 10pt; }
    .testemunhas p { text-align: left; margin: 10px 0; }
    ${
      comMarcaDagua
        ? `
    body::before {
      content: "MINUTA — NÃO VALIDADA JURIDICAMENTE";
      position: fixed;
      top: 42%;
      left: -8%;
      width: 120%;
      text-align: center;
      font-size: 28pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #1a1c1e;
      opacity: 0.07;
      transform: rotate(-32deg);
      z-index: 0;
      pointer-events: none;
    }
    .doc { position: relative; z-index: 1; }
    `
        : ""
    }
  `;
}

function htmlPreambulo(dados: DadosContrato): string {
  const razao = escapar(linhaOuTraco(dados.empresaRazaoSocial, "[RAZÃO SOCIAL DA TRANSPORTADORA]"));
  const cnpj = escapar(linhaOuTraco(dados.cnpj, "[•]"));
  const endereco = escapar(linhaOuTraco(dados.endereco, "[endereço completo]"));
  const cidade = escapar(linhaOuTraco(dados.cidade, "[cidade]"));
  const uf = escapar(linhaOuTraco(dados.uf, "[UF]"));
  const cep = escapar(linhaOuTraco(dados.cep, "[•]"));

  return `
    <h1>Contrato de prestação de serviços técnicos continuados de gestão de frota e manutenção de sistemas ARLA 32 / SCR</h1>
    <p class="versao">VERSÃO 3.1</p>
    <p class="aviso-minuta">VERSÃO PRELIMINAR PARA VALIDAÇÃO JURÍDICA</p>
    <p class="provisorio">Os valores monetários, os limites técnicos por componente, a relação de componentes abrangidos e a delimitação da Área Operacional constantes desta minuta e de seus Anexos são PROVISÓRIOS e devem ser substituídos pelos valores e parâmetros efetivos antes de qualquer uso comercial.</p>
    <p class="provisorio">Esta minuta constitui insumo técnico organizado e não substitui análise por advogado. Permanece indispensável a validação por profissional habilitado, em especial quanto ao enquadramento regulatório tratado na Cláusula 2ª, ao fluxo tributário da Cláusula 15ª e à limitação de responsabilidade da Cláusula 26ª. Permanecem pendentes, ainda, o preenchimento integral do Anexo VI e a celebração do Contrato de Credenciamento da Rede.</p>
    <p class="preambulo"><strong>CONTRATADA:</strong> FROTEC GESTÃO TÉCNICA DE FROTAS LTDA, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 00.000.000/0001-00, com sede na [endereço completo], Sinop/MT, CEP [•], neste ato representada na forma de seu contrato social, doravante denominada simplesmente "FROTEC".</p>
    <p class="preambulo"><strong>CONTRATANTE:</strong> ${razao}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${cnpj}, com sede na ${endereco}, ${cidade}/${uf}, CEP ${cep}, neste ato representada na forma de seus atos constitutivos, doravante denominada simplesmente "CONTRATANTE".</p>
    <p class="preambulo">FROTEC e CONTRATANTE, quando referidas em conjunto, serão denominadas "Partes" e, isoladamente, "Parte".</p>
    <p class="preambulo">As Partes, sociedades empresárias no exercício de suas atividades econômicas, resolvem celebrar o presente Contrato, que se regerá pelas cláusulas e condições a seguir.</p>
  `;
}

function htmlAnexoI(dados: DadosContrato): string {
  const linhas = dados.veiculos
    .map((v) => {
      return `<tr>
        <td>${escapar(v.placa.trim())}</td>
        <td>${escapar(v.marcaModelo.trim())}</td>
        <td>${escapar(v.ano.trim())}</td>
        <td>${escapar(v.faixa.trim())}</td>
        <td>${escapar(v.dataAtivacao.trim())}</td>
      </tr>`;
    })
    .join("");
  const n = dados.veiculos.length;
  return `
    <h2>ANEXO I — FROTA ADERIDA</h2>
    <p>O Anexo I corresponde ao cadastro da Frota Aderida mantido na Plataforma. A relação constante da data da assinatura constitui seu estado inicial, e as inclusões, exclusões, substituições, classificações e Ativações posteriores serão formalizadas eletronicamente, na forma da Cláusula 17ª, dispensada a celebração de aditivo individual.</p>
    <p>As alterações do cadastro são registradas em histórico imutável, na forma dos itens 17.2.1 a 17.2.3, acessível à CONTRATANTE a qualquer tempo.</p>
    <h3>ESTADO INICIAL NA DATA DA ASSINATURA</h3>
    <table class="anexo-i">
      <thead>
        <tr>
          <th>Placa</th>
          <th>Marca / Modelo</th>
          <th>Ano</th>
          <th>Faixa</th>
          <th>Data de Ativação</th>
        </tr>
      </thead>
      <tbody>${linhas}</tbody>
    </table>
    <p>Quantidade total de veículos ativos: ${n} (${numeroPorExtenso(n)}) (mínimo de 50, conforme Cláusula 3ª).</p>
  `;
}

function htmlAssinatura(dados: DadosContrato): string {
  const razao = escapar(linhaOuTraco(dados.empresaRazaoSocial, "[RAZÃO SOCIAL DA CONTRATANTE]"));
  const nomeRep = escapar(dados.representanteNome.trim());
  const cpfRep = escapar(linhaOuTraco(dados.representanteCpf, "______________________"));
  const t1Nome = escapar(linhaOuTraco(dados.testemunha1Nome, "___________________________________"));
  const t1Cpf = escapar(linhaOuTraco(dados.testemunha1Cpf, "______________________"));
  const t2Nome = escapar(linhaOuTraco(dados.testemunha2Nome, "___________________________________"));
  const t2Cpf = escapar(linhaOuTraco(dados.testemunha2Cpf, "______________________"));
  const data = escapar(formatarDataAssinatura(dados.dataAssinatura));

  return `
    <div class="bloco-assina">
      <p>E, por estarem assim justas e contratadas, as Partes firmam o presente instrumento, em via eletrônica, na presença das testemunhas abaixo.</p>
      <p>${data}</p>
      <div class="assina-grid">
        <div class="assina-parte">
          <div class="assina-linha"></div>
          <p>FROTEC GESTÃO TÉCNICA DE FROTAS LTDA</p>
          <p>Representante legal — CPF: ______________________</p>
        </div>
        <div class="assina-parte">
          <div class="assina-linha">${nomeRep}</div>
          <p>${razao}</p>
          <p>Representante legal — CPF: ${cpfRep}</p>
        </div>
      </div>
      <div class="testemunhas">
        <p><strong>TESTEMUNHAS:</strong></p>
        <p>1. ${t1Nome} &nbsp;&nbsp; CPF: ${t1Cpf}</p>
        <p>2. ${t2Nome} &nbsp;&nbsp; CPF: ${t2Cpf}</p>
      </div>
    </div>
  `;
}

export function templatesCabecalhoRodapeContrato(): {
  cabecalhoHtml: string;
  rodapeHtml: string;
} {
  const logo = logoSrc();
  const img = logo
    ? `<img src="${logo}" alt="Frotec" style="height:15px;width:auto;" />`
    : `<span style="font-family:Georgia,serif;font-size:10px;font-weight:700;">Frotec</span>`;

  return {
    cabecalhoHtml: `<div style="width:100%;padding:8px 16mm 0;box-sizing:border-box;">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2.5px solid #10e1b1;padding-bottom:5px;">
        ${img}
        <span style="font-family:Georgia,'Times New Roman',serif;font-size:8px;color:#4a4f55;">Contrato de adesão</span>
      </div>
    </div>`,
    rodapeHtml: `<div style="width:100%;padding:0 16mm 8px;box-sizing:border-box;">
      <div style="display:flex;justify-content:space-between;align-items:center;border-top:2.5px solid #10e1b1;padding-top:4px;font-family:Georgia,'Times New Roman',serif;font-size:8px;color:#4a4f55;">
        <span>Frotec Gestão Técnica de Frotas</span>
        <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
      </div>
    </div>`,
  };
}

export function montarHtmlContrato(dados: DadosContrato): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Contrato Frotec</title>
  <style>${cssContrato(!minutaAprovada())}</style>
</head>
<body>
  <div class="doc">
    ${htmlPreambulo(dados)}
    ${htmlCorpoContrato()}
    ${htmlCorpoContratoB()}
    ${htmlCorpoContratoC()}
    ${htmlAssinatura(dados)}
    ${htmlAnexoI(dados)}
    ${htmlAnexosFixos()}
  </div>
</body>
</html>`;
}
