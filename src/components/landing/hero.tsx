"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Mail, MessageCircle, Sparkles, Star, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProofItem {
  initials: string;
  color: string;
  name: string;
  role: string;
  action: string;
}

const SOCIAL_PROOF: ProofItem[] = [
  { initials: "MS", color: "bg-rose-500", name: "Maria S.", role: "Estudante de Direito · USP", action: "garantiu o Plano Premium" },
  { initials: "CM", color: "bg-emerald-500", name: "Carlos M.", role: "Estagiário · 7º semestre", action: "gerou uma Petição Inicial em 22s" },
  { initials: "AP", color: "bg-violet-500", name: "Ana P.", role: "Jovem advogada · OAB/SP", action: "assinou o Plano Profissional" },
  { initials: "RT", color: "bg-amber-500", name: "Rafael T.", role: "OAB/MG", action: "exportou Contestação em DOCX" },
  { initials: "JL", color: "bg-sky-500", name: "Juliana L.", role: "Estagiária · MG", action: "economizou 4h numa Réplica" },
];

function LiveProof() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SOCIAL_PROOF.length), 4000);
    return () => clearInterval(id);
  }, []);
  const item = SOCIAL_PROOF[idx];
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white px-3 py-2 text-sm text-ink-700 shadow-lg shadow-emerald-100">
      <span className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${item.color}`}>
        {item.initials}
        <span className="absolute -bottom-0.5 -right-0.5 inline-flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        </span>
      </span>
      <span className="text-left">
        <strong className="block font-semibold text-ink-900">{item.name}</strong>
        <span className="text-xs text-ink-500">{item.action} · agora mesmo</span>
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(37,99,235,0.16),transparent_70%)]"
      />
      <div aria-hidden className="pointer-events-none absolute -top-24 right-[-120px] -z-10 h-[400px] w-[400px] rounded-full bg-emerald-300/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -top-32 left-[-120px] -z-10 h-[400px] w-[400px] rounded-full bg-amber-300/20 blur-3xl" />

      <div className="container-page pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="flex flex-col items-center gap-5 text-center">
          <LiveProof />

          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            +1.200 estudantes e advogados usando hoje
          </div>

          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
            ⚖️ Redija peças jurídicas em <span className="bg-amber-200/70 px-2 py-0.5 text-brand-700">minutos</span>,{" "}
            <br className="hidden sm:block" />
            não em horas
          </h1>

          <p className="max-w-2xl text-lg text-ink-700 sm:text-xl">
            O <strong className="text-brand-700">Peça Pronta</strong> é seu assistente jurídico com IA. Petições, contestações,
            recursos e mais — gerados com fundamentação legal brasileira <strong>em segundos</strong>. 🚀
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ink-700">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" /> Peças em menos de <strong>30 segundos</strong>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Estrutura técnico-jurídica
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-600" /> IA treinada em Direito BR
            </span>
          </div>

          <div className="mt-5 flex flex-col items-center gap-3">
            <a
              href="#planos"
              className="group inline-flex h-16 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-10 text-lg font-extrabold uppercase tracking-wide text-white shadow-xl shadow-emerald-500/30 transition hover:scale-[1.02] hover:bg-emerald-600 active:scale-100"
            >
              QUERO ACESSAR AGORA <ArrowRight className="h-6 w-6 transition group-hover:translate-x-1" />
            </a>
            <span className="text-xs font-medium text-ink-500">
              ✅ Veja os planos abaixo · Pagamento mensal · Cancele a qualquer momento
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-emerald-600" /> Acesso imediato no WhatsApp
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-brand-600" /> E senha enviada no seu e-mail
            </span>
          </div>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto mt-14 w-full max-w-5xl">
      <div aria-hidden className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-br from-brand-400/30 via-emerald-300/20 to-amber-300/30 blur-2xl" />
      <div className="rounded-2xl border border-ink-300 bg-white shadow-2xl shadow-brand-900/10">
        <div className="flex items-center gap-2 border-b border-ink-300/70 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-ink-500">pecapronta.app · Gerar peça</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> AO VIVO
          </span>
        </div>
        <div className="grid gap-0 md:grid-cols-12">
          <aside className="border-r border-ink-300/70 p-5 md:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              📝 Input Guiado
            </div>
            <div className="mt-3 space-y-3">
              <MockField label="Tipo de peça" value="Petição Inicial" highlight />
              <MockField label="Área" value="Direito do Consumidor" />
              <MockField label="Comarca" value="3ª Vara Cível — SP" />
              <MockField label="Parte autora" value="João da Silva, CPF…" />
              <MockField label="Pedido" value="Indenização R$ 15.000,00…" />
            </div>
            <button
              type="button"
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-sm font-bold text-white"
            >
              <Sparkles className="h-4 w-4" /> Gerar com IA
            </button>
          </aside>
          <div className="p-5 md:col-span-8">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                ✨ Peça gerada
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                ⚡ 22 segundos
              </span>
            </div>
            <div className="prose-juridico mt-3 max-h-[260px] overflow-hidden text-ink-700">
              {`EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA 3ª VARA CÍVEL DA COMARCA DE SÃO PAULO/SP

JOÃO DA SILVA, brasileiro, casado, portador do CPF nº [INSERIR], residente e domiciliado à [ENDEREÇO], vem, respeitosamente, à presença de Vossa Excelência, com fundamento nos arts. 6º, VI, e 14 da Lei nº 8.078/1990, propor

AÇÃO DE INDENIZAÇÃO POR DANOS MORAIS

em face de EMPRESA XYZ LTDA., CNPJ nº [INSERIR], pelos fatos e fundamentos a seguir expostos.

I – DOS FATOS
Em 12/03/2026, o autor adquiriu produto junto à ré, tendo sido surpreendido por...`}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-ink-300/70 pt-3 text-xs text-ink-500">
              <span>📄 Exportar: PDF · DOCX · ODT</span>
              <span className="text-emerald-700">✅ Salva no histórico</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-ink-500">{label}</div>
      <div className={`mt-1 rounded-md px-3 py-1.5 text-sm ${highlight ? "bg-brand-100 font-medium text-brand-800" : "bg-ink-100 text-ink-900"}`}>
        {value}
      </div>
    </div>
  );
}
