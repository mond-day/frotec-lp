/**
 * Corredor de atuacao desenhado no mapa da secao "Onde atuamos".
 *
 * Base em Sinop/MT. O eixo principal e a BR-163 (Rondonopolis <-> Miritituba/PA),
 * passando por Cuiaba e Sinop. O ramal ate Rondonia usa a BR-364
 * (Cuiaba <-> Vilhena).
 *
 * As coordenadas sao aproximadas, so para desenhar a rota — nao sao usadas para
 * nenhum calculo. Para ajustar o corredor, edite apenas este arquivo.
 */

export type Ponto = [latitude: number, longitude: number];

export const SEDE = {
  nome: "Sinop, MT",
  descricao: "Sede da operação Frotec",
  coords: [-11.8642, -55.5025] as Ponto,
};

export const PONTO_RONDONOPOLIS: Ponto = [-16.4703, -54.6356];
export const PONTO_CUIABA: Ponto = [-15.6014, -56.0979];
export const PONTO_NOVO_PROGRESSO: Ponto = [-7.1439, -55.3825];
export const PONTO_MIRITITUBA: Ponto = [-4.276, -55.955];

/** Eixo principal: BR-163, de Rondonópolis até Miritituba/PA, passando por Sinop. */
export const ROTA_BR163: Ponto[] = [
  PONTO_RONDONOPOLIS,
  PONTO_CUIABA,
  [-14.7208, -56.3278], // Nobres
  [-13.8375, -56.0736], // Nova Mutum
  [-13.05, -55.9111], // Lucas do Rio Verde
  [-12.5425, -55.7211], // Sorriso
  SEDE.coords, // Sinop
  [-10.2253, -54.9797], // Peixoto de Azevedo
  [-9.9611, -54.9053], // Guarantã do Norte
  PONTO_NOVO_PROGRESSO,
  PONTO_MIRITITUBA,
];

/** Ramal até Rondônia: BR-364, de Cuiabá até Vilhena. */
export const ROTA_BR364: Ponto[] = [
  PONTO_CUIABA,
  [-14.4079, -56.4462], // Diamantino
  [-13.6752, -57.8895], // Campo Novo do Parecis
  [-13.6637, -59.7887], // Comodoro
  [-12.7406, -60.1458], // Vilhena
];

/** Pontas do corredor, marcadas no mapa junto da sede. */
export const EXTREMIDADES = [
  { nome: "Miritituba, PA", descricao: "Norte do eixo BR-163 — porto no Tapajós", coords: PONTO_MIRITITUBA },
  { nome: "Rondonópolis, MT", descricao: "Sul do eixo BR-163", coords: PONTO_RONDONOPOLIS },
  { nome: "Vilhena, RO", descricao: "Ramal BR-364 até Rondônia", coords: ROTA_BR364[4] },
];

/** Extensão aproximada somando o eixo BR-163 e o ramal BR-364. Número redondo. */
export const EXTENSAO_APROXIMADA = "~2.000 km";

/**
 * Cidades projetadas no mapa esquemático (viewBox 1000×800 do redesign).
 * Coordenadas x/y são do desenho, não geográficas.
 */
export type CidadeEsquema = {
  nome: string;
  x: number;
  y: number;
  uf: "MT" | "RO" | "PA";
  eixo: string;
  tag: string;
  desc: string;
  base?: boolean;
};

export const CIDADES_ESQUEMA: CidadeEsquema[] = [
  {
    nome: "Miritituba",
    x: 820,
    y: 48,
    uf: "PA",
    eixo: "BR-163",
    tag: "Ponta norte",
    desc: "Porto no Tapajós, no Pará — extremidade norte do corredor BR-163.",
  },
  {
    nome: "Novo Progresso",
    x: 880,
    y: 115,
    uf: "PA",
    eixo: "BR-163",
    tag: "Trecho Pará",
    desc: "Trecho da BR-163 no Pará, entre Guarantã do Norte e Miritituba.",
  },
  {
    nome: "Guarantã do Norte",
    x: 919,
    y: 190,
    uf: "MT",
    eixo: "BR-163",
    tag: "Divisa MT–PA",
    desc: "Último polo do eixo BR-163 em Mato Grosso, na direção do Pará.",
  },
  {
    nome: "Peixoto de Azevedo",
    x: 907,
    y: 210,
    uf: "MT",
    eixo: "BR-163",
    tag: "Trecho norte",
    desc: "Trecho norte do eixo, entre Sinop e Guarantã do Norte.",
  },
  {
    nome: "Sinop",
    x: 822,
    y: 335,
    uf: "MT",
    eixo: "BR-163",
    tag: "Base operacional",
    desc: "Sede da operação Frotec — centro de coordenação técnica do corredor.",
    base: true,
  },
  {
    nome: "Sorriso",
    x: 787,
    y: 386,
    uf: "MT",
    eixo: "BR-163",
    tag: "Trecho central",
    desc: "Polo de grãos no eixo central da BR-163.",
  },
  {
    nome: "Lucas do Rio Verde",
    x: 756,
    y: 425,
    uf: "MT",
    eixo: "BR-163",
    tag: "Trecho central",
    desc: "Trecho central do corredor, entre Nova Mutum e Sorriso.",
  },
  {
    nome: "Nova Mutum",
    x: 730,
    y: 485,
    uf: "MT",
    eixo: "BR-163",
    tag: "Trecho sul",
    desc: "Trecho sul do eixo BR-163, no caminho de Cuiabá.",
  },
  {
    nome: "Cuiabá",
    x: 726,
    y: 620,
    uf: "MT",
    eixo: "BR-163 / BR-364",
    tag: "Entroncamento",
    desc: "Encontro do eixo BR-163 com o ramal da BR-364 rumo a Rondônia.",
  },
  {
    nome: "Rondonópolis",
    x: 800,
    y: 755,
    uf: "MT",
    eixo: "BR-163",
    tag: "Ponta sul",
    desc: "Extremidade sul do corredor BR-163 em Mato Grosso.",
  },
  {
    nome: "Diamantino",
    x: 670,
    y: 529,
    uf: "MT",
    eixo: "BR-364",
    tag: "Ramal RO",
    desc: "Início do ramal da BR-364 em direção a Rondônia.",
  },
  {
    nome: "Campo Novo do Parecis",
    x: 437,
    y: 473,
    uf: "MT",
    eixo: "BR-364",
    tag: "Ramal RO",
    desc: "Trecho intermediário do ramal BR-364.",
  },
  {
    nome: "Comodoro",
    x: 131,
    y: 472,
    uf: "MT",
    eixo: "BR-364",
    tag: "Ramal RO",
    desc: "Último trecho em Mato Grosso antes da divisa com Rondônia.",
  },
  {
    nome: "Vilhena",
    x: 73,
    y: 402,
    uf: "RO",
    eixo: "BR-364",
    tag: "Ponta RO",
    desc: "Extremidade do ramal BR-364, já em Rondônia.",
  },
];

export const POLYLINE_BR163 =
  "800,755 726,620 689,552 730,485 756,425 787,386 822,335 907,210 919,190 880,115 820,48";
export const POLYLINE_BR364 = "726,620 670,529 437,473 131,472 73,402";
