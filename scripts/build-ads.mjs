/**
 * Gerador de criativos estáticos v3.
 * 5 conceitos × 2 formatos (Feed 1080×1350 + Story 1080×1920) = 10 PNGs.
 *
 * Rodar com: node scripts/build-ads.mjs
 */
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "public/ads");
mkdirSync(OUT, { recursive: true });

const C = {
  bgFrom: "#1e4fc7",
  bgTo: "#0b1838",
  emerald: "#10b981",
  emeraldLight: "#34d399",
  amber: "#fbbf24",
  amberDark: "#f59e0b",
  white: "#ffffff",
  ink: "#0f172a",
  inkSoft: "#94a3b8",
  red: "#ef4444",
  redDark: "#b91c1c",
};

const FONT = "Helvetica, Arial, sans-serif";

// ============================================================
// Helpers compartilhados
// ============================================================
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
        <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#000" flood-opacity="0.35" />
      </filter>
    </defs>
  `;
}

function bgDecor(W, H) {
  return `
    <rect width="${W}" height="${H}" fill="url(#bg)" />
    <circle cx="${W * 0.95}" cy="0" r="${W * 0.35}" fill="${C.emerald}" opacity="0.12" />
    <circle cx="0" cy="${H * 0.95}" r="${W * 0.40}" fill="${C.amber}" opacity="0.10" />
  `;
}

function brand(W, y = 60) {
  const cx = W / 2;
  const size = 72;
  return `
    <g transform="translate(${cx - size / 2} ${y})">
      <rect width="${size}" height="${size}" rx="16" fill="rgba(255,255,255,0.20)" />
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

function cta(W, H, { text, color = C.amber, textColor = C.ink, microcopy }) {
  const cx = W / 2;
  const btnW = W - 120;
  const btnH = 130;
  const btnX = (W - btnW) / 2;
  const btnY = H - 220;

  return `
    <g filter="url(#shadow)">
      <rect x="${btnX}" y="${btnY}" width="${btnW}" height="${btnH}" rx="28" fill="${color}" />
      <text x="${cx}" y="${btnY + btnH / 2 + 16}" fill="${textColor}" font-family="${FONT}"
        font-size="44" font-weight="900" text-anchor="middle" letter-spacing="0.5">
        ${text}
      </text>
    </g>
    ${microcopy ? `
      <text x="${cx}" y="${H - 50}" fill="${C.inkSoft}" font-family="${FONT}"
        font-size="26" font-weight="600" text-anchor="middle">
        ${microcopy}
      </text>
    ` : ""}
  `;
}

// Headline padrão: setup + DOR (amarelo) + question
// Retorna SVG das 3 linhas posicionadas a partir do topY
function headline(W, topY, line1, painLine, line3, opts = {}) {
  const cx = W / 2;
  const size1 = opts.size1 ?? 68;
  const sizePain = opts.sizePain ?? 106;
  const size3 = opts.size3 ?? 56;
  const gap1 = opts.gap1 ?? 60; // entre linha1 e linha pain (já considera altura da linha pain)
  const gap2 = opts.gap2 ?? 30;

  const y1 = topY + size1;
  const yPain = y1 + gap1 + sizePain;
  const y3 = yPain + gap2 + size3;

  return `
    <text x="${cx}" y="${y1}" fill="${C.white}" font-family="${FONT}"
      font-size="${size1}" font-weight="800" text-anchor="middle" letter-spacing="-1.5">
      ${line1}
    </text>
    <text x="${cx}" y="${yPain}" fill="${C.amber}" font-family="${FONT}"
      font-size="${sizePain}" font-weight="900" text-anchor="middle" letter-spacing="-2.5">
      ${painLine}
    </text>
    ${line3 ? `<text x="${cx}" y="${y3}" fill="${C.white}" font-family="${FONT}"
      font-size="${size3}" font-weight="700" text-anchor="middle" letter-spacing="-1">
      ${line3}
    </text>` : ""}
  `;
}

