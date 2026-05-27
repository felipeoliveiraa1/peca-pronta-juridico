/**
 * Compositor de criativos com imagem fotorrealista + texto/CTA sobrepostos.
 * Suporta múltiplos ads em batch.
 */
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "public/ads");

const C = {
  bgFrom: "#1e4fc7",
  bgTo: "#0b1838",
  emerald: "#10b981",
  amber: "#fbbf24",
  white: "#ffffff",
  ink: "#0f172a",
  inkSoft: "#cbd5e1",
};
const FONT = "Helvetica, Arial, sans-serif";

function toDataUri(path) {
  return `data:image/png;base64,${readFileSync(path).toString("base64")}`;
}

function defs() {
  return `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${C.bgFrom}" />
        <stop offset="100%" stop-color="${C.bgTo}" />
      </linearGradient>
      <linearGradient id="check" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#34d399" />
        <stop offset="100%" stop-color="#059669" />
      </linearGradient>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="10" stdDeviation="22" flood-color="#000" flood-opacity="0.45" />
      </filter>
    </defs>
  `;
}

function brand(W, y) {
  const cx = W / 2;
  const size = 72;
  return `
    <g transform="translate(${cx - size / 2} ${y})">
      <rect width="${size}" height="${size}" rx="16" fill="rgba(255,255,255,0.22)" />
      <path d="M18 16 V56 M18 16 H40 A12 12 0 0 1 40 39 H18"
        stroke="${C.white}" stroke-width="6.5" fill="none"
        stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="52" cy="52" r="11" fill="url(#check)" />
      <path d="M47 52 L51 56 L57 46"
        stroke="${C.white}" stroke-width="2.8" fill="none"
        stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <text x="${cx}" y="${y + size + 32}" fill="${C.white}" font-family="${FONT}"
      font-size="26" font-weight="800" letter-spacing="5" text-anchor="middle">
      PEÇA PRONTA
    </text>
  `;
}

function cta(W, H, { text, microcopy, color = C.amber, textColor = C.ink }) {
  const cx = W / 2;
  const btnW = W - 120;
  const btnH = 130;
  const btnX = (W - btnW) / 2;
  const btnY = H - 220;
  return `
    <g filter="url(#shadow)">
      <rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="28" fill="${color}" />
      <text x="${cx}" y="${btnY + btnH / 2 + 16}" fill="${textColor}" font-family="${FONT}"
        font-size="38" font-weight="900" text-anchor="middle" letter-spacing="0.5">
        ${text}
      </text>
    </g>
    <text x="${cx}" y="${H - 50}" fill="${C.inkSoft}" font-family="${FONT}"
      font-size="24" font-weight="600" text-anchor="middle">
      ${microcopy}
    </text>
  `;
}

function build(W, H, ad) {
  const cx = W / 2;
  const brandY = 60;

  // headline 3 linhas
  const h1Y = brandY + 72 + 32 + 80;
  const hPainY = h1Y + 130;
  const h3Y = hPainY + 90;

  // imagem
  const imgTopY = h3Y + 60;
  const ctaY = H - 220;
  const imgBottomY = ctaY - 40;
  const imgMaxH = imgBottomY - imgTopY;
  const imgMaxW = W - 120;
  const aspectFitH = imgMaxW / ad.aspect;
  const useH = Math.min(imgMaxH, aspectFitH);
  const useW = useH * ad.aspect;
  const imgX = (W - useW) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${defs()}
    <rect width="${W}" height="${H}" fill="url(#bg)" />
    <circle cx="${W * 0.95}" cy="0" r="${W * 0.35}" fill="${C.emerald}" opacity="0.10" />
    <circle cx="0" cy="${H * 0.95}" r="${W * 0.40}" fill="${C.amber}" opacity="0.08" />

    ${brand(W, brandY)}

    <text x="${cx}" y="${h1Y}" fill="${C.white}" font-family="${FONT}"
      font-size="68" font-weight="800" text-anchor="middle" letter-spacing="-1.5">
      ${ad.line1}
    </text>
    <text x="${cx}" y="${hPainY}" fill="${C.amber}" font-family="${FONT}"
      font-size="106" font-weight="900" text-anchor="middle" letter-spacing="-2.5">
      ${ad.pain}
    </text>
    <text x="${cx}" y="${h3Y}" fill="${C.white}" font-family="${FONT}"
      font-size="56" font-weight="700" text-anchor="middle" letter-spacing="-1">
      ${ad.line3}
    </text>

    <defs>
      <clipPath id="imgClip-${ad.id}">
        <rect x="${imgX}" y="${imgTopY}" width="${useW}" height="${useH}" rx="32" />
      </clipPath>
    </defs>
    <g filter="url(#shadow)">
      <image href="${ad.dataUri}" x="${imgX}" y="${imgTopY}" width="${useW}" height="${useH}"
        preserveAspectRatio="xMidYMid slice" clip-path="url(#imgClip-${ad.id})" />
      <rect x="${imgX}" y="${imgTopY}" width="${useW}" height="${useH}" rx="32"
        fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2" />
    </g>

    ${cta(W, H, ad.cta)}
  </svg>`;
}

// ============================================================
// Configurações dos ads
// ============================================================
const ADS = [
  {
    id: "antes-depois",
    source: "ChatGPT Image May 26, 2026, 09_28_26 PM.png",
    aspect: 941 / 1672,
    line1: "Sua rotina jurídica",
    pain: "NÃO PRECISA",
    line3: "ser um inferno.",
    cta: {
      text: "MUDAR MINHA ROTINA AGORA →",
      microcopy: "Estudante R$ 19,90 · Premium R$ 59,90 ilimitado",
      color: C.amber,
      textColor: C.ink,
    },
  },
  {
    id: "cronometro",
    source: "ChatGPT Image May 26, 2026, 09_31_45 PM.png",
    aspect: 941 / 1672,
    line1: "Você ainda perde",
    pain: "6 HORAS",
    line3: "escrevendo uma peça?",
    cta: {
      text: "QUERO IA QUE ENTREGA EM 30s →",
      microcopy: "A partir de R$ 19,90/mês · Cancele quando quiser",
      color: C.amber,
      textColor: C.ink,
    },
  },
];

const FORMATS = [
  { suffix: "story", W: 1080, H: 1920 },
  { suffix: "feed",  W: 1080, H: 1350 },
];

console.log("Gerando criativos com imagem composta...\n");
for (const ad of ADS) {
  ad.dataUri = toDataUri(resolve(OUT, ad.source));
  for (const f of FORMATS) {
    const svg = build(f.W, f.H, ad);
    const png = new Resvg(svg, { fitTo: { mode: "width", value: f.W } }).render().asPng();
    const out = `06-${ad.id}-${f.suffix}.png`;
    writeFileSync(resolve(OUT, out), png);
    console.log(`  ✓ ${out}  (${Math.round(png.length / 1024)}KB)`);
  }
}
console.log("\nDone.");
