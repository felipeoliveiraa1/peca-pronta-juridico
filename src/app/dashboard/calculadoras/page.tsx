import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { CalculatorWidgets } from "./calculator-widgets";

export const metadata = { title: "Calculadoras Jurídicas — Peça Pronta" };

export default function CalculadorasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          <Calculator className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Calculadoras Jurídicas</h1>
          <p className="mt-1 text-sm text-ink-700">
            Ferramentas rápidas para prazos processuais, atualização de valores, custas e multas.
          </p>
        </div>
      </div>

      <Card className="bg-amber-50/40 border-amber-200">
        <CardHeader>
          <CardTitle className="text-sm">⚠️ Aviso</CardTitle>
          <CardDescription>
            As calculadoras seguem regras gerais do CPC, Lei 9.099/95 e dispositivos comuns. Sempre
            confira a regra específica do seu rito/tribunal antes de protocolar.
          </CardDescription>
        </CardHeader>
      </Card>

      <CalculatorWidgets />
    </div>
  );
}
