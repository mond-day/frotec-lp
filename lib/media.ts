/**
 * Flags e paths de mídia.
 * Quando os MP4 existirem em public/, defina HAS_* = true.
 * Sem HEAD request no cliente — onError do <video> cobre fallback.
 */

export const HERO_HAS_VIDEO = false;
export const HERO_VIDEO_SRC = "/media/hero/hero-desktop.mp4";
export const HERO_VIDEO_MOBILE_SRC = "/media/hero/hero-mobile.mp4";
export const HERO_POSTER_SRC = "/hero-poster.svg";

/** Cobertura: preferir route.mp4 quando existir; senão Leaflet legível. */
export const COVERAGE_HAS_VIDEO = true;
export const COVERAGE_VIDEO_SRC = "/media/coverage/route.mp4";
export const COVERAGE_VIDEO_MOBILE_SRC = "/media/coverage/route.mp4";

export const MOCKUP_DESKTOP_SRC = "/mockups/portal-desktop.webp";
export const MOCKUP_MOBILE_SRC = "/mockups/portal-mobile.webp";
export const MOCKUP_DESKTOP_FALLBACK = "/mockups/portal-desktop.png";
