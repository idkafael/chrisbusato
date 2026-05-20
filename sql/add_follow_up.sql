-- Adicionar coluna de follow-up para controle de contato pelos chatters.
-- Executar no SQL Editor do Supabase.

alter table public.quiz_submissions
  add column if not exists follow_up_done boolean not null default false;

alter table public.quiz_submissions
  add column if not exists follow_up_at timestamptz;
