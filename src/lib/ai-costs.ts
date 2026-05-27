// Tabela de custo OpenAI (USD por milhão de tokens) — gpt-4.1-mini, valores
// públicos atuais (dez/2024). Ajuste aqui se o pricing mudar.
export const OPENAI_PRICING = {
  inputPerMillion: 0.4, // USD / 1M tokens entrada
  outputPerMillion: 1.6, // USD / 1M tokens saída
};

// Cotação fixa pra estimativas — atualizar manualmente se mudar muito.
export const USD_TO_BRL = 5.5;

export function estimateCostUSD(tokensIn: number, tokensOut: number): number {
  const inUsd = (tokensIn / 1_000_000) * OPENAI_PRICING.inputPerMillion;
  const outUsd = (tokensOut / 1_000_000) * OPENAI_PRICING.outputPerMillion;
  return inUsd + outUsd;
}

export function estimateCostBRL(tokensIn: number, tokensOut: number): number {
  return estimateCostUSD(tokensIn, tokensOut) * USD_TO_BRL;
}
