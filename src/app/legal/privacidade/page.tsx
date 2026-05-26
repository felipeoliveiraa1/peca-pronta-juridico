export const metadata = { title: "Política de Privacidade — Peça Pronta" };

export default function PrivacidadePage() {
  return (
    <main className="container-page max-w-3xl py-16">
      <h1 className="text-3xl font-bold">Política de Privacidade</h1>
      <p className="mt-3 text-sm text-ink-500">Última atualização: 26/05/2026</p>
      <div className="prose mt-8 space-y-4 text-sm leading-relaxed text-ink-700">
        <p>
          Coletamos apenas os dados necessários para operar a sua conta (nome, e-mail, plano
          ativo) e para gerar as peças solicitadas (conteúdo dos formulários).
        </p>
        <p>
          Os dados de pagamento são processados pela Kiwify; não armazenamos números de cartão em
          nossos servidores.
        </p>
        <p>
          As peças que você cria são privadas. Apenas você tem acesso aos seus documentos —
          aplicamos Row-Level Security no banco para garantir isso.
        </p>
        <p>
          Você pode solicitar a exclusão da sua conta enviando e-mail para
          suporte@pecapronta.app.
        </p>
      </div>
    </main>
  );
}
