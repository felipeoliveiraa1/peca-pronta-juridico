"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Save,
  Trash2,
  ClipboardCheck,
  Sparkles,
  Loader2,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatDateBR } from "@/lib/utils";

interface Props {
  doc: {
    id: string;
    title: string;
    pieceLabel: string;
    area: string | null;
    status: string;
    content: string;
    updatedAt: string;
  };
}

const AI_ACTIONS = [
  { id: "continuar" as const, label: "Continuar texto", emoji: "✍️" },
  { id: "fundamentar" as const, label: "Adicionar fundamentação", emoji: "📚" },
  { id: "formalizar" as const, label: "Tom mais técnico", emoji: "🎩" },
  { id: "encurtar" as const, label: "Encurtar", emoji: "✂️" },
  { id: "resumir" as const, label: "Resumir", emoji: "📑" },
];

export function DocumentEditor({ doc }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(doc.title);
  const [content, setContent] = useState(doc.content);
  const [status, setStatus] = useState(doc.status);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [review, setReview] = useState<string | null>(null);
  const [aiAction, setAiAction] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiActionLabel, setAiActionLabel] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Atalho Ctrl+S / Cmd+S
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!saving) save();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, title, status]);

  const stats = useMemo(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    const pages = Math.max(1, Math.ceil(words / 280));
    const readingMin = Math.max(1, Math.ceil(words / 200));
    return { words, chars, pages, readingMin };
  }, [content]);

  async function save(newStatus?: string) {
    setSaving(true);
    const supabase = createClient();
    const finalStatus = newStatus ?? status;
    const { error } = await supabase
      .from("documents")
      .update({
        title,
        content,
        status: finalStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", doc.id);

    if (!error) {
      await supabase.from("document_versions").insert({
        document_id: doc.id,
        content,
      });
      setStatus(finalStatus);
      setSavedAt(new Date().toISOString());
      setIsDirty(false);
    }
    setSaving(false);
    router.refresh();
  }

  async function deleteDoc() {
    if (!confirm("Excluir este documento? Esta ação não pode ser desfeita.")) return;
    const supabase = createClient();
    await supabase.from("documents").delete().eq("id", doc.id);
    router.push("/dashboard/documents");
    router.refresh();
  }

  function downloadAs(format: "txt" | "docx" | "pdf") {
    if (format === "txt") {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      triggerDownload(blob, `${slug(title)}.txt`);
      return;
    }
    window.location.href = `/api/documents/${doc.id}/export?format=${format}`;
  }

  async function runReview() {
    setReviewing(true);
    setReview(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) setReview(`Erro: ${data.error || "falha na revisão"}`);
      else setReview(data.report);
    } finally {
      setReviewing(false);
    }
  }

  async function runAiAction(action: string, label: string) {
    setAiAction(action);
    setAiResult(null);
    setAiActionLabel(label);
    try {
      const res = await fetch("/api/text-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, text: content }),
      });
      const data = await res.json();
      if (!res.ok) setAiResult(`Erro: ${data.error}`);
      else setAiResult(data.text);
    } finally {
      setAiAction(null);
    }
  }

  function applyAiResult(mode: "append" | "replace") {
    if (!aiResult) return;
    if (mode === "append") {
      setContent((c) => c + "\n\n" + aiResult);
    } else {
      setContent(aiResult);
    }
    setIsDirty(true);
    setAiResult(null);
    setAiActionLabel(null);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsDirty(true);
            }}
            className="h-12 text-xl font-semibold"
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
            <Badge variant="outline">{doc.pieceLabel}</Badge>
            {doc.area && <Badge variant="outline">{doc.area}</Badge>}
            <Badge variant={status === "final" ? "success" : "outline"}>
              {status === "final" ? "Finalizado" : "Rascunho"}
            </Badge>
            {isDirty && <Badge variant="warning">Não salvo</Badge>}
            <span>· {formatDateBR(savedAt ?? doc.updatedAt)}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => save()} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? "Salvando…" : "Salvar (Ctrl+S)"}
          </Button>
          <Button
            variant={status === "final" ? "secondary" : "primary"}
            size="sm"
            onClick={() => save(status === "final" ? "draft" : "final")}
            disabled={saving}
          >
            {status === "final" ? "Reabrir como rascunho" : "Marcar como finalizado"}
          </Button>
          <details className="relative">
            <summary className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-ink-300 bg-white px-3 text-sm hover:bg-ink-100">
              <Download className="h-4 w-4" /> Exportar
            </summary>
            <div className="absolute right-0 z-10 mt-1 w-44 rounded-lg border border-ink-300 bg-white p-1 shadow-card">
              <button
                type="button"
                className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-ink-100"
                onClick={() => downloadAs("txt")}
              >
                📄 TXT
              </button>
              <button
                type="button"
                className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-ink-100"
                onClick={() => downloadAs("docx")}
              >
                📝 DOCX (Word)
              </button>
              <button
                type="button"
                className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-ink-100"
                onClick={() => downloadAs("pdf")}
              >
                📑 PDF (imprimir)
              </button>
            </div>
          </details>
          <Button variant="danger" size="sm" onClick={deleteDoc}>
            <Trash2 className="h-4 w-4" /> Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Editor */}
        <div className="space-y-3">
          <Card>
            <CardContent className="p-0">
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setIsDirty(true);
                }}
                className="prose-juridico min-h-[60vh] w-full resize-none bg-white p-6 outline-none"
                placeholder="Comece a escrever..."
              />
            </CardContent>
          </Card>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-ink-300/70 bg-white px-4 py-2 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> <strong>{stats.words}</strong> palavras
            </span>
            <span><strong>{stats.chars}</strong> caracteres</span>
            <span><strong>{stats.pages}</strong> {stats.pages === 1 ? "página" : "páginas"} (estimado)</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> <strong>{stats.readingMin}</strong> min de leitura
            </span>
          </div>
        </div>

        {/* Sidebar de ações */}
        <aside className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                <Sparkles className="inline h-4 w-4 text-brand-600" /> Ações rápidas com IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {AI_ACTIONS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  disabled={!!aiAction || content.length < 20}
                  onClick={() => runAiAction(a.id, a.label)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-ink-300 bg-white px-3 py-2 text-left text-sm transition hover:border-brand-400 hover:bg-brand-50 disabled:opacity-50"
                >
                  <span>
                    <span className="mr-2">{a.emoji}</span>
                    {a.label}
                  </span>
                  {aiAction === a.id && <Loader2 className="h-4 w-4 animate-spin text-brand-600" />}
                </button>
              ))}
              {content.length < 20 && (
                <p className="text-[11px] text-ink-500">
                  Escreva pelo menos 20 caracteres para usar as ações.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                <ClipboardCheck className="inline h-4 w-4 text-emerald-600" /> Revisor inteligente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full" onClick={runReview} disabled={reviewing || content.length < 50}>
                {reviewing ? "Analisando…" : "Revisar agora"}
              </Button>
              <p className="mt-2 text-[11px] text-ink-500">
                Análise em 4 dimensões: gramática, técnica, estrutura e fundamentação.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Resultado da ação de IA */}
      {aiResult && (
        <Card className="border-brand-300 bg-brand-50/30">
          <CardHeader>
            <CardTitle className="text-base">
              ✨ Resultado: {aiActionLabel}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <pre className="prose-juridico whitespace-pre-wrap rounded-lg border border-ink-300/70 bg-white p-4 text-sm">
              {aiResult}
            </pre>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => applyAiResult("append")}>
                ⬇️ Adicionar ao final do texto
              </Button>
              <Button size="sm" variant="outline" onClick={() => applyAiResult("replace")}>
                ⟲ Substituir todo o texto
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAiResult(null)}>
                Descartar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relatório de revisão */}
      {review && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <ClipboardCheck className="inline h-4 w-4 text-emerald-600" /> Relatório do revisor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="prose-juridico whitespace-pre-wrap rounded-lg bg-ink-100/60 p-4 text-sm">
              {review}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
