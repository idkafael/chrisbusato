-- ============================================================
-- Admin: alunos e pagamentos
-- Rode este SQL no Supabase (SQL Editor) uma única vez.
-- ============================================================

create extension if not exists "pgcrypto";

-- ── Alunos ───────────────────────────────────────────────────
create table if not exists alunos (
  id             uuid primary key default gen_random_uuid(),
  nome           text not null,
  contato        text,                                   -- whatsapp / e-mail
  produto        text,                                   -- ex.: Programa Online
  data_inicio    date not null,                          -- início do acesso
  meses_acesso   int  not null default 12,               -- ex.: 12  -> "6/12 meses"
  valor_total    numeric(10,2) not null default 0,       -- valor TOTAL do contrato
  total_parcelas int  not null default 1,                -- ex.: 5   -> "1/5 parcelas"
  dia_vencimento int  not null default 10,               -- 1..31 (dia do mês do pagamento)
  observacoes    text,
  created_at     timestamptz not null default now()
);

-- ── Pagamentos (uma linha por parcela) ───────────────────────
create table if not exists pagamentos (
  id         uuid primary key default gen_random_uuid(),
  aluno_id   uuid not null references alunos(id) on delete cascade,
  numero     int  not null,                              -- 1..total_parcelas
  vencimento date not null,
  valor      numeric(10,2) not null default 0,
  pago       boolean not null default false,
  pago_em    timestamptz,
  created_at timestamptz not null default now(),
  unique (aluno_id, numero)
);

create index if not exists idx_pagamentos_aluno      on pagamentos(aluno_id);
create index if not exists idx_pagamentos_vencimento on pagamentos(vencimento);
create index if not exists idx_pagamentos_pago       on pagamentos(pago);

-- ── Segurança ────────────────────────────────────────────────
-- RLS ligado e SEM policies: ninguém acessa via chave pública.
-- Só a service_role (usada pelas funções em /api) consegue ler/escrever.
alter table alunos     enable row level security;
alter table pagamentos enable row level security;
