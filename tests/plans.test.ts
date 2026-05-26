import { describe, expect, it } from "vitest";
import { getPlan, PLANS } from "@/lib/plans";

describe("plans configuration", () => {
  it("define os 3 planos pagos com preços conforme estratégia", () => {
    expect(PLANS.basic.priceBRL).toBe(19.9);
    expect(PLANS.premium.priceBRL).toBe(59.9);
    expect(PLANS.professional.priceBRL).toBe(99.9);
  });

  it("Estudante limita a 3 peças/mês; Premium e Profissional são ilimitados", () => {
    expect(PLANS.basic.monthlyGenerationLimit).toBe(3);
    expect(PLANS.premium.monthlyGenerationLimit).toBeNull();
    expect(PLANS.professional.monthlyGenerationLimit).toBeNull();
  });

  it("revisor jurídico é exclusivo do Premium em diante", () => {
    expect(PLANS.basic.juridicalReviewer).toBe(false);
    expect(PLANS.premium.juridicalReviewer).toBe(true);
    expect(PLANS.professional.juridicalReviewer).toBe(true);
  });

  it("getPlan retorna free para id inválido", () => {
    expect(getPlan("inexistente").id).toBe("free");
    expect(getPlan(null).id).toBe("free");
  });
});
