"use client";

import { useState } from "react";
import { ClipboardCheck, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ReviewerWorkspace({
  planLabel,
  juridicalEnabled,
}: {
  planLabel: string;
  juridicalEnabled: boolean;
}) {
  const [content, setContent] = useState("");
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setReport(null);
    setError(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Falha ao revisar.");
      else setReport(data.report);
    } catch (err) {
      setError("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Texto a revisar</CardTitle>
          <CardDescription>
            Plano atual: <strong>{planLabel}</strong>
            {!juridicalEnabled && (
              <Badge variant="warning" className="ml-2">
                <Crown className="mr-1 h-3 w-3" /> Revisão jurídica completa no Premium
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Cole aqui o texto da peça…"
            className="prose-juridico min-h-[50vh] w-full resize-none rounded-lg border border-ink-300 bg-white p-4 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          <Button onClick={run} disabled={loading || content.length < 50} className="mt-4 w-full" size="lg">
            <ClipboardCheck className="h-4 w-4" /> {loading ? "Analisando…" : "Revisar agora"}
          </Button>
          {content.length > 0 && content.length < 50 && (
            <p className="mt-2 text-xs text-ink-500">Mínimo de 50 caracteres.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Relatório de revisão</CardTitle>
          <CardDescription>
            Apontamentos de correção, padrão técnico, estrutura e fundamentação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {report ? (
            <pre className="prose-juridico whitespace-pre-wrap rounded-lg bg-ink-100/60 p-4 text-sm">
              {report}
            </pre>
          ) : (
            <p className="text-sm text-ink-500">
              O relatório aparecerá aqui após a análise.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
