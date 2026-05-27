import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAI, GENERATION_MODEL } from "@/lib/ai";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat-prompt";
import { getCurrentProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { getPlan } from "@/lib/plans";
import { startOfCurrentMonthISO } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  message: z.string().min(1).max(2000),
  conversation_id: z.string().uuid().optional(),
});

const MAX_HISTORY = 16; // últimas 16 mensagens (8 turnos) — economiza tokens

export async function POST(req: Request) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
  }

  // ============================================================
  // Rate limit por plano
  // ============================================================
  const planDef = getPlan(profile.plan);
  const supabase = await createClient();
  const { count: usedThisMonth } = await supabase
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("kind", "chat")
    .gte("created_at", startOfCurrentMonthISO());

  if (planDef.chatMessageLimit != null && (usedThisMonth ?? 0) >= planDef.chatMessageLimit) {
    return NextResponse.json(
      {
        error: "Limite mensal de mensagens atingido",
        message: `Seu plano ${planDef.name} permite ${planDef.chatMessageLimit} mensagens/mês. Faça upgrade pra continuar conversando.`,
        upgradeRequired: true,
        limit: planDef.chatMessageLimit,
        used: usedThisMonth,
      },
      { status: 402 },
    );
  }

  // ============================================================
  // Histórico da conversa (última conversation_id do user)
  // ============================================================
  let conversationId = parsed.data.conversation_id;
  if (!conversationId) {
    // pega conversa mais recente OU cria uma nova ID
    const { data: lastMsg } = await supabase
      .from("chat_messages")
      .select("conversation_id")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    conversationId = lastMsg?.conversation_id ?? crypto.randomUUID();
  }

  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .eq("user_id", profile.id)
    .order("created_at", { ascending: true })
    .limit(MAX_HISTORY);

  // ============================================================
  // Chamada OpenAI
  // ============================================================
  const messages = [
    { role: "system" as const, content: CHAT_SYSTEM_PROMPT },
    ...(history ?? []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: parsed.data.message },
  ];

  let assistant: string;
  let tokensIn = 0;
  let tokensOut = 0;
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: GENERATION_MODEL,
      max_completion_tokens: 1500,
      temperature: 0.4,
      messages,
    });
    assistant = (completion.choices[0]?.message?.content ?? "").trim();
    tokensIn = completion.usage?.prompt_tokens ?? 0;
    tokensOut = completion.usage?.completion_tokens ?? 0;
    if (!assistant) {
      return NextResponse.json({ error: "Resposta vazia da IA" }, { status: 502 });
    }
  } catch (err) {
    console.error("[chat] openai error", err);
    return NextResponse.json({ error: "Falha na IA, tente novamente." }, { status: 502 });
  }

  // ============================================================
  // Persistência: user message + assistant message + usage_event
  // ============================================================
  await supabase.from("chat_messages").insert([
    {
      user_id: profile.id,
      conversation_id: conversationId,
      role: "user",
      content: parsed.data.message,
    },
    {
      user_id: profile.id,
      conversation_id: conversationId,
      role: "assistant",
      content: assistant,
      tokens: tokensOut,
    },
  ]);

  await supabase.from("usage_events").insert({
    user_id: profile.id,
    kind: "chat",
    tokens_in: tokensIn,
    tokens_out: tokensOut,
    metadata: { conversation_id: conversationId },
  });

  return NextResponse.json({
    message: assistant,
    conversation_id: conversationId,
    usage: {
      used: (usedThisMonth ?? 0) + 1,
      limit: planDef.chatMessageLimit,
    },
  });
}

// GET: retorna últimas mensagens da conversa atual
export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ messages: [], conversation_id: null });

  const supabase = await createClient();

  // pega ID da conversa mais recente
  const { data: lastMsg } = await supabase
    .from("chat_messages")
    .select("conversation_id")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastMsg) {
    return NextResponse.json({ messages: [], conversation_id: null });
  }

  const { data: messages } = await supabase
    .from("chat_messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", lastMsg.conversation_id)
    .order("created_at", { ascending: true })
    .limit(MAX_HISTORY);

  return NextResponse.json({
    messages: messages ?? [],
    conversation_id: lastMsg.conversation_id,
  });
}

// DELETE: limpa conversa atual (começa nova)
export async function DELETE() {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const supabase = await createClient();
  await supabase.from("chat_messages").delete().eq("user_id", profile.id);

  return NextResponse.json({ ok: true });
}
