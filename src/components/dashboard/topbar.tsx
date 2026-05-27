import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getPlan, type PlanId } from "@/lib/plans";
import { UserMenu } from "./user-menu";
import { MobileMenuButton } from "./mobile-menu";

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
    <header className="flex h-16 items-center justify-between gap-3 border-b border-ink-300/70 bg-white px-4 lg:px-8">
      {/* Em mobile: hamburguer + logo. Em desktop: nada (sidebar substitui) */}
      <div className="flex items-center gap-3 lg:hidden">
        <MobileMenuButton />
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Peça Pronta" width={28} height={28} />
          <span className="text-base font-semibold">Peça Pronta</span>
        </Link>
      </div>

      {/* Saudação só aparece em desktop */}
      <div className="hidden text-sm text-ink-500 lg:block">
        Bem-vindo(a),{" "}
        <span className="font-medium text-ink-900">{email}</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Badge
          variant={monthLimit && usedThisMonth >= monthLimit ? "warning" : "outline"}
          className="hidden sm:inline-flex"
        >
          {monthLimit == null ? `${usedThisMonth} peças (ilimitado)` : `${usedThisMonth} / ${monthLimit} peças`}
        </Badge>
        <UserMenu email={email} planLabel={planDef.name} />
      </div>
    </header>
  );
}
