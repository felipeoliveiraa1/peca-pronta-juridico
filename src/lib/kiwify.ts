import crypto from "node:crypto";
import type { PlanId } from "@/lib/plans";

/**
 * Integração com a Kiwify.
 *
 * Fluxo:
 *  1. O usuário clica em "Assinar" no painel. O backend monta a URL pública
 *     de checkout (uma por produto Kiwify) com `email`, `name` e `sck`
 *     pré-preenchidos. `sck` é um parâmetro de tracking customizado da Kiwify
 *     que é devolvido no postback dentro de `TrackingParameters.sck`. Usamos
 *     ele para carregar o `user_id` do Supabase.
 *  2. A Kiwify processa o pagamento (cartão, PIX, boleto) e envia POST para
 *     `/api/webhooks/kiwify` com `?signature=<hmac-sha1>`.
 *  3. A signature é calculada como `hmac_sha1(JSON.stringify(body), token)`,
 *     conforme os exemplos oficiais (JS/PHP) da Kiwify — ou seja, do corpo
 *     já decodificado em objeto e re-serializado.
 *  4. Eventos relevantes:
 *       order_approved        → ativa o plano
 *       order_refunded        → volta para `free`
 *       chargeback            → volta para `free`
 *       subscription_renewed  → mantém ativo + atualiza next_payment
 *       subscription_late     → marca `past_due`
 *       subscription_canceled → volta para `free`
 */

const CHECKOUT_ENV_BY_PLAN: Record<Exclude<PlanId, "free">, string> = {
  basic: "NEXT_PUBLIC_KIWIFY_CHECKOUT_BASIC",
  premium: "NEXT_PUBLIC_KIWIFY_CHECKOUT_PREMIUM",
  professional: "NEXT_PUBLIC_KIWIFY_CHECKOUT_PROFESSIONAL",
};

/**
 * IDs do produto Kiwify, usados quando você cria 1 produto por plano.
 */
const PRODUCT_ENV_BY_PLAN: Record<Exclude<PlanId, "free">, string> = {
  basic: "KIWIFY_PRODUCT_ID_BASIC",
  premium: "KIWIFY_PRODUCT_ID_PREMIUM",
  professional: "KIWIFY_PRODUCT_ID_PROFESSIONAL",
};

/**
 * IDs do plano (offer) Kiwify, usados quando você cria 1 produto com N ofertas
 * — recomendado para SaaS de assinatura. O ID vem em `Subscription.plan.id` no
 * postback. Se estiver setado, tem prioridade sobre o product_id na resolução.
 */
const PLAN_ENV_BY_PLAN: Record<Exclude<PlanId, "free">, string> = {
  basic: "KIWIFY_PLAN_ID_BASIC",
  premium: "KIWIFY_PLAN_ID_PREMIUM",
  professional: "KIWIFY_PLAN_ID_PROFESSIONAL",
};

export function getCheckoutBaseUrl(plan: Exclude<PlanId, "free">): string | null {
  return process.env[CHECKOUT_ENV_BY_PLAN[plan]] ?? null;
}

export function getProductId(plan: Exclude<PlanId, "free">): string | null {
  return process.env[PRODUCT_ENV_BY_PLAN[plan]] ?? null;
}

export function getPlanId(plan: Exclude<PlanId, "free">): string | null {
  return process.env[PLAN_ENV_BY_PLAN[plan]] ?? null;
}

/**
 * Mapeia um postback para nosso PlanId interno.
 *
 * Estratégia:
 *  1. Primeiro tenta `Subscription.plan.id` (modelo 1-produto + N-ofertas).
 *  2. Se não bater, tenta `Product.product_id` (modelo N-produtos).
 */
export function resolvePlanFromPayload(payload: {
  Subscription?: { plan?: { id?: string } | null };
  Product?: { product_id?: string };
}): PlanId | null {
  const offerId = payload.Subscription?.plan?.id;
  if (offerId) {
    if (offerId === process.env.KIWIFY_PLAN_ID_BASIC) return "basic";
    if (offerId === process.env.KIWIFY_PLAN_ID_PREMIUM) return "premium";
    if (offerId === process.env.KIWIFY_PLAN_ID_PROFESSIONAL) return "professional";
  }
  const productId = payload.Product?.product_id;
  if (productId) {
    if (productId === process.env.KIWIFY_PRODUCT_ID_BASIC) return "basic";
    if (productId === process.env.KIWIFY_PRODUCT_ID_PREMIUM) return "premium";
    if (productId === process.env.KIWIFY_PRODUCT_ID_PROFESSIONAL) return "professional";
  }
  return null;
}

