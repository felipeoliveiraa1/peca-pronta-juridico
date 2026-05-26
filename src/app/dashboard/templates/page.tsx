import Link from "next/link";
import { Crown, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profile";
import { getPlan } from "@/lib/plans";
import { TemplateFilters } from "./template-filters";

export const metadata = { title: "Biblioteca de modelos — Peça Pronta" };

interface PageProps {
  searchParams: Promise<{ area?: string; q?: string }>;
}

export default async function TemplatesPage({ searchParams }: PageProps) {
  const { area, q } = await searchParams;
  const profile = await requireProfile();
  const planDef = getPlan(profile.plan);
  const supabase = await createClient();

  let query = supabase.from("templates").select("*").order("title");
  if (area) query = query.eq("area", area);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data: templates } = await query;
  const { data: areasData } = await supabase.from("templates").select("area");
  const areas = Array.from(new Set((areasData ?? []).map((r) => r.area))).sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Biblioteca de modelos</h1>
        <p className="mt-1 text-sm text-ink-700">
          Modelos revisados por especialistas, prontos para serem usados como ponto de partida.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <TemplateFilters areas={areas} currentArea={area ?? ""} currentQuery={q ?? ""} />
        </CardContent>
      </Card>

      {!templates || templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Search className="h-8 w-8 text-ink-500" />
            <p className="text-sm text-ink-500">Nenhum modelo encontrado com os filtros atuais.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((t) => {
            const locked = t.is_premium && !planDef.premiumTemplates;
            return (
              <Card key={t.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{t.area}</Badge>
                    {t.is_premium && (
                      <Badge variant={locked ? "warning" : "default"}>
                        <Crown className="mr-1 h-3 w-3" /> Premium
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base">{t.title}</CardTitle>
                  {t.description && (
                    <p className="text-sm text-ink-700">{t.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {locked ? (
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/dashboard/settings">Fazer upgrade para usar</Link>
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/dashboard/templates/${t.id}`}>Abrir modelo</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
