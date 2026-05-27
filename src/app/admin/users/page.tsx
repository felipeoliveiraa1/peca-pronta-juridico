import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { formatDateBR } from "@/lib/utils";
import { PLANS, type PlanId } from "@/lib/plans";
import { isAdminEmail } from "@/lib/admin";
import { UsersTable } from "./users-table";

interface PageProps {
  searchParams: Promise<{ q?: string; plan?: string }>;
}

export const metadata = { title: "Usuários — Admin" };

const PLAN_LABELS: Record<PlanId, string> = {
  free: "Grátis",
  basic: "Estudante",
  premium: "Premium",
  professional: "Profissional",
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const sb = createServiceClient();

  let query = sb
    .from("profiles")
    .select("id, email, full_name, plan, created_at, trial_ends_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (sp.plan && sp.plan !== "all") query = query.eq("plan", sp.plan);
  if (sp.q?.trim()) query = query.or(`email.ilike.%${sp.q.trim()}%,full_name.ilike.%${sp.q.trim()}%`);

  const { data: profilesRaw } = await query;
  const profiles = (profilesRaw ?? []).filter((p) => !isAdminEmail(p.email));

  // Conta de documentos e mensagens por usuário (uma query agregada por
  // chamada — em volume baixo é barato).
  const userIds = profiles.map((p) => p.id);
  let docCounts = new Map<string, number>();
  let msgCounts = new Map<string, number>();
  if (userIds.length > 0) {
    const { data: docRows } = await sb
      .from("documents")
      .select("user_id")
      .in("user_id", userIds);
    for (const r of docRows ?? []) {
      docCounts.set(r.user_id, (docCounts.get(r.user_id) ?? 0) + 1);
    }
    const { data: msgRows } = await sb
      .from("chat_messages")
      .select("user_id")
      .in("user_id", userIds)
      .eq("role", "user");
    for (const r of msgRows ?? []) {
      msgCounts.set(r.user_id, (msgCounts.get(r.user_id) ?? 0) + 1);
    }
  }

  const enriched = profiles.map((p) => ({
    id: p.id,
    email: p.email,
    full_name: p.full_name ?? "",
    plan: p.plan as PlanId,
    planLabel: PLAN_LABELS[p.plan as PlanId] ?? p.plan,
    created_at_br: formatDateBR(p.created_at),
    created_at_iso: p.created_at,
    documents: docCounts.get(p.id) ?? 0,
    messages: msgCounts.get(p.id) ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink-900">Usuários</h2>
        <p className="mt-1 text-sm text-ink-700">
          {enriched.length} resultado(s) — busque por email/nome, filtre por plano,
          mude planos ou remova contas.
        </p>
      </div>

      <form
        className="flex flex-wrap gap-3 rounded-xl border border-ink-200 bg-white p-3 shadow-sm"
        action="/admin/users"
      >
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Buscar email ou nome…"
          className="flex-1 rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <select
          name="plan"
          defaultValue={sp.plan ?? "all"}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="all">Todos os planos</option>
          {(["free", "basic", "premium", "professional"] as PlanId[]).map((p) => (
            <option key={p} value={p}>
              {PLAN_LABELS[p]}
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
          href="/admin/users"
          className="rounded-lg border border-ink-300 px-4 py-2 text-sm text-ink-700 hover:bg-ink-100"
        >
          Limpar
        </Link>
      </form>

      <UsersTable users={enriched} />
    </div>
  );
}
