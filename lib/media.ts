/**
 * Flag de mídia do hero.
 * Troque para true quando /public/hero-bg.mp4 (e opcionalmente hero-bg-mobile.mp4)
 * estiver no deploy — evita HEAD request no cliente.
 */
export const HERO_HAS_VIDEO = false;
export const HERO_VIDEO_SRC = "/hero-bg.mp4";
export const HERO_VIDEO_MOBILE_SRC = "/hero-bg-mobile.mp4";
export const HERO_POSTER_SRC = "/hero-poster.svg";
