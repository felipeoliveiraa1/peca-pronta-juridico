/**
 * Envio de e-mails transacionais.
 *
 * Suporta dois caminhos:
 *  1. Resend (recomendado) — exige `RESEND_API_KEY` e `EMAIL_FROM` configurados.
 *  2. Fallback: nenhum provedor configurado → apenas loga em console e devolve
 *     `{ sent: false }`. Isso permite o webhook funcionar sem provedor de e-mail,
 *     enquanto você decide qual integrar.
 *
 * O webhook usa esta função para enviar as credenciais geradas após o
 * checkout. Se `sent === false`, é responsabilidade da operação enviar
 * manualmente (a senha aparece no log do servidor).
 */

const FROM_DEFAULT = "Peça Pronta <onboarding@resend.dev>";

interface SendResult {
  sent: boolean;
  provider?: "resend";
  reason?: string;
}

/**
 * Normaliza o EMAIL_FROM. Aceita 3 formatos:
 *   1. "Name <email@x.com>"   → usa direto
 *   2. "email@x.com"          → wraps com nome padrão
 *   3. "Name" (sem email)     → cai pro DEFAULT (fallback seguro)
 * Também remove aspas, quebras de linha e espaços extras que às vezes vêm
 * coladas do painel da Vercel.
 */
function normalizeFromAddress(raw: string | undefined): string {
  const value = (raw ?? "").replace(/^["']|["']$/g, "").trim().replace(/\s+/g, " ");
  if (!value) return FROM_DEFAULT;

  // Já é "Name <email@x>"
  if (/<[^@\s>]+@[^@\s>]+>/.test(value)) return value;

  // Só email puro
  if (/^[^\s<>]+@[^\s<>]+\.[^\s<>]+$/.test(value)) {
    return `Peça Pronta <${value}>`;
  }

  // Algo malformado — log e fallback
  console.warn("[email] EMAIL_FROM em formato inválido:", JSON.stringify(value));
  return FROM_DEFAULT;
}

export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<SendResult> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("[email] RESEND_API_KEY ausente — pulando envio para", args.to);
    return { sent: false, reason: "no-provider" };
  }

  const from = normalizeFromAddress(process.env.EMAIL_FROM);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[email] Resend retornou erro", res.status, errorText);
      return { sent: false, provider: "resend", reason: errorText };
    }
    return { sent: true, provider: "resend" };
  } catch (err) {
    console.error("[email] falha na chamada Resend", err);
    return { sent: false, provider: "resend", reason: (err as Error).message };
  }
}

export function renderCredentialsEmail(args: {
  name?: string | null;
  email: string;
  password: string;
  appUrl: string;
}) {
  const greeting = args.name ? `Olá, ${args.name.split(" ")[0]}!` : "Olá!";
  const loginUrl = `${args.appUrl}/login`;

  const text = `${greeting}

Bem-vindo(a) ao Peça Pronta — seu assistente jurídico com IA.

Sua conta foi criada e seu acesso já está liberado.

🔐 Seus dados de acesso:
E-mail: ${args.email}
Senha provisória: ${args.password}

➡️ Entre agora: ${loginUrl}

Recomendamos alterar a senha após o primeiro acesso (em Configurações).

Qualquer dúvida, é só responder este e-mail.
Bom uso!
— Equipe Peça Pronta`;

  const html = `<!doctype html>
<html lang="pt-BR">
<body style="font-family: -apple-system, Segoe UI, sans-serif; background:#f1f5f9; padding:24px; color:#0f172a;">
  <div style="max-width:560px; margin:0 auto; background:#fff; border-radius:16px; padding:32px; box-shadow:0 8px 32px rgba(15,23,42,0.08);">
    <div style="display:inline-block; padding:6px 12px; border-radius:999px; background:#dcfce7; color:#15803d; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">
      ✅ Conta criada com sucesso
    </div>
    <h1 style="margin:16px 0 4px; font-size:24px;">${greeting}</h1>
    <p style="color:#334155; line-height:1.6;">
      Bem-vindo(a) ao <strong>Peça Pronta</strong> — seu assistente jurídico com IA para redação
      de peças processuais brasileiras em minutos.
    </p>

    <div style="margin:24px 0; padding:20px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
      <div style="font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">🔐 Seus dados de acesso</div>
      <div style="margin-top:12px; font-size:14px;">
        <div><strong>E-mail:</strong> ${args.email}</div>
        <div style="margin-top:6px;"><strong>Senha provisória:</strong> <code style="background:#fff; border:1px solid #e2e8f0; padding:2px 8px; border-radius:6px;">${args.password}</code></div>
      </div>
    </div>

    <a href="${loginUrl}" style="display:inline-block; background:#10b981; color:#fff; font-weight:700; padding:14px 28px; border-radius:12px; text-decoration:none; text-transform:uppercase; font-size:14px; letter-spacing:0.5px;">
      Entrar no Peça Pronta →
    </a>

    <p style="margin-top:24px; font-size:13px; color:#475569; line-height:1.6;">
      💡 <strong>Dica:</strong> após o primeiro login, vá em <em>Configurações</em> e troque a
      senha. Em caso de dúvidas, é só responder este e-mail.
    </p>

    <hr style="margin:32px 0; border:none; border-top:1px solid #e2e8f0;" />
    <p style="font-size:12px; color:#94a3b8; text-align:center;">
      Você recebeu este e-mail porque adquiriu o Peça Pronta. © 2026 Peça Pronta.
    </p>
  </div>
</body>
</html>`;

  return { text, html };
}

export function generatePassword(length = 14): string {
  const charset = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  // crypto.getRandomValues está disponível no runtime Node 19+ e edge.
  const buf = new Uint32Array(length);
  crypto.getRandomValues(buf);
  let out = "";
  for (let i = 0; i < length; i++) out += charset[buf[i] % charset.length];
  // garante variedade mínima (1 dígito)
  return out.replace(/^(.{0,3})/, (m) => m + Math.floor(Math.random() * 10));
}
