# Peça Pronta — Assistente Jurídico com IA

MVP de um Micro-SaaS de produtividade jurídica para estudantes, estagiários e jovens advogados brasileiros. A plataforma oferece:

- **Landing page** completa, com copy e estrutura do wireframe estratégico.
- **Cadastro / login** via Supabase Auth.
- **Gerador de peças com IA** (OpenAI GPT-4.1 mini) com *input guiado* específico por tipo de peça (petição inicial, contestação, recurso, habeas corpus, parecer, contrato, etc.).
- **Biblioteca de modelos** premium e básicos, com filtro por área e busca.
- **Revisor jurídico inteligente** (revisão gramatical para o plano Básico, completa para Premium em diante).
- **Organizador de documentos** com histórico de versões e exportação para TXT, DOCX e PDF (via impressão).
- **Limites de uso por plano** (Estudante: 3 peças/mês; Premium e Profissional: ilimitado).
- **Pagamentos pela Kiwify** (links de checkout + webhook de postback).

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- TypeScript
- Tailwind CSS + Radix UI primitives
- Supabase (PostgreSQL + Auth + RLS)
- OpenAI (`openai` SDK, modelo `gpt-4.1-mini`)
- Kiwify (checkout link + webhook signature HMAC-SHA1)
- `docx` para exportação DOCX
- Vitest para testes unitários

## Estrutura

```
src/
  app/
    (auth)/                # signup, login
    dashboard/             # área logada (gerador, documentos, modelos, revisor, plano)
    legal/                 # termos e privacidade
    api/                   # generate, review, checkout, webhooks/kiwify, documents/[id]/export
    page.tsx               # landing page
  components/
    landing/               # seções da landing
    dashboard/             # sidebar, topbar
    ui/                    # primitives (button, input, card, accordion, etc.)
  lib/
    supabase/              # client, server, middleware
    plans.ts               # definição dos planos e features
    piece-types.ts         # input guiado por tipo de peça
    prompts.ts             # system prompts e construção de mensagens
    ai.ts                  # wrapper do SDK OpenAI (gpt-4.1-mini)
    kiwify.ts              # URL builder + verificação de signature
    usage.ts               # contagem mensal + checagem de limite
    profile.ts             # leitura do perfil autenticado
supabase/migrations/0001_initial_schema.sql
tests/                     # unit tests (Vitest)
```

## Instalação local

```bash
# 1. instale dependências
npm install

# 2. copie o env e preencha as chaves
cp .env.example .env.local
# Edite .env.local com:
#   - Credenciais do projeto Supabase
#   - ANTHROPIC_API_KEY
#   - Links públicos de checkout da Kiwify (NEXT_PUBLIC_KIWIFY_CHECKOUT_*)
#   - IDs de produto Kiwify (KIWIFY_PRODUCT_ID_*)
#   - KIWIFY_WEBHOOK_TOKEN

# 3. aplique o schema no Supabase
# usando o SQL editor do dashboard Supabase, cole supabase/migrations/0001_initial_schema.sql
# ou, com Supabase CLI:
#   supabase db push

# 4. rode o app
npm run dev
```

Acesse <http://localhost:3000>.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | sim | URL do projeto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sim | Chave anônima do Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | sim | Chave service-role (apenas backend / webhook). |
| `OPENAI_API_KEY` | sim | Chave da API OpenAI (modelo gpt-4.1-mini). |
| `KIWIFY_WEBHOOK_TOKEN` | sim | Token do webhook Kiwify (usado para validar a `signature`). |
| `NEXT_PUBLIC_KIWIFY_CHECKOUT_BASIC` | sim | Link público do checkout do plano Básico. |
| `NEXT_PUBLIC_KIWIFY_CHECKOUT_PREMIUM` | sim | Link público do checkout do plano Premium. |
| `RESEND_API_KEY` | opcional | Chave da Resend para envio das credenciais por e-mail. Sem ela, o webhook ainda funciona, mas a senha provisória precisa ser resgatada do log. |
| `EMAIL_FROM` | opcional | Remetente dos e-mails transacionais. Default: `Peça Pronta <contato@pecapronta.app>`. |
| `NEXT_PUBLIC_KIWIFY_CHECKOUT_PROFESSIONAL` | sim | Link público do checkout do plano Profissional. |
| `KIWIFY_PRODUCT_ID_BASIC` | sim | `product_id` da Kiwify para o plano Básico (mapeamento no webhook). |
| `KIWIFY_PRODUCT_ID_PREMIUM` | sim | `product_id` do plano Premium. |
| `KIWIFY_PRODUCT_ID_PROFESSIONAL` | sim | `product_id` do plano Profissional. |
| `NEXT_PUBLIC_KIWIFY_CUSTOMER_AREA` | opcional | URL da área do cliente Kiwify. Default: `https://kiwify.app/account`. |
| `NEXT_PUBLIC_APP_URL` | sim | URL pública do app (ex.: `https://pecapronta.app`). |

## Modelos de IA usados

- **Geração de peças:** `gpt-4.1-mini` — relação custo/qualidade adequada para textos jurídicos no MVP.
- **Revisor:** `gpt-4.1-mini` — mesma família, baixa latência para análise estruturada.

O system prompt está em `src/lib/prompts.ts` e impõe: padrão técnico-jurídico brasileiro, estrutura por seções (I, II, III...), proibição de inventar números de acórdãos e uso de marcadores `[ ]` quando faltar dado. O prompt caching da OpenAI é automático para prefixos ≥ 1024 tokens — não há parâmetro extra.

## Rodando testes

```bash
npm run test
```

Cobre:
- Construção dos prompts de geração e revisão (`prompts.test.ts`).
- Validação dos planos e limites (`plans.test.ts`).
- Lógica de excedente de uso (`usage.test.ts`).
- Construção da URL de checkout Kiwify e verificação de signature HMAC-SHA1 (`kiwify.test.ts`).

## Próximos passos sugeridos

1. Cadastrar os 3 produtos de **assinatura mensal** na Kiwify (Básico, Premium, Profissional) e preencher os links + product_ids no `.env`.
2. Apontar o postback da Kiwify para `https://SEU_DOMINIO/api/webhooks/kiwify` com os eventos: **Compra aprovada**, **Reembolso**, **Chargeback**, **Assinatura cancelada**, **Assinatura renovada**, **Assinatura atrasada**.
3. **Fluxo checkout-first:** todos os CTAs da landing levam direto à Kiwify. Após o pagamento, o webhook **cria automaticamente** o usuário no Supabase (`auth.admin.createUser`) a partir do e-mail do checkout, com senha provisória aleatória, e envia a senha por e-mail via Resend.
4. Configurar a chave Resend (`RESEND_API_KEY` + `EMAIL_FROM`) para o envio das credenciais. Sem ela, o webhook ainda cria a conta — mas a senha aparece só no log do servidor.
5. Configurar e-mails transacionais nativos do Supabase (recuperação de senha) com domínio próprio.
6. Hospedar em Vercel (ver `DEPLOY.md`).
