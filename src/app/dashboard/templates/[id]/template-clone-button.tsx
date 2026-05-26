"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function TemplateCloneButton({
  templateId,
  title,
  pieceType,
  area,
  body,
}: {
  templateId: string;
  title: string;
  pieceType: string;
  area: string;
  body: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function clone() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        title: `Cópia: ${title}`,
        piece_type: pieceType,
        area,
        content: body,
        input_payload: { from_template: templateId },
      })
      .select("id")
      .single();

    setLoading(false);
    if (error || !data) {
      alert("Não foi possível copiar o modelo.");
      return;
    }
    router.push(`/dashboard/documents/${data.id}`);
  }

  return (
    <Button onClick={clone} disabled={loading}>
      <Copy className="h-4 w-4" /> {loading ? "Copiando…" : "Usar este modelo"}
    </Button>
  );
}
