"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Sparkles,
  FileText,
  Library,
  ClipboardCheck,
  Calculator,
  Gavel,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Trabalho",
    items: [
      { href: "/dashboard", label: "Início", icon: Home },
      { href: "/dashboard/documents/new", label: "Gerar peça", icon: Sparkles },
      { href: "/dashboard/documents", label: "Meus documentos", icon: FileText },
    ],
  },
  {
    title: "Biblioteca",
    items: [
      { href: "/dashboard/templates", label: "Modelos", icon: Library },
      { href: "/dashboard/jurisprudencia", label: "Jurisprudência", icon: Gavel, badge: "Novo" },
      { href: "/dashboard/glossario", label: "Glossário", icon: BookOpen, badge: "Novo" },
    ],
  },
  {
    title: "Ferramentas",
    items: [
      { href: "/dashboard/reviewer", label: "Revisor", icon: ClipboardCheck },
      { href: "/dashboard/calculadoras", label: "Calculadoras", icon: Calculator, badge: "Novo" },
    ],
  },
  {
    title: "Conta",
    items: [{ href: "/dashboard/settings", label: "Plano e cobrança", icon: Settings }],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-ink-300/70 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-ink-300/70 px-5">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.svg" alt="Peça Pronta" width={32} height={32} />
          Peça Pronta
        </Link>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              {section.title}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                        active ? "bg-brand-100 text-brand-800" : "text-ink-700 hover:bg-ink-100",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <form action="/api/auth/signout" method="post" className="border-t border-ink-300/70 p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </form>
    </aside>
  );
}
