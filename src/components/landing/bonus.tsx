import { Gift, Sparkles, Library, ClipboardCheck, FolderTree, Download } from "lucide-react";

const BONUS = [
  {
    icon: Library,
    title: "Biblioteca de Modelos Premium",
    description: "Modelos revisados por especialistas, filtráveis por área e tipo de ação.",
    value: "R$ 297",
  },
  {
    icon: ClipboardCheck,
    title: "Revisor Jurídico Inteligente",
    description: "Análise em 4 dimensões — gramática, técnica, estrutura e fundamentação.",
    value: "R$ 197",
  },
  {
    icon: FolderTree,
    title: "Organizador de Documentos",
    description: "Histórico de versões, pastas e busca avançada em todas as suas peças.",
    value: "R$ 147",
  },
  {
    icon: Download,
    title: "Exportação Multi-Formato",
    description: "PDF, DOCX e ODT prontos para o PJe, e-SAJ e processo eletrônico.",
    value: "R$ 97",
  },
];

export function Bonus() {
  const total = 297 + 197 + 147 + 97;
  return (
    <section className="bg-ink-900 py-16 text-white sm:py-24">
      <div className="container-page">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-900">
            <Gift className="h-3.5 w-3.5" /> Bônus inclusos no plano Premium
          </span>
          <h2 className="mt-4 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Mais de <span className="text-emerald-400">R$ {total.toLocaleString("pt-BR")}</span> em ferramentas
          </h2>
          <p className="mt-3 text-base text-ink-300">
            Tudo isso já está incluso na assinatura mensal do Premium — sem custo adicional. 🎁
          </p>
        </header>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {BONUS.map((b) => (
            <article key={b.title} className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold uppercase tracking-wide text-white">
                {b.title}
              </h3>
              <p className="mt-1 text-sm text-ink-300">{b.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                <span className="text-ink-300">Valor de referência</span>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-400">
                  {b.value}
                </span>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-ink-300">
          <Sparkles className="mr-1 inline h-4 w-4 text-amber-400" />
          Você leva tudo isso por apenas <strong className="text-white">R$ 59,90/mês</strong> no Premium.
        </p>
      </div>
    </section>
  );
}
