export const metadata = { title: "Termos de Uso — Peça Pronta" };

export default function TermosPage() {
  return (
    <main className="container-page max-w-3xl py-16">
      <h1 className="text-3xl font-bold">Termos de Uso</h1>
      <p className="mt-3 text-sm text-ink-500">Última atualização: 26/05/2026</p>
      <div className="prose mt-8 space-y-4 text-sm leading-relaxed text-ink-700">
        <p>
          O Peça Pronta é uma ferramenta de produtividade jurídica baseada em inteligência
          artificial. Os rascunhos gerados são apenas pontos de partida e não substituem a análise
          de um profissional do Direito.
        </p>
        <p>
          O usuário é responsável pela revisão final de qualquer documento produzido na plataforma
          antes de seu uso em processos judiciais ou administrativos.
        </p>
        <p>
          A assinatura é mensal e pode ser cancelada a qualquer momento pela área do cliente da
          Kiwify, sem multas.
        </p>
      </div>
    </main>
  );
}