/** @deprecated Use `resolvePlanFromPayload` que considera oferta E produto. */
export function planFromProductId(productId: string | undefined | null): PlanId | null {
  if (!productId) return null;
  if (productId === process.env.KIWIFY_PRODUCT_ID_BASIC) return "basic";
  if (productId === process.env.KIWIFY_PRODUCT_ID_PREMIUM) return "premium";
  if (productId === process.env.KIWIFY_PRODUCT_ID_PROFESSIONAL) return "professional";
  return null;
}

/**
 * Monta a URL de checkout da Kiwify com dados do usuário pré-preenchidos e
 * com `sck` carregando o `user_id` do Supabase para correlação no postback.
 */
export function buildCheckoutUrl(args: {
  plan: Exclude<PlanId, "free">;
  email: string;
  name?: string | null;
  userId: string;
}): string | null {
  const base = getCheckoutBaseUrl(args.plan);
  if (!base) return null;
  const url = new URL(base);
  url.searchParams.set("email", args.email);
  if (args.name) url.searchParams.set("name", args.name);
  // `sck` é devolvido em TrackingParameters.sck no postback.
  url.searchParams.set("sck", args.userId);
  return url.toString();
}

/**
 * Verifica a assinatura HMAC-SHA1 do postback.
 *
 * A Kiwify calcula a signature a partir de `JSON.stringify(JSON.parse(body))`
 * (vide exemplo oficial em JS/PHP). Para sermos resilientes a diferenças de
 * serialização entre runtimes, tentamos primeiro com a versão re-serializada
 * e, em fallback, comparamos contra o corpo cru recebido — isso cobre os dois
 * casos vistos em produção.
 */
export function verifySignature(rawBody: string, signature: string | null | undefined): boolean {
  if (!signature) return false;
  const token = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!token) return false;

  const candidates: string[] = [];
  try {
    candidates.push(JSON.stringify(JSON.parse(rawBody)));
  } catch {
    /* corpo não é JSON; cai no fallback */
  }
  candidates.push(rawBody);

  for (const c of candidates) {
    const expected = crypto.createHmac("sha1", token).update(c).digest("hex");
    if (timingSafeEqualHex(signature, expected)) return true;
  }
  return false;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

/**
 * Forma simplificada do payload da Kiwify para os campos que usamos.
 * (Há muitos outros campos no payload completo; apenas tipamos o necessário.)
 */
export interface KiwifyPayload {
  webhook_event_type?: KiwifyEventType;
  order_id?: string;
  order_status?: string;
  subscription_id?: string;
  product_type?: string;
  Product?: { product_id?: string; product_name?: string };
  Customer?: {
    full_name?: string;
    first_name?: string;
    email?: string;
  };
  Subscription?: {
    status?: string;
    next_payment?: string;
    start_date?: string;
    plan?: { id?: string; name?: string; frequency?: string };
  };
  TrackingParameters?: {
    src?: string | null;
    sck?: string | null;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
  };
  approved_date?: string;
  access_url?: string;
}

export type KiwifyEventType =
  | "pix_created"
  | "billet_created"
  | "order_approved"
  | "order_rejected"
  | "order_refunded"
  | "chargeback"
  | "subscription_canceled"
  | "subscription_late"
  | "subscription_renewed";

/** Eventos que ativam (ou mantêm ativa) a assinatura. */
export const ACTIVATE_EVENTS = new Set<KiwifyEventType>([
  "order_approved",
  "subscription_renewed",
]);

/** Eventos que devem reverter o plano para `free`. */
export const DEACTIVATE_EVENTS = new Set<KiwifyEventType>([
  "order_refunded",
  "chargeback",
  "subscription_canceled",
]);

/** Eventos que marcam pendência/atraso (mantemos acesso até o fim do período). */
export const PAST_DUE_EVENTS = new Set<KiwifyEventType>(["subscription_late"]);
