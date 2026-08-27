/**
 * Corredor de atuacao desenhado no mapa da secao "Onde atuamos".
 *
 * Base em Sinop/MT. O eixo principal e a BR-163 (Cuiaba <-> Guaranta do Norte);
 * o ramal ate Rondonia usa a BR-364 (Cuiaba <-> Vilhena), que e a rodovia que
 * de fato liga Mato Grosso a Rondonia.
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

/** Eixo principal: BR-163, de Cuiabá até Guarantã do Norte, passando por Sinop. */
export const ROTA_BR163: Ponto[] = [
  [-15.6014, -56.0979], // Cuiabá
  [-14.7208, -56.3278], // Nobres
  [-13.8375, -56.0736], // Nova Mutum
  [-13.05, -55.9111], // Lucas do Rio Verde
  [-12.5425, -55.7211], // Sorriso
  SEDE.coords, // Sinop
  [-10.2253, -54.9797], // Peixoto de Azevedo
  [-9.9611, -54.9053], // Guarantã do Norte
];

/** Ramal até Rondônia: BR-364, de Cuiabá até Vilhena. */
export const ROTA_BR364: Ponto[] = [
  [-15.6014, -56.0979], // Cuiabá
  [-14.4079, -56.4462], // Diamantino
  [-13.6752, -57.8895], // Campo Novo do Parecis
  [-13.6637, -59.7887], // Comodoro
  [-12.7406, -60.1458], // Vilhena
];

/** Pontas do corredor, marcadas no mapa junto da sede. */
export const EXTREMIDADES = [
  { nome: "Guarantã do Norte, MT", descricao: "Norte do eixo BR-163", coords: ROTA_BR163[7] },
  { nome: "Cuiabá, MT", descricao: "Sul do eixo BR-163", coords: ROTA_BR163[0] },
  { nome: "Vilhena, RO", descricao: "Ramal BR-364 até Rondônia", coords: ROTA_BR364[4] },
];

/** Extensão aproximada somando o eixo BR-163 e o ramal BR-364. */
export const EXTENSAO_APROXIMADA = "~1.500 km";

/**
 * Cidades projetadas no mapa esquemático (viewBox 1000×800 do redesign).
 * Coordenadas x/y são do desenho, não geográficas.
 */
export type CidadeEsquema = {
  nome: string;
  x: number;
  y: number;
  uf: "MT" | "RO";
  eixo: string;
  tag: string;
  desc: string;
  base?: boolean;
};

export const CIDADES_ESQUEMA: CidadeEsquema[] = [
  {
    nome: "Guarantã do Norte",
    x: 919,
    y: 67,
    uf: "MT",
    eixo: "BR-163",
    tag: "Norte do eixo",
    desc: "Ponta norte do corredor BR-163 em Mato Grosso.",
  },
  {
    nome: "Peixoto de Azevedo",
    x: 907,
    y: 99,
    uf: "MT",
    eixo: "BR-163",
    tag: "Trecho norte",
    desc: "Trecho norte do eixo, entre Sinop e Guarantã do Norte.",
  },
  {
    nome: "Sinop",
    x: 822,
    y: 294,
    uf: "MT",
    eixo: "BR-163",
    tag: "Base operacional",
    desc: "Sede da operação Frotec — centro de coordenação técnica do corredor.",
    base: true,
  },
  {
    nome: "Sorriso",
    x: 787,
    y: 375,
    uf: "MT",
    eixo: "BR-163",
    tag: "Trecho central",
    desc: "Polo de grãos no eixo central da BR-163.",
  },
  {
    nome: "Lucas do Rio Verde",
    x: 756,
    y: 436,
    uf: "MT",
    eixo: "BR-163",
    tag: "Trecho central",
    desc: "Trecho central do corredor, entre Nova Mutum e Sorriso.",
  },
  {
    nome: "Nova Mutum",
    x: 730,
    y: 530,
    uf: "MT",
    eixo: "BR-163",
    tag: "Trecho sul",
    desc: "Trecho sul do eixo BR-163, no caminho de Cuiabá.",
  },
  {
    nome: "Cuiabá",
    x: 726,
    y: 741,
    uf: "MT",
    eixo: "BR-163 / BR-364",
    tag: "Sul do eixo",
    desc: "Entroncamento sul: onde o eixo BR-163 encontra o ramal da BR-364.",
  },
  {
    nome: "Diamantino",
    x: 670,
    y: 598,
    uf: "MT",
    eixo: "BR-364",
    tag: "Ramal RO",
    desc: "Início do ramal da BR-364 em direção a Rondônia.",
  },
  {
    nome: "Campo Novo do Parecis",
    x: 437,
    y: 511,
    uf: "MT",
    eixo: "BR-364",
    tag: "Ramal RO",
    desc: "Trecho intermediário do ramal BR-364.",
  },
  {
    nome: "Comodoro",
    x: 131,
    y: 509,
    uf: "MT",
    eixo: "BR-364",
    tag: "Ramal RO",
    desc: "Último trecho em Mato Grosso antes da divisa com Rondônia.",
  },
  {
    nome: "Vilhena",
    x: 73,
    y: 399,
    uf: "RO",
    eixo: "BR-364",
    tag: "Ponta RO",
    desc: "Extremidade do ramal BR-364, já em Rondônia.",
  },
];

export const POLYLINE_BR163 = "726,741 689,635 730,530 756,436 787,375 822,294 907,99 919,67";
export const POLYLINE_BR364 = "726,741 670,598 437,511 131,509 73,399";
