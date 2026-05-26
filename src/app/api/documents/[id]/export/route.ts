import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/profile";

export const runtime = "nodejs";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteCtx) {
  const profile = await requireProfile();
  const { id } = await params;
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "docx";

  const supabase = await createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("id, title, content")
    .eq("id", id)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!doc) {
    return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
  }

  const filename = slugify(doc.title);

  if (format === "docx") {
    const paragraphs = doc.content.split(/\n+/).map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, font: "Times New Roman", size: 24 })],
          spacing: { after: 200 },
        }),
    );
    const docx = new Document({
      creator: "Peça Pronta",
      title: doc.title,
      sections: [{ children: paragraphs }],
    });
    const buf = await Packer.toBuffer(docx);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}.docx"`,
      },
    });
  }

  if (format === "pdf") {
    // Lightweight: serve as printable HTML; user prints to PDF.
    const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(doc.title)}</title>
<style>
  @page { size: A4; margin: 25mm 25mm 25mm 30mm; }
  body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.6; color: #111; }
  h1 { font-size: 14pt; margin-bottom: 1em; }
  pre { white-space: pre-wrap; font-family: inherit; }
  .toolbar { margin-bottom: 1em; }
  @media print { .toolbar { display: none; } }
</style>
</head>
<body>
  <div class="toolbar"><button onclick="window.print()">Imprimir / Salvar como PDF</button></div>
  <h1>${escapeHtml(doc.title)}</h1>
  <pre>${escapeHtml(doc.content)}</pre>
  <script>setTimeout(() => window.print(), 350)</script>
</body>
</html>`;
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // default: txt
  return new NextResponse(doc.content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.txt"`,
    },
  });
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64) || "peca";
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
