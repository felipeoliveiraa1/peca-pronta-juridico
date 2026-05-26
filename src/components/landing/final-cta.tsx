import { ArrowRight, Flame } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-600 py-20 text-white">
      <div aria-hidden className="absolute -top-32 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="container-page relative text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-900">
          <Flame className="h-4 w-4 animate-pulse" /> Última chance · oferta termina hoje
        </div>
        <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Pare de perder horas redigindo peças do zero
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
          Escolha o plano ideal e use a IA do Peça Pronta para gerar petições, contestações e
          recursos em <strong className="text-amber-300">menos de 30 segundos</strong>. 🚀
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href="#planos"
            className="group inline-flex h-16 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-12 text-lg font-extrabold uppercase tracking-wide text-ink-900 shadow-2xl shadow-amber-500/40 transition hover:scale-[1.02] hover:bg-amber-300"
          >
            VER PLANOS E COMEÇAR <ArrowRight className="h-6 w-6 transition group-hover:translate-x-1" />
          </a>
          <p className="text-sm text-white/80">
            ✅ Acesso imediato · ✅ Cancele quando quiser · ✅ Pagamento seguro pela Kiwify
          </p>
        </div>
      </div>
    </section>
  );
}
