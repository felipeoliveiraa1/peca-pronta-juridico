"use client";

import { useEffect } from "react";
import { captureUtmsFromUrl } from "@/lib/utm-tracking";

/**
 * Roda uma vez no mount da landing. Captura UTMs/click IDs da URL,
 * persiste em sessionStorage pra serem propagados depois nos links de
 * checkout da Kiwify.
 */
export function UtmCapture() {
  useEffect(() => {
    captureUtmsFromUrl();
  }, []);
  return null;
}
