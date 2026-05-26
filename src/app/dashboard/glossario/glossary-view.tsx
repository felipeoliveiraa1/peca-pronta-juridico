"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { GlossaryTerm } from "@/lib/glossario";

export function GlossaryView({ terms, areas }: { terms: GlossaryTerm[]; areas: string[] }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("");

  const filtered = useMemo(() => {
    let list = [...terms];
    if (area) list = list.filter((t) => t.area === area);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));
  }, [terms, query, area]);

  // Agrupa por letra inicial
  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const t of filtered) {
      const letter = t.term.charAt(0).toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(t);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b, "pt-BR"));
  }, [filtered]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_240px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar termo (ex.: astreintes, súmula, prescrição)…"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setArea("")}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  area === ""
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-ink-300 bg-white text-ink-700 hover:bg-ink-100",
                )}
              >
                Todas
              </button>
              {areas.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArea(a)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    area === a
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-ink-300 bg-white text-ink-700 hover:bg-ink-100",
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {grouped.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-ink-500">
            Nenhum termo encontrado.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {grouped.map(([letter, items]) => (
            <section key={letter}>
              <h2 className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                {letter}
              </h2>
              <dl className="grid gap-3 md:grid-cols-2">
                {items.map((t) => (
                  <Card key={t.term}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <dt className="font-bold text-ink-900">{t.term}</dt>
                        <Badge variant="outline">{t.area}</Badge>
                      </div>
                      <dd className="mt-2 text-sm text-ink-700">{t.definition}</dd>
                      {t.relatedArt && (
                        <p className="mt-2 text-xs text-brand-700">📌 {t.relatedArt}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
