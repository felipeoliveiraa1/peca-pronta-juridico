import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShieldCheck, Zap, ArrowLeft } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata = { title: "Entrar — Peça Pronta" };

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel esquerdo — branding + valor (some no mobile) */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-600 p-12 lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-amber-300/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl" />

        <Link href="/" className="relative inline-flex items-center gap-2 font-semibold text-white">
          <Image src="/logo.svg" alt="Peça Pronta" width={40} height={40} priority />
          <span className="text-xl">Peça Pronta</span>
        </Link>

        <div className="relative space-y-8 text-white">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Bem-vindo(a) de volta!
            </h1>
            <p className="mt-3 max-w-md text-lg text-white/90">
              Continue redigindo suas peças jurídicas com a velocidade da IA.
            </p>
          </div>

          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <Zap className="h-4 w-4 text-amber-300" />
              </span>
              <div>
                <strong className="block">Peças em segundos</strong>
                <span className="text-white/80">Gerador de IA com 30 tipos de peça prontos.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
              </span>
              <div>
                <strong className="block">Padrão técnico-jurídico</strong>
                <span className="text-white/80">Estrutura I/II/III com fundamentação legal brasileira.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <div>
                <strong className="block">Biblioteca + Calculadoras + Revisor</strong>
                <span className="text-white/80">Tudo em um único lugar.</span>
              </div>
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-white/60">
          © 2026 Peça Pronta · Assistente jurídico com IA
        </p>
      </aside>

      {/* Painel direito — formulário */}
      <main className="flex flex-col px-6 py-8 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/logo.svg" alt="Peça Pronta" width={36} height={36} priority />
            <span className="text-lg">Peça Pronta</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center pt-12 lg:pt-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-ink-900">Entrar na sua conta</h2>
            <p className="mt-2 text-sm text-ink-500">
              Use o e-mail e senha que enviamos após a sua compra.
            </p>
          </div>

          <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-ink-100" />}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
