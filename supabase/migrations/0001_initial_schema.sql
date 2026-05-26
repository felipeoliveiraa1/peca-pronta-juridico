-- =====================================================================
-- Peça Pronta — Initial schema
-- =====================================================================
-- Tables:
--   profiles            -- public mirror of auth.users with plan info
--   subscriptions       -- Stripe subscription record per user
--   documents           -- generated/edited pieces (saved by users)
--   templates           -- premium models library (admin-managed)
--   usage_events        -- counter for monthly limits (basic plan)
--   document_versions   -- history of edits for a document
--
-- Storage of plan limits is enforced in app code (see src/lib/plans.ts),
-- but we still record every generation in usage_events for billing/audit.

create extension if not exists pgcrypto;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'basic', 'premium', 'professional')),
  -- ID do cliente no gateway de pagamento (Kiwify). É preenchido na 1ª compra.
  gateway_customer_id text,
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_gateway_customer_id_idx
  on public.profiles(gateway_customer_id)
  where gateway_customer_id is not null;

-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- subscriptions ----------
-- Estrutura agnóstica de gateway. Hoje populada via webhook da Kiwify.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  gateway text not null default 'kiwify',
  -- order_id da Kiwify (ou ID equivalente de assinatura).
  gateway_subscription_id text unique not null,
  -- product_id do produto na Kiwify.
  gateway_product_id text not null,
  plan text not null check (plan in ('basic', 'premium', 'professional')),
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  raw_event jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

-- ---------- documents ----------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  piece_type text not null,
  area text,
  content text not null default '',
  input_payload jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'final')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists documents_user_id_idx on public.documents(user_id);
create index if not exists documents_updated_at_idx on public.documents(updated_at desc);

-- ---------- document_versions ----------
create table if not exists public.document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  content text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists document_versions_document_id_idx on public.document_versions(document_id, created_at desc);

-- ---------- templates ----------
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  area text not null,
  piece_type text not null,
  description text,
  body text not null,
  is_premium boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists templates_area_idx on public.templates(area);
create index if not exists templates_piece_type_idx on public.templates(piece_type);

-- ---------- usage_events ----------
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('generation', 'review')),
  tokens_in integer,
  tokens_out integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists usage_events_user_id_created_at_idx
  on public.usage_events(user_id, created_at desc);

-- =====================================================================
-- Row Level Security
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.documents enable row level security;
alter table public.document_versions enable row level security;
alter table public.templates enable row level security;
alter table public.usage_events enable row level security;

-- profiles: a user can see and update only their own profile
drop policy if exists "profiles self select" on public.profiles;
create policy "profiles self select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id);

-- subscriptions: read-only for the owner; writes happen via service role
drop policy if exists "subscriptions self select" on public.subscriptions;
create policy "subscriptions self select" on public.subscriptions
  for select using (auth.uid() = user_id);

-- documents: owner CRUD
drop policy if exists "documents owner select" on public.documents;
create policy "documents owner select" on public.documents
  for select using (auth.uid() = user_id);

drop policy if exists "documents owner insert" on public.documents;
create policy "documents owner insert" on public.documents
  for insert with check (auth.uid() = user_id);

drop policy if exists "documents owner update" on public.documents;
create policy "documents owner update" on public.documents
  for update using (auth.uid() = user_id);

drop policy if exists "documents owner delete" on public.documents;
create policy "documents owner delete" on public.documents
  for delete using (auth.uid() = user_id);

-- document_versions: owner read; insert constrained to owner of parent
drop policy if exists "document_versions owner select" on public.document_versions;
create policy "document_versions owner select" on public.document_versions
  for select using (
    exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid())
  );

drop policy if exists "document_versions owner insert" on public.document_versions;
create policy "document_versions owner insert" on public.document_versions
  for insert with check (
    exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid())
  );

-- templates: any signed-in user can read; premium gating handled in app
drop policy if exists "templates read all" on public.templates;
create policy "templates read all" on public.templates
  for select using (auth.role() = 'authenticated');

-- usage_events: owner reads, owner inserts (server uses service role)
drop policy if exists "usage_events owner select" on public.usage_events;
create policy "usage_events owner select" on public.usage_events
  for select using (auth.uid() = user_id);

drop policy if exists "usage_events owner insert" on public.usage_events;
create policy "usage_events owner insert" on public.usage_events
  for insert with check (auth.uid() = user_id);

