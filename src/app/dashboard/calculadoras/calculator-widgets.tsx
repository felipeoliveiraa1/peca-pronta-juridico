"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Coins, Receipt, AlarmClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

// ============================================================
// Calculadora 1: prazo processual em dias úteis (art. 219 CPC)
// ============================================================
function isHoliday(d: Date): boolean {
  // Feriados nacionais fixos brasileiros (sem móveis para simplificar)
  const md = `${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  return [
    "01-01", "04-21", "05-01", "09-07", "10-12", "11-02", "11-15", "12-25",
  ].includes(md);
}

function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd === 0 || wd === 6) continue;
    if (isHoliday(d)) continue;
    added++;
  }
  return d;
}

function PrazoCalculator() {
  const [intimacao, setIntimacao] = useState(new Date().toISOString().slice(0, 10));
  const [dias, setDias] = useState("15");

  const result = useMemo(() => {
    if (!intimacao || !dias) return null;
    const n = Number(dias);
    if (!Number.isFinite(n) || n <= 0) return null;
    const start = new Date(intimacao + "T00:00:00");
    // Início do prazo: dia útil seguinte à intimação (art. 224 §3º CPC)
    const startBusinessDay = addBusinessDays(start, 1);
    const end = addBusinessDays(startBusinessDay, n - 1);
    return {
      start: startBusinessDay,
      end,
    };
  }, [intimacao, dias]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-brand-700" />
          <CardTitle className="text-base">Prazo processual (dias úteis)</CardTitle>
        </div>
        <CardDescription>
          Conforme art. 219 CPC, prazos em dias contam-se em dias úteis. O termo inicial é o dia útil
          seguinte à intimação.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="intimacao">Data da intimação</Label>
            <Input id="intimacao" type="date" value={intimacao} onChange={(e) => setIntimacao(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dias">Prazo (dias úteis)</Label>
            <Select id="dias" value={dias} onChange={(e) => setDias(e.target.value)}>
              <option value="5">5 dias (embargos de declaração)</option>
              <option value="10">10 dias</option>
              <option value="15">15 dias (apelação, agravo, contestação)</option>
              <option value="30">30 dias (recurso especial/extraordinário)</option>
              <option value="custom">Outro…</option>
            </Select>
          </div>
        </div>
        {dias === "custom" && (
          <div className="space-y-1.5">
            <Label htmlFor="custom-dias">Dias úteis</Label>
            <Input id="custom-dias" type="number" min={1} max={120} onChange={(e) => setDias(e.target.value)} />
          </div>
        )}
        {result && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm">
            <p className="text-emerald-800">
              <strong>Início da contagem:</strong> {formatDate(result.start)}
            </p>
            <p className="mt-1 text-emerald-800">
              <strong>Fim do prazo:</strong> {formatDate(result.end)} (
              {result.end.toLocaleDateString("pt-BR", { weekday: "long" })})
            </p>
          </div>
        )}
        <p className="text-[11px] text-ink-500">
          Não considera feriados estaduais, recessos forenses ou suspensões locais. Confira o
          calendário do tribunal.
        </p>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Calculadora 2: atualização (juros + correção monetária)
// ============================================================
function AtualizacaoCalculator() {
  const [valor, setValor] = useState("1000");
  const [dataInicial, setDataInicial] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().slice(0, 10);
  });
  const [juros, setJuros] = useState("1.0"); // % ao mês

  const result = useMemo(() => {
    const v = Number(valor.replace(",", "."));
    const j = Number(juros.replace(",", ".")) / 100;
    if (!v || !j || !dataInicial) return null;
    const di = new Date(dataInicial + "T00:00:00");
    const hoje = new Date();
    const meses =
      (hoje.getFullYear() - di.getFullYear()) * 12 + (hoje.getMonth() - di.getMonth());
    if (meses < 0) return null;
    // Correção monetária aproximada usando IPCA médio anualizado (4% a.a., para fins didáticos).
    const correcaoMensal = Math.pow(1.04, 1 / 12) - 1;
    const valorCorrigido = v * Math.pow(1 + correcaoMensal, meses);
    const totalJuros = valorCorrigido * j * meses;
    const total = valorCorrigido + totalJuros;
    return {
      meses,
      valorCorrigido,
      totalJuros,
      total,
    };
  }, [valor, juros, dataInicial]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-amber-700" />
          <CardTitle className="text-base">Atualização de valor (juros + correção)</CardTitle>
        </div>
        <CardDescription>
          Estima o valor atualizado de uma dívida usando juros simples + correção monetária
          aproximada pelo IPCA anualizado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="valor">Valor original (R$)</Label>
            <Input id="valor" value={valor} onChange={(e) => setValor(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="data-inicial">Data inicial</Label>
            <Input id="data-inicial" type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="juros">Juros (% ao mês)</Label>
            <Input id="juros" value={juros} onChange={(e) => setJuros(e.target.value)} />
          </div>
        </div>
        {result && (
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultBox label="Período" value={`${result.meses} mês(es)`} />
            <ResultBox label="Valor corrigido (IPCA)" value={formatBRL(result.valorCorrigido)} />
            <ResultBox label="Juros acumulados" value={formatBRL(result.totalJuros)} />
            <ResultBox label="Total atualizado" value={formatBRL(result.total)} highlight />
          </div>
        )}
        <p className="text-[11px] text-ink-500">
          Cálculo aproximado para uso preliminar. Para memória de cálculo de cumprimento de sentença,
          utilize tabelas oficiais (Justiça Federal, TJSP, etc.).
        </p>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Calculadora 3: valor da causa / custas estimadas
// ============================================================
function CustasCalculator() {
  const [valorCausa, setValorCausa] = useState("10000");
  const [rito, setRito] = useState("comum");

  const result = useMemo(() => {
    const v = Number(valorCausa.replace(",", "."));
    if (!v) return null;
    // Estimativa simplificada (varia muito entre tribunais):
    // - Justiça comum: 1% do valor da causa, mín. R$ 65 e máx. R$ 1.000 (varia por TJ).
    // - Juizado especial: gratuito até a sentença.
    let custas = 0;
    if (rito === "comum") {
      custas = Math.min(Math.max(v * 0.01, 65), 5000);
    } else if (rito === "jec") {
      custas = 0;
    } else if (rito === "trabalho") {
      // Após reforma trabalhista, custas para reclamante hipossuficiente são adiadas, mas
      // valor de referência é 2% do total devido na sentença. Aqui usamos só ilustração.
      custas = v * 0.02;
    } else if (rito === "federal") {
      custas = Math.min(Math.max(v * 0.005, 10), 2000);
    }
    return { custas };
  }, [valorCausa, rito]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-emerald-700" />
          <CardTitle className="text-base">Custas processuais estimadas</CardTitle>
        </div>
        <CardDescription>
          Valor de referência aproximado. Cada tribunal tem tabela própria — sempre consulte a
          tabela oficial (TJ, TRF, TRT) antes de protocolar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="valor-causa">Valor da causa (R$)</Label>
            <Input id="valor-causa" value={valorCausa} onChange={(e) => setValorCausa(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rito">Rito / Justiça</Label>
            <Select id="rito" value={rito} onChange={(e) => setRito(e.target.value)}>
              <option value="comum">Justiça Comum (Estadual)</option>
              <option value="jec">Juizado Especial Cível</option>
              <option value="trabalho">Justiça do Trabalho</option>
              <option value="federal">Justiça Federal</option>
            </Select>
          </div>
        </div>
        {result && (
          <ResultBox
            label="Custas estimadas"
            value={result.custas === 0 ? "Gratuito (até a sentença)" : formatBRL(result.custas)}
            highlight
          />
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================
// Calculadora 4: multa diária (astreintes)
// ============================================================
function MultaCalculator() {
  const [multaDiaria, setMultaDiaria] = useState("500");
  const [dias, setDias] = useState("30");
  const [teto, setTeto] = useState("50000");

  const result = useMemo(() => {
    const m = Number(multaDiaria.replace(",", "."));
    const d = Number(dias);
    const t = Number(teto.replace(",", "."));
    if (!m || !d) return null;
    const valorBruto = m * d;
    const valorFinal = t > 0 ? Math.min(valorBruto, t) : valorBruto;
    const atingiuTeto = t > 0 && valorBruto > t;
    return { valorBruto, valorFinal, atingiuTeto, diaTeto: t > 0 ? Math.ceil(t / m) : null };
  }, [multaDiaria, dias, teto]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlarmClock className="h-5 w-5 text-rose-700" />
          <CardTitle className="text-base">Multa diária (astreintes)</CardTitle>
        </div>
        <CardDescription>
          Calcula o total devido em descumprimento de obrigação de fazer/não fazer (art. 537 CPC).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="multa-diaria">Multa diária (R$)</Label>
            <Input id="multa-diaria" value={multaDiaria} onChange={(e) => setMultaDiaria(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="multa-dias">Dias de descumprimento</Label>
            <Input id="multa-dias" type="number" min={0} value={dias} onChange={(e) => setDias(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="teto">Teto (R$) — 0 = sem teto</Label>
            <Input id="teto" value={teto} onChange={(e) => setTeto(e.target.value)} />
          </div>
        </div>
        {result && (
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultBox label="Valor bruto" value={formatBRL(result.valorBruto)} />
            <ResultBox label="Valor exigível" value={formatBRL(result.valorFinal)} highlight />
            {result.atingiuTeto && result.diaTeto && (
              <p className="sm:col-span-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                ⚠️ Teto atingido no <strong>{result.diaTeto}º dia</strong>. Considere requerer
                majoração da multa em vez de novo período.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================
function ResultBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 ${
        highlight
          ? "border-emerald-200 bg-emerald-50"
          : "border-ink-300/70 bg-ink-100/40"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-ink-500">{label}</p>
      <p
        className={`mt-1 text-lg font-bold ${
          highlight ? "text-emerald-700" : "text-ink-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function formatBRL(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(d);
}

export function CalculatorWidgets() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <PrazoCalculator />
      <AtualizacaoCalculator />
      <CustasCalculator />
      <MultaCalculator />
    </div>
  );
}
