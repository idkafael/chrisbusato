-- Pagamentos Recorrentes — adiciona colunas de pagamento às duas tabelas
-- Execute no SQL Editor do Supabase

-- ─────────────────────────────────────────
-- TABELA ORGÂNICA
-- ─────────────────────────────────────────
ALTER TABLE quiz_submissions
  ADD COLUMN IF NOT EXISTS payment_day   integer,
  ADD COLUMN IF NOT EXISTS payment_value numeric(10,2),
  ADD COLUMN IF NOT EXISTS payment_notes text;

-- ─────────────────────────────────────────
-- TABELA ADS
-- ─────────────────────────────────────────
ALTER TABLE quiz_submissions_ads
  ADD COLUMN IF NOT EXISTS payment_day   integer,
  ADD COLUMN IF NOT EXISTS payment_value numeric(10,2),
  ADD COLUMN IF NOT EXISTS payment_notes text;
