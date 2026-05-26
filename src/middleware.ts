import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Exclui assets estáticos e o webhook da Kiwify (que precisa ler o body cru).
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks/kiwify|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
