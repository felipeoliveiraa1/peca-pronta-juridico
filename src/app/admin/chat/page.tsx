import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { KpiCard } from "@/components/admin/kpi-card";
import { formatDateBR } from "@/lib/utils";

export const metadata = { title: "Chat IA — Admin" };

const NF = new Intl.NumberFormat("pt-BR");

function daysAgoISO(d: number) {
  const dt = new Date();
  dt.setUTCDate(dt.getUTCDate() - d);
  dt.setUTCHours(0, 0, 0, 0);
  return dt.toISOString();
}

interface PageProps {
  searchParams: Promise<{ conv?: string }>;
}

export default async function AdminChatPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const sb = createServiceClient();

  // Estatísticas
  const { data: allMsgs } = await sb
    .from("chat_messages")
    .select("id, user_id, conversation_id, role, content, created_at")
    .order("created_at", { ascending: false })
    .limit(2000);

  const msgs = allMsgs ?? [];
  const now30 = daysAgoISO(30);
  const last30 = msgs.filter((m) => m.created_at >= now30);
  const userMsgs30 = last30.filter((m) => m.role === "user");

  const uniqueUsers30 = new Set(last30.map((m) => m.user_id)).size;
  const uniqueConvs30 = new Set(last30.map((m) => m.conversation_id)).size;

  // Conversas (agrupadas)
  const convMap = new Map<
    string,
    { userId: string; messages: number; last: string; preview: string }
  >();
  for (const m of msgs) {
    const cur = convMap.get(m.conversation_id);
    if (!cur) {
      convMap.set(m.conversation_id, {
        userId: m.user_id,
        messages: 1,
        last: m.created_at,
        preview: m.content.slice(0, 120),
      });
    } else {
      cur.messages++;
      if (m.created_at > cur.last) {
        cur.last = m.created_at;
        cur.preview = m.content.slice(0, 120);
      }
    }
  }
  const conversations = Array.from(convMap.entries())
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.last.localeCompare(a.last))
    .slice(0, 100);

  // Carrega emails dos donos das conversas
  const ownerIds = Array.from(new Set(conversations.map((c) => c.userId)));
  const { data: owners } =
    ownerIds.length > 0
      ? await sb.from("profiles").select("id, email").in("id", ownerIds)
      : { data: [] };
  const emailById = new Map((owners ?? []).map((o) => [o.id, o.email]));

  // Conversa selecionada
  let selectedMessages: typeof msgs = [];
  let selectedOwner = "";
  if (sp.conv) {
    selectedMessages = msgs
      .filter((m) => m.conversation_id === sp.conv)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    selectedOwner = emailById.get(selectedMessages[0]?.user_id ?? "") ?? "";
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink-900">Chat IA</h2>
        <p className="mt-1 text-sm text-ink-700">
          Conversas, mensagens e usuários ativos no assistente jurídico.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Mensagens (30d)" value={NF.format(last30.length)} />
        <KpiCard
          label="Perguntas (30d)"
          value={NF.format(userMsgs30.length)}
          hint="só mensagens do user"
        />
        <KpiCard
          label="Conversas únicas (30d)"
          value={NF.format(uniqueConvs30)}
        />
        <KpiCard
          label="Usuários únicos (30d)"
          value={NF.format(uniqueUsers30)}
          accent="violet"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
            Últimas conversas
          </h3>
          {conversations.length === 0 ? (
            <p className="rounded-xl border border-ink-200 bg-white p-6 text-center text-sm text-ink-500">
              Nenhuma conversa.
            </p>
          ) : (
            <div className="space-y-2">
              {conversations.map((c) => {
                const active = sp.conv === c.id;
                return (
                  <Link
                    key={c.id}
                    href={`/admin/chat?conv=${c.id}`}
                    className={`block rounded-lg border p-3 transition ${
                      active
                        ? "border-brand-500 bg-brand-50 shadow-md"
                        : "border-ink-200 bg-white hover:border-brand-300"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink-700">
                        {emailById.get(c.userId) ?? c.userId.slice(0, 8)}
                      </span>
                      <span className="text-ink-500">{formatDateBR(c.last)}</span>
                    </div>
                    <p className="line-clamp-2 text-sm text-ink-800">{c.preview}…</p>
                    <p className="mt-1 text-[10px] text-ink-500">
                      {c.messages} mensagem(ns)
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="sticky top-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
            {sp.conv ? `Conversa de ${selectedOwner}` : "Selecione uma conversa"}
          </h3>
          {!sp.conv ? (
            <p className="rounded-xl border border-dashed border-ink-300 bg-white p-10 text-center text-sm text-ink-500">
              Clique em uma conversa à esquerda para visualizar.
            </p>
          ) : selectedMessages.length === 0 ? (
            <p className="rounded-xl border border-ink-200 bg-white p-6 text-center text-sm text-ink-500">
              Conversa vazia.
            </p>
          ) : (
            <div className="max-h-[700px] space-y-2 overflow-y-auto rounded-xl border border-ink-200 bg-white p-3 shadow-sm">
              {selectedMessages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-lg p-3 text-sm ${
                    m.role === "user"
                      ? "bg-brand-50 text-ink-900"
                      : "bg-emerald-50 text-ink-900"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-ink-500">
                    <span className="font-bold">{m.role}</span>
                    <span>{formatDateBR(m.created_at)}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
