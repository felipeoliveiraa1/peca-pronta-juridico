import { describe, expect, it } from "vitest";
import { buildGenerationUserPrompt, buildReviewerUserPrompt } from "@/lib/prompts";

describe("buildGenerationUserPrompt", () => {
  it("interpola todos os campos preenchidos pelo usuário", () => {
    const prompt = buildGenerationUserPrompt({
      pieceType: "peticao_inicial",
      area: "Direito do Consumidor",
      inputs: {
        comarca: "3ª Vara Cível da Comarca de São Paulo/SP",
        area_direito: "Direito do Consumidor",
        autor: "João da Silva",
        reu: "Empresa XYZ Ltda.",
        fatos: "Em 12/03/2026, o autor adquiriu produto...",
        pedido: "Indenização por danos morais.",
      },
    });
    expect(prompt).toContain("Tipo de peça solicitada: Petição Inicial");
    expect(prompt).toContain("Direito do Consumidor");
    expect(prompt).toContain("João da Silva");
    expect(prompt).toContain("Empresa XYZ Ltda.");
    expect(prompt).toContain("Em 12/03/2026, o autor adquiriu produto...");
    expect(prompt).toContain("Indenização por danos morais.");
  });

  it("marca campos não informados sem quebrar a geração", () => {
    const prompt = buildGenerationUserPrompt({
      pieceType: "habeas_corpus",
      inputs: {
        tribunal: "TJSP — 5ª Câmara Criminal",
        paciente: "José Souza",
        autoridade_coatora: "Delegado da 1ª DP",
        fatos: "Prisão em flagrante por suposto furto.",
      },
    });
    expect(prompt).toContain("Tipo de peça solicitada: Habeas Corpus");
    expect(prompt).toContain("[não informado]");
  });
});

describe("buildReviewerUserPrompt", () => {
  it("informa o plano do usuário para o sistema modular a revisão", () => {
    const prompt = buildReviewerUserPrompt({
      content: "EXMO. SR. DR. JUIZ DE DIREITO...".repeat(5),
      plan: "Básico (Estudante)",
    });
    expect(prompt).toContain("Plano do usuário: Básico (Estudante)");
    expect(prompt).toContain("PEÇA A SER REVISADA:");
  });
});
