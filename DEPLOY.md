# Deploy

Este projeto roda em qualquer plataforma que suporte Next.js 15. Documentação cobre o caminho recomendado: **Vercel** (frontend) + **Supabase** (auth/db) + **Kiwify** (pagamentos).

## 1. Provisione o Supabase

1. Crie um projeto em <https://supabase.com>.
2. No SQL Editor, cole o conteúdo de `supabase/migrations/0001_initial_schema.sql` e execute. Isso cria todas as tabelas (`profiles`, `subscriptions`, `documents`, `document_versions`, `templates`, `usage_events`), gatilho de criação automática de perfil, RLS e seed inicial de modelos.
3. Em **Authentication → URL Configuration**, defina:
   - `Site URL`: `https://SEU_DOMINIO.com.br`
   - `Redirect URLs`: `https://SEU_DOMINIO.com.br/dashboard`
4. Em **Project Settings → API**, copie `anon` e `service_role` keys.

## 2. OpenAI

1. Crie uma chave em <https://platform.openai.com/api-keys>.
2. Confirme que sua organização tem acesso ao modelo `gpt-4.1-mini`.

## 3. Kiwify

1. Crie **1 produto na Kiwify com 3 ofertas (planos)** de assinatura mensal: **Estudante (R$ 19,90)**, **Premium (R$ 59,90)** e **Profissional (R$ 99,90)**. (Alternativamente pode criar 3 produtos separados — o webhook suporta ambos.)
2. Copie:
   - URL pública de checkout de cada produto (`https://pay.kiwify.com.br/XXXXXX`).
   - O `product_id` (UUID) de cada produto (aparece nos webhooks ou nos detalhes do produto).
3. Em **Apps → Webhooks**, crie um webhook apontando para `https://SEU_DOMINIO.com.br/api/webhooks/kiwify` e copie o `token`.
   - Marque os eventos: **Compra aprovada**, **Reembolso**, **Chargeback**, **Assinatura cancelada**, **Assinatura renovada**, **Assinatura atrasada**.

### Fluxo "checkout-first"
- Todos os CTAs da landing levam **direto ao checkout da Kiwify**.
- Após o pagamento, o webhook (`/api/webhooks/kiwify`) **cria automaticamente** a conta no Supabase a partir do e-mail do checkout e envia a senha provisória por e-mail (via Resend).
- O usuário recebe e-mail com senha + link de login e já entra no dashboard.

## 4. Resend (envio de credenciais)

1. Crie conta em <https://resend.com> e adicione/verifique seu domínio (DNS DKIM/SPF).
2. Crie um API key e configure no `.env`:
   - `RESEND_API_KEY=re_...`
   - `EMAIL_FROM=Peça Pronta <contato@SEU_DOMINIO.com.br>`
3. Sem Resend o webhook ainda funciona — a senha provisória aparece nos logs do servidor (resgate manual).

## 5. Configure variáveis de ambiente

Configure (na Vercel ou em `.env.local` em outras plataformas):

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

OPENAI_API_KEY=sk-...

KIWIFY_WEBHOOK_TOKEN=...
NEXT_PUBLIC_KIWIFY_CHECKOUT_BASIC=https://pay.kiwify.com.br/AAA
NEXT_PUBLIC_KIWIFY_CHECKOUT_PREMIUM=https://pay.kiwify.com.br/BBB
NEXT_PUBLIC_KIWIFY_CHECKOUT_PROFESSIONAL=https://pay.kiwify.com.br/CCC
KIWIFY_PRODUCT_ID_BASIC=...
KIWIFY_PRODUCT_ID_PREMIUM=...
KIWIFY_PRODUCT_ID_PROFESSIONAL=...

RESEND_API_KEY=re_...
EMAIL_FROM=Peça Pronta <contato@SEU_DOMINIO.com.br>

NEXT_PUBLIC_APP_URL=https://SEU_DOMINIO.com.br
```

## 6. Deploy na Vercel

1. Conecte o repositório em <https://vercel.com/new>.
2. Framework preset: **Next.js**.
3. Defina as variáveis de ambiente acima.
4. Após o primeiro deploy, configure o domínio custom em **Project → Domains**.
5. Volte ao Supabase e ajuste `Site URL` e `Redirect URLs` para o domínio final.

## 7. Smoke test pós-deploy

Realize o seguinte fluxo manual (cobre as principais dores do produto e o fluxo checkout-first):

| # | Passo | Resultado esperado |
| --- | --- | --- |
| 1 | Abrir a landing page | Banner de urgência, hero animado, comparação Antes/Depois, planos com preço riscado, bônus, depoimentos com avatar — todos visíveis. |
| 2 | Clicar em qualquer CTA "Quero acessar / Quero o Premium" | Redireciona para `pay.kiwify.com.br/...` (sem precisar de cadastro prévio). |
| 3 | Concluir checkout com cartão de teste da Kiwify | Postback chega em `/api/webhooks/kiwify`. Logs mostram `accountCreated:true`. |
| 4 | Verificar caixa de entrada do e-mail do checkout | E-mail "🎉 Seu acesso ao Peça Pronta está liberado" chega via Resend com a senha provisória. |
| 5 | Logar em `/login` com o e-mail e a senha do e-mail | Dashboard abre, plano correto exibido na topbar. |
| 6 | Gerar uma petição inicial preenchendo o formulário guiado | Rascunho é devolvido e salvo em "Meus documentos". `usage_events` recebe 1 linha. |
| 7 | (Plano Básico) tentar 6ª geração no mesmo mês | Resposta 402 + UI mostra "Limite mensal atingido" com botão de upgrade. |
| 8 | Abrir modelo "Habeas Corpus" da biblioteca → "Usar este modelo" | Documento é clonado, abre o editor pronto para edição. |
| 9 | Acessar Revisor inteligente, colar a peça gerada e clicar "Revisar agora" | Relatório dividido em (A)(B)(C)(D) + Recomendações. |
| 10 | Exportar documento em DOCX e PDF | DOCX baixa via streaming; PDF abre HTML imprimível. |
| 11 | Em "Plano e cobrança", clicar "Gerenciar assinatura na Kiwify" | Abre área do cliente Kiwify em nova aba. |

## 8. Monitoramento

- **Supabase Logs** → SQL editor `select * from usage_events order by created_at desc limit 50`.
- **Kiwify → Apps → Webhooks** mostra o histórico e permite reenviar postbacks.
- **Vercel → Logs** captura erros 500 dos endpoints `/api/generate`, `/api/review`, `/api/webhooks/kiwify`.

## 9. Rollback rápido

- Reverter deploy: Vercel → Project → Deployments → "Promote to Production" em uma versão anterior.
- Revogar um plano específico: na tabela `profiles`, `update profiles set plan='free' where id='...';`.
- Reprocessar webhook: Kiwify → Webhooks → Reenviar evento.
