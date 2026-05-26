import { afterEach, beforeEach, describe, expect, it } from "vitest";
import crypto from "node:crypto";
import {
  buildCheckoutUrl,
  planFromProductId,
  verifySignature,
} from "@/lib/kiwify";

describe("buildCheckoutUrl", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_PREMIUM = "https://pay.kiwify.com.br/ABCDEF";
  });
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_PREMIUM;
  });

  it("retorna URL com email, name e sck preenchidos", () => {
    const url = buildCheckoutUrl({
      plan: "premium",
      email: "joao@example.com",
      name: "João",
      userId: "11111111-2222-3333-4444-555555555555",
    });
    expect(url).toBeTruthy();
    const parsed = new URL(url!);
    expect(parsed.searchParams.get("email")).toBe("joao@example.com");
    expect(parsed.searchParams.get("name")).toBe("João");
    expect(parsed.searchParams.get("sck")).toBe("11111111-2222-3333-4444-555555555555");
  });

  it("retorna null se a env não estiver configurada", () => {
    delete process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_PREMIUM;
    const url = buildCheckoutUrl({
      plan: "premium",
      email: "joao@example.com",
      userId: "abc",
    });
    expect(url).toBeNull();
  });
});

describe("planFromProductId", () => {
  beforeEach(() => {
    process.env.KIWIFY_PRODUCT_ID_BASIC = "prod_basic";
    process.env.KIWIFY_PRODUCT_ID_PREMIUM = "prod_premium";
    process.env.KIWIFY_PRODUCT_ID_PROFESSIONAL = "prod_pro";
  });
  afterEach(() => {
    delete process.env.KIWIFY_PRODUCT_ID_BASIC;
    delete process.env.KIWIFY_PRODUCT_ID_PREMIUM;
    delete process.env.KIWIFY_PRODUCT_ID_PROFESSIONAL;
  });

  it("mapeia ids do produto da Kiwify para planos internos", () => {
    expect(planFromProductId("prod_basic")).toBe("basic");
    expect(planFromProductId("prod_premium")).toBe("premium");
    expect(planFromProductId("prod_pro")).toBe("professional");
    expect(planFromProductId("desconhecido")).toBeNull();
    expect(planFromProductId(null)).toBeNull();
  });
});

describe("verifySignature", () => {
  beforeEach(() => {
    process.env.KIWIFY_WEBHOOK_TOKEN = "test_token_123";
  });
  afterEach(() => {
    delete process.env.KIWIFY_WEBHOOK_TOKEN;
  });

  it("valida assinatura calculada conforme o exemplo da Kiwify", () => {
    const body = JSON.stringify({ order_id: "x", Customer: { email: "a@b.com" } });
    const expected = crypto
      .createHmac("sha1", "test_token_123")
      .update(body)
      .digest("hex");
    expect(verifySignature(body, expected)).toBe(true);
  });

  it("rejeita assinatura inválida", () => {
    const body = JSON.stringify({ order_id: "x" });
    expect(verifySignature(body, "deadbeef")).toBe(false);
  });

  it("rejeita assinatura nula/ausente", () => {
    expect(verifySignature("{}", null)).toBe(false);
    expect(verifySignature("{}", "")).toBe(false);
  });
});
