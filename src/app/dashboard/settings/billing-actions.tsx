"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PlanId } from "@/lib/plans";

export function CheckoutButton({ plan }: { plan: PlanId }) {
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Falha ao iniciar checkout.");
    }
  }

  return (
    <Button onClick={go} disabled={loading} className="w-full">
      {loading ? "Abrindo checkout…" : plan === "premium" ? "Assinar Premium" : "Assinar"}
    </Button>
  );
}

export function KiwifyCustomerAreaButton() {
  const url = process.env.NEXT_PUBLIC_KIWIFY_CUSTOMER_AREA || "https://kiwify.app/account";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-ink-300 bg-white px-4 text-sm font-medium text-ink-900 hover:bg-ink-100"
    >
      Gerenciar assinatura na Kiwify
    </a>
  );
}
