import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-ink-300/70 bg-ink-900 text-ink-100">
      <div className="container-page py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 font-semibold text-white">
              <Image src="/logo.svg" alt="Peça Pronta" width={36} height={36} />
              Peça Pronta
            </Link>
            <p className="mt-3 text-sm text-ink-300">
              Assistente jurídico com IA para redação de peças processuais brasileiras em minutos.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <div className="font-semibold text-white">Produto</div>
              <ul className="mt-3 space-y-2 text-ink-300">
                <li><a href="#como-funciona" className="hover:text-white">Como funciona</a></li>
                <li><a href="#beneficios" className="hover:text-white">Benefícios</a></li>
                <li><a href="#planos" className="hover:text-white">Planos</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white">Conta</div>
              <ul className="mt-3 space-y-2 text-ink-300">
                <li><Link href="/login" className="hover:text-white">Entrar</Link></li>
                <li><Link href="/signup" className="hover:text-white">Cadastrar</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white">Legal</div>
              <ul className="mt-3 space-y-2 text-ink-300">
                <li><Link href="/legal/termos" className="hover:text-white">Termos de Uso</Link></li>
                <li><Link href="/legal/privacidade" className="hover:text-white">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-ink-700 pt-6 text-xs leading-relaxed text-ink-300">
          <p>
            © 2026 Peça Pronta. Todos os direitos reservados.
          </p>
          <p className="mt-2">
            Este site não é afiliado a nenhuma instituição de ensino ou órgão jurídico. As
            informações aqui contidas são para fins educacionais e de produtividade, não
            substituindo a consulta a um profissional do Direito.
          </p>
        </div>
      </div>
    </footer>
  );
}
