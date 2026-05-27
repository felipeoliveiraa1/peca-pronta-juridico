"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o drawer ao navegar
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloqueia scroll do body quando aberto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-300 bg-white text-ink-700 hover:bg-ink-100 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-ink-300/70 px-5">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Image src="/logo.svg" alt="Peça Pronta" width={32} height={32} />
                Peça Pronta
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex h-[calc(100%-8rem)] flex-col gap-5 overflow-y-auto p-3">
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
                              "flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
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
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
