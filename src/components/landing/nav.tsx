import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-300/60 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.svg" alt="Peça Pronta" width={36} height={36} priority />
          <span className="text-lg">Peça Pronta</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-700 md:flex">
          <a href="#como-funciona" className="hover:text-brand-700">Como funciona</a>
          <a href="#beneficios" className="hover:text-brand-700">Benefícios</a>
          <a href="#planos" className="hover:text-brand-700">Planos</a>
          <a href="#faq" className="hover:text-brand-700">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-ink-700 hover:text-brand-700 sm:inline"
          >
            Entrar
          </Link>
          <a
            href="#planos"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-600"
          >
            Quero acessar <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
