import Link from "next/link";
import {
  FileText,
  Sparkles,
  Library,
  ClipboardCheck,
  Calculator,
  BookOpen,
  Gavel,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileBarChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profile";
import { getCurrentUsage } from "@/lib/usage";
import { getPlan } from "@/lib/plans";
import { popularPieces, PIECE_TYPES, type PieceTypeId } from "@/lib/piece-types";
import { loadDashboardStats } from "@/lib/dashboard-stats";
import { getTodayTip } from "@/lib/daily-tips";
import { formatDateBR } from "@/lib/utils";
import { UsageChart } from "@/components/dashboard/usage-chart";

export const metadata = { title: "Painel — Peça Pronta" };

export default async function DashboardHome() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const [usage, stats] = await Promise.all([
    getCurrentUsage(profile.id, profile.plan),
    loadDashboardStats(profile.id),
  ]);
  const planDef = getPlan(profile.plan);
  const tip = getTodayTip();
  const popular = popularPieces(6);

  const { data: recent } = await supabase
    .from("documents")
    .select("id, title, piece_type, updated_at, status")
    .eq("user_id", profile.id)
    .order("updated_at", { ascending: false })
    .limit(6);

  const firstName = profile.full_name?.split(" ")[0] ?? "estudante";

  return (
    <div className="space-y-8">
      {/* Header personalizado */}
      <section className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-600 p-6 text-white shadow-lg">
        <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wider text-white/80">Bem-vindo(a) de volta</p>
            <h1 className="mt-1 text-3xl font-bold">Olá, {firstName} 👋</h1>
            <p className="mt-2 max-w-md text-sm text-white/85">
              Você está no plano <strong>{planDef.name}</strong>.{" "}
              {usage.unlimited
                ? "Geração ilimitada de peças disponível."
                : `Você ainda pode gerar ${usage.remaining ?? 0} peça(s) este mês.`}
            </p>
          </div>
          <Link
            href="/dashboard/documents/new"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-brand-700 shadow-md hover:bg-amber-50"
          >
            <Sparkles className="h-4 w-4" /> Gerar nova peça <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Documentos criados"
          value={stats.totalDocuments}
          hint={`${stats.finalizedDocuments} finalizados`}
          color="text-brand-700 bg-brand-100"
        />
        <StatCard
          icon={Sparkles}
          label="Peças geradas com IA"
          value={stats.totalGenerations}
          hint={`${stats.monthlyGenerations} este mês`}
          color="text-amber-700 bg-amber-100"
        />
        <StatCard
          icon={Clock}
          label="Tempo economizado"
          value={formatHours(stats.estimatedMinutesSaved)}
          hint="vs. redação manual"
          color="text-emerald-700 bg-emerald-100"
        />
        <StatCard
          icon={CheckCircle2}
          label="Tipos de peça usados"
          value={stats.uniquePieceTypes}
          hint={`de ${Object.keys(PIECE_TYPES).length} disponíveis`}
          color="text-violet-700 bg-violet-100"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Atividade dos últimos 30 dias */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Atividade dos últimos 30 dias</CardTitle>
              <CardDescription>
                {stats.daily.reduce((s, d) => s + d.count, 0)} peças geradas
              </CardDescription>
            </div>
            <FileBarChart className="h-5 w-5 text-ink-500" />
          </CardHeader>
          <CardContent>
            <UsageChart daily={stats.daily} />
            <div className="mt-2 flex justify-between text-[10px] text-ink-500">
              <span>{stats.daily[0]?.date ? formatShortDate(stats.daily[0].date) : ""}</span>
              <span>hoje</span>
            </div>
          </CardContent>
        </Card>

        {/* Dica do dia */}
        <Card className="bg-amber-50/60 border-amber-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>{tip.emoji}</span>
              <Badge variant="warning" className="uppercase">
                Dica do dia
              </Badge>
            </div>
            <CardTitle className="text-base">{tip.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-ink-700">{tip.body}</p>
          </CardContent>
        </Card>
      </div>

      {/* Atalhos por tipo de peça (mais usados) */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Comece rápido</h2>
            <p className="text-sm text-ink-500">Os tipos de peça mais utilizados pelos usuários do Peça Pronta.</p>
          </div>
          <Link href="/dashboard/documents/new" className="text-sm font-medium text-brand-700 hover:underline">
            ver todos os {Object.keys(PIECE_TYPES).length} tipos →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/documents/new?type=${p.id}`}
              className="group flex items-start gap-3 rounded-xl border border-ink-300/60 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md"
            >
              <span className="text-2xl">{p.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-ink-900 group-hover:text-brand-700">{p.label}</h3>
                  {p.badge === "popular" && <Badge variant="success">🔥</Badge>}
                  {p.badge === "trending" && <Badge variant="warning">📈</Badge>}
                  {p.badge === "new" && <Badge variant="default">✨</Badge>}
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-ink-500">{p.areaLabel}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-ink-500">
                  <TrendingUp className="h-3 w-3" /> {p.popularity}% de uso · ⏱ ~{p.estimatedMinutes}min
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ferramentas */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink-900">Ferramentas do Peça Pronta</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ToolCard
            icon={Library}
            title="Biblioteca de Modelos"
            description="27 modelos revisados por área e tipo de ação."
            href="/dashboard/templates"
          />
          <ToolCard
            icon={ClipboardCheck}
            title="Revisor Inteligente"
            description="Análise gramatical, técnica e estrutural com IA."
            href="/dashboard/reviewer"
          />
          <ToolCard
            icon={Calculator}
            title="Calculadoras Jurídicas"
            description="Prazos, juros, correção e valor da causa."
            href="/dashboard/calculadoras"
            badge="Novo"
          />
          <ToolCard
            icon={Gavel}
            title="Jurisprudência em Destaque"
            description="Precedentes curados do STF, STJ e tribunais."
            href="/dashboard/jurisprudencia"
            badge="Novo"
          />
        </div>
      </section>

      {/* Documentos recentes */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Documentos recentes</h2>
          <Link href="/dashboard/documents" className="text-sm font-medium text-brand-700 hover:underline">
            ver todos
          </Link>
        </div>
        <Card>
          <CardContent className="p-0">
            {recent && recent.length > 0 ? (
              <ul className="divide-y divide-ink-300/60">
                {recent.map((d) => {
                  const pieceLabel = PIECE_TYPES[d.piece_type as PieceTypeId]?.label ?? d.piece_type;
                  const icon = PIECE_TYPES[d.piece_type as PieceTypeId]?.icon ?? "📄";
                  return (
                    <li key={d.id} className="flex items-center justify-between gap-3 px-5 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="text-xl" aria-hidden>{icon}</span>
                        <div className="min-w-0">
                          <Link href={`/dashboard/documents/${d.id}`} className="block truncate font-medium text-ink-900 hover:text-brand-700">
                            {d.title}
                          </Link>
                          <div className="mt-0.5 text-xs text-ink-500">
                            {pieceLabel} · atualizado em {formatDateBR(d.updated_at)}
                          </div>
                        </div>
                      </div>
                      <Badge variant={d.status === "final" ? "success" : "outline"}>
                        {d.status === "final" ? "Finalizado" : "Rascunho"}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center gap-2 px-5 py-10 text-center text-sm text-ink-500">
                <BookOpen className="h-8 w-8 text-ink-300" />
                Você ainda não criou nenhum documento.{" "}
                <Link href="/dashboard/documents/new" className="font-medium text-brand-700 hover:underline">
                  Gerar a primeira peça →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  hint: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wide text-ink-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-ink-900">{value}</p>
          <p className="mt-0.5 text-xs text-ink-500">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ToolCard({
  icon: Icon,
  title,
  description,
  href,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-2xl border border-ink-300/70 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-brand-400"
    >
      {badge && (
        <Badge variant="warning" className="absolute -top-2 right-4">
          ✨ {badge}
        </Badge>
      )}
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-base font-bold text-ink-900 group-hover:text-brand-700">{title}</h3>
      <p className="mt-1 text-sm text-ink-700">{description}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-700">
        Abrir <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}

function formatHours(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h < 24) return m ? `${h}h ${m}m` : `${h}h`;
  const days = Math.floor(h / 24);
  return `${days}d ${h % 24}h`;
}

function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(d);
}
