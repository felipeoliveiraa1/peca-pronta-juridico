import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin";
import { getCurrentProfile } from "@/lib/profile";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const PATCH_SCHEMA = z.object({
  plan: z.enum(["free", "basic", "premium", "professional"]).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const me = await getCurrentProfile();
  if (!isAdmin(me)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = PATCH_SCHEMA.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const sb = createServiceClient();
  const { error } = await sb
    .from("profiles")
    .update({ plan: parsed.data.plan })
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const me = await getCurrentProfile();
  if (!isAdmin(me)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const sb = createServiceClient();
  // Apaga via auth.admin (cascata via FK derruba profiles + dependentes).
  const { error } = await sb.auth.admin.deleteUser(id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
