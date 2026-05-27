"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Trash2,
  Loader2,
  AlertCircle,
  Scale,
} from "lucide-react";
import Link from "next/link";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Qual o prazo da apelação cível?",
  "Diferença entre litisconsórcio necessário e facultativo?",
  "Como redigir uma réplica?",
  "Quando cabe agravo de instrumento?",
  "O que é tutela de evidência?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ used: number; limit: number | null } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const historyFetched = useRef(false);

  // Carrega histórico ao abrir pela 1ª vez (apenas uma vez por montagem)
  useEffect(() => {
    if (!open || historyFetched.current) return;
    historyFetched.current = true;
    setInitialLoading(true);
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => {
        if (d.messages?.length) {
          setMessages(d.messages.map((m: Message) => ({ role: m.role, content: m.content })));
        }
        if (d.conversation_id) setConversationId(d.conversation_id);
      })
      .catch(() => {})
      .finally(() => setInitialLoading(false));
  }, [open]);

  // Auto-scroll ao receber nova mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Atalho "/" pra abrir/fechar (exceto em input)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape" && open) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setError(null);
    setUpgradeRequired(false);
    setMessages((m) => [...m, { role: "user", content }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, conversation_id: conversationId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || "Falha na IA");
        if (data.upgradeRequired) setUpgradeRequired(true);
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: data.message }]);
      if (data.conversation_id) setConversationId(data.conversation_id);
      if (data.usage) setUsage(data.usage);
    } catch {
      setError("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function clearConversation() {
    if (!confirm("Limpar todas as mensagens? Não dá pra desfazer.")) return;
    await fetch("/api/chat", { method: "DELETE" });
    setMessages([]);
    setConversationId(null);
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-emerald-600 text-white shadow-2xl shadow-brand-500/40 transition hover:scale-110 active:scale-100 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
        aria-label="Abrir chat IA jurídica"
        title="Chat IA (atalho: /)"
      >
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-ink-900">
          IA
        </span>
      </button>

      {/* Backdrop em mobile + Painel */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-0 z-50 flex flex-col bg-white shadow-2xl sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[420px] sm:border-l sm:border-ink-300/70">
            {/* Header */}
            <div className="flex h-16 items-center justify-between gap-3 border-b border-ink-300/70 bg-gradient-to-r from-brand-700 to-emerald-600 px-4 text-white">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <Scale className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">Assistente Jurídico IA</h2>
                  <p className="text-[11px] text-white/80">
                    {usage?.limit
                      ? `${usage.used}/${usage.limit} mensagens este mês`
                      : "Tire suas dúvidas em segundos"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearConversation}
                    aria-label="Limpar conversa"
                    title="Limpar conversa"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/15 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/15 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-[11px] text-amber-900">
              ⚠️ Respostas orientativas. Não substituem consulta a um advogado.
            </div>

            {/* Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-ink-100/30 p-4">
              {initialLoading ? (
                <div className="flex h-full items-center justify-center text-sm text-ink-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando…
                </div>
              ) : messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-sm leading-relaxed text-ink-900">
                      Olá! 👋 Sou seu <strong>Assistente Jurídico</strong>.
                      Posso esclarecer dúvidas pontuais sobre Direito Brasileiro, citar dispositivos e te
                      orientar a usar o app.
                    </p>
                    <p className="mt-2 text-xs text-ink-500">
                      Pergunte sobre prazos, conceitos, redação de peças, etc.
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
                      💡 Sugestões pra começar
                    </p>
                    <div className="space-y-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => send(s)}
                          className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-left text-sm text-ink-700 transition hover:border-brand-400 hover:bg-brand-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m, i) => (
                    <MessageBubble key={i} message={m} />
                  ))}
                  {loading && (
                    <div className="flex items-center gap-2 px-3 text-xs text-ink-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Pensando...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Erro / Upgrade */}
            {error && (
              <div className="border-t border-red-200 bg-red-50 px-4 py-3">
                <div className="flex items-start gap-2 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
                {upgradeRequired && (
                  <Link
                    href="/dashboard/settings?upgrade=premium"
                    className="mt-2 inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-red-600 px-4 text-xs font-medium text-white hover:bg-red-700"
                    onClick={() => setOpen(false)}
                  >
                    Fazer upgrade <Sparkles className="h-3 w-3" />
                  </Link>
                )}
              </div>
            )}

            {/* Input */}
            <form
              className="flex items-center gap-2 border-t border-ink-300/70 bg-white p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Pergunte algo... (Enter envia, Shift+Enter quebra linha)"
                rows={1}
                className="flex-1 resize-none rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 text-white shadow-sm transition hover:bg-brand-800 disabled:opacity-50"
                aria-label="Enviar"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-sm text-white shadow-sm">
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <div className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Scale className="h-3.5 w-3.5" />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-2.5 text-sm text-ink-900 shadow-sm">
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}
