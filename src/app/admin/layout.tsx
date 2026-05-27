import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Peça Pronta" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-ink-100/50">
      <AdminSidebar />
      <div className="flex w-full min-w-0 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-ink-300/70 bg-white px-4 lg:px-6">
          <h1 className="text-base font-semibold text-ink-900">Painel Administrativo</h1>
          <div className="text-right">
            <div className="text-xs text-ink-500">Logado como</div>
            <div className="text-sm font-medium text-ink-900">{profile.email}</div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
