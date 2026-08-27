/**
 * Eventos de conversão — stubs prontos para instrumentação.
 * Não envia dados sensíveis do formulário.
 */

export type AnalyticsEvent =
  | "hero_cta_click"
  | "secondary_cta_click"
  | "process_section_view"
  | "coverage_view"
  | "coverage_explore"
  | "form_start"
  | "form_step_1_complete"
  | "form_submit"
  | "whatsapp_click"
  | "faq_open";

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;

  const detail = { event, ...props, ts: Date.now() };

  window.dispatchEvent(new CustomEvent("frotec:analytics", { detail }));

  const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...props });
  }
  if (typeof w.gtag === "function") {
    w.gtag("event", event, props);
  }
}
