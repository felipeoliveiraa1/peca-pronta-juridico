# Peça Pronta — Relatório de Testes do MVP

Este documento mapeia as **dores listadas no Relatório Estratégico** e no **Guia de Produto** para as **funcionalidades implementadas neste MVP** e descreve como cada uma foi validada.

## Mapeamento dor → funcionalidade → evidência

| Dor (planejamento) | Funcionalidade implementada | Evidência no código | Como validar |
| --- | --- | --- | --- |
| **Lentidão na redação** de peças do zero | Gerador de peças com IA usando OpenAI GPT-4.1 mini + input guiado por tipo de peça | `src/app/api/generate/route.ts`, `src/lib/prompts.ts`, `src/app/dashboard/documents/new/new-piece-form.tsx`, `src/lib/piece-types.ts` | Cadastrar, abrir **Gerar nova peça**, preencher o formulário e gerar. O rascunho aparece em "Meus documentos" em < 45s. |
| **Insegurança jurídica** sobre estrutura/fundamentação | System prompt impõe estrutura técnica (I/II/III, fórmula final), fundamentação em CF, CPC, CDC, CLT etc., e proíbe inventar acórdãos | `src/lib/prompts.ts` (`SYSTEM_PROMPT_GENERATION`) | Inspecione o prompt; gere uma petição inicial e confira a presença das seções "I – DOS FATOS", "II – DO DIREITO", "III – DOS PEDIDOS" e da fórmula "Nestes termos, pede deferimento." |
| **Desatualização** legislativa/jurisprudencial | Modelos atualizáveis na biblioteca (`templates`) com filtro por área e tipo de ação; system prompt instrui a IA a citar dispositivos vigentes e a marcar [ATENÇÃO] no revisor para citações duvidosas | `src/app/dashboard/templates/page.tsx`, `supabase/migrations/0001_initial_schema.sql` (seed), `src/lib/prompts.ts` (`SYSTEM_PROMPT_REVIEWER`) | Acessar `/dashboard/templates`, abrir um modelo, clonar para um documento. Acessar o Revisor e pedir análise. |
| **Falta de modelos acessíveis** | Biblioteca semeada com 5 modelos cobrindo Civil, Consumidor, Trabalho, Processual Civil e Penal; modelos premium ficam *gated* por plano | `supabase/migrations/0001_initial_schema.sql`, `src/app/dashboard/templates/page.tsx`, `src/lib/plans.ts` | Usuário `free`/`basic` vê o botão "Fazer upgrade para usar" nos modelos premium. |
| **Padronização e revisão**: dúvidas gramaticais/técnicas | Revisor jurídico com OpenAI GPT-4.1 mini, com 4 dimensões (A/B/C/D) e recomendações finais; revisor para Básico foca só em (A) gramatical + (C) coesão | `src/app/api/review/route.ts`, `src/lib/prompts.ts` (`SYSTEM_PROMPT_REVIEWER`), `src/app/dashboard/reviewer/reviewer-workspace.tsx` | Colar texto no Revisor, clicar "Revisar agora". Relatório aparece estruturado pelas 4 dimensões. |
| **Gestão de documentos** | Listagem com status (rascunho/finalizado), histórico de versões em `document_versions` (insert a cada save), exportação para TXT, DOCX e PDF | `src/app/dashboard/documents/`, `src/app/api/documents/[id]/export/route.ts` | Salvar um documento → registro em `document_versions`. Exportar DOCX baixa o arquivo. |
| **Limites por plano** (3 peças/mês no Estudante) | Contagem mensal de `usage_events` e checagem antes de chamar a IA; UI mostra restante e CTA para upgrade quando estoura | `src/lib/usage.ts`, `src/app/api/generate/route.ts`, `src/app/dashboard/documents/new/new-piece-form.tsx`, `src/components/dashboard/topbar.tsx` | Forçar `plan='basic'` no Supabase, gerar 4 vezes. A 4ª retorna 402 e a UI exibe upgrade. |
| **Pagamento e recorrência** | Integração com Kiwify (link público de checkout + webhook HMAC-SHA1) cobrindo aprovação, renovação, atraso, cancelamento, reembolso e chargeback | `src/lib/kiwify.ts`, `src/app/api/checkout/route.ts`, `src/app/api/webhooks/kiwify/route.ts`, `src/app/dashboard/settings/page.tsx` | Endpoint `/api/checkout` devolve URL Kiwify com `?email=...&sck=user_id`. Webhook valida `signature` e atualiza `profiles.plan`. |
| **Funil checkout-first** (conta auto-criada) | Ao receber `order_approved` sem `profile` correspondente, o webhook cria o usuário no Supabase Auth com senha aleatória e dispara e-mail com credenciais via Resend | `src/app/api/webhooks/kiwify/route.ts` (função `createAccountFromCheckout`), `src/lib/email.ts` (sendEmail + renderCredentialsEmail + generatePassword) | Disparar postback `order_approved` com e-mail novo. Resposta `{ accountCreated: true }`. E-mail chega via Resend OU senha aparece no log. |

