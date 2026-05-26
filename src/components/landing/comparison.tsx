import { XCircle, CheckCircle2 } from "lucide-react";

const ANTES = [
  "Horas pesquisando dispositivos, súmulas e modelos",
  "Brancos no Word, dúvida na estrutura técnica",
  "Medo de errar fundamentação e travar no estágio",
  "Modelos genéricos do Google que não servem",
  "Revisões manuais até as 23h59",
  "Atraso em entregas, ansiedade, prazo apertado",
];

const DEPOIS = [
  "Rascunho completo em menos de 30 segundos",
  "Estrutura I/II/III pronta, no padrão técnico-jurídico",
  "Sugestões de fundamentação a partir do seu caso",
  "Biblioteca de modelos premium revisados",
  "Revisor inteligente com 4 dimensões de análise",
  "Mais tempo para estratégia, OAB, estudos e vida",
];

export function Comparison() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-page">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            🔄 Antes vs Depois
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Sua rotina jurídica antes e depois do Peça Pronta
          </h2>
          <p className="mt-3 text-base text-ink-700">
            Veja o que muda quando você troca <em>horas perdidas</em> por <strong>minutos produtivos</strong>.
          </p>
        </header>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border-2 border-red-200 bg-red-50/40 p-6">
            <header className="flex items-center gap-2 text-red-700">
              <span className="text-2xl">❌</span>
              <h3 className="text-lg font-bold uppercase tracking-wide">Sem o Peça Pronta</h3>
            </header>
            <ul className="mt-5 space-y-3">
              {ANTES.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-700">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg bg-red-100/70 p-3 text-center text-xs font-medium text-red-700">
              ⏱ Em média <strong>6 a 8 horas</strong> para uma petição inicial completa
            </div>
          </article>

          <article className="relative rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-6 shadow-xl shadow-emerald-200/40">
            <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase text-white">
              ✨ Com IA
            </span>
            <header className="flex items-center gap-2 text-emerald-700">
              <span className="text-2xl">✅</span>
              <h3 className="text-lg font-bold uppercase tracking-wide">Com o Peça Pronta</h3>
            </header>
            <ul className="mt-5 space-y-3">
              {DEPOIS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg bg-emerald-100/70 p-3 text-center text-xs font-medium text-emerald-800">
              🚀 Em média <strong>menos de 30 segundos</strong> para o rascunho completo
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
