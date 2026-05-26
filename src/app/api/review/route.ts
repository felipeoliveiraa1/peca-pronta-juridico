import { NextResponse } from "next/server";
import { z } from "zod";
import { REVIEWER_MODEL, runMessage } from "@/lib/ai";
import { SYSTEM_PROMPT_REVIEWER, buildReviewerUserPrompt } from "@/lib/prompts";
import { getCurrentProfile } from "@/lib/profile";
import { getPlan } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  content: z.string().min(50, "Forneça pelo menos 50 caracteres para revisão."),
});

export async function POST(req: Request) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const planDef = getPlan(profile.plan);

  let result;
  try {
    result = await runMessage({
      model: REVIEWER_MODEL,
      system: SYSTEM_PROMPT_REVIEWER,
      user: buildReviewerUserPrompt({
        content: parsed.data.content,
        plan: planDef.name,
      }),
      maxTokens: 2048,
    });
  } catch (err) {
    console.error("[review] openai error", err);
    return NextResponse.json({ error: "Falha ao revisar. Tente novamente." }, { status: 502 });
  }

  const supabase = await createClient();
  await supabase.from("usage_events").insert({
    user_id: profile.id,
    kind: "review",
    tokens_in: result.tokensIn,
    tokens_out: result.tokensOut,
  });

  return NextResponse.json({ report: result.text });
}
