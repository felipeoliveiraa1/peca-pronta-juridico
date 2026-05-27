import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Mail,
  Lock,
  AlertTriangle,
  ArrowRight,
  Clock,
  MessageCircle,
  Inbox,
} from "lucide-react";

export const metadata = {
  title: "Compra confirmada — Peça Pronta",
  description: "Sua compra foi confirmada. Você recebeu suas credenciais por e-mail.",
};

interface PageProps {
  searchParams: Promise<{ order_id?: string; email?: string }>;
}

export default async function ObrigadoPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const orderId = sp.order_id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white">
      {/* Header simples */}
      <header className="border-b border-ink-300/60 bg-white/80 backdrop-blur">
        <div className="container-page flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/logo.svg" alt="Peça Pronta" width={36} height={36} priority />
            <span className="text-lg">Peça Pronta</span>
          </Link>
        </div>
      </header>

      <main className="container-page max-w-3xl py-12 sm:py-16">
        {/* Hero de sucesso */}
        <section className="text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" strokeWidth={2.5} />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            🎉 Compra confirmada!
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-700">
            Sua conta no Peça Pronta foi criada e seu acesso já está liberado.
            <strong className="block mt-1">Enviamos suas credenciais por e-mail.</strong>
          </p>

          {orderId && (
            <p className="mt-3 text-xs text-ink-500">
              ID do pedido: <code className="rounded bg-ink-100 px-2 py-0.5 font-mono">{orderId}</code>
            </p>
          )}
        </section>

        {/* Timeline visual */}
        <section className="mt-12 rounded-2xl border border-ink-300/70 bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-base font-bold uppercase tracking-wider text-ink-500">
            📋 Próximos passos
          </h2>

          <ol className="mt-6 space-y-6">
            <li className="flex gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h3 className="text-base font-bold text-ink-900">
                  Pagamento confirmado
                </h3>
                <p className="mt-0.5 text-sm text-ink-500">Sua compra foi processada com sucesso.</p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Mail className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h3 className="text-base font-bold text-ink-900">
                  E-mail com acesso enviado
                </h3>
                <p className="mt-0.5 text-sm text-ink-700">
                  Acabamos de enviar um e-mail com seu <strong>login</strong> e <strong>senha provisória</strong>.
                </p>
                <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-ink-100 px-3 py-1 text-xs text-ink-700">
                  <strong>Remetente:</strong>&nbsp;Peça Pronta &lt;noreply@helpcloser.app&gt;
                </p>
                <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-ink-100 px-3 py-1 text-xs text-ink-700">
                  <strong>Assunto:</strong>&nbsp;🎉 Seu acesso ao Peça Pronta está liberado
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Lock className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h3 className="text-base font-bold text-ink-900">Entre na sua conta</h3>
                <p className="mt-0.5 text-sm text-ink-700">
                  Use o e-mail e a senha que enviamos pra fazer login no app.
                </p>
                <Link
                  href="/login"
                  className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 text-sm font-bold text-white hover:bg-brand-800"
                >
                  Entrar agora <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </li>
          </ol>
        </section>

        {/* Alerta sobre spam */}
        <section className="mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-6">
          <div className="flex gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-800">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900">
                ⚠️ Não chegou? Verifique o SPAM/Lixo eletrônico
              </h3>
              <p className="mt-1 text-sm text-amber-900">
                Provedores como <strong>Hotmail/Outlook</strong> e <strong>Gmail</strong> às vezes filtram
                e-mails de domínios novos. Procure por <strong>"Peça Pronta"</strong> ou <strong>"noreply@helpcloser.app"</strong>
                nestas pastas:
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-amber-900">
                <li className="flex items-start gap-2">
                  <Inbox className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>📂 <strong>Lixo eletrônico / Spam</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Inbox className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>📂 <strong>Promoções</strong> (no Gmail)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Inbox className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>📂 <strong>Outros / Other</strong> (no Outlook)</span>
                </li>
              </ul>
              <div className="mt-4 rounded-lg bg-amber-100 p-3 text-sm text-amber-900">
                <strong>💡 Dica:</strong> Marque <strong>noreply@helpcloser.app</strong> como
                <strong> "não é spam"</strong> ou adicione aos seus contatos pra receber as próximas
                comunicações direto na caixa de entrada.
              </div>
            </div>
          </div>
        </section>

        {/* Tempo estimado */}
        <section className="mt-6 rounded-xl border border-ink-300/70 bg-white p-5">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-ink-500" />
            <p className="text-sm text-ink-700">
              <strong>Quanto tempo demora?</strong> Geralmente o e-mail chega em até <strong>2 minutos</strong>.
              Se passar de 10 minutos sem aparecer, entre em contato.
            </p>
          </div>
        </section>

        {/* Esqueceu a senha */}
        <section className="mt-6 rounded-xl border border-ink-300/70 bg-white p-5">
          <h3 className="text-sm font-bold text-ink-900">🔐 Não encontrou o e-mail ou perdeu a senha?</h3>
          <p className="mt-1 text-sm text-ink-700">
            Use a opção <strong>"Esqueci minha senha"</strong> na tela de login. Vamos te enviar um link
            seguro pra você definir uma nova senha imediatamente.
          </p>
          <Link
            href="/login/forgot"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
          >
            Redefinir senha <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Suporte */}
        <section className="mt-6 rounded-xl border border-ink-300/70 bg-ink-100/40 p-5 text-center">
          <MessageCircle className="mx-auto h-6 w-6 text-ink-500" />
          <h3 className="mt-2 text-sm font-bold text-ink-900">Precisa de ajuda?</h3>
          <p className="mt-1 text-sm text-ink-700">
            Envie um e-mail para{" "}
            <a
              href="mailto:suporte@helpcloser.app"
              className="font-medium text-brand-700 hover:underline"
            >
              suporte@helpcloser.app
            </a>{" "}
            — respondemos em até 24h.
          </p>
        </section>

        {/* CTA final secundário */}
        <section className="mt-10 text-center">
          <Link
            href="/login"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 text-base font-extrabold uppercase tracking-wide text-white shadow-xl shadow-emerald-500/30 hover:bg-emerald-600"
          >
            Entrar no Peça Pronta <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-3 text-xs text-ink-500">
            Pode acessar de qualquer dispositivo · 100% online
          </p>
        </section>
      </main>

      {/* Footer mini */}
      <footer className="border-t border-ink-300/60 bg-white py-6">
        <div className="container-page text-center text-xs text-ink-500">
          © 2026 Peça Pronta · Assistente jurídico com IA
        </div>
      </footer>
    </div>
  );
}
