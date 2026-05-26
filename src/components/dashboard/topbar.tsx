import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getPlan, type PlanId } from "@/lib/plans";

export function Topbar({
  email,
  plan,
  usedThisMonth,
  monthLimit,
}: {
  email: string;
  plan: PlanId;
  usedThisMonth: number;
  monthLimit: number | null;
}) {
  const planDef = getPlan(plan);
  return (
    <header className="flex h-16 items-center justify-between border-b border-ink-300/70 bg-white px-4 lg:px-8">
      <div className="text-sm text-ink-500">
        Bem-vindo(a),{" "}
        <span className="font-medium text-ink-900">{email}</span>
      </div>
      <div className="flex items-center gap-3 text-xs">
        <span className="hidden sm:inline text-ink-500">Uso do mês:</span>
        <Badge variant={monthLimit && usedThisMonth >= monthLimit ? "warning" : "outline"}>
          {monthLimit == null ? `${usedThisMonth} peças (ilimitado)` : `${usedThisMonth} / ${monthLimit} peças`}
        </Badge>
        <Link
          href="/dashboard/settings"
          className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800 hover:bg-brand-200"
        >
          {planDef.name}
        </Link>
      </div>
    </header>
  );
}
