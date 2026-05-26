"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle, Clock, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PieceField } from "@/lib/piece-types";

interface AreaItem {
  id: string;
  label: string;
  color: string;
  icon: string;
  description: string;
  count: number;
}

interface PieceItem {
  id: string;
  label: string;
  area: string;
  areaLabel: string;
  description: string;
  icon: string;
  estimatedMinutes: number;
  popularity: number;
  badge: "popular" | "new" | "trending" | null;
  fields: PieceField[];
}

type Step = "choose" | "fill";
type UsageSummary = { used: number; limit: number | null; planName: string };

export function NewPieceFlow({
  areas,
  pieces,
  initialPieceId,
  initialAreaId,
  usage,
}: {
  areas: AreaItem[];
  pieces: PieceItem[];
  initialPieceId: string | null;
  initialAreaId: string | null;
  usage: UsageSummary;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(initialPieceId ? "fill" : "choose");
  const [selectedAreaId, setSelectedAreaId] = useState<string>(initialAreaId ?? "");
  const [query, setQuery] = useState("");
  const [pieceId, setPieceId] = useState<string | null>(initialPieceId);

  const selectedPiece = useMemo(
    () => pieces.find((p) => p.id === pieceId) ?? null,
    [pieces, pieceId],
  );

  const filteredPieces = useMemo(() => {
    let list = [...pieces];
    if (selectedAreaId) list = list.filter((p) => p.area === selectedAreaId);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => b.popularity - a.popularity);
  }, [pieces, selectedAreaId, query]);

  function pickPiece(id: string) {
    setPieceId(id);
    setStep("fill");
  }

  if (step === "choose") {
    return (
      <ChooseStep
        areas={areas}
        pieces={filteredPieces}
        selectedAreaId={selectedAreaId}
        onSelectArea={setSelectedAreaId}
        query={query}
        onQuery={setQuery}
        onPick={pickPiece}
      />
    );
  }

  if (!selectedPiece) {
    return null;
  }

  return (
    <FillStep
      piece={selectedPiece}
      usage={usage}
      onBack={() => setStep("choose")}
      onDone={(id) => {
        router.push(`/dashboard/documents/${id}`);
        router.refresh();
      }}
    />
  );
}