// ============================================================
// AD 1 — "Você ainda perde A NOITE INTEIRA"
// ============================================================
function ad1(W, H) {
  const focalY = H === 1350 ? 600 : 800; // adapta pra story
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${defs()}
    ${bgDecor(W, H)}
    ${brand(W, H === 1350 ? 60 : 100)}

    ${headline(W, H === 1350 ? 250 : 380,
      "Você ainda perde",
      "A NOITE INTEIRA",
      "escrevendo uma peça?")}

    <!-- Cards 6h vs 30s -->
    <g transform="translate(60 ${focalY})">
      <g>
        <rect width="430" height="430" rx="32" fill="rgba(239,68,68,0.95)" filter="url(#shadow)" />
        <text x="215" y="80" fill="${C.white}" font-family="${FONT}" font-size="28" font-weight="800" text-anchor="middle" letter-spacing="2">ANTES</text>
        <text x="215" y="240" fill="${C.white}" font-family="${FONT}" font-size="200" font-weight="900" text-anchor="middle" letter-spacing="-6">6h</text>
        <text x="215" y="300" fill="${C.white}" font-family="${FONT}" font-size="34" font-weight="700" text-anchor="middle">numa petição</text>
        <text x="215" y="360" fill="rgba(255,255,255,0.88)" font-family="${FONT}" font-size="22" font-weight="500" text-anchor="middle">travado no Word,</text>
        <text x="215" y="395" fill="rgba(255,255,255,0.88)" font-family="${FONT}" font-size="22" font-weight="500" text-anchor="middle">modelos do Google</text>
      </g>
      <text x="500" y="240" fill="${C.amber}" font-family="${FONT}" font-size="80" font-weight="900" text-anchor="middle">→</text>
      <g transform="translate(530 0)">
        <rect width="430" height="430" rx="32" fill="${C.emerald}" filter="url(#shadow)" />
        <text x="215" y="80" fill="${C.white}" font-family="${FONT}" font-size="28" font-weight="800" text-anchor="middle" letter-spacing="2">DEPOIS</text>
        <text x="215" y="240" fill="${C.white}" font-family="${FONT}" font-size="200" font-weight="900" text-anchor="middle" letter-spacing="-6">30s</text>
        <text x="215" y="300" fill="${C.white}" font-family="${FONT}" font-size="34" font-weight="700" text-anchor="middle">com Peça Pronta</text>
        <text x="215" y="360" fill="rgba(255,255,255,0.92)" font-family="${FONT}" font-size="22" font-weight="500" text-anchor="middle">IA treinada em</text>
        <text x="215" y="395" fill="rgba(255,255,255,0.92)" font-family="${FONT}" font-size="22" font-weight="500" text-anchor="middle">Direito Brasileiro</text>
      </g>
    </g>

    ${cta(W, H, {
      text: "QUERO ECONOMIZAR TEMPO →",
      color: C.amber, textColor: C.ink,
      microcopy: "A partir de R$ 19,90/mês · Cancele quando quiser",
    })}
  </svg>`;
}

// ============================================================
// AD 2 — "Seu CHEFE vai descobrir que você não sabe"
// ============================================================
function ad2(W, H) {
  const cx = W / 2;
  const focalY = H === 1350 ? 620 : 820;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${defs()}
    ${bgDecor(W, H)}
    ${brand(W, H === 1350 ? 60 : 100)}

    ${headline(W, H === 1350 ? 250 : 380,
      "Estagiário:",
      "SEU CHEFE VAI",
      "descobrir que você não sabe?",
      { sizePain: 96 })}

    <!-- Card POV: cenário 18h -->
    <g transform="translate(60 ${focalY})">
      <rect width="960" height="430" rx="32" fill="${C.white}" filter="url(#shadow)" />

      <!-- Badge POV -->
      <g transform="translate(40 36)">
        <rect width="240" height="56" rx="28" fill="${C.amber}" />
        <text x="120" y="38" fill="${C.ink}" font-family="${FONT}" font-size="22" font-weight="900" text-anchor="middle" letter-spacing="3">POV: 18h05</text>
      </g>

      <!-- Cenário -->
      <text x="40" y="160" fill="${C.ink}" font-family="${FONT}" font-size="36" font-weight="700">Chefe te passa uma</text>
      <text x="40" y="210" fill="${C.ink}" font-family="${FONT}" font-size="44" font-weight="900">CONTESTAÇÃO pras 19h</text>

      <!-- Linha divisória -->
      <line x1="40" y1="245" x2="920" y2="245" stroke="${C.inkSoft}" stroke-width="2" stroke-dasharray="6 6" />

      <!-- Entrega -->
      <text x="40" y="300" fill="${C.inkSoft}" font-family="${FONT}" font-size="24" font-weight="600">Você entrega:</text>
      <text x="40" y="380" fill="${C.emerald}" font-family="${FONT}" font-size="100" font-weight="900" letter-spacing="-3">19h07</text>
      <text x="500" y="380" fill="${C.emerald}" font-family="${FONT}" font-size="80" font-weight="900">⚡</text>
    </g>

    ${cta(W, H, {
      text: "ENTREGAR COMO SÊNIOR →",
      color: C.emerald, textColor: C.white,
      microcopy: "IA jurídica · pecaprontaapp.com",
    })}
  </svg>`;
}

