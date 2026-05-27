import crypto from "node:crypto";

/**
 * Meta Conversions API (CAPI) — disparo server-side de eventos pro Meta Pixel.
 *
 * Por que: Pixel client é bloqueado por ad-blockers e iOS 14+. CAPI server
 * captura ~30% das conversões que o pixel perde, melhorando otimização.
 *
 * Deduplicação: se o Pixel client e o CAPI server enviam o MESMO event_id
 * para o MESMO event_name, o Meta conta apenas 1 vez. Use o mesmo `event_id`
 * em ambos os disparos.
 *
 * Docs oficiais: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

const FB_API_VERSION = "v18.0";

export interface CapiUser {
  /** E-mail (será SHA-256 hasheado antes do envio). */
  email?: string;
  /** Telefone E.164 sem +, ex: "5511999998888". Hash automático. */
  phone?: string;
  /** Nome próprio (will be hashed). */
  firstName?: string;
  /** Sobrenome (will be hashed). */
  lastName?: string;
  /** IPv4/IPv6 do usuário (NÃO é hasheado pelo Meta). */
  clientIpAddress?: string;
  /** User-agent do navegador. */
  clientUserAgent?: string;
  /** Cookie _fbp do Pixel (vem do navegador). */
  fbp?: string;
  /** Cookie _fbc do Pixel (vem do navegador, parâmetro `fbclid`). */
  fbc?: string;
  /** ID externo do seu sistema (ex: user_id do Supabase). Hash automático. */
  externalId?: string;
}

export interface CapiEventArgs {
  eventName: "Purchase" | "InitiateCheckout" | "Lead" | "ViewContent" | "CompleteRegistration" | string;
  /** Mesmo ID enviado pelo Pixel client → deduplica. */
  eventId: string;
  /** URL onde o evento ocorreu (necessário). */
  eventSourceUrl: string;
  /** Timestamp Unix (segundos). Default: agora. */
  eventTime?: number;
  user: CapiUser;
  /** Dados do evento (Purchase: { value, currency }, etc). */
  customData?: Record<string, unknown>;
}

function sha256(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function buildUserData(user: CapiUser) {
  return {
    em: user.email ? [sha256(user.email)] : undefined,
    ph: user.phone ? [sha256(user.phone.replace(/\D/g, ""))] : undefined,
    fn: user.firstName ? [sha256(user.firstName)] : undefined,
    ln: user.lastName ? [sha256(user.lastName)] : undefined,
    external_id: user.externalId ? [sha256(user.externalId)] : undefined,
    client_ip_address: user.clientIpAddress,
    client_user_agent: user.clientUserAgent,
    fbp: user.fbp,
    fbc: user.fbc,
  };
}

/**
 * Envia um evento ao CAPI. Não joga — apenas loga falhas (CAPI é
 * complementar; uma falha aqui não deve quebrar o fluxo principal).
 */
export async function sendCapiEvent(args: CapiEventArgs): Promise<{ sent: boolean; reason?: string }> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId) return { sent: false, reason: "no-pixel-id" };
  if (!accessToken) return { sent: false, reason: "no-access-token" };

  const payload = {
    data: [
      {
        event_name: args.eventName,
        event_id: args.eventId,
        event_time: args.eventTime ?? Math.floor(Date.now() / 1000),
        event_source_url: args.eventSourceUrl,
        action_source: "website",
        user_data: buildUserData(args.user),
        custom_data: args.customData,
      },
    ],
    test_event_code: process.env.META_CAPI_TEST_EVENT_CODE || undefined,
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${FB_API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const errText = await res.text();
      console.error(`[meta-capi] ${args.eventName} failed: ${res.status}`, errText);
      return { sent: false, reason: errText };
    }
    return { sent: true };
  } catch (err) {
    console.error(`[meta-capi] ${args.eventName} fetch error`, err);
    return { sent: false, reason: (err as Error).message };
  }
}

/** Gera um event_id aleatório (UUID-like, compatível com Meta dedup). */
export function makeEventId(prefix = "evt"): string {
  return `${prefix}_${crypto.randomUUID()}`;
}
