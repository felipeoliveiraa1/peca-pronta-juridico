import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { KpiCard } from "@/components/admin/kpi-card";
import { formatCurrencyBRL, formatDateBR } from "@/lib/utils";
import { PLANS, type PlanId } from "@/lib/plans";

export const metadata = { title: "Assinaturas — Admin" };

const NF = new Intl.NumberFormat("pt-BR");

interface PageProps {
  searchParams: Promise<{ status?: string; plan?: string }>;
}

export default async function AdminSubscriptionsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const sb = createServiceClient();

  let q = sb
    .from("subscriptions")
    .select(
      "id, user_id, plan, status, gateway, gateway_subscription_id, current_period_end, cancel_at_period_end, created_at, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(300);

  if (sp.status && sp.status !== "all") q = q.eq("status", sp.status);
  if (sp.plan && sp.plan !== "all") q = q.eq("plan", sp.plan);

  const { data: subs } = await q;
  const rows = subs ?? [];

  // Estatísticas globais (todas, não apenas filtradas)
  const { data: allSubs } = await sb
    .from("subscriptions")
    .select("plan, status");
  const all = allSubs ?? [];

  const activeByPlan: Record<PlanId, number> = {
    free: 0,
    basic: 0,
    premium: 0,
    professional: 0,
  };
  let activeTotal = 0;
  let canceled = 0;
  for (const s of all) {
    if (s.status === "active" || s.status === "trialing") {
      activeTotal++;
      const p = s.plan as PlanId;
      if (p in activeByPlan) activeByPlan[p]++;
    } else if (s.status === "canceled" || s.status === "cancelled") {
      canceled++;
    }
  }
  const mrr =
    activeByPlan.basic * PLANS.basic.priceBRL +
    activeByPlan.premium * PLANS.premium.priceBRL +
    activeByPlan.professional * PLANS.professional.priceBRL;

  const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
  const { data: profiles } =
    userIds.length > 0
      ? await sb.from("profiles").select("id, email").in("id", userIds)
      : { data: [] };
  const emailOf = new Map((profiles ?? []).map((p) => [p.id, p.email]));

  const statuses = Array.from(new Set(all.map((s) => s.status)));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink-900">Assinaturas</h2>
        <p className="mt-1 text-sm text-ink-700">
          Assinaturas Kiwify capturadas via webhook.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="MRR ativo"
          value={formatCurrencyBRL(mrr)}
          hint={`${activeTotal} ativas`}
          accent="emerald"
        />
        <KpiCard
          label="Total registradas"
          value={NF.format(all.length)}
        />
        <KpiCard
          label="Canceladas"
          value={NF.format(canceled)}
          accent="rose"
        />
        <KpiCard
          label="Ativas premium"
          value={NF.format(activeByPlan.premium)}
          hint={`${activeByPlan.basic} estudante · ${activeByPlan.professional} prof.`}
          accent="amber"
        />
      </section>

      <form
        action="/admin/subscriptions"
        className="flex flex-wrap gap-3 rounded-xl border border-ink-200 bg-white p-3 shadow-sm"
      >
        <select
          name="status"
          defaultValue={sp.status ?? "all"}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="all">Todos status</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          name="plan"
          defaultValue={sp.plan ?? "all"}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="all">Todos planos</option>
          {(["basic", "premium", "professional"] as PlanId[]).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          Filtrar
        </button>
        <Link
          href="/admin/subscriptions"
          className="rounded-lg border border-ink-300 px-4 py-2 text-sm text-ink-700 hover:bg-ink-100"
        >
          Limpar
        </Link>
      </form>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-ink-200 bg-white p-10 text-center text-sm text-ink-500">
          Nenhuma assinatura encontrada.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b border-ink-200 bg-ink-100/40 text-xs uppercase tracking-wider text-ink-600">
              <tr>
                <th className="px-4 py-3 text-left">Usuário</th>
                <th className="px-4 py-3 text-left">Plano</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Gateway ID</th>
                <th className="px-4 py-3 text-left">Renova</th>
                <th className="px-4 py-3 text-left">Atualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {rows.map((s) => (
                <tr key={s.id} className="hover:bg-ink-100/30">
                  <td className="px-4 py-3 text-xs">
                    <Link
                      href={`/admin/users/${s.user_id}`}
                      className="text-brand-700 hover:underline"
                    >
                      {emailOf.get(s.user_id) ?? s.user_id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{s.plan}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        s.status === "active" || s.status === "trialing"
                          ? "bg-emerald-100 text-emerald-800"
                          : s.status === "canceled" || s.status === "cancelled"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-ink-200 text-ink-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-ink-500">
                    {s.gateway_subscription_id}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-500">
                    {s.current_period_end ? formatDateBR(s.current_period_end) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-500">
                    {formatDateBR(s.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
