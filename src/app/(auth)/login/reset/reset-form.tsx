"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input, Label } from "@/components/ui/input";

export function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  // Quando o usuário chega pelo link de email, o Supabase devolve um `code`
  // na querystring (PKCE). Trocamos pelo session aqui.
  useEffect(() => {
    const code = params.get("code");
    const errParam = params.get("error_description") ?? params.get("error");
    if (errParam) {
      setLinkError(decodeURIComponent(errParam));
      return;
    }
    if (!code) return; // pode chegar via hash (fluxo legado) — Supabase trata automaticamente
    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code).catch((e) => {
      setLinkError(e?.message ?? "Link inválido ou expirado.");
    });
  }, [params]);

  const requirements = useMemo(() => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      match: password.length > 0 && password === confirm,
    };
  }, [password, confirm]);

  const allOk = Object.values(requirements).every(Boolean);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!allOk) {
      setError("Confira os requisitos da senha antes de continuar.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  }

  if (linkError) {
    return (
      <div className="space-y-4 rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
          <AlertCircle className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-red-900">Link inválido ou expirado</h3>
          <p className="mt-1 text-sm text-red-800">{linkError}</p>
        </div>
        <Link
          href="/login/forgot"
          className="inline-flex h-10 items-center justify-center gap-1 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
        >
          Solicitar novo link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-emerald-900">Senha alterada!</h3>
          <p className="mt-1 text-sm text-emerald-800">
            Você já está logado(a). Redirecionando para o painel…
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-1.5">
        <Label htmlFor="password">Nova senha</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={8}
            className="h-12 pl-9 pr-11"
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

      <div className="space-y-1.5">
        <Label htmlFor="confirm">Confirmar nova senha</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <Input
            id="confirm"
            type={showPw ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
            minLength={8}
            className="h-12 pl-9"
          />
        </div>
      </div>

      {/* Checklist de requisitos */}
      <ul className="space-y-1 rounded-lg border border-ink-300/70 bg-ink-100/40 p-3 text-xs">
        <Req ok={requirements.length} label="Mínimo de 8 caracteres" />
        <Req ok={requirements.lowercase} label="Pelo menos uma letra minúscula" />
        <Req ok={requirements.uppercase} label="Pelo menos uma letra maiúscula" />
        <Req ok={requirements.number} label="Pelo menos um número" />
        <Req ok={requirements.match} label="As duas senhas conferem" />
      </ul>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !allOk}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-700 text-base font-bold text-white shadow-md hover:bg-brand-800 disabled:opacity-60"
      >
        {loading ? "Salvando…" : (
          <>
            Definir nova senha <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

function Req({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 ${ok ? "text-emerald-700" : "text-ink-500"}`}>
      <span
        className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${ok ? "bg-emerald-500 text-white" : "border border-ink-300"}`}
        aria-hidden
      >
        {ok ? <CheckCircle2 className="h-3 w-3" /> : null}
      </span>
      {label}
    </li>
  );
}