-- =====================================================================
-- Seed: a handful of starter templates so the library is not empty
-- =====================================================================
insert into public.templates (title, area, piece_type, description, body, is_premium) values
  (
    'Petição Inicial — Indenização por Danos Morais (Consumidor)',
    'Direito do Consumidor',
    'peticao_inicial',
    'Modelo base para ações indenizatórias decorrentes de relação de consumo, com fundamentação no CDC.',
    E'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ª VARA CÍVEL DA COMARCA DE ___\n\n[QUALIFICAÇÃO DA PARTE AUTORA], vem, respeitosamente, à presença de Vossa Excelência, por seu(sua) advogado(a) que esta subscreve, com fundamento nos artigos 6º, VI, e 14 da Lei nº 8.078/1990 (Código de Defesa do Consumidor), propor a presente AÇÃO DE INDENIZAÇÃO POR DANOS MORAIS em face de [QUALIFICAÇÃO DA PARTE RÉ], pelos fatos e fundamentos a seguir expostos.\n\nI – DOS FATOS\n[Descrever os fatos com clareza e cronologia]\n\nII – DO DIREITO\n[Fundamentação aplicável]\n\nIII – DOS PEDIDOS\nDiante do exposto, requer:\na) a citação da parte ré;\nb) a condenação ao pagamento de indenização por danos morais no valor de R$ ___;\nc) a inversão do ônus da prova, nos termos do art. 6º, VIII, do CDC.\n\nDá-se à causa o valor de R$ ___.\n\nNestes termos, pede deferimento.\n\n[Local], [Data].\n[Nome do(a) Advogado(a)] — OAB/__ nº ___',
    true
  ),
  (
    'Contestação — Ação de Cobrança',
    'Direito Civil',
    'contestacao',
    'Modelo de contestação genérica para ações de cobrança, com preliminares e mérito.',
    E'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ª VARA CÍVEL\n\nAutos nº ___\n\n[QUALIFICAÇÃO DA PARTE RÉ], nos autos da ação em epígrafe, vem apresentar CONTESTAÇÃO, pelos fundamentos a seguir.\n\nI – DAS PRELIMINARES\n[Eventuais preliminares: ilegitimidade, prescrição, etc.]\n\nII – DO MÉRITO\n[Refutação dos fatos]\n\nIII – DOS PEDIDOS\nRequer a total improcedência dos pedidos iniciais.\n\nProtesta provar o alegado por todos os meios de prova em direito admitidos.\n\nNestes termos, pede deferimento.\n\n[Local], [Data].',
    true
  ),
  (
    'Recurso de Apelação — Cível',
    'Direito Processual Civil',
    'apelacao',
    'Modelo de razões de apelação cível, conforme art. 1.010 do CPC.',
    E'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ª VARA\n\n[Recorrente], inconformado(a) com a r. sentença de fls. ___, vem interpor RECURSO DE APELAÇÃO, com fundamento no art. 1.009 do CPC, requerendo o recebimento e, após as formalidades legais, a remessa dos autos ao Egrégio Tribunal.\n\nRAZÕES DE APELAÇÃO\n\nI – BREVE SÍNTESE\nII – DAS RAZÕES DE REFORMA\nIII – DOS PEDIDOS\n\nRequer o conhecimento e provimento do recurso para reformar integralmente a r. sentença.\n\nNestes termos, pede deferimento.',
    true
  ),
  (
    'Reclamação Trabalhista — Verbas Rescisórias',
    'Direito do Trabalho',
    'peticao_inicial',
    'Modelo para reclamação trabalhista pleiteando verbas rescisórias não pagas.',
    E'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DO TRABALHO DA ___ª VARA DO TRABALHO DE ___\n\n[QUALIFICAÇÃO DO(A) RECLAMANTE], vem propor RECLAMAÇÃO TRABALHISTA em face de [QUALIFICAÇÃO DA RECLAMADA], com fundamento na CLT, pelos fatos e fundamentos a seguir:\n\nI – DO CONTRATO DE TRABALHO\nII – DA RESCISÃO E VERBAS DEVIDAS\nIII – DOS PEDIDOS\n\nRequer a procedência dos pedidos para condenar a Reclamada ao pagamento das verbas devidas, com juros e correção monetária.\n\nDá-se à causa o valor de R$ ___.\n\nNestes termos, pede deferimento.',
    false
  ),
  (
    'Habeas Corpus — Liberatório',
    'Direito Penal',
    'habeas_corpus',
    'Modelo de habeas corpus liberatório, com fundamentos do art. 5º, LXVIII, da CF.',
    E'EXCELENTÍSSIMO(A) SENHOR(A) DESEMBARGADOR(A) PRESIDENTE DO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE ___\n\n[Impetrante], vem impetrar HABEAS CORPUS, com pedido liminar, em favor de [Paciente], em face de ato coator praticado por [Autoridade Coatora], pelos fatos e fundamentos a seguir:\n\nI – DOS FATOS\nII – DO DIREITO\nIII – DA LIMINAR\nIV – DOS PEDIDOS\n\nRequer a concessão da ordem para que seja determinada a imediata expedição do alvará de soltura.\n\nNestes termos, pede deferimento.',
    true
  );
