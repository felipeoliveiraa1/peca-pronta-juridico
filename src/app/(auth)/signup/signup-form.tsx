"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const desiredPlan = params.get("plan");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPending(null);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setLoading(false);
    if (err) return setError(err.message);

    if (!data.session) {
      setPending("Cadastro criado. Confirme seu e-mail para entrar.");
      return;
    }

    const target = desiredPlan
      ? `/dashboard/settings?upgrade=${desiredPlan}`
      : "/dashboard";
    router.push(target);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crie sua conta gratuita</CardTitle>
        <CardDescription>
          Crie uma conta gratuita para acessar o painel.{" "}
          <strong>Dica:</strong> se você já pagou pelo Peça Pronta na Kiwify, sua conta já foi criada
          automaticamente — basta usar o e-mail do checkout e a senha que enviamos para você.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <p className="text-xs text-ink-500">Mínimo de 8 caracteres.</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {pending && <p className="text-sm text-emerald-700">{pending}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-brand-700 hover:underline">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
