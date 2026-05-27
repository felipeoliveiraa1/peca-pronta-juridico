import type { Metadata } from "next";
import "./globals.css";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { UtmCapture } from "@/components/analytics/utm-capture";

export const metadata: Metadata = {
  title: "Peça Pronta — Assistente Jurídico com IA",
  description:
    "Redija peças jurídicas em minutos com inteligência artificial treinada em Direito Brasileiro. Modelos premium, revisor inteligente e organizador de documentos.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
  // Meta-tag de verificação de domínio Meta Business
  // https://business.facebook.com/settings/owned-domains
  other: {
    "facebook-domain-verification": "yirof1cfvspt8nh9ts8heitblyu2xv",
  },
  openGraph: {
    title: "Peça Pronta — Assistente Jurídico com IA",
    description: "Otimize seu tempo, garanta a precisão e acelere sua carreira no Direito.",
    type: "website",
    locale: "pt_BR",
    images: ["/logo-wordmark.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <MetaPixel />
        <UtmCapture />
        {children}
      </body>
    </html>
  );
}
