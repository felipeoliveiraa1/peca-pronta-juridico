import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import { PLANS, type PlanId } from "@/lib/plans";
import { estimateCostBRL, estimateCostUSD } from "@/lib/ai-costs";

export interface KpiSummary {
  users: {
    total: number;
    newLast30d: number;
    newLast7d: number;
    activeLast30d: number;
    byPlan: Record<PlanId, number>;
  };
  documents: {
    total: number;
    last30d: number;
    last7d: number;
  };
  generations: {
    last30d: number;
    last7d: number;
    today: number;
  };
  chat: {
    messagesLast30d: number;
    messagesLast7d: number;
    activeUsersLast30d: number;
  };
  ai: {
    tokensInLast30d: number;
    tokensOutLast30d: number;
    costUSDLast30d: number;
    costBRLLast30d: number;
    tokensInTotal: number;
    tokensOutTotal: number;
    costUSDTotal: number;
    costBRLTotal: number;
  };
  revenue: {
    mrrEstimatedBRL: number;
    paidUsers: number;
  };
  series: {
    /** Últimos 30 dias: gerações por dia */
    generationsByDay: { date: string; count: number }[];
    /** Últimos 30 dias: cadastros por dia */
    signupsByDay: { date: string; count: number }[];
  };
}

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function todayStartISO(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function dateKey(iso: string): string {
  return iso.slice(0, 10); // YYYY-MM-DD
}

function buildDailySeries(
  rows: { created_at: string }[],
  days: number,
): { date: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = dateKey(r.created_at);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  const series: { date: string; count: number }[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: map.get(key) ?? 0 });
  }
  return series;
}

export async function getKpiSummary(): Promise<KpiSummary> {
  const sb = createServiceClient();
  const now30 = daysAgoISO(30);
  const now7 = daysAgoISO(7);
  const todayStart = todayStartISO();

  // --- Profiles
  const { data: profilesRaw } = await sb
    .from("profiles")
    .select("id, plan, created_at");
  const profiles = profilesRaw ?? [];

  const byPlan: Record<PlanId, number> = {
    free: 0,
    basic: 0,
    premium: 0,
    professional: 0,
  };
  for (const p of profiles) {
    const plan = (p.plan as PlanId) ?? "free";
    if (plan in byPlan) byPlan[plan]++;
  }

  const newLast30d = profiles.filter((p) => p.created_at >= now30).length;
  const newLast7d = profiles.filter((p) => p.created_at >= now7).length;

  // --- Documents
  const { data: documentsRaw } = await sb
    .from("documents")
    .select("id, user_id, created_at");
  const documents = documentsRaw ?? [];
  const docsLast30 = documents.filter((d) => d.created_at >= now30);
  const docsLast7 = documents.filter((d) => d.created_at >= now7);

  // --- Usage events (generation / review / chat)
  const { data: usageRaw } = await sb
    .from("usage_events")
    .select("id, user_id, kind, tokens_in, tokens_out, created_at");
  const usage = usageRaw ?? [];

  const generations = usage.filter((u) => u.kind === "generation");
  const generationsLast30 = generations.filter((u) => u.created_at >= now30);
  const generationsLast7 = generations.filter((u) => u.created_at >= now7);
  const generationsToday = generations.filter((u) => u.created_at >= todayStart);

  const chatEvents = usage.filter((u) => u.kind === "chat");
  const chatLast30 = chatEvents.filter((u) => u.created_at >= now30);
  const chatLast7 = chatEvents.filter((u) => u.created_at >= now7);
  const chatActiveUsers30 = new Set(chatLast30.map((u) => u.user_id)).size;

  const activeUserIds30 = new Set<string>();
  for (const u of usage) {
    if (u.created_at >= now30) activeUserIds30.add(u.user_id);
  }

  // --- Tokens / cost
  let tokensIn30 = 0,
    tokensOut30 = 0,
    tokensInTotal = 0,
    tokensOutTotal = 0;
  for (const u of usage) {
    const i = u.tokens_in ?? 0;
    const o = u.tokens_out ?? 0;
    tokensInTotal += i;
    tokensOutTotal += o;
    if (u.created_at >= now30) {
      tokensIn30 += i;
      tokensOut30 += o;
    }
  }

  // --- Revenue
  const paidUsers = byPlan.basic + byPlan.premium + byPlan.professional;
  const mrr =
    byPlan.basic * PLANS.basic.priceBRL +
    byPlan.premium * PLANS.premium.priceBRL +
    byPlan.professional * PLANS.professional.priceBRL;

  // --- Series
  const generationsByDay = buildDailySeries(
    generations.filter((u) => u.created_at >= now30),
    30,
  );
  const signupsByDay = buildDailySeries(
    profiles.filter((p) => p.created_at >= now30),
    30,
  );

  return {
    users: {
      total: profiles.length,
      newLast30d,
      newLast7d,
      activeLast30d: activeUserIds30.size,
      byPlan,
    },
    documents: {
      total: documents.length,
      last30d: docsLast30.length,
      last7d: docsLast7.length,
    },
    generations: {
      last30d: generationsLast30.length,
      last7d: generationsLast7.length,
      today: generationsToday.length,
    },
    chat: {
      messagesLast30d: chatLast30.length,
      messagesLast7d: chatLast7.length,
      activeUsersLast30d: chatActiveUsers30,
    },
    ai: {
      tokensInLast30d: tokensIn30,
      tokensOutLast30d: tokensOut30,
      costUSDLast30d: estimateCostUSD(tokensIn30, tokensOut30),
      costBRLLast30d: estimateCostBRL(tokensIn30, tokensOut30),
      tokensInTotal,
      tokensOutTotal,
      costUSDTotal: estimateCostUSD(tokensInTotal, tokensOutTotal),
      costBRLTotal: estimateCostBRL(tokensInTotal, tokensOutTotal),
    },
    revenue: {
      mrrEstimatedBRL: mrr,
      paidUsers,
    },
    series: {
      generationsByDay,
      signupsByDay,
    },
  };
}
