-- CRM Migration — adiciona colunas às duas tabelas (orgânica e ads)
-- Execute no SQL Editor do Supabase

-- ─────────────────────────────────────────
-- TABELA ORGÂNICA (substitua pelo nome real se for diferente)
-- ─────────────────────────────────────────
ALTER TABLE quiz_submissions
  ADD COLUMN IF NOT EXISTS stage         text    NOT NULL DEFAULT 'novo',
  ADD COLUMN IF NOT EXISTS notes         text,
  ADD COLUMN IF NOT EXISTS starred       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived      boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dominant_type text;

-- ─────────────────────────────────────────
-- TABELA ADS
-- ─────────────────────────────────────────
ALTER TABLE quiz_submissions_ads
  ADD COLUMN IF NOT EXISTS stage         text    NOT NULL DEFAULT 'novo',
  ADD COLUMN IF NOT EXISTS notes         text,
  ADD COLUMN IF NOT EXISTS starred       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived      boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dominant_type text;

-- Índices extras
CREATE INDEX IF NOT EXISTS quiz_submissions_stage_idx      ON quiz_submissions     (stage);
CREATE INDEX IF NOT EXISTS quiz_submissions_starred_idx    ON quiz_submissions     (starred);
CREATE INDEX IF NOT EXISTS quiz_submissions_archived_idx   ON quiz_submissions     (archived);

CREATE INDEX IF NOT EXISTS quiz_submissions_ads_stage_idx    ON quiz_submissions_ads (stage);
CREATE INDEX IF NOT EXISTS quiz_submissions_ads_starred_idx  ON quiz_submissions_ads (starred);
CREATE INDEX IF NOT EXISTS quiz_submissions_ads_archived_idx ON quiz_submissions_ads (archived);
