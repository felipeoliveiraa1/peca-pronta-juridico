import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { KpiCard } from "@/components/admin/kpi-card";
import { Sparkline } from "@/components/admin/sparkline";
import { formatCurrencyBRL, formatDateBR } from "@/lib/utils";
import { estimateCostBRL, estimateCostUSD, OPENAI_PRICING, USD_TO_BRL } from "@/lib/ai-costs";

export const metadata = { title: "Uso & Custos — Admin" };

const NF = new Intl.NumberFormat("pt-BR");

function daysAgoISO(d: number) {
  const dt = new Date();
  dt.setUTCDate(dt.getUTCDate() - d);
  dt.setUTCHours(0, 0, 0, 0);
  return dt.toISOString();
}

interface PageProps {
  searchParams: Promise<{ kind?: string }>;
}

export default async function AdminUsagePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const sb = createServiceClient();

  let q = sb
    .from("usage_events")
    .select("id, user_id, kind, tokens_in, tokens_out, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (sp.kind && sp.kind !== "all") q = q.eq("kind", sp.kind);

  const [{ data: rows }, { data: allEvents }] = await Promise.all([
    q,
    sb
      .from("usage_events")
      .select("user_id, kind, tokens_in, tokens_out, created_at")
      .gte("created_at", daysAgoISO(30)),
  ]);

  const events = rows ?? [];
  const last30 = allEvents ?? [];

  // KPIs últimos 30 dias por tipo
  const byKind = {
    generation: { count: 0, tokensIn: 0, tokensOut: 0 },
    review: { count: 0, tokensIn: 0, tokensOut: 0 },
    chat: { count: 0, tokensIn: 0, tokensOut: 0 },
  } as Record<string, { count: number; tokensIn: number; tokensOut: number }>;

  for (const e of last30) {
    if (!byKind[e.kind]) continue;
    byKind[e.kind].count++;
    byKind[e.kind].tokensIn += e.tokens_in ?? 0;
    byKind[e.kind].tokensOut += e.tokens_out ?? 0;
  }

  // Custo por dia (30d)
  const dayMap = new Map<string, number>();
  for (const e of last30) {
    const day = e.created_at.slice(0, 10);
    const cost = estimateCostBRL(e.tokens_in ?? 0, e.tokens_out ?? 0);
    dayMap.set(day, (dayMap.get(day) ?? 0) + cost);
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const costSeries: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    // sparkline usa "count", reaproveitamos com centavos pra ter resolução
    costSeries.push({ date: key, count: Math.round((dayMap.get(key) ?? 0) * 100) });
  }

  // Top usuários por consumo (30d)
  const userMap = new Map<string, { tokensIn: number; tokensOut: number; events: number }>();
  for (const e of last30) {
    const cur = userMap.get(e.user_id) ?? { tokensIn: 0, tokensOut: 0, events: 0 };
    cur.tokensIn += e.tokens_in ?? 0;
    cur.tokensOut += e.tokens_out ?? 0;
    cur.events += 1;
    userMap.set(e.user_id, cur);
  }
  const topUsersRaw = Array.from(userMap.entries())
    .map(([userId, v]) => ({
      userId,
      ...v,
      costBRL: estimateCostBRL(v.tokensIn, v.tokensOut),
    }))
    .sort((a, b) => b.costBRL - a.costBRL)
    .slice(0, 10);

  const userIds = topUsersRaw.map((u) => u.userId);
  const { data: topProfiles } =
    userIds.length > 0
      ? await sb.from("profiles").select("id, email, plan").in("id", userIds)
      : { data: [] };
  const profileById = new Map((topProfiles ?? []).map((p) => [p.id, p]));

  const totals30 = {
    tokensIn: last30.reduce((s, e) => s + (e.tokens_in ?? 0), 0),
    tokensOut: last30.reduce((s, e) => s + (e.tokens_out ?? 0), 0),
  };
  const cost30 = estimateCostBRL(totals30.tokensIn, totals30.tokensOut);
  const costUSD30 = estimateCostUSD(totals30.tokensIn, totals30.tokensOut);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink-900">Uso & Custos</h2>
        <p className="mt-1 text-sm text-ink-700">
          Custo OpenAI: US$ {OPENAI_PRICING.inputPerMillion}/1M (in) + US$ {OPENAI_PRICING.outputPerMillion}/1M (out). Cotação fixa R$ {USD_TO_BRL.toFixed(2)}.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Custo total (30d)"
          value={formatCurrencyBRL(cost30)}
          hint={`US$ ${costUSD30.toFixed(2)}`}
          accent="rose"
        />
        <KpiCard
          label="Tokens entrada"
          value={NF.format(totals30.tokensIn)}
        />
        <KpiCard
          label="Tokens saída"
          value={NF.format(totals30.tokensOut)}
        />
        <KpiCard
          label="Eventos IA (30d)"
          value={NF.format(last30.length)}
          hint={`${byKind.generation.count} gerações · ${byKind.chat.count} chat · ${byKind.review.count} revisão`}
        />
      </section>

      {/* Breakdown por tipo */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Breakdown por tipo (30 dias)
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {(["generation", "chat", "review"] as const).map((k) => {
            const b = byKind[k];
            const costBRL = estimateCostBRL(b.tokensIn, b.tokensOut);
            return (
              <div
                key={k}
                className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  {k}
                </div>
                <div className="mt-1 text-xl font-bold text-ink-900">
                  {NF.format(b.count)} eventos
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-ink-700">
                  <div>
                    <div className="text-ink-500">Tokens in</div>
                    <div className="font-mono">{NF.format(b.tokensIn)}</div>
                  </div>
                  <div>
                    <div className="text-ink-500">Tokens out</div>
                    <div className="font-mono">{NF.format(b.tokensOut)}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm font-semibold text-emerald-700">
                  {formatCurrencyBRL(costBRL)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm">
        <Sparkline
          data={costSeries}
          color="rgb(244 63 94)"
          label="Custo OpenAI em centavos por dia (30 dias)"
        />
      </section>

      {/* Top usuários */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Top 10 usuários por custo (30d)
        </h3>
        {topUsersRaw.length === 0 ? (
          <p className="rounded-xl border border-ink-200 bg-white p-6 text-center text-sm text-ink-500">
            Nenhum consumo registrado.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="border-b border-ink-200 bg-ink-100/40 text-xs uppercase tracking-wider text-ink-600">
                <tr>
                  <th className="px-4 py-2 text-left">Usuário</th>
                  <th className="px-4 py-2 text-left">Plano</th>
                  <th className="px-4 py-2 text-right">Eventos</th>
                  <th className="px-4 py-2 text-right">Tokens in</th>
                  <th className="px-4 py-2 text-right">Tokens out</th>
                  <th className="px-4 py-2 text-right">Custo BRL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {topUsersRaw.map((u) => {
                  const profile = profileById.get(u.userId);
                  return (
                    <tr key={u.userId}>
                      <td className="px-4 py-2">
                        <Link
                          href={`/admin/users/${u.userId}`}
                          className="text-brand-700 hover:underline"
                        >
                          {profile?.email ?? u.userId.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-ink-700">{profile?.plan ?? "—"}</td>
                      <td className="px-4 py-2 text-right font-mono">{u.events}</td>
                      <td className="px-4 py-2 text-right font-mono">
                        {NF.format(u.tokensIn)}
                      </td>
                      <td className="px-4 py-2 text-right font-mono">
                        {NF.format(u.tokensOut)}
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-emerald-700">
                        {formatCurrencyBRL(u.costBRL)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Eventos recentes */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Eventos recentes
          </h3>
          <form className="flex gap-2" action="/admin/usage">
            <select
              name="kind"
              defaultValue={sp.kind ?? "all"}
              className="rounded-lg border border-ink-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="generation">generation</option>
              <option value="review">review</option>
              <option value="chat">chat</option>
            </select>
            <button
              type="submit"
              className="rounded-lg bg-brand-700 px-3 py-1 text-xs font-medium text-white hover:bg-brand-800"
            >
              Filtrar
            </button>
          </form>
        </div>
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b border-ink-200 bg-ink-100/40 text-xs uppercase tracking-wider text-ink-600">
              <tr>
                <th className="px-4 py-2 text-left">Quando</th>
                <th className="px-4 py-2 text-left">Tipo</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-right">Tokens in/out</th>
                <th className="px-4 py-2 text-right">Custo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {events.map((e) => {
                const cost = estimateCostBRL(e.tokens_in ?? 0, e.tokens_out ?? 0);
                return (
                  <tr key={e.id}>
                    <td className="px-4 py-2 text-xs text-ink-500">
                      {formatDateBR(e.created_at)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          e.kind === "generation"
                            ? "bg-emerald-100 text-emerald-800"
                            : e.kind === "chat"
                              ? "bg-violet-100 text-violet-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {e.kind}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs">
                      <Link
                        href={`/admin/users/${e.user_id}`}
                        className="text-brand-700 hover:underline"
                      >
                        {e.user_id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-xs">
                      {NF.format(e.tokens_in ?? 0)} / {NF.format(e.tokens_out ?? 0)}
                    </td>
                    <td className="px-4 py-2 text-right text-xs font-semibold text-emerald-700">
                      {formatCurrencyBRL(cost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
