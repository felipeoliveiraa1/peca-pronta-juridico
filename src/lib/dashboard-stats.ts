import { createClient } from "@/lib/supabase/server";
import { startOfCurrentMonthISO } from "@/lib/utils";

export interface DashboardStats {
  totalDocuments: number;
  monthlyGenerations: number;
  totalGenerations: number;
  finalizedDocuments: number;
  estimatedMinutesSaved: number;
  daily: { date: string; count: number }[]; // últimos 30 dias
  uniquePieceTypes: number;
  averageTokensPerPiece: number;
}

/**
 * Carrega métricas do usuário para o dashboard home.
 * Métrica "minutos economizados" é uma estimativa pedagógica (≈ 90 min por
 * peça vs ~30s gerados pela IA — total = 89.5 * n).
 */
export async function loadDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createClient();

  const [docsRes, eventsRes, monthlyRes, dailyRes] = await Promise.all([
    supabase
      .from("documents")
      .select("id, status, piece_type", { count: "exact" })
      .eq("user_id", userId),
    supabase
      .from("usage_events")
      .select("tokens_in, tokens_out, kind", { count: "exact" })
      .eq("user_id", userId)
      .eq("kind", "generation"),
    supabase
      .from("usage_events")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("kind", "generation")
      .gte("created_at", startOfCurrentMonthISO()),
    supabase
      .from("usage_events")
      .select("created_at")
      .eq("user_id", userId)
      .eq("kind", "generation")
      .gte("created_at", new Date(Date.now() - 30 * 24 * 3600_000).toISOString())
      .order("created_at", { ascending: true }),
  ]);

  const totalDocuments = docsRes.count ?? 0;
  const totalGenerations = eventsRes.count ?? 0;
  const monthlyGenerations = monthlyRes.count ?? 0;
  const finalizedDocuments = (docsRes.data ?? []).filter((d) => d.status === "final").length;
  const uniquePieceTypes = new Set((docsRes.data ?? []).map((d) => d.piece_type)).size;

  const tokensOut = (eventsRes.data ?? []).reduce(
    (sum, e) => sum + (e.tokens_out ?? 0),
    0,
  );
  const averageTokensPerPiece = totalGenerations
    ? Math.round(tokensOut / totalGenerations)
    : 0;

  // Bucket por dia
  const buckets = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }
  for (const event of dailyRes.data ?? []) {
    const key = event.created_at.slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const daily = Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));

  return {
    totalDocuments,
    monthlyGenerations,
    totalGenerations,
    finalizedDocuments,
    estimatedMinutesSaved: Math.round(totalGenerations * 89.5),
    daily,
    uniquePieceTypes,
    averageTokensPerPiece,
  };
}
