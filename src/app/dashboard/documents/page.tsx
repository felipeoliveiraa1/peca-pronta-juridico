import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profile";
import { formatDateBR } from "@/lib/utils";
import { PIECE_TYPES, type PieceTypeId } from "@/lib/piece-types";

export const metadata = { title: "Meus documentos — Peça Pronta" };

export default async function DocumentsListPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select("id, title, piece_type, area, status, updated_at")
    .eq("user_id", profile.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Meus documentos</h1>
          <p className="mt-1 text-sm text-ink-700">
            Todas as peças que você gerou ou criou no Peça Pronta.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/documents/new">
            <Plus className="h-4 w-4" /> Nova peça
          </Link>
        </Button>
      </div>

      {documents && documents.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-ink-300/60">
              {documents.map((d) => {
                const pieceLabel = PIECE_TYPES[d.piece_type as PieceTypeId]?.label ?? d.piece_type;
                return (
                  <li key={d.id} className="flex items-center justify-between gap-3 px-5 py-4">
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/documents/${d.id}`}
                        className="block truncate font-medium text-ink-900 hover:text-brand-700"
                      >
                        {d.title}
                      </Link>
                      <div className="mt-0.5 text-xs text-ink-500">
                        {pieceLabel}
                        {d.area ? ` · ${d.area}` : ""} · atualizado em {formatDateBR(d.updated_at)}
                      </div>
                    </div>
                    <Badge variant={d.status === "final" ? "success" : "outline"}>
                      {d.status === "final" ? "Finalizado" : "Rascunho"}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="rounded-full bg-brand-100 p-3 text-brand-700">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900">Sem documentos ainda</h3>
            <p className="max-w-sm text-sm text-ink-700">
              Gere sua primeira peça com a IA do Peça Pronta. Demora menos de 1 minuto.
            </p>
            <Button asChild>
              <Link href="/dashboard/documents/new">
                <Plus className="h-4 w-4" /> Gerar primeira peça
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
