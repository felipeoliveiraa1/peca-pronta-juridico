"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input, Label } from "@/components/ui/input";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/login/reset`;
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="space-y-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-emerald-900">E-mail enviado!</h3>
          <p className="mt-1 text-sm text-emerald-800">
            Se houver uma conta com <strong>{email}</strong>, você receberá um link em alguns
            instantes. Verifique sua caixa de entrada e também o lixo eletrônico/spam.
          </p>
        </div>
        <p className="text-xs text-emerald-700">
          Não chegou? Aguarde 2-3 minutos e tente reenviar.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setEmail("");
          }}
          className="text-sm font-medium text-brand-700 underline hover:text-brand-800"
        >
          Tentar outro e-mail
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail da conta</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            autoComplete="email"
            required
            className="h-12 pl-9"
          />
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
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-700 text-base font-bold text-white shadow-md hover:bg-brand-800 disabled:opacity-60"
      >
        {loading ? "Enviando…" : (
          <>
            Enviar link de recuperação <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-ink-500">
        🔒 O link expira em 1 hora por motivos de segurança.
      </p>
    </form>
  );
}
