-- Tabela para leads vindos do Ingresso (Ticket Reveal / Ingresso)
-- Estrutura idêntica à tabela orgânica, separada para segmentação no CRM.

CREATE TABLE IF NOT EXISTS quiz_submissions_ingresso (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text        NOT NULL,
  phone         text        NOT NULL,
  full_name     text,

  q1  text, q2  text, q3  text, q4  text, q5  text,
  q6  text, q7  text, q8  text, q9  text, q10 text,

  quiz_completed  boolean     NOT NULL DEFAULT false,
  completed_at    timestamptz,

  follow_up_done  boolean     NOT NULL DEFAULT false,
  follow_up_at    timestamptz,

  created_at      timestamptz NOT NULL DEFAULT now(),

  -- CRM fields (compatível com crm_migration.sql)
  stage         text    NOT NULL DEFAULT 'novo',
  notes         text,
  starred       boolean NOT NULL DEFAULT false,
  archived      boolean NOT NULL DEFAULT false,
  dominant_type text,

  -- Cobranças
  payment_day   int,
  payment_value numeric,
  payment_notes text,
  payment_method text
);

-- Índices para performance no dashboard
CREATE INDEX IF NOT EXISTS quiz_submissions_ingresso_email_idx       ON quiz_submissions_ingresso (email);
CREATE INDEX IF NOT EXISTS quiz_submissions_ingresso_created_at_idx  ON quiz_submissions_ingresso (created_at DESC);
CREATE INDEX IF NOT EXISTS quiz_submissions_ingresso_completed_idx   ON quiz_submissions_ingresso (quiz_completed);
CREATE INDEX IF NOT EXISTS quiz_submissions_ingresso_stage_idx       ON quiz_submissions_ingresso (stage);
CREATE INDEX IF NOT EXISTS quiz_submissions_ingresso_starred_idx     ON quiz_submissions_ingresso (starred);
CREATE INDEX IF NOT EXISTS quiz_submissions_ingresso_archived_idx    ON quiz_submissions_ingresso (archived);

