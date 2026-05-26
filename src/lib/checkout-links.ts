import type { PlanId } from "@/lib/plans";

/**
 * URLs públicas de checkout da Kiwify, lidas das variáveis NEXT_PUBLIC_*.
 * Podem ser usadas em componentes client e em links anônimos da landing page.
 * Se a variável estiver vazia em desenvolvimento, caímos para "#planos" para
 * não quebrar a renderização.
 */
export function publicCheckoutUrl(plan: Exclude<PlanId, "free">): string {
  const env =
    plan === "basic"
      ? process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_BASIC
      : plan === "premium"
        ? process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_PREMIUM
        : process.env.NEXT_PUBLIC_KIWIFY_CHECKOUT_PROFESSIONAL;
  return env || "#planos";
}
