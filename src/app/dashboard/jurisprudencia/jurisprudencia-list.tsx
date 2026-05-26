"use client";

import { useMemo, useState } from "react";
import { Copy, Search, Check, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { JurisprudenciaItem } from "@/lib/jurisprudencia";

const COURT_COLORS: Record<string, string> = {
  STF: "bg-rose-100 text-rose-700 border-rose-200",
  STJ: "bg-brand-100 text-brand-700 border-brand-200",
  TST: "bg-emerald-100 text-emerald-700 border-emerald-200",
  TJ: "bg-violet-100 text-violet-700 border-violet-200",
  TRF: "bg-amber-100 text-amber-700 border-amber-200",
};

export function JurisprudenciaList({
  items,
  areas,
  courts,
}: {
  items: JurisprudenciaItem[];
  areas: string[];
  courts: string[];
}) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("");
  const [court, setCourt] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...items];
    if (area) list = list.filter((j) => j.area === area);
    if (court) list = list.filter((j) => j.court === court);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (j) =>
          j.topic.toLowerCase().includes(q) ||
          j.summary.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [items, area, court, query]);

  async function copyTese(item: JurisprudenciaItem) {
    const text = `${item.tese}\n\nFonte: ${item.court} — ${formatDate(item.date)}. Referências: ${item.refs.join("; ")}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert(text);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="relative sm:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar tema, tese, súmula…"
                className="pl-9"
              />
            </div>
            <Select value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="">Todas as áreas</option>
              {areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </Select>
            <Select value={court} onChange={(e) => setCourt(e.target.value)}>
              <option value="">Todos os tribunais</option>
              {courts.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-ink-500">
            Nenhum precedente encontrado com os filtros atuais.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((j) => (
            <Card key={j.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold",
                      COURT_COLORS[j.court] ?? "border-ink-300 bg-ink-100 text-ink-700",
                    )}
                  >
                    {j.court}
                  </span>
                  <span className="text-xs text-ink-500">{formatDate(j.date)}</span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-wide text-ink-500">{j.area}</p>
                <h3 className="text-base font-bold text-ink-900">{j.topic}</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-ink-700">{j.summary}</p>
                <div className="rounded-lg border-l-4 border-brand-500 bg-brand-50/60 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Tese</p>
                  <p className="mt-1 text-sm italic text-ink-900">{j.tese}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {j.refs.map((r) => (
                    <Badge key={r} variant="outline">
                      <ExternalLink className="mr-1 h-3 w-3" /> {r}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {j.tags.map((t) => (
                    <span key={t} className="text-[11px] text-ink-500">#{t}</span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => copyTese(j)}
                  className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-brand-300 bg-white text-sm font-medium text-brand-700 hover:bg-brand-50"
                >
                  {copiedId === j.id ? (
                    <>
                      <Check className="h-4 w-4" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copiar tese
                    </>
                  )}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
    .format(new Date(iso + "T00:00:00"));
}
