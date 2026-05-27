import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, MessageSquare, Sparkles, Zap } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { KpiCard } from "@/components/admin/kpi-card";
import { formatCurrencyBRL, formatDateBR } from "@/lib/utils";
import { estimateCostBRL, estimateCostUSD } from "@/lib/ai-costs";
import { PLANS, type PlanId } from "@/lib/plans";

interface PageProps {
  params: Promise<{ id: string }>;
}

const NF = new Intl.NumberFormat("pt-BR");

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const sb = createServiceClient();

  const { data: profile } = await sb
    .from("profiles")
    .select("id, email, full_name, plan, created_at, trial_ends_at, gateway_customer_id")
    .eq("id", id)
    .maybeSingle();

  if (!profile) notFound();

  const [{ data: documents }, { data: usage }, { data: messages }, { data: subs }] =
    await Promise.all([
      sb
        .from("documents")
        .select("id, title, piece_type, area, status, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(50),
      sb
        .from("usage_events")
        .select("id, kind, tokens_in, tokens_out, created_at, metadata")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(200),
      sb
        .from("chat_messages")
        .select("id, conversation_id, role, content, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(50),
      sb
        .from("subscriptions")
        .select("id, plan, status, gateway, gateway_subscription_id, current_period_end")
        .eq("user_id", id),
    ]);

  const usageRows = usage ?? [];
  const tokensIn = usageRows.reduce((s, r) => s + (r.tokens_in ?? 0), 0);
  const tokensOut = usageRows.reduce((s, r) => s + (r.tokens_out ?? 0), 0);
  const generationsCount = usageRows.filter((r) => r.kind === "generation").length;
  const chatCount = usageRows.filter((r) => r.kind === "chat").length;
  const reviewCount = usageRows.filter((r) => r.kind === "review").length;
  const planLabel = PLANS[(profile.plan as PlanId) ?? "free"].name;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1 text-sm text-ink-600 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-ink-900">
              {profile.full_name || profile.email.split("@")[0]}
            </h2>
            <p className="text-sm text-ink-500">{profile.email}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-600">
              <span>Plano: <strong>{planLabel}</strong></span>
              <span>Cadastrado em {formatDateBR(profile.created_at)}</span>
              {profile.gateway_customer_id && (
                <span>Kiwify ID: {profile.gateway_customer_id}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Documentos"
          value={NF.format(documents?.length ?? 0)}
          icon={FileText}
        />
        <KpiCard
          label="Gerações"
          value={NF.format(generationsCount)}
          hint={`${reviewCount} revisões`}
          icon={Sparkles}
          accent="emerald"
        />
        <KpiCard
          label="Msgs chat"
          value={NF.format(chatCount)}
          icon={MessageSquare}
          accent="violet"
        />
        <KpiCard
          label="Custo IA"
          value={formatCurrencyBRL(estimateCostBRL(tokensIn, tokensOut))}
          hint={`US$ ${estimateCostUSD(tokensIn, tokensOut).toFixed(4)}`}
          icon={Zap}
          accent="rose"
        />
      </section>

      {/* Documentos */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-ink-900">
          Documentos ({documents?.length ?? 0})
        </h3>
        {!documents?.length ? (
          <p className="rounded-xl border border-ink-200 bg-white p-6 text-center text-sm text-ink-500">
            Nenhum documento.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="border-b border-ink-200 bg-ink-100/40 text-xs uppercase tracking-wider text-ink-600">
                <tr>
                  <th className="px-4 py-2 text-left">Título</th>
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Área</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {documents.map((d) => (
                  <tr key={d.id}>
                    <td className="px-4 py-2 font-medium text-ink-900">{d.title}</td>
                    <td className="px-4 py-2 text-ink-700">{d.piece_type}</td>
                    <td className="px-4 py-2 text-ink-700">{d.area ?? "—"}</td>
                    <td className="px-4 py-2 text-ink-700">{d.status}</td>
                    <td className="px-4 py-2 text-xs text-ink-500">
                      {formatDateBR(d.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Assinaturas */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-ink-900">
          Assinaturas ({subs?.length ?? 0})
        </h3>
        {!subs?.length ? (
          <p className="rounded-xl border border-ink-200 bg-white p-6 text-center text-sm text-ink-500">
            Nenhuma assinatura registrada.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="border-b border-ink-200 bg-ink-100/40 text-xs uppercase tracking-wider text-ink-600">
                <tr>
                  <th className="px-4 py-2 text-left">Gateway ID</th>
                  <th className="px-4 py-2 text-left">Plano</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Renova em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {subs.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-2 font-mono text-xs">
                      {s.gateway_subscription_id}
                    </td>
                    <td className="px-4 py-2 text-ink-700">{s.plan}</td>
                    <td className="px-4 py-2 text-ink-700">{s.status}</td>
                    <td className="px-4 py-2 text-xs text-ink-500">
                      {s.current_period_end ? formatDateBR(s.current_period_end) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Últimas mensagens de chat */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-ink-900">
          Últimas mensagens ({messages?.length ?? 0})
        </h3>
        {!messages?.length ? (
          <p className="rounded-xl border border-ink-200 bg-white p-6 text-center text-sm text-ink-500">
            Nenhuma mensagem.
          </p>
        ) : (
          <div className="space-y-2">
            {messages.slice(0, 20).map((m) => (
              <div
                key={m.id}
                className="rounded-lg border border-ink-200 bg-white p-3 shadow-sm"
              >
                <div className="mb-1 flex items-center gap-2 text-xs">
                  <span
                    className={`rounded-full px-2 py-0.5 font-bold ${
                      m.role === "user"
                        ? "bg-brand-100 text-brand-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {m.role}
                  </span>
                  <span className="text-ink-500">{formatDateBR(m.created_at)}</span>
                </div>
                <p className="line-clamp-3 text-sm text-ink-800">{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
