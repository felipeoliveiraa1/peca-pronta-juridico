"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  CreditCard,
  Activity,
  ArrowLeft,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ITEMS: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Usuários", icon: Users },
  { href: "/admin/documents", label: "Documentos", icon: FileText },
  { href: "/admin/chat", label: "Chat IA", icon: MessageSquare },
  { href: "/admin/usage", label: "Uso & Custos", icon: Activity },
  { href: "/admin/subscriptions", label: "Assinaturas", icon: CreditCard },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-ink-300/70 bg-ink-900 text-ink-100 lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-ink-700 px-5">
        <Image src="/logo.svg" alt="Peça Pronta" width={28} height={28} />
        <div>
          <div className="text-sm font-semibold">Peça Pronta</div>
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-400">
            <ShieldCheck className="h-3 w-3" /> Admin
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {ITEMS.map((item) => {
          const active =
            item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-ink-300 hover:bg-ink-800 hover:text-white",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-ink-700 p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-300 hover:bg-ink-800 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao app
        </Link>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-300 hover:bg-ink-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
