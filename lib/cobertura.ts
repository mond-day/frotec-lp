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
