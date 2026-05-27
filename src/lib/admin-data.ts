import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import { PLANS, type PlanId } from "@/lib/plans";
import { estimateCostBRL, estimateCostUSD } from "@/lib/ai-costs";
import { isAdminEmail } from "@/lib/admin";

/**
 * Carrega o set de profile IDs cujos emails são admin — usado para
 * excluir admins de todos os KPIs, listas e contagens do painel.
 */
export async function getAdminUserIds(): Promise<Set<string>> {
  const sb = createServiceClient();
  const { data } = await sb.from("profiles").select("id, email");
  const ids = new Set<string>();
  for (const p of data ?? []) {
    if (isAdminEmail(p.email)) ids.add(p.id);
  }
  return ids;
}

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
  subscriptions: {
    active: number;
    canceled: number;
    refunded: number;
    chargeback: number;
    pastDue: number;
    other: number;
    activeByPlan: Record<PlanId, number>;
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

  // --- Profiles (admins excluídos das estatísticas)
  const { data: profilesRaw } = await sb
    .from("profiles")
    .select("id, email, plan, created_at");
  const adminIds = new Set<string>();
  for (const p of profilesRaw ?? []) {
    if (isAdminEmail(p.email)) adminIds.add(p.id);
  }
  const profiles = (profilesRaw ?? []).filter((p) => !adminIds.has(p.id));

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

  // --- Documents (admins fora)
  const { data: documentsRaw } = await sb
    .from("documents")
    .select("id, user_id, created_at");
  const documents = (documentsRaw ?? []).filter((d) => !adminIds.has(d.user_id));
  const docsLast30 = documents.filter((d) => d.created_at >= now30);
  const docsLast7 = documents.filter((d) => d.created_at >= now7);

  // --- Usage events (admins fora)
  const { data: usageRaw } = await sb
    .from("usage_events")
    .select("id, user_id, kind, tokens_in, tokens_out, created_at");
  const usage = (usageRaw ?? []).filter((u) => !adminIds.has(u.user_id));

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

  // --- Subscriptions / Revenue (baseado em status real, não em profile.plan)
  const { data: subsRaw } = await sb
    .from("subscriptions")
    .select("user_id, plan, status");
  const subs = (subsRaw ?? []).filter((s) => !adminIds.has(s.user_id));

  const activeByPlanSubs: Record<PlanId, number> = {
    free: 0,
    basic: 0,
    premium: 0,
    professional: 0,
  };
  let subActive = 0;
  let subCanceled = 0;
  let subRefunded = 0;
  let subChargeback = 0;
  let subPastDue = 0;
  let subOther = 0;
  // Mantém só a assinatura mais recente por user, por status (evita duplicar
  // user que comprou, foi reembolsado, recomprou — só conta o estado atual).
  // Mas pra MRR é mais simples: soma todas as ativas.
  for (const s of subs) {
    const st = (s.status ?? "").toLowerCase();
    if (st === "active" || st === "trialing" || st === "paid") subActive++;
    else if (st === "canceled" || st === "cancelled") subCanceled++;
    else if (st === "refunded") subRefunded++;
    else if (st === "chargeback") subChargeback++;
    else if (st === "past_due") subPastDue++;
    else subOther++;
  }

  // MRR efetivo = só profiles cujo plan está pago E que NÃO têm subscription
  // ativa em status terminal (refunded/canceled/chargeback) recente.
  const terminalStatuses = new Set([
    "canceled",
    "cancelled",
    "refunded",
    "chargeback",
    "rejected",
  ]);
  const usersWithTerminalSub = new Set<string>();
  for (const s of subs) {
    const st = (s.status ?? "").toLowerCase();
    if (terminalStatuses.has(st)) usersWithTerminalSub.add(s.user_id);
  }
  const usersWithActiveSub = new Set<string>();
  for (const s of subs) {
    const st = (s.status ?? "").toLowerCase();
    if (st === "active" || st === "trialing" || st === "paid") {
      usersWithActiveSub.add(s.user_id);
    }
  }
  // Considera "pagante" quem: tem plano pago E (tem sub ativa OU nunca teve
  // sub com status terminal). Filtra reembolsados/cancelados do MRR.
  let mrr = 0;
  let paidUsers = 0;
  for (const p of profiles) {
    const plan = (p.plan as PlanId) ?? "free";
    if (plan === "free") continue;
    const isTerminal = usersWithTerminalSub.has(p.id);
    const isActive = usersWithActiveSub.has(p.id);
    // Se tem sub ativa, conta. Se não tem sub registrada nenhuma, conta também
    // (talvez plano foi ajustado manualmente). Se só tem terminal, NÃO conta.
    if (isActive || !isTerminal) {
      mrr += PLANS[plan].priceBRL;
      paidUsers += 1;
      if (plan in activeByPlanSubs) activeByPlanSubs[plan]++;
    }
  }

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
    subscriptions: {
      active: subActive,
      canceled: subCanceled,
      refunded: subRefunded,
      chargeback: subChargeback,
      pastDue: subPastDue,
      other: subOther,
      activeByPlan: activeByPlanSubs,
    },
    series: {
      generationsByDay,
      signupsByDay,
    },
  };
}
