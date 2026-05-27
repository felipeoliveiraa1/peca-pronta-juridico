import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { GENERATION_MODEL, runMessage } from "@/lib/ai";
import {
  SYSTEM_PROMPT_GENERATION,
  buildGenerationUserPrompt,
} from "@/lib/prompts";
import { PIECE_TYPES, type PieceTypeId } from "@/lib/piece-types";
import { exceedsLimit, getCurrentUsage } from "@/lib/usage";
import { getCurrentProfile } from "@/lib/profile";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  pieceType: z.enum(Object.keys(PIECE_TYPES) as [PieceTypeId, ...PieceTypeId[]]),
  title: z.string().min(3).max(200),
  area: z.string().optional(),
  inputs: z.record(z.string()),
  saveDocument: z.boolean().default(true),
});

export async function POST(req: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const usage = await getCurrentUsage(profile.id, profile.plan);
  if (exceedsLimit(usage)) {
    return NextResponse.json(
      {
        error: "Limite mensal atingido",
        message: `Seu plano atual permite ${usage.limit} peças por mês. Faça upgrade para o Premium e tenha geração ilimitada.`,
        upgradeRequired: true,
      },
      { status: 402 },
    );
  }

  const meta = PIECE_TYPES[parsed.data.pieceType];
  const missingRequired = meta.fields
    .filter((f) => f.required)
    .filter((f) => !(parsed.data.inputs[f.id] ?? "").trim())
    .map((f) => f.label);
  if (missingRequired.length > 0) {
    return NextResponse.json(
      {
        error: "Campos obrigatórios faltando",
        details: missingRequired,
      },
      { status: 400 },
    );
  }

  const user = buildGenerationUserPrompt({
    pieceType: parsed.data.pieceType,
    inputs: parsed.data.inputs,
    area: parsed.data.area,
  });

  let result;
  try {
    result = await runMessage({
      model: GENERATION_MODEL,
      system: SYSTEM_PROMPT_GENERATION,
      user,
      // Peças jurídicas brasileiras são extensas. 8192 cobre petições
      // iniciais completas (qualificação, fatos numerados, fundamentação
      // robusta, tutela, pedidos detalhados, protesto, fórmula final).
      maxTokens: 8192,
    });
  } catch (err) {
    console.error("[generate] openai error", err);
    return NextResponse.json(
      { error: "Falha ao gerar peça. Tente novamente em instantes." },
      { status: 502 },
    );
  }

  const supabase = await createClient();

  await supabase.from("usage_events").insert({
    user_id: profile.id,
    kind: "generation",
    tokens_in: result.tokensIn,
    tokens_out: result.tokensOut,
    metadata: { piece_type: parsed.data.pieceType, area: parsed.data.area ?? null },
  });

  let documentId: string | null = null;
  if (parsed.data.saveDocument) {
    const { data: inserted, error } = await supabase
      .from("documents")
      .insert({
        user_id: profile.id,
        title: parsed.data.title,
        piece_type: parsed.data.pieceType,
        area: parsed.data.area ?? meta.area,
        content: result.text,
        input_payload: parsed.data.inputs,
      })
      .select("id")
      .single();
    if (error) {
      console.error("[generate] document insert failed", error);
    } else {
      documentId = inserted.id;
      await supabase.from("document_versions").insert({
        document_id: inserted.id,
        content: result.text,
        created_by: profile.id,
      });
    }
  }

  return NextResponse.json({
    content: result.text,
    documentId,
    tokensIn: result.tokensIn,
    tokensOut: result.tokensOut,
  });
}
