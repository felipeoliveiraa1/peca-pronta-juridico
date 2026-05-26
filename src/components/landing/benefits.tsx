import { ArrowRight, Clock, ShieldCheck, Target } from "lucide-react";

const BENEFITS = [
  {
    icon: Clock,
    emoji: "⏱️",
    title: "REDIJA EM MINUTOS, NÃO HORAS",
    body: "Chega de perder horas com formatação e pesquisa repetitiva. A IA do Peça Pronta entrega o rascunho completo em segundos — liberando você para o que realmente importa.",
    bg: "from-amber-50 to-amber-100/60",
    iconBg: "bg-amber-200 text-amber-700",
  },
  {
    icon: ShieldCheck,
    emoji: "🛡️",
    title: "PRECISÃO TÉCNICO-JURÍDICA",
    body: "Estrutura I–II–III, fundamentação legal e fórmula final no padrão brasileiro. A IA foi calibrada com diretrizes técnicas — não inventa acórdão nem cita lei revogada.",
    bg: "from-brand-50 to-brand-100/60",
    iconBg: "bg-brand-200 text-brand-700",
  },
  {
    icon: Target,
    emoji: "🎯",
    title: "FOCO NA ESTRATÉGIA",
    body: "Deixe a parte burocrática com a gente. Concentre-se em argumentação, prazo da OAB, estudo e atendimento. O Peça Pronta cuida dos detalhes técnicos.",
    bg: "from-emerald-50 to-emerald-100/60",
    iconBg: "bg-emerald-200 text-emerald-700",
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className="section bg-gradient-to-b from-white via-brand-50/40 to-white">
      <div className="container-page">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            ✨ Resultados em dias
          </span>
          <h2 className="mt-4 text-3xl font-bold uppercase tracking-tight text-ink-900 sm:text-4xl">
            O que vai mudar na sua rotina jurídica
          </h2>
          <p className="mt-3 text-lg text-ink-700">
            Chega de burocracia — aqui você foca na estratégia e no resultado. 🚀
          </p>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <article
              key={b.title}
              className={`rounded-2xl border border-ink-300/60 bg-gradient-to-br ${b.bg} p-6 shadow-card transition hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${b.iconBg}`}>
                  <b.icon className="h-6 w-6" />
                </div>
                <span className="text-3xl" aria-hidden>{b.emoji}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink-900">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{b.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#planos"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 text-base font-extrabold uppercase tracking-wide text-white shadow-xl shadow-emerald-500/30 transition hover:scale-[1.02] hover:bg-emerald-600"
          >
            VER PLANOS E COMEÇAR AGORA <ArrowRight className="h-5 w-5" />
          </a>
          <p className="mt-3 text-xs font-medium text-ink-500">
            🔥 Oferta disponível por tempo limitado · ⚡ Acesso imediato após pagamento
          </p>
        </div>
      </div>
    </section>
  );
}
