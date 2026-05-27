"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X, type LucideIcon } from "lucide-react";

export interface TourStep {
  icon: LucideIcon;
  emoji: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}

interface Props {
  /** Chave única (ex: "dashboard", "generate", "editor"). Vira pp_tour_<key> no localStorage. */
  tourKey: string;
  steps: TourStep[];
  /** Atraso pra abrir após o mount (ms). Default 600. */
  openDelay?: number;
}

export function PageTour({ tourKey, steps, openDelay = 600 }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const storageKey = `pp_tour_${tourKey}_v1`;
  const dismissAllKey = `pp_tour_all_dismissed_v1`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    // se usuário disse "não mostrar mais NENHUM" em qualquer página, respeita
    if (window.localStorage.getItem(dismissAllKey)) return;
    // se já viu esse tour específico, não mostra
    if (window.localStorage.getItem(storageKey)) return;
    const id = setTimeout(() => setOpen(true), openDelay);
    return () => clearTimeout(id);
  }, [storageKey, openDelay, dismissAllKey]);

  function close(opts?: { markSeen?: boolean; dismissAll?: boolean }) {
    try {
      if (opts?.markSeen) window.localStorage.setItem(storageKey, "1");
      if (opts?.dismissAll) window.localStorage.setItem(dismissAllKey, "1");
    } catch {}
    setOpen(false);
  }

  function next() {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else close({ markSeen: true });
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  if (!open || steps.length === 0) return null;

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => close({ markSeen: true })}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`tour-${tourKey}-title`}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={() => close({ markSeen: true })}
      >
        <div
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Fechar tutorial"
            onClick={() => close({ markSeen: true })}
            className="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="h-1 w-full bg-ink-100">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-600 px-6 pt-10 pb-6 text-white">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Icon className="h-7 w-7" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-3xl">{current.emoji}</span>
              <h2 id={`tour-${tourKey}-title`} className="text-2xl font-bold tracking-tight">
                {current.title}
              </h2>
            </div>
            <p className="mt-1 text-xs uppercase tracking-wider text-white/70">
              Passo {step + 1} de {steps.length}
            </p>
          </div>

          <div className="px-6 py-6">
            <p className="whitespace-pre-line text-base leading-relaxed text-ink-700">
              {current.body}
            </p>
            {current.cta && (
              <Link
                href={current.cta.href}
                onClick={() => close({ markSeen: true })}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 text-sm font-bold text-white hover:bg-brand-800"
              >
                {current.cta.label} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-ink-300/70 bg-ink-100/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 text-xs">
              <button
                type="button"
                onClick={() => close({ markSeen: true })}
                className="text-left text-ink-500 underline hover:text-ink-900"
              >
                Pular esse tutorial
              </button>
              <button
                type="button"
                onClick={() => close({ markSeen: true, dismissAll: true })}
                className="text-left text-ink-500 underline hover:text-red-700"
              >
                Não mostrar mais nenhum tutorial
              </button>
            </div>

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
                {isLast ? <>🚀 Entendi</> : <>Próximo <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
