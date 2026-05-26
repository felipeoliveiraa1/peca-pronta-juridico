"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, AlertCircle, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input, Label } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      // Mensagens amigáveis pros erros comuns
      if (/invalid login/i.test(err.message)) {
        setError("E-mail ou senha incorretos. Confira o e-mail que enviamos após a compra.");
      } else if (/email not confirmed/i.test(err.message)) {
        setError("Sua conta ainda não foi confirmada. Verifique seu e-mail.");
      } else {
        setError(err.message);
      }
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            autoComplete="email"
            required
            className="h-12"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link href="/login/forgot" className="text-xs font-medium text-brand-700 hover:underline">
              Esqueci minha senha
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="h-12 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-900"
              aria-label={showPw ? "Esconder senha" : "Mostrar senha"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-700 text-base font-bold text-white shadow-md transition hover:bg-brand-800 disabled:opacity-60"
        >
          {loading ? "Entrando…" : (
            <>
              Entrar <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ink-300/70" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs uppercase tracking-wider text-ink-500">
            ainda não tem conta?
          </span>
        </div>
      </div>

      {/* Card de aquisição */}
      <Link
        href="/#planos"
        className="group flex items-center gap-4 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-4 transition hover:border-emerald-400 hover:bg-emerald-50"
      >
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
          <ShoppingBag className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink-900">Adquira o Peça Pronta</p>
          <p className="text-xs text-ink-700">
            A conta é criada automaticamente após o pagamento. Veja os planos →
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-emerald-700 transition group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
