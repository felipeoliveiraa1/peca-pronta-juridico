import { NextResponse } from "next/server";
import { z } from "zod";
import { PAID_PLANS, type PlanId } from "@/lib/plans";
import { buildCheckoutUrl } from "@/lib/kiwify";
import { getCurrentProfile } from "@/lib/profile";

export const runtime = "nodejs";

const schema = z.object({
  plan: z.enum(PAID_PLANS as [PlanId, ...PlanId[]]),
});

/**
 * Resolve um link público de checkout da Kiwify para o plano solicitado, com
 * `email`, `name` e `sck` pré-preenchidos. O front faz `window.location =`.
 */
export async function POST(req: Request) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  const url = buildCheckoutUrl({
    plan: parsed.data.plan as Exclude<PlanId, "free">,
    email: profile.email,
    name: profile.full_name,
    userId: profile.id,
  });

  if (!url) {
    return NextResponse.json(
      {
        error:
          "Link de checkout não configurado para este plano. Defina NEXT_PUBLIC_KIWIFY_CHECKOUT_* no .env.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ url });
}
