import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAI() {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

/**
 * Modelo padrão para geração de peças e revisor.
 * GPT-4.1 mini foi escolhido pela melhor relação custo/qualidade para textos
 * jurídicos em PT-BR no MVP. O prompt caching da OpenAI é automático para
 * prefixos ≥ 1024 tokens — não precisa parâmetro extra.
 */
export const GENERATION_MODEL = "gpt-4.1-mini";
export const REVIEWER_MODEL = "gpt-4.1-mini";

export interface AIResult {
  text: string;
  tokensIn: number;
  tokensOut: number;
}

export async function runMessage(args: {
  model: string;
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<AIResult> {
  const client = getOpenAI();
  const completion = await client.chat.completions.create({
    model: args.model,
    max_completion_tokens: args.maxTokens ?? 4096,
    temperature: 0.4,
    messages: [
      { role: "system", content: args.system },
      { role: "user", content: args.user },
    ],
  });

  const text = (completion.choices[0]?.message?.content ?? "").trim();
  return {
    text,
    tokensIn: completion.usage?.prompt_tokens ?? 0,
    tokensOut: completion.usage?.completion_tokens ?? 0,
  };
}
