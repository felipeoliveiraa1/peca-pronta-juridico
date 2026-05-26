import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profile";
import { getPlan } from "@/lib/plans";
import { TemplateCloneButton } from "./template-clone-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const profile = await requireProfile();
  const planDef = getPlan(profile.plan);
  const supabase = await createClient();

  const { data: template } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!template) notFound();

  if (template.is_premium && !planDef.premiumTemplates) {
    redirect("/dashboard/settings?upgrade=premium");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{template.area}</Badge>
          <Badge variant="outline">{template.piece_type}</Badge>
          {template.is_premium && (
            <Badge variant="default">
              <Crown className="mr-1 h-3 w-3" /> Premium
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-semibold text-ink-900">{template.title}</h1>
        {template.description && (
          <p className="text-sm text-ink-700">{template.description}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <TemplateCloneButton
          templateId={template.id}
          title={template.title}
          pieceType={template.piece_type}
          area={template.area}
          body={template.body}
        />
        <Button asChild variant="outline">
          <Link href="/dashboard/templates">Voltar para a biblioteca</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conteúdo do modelo</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="prose-juridico whitespace-pre-wrap rounded-lg bg-ink-100/60 p-4 text-sm">
            {template.body}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
