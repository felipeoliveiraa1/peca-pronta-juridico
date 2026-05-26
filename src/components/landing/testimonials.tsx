import { Quote, Star } from "lucide-react";

const ITEMS = [
  {
    name: "Mariana Oliveira",
    role: "Estudante do 8º semestre — Direito · UFMG",
    initials: "MO",
    color: "bg-rose-500",
    metric: "de 6h para 18min",
    quote:
      "Antes eu levava o dia inteiro formatando uma inicial. Hoje, em menos de 20 minutos, tenho o rascunho pronto e ainda aprendo lendo o que a IA escreve. Mudou meu estágio.",
  },
  {
    name: "Pedro Henrique Lima",
    role: "Estagiário em Direito do Trabalho · SP",
    initials: "PH",
    color: "bg-amber-500",
    metric: "80% da peça pronta",
    quote:
      "A biblioteca de modelos premium é um achado. Filtro por tipo de ação e já saio com 80% da peça resolvida. O revisor pega cada detalhe gramatical.",
  },
  {
    name: "Camila Ribeiro",
    role: "Jovem advogada — OAB/RJ",
    initials: "CR",
    color: "bg-emerald-500",
    metric: "3x mais produtividade",
    quote:
      "Comecei no Premium e logo migrei para o Profissional para usar com a equipe. A integração e o histórico de versões salvam minha rotina diária.",
  },
];

export function Testimonials() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
            💬 Quem usa, recomenda
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Está transformando a rotina de estudantes e advogados
          </h2>
          <div className="mt-3 inline-flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
            ))}
            <span className="ml-2 text-sm font-semibold text-ink-700">4.9/5 · +800 avaliações</span>
          </div>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ITEMS.map((t) => (
            <figure
              key={t.name}
              className="relative flex flex-col rounded-2xl border border-ink-300/70 bg-white p-6 shadow-card transition hover:-translate-y-1"
            >
              <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase text-white">
                {t.metric}
              </div>
              <Quote className="h-6 w-6 text-brand-600" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-300/60 pt-4">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${t.color}`}>
                  {t.initials}
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink-900">{t.name}</div>
                  <div className="text-xs text-ink-500">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
