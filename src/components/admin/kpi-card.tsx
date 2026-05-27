import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  trend?: { value: number; label: string };
  accent?: "default" | "emerald" | "amber" | "violet" | "rose";
  icon?: React.ComponentType<{ className?: string }>;
}

const ACCENTS = {
  default: "from-brand-50 to-white border-brand-200/60 text-brand-700",
  emerald: "from-emerald-50 to-white border-emerald-200/60 text-emerald-700",
  amber: "from-amber-50 to-white border-amber-200/60 text-amber-700",
  violet: "from-violet-50 to-white border-violet-200/60 text-violet-700",
  rose: "from-rose-50 to-white border-rose-200/60 text-rose-700",
};

export function KpiCard({
  label,
  value,
  hint,
  trend,
  accent = "default",
  icon: Icon,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-br p-4 shadow-sm",
        ACCENTS[accent],
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-600">
          {label}
        </div>
        {Icon && <Icon className="h-4 w-4 opacity-70" />}
      </div>
      <div className="mt-2 text-2xl font-bold text-ink-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-500">{hint}</div>}
      {trend && (
        <div
          className={cn(
            "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
            trend.value >= 0
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700",
          )}
        >
          {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value).toFixed(0)}%{" "}
          <span className="font-normal text-ink-600">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