// ============================================================
// AD 3 — "Você só sabe Petição Inicial"
// ============================================================
function ad3(W, H) {
  const focalY = H === 1350 ? 620 : 820;
  const tipos = [
    "Petição Inicial", "Contestação", "Réplica", "Apelação",
    "Agravo de Instrumento", "Habeas Corpus", "Mandado de Segurança",
    "Tutela de Urgência", "Ação de Alimentos", "Divórcio Consensual",
    "Reclamação Trabalhista", "Cumprimento de Sentença",
  ];
  const cx = W / 2;
  const cols = 2;
  const chipW = 460;
  const chipH = 60;
  const gapX = 20, gapY = 16;
  const totalW = cols * chipW + (cols - 1) * gapX;
  const startX = (W - totalW) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${defs()}
    ${bgDecor(W, H)}
    ${brand(W, H === 1350 ? 60 : 100)}

    ${headline(W, H === 1350 ? 250 : 380,
      "Você só sabe fazer",
      "PETIÇÃO INICIAL?",
      "Tem 29 outras esperando.",
      { sizePain: 100 })}

    <!-- Grid de chips -->
    <g transform="translate(0 ${focalY})">
      ${tipos.map((t, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (chipW + gapX);
        const y = row * (chipH + gapY);
        return `
          <g transform="translate(${x} ${y})">
            <rect width="${chipW}" height="${chipH}" rx="16" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.22)" stroke-width="1.5" />
            <circle cx="26" cy="${chipH/2}" r="9" fill="${C.emerald}" />
            <path d="M21 ${chipH/2} L25 ${chipH/2 + 4} L31 ${chipH/2 - 4}" stroke="${C.white}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
            <text x="56" y="${chipH/2 + 9}" fill="${C.white}" font-family="${FONT}" font-size="26" font-weight="700">${t}</text>
          </g>
        `;
      }).join("")}
    </g>

    ${cta(W, H, {
      text: "DESBLOQUEAR AS 30 PEÇAS →",
      color: C.amber, textColor: C.ink,
      microcopy: "Plano Estudante R$ 19,90 · Premium R$ 59,90 (ilimitado)",
    })}
  </svg>`;
}

// ============================================================
// AD 4 — "IA jurídica cara? R$ 19,90 hoje"
// ============================================================
function ad4(W, H) {
  const cx = W / 2;
  const focalY = H === 1350 ? 600 : 800;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${defs()}
    ${bgDecor(W, H)}
    ${brand(W, H === 1350 ? 60 : 100)}

    ${headline(W, H === 1350 ? 250 : 380,
      "Acha que IA jurídica é",
      "CARA DEMAIS?",
      "Olha esse preço de estudante:",
      { sizePain: 116 })}

    <!-- Card de preço gigante -->
    <g transform="translate(60 ${focalY})" filter="url(#shadow)">
      <rect width="960" height="480" rx="40" fill="${C.white}" />

      <!-- Badge OFERTA -->
      <g transform="translate(360 36)">
        <rect width="240" height="48" rx="24" fill="${C.amber}" />
        <text x="120" y="32" fill="${C.ink}" font-family="${FONT}" font-size="20" font-weight="900" text-anchor="middle" letter-spacing="3">PLANO ESTUDANTE</text>
      </g>

      <!-- Preço riscado -->
      <text x="480" y="140" fill="${C.inkSoft}" font-family="${FONT}" font-size="34" font-weight="600" text-anchor="middle" text-decoration="line-through">
        de R$ 39,90/mês
      </text>

      <!-- Preço principal (afastado do riscado) -->
      <text x="180" y="330" fill="${C.emerald}" font-family="${FONT}" font-size="80" font-weight="700">R$</text>
      <text x="290" y="360" fill="${C.emerald}" font-family="${FONT}" font-size="200" font-weight="900" letter-spacing="-8">19,90</text>
      <text x="820" y="360" fill="${C.ink}" font-family="${FONT}" font-size="34" font-weight="600" text-anchor="end">/mês</text>

      <!-- Bullets -->
      <g transform="translate(180 410)" fill="${C.ink}" font-family="${FONT}" font-size="22" font-weight="600">
        <g>
          <circle cx="14" cy="14" r="14" fill="${C.emerald}"/>
          <path d="M8 14 L12 18 L20 9" stroke="${C.white}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="40" y="22">3 peças com IA por mês</text>
        </g>
        <g transform="translate(330 0)">
          <circle cx="14" cy="14" r="14" fill="${C.emerald}"/>
          <path d="M8 14 L12 18 L20 9" stroke="${C.white}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="40" y="22">Biblioteca + Revisor</text>
        </g>
      </g>
    </g>

    ${cta(W, H, {
      text: "GARANTIR R$ 19,90/MÊS →",
      color: C.emerald, textColor: C.white,
      microcopy: "Cartao | PIX | Boleto - Cancele quando quiser",
    })}
  </svg>`;
}

