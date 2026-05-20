-- Executar no SQL Editor do Supabase se ainda não existirem.
-- Fase 1: insert só com lead (q1–q10 null). Fase 2: PATCH com respostas.

alter table public.quiz_submissions
  add column if not exists quiz_completed boolean not null default false;

alter table public.quiz_submissions
  add column if not exists completed_at timestamptz;

-- Permitir insert inicial sem respostas (ajuste só se as colunas forem NOT NULL).
alter table public.quiz_submissions alter column q1 drop not null;
alter table public.quiz_submissions alter column q2 drop not null;
alter table public.quiz_submissions alter column q3 drop not null;
alter table public.quiz_submissions alter column q4 drop not null;
alter table public.quiz_submissions alter column q5 drop not null;
alter table public.quiz_submissions alter column q6 drop not null;
alter table public.quiz_submissions alter column q7 drop not null;
alter table public.quiz_submissions alter column q8 drop not null;
alter table public.quiz_submissions alter column q9 drop not null;
alter table public.quiz_submissions alter column q10 drop not null;
