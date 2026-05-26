import { BookOpenText, FileSearch, Library, Sparkles, FolderTree } from "lucide-react";

const STEPS = [
  {
    emoji: "📝",
    icon: BookOpenText,
    title: "Preencha o caso em um formulário guiado",
    description:
      "Tipo de peça, área do Direito, qualificação das partes, fatos e pedido. Em poucos campos a IA tem tudo o que precisa.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    emoji: "✨",
    icon: Sparkles,
    title: "A IA gera o rascunho completo",
    description:
      "Estrutura, fundamentação legal preliminar e formatação no padrão técnico-jurídico brasileiro — pronto para editar.",
    color: "bg-brand-100 text-brand-700",
  },
  {
    emoji: "📚",
    icon: Library,
    title: "Use a biblioteca de modelos premium",
    description: "Filtre por área, tipo de ação e tribunal. Todos os modelos são revisados por especialistas.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    emoji: "🔍",
    icon: FileSearch,
    title: "Revisor jurídico inteligente",
    description: "Receba sugestões de termos, dispositivos legais e melhorias de clareza e coesão.",
    color: "bg-rose-100 text-rose-700",
  },
  {
    emoji: "📁",
    icon: FolderTree,
    title: "Organize, exporte e compartilhe",
    description: "Pastas por cliente ou caso. Histórico de versões. Exportação para PDF, DOCX e ODT.",
    color: "bg-emerald-100 text-emerald-700",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section bg-gradient-to-b from-white to-brand-50/30">
      <div className="container-page">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            📖 Demo em 5 passos
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Veja o Peça Pronta em Ação
          </h2>
          <p className="mt-3 text-lg text-ink-700">
            Geração de peças com IA, biblioteca de modelos atualizados e revisão inteligente. Tudo
            prático, direto e fácil de usar.
          </p>
        </header>

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl border border-ink-300/70 bg-white p-5 shadow-card transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${step.color} text-sm font-bold`}>
                  {i + 1}
                </span>
                <span className="text-2xl" aria-hidden>{step.emoji}</span>
              </div>
              <h3 className="mt-3 text-base font-bold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
