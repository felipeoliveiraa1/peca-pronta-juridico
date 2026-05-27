/**
 * Captura e propagação de UTMs / click IDs entre nossa landing e a Kiwify.
 *
 * Fluxo:
 *   1. Cliente chega na landing com `?utm_source=fb&utm_campaign=...&fbclid=...`
 *   2. Hook captura tudo e salva em sessionStorage (sobrevive entre páginas
 *      no mesmo tab, expira quando fecha o navegador).
 *   3. Quando clica num botão de plano, função appendUtmsToKiwifyUrl()
 *      anexa os UTMs ao link Kiwify antes de redirecionar.
 *   4. Kiwify captura → repassa no postback como TrackingParameters.utm_*
 *   5. Nosso webhook salva tudo em subscriptions.raw_event pra reporting.
 */

const STORAGE_KEY = "pp_utms_v1";

/** Parâmetros que persistimos. Kiwify aceita utm_* e sck/src nativamente. */
const TRACKED_KEYS = [
  // UTMs padrão
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  // Click IDs de plataformas (úteis pra CAPI/análise)
  "fbclid", // Facebook
  "gclid",  // Google Ads
  "ttclid", // TikTok
  "msclkid", // Microsoft Ads
  // Trackers customizados aceitos pela Kiwify
  "sck",
  "src",
  "s1",
  "s2",
  "s3",
] as const;

export type TrackedKey = (typeof TRACKED_KEYS)[number];
export type TrackedParams = Partial<Record<TrackedKey, string>>;

/**
 * Lê params da URL atual e merge com sessionStorage existente.
 * Novos params vencem (last-touch attribution). Chame no mount da landing.
 */
export function captureUtmsFromUrl(): TrackedParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const captured: TrackedParams = {};
  for (const key of TRACKED_KEYS) {
    const v = params.get(key);
    if (v) captured[key] = v;
  }

  if (Object.keys(captured).length === 0) return getStoredUtms();

  const merged: TrackedParams = { ...getStoredUtms(), ...captured };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // privado/quota — ignora
  }
  return merged;
}

export function getStoredUtms(): TrackedParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TrackedParams) : {};
  } catch {
    return {};
  }
}

/**
 * Anexa UTMs/click IDs persistidos a uma URL de checkout da Kiwify.
 * Não sobrescreve params já presentes na URL original.
 */
export function appendUtmsToKiwifyUrl(baseUrl: string): string {
  const utms = getStoredUtms();
  if (Object.keys(utms).length === 0) return baseUrl;
  try {
    const u = new URL(baseUrl);
    for (const [k, v] of Object.entries(utms)) {
      if (v && !u.searchParams.has(k)) u.searchParams.set(k, v);
    }
    return u.toString();
  } catch {
    return baseUrl;
  }
}
