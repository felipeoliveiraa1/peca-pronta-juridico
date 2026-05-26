import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profile";
import { DocumentEditor } from "./document-editor";
import { PIECE_TYPES, type PieceTypeId } from "@/lib/piece-types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: doc } = await supabase
    .from("documents")
    .select("id, title, piece_type, area, status, content, updated_at")
    .eq("id", id)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!doc) notFound();

  const meta = PIECE_TYPES[doc.piece_type as PieceTypeId];

  return (
    <DocumentEditor
      doc={{
        id: doc.id,
        title: doc.title,
        pieceLabel: meta?.label ?? doc.piece_type,
        area: doc.area ?? meta?.area ?? null,
        status: doc.status,
        content: doc.content,
        updatedAt: doc.updated_at,
      }}
    />
  );
}
