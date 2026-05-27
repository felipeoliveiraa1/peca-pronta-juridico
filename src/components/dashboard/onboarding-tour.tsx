"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Library,
  ClipboardCheck,
  Calculator,
  Gavel,
  BookOpen,
  Rocket,
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";

interface TourStep {
  icon: React.ComponentType<{ className?: string }>;
  emoji: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}

const STORAGE_KEY = "pp_tour_v1_dismissed";

const STEPS: TourStep[] = [
  {
    icon: Rocket,
    emoji: "👋",
    title: "Bem-vindo(a) ao Peça Pronta!",
    body:
      "Em 1 minuto você vai aprender a usar todas as ferramentas. São apenas 6 passos — pode pular a qualquer momento.",
  },
  {
    icon: Sparkles,
    emoji: "✨",
    title: "Gere peças com IA em segundos",
    body:
      "Escolha o tipo de peça (30 disponíveis), preencha um formulário guiado com os dados do caso, e a IA entrega o rascunho técnico-jurídico completo em menos de 30 segundos. Você só edita e exporta.",
    cta: { label: "Ir para Gerar peça", href: "/dashboard/documents/new" },
  },
  {
    icon: Library,
    emoji: "📚",
    title: "Use a biblioteca de modelos",
    body:
      "27 modelos premium revisados por especialistas, organizados por área (Civil, Trabalho, Penal, Família, Consumidor, Adm). Filtre, abra, clone e edite como achar melhor.",
    cta: { label: "Abrir biblioteca", href: "/dashboard/templates" },
  },
  {
    icon: ClipboardCheck,
    emoji: "🔍",
    title: "Revise suas peças com IA",
    body:
      "Cole qualquer peça no Revisor e receba análise em 4 dimensões: gramática, técnica jurídica, estrutura e fundamentação. Depois clique em ✨ Aplicar revisão completa pra IA reescrever incorporando todas as sugestões.",
    cta: { label: "Abrir revisor", href: "/dashboard/reviewer" },
  },
  {
    icon: Calculator,
    emoji: "🧮",
    title: "Ferramentas práticas no dia a dia",
    body:
      "Calculadoras (prazos em dias úteis CPC, juros + correção, custas, multa diária), jurisprudência em destaque com botão 'copiar tese', e glossário com 57 termos. Tudo a 1 clique.",
    cta: { label: "Ver calculadoras", href: "/dashboard/calculadoras" },
  },
  {
    icon: BookOpen,
    emoji: "💡",
    title: "Dicas pra acelerar ainda mais",
    body:
      "✓ Use o atalho Ctrl+S no editor pra salvar.\n✓ Documentos têm auto-save a cada 30s.\n✓ No editor, use as ações de IA (continuar, encurtar, fundamentar, formalizar).\n✓ Exporte em DOCX pra editar no Word, PDF pra protocolo, TXT pra arquivar.",
  },
];

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // só abre se nunca foi dispensado
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // pequeno delay pro layout assentar antes do modal abrir
      const id = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(id);
    }
  }, []);

  function close(dismissForever = false) {
    if (dismissForever) {
      try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    }
    setOpen(false);
  }

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else close(true); // último → marca como concluído
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  if (!open) return null;

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <>
      {/* Backdrop com focus */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => close(false)}
      />

      {/* Modal stepper */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={() => close(false)}
      >
        <div
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botão fechar */}
          <button
            type="button"
            aria-label="Fechar tutorial"
            onClick={() => close(false)}
            className="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 hover:text-ink-900"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Progress bar */}
          <div className="h-1 w-full bg-ink-100">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header com cor */}
          <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-600 px-6 pt-10 pb-6 text-white">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Icon className="h-7 w-7" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-3xl">{current.emoji}</span>
              <h2 id="tour-title" className="text-2xl font-bold tracking-tight">
                {current.title}
              </h2>
            </div>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/70">
              Passo {step + 1} de {STEPS.length}
            </p>
          </div>

          {/* Corpo */}
          <div className="px-6 py-6">
            <p className="whitespace-pre-line text-base leading-relaxed text-ink-700">
              {current.body}
            </p>

            {current.cta && (
              <Link
                href={current.cta.href}
                onClick={() => close(true)}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 text-sm font-bold text-white hover:bg-brand-800"
              >
                {current.cta.label} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Footer com navegação */}
          <div className="flex items-center justify-between gap-3 border-t border-ink-300/70 bg-ink-100/40 px-6 py-4">
            {/* Esquerda: pular / não mostrar mais */}
            <div className="flex flex-col gap-1 text-xs">
              <button
                type="button"
                onClick={() => close(true)}
                className="text-left text-ink-500 underline hover:text-ink-900"
              >
                Pular tutorial · não mostrar mais
              </button>
            </div>

            {/* Direita: anterior / próximo */}
            <div className="flex gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={prev}
                  className="inline-flex h-10 items-center gap-1 rounded-lg border border-ink-300 bg-white px-4 text-sm font-medium text-ink-700 hover:bg-ink-100"
                >
                  <ArrowLeft className="h-4 w-4" /> Anterior
                </button>
              )}
              <button
                type="button"
                onClick={next}
                className="inline-flex h-10 items-center gap-1 rounded-lg bg-emerald-500 px-5 text-sm font-bold text-white hover:bg-emerald-600"
              >
                {isLast ? (
                  <>
                    🚀 Começar
                  </>
                ) : (
                  <>
                    Próximo <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** Botão pequeno pra abrir o tour de novo (ex: na sidebar "Ajuda → Refazer tour") */
export function ReopenTourButton() {
  return (
    <button
      type="button"
      onClick={() => {
        try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
        window.location.reload();
      }}
      className="inline-flex items-center gap-1 text-xs text-ink-500 underline hover:text-brand-700"
    >
      <Sparkles className="h-3 w-3" /> Refazer tutorial
    </button>
  );
}

// Re-exports usados internamente, evita erro de tree-shaking
export { Gavel };
