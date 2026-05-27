"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ExternalLink } from "lucide-react";
import type { PlanId } from "@/lib/plans";

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  plan: PlanId;
  planLabel: string;
  created_at_br: string;
  created_at_iso: string;
  documents: number;
  messages: number;
}

const PLANS: PlanId[] = ["free", "basic", "premium", "professional"];

const PLAN_BADGE: Record<PlanId, string> = {
  free: "bg-ink-200 text-ink-800",
  basic: "bg-blue-100 text-blue-800",
  premium: "bg-amber-100 text-amber-800",
  professional: "bg-violet-100 text-violet-800",
};

export function UsersTable({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function changePlan(id: string, plan: PlanId) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(`Erro: ${d.error ?? res.statusText}`);
        return;
      }
      startTransition(() => router.refresh());
    } finally {
      setBusyId(null);
    }
  }

  async function deleteUser(id: string, email: string) {
    if (
      !confirm(
        `Apagar permanentemente ${email}? Vai derrubar todos os documentos, mensagens e a conta de auth. Não dá pra desfazer.`,
      )
    )
      return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(`Erro: ${d.error ?? res.statusText}`);
        return;
      }
      startTransition(() => router.refresh());
    } finally {
      setBusyId(null);
    }
  }

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-ink-200 bg-white p-10 text-center text-sm text-ink-500 shadow-sm">
        Nenhum usuário encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="border-b border-ink-200 bg-ink-100/40 text-xs uppercase tracking-wider text-ink-600">
          <tr>
            <th className="px-4 py-3 text-left">Usuário</th>
            <th className="px-4 py-3 text-left">Plano</th>
            <th className="px-4 py-3 text-right">Docs</th>
            <th className="px-4 py-3 text-right">Mensagens</th>
            <th className="px-4 py-3 text-left">Cadastrado</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-200">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-ink-100/30">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/users/${u.id}`}
                  className="font-medium text-ink-900 hover:text-brand-700"
                >
                  {u.full_name || u.email.split("@")[0]}
                </Link>
                <div className="text-xs text-ink-500">{u.email}</div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PLAN_BADGE[u.plan]}`}
                >
                  {u.planLabel}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-ink-700">
                {u.documents}
              </td>
              <td className="px-4 py-3 text-right font-mono text-ink-700">
                {u.messages}
              </td>
              <td className="px-4 py-3 text-xs text-ink-500">{u.created_at_br}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <select
                    value={u.plan}
                    disabled={busyId === u.id || pending}
                    onChange={(e) => changePlan(u.id, e.target.value as PlanId)}
                    className="rounded-md border border-ink-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none"
                  >
                    {PLANS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <Link
                    href={`/admin/users/${u.id}`}
                    title="Detalhes"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteUser(u.id, u.email)}
                    disabled={busyId === u.id || pending}
                    title="Apagar conta"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
