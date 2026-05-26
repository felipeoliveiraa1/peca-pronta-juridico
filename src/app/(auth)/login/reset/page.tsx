import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { ResetForm } from "./reset-form";

export const metadata = { title: "Nova senha — Peça Pronta" };

export default function ResetPasswordPage() {
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
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            Defina sua nova senha
          </h1>
          <p className="mt-3 max-w-md text-lg text-white/90">
            Escolha uma senha forte. Você usará ela toda vez que entrar no Peça Pronta.
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-ink-900">Criar nova senha</h2>
            <p className="mt-2 text-sm text-ink-500">
              Digite a senha que você quer usar daqui pra frente. Mínimo de 8 caracteres.
            </p>
          </div>
          <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-ink-100" />}>
            <ResetForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
