/**
 * Wrapper tipado para o fbq do Meta Pixel.
 *
 * Uso em componentes client:
 *   import { trackEvent } from "@/lib/meta-pixel";
 *   trackEvent("InitiateCheckout", { value: 19.90, currency: "BRL" });
 *
 * Eventos padrão úteis pro nosso funil:
 *   PageView          → automático no MetaPixel
 *   ViewContent       → ver detalhes de um plano
 *   InitiateCheckout  → clicar num CTA que vai pra Kiwify
 *   Lead              → criar conta (futuro)
 *   Purchase          → confirmar pagamento (via CAPI no webhook Kiwify)
 */

type FbqFn = (
  command: "init" | "track" | "trackCustom" | "consent",
  argument?: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: unknown;
  }
}

export function isPixelLoaded(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (!isPixelLoaded()) return;
  window.fbq!("track", eventName, params);
}

export function trackCustom(eventName: string, params?: Record<string, unknown>) {
  if (!isPixelLoaded()) return;
  window.fbq!("trackCustom", eventName, params);
}

export {};
