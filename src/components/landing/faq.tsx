"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    q: "Como recebo o acesso depois de pagar?",
    a: "Logo após a confirmação do pagamento na Kiwify, criamos automaticamente a sua conta no Peça Pronta com o e-mail informado no checkout. Em seguida você recebe um e-mail com sua senha de acesso e o link de login. Tudo isso acontece em segundos.",
  },
  {
    q: "O que vem incluso no Plano Premium?",
    a: "Geração ilimitada de peças com IA, biblioteca completa de modelos premium, atualização jurisprudencial, revisor jurídico inteligente e organizador de documentos com histórico de versões. É o plano ideal para estagiários e jovens advogados que querem máxima produtividade.",
  },
  {
    q: "Como funciona a Inteligência Artificial do Peça Pronta?",
    a: "Nossa IA é instruída com diretrizes técnicas do Direito Brasileiro (CF, CPC, CDC, CLT, Códigos Civil e Penal e legislação extravagante). Você preenche um formulário guiado com os dados do caso (partes, fatos, pedido) e ela devolve um rascunho completo no padrão técnico-jurídico, em segundos.",
  },
  {
    q: "Para quem é indicado o Peça Pronta?",
    a: "Para estudantes de Direito, estagiários, recém-formados e jovens advogados que querem economizar tempo, ganhar segurança na redação de peças e acelerar a curva de aprendizado.",
  },
  {
    q: "Preciso de conhecimento prévio em IA para usar?",
    a: "Não! O Peça Pronta foi feito para ser intuitivo. A interface é guiada por formulários — você preenche os dados do caso em campos específicos e a IA cuida do resto.",
  },
  {
    q: "O material é digital ou físico?",
    a: "100% digital (SaaS). Você acessa por qualquer dispositivo com internet, sem instalações. Suas peças são salvas na nuvem e exportáveis em PDF, DOCX e ODT.",
  },
  {
    q: "Como cancelo a assinatura se precisar?",
    a: "Pela área do cliente da Kiwify, em poucos cliques. Não há multa, fidelidade ou taxa extra. Você só paga enquanto estiver usando — e mantém o acesso até o fim do período já pago.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="section bg-white">
      <div className="container-page max-w-3xl">
        <header className="text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            ❓ Tira-dúvidas
          </span>
          <h2 className="mt-4 text-3xl font-bold uppercase tracking-tight text-ink-900 sm:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-base text-ink-700">
            Antes de assinar o Peça Pronta, veja as dúvidas mais comuns.
          </p>
        </header>

        <div className="mt-10 rounded-2xl border border-ink-300/70 bg-white p-2 shadow-card sm:p-6">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`q-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
