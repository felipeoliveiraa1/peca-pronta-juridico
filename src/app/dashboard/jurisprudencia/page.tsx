import { JURISPRUDENCIA, JURIS_AREAS, JURIS_COURTS } from "@/lib/jurisprudencia";
import { JurisprudenciaList } from "./jurisprudencia-list";
import { Gavel } from "lucide-react";
import { JurisprudenceTour } from "@/components/dashboard/tour-steps";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = { title: "Jurisprudência em Destaque — Peça Pronta" };

export default function JurisprudenciaPage() {
  return (
    <div className="space-y-6">
      <JurisprudenceTour />
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          <Gavel className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Jurisprudência em Destaque</h1>
          <p className="mt-1 text-sm text-ink-700">
            Precedentes curados do STF, STJ, TST e tribunais — atualizados periodicamente para você
            usar nas suas peças.
          </p>
        </div>
      </div>

      <Card className="bg-brand-50 border-brand-200">
        <CardHeader>
          <CardTitle className="text-sm">💡 Como usar</CardTitle>
          <CardDescription className="text-ink-700">
            Filtre por área ou tribunal abaixo. Use o botão <strong>"Copiar tese"</strong> para colar
            direto na sua peça em rascunho. Antes de protocolar, sempre confirme o número do
            processo no site oficial do tribunal.
          </CardDescription>
        </CardHeader>
      </Card>

      <JurisprudenciaList
        items={JURISPRUDENCIA}
        areas={JURIS_AREAS}
        courts={[...JURIS_COURTS]}
      />
    </div>
  );
}
