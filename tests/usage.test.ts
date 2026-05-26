import { describe, expect, it } from "vitest";
import { exceedsLimit } from "@/lib/usage";

describe("exceedsLimit", () => {
  it("usuário ilimitado nunca excede", () => {
    expect(
      exceedsLimit({ plan: "premium", used: 9999, limit: null, remaining: null, unlimited: true }),
    ).toBe(false);
  });

  it("usuário com 0 restante excede", () => {
    expect(
      exceedsLimit({ plan: "basic", used: 5, limit: 5, remaining: 0, unlimited: false }),
    ).toBe(true);
  });

  it("usuário com restante > 0 não excede", () => {
    expect(
      exceedsLimit({ plan: "basic", used: 3, limit: 5, remaining: 2, unlimited: false }),
    ).toBe(false);
  });
});