## Testes automatizados (Vitest)

Rode `npm run test`.

| Arquivo | Cobertura |
| --- | --- |
| `tests/prompts.test.ts` | Confirma que o prompt de geração interpola corretamente todos os campos do formulário guiado e marca campos não informados. |
| `tests/plans.test.ts` | Garante que os 3 planos têm preços corretos (R$19,90 / R$59,90 / R$99,90), que o Estudante limita a 3 peças/mês e que o revisor jurídico está restrito ao Premium em diante. |
| `tests/usage.test.ts` | Função `exceedsLimit` retorna `false` para ilimitado e `true` apenas quando `remaining = 0`. |
| `tests/kiwify.test.ts` | Construção da URL de checkout com `email`/`name`/`sck`; mapeamento de `product_id` para plano; verificação de signature HMAC-SHA1 nos moldes da documentação oficial da Kiwify (incluindo rejeição de signature inválida). |

## Smoke test manual (executar antes de cada release)

1. **Landing page** → `/`. Banner de urgência, hero com prova social ao vivo, comparação Antes/Depois, planos com preço riscado e desconto, bônus, depoimentos com métrica, FAQ, CTA final. CTAs apontam direto para `pay.kiwify.com.br/...`.
2. **Checkout direto** → clicar "QUERO ACESSAR AGORA". Confirma redirect para Kiwify (sem precisar cadastro prévio).
3. **Webhook `order_approved` simulado** → POST para `/api/webhooks/kiwify?signature=...` com payload da Kiwify. Resposta `{ accountCreated: true }`; usuário criado em `auth.users` + `profiles`; senha provisória aparece no log (ou no e-mail Resend se configurado).
4. **Login com credenciais do e-mail** → entra direto no dashboard com o plano correto.
5. **Geração** → gerar 1 peça (Petição Inicial — Consumidor). Abre no editor com estrutura completa.
6. **Limite (plano Básico)** → tentar 6ª geração. Recebe 402 + alerta de upgrade.
7. **Modelos** → abrir um modelo premium (liberado para o plano), clonar e editar.
8. **Revisor** → colar uma peça e revisar.
9. **Exportação** → baixar DOCX, abrir PDF (imprimir).
10. **Cancelamento** → clicar "Gerenciar assinatura na Kiwify" em `/dashboard/settings`. Abre área do cliente Kiwify.
11. **Responsividade** → testar nos breakpoints `iPhone SE (375px)`, `iPad (768px)`, `desktop (1280px)`. Sidebar colapsa em < `lg`; landing usa grid responsivo.

## Limitações conhecidas (próximas iterações)

- **Atualização jurisprudencial automática** está documentada no system prompt mas hoje depende da base interna do modelo. Para precisão máxima, integrar com APIs do STF/STJ via RAG.
- **PDF nativo**: hoje servimos HTML imprimível (`window.print()`). Substituir por `pdf-lib` ou serviço como `@react-pdf/renderer` em versão futura.
- **Integrações PJe / e-SAJ** estão listadas no plano Profissional mas não foram implementadas neste MVP.
- **E-mails transacionais** dependem da configuração SMTP do Supabase.
- **Importação de processos / OAB** fora do escopo do MVP.
