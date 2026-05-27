import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { formatDateBR } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ q?: string; piece?: string }>;
}

export const metadata = { title: "Documentos — Admin" };

export default async function AdminDocumentsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const sb = createServiceClient();

  let q = sb
    .from("documents")
    .select("id, user_id, title, piece_type, area, status, created_at")
    .order("created_at", { ascending: false })
    .limit(300);

  if (sp.piece && sp.piece !== "all") q = q.eq("piece_type", sp.piece);
  if (sp.q?.trim()) q = q.ilike("title", `%${sp.q.trim()}%`);

  const { data: docs } = await q;
  const rows = docs ?? [];

  // Mapeia user_id -> email
  const userIds = Array.from(new Set(rows.map((d) => d.user_id)));
  const { data: profiles } = await sb
    .from("profiles")
    .select("id, email")
    .in("id", userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"]);
  const emailOf = new Map((profiles ?? []).map((p) => [p.id, p.email]));

  // Lista de piece_types únicos pra filtro
  const { data: allTypes } = await sb
    .from("documents")
    .select("piece_type")
    .order("piece_type");
  const pieceTypes = Array.from(new Set((allTypes ?? []).map((t) => t.piece_type)));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink-900">Documentos</h2>
        <p className="mt-1 text-sm text-ink-700">
          {rows.length} peça(s) — peças geradas por todos os usuários.
        </p>
      </div>

      <form
        action="/admin/documents"
        className="flex flex-wrap gap-3 rounded-xl border border-ink-200 bg-white p-3 shadow-sm"
      >
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Buscar por título…"
          className="flex-1 rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <select
          name="piece"
          defaultValue={sp.piece ?? "all"}
          className="rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="all">Todos os tipos</option>
          {pieceTypes.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          Filtrar
        </button>
        <Link
          href="/admin/documents"
          className="rounded-lg border border-ink-300 px-4 py-2 text-sm text-ink-700 hover:bg-ink-100"
        >
          Limpar
        </Link>
      </form>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-ink-200 bg-white p-10 text-center text-sm text-ink-500">
          Nenhum documento.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b border-ink-200 bg-ink-100/40 text-xs uppercase tracking-wider text-ink-600">
              <tr>
                <th className="px-4 py-3 text-left">Título</th>
                <th className="px-4 py-3 text-left">Tipo / Área</th>
                <th className="px-4 py-3 text-left">Autor</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Criado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {rows.map((d) => (
                <tr key={d.id} className="hover:bg-ink-100/30">
                  <td className="px-4 py-3 font-medium text-ink-900">{d.title}</td>
                  <td className="px-4 py-3">
                    <div className="text-ink-800">{d.piece_type}</div>
                    <div className="text-xs text-ink-500">{d.area ?? "—"}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <Link
                      href={`/admin/users/${d.user_id}`}
                      className="text-brand-700 hover:underline"
                    >
                      {emailOf.get(d.user_id) ?? d.user_id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        d.status === "final"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-ink-200 text-ink-700"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-500">
                    {formatDateBR(d.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