// ============================================================
// AD 5 — Antes vs Depois
// ============================================================
function ad5(W, H) {
  const cx = W / 2;
  const focalY = H === 1350 ? 600 : 800;
  const cardW = W - 120;
  const cardH = 200;
  const gap = 30;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${defs()}
    ${bgDecor(W, H)}
    ${brand(W, H === 1350 ? 60 : 100)}

    ${headline(W, H === 1350 ? 250 : 380,
      "Sua rotina jurídica",
      "NÃO PRECISA",
      "ser um inferno.",
      { sizePain: 100 })}

    <!-- Card vermelho -->
    <g transform="translate(60 ${focalY})">
      <rect width="${cardW}" height="${cardH}" rx="24" fill="#fee2e2" filter="url(#shadow)" />
      <g transform="translate(40 40)">
        <circle cx="22" cy="22" r="22" fill="${C.redDark}"/>
        <path d="M14 14 L30 30 M30 14 L14 30" stroke="${C.white}" stroke-width="4.5" stroke-linecap="round"/>
      </g>
      <text x="100" y="74" fill="${C.redDark}" font-family="${FONT}" font-size="34" font-weight="900">SEM Peça Pronta</text>
      <g fill="#7f1d1d" font-family="${FONT}" font-size="24" font-weight="600">
        <text x="40" y="130">• 6 a 8 horas em UMA petição</text>
        <text x="40" y="165">• Modelo aleatório do Google que nem serve</text>
      </g>
    </g>

    <!-- Card verde -->
    <g transform="translate(60 ${focalY + cardH + gap})">
      <rect width="${cardW}" height="${cardH}" rx="24" fill="${C.emerald}" filter="url(#shadow)" />
      <g transform="translate(40 40)">
        <circle cx="22" cy="22" r="22" fill="${C.white}"/>
        <path d="M14 22 L20 28 L30 16" stroke="${C.emerald}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <text x="100" y="74" fill="${C.white}" font-family="${FONT}" font-size="34" font-weight="900">COM Peça Pronta</text>
      <g fill="${C.white}" font-family="${FONT}" font-size="24" font-weight="600">
        <text x="40" y="130">• Rascunho técnico em 30 segundos</text>
        <text x="40" y="165">• Foco em estratégia, não em formatação</text>
      </g>
    </g>

    ${cta(W, H, {
      text: "MUDAR MINHA ROTINA →",
      color: C.amber, textColor: C.ink,
      microcopy: "Estudante R$ 19,90/mês · Premium R$ 59,90/mês",
    })}
  </svg>`;
}

// ============================================================
// Pipeline
// ============================================================
const ADS = [
  { name: "01-noite-inteira",    fn: ad1 },
  { name: "02-chefe-descobre",   fn: ad2 },
  { name: "03-30-tipos",         fn: ad3 },
  { name: "04-preco-19-90",      fn: ad4 },
  { name: "05-antes-depois",     fn: ad5 },
];

const FORMATS = [
  { suffix: "feed",  W: 1080, H: 1350 },
  { suffix: "story", W: 1080, H: 1920 },
];

console.log("Gerando criativos...\n");
for (const ad of ADS) {
  for (const fmt of FORMATS) {
    const svg = ad.fn(fmt.W, fmt.H);
    const png = new Resvg(svg, { fitTo: { mode: "width", value: fmt.W } }).render().asPng();
    const file = `${ad.name}-${fmt.suffix}.png`;
    writeFileSync(resolve(OUT, file), png);
    console.log(`  ✓ ${file}  (${Math.round(png.length / 1024)}KB)`);
  }
}

console.log(`\nPronto. ${ADS.length * FORMATS.length} arquivos em public/ads/`);
