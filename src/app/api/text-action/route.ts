import { NextResponse } from "next/server";
import { z } from "zod";
import { GENERATION_MODEL, runMessage } from "@/lib/ai";
import { getCurrentProfile } from "@/lib/profile";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  action: z.enum(["continuar", "resumir", "formalizar", "fundamentar", "encurtar", "aplicar_revisao"]),
  text: z.string().min(20).max(20_000),
  context: z.string().optional(),
});

const PROMPTS: Record<z.infer<typeof schema>["action"], { system: string; instruction: string }> = {
  continuar: {
    system:
      "Você é o assistente jurídico do Peça Pronta. Continue o texto a seguir mantendo o mesmo tom técnico-jurídico, sem repetir o que já foi escrito. Responda APENAS com a continuação, sem comentários.",
    instruction: "Continue o seguinte texto:",
  },
  resumir: {
    system:
      "Você é o assistente jurídico do Peça Pronta. Produza um resumo objetivo do texto jurídico fornecido em até 5 parágrafos curtos. Responda APENAS com o resumo.",
    instruction: "Resuma o texto a seguir:",
  },
  formalizar: {
    system:
      "Você é o assistente jurídico do Peça Pronta. Reescreva o texto com linguagem técnica jurídica formal brasileira, mantendo o mesmo conteúdo. Não invente fatos. Responda APENAS com o texto reescrito.",
    instruction: "Reescreva o texto a seguir em linguagem técnica:",
  },
  fundamentar: {
    system:
      "Você é o assistente jurídico do Peça Pronta. Acrescente ao texto fundamentação legal pertinente do Direito Brasileiro (CF, CPC, CC, CDC, CLT, CP, conforme o caso). Não invente súmulas. Responda APENAS com o texto enriquecido.",
    instruction: "Acrescente fundamentação legal ao texto:",
  },
  encurtar: {
    system:
      "Você é o assistente jurídico do Peça Pronta. Reduza o texto pela metade mantendo todo o conteúdo jurídico essencial e a estrutura. Responda APENAS com a versão encurtada.",
    instruction: "Encurte o texto a seguir mantendo o conteúdo jurídico essencial:",
  },
  aplicar_revisao: {
    system:
      'Você é o assistente jurídico do Peça Pronta. Receberá (1) o TEXTO ORIGINAL de uma peça processual brasileira e (2) o RELATÓRIO DE REVISÃO produzido por um revisor jurídico (com sugestões de correção gramatical, técnica, estrutura e fundamentação). Sua tarefa: reescrever a peça INCORPORANDO TODAS as sugestões do relatório que sejam aplicáveis. Mantenha tudo que está correto, melhore apenas onde o relatório aponta. Preserve a estrutura I/II/III, fórmula final ("Nestes termos, pede deferimento.") e marcadores entre colchetes. NÃO invente fatos novos. NÃO insira números de acórdãos inexistentes. Responda APENAS com o texto da peça revisada, sem comentários nem cabeçalhos extras.',
    instruction:
      "Reescreva a peça incorporando todas as melhorias sugeridas no relatório do revisor:",
  },
};

export async function POST(req: Request) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const cfg = PROMPTS[parsed.data.action];
  const user = `${cfg.instruction}\n\n"""\n${parsed.data.text}\n"""${parsed.data.context ? `\n\nContexto: ${parsed.data.context}` : ""}`;

  try {
    const result = await runMessage({
      model: GENERATION_MODEL,
      system: cfg.system,
      user,
      // 8192 pra "aplicar_revisao" (reescreve peça completa);
      // 2048 é suficiente pras outras ações pontuais.
      maxTokens: parsed.data.action === "aplicar_revisao" ? 8192 : 2048,
    });
    return NextResponse.json({ text: result.text });
  } catch (err) {
    console.error("[text-action] erro", err);
    return NextResponse.json({ error: "Falha ao processar com IA." }, { status: 502 });
  }
}
