"use client";

import { ArrowRight, Check, Crown, ShieldCheck, Star } from "lucide-react";
import { PLANS, type PlanId } from "@/lib/plans";
import { formatCurrencyBRL, cn } from "@/lib/utils";
import { publicCheckoutUrl } from "@/lib/checkout-links";
import { trackEvent } from "@/lib/meta-pixel";
import { appendUtmsToKiwifyUrl } from "@/lib/utm-tracking";

const ORDER: PlanId[] = ["basic", "premium", "professional"];

// Preços "cheios" (riscados) — referência de mercado para mostrar o desconto.
const STRIKE: Record<string, number> = {
  basic: 39.9,
  premium: 89.9,
  professional: 149.9,
};

export function Pricing() {
  return (
    <section id="planos" className="section bg-gradient-to-b from-brand-50/60 via-white to-brand-50/30">
      <div className="container-page">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            🎁 Oferta de lançamento
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Escolha o Plano Ideal para Você e Sua Carreira
          </h2>
          <p className="mt-3 text-base text-ink-700">
            Cobrança mensal · Cancele quando quiser · <strong>Acesso imediato após o pagamento</strong>.
          </p>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ORDER.map((id) => {
            const plan = PLANS[id as Exclude<PlanId, "free">];
            const highlight = id === "premium";
            const strike = STRIKE[id];
            const off = Math.round(((strike - plan.priceBRL) / strike) * 100);
            const url = publicCheckoutUrl(id as Exclude<PlanId, "free">);
            return (
              <article
                key={id}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-white p-6 shadow-card transition hover:-translate-y-1",
                  highlight ? "border-emerald-400 ring-4 ring-emerald-100" : "border-ink-300/70",
                )}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                    <Star className="h-3 w-3 fill-white text-white" /> Mais escolhido · 80% das vendas
                  </div>
                )}
                <header className="mt-2">
                  <div className="flex items-center gap-2">
                    {highlight && <Crown className="h-4 w-4 text-amber-500" />}
                    <h3 className="text-base font-bold text-ink-900">{plan.name}</h3>
                  </div>
                  <p className="mt-1 text-xs text-ink-500">{plan.audience}</p>

                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-sm text-ink-500 line-through">
                      {formatCurrencyBRL(strike)}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                      -{off}%
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-emerald-600">
                      {formatCurrencyBRL(plan.priceBRL)}
                    </span>
                    <span className="text-sm text-ink-500">/mês</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    ou <strong>{formatCurrencyBRL(plan.priceBRL / 3)}</strong> em 3x sem juros
                  </p>
                </header>

                <ul className="mt-5 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={url}
                  onClick={(e) => {
                    // Dispara InitiateCheckout no Pixel client
                    trackEvent("InitiateCheckout", {
                      value: plan.priceBRL,
                      currency: "BRL",
                      content_name: `Plano ${plan.name}`,
                      content_ids: [id],
                      content_type: "product",
                    });
                    // Propaga UTMs/fbclid persistidos pra Kiwify capturar
                    // (sem isso a Kiwify recebe TrackingParameters = null
                    // e a gente perde a atribuição de qual ad converteu).
                    const enriched = appendUtmsToKiwifyUrl(url);
                    if (enriched !== url) {
                      e.preventDefault();
                      window.location.href = enriched;
                    }
                  }}
                  className={cn(
                    "mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl font-extrabold uppercase tracking-wide text-white transition hover:scale-[1.02]",
                    highlight
                      ? "bg-emerald-500 shadow-lg shadow-emerald-500/30 hover:bg-emerald-600"
                      : "bg-brand-700 hover:bg-brand-800",
                  )}
                >
                  {highlight ? "QUERO O PREMIUM" : "Assinar"} <ArrowRight className="h-4 w-4" />
                </a>

                <p className="mt-3 text-center text-[11px] text-ink-500">
                  💳 Cartão · PIX · Boleto · 🔒 Pagamento seguro
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 mx-auto max-w-xl rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 p-5 text-center">
          <div className="inline-flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
            <strong className="text-sm uppercase tracking-wide">Garantia de Satisfação</strong>
          </div>
          <p className="mt-2 text-sm text-ink-700">
            Cancele a qualquer momento na área do cliente da Kiwify — sem multa, sem burocracia.
            Você só paga enquanto estiver usando.
          </p>
        </div>
      </div>
    </section>
  );
}
