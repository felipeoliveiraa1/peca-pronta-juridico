import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import {
  ACTIVATE_EVENTS,
  DEACTIVATE_EVENTS,
  PAST_DUE_EVENTS,
  resolvePlanFromPayload,
  verifySignature,
  type KiwifyEventType,
  type KiwifyPayload,
} from "@/lib/kiwify";
import { generatePassword, renderCredentialsEmail, sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const url = new URL(req.url);
  const signature =
    url.searchParams.get("signature") ?? req.headers.get("x-kiwify-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: KiwifyPayload;
  try {
    payload = JSON.parse(rawBody) as KiwifyPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const eventType = payload.webhook_event_type;
  if (!eventType) {
    // Eventos sem webhook_event_type (carrinho abandonado, etc.) são ignorados.
    return NextResponse.json({ received: true, ignored: "no event_type" });
  }

  const supabase = createServiceClient();

  // Mapeia Kiwify → plano interno (prioriza oferta sobre produto).
  const plan = resolvePlanFromPayload(payload);
  const productId = payload.Product?.product_id ?? null;
  const offerId = payload.Subscription?.plan?.id ?? null;

  // Resolve (ou cria) o profile correspondente.
  let profileId = await resolveProfileId(supabase, payload);
  let createdNow = false;
  let provisionalPassword: string | null = null;

  if (!profileId && ACTIVATE_EVENTS.has(eventType)) {
    const customer = payload.Customer;
    if (!customer?.email) {
      console.warn("[kiwify-webhook] order_approved sem e-mail do cliente — abortando");
      return NextResponse.json({ received: true, warning: "no customer email" });
    }
    const created = await createAccountFromCheckout(supabase, {
      email: customer.email,
      fullName: customer.full_name ?? customer.first_name ?? null,
    });
    if (!created) {
      console.error("[kiwify-webhook] falha ao criar conta Supabase");
      return NextResponse.json({ received: true, warning: "account creation failed" });
    }
    profileId = created.profileId;
    provisionalPassword = created.password;
    createdNow = true;
  }

  if (!profileId) {
    console.warn("[kiwify-webhook] nenhum profile correspondente", {
      email: payload.Customer?.email,
      sck: payload.TrackingParameters?.sck,
      event: eventType,
    });
    return NextResponse.json({ received: true, warning: "no matching profile" });
  }

  // Persistência do registro de assinatura (idempotente por order_id/subscription_id).
  const subscriptionRef = payload.subscription_id ?? payload.order_id;
  if (plan && subscriptionRef) {
    await supabase.from("subscriptions").upsert(
      {
        user_id: profileId,
        gateway: "kiwify",
        gateway_subscription_id: subscriptionRef,
        gateway_product_id: productId ?? "",
        plan,
        status: derivedStatus(eventType, payload),
        current_period_end: payload.Subscription?.next_payment ?? null,
        cancel_at_period_end: eventType === "subscription_canceled",
        raw_event: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "gateway_subscription_id" },
    );
  }

  // Reflete o evento no plano efetivo do usuário.
  if (plan && ACTIVATE_EVENTS.has(eventType)) {
    await supabase
      .from("profiles")
      .update({
        plan,
        trial_ends_at: null,
        gateway_customer_id: payload.Customer?.email ?? null,
      })
      .eq("id", profileId);
  } else if (DEACTIVATE_EVENTS.has(eventType)) {
    await supabase.from("profiles").update({ plan: "free" }).eq("id", profileId);
  } else if (PAST_DUE_EVENTS.has(eventType)) {
    /* mantém plano vigente */
  }

  // Envia credenciais por e-mail somente quando a conta foi criada agora.
  if (createdNow && provisionalPassword && payload.Customer?.email) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const { html, text } = renderCredentialsEmail({
      name: payload.Customer.full_name ?? null,
      email: payload.Customer.email,
      password: provisionalPassword,
      appUrl,
    });
    const result = await sendEmail({
      to: payload.Customer.email,
      subject: "🎉 Seu acesso ao Peça Pronta está liberado",
      html,
      text,
    });
    if (!result.sent) {
      // Sem provedor configurado — registra a senha para resgate manual.
      console.warn(
        `[kiwify-webhook] credenciais NÃO enviadas. e-mail=${payload.Customer.email} senha=${provisionalPassword}`,
      );
    }
  }

  return NextResponse.json({
    received: true,
    accountCreated: createdNow,
  });
}

/**
 * 1ª escolha: `TrackingParameters.sck` (passado no checkout via buildCheckoutUrl)
 * 2ª escolha: e-mail do cliente (case-insensitive)
 */
async function resolveProfileId(
  supabase: ReturnType<typeof createServiceClient>,
  payload: KiwifyPayload,
): Promise<string | null> {
  const sck = payload.TrackingParameters?.sck?.trim();
  if (sck && /^[0-9a-f-]{8,}$/i.test(sck)) {
    const { data } = await supabase.from("profiles").select("id").eq("id", sck).maybeSingle();
    if (data) return data.id;
  }
  const email = payload.Customer?.email?.toLowerCase().trim();
  if (email) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", email)
      .maybeSingle();
    if (data) return data.id;
  }
  return null;
}

/**
 * Cria um usuário no Supabase Auth com senha aleatória e retorna a senha em
 * texto puro APENAS para envio único por e-mail. O trigger `handle_new_user`
 * cria a linha em `public.profiles` automaticamente.
 */
async function createAccountFromCheckout(
  supabase: ReturnType<typeof createServiceClient>,
  args: { email: string; fullName: string | null },
): Promise<{ profileId: string; password: string } | null> {
  const password = generatePassword(14);
  const { data, error } = await supabase.auth.admin.createUser({
    email: args.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: args.fullName ?? "" },
  });

  if (error) {
    // Pode ser que a conta já exista (corrida) — tentamos buscar por e-mail.
    if (/already registered|already been registered/i.test(error.message)) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .ilike("email", args.email)
        .maybeSingle();
      if (existing) return { profileId: existing.id, password: "" };
    }
    console.error("[kiwify-webhook] admin.createUser falhou", error);
    return null;
  }
  if (!data.user) return null;
  return { profileId: data.user.id, password };
}

function derivedStatus(eventType: KiwifyEventType, payload: KiwifyPayload): string {
  if (eventType === "subscription_canceled") return "canceled";
  if (eventType === "order_refunded") return "refunded";
  if (eventType === "chargeback") return "chargeback";
  if (eventType === "subscription_late") return "past_due";
  if (eventType === "order_rejected") return "rejected";
  if (eventType === "subscription_renewed") return "active";
  if (eventType === "order_approved") return payload.Subscription?.status ?? "active";
  return payload.order_status ?? "unknown";
}
