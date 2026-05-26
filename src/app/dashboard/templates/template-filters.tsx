"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function TemplateFilters({
  areas,
  currentArea,
  currentQuery,
}: {
  areas: string[];
  currentArea: string;
  currentQuery: string;
}) {
  const router = useRouter();

  function push(area: string, q: string) {
    const sp = new URLSearchParams();
    if (area) sp.set("area", area);
    if (q) sp.set("q", q);
    router.push(`/dashboard/templates${sp.toString() ? `?${sp}` : ""}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
        <Input
          defaultValue={currentQuery}
          placeholder="Buscar por título…"
          className="pl-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") push(currentArea, (e.target as HTMLInputElement).value);
          }}
        />
      </div>
      <Select
        defaultValue={currentArea}
        onChange={(e) => push(e.target.value, currentQuery)}
        className="sm:w-64"
      >
        <option value="">Todas as áreas</option>
        {areas.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </Select>
    </div>
  );
}
