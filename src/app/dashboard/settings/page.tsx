import Link from "next/link";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";
import { requireProfile } from "@/lib/profile";
import { getPlan, PLANS, type PlanId } from "@/lib/plans";
import { formatCurrencyBRL, formatDateBR, cn } from "@/lib/utils";
import { getCurrentUsage } from "@/lib/usage";
import { CheckoutButton, KiwifyCustomerAreaButton } from "./billing-actions";
import { SettingsTour } from "@/components/dashboard/tour-steps";

export const metadata = { title: "Plano e cobrança — Peça Pronta" };

interface PageProps {
  searchParams: Promise<{ upgrade?: string; checkout?: string }>;
}

const ORDER: PlanId[] = ["basic", "premium", "professional"];

export default async function SettingsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const profile = await requireProfile();
  const planDef = getPlan(profile.plan);
  const usage = await getCurrentUsage(profile.id, profile.plan);

  return (
    <div className="space-y-6">
      <SettingsTour />
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Plano e cobrança</h1>
        <p className="mt-1 text-sm text-ink-700">
          Gerencie sua assinatura, faça upgrade e atualize seu método de pagamento.
        </p>
      </div>

      {sp.checkout === "success" && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Pagamento confirmado! Pode levar alguns segundos para o plano ser ativado.
        </div>
      )}
      {sp.checkout === "cancelled" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Checkout cancelado. Nenhuma cobrança foi feita.
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{planDef.name}</CardTitle>
              <CardDescription>{planDef.audience}</CardDescription>
            </div>
            <Badge variant={planDef.id === "free" ? "outline" : "success"}>
              {planDef.id === "free" ? "Ativo (grátis)" : "Ativo"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Preço atual" value={planDef.priceBRL === 0 ? "Grátis" : `${formatCurrencyBRL(planDef.priceBRL)}/mês`} />
            <Stat
              label="Uso do mês"
              value={
                usage.limit == null
                  ? `${usage.used} peças (ilimitado)`
                  : `${usage.used} / ${usage.limit} peças`
              }
            />
            <Stat
              label="Próxima renovação"
              value={profile.trial_ends_at ? `em ${formatDateBR(profile.trial_ends_at)}` : "—"}
            />
          </div>
          {profile.plan !== "free" && (
            <div className="mt-6">
              <Suspense>
                <KiwifyCustomerAreaButton />
              </Suspense>
              <p className="mt-2 text-xs text-ink-500">
                Você gerencia método de pagamento, faturas e cancelamento direto na área do cliente da Kiwify.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink-900">Outros planos</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {ORDER.map((id) => {
            const plan = PLANS[id];
            const isCurrent = id === profile.plan;
            const isUpgradeRequested = sp.upgrade === id;
            return (
              <article
                key={id}
                className={cn(
                  "rounded-2xl border bg-white p-6 shadow-card",
                  isUpgradeRequested ? "border-brand-500 ring-2 ring-brand-500/20" : "border-ink-300/70",
                )}
              >
                <header className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">{plan.name}</h3>
                  {id === "premium" && (
                    <Badge variant="default">
                      <Crown className="mr-1 h-3 w-3" /> Recomendado
                    </Badge>
                  )}
                </header>
                <div className="mt-3 text-2xl font-semibold">
                  {formatCurrencyBRL(plan.priceBRL)}
                  <span className="text-sm font-normal text-ink-500">/mês</span>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm text-ink-700">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  {isCurrent ? (
                    <Button disabled variant="secondary" className="w-full">
                      Plano atual
                    </Button>
                  ) : (
                    <CheckoutButton plan={id} />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Card>
        <CardContent className="flex flex-col gap-2 py-6 text-sm text-ink-700">
          <p>
            <strong>Como funciona o cancelamento?</strong> Você pode cancelar a sua assinatura a
            qualquer momento direto na área do cliente da Kiwify, sem multa nem fidelidade. O acesso
            permanece liberado até o fim do período já pago.
          </p>
          <p>
            Para suporte, envie e-mail para <Link href="mailto:suporte@pecapronta.app" className="text-brand-700 underline">suporte@pecapronta.app</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-300/70 bg-ink-100/40 px-4 py-3">
      <div className="text-xs uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-ink-900">{value}</div>
    </div>
  );
}
