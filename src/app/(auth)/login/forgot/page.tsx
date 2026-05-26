import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, KeyRound } from "lucide-react";
import { ForgotForm } from "./forgot-form";

export const metadata = { title: "Recuperar senha — Peça Pronta" };

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-600 p-12 lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-amber-300/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl" />

        <Link href="/" className="relative inline-flex items-center gap-2 font-semibold text-white">
          <Image src="/logo.svg" alt="Peça Pronta" width={40} height={40} priority />
          <span className="text-xl">Peça Pronta</span>
        </Link>

        <div className="relative text-white">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <KeyRound className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            Vamos recuperar seu acesso
          </h1>
          <p className="mt-3 max-w-md text-lg text-white/90">
            Em segundos você volta a usar o Peça Pronta. Só precisa confirmar seu e-mail.
          </p>
        </div>

        <p className="relative text-xs text-white/60">© 2026 Peça Pronta</p>
      </aside>

      <main className="flex flex-col px-6 py-8 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/logo.svg" alt="Peça Pronta" width={36} height={36} priority />
            <span className="text-lg">Peça Pronta</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center pt-12 lg:pt-0">
          <Link
            href="/login"
            className="mb-6 inline-flex w-fit items-center gap-1 text-sm text-ink-500 hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para o login
          </Link>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-ink-900">Recuperar senha</h2>
            <p className="mt-2 text-sm text-ink-500">
              Informe o e-mail da sua conta. Enviaremos um link seguro para você criar uma nova senha.
            </p>
          </div>
          <ForgotForm />
        </div>
      </main>
    </div>
  );
}
