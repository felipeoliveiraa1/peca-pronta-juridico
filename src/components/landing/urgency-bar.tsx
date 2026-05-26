"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

function todayBR() {
  const now = new Date();
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(now);
}

function timeLeft() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const diff = Math.max(0, end.getTime() - now.getTime());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function UrgencyBar() {
  const [left, setLeft] = useState("--:--:--");
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(todayBR());
    setLeft(timeLeft());
    const id = setInterval(() => setLeft(timeLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="bg-accent-500 text-white">
      <div className="container-page flex flex-wrap items-center justify-center gap-2 py-2 text-center text-xs font-semibold uppercase tracking-wide sm:text-sm">
        <Flame className="h-4 w-4 animate-pulse" />
        <span>🔥 OFERTA ESPECIAL — DISPONÍVEL APENAS HOJE, {date}</span>
        <span className="hidden sm:inline">•</span>
        <span>Termina em <span className="font-mono">{left}</span></span>
      </div>
    </div>
  );
}
