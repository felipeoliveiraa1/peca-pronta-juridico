"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Settings, User, ShieldCheck } from "lucide-react";

export function UserMenu({
  email,
  planLabel,
  isAdmin = false,
}: {
  email: string;
  planLabel: string;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 rounded-full border border-ink-300 bg-white px-2 py-1 text-sm hover:bg-ink-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[140px] truncate sm:inline">{email}</span>
        <ChevronDown className="h-4 w-4 text-ink-500" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-ink-300/70 bg-white shadow-xl"
        >
          <div className="border-b border-ink-300/60 bg-ink-100/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-900">{email}</p>
                <p className="text-xs text-ink-500">Plano: {planLabel}</p>
              </div>
            </div>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 border-b border-ink-300/60 bg-amber-50/50 px-4 py-2.5 text-sm font-medium text-amber-800 hover:bg-amber-100/60"
            >
              <ShieldCheck className="h-4 w-4" /> Painel Admin
            </Link>
          )}
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-100"
          >
            <Settings className="h-4 w-4" /> Plano e cobrança
          </Link>
          <Link
            href="/dashboard/documents"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-100"
          >
            <User className="h-4 w-4" /> Meus documentos
          </Link>

          <form action="/api/auth/signout" method="post" className="border-t border-ink-300/60">
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Sair da conta
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
