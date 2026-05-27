import { NewPieceFlow } from "./new-piece-flow";
import { AREAS, PIECE_TYPES, PIECES_BY_AREA } from "@/lib/piece-types";
import { requireProfile } from "@/lib/profile";
import { getCurrentUsage } from "@/lib/usage";
import { getPlan } from "@/lib/plans";
import { GenerateTour } from "@/components/dashboard/tour-steps";

export const metadata = { title: "Gerar peça — Peça Pronta" };

interface PageProps {
  searchParams: Promise<{ type?: string; area?: string }>;
}

export default async function NewPiecePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const profile = await requireProfile();
  const usage = await getCurrentUsage(profile.id, profile.plan);
  const planDef = getPlan(profile.plan);

  // Serializa apenas o que o client component precisa (sem funções/helpers).
  const areas = Object.values(AREAS).map((a) => ({
    id: a.id,
    label: a.label,
    color: a.color,
    icon: a.icon,
    description: a.description,
    count: PIECES_BY_AREA[a.id]?.length ?? 0,
  }));

  const pieceList = Object.values(PIECE_TYPES).map((p) => ({
    id: p.id,
    label: p.label,
    area: p.area,
    areaLabel: p.areaLabel,
    description: p.description,
    icon: p.icon,
    estimatedMinutes: p.estimatedMinutes,
    popularity: p.popularity,
    badge: p.badge ?? null,
    fields: p.fields,
  }));

  return (
    <div className="space-y-6">
      <GenerateTour />
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Gerar nova peça</h1>
        <p className="mt-1 text-sm text-ink-700">
          Escolha o tipo de peça e preencha as informações do caso. A IA do Peça Pronta produzirá
          um rascunho completo no padrão técnico-jurídico brasileiro.
        </p>
      </div>

      <NewPieceFlow
        areas={areas}
        pieces={pieceList}
        initialPieceId={sp.type ?? null}
        initialAreaId={sp.area ?? null}
        usage={{ used: usage.used, limit: usage.limit, planName: planDef.name }}
      />
    </div>
  );
}