// =============================================================
// STEP 1 — escolha do tipo
// =============================================================
function ChooseStep({
  areas,
  pieces,
  selectedAreaId,
  onSelectArea,
  query,
  onQuery,
  onPick,
}: {
  areas: AreaItem[];
  pieces: PieceItem[];
  selectedAreaId: string;
  onSelectArea: (id: string) => void;
  query: string;
  onQuery: (q: string) => void;
  onPick: (pieceId: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Busca */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
        <Input
          placeholder="Buscar tipo de peça (ex.: habeas corpus, contestação, alimentos...)"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Chips de área */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelectArea("")}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
            selectedAreaId === ""
              ? "border-brand-500 bg-brand-50 text-brand-700"
              : "border-ink-300 bg-white text-ink-700 hover:bg-ink-100",
          )}
        >
          Todas as áreas · {pieces.length}
        </button>
        {areas.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelectArea(a.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              selectedAreaId === a.id
                ? a.color
                : "border-ink-300 bg-white text-ink-700 hover:bg-ink-100",
            )}
          >
            <span className="mr-1">{a.icon}</span>
            {a.label} · {a.count}
          </button>
        ))}
      </div>

      {/* Grid de peças */}
      {pieces.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-sm text-ink-500">
            Nenhum tipo encontrado. Tente outro termo ou área.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pieces.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPick(p.id)}
              className="group flex flex-col items-start rounded-2xl border border-ink-300/70 bg-white p-5 text-left shadow-card transition hover:-translate-y-1 hover:border-brand-400 hover:shadow-lg"
            >
              <div className="flex w-full items-start justify-between">
                <span className="text-3xl">{p.icon}</span>
                {p.badge && (
                  <Badge
                    variant={
                      p.badge === "popular"
                        ? "success"
                        : p.badge === "trending"
                          ? "warning"
                          : "default"
                    }
                  >
                    {p.badge === "popular"
                      ? "🔥 Popular"
                      : p.badge === "trending"
                        ? "📈 Em alta"
                        : "✨ Novo"}
                  </Badge>
                )}
              </div>
              <h3 className="mt-3 text-base font-bold text-ink-900 group-hover:text-brand-700">
                {p.label}
              </h3>
              <p className="mt-1 text-xs text-ink-500">{p.areaLabel}</p>
              <p className="mt-3 line-clamp-2 text-sm text-ink-700">{p.description}</p>
              <div className="mt-4 flex w-full items-center justify-between border-t border-ink-300/60 pt-3 text-xs text-ink-500">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> ~{p.estimatedMinutes} min
                </span>
                <span className="inline-flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> {p.popularity}%
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================
// STEP 2 — preenchimento dos campos
// =============================================================
function FillStep({
  piece,
  usage,
  onBack,
  onDone,
}: {
  piece: PieceItem;
  usage: UsageSummary;
  onBack: () => void;
  onDone: (documentId: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  function set(id: string, value: string) {
    setInputs((s) => ({ ...s, [id]: value }));
  }

  const remaining = usage.limit == null ? null : Math.max(0, usage.limit - usage.used);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUpgradeRequired(false);
    if (!title.trim()) {
      setError("Dê um título para identificar o documento.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pieceType: piece.id,
          title: title.trim(),
          inputs,
          area: inputs.area_direito ?? piece.areaLabel,
          saveDocument: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || "Falha ao gerar a peça.");
        if (data.upgradeRequired) setUpgradeRequired(true);
        return;
      }
      if (data.documentId) onDone(data.documentId);
    } catch {
      setError("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-6 lg:grid-cols-3" onSubmit={onSubmit}>
      <div className="space-y-6 lg:col-span-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-700 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" /> Trocar tipo de peça
        </button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{piece.icon}</span>
              <div>
                <CardTitle>{piece.label}</CardTitle>
                <CardDescription>
                  {piece.areaLabel} · ~{piece.estimatedMinutes} min de geração + edição
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-ink-700">{piece.description}</p>
            <div className="space-y-1.5">
              <Label htmlFor="title">Título do documento</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`${piece.label} — Caso ...`}
                required
              />
              <p className="text-xs text-ink-500">
                Esse título aparece em "Meus documentos" para você identificar a peça depois.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do caso</CardTitle>
            <CardDescription>
              Preenchimento guiado — quanto mais detalhado, melhor o rascunho. Você poderá editar tudo
              depois no editor.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {piece.fields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="ml-1 text-red-600">*</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    value={inputs[field.id] ?? ""}
                    onChange={(e) => set(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                  />
                ) : field.type === "select" ? (
                  <Select
                    id={field.id}
                    value={inputs[field.id] ?? ""}
                    onChange={(e) => set(field.id, e.target.value)}
                  >
                    <option value="">Selecione…</option>
                    {field.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    id={field.id}
                    value={inputs[field.id] ?? ""}
                    onChange={(e) => set(field.id, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
                {field.helper && <p className="text-xs text-ink-500">{field.helper}</p>}
              </div>
            ))}
          </CardContent>
        </Card>

        {error && (
          <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            {upgradeRequired && (
              <a
                href="/dashboard/settings?upgrade=premium"
                className="self-start rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Fazer upgrade para o Premium
              </a>
            )}
          </div>
        )}
      </div>

      {/* Coluna lateral */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pronto para gerar?</CardTitle>
            <CardDescription>
              Plano atual: <strong>{usage.planName}</strong>
              <br />
              {usage.limit == null ? (
                <Badge variant="success" className="mt-2">Geração ilimitada</Badge>
              ) : (
                <Badge variant={remaining === 0 ? "warning" : "outline"} className="mt-2">
                  {remaining} peças restantes este mês
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Gerando peça…" : <><Sparkles className="h-4 w-4" /> Gerar com IA <ArrowRight className="h-4 w-4" /></>}
            </Button>
            <p className="mt-3 text-xs text-ink-500">
              ⏱ Geração leva de 15 a 45s. Mantenha a aba aberta.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">💡 Dica para esta peça</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-ink-700">
            <TipForPiece pieceId={piece.id} />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

function TipForPiece({ pieceId }: { pieceId: string }) {
  const TIPS: Record<string, string> = {
    peticao_inicial: "Descreva os fatos em ordem cronológica e seja específico no pedido — valores, prazos, obrigações.",
    contestacao: "Apresente todas as preliminares cabíveis antes do mérito. Lembre da prescrição (CC art. 206).",
    habeas_corpus: "Demonstre a ilegalidade do constrangimento com base no art. 312 CPP (ausência dos requisitos).",
    mandado_seguranca: "Direito líquido e certo significa direito provado documentalmente, sem necessidade de instrução.",
    tutela_urgencia: "Probabilidade do direito + perigo de dano = requisitos cumulativos (art. 300 CPC).",
    acao_alimentos: "Detalhe necessidades e possibilidades — a fixação segue a trinomia constitucional.",
    apelacao: "Atente para o preparo recursal e o prazo de 15 dias úteis (art. 1.003 CPC).",
    embargos_declaracao: "Identifique com precisão o vício (omissão/contradição/obscuridade/erro) e o trecho da decisão.",
    cumprimento_sentenca: "Inclua memória de cálculo completa: principal + correção (IPCA) + juros + honorários.",
    reclamacao_trabalhista: "Não esqueça da prescrição quinquenal (CF art. 7º, XXIX): 5 anos no curso e 2 após o término.",
  };
  return <p>{TIPS[pieceId] ?? "Quanto mais detalhado o input, mais precisa será a peça gerada. Use linguagem técnica quando souber o termo correto."}</p>;
}
