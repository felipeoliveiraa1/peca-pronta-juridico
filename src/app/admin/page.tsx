import {
  Users,
  FileText,
  Sparkles,
  MessageSquare,
  DollarSign,
  CreditCard,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { getKpiSummary } from "@/lib/admin-data";
import { KpiCard } from "@/components/admin/kpi-card";
import { Sparkline } from "@/components/admin/sparkline";
import { formatCurrencyBRL } from "@/lib/utils";
import { PLANS } from "@/lib/plans";

const NF = new Intl.NumberFormat("pt-BR");

export default async function AdminOverviewPage() {
  const k = await getKpiSummary();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-ink-900">Overview</h2>
        <p className="mt-1 text-sm text-ink-700">
          KPIs em tempo real — usuários, receita, geração, chat e custos de IA.
        </p>
      </div>

      {/* Receita & usuários */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Receita & usuários
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard
            label="MRR efetivo"
            value={formatCurrencyBRL(k.revenue.mrrEstimatedBRL)}
            hint={`${k.revenue.paidUsers} pagantes (reembolsados fora)`}
            icon={DollarSign}
            accent="emerald"
          />
          <KpiCard
            label="Total de usuários"
            value={NF.format(k.users.total)}
            hint={`+${k.users.newLast30d} nos últimos 30 dias`}
            icon={Users}
            accent="violet"
          />
          <KpiCard
            label="Novos (7 dias)"
            value={NF.format(k.users.newLast7d)}
            hint={`${NF.format(k.users.newLast30d)} em 30 dias`}
            icon={Users}
          />
          <KpiCard
            label="Ativos (30 dias)"
            value={NF.format(k.users.activeLast30d)}
            hint="Geraram peça ou usaram chat"
            icon={Activity}
            accent="amber"
          />
        </div>
      </section>

      {/* Status das assinaturas */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Status das assinaturas (registros Kiwify)
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <KpiCard
            label="Ativas"
            value={NF.format(k.subscriptions.active)}
            hint={`${k.subscriptions.activeByPlan.basic} estudante · ${k.subscriptions.activeByPlan.premium} premium · ${k.subscriptions.activeByPlan.professional} prof.`}
            icon={CheckCircle2}
            accent="emerald"
          />
          <KpiCard
            label="Canceladas"
            value={NF.format(k.subscriptions.canceled)}
            hint="Usuário cancelou — não vira free até o fim do ciclo"
            icon={XCircle}
          />
          <KpiCard
            label="Reembolsadas"
            value={NF.format(k.subscriptions.refunded)}
            hint="Pediram refund (fora do MRR)"
            icon={RotateCcw}
            accent="rose"
          />
          <KpiCard
            label="Chargeback"
            value={NF.format(k.subscriptions.chargeback)}
            hint="Disputa de cartão"
            icon={AlertTriangle}
            accent="rose"
          />
          <KpiCard
            label="Em atraso"
            value={NF.format(k.subscriptions.pastDue)}
            hint="Renovação pendente"
            icon={AlertTriangle}
            accent="amber"
          />
        </div>
      </section>

      {/* Distribuição por plano */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Distribuição por plano
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["free", "basic", "premium", "professional"] as const).map((p) => {
            const count = k.users.byPlan[p];
            const pct = k.users.total > 0 ? (count / k.users.total) * 100 : 0;
            return (
              <div
                key={p}
                className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm"
              >
                <div className="text-[10px] uppercase tracking-wider text-ink-500">
                  {PLANS[p].name.split(" ")[0]}
                </div>
                <div className="mt-1 text-2xl font-bold text-ink-900">
                  {NF.format(count)}
                </div>
                <div className="text-xs text-ink-500">
                  {pct.toFixed(1)}% do total
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-200">
                  <div
                    className="h-full bg-brand-600"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {PLANS[p].priceBRL > 0 && (
                  <div className="mt-2 text-xs text-emerald-700">
                    {formatCurrencyBRL(count * PLANS[p].priceBRL)}/mês
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Atividade IA */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Atividade & IA
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard
            label="Peças geradas (30d)"
            value={NF.format(k.generations.last30d)}
            hint={`${NF.format(k.generations.today)} hoje · ${NF.format(k.generations.last7d)} em 7d`}
            icon={Sparkles}
            accent="emerald"
          />
          <KpiCard
            label="Total de documentos"
            value={NF.format(k.documents.total)}
            hint={`+${NF.format(k.documents.last30d)} em 30d`}
            icon={FileText}
          />
          <KpiCard
            label="Mensagens de chat (30d)"
            value={NF.format(k.chat.messagesLast30d)}
            hint={`${NF.format(k.chat.activeUsersLast30d)} usuários únicos`}
            icon={MessageSquare}
            accent="violet"
          />
          <KpiCard
            label="Custo IA (30d)"
            value={formatCurrencyBRL(k.ai.costBRLLast30d)}
            hint={`US$ ${k.ai.costUSDLast30d.toFixed(2)} · ${NF.format(
              k.ai.tokensInLast30d + k.ai.tokensOutLast30d,
            )} tokens`}
            icon={Zap}
            accent="rose"
          />
        </div>
      </section>

      {/* Sparklines 30 dias */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm">
          <Sparkline
            data={k.series.generationsByDay}
            color="rgb(16 185 129)"
            label="Peças geradas / dia (30 dias)"
          />
        </div>
        <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm">
          <Sparkline
            data={k.series.signupsByDay}
            color="rgb(139 92 246)"
            label="Cadastros / dia (30 dias)"
          />
        </div>
      </section>

      {/* Custos totais */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Custos OpenAI (acumulado)
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard
            label="Custo total"
            value={formatCurrencyBRL(k.ai.costBRLTotal)}
            hint={`US$ ${k.ai.costUSDTotal.toFixed(2)} acumulado`}
            icon={DollarSign}
            accent="rose"
          />
          <KpiCard
            label="Tokens entrada"
            value={NF.format(k.ai.tokensInTotal)}
            hint="prompt"
          />
          <KpiCard
            label="Tokens saída"
            value={NF.format(k.ai.tokensOutTotal)}
            hint="completion"
          />
          <KpiCard
            label="Margem estimada"
            value={formatCurrencyBRL(
              Math.max(0, k.revenue.mrrEstimatedBRL - k.ai.costBRLLast30d),
            )}
            hint="MRR − custo IA (30d)"
            icon={CreditCard}
            accent="emerald"
          />
        </div>
      </section>
    </div>
  );
}
