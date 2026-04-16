-- Tabela para leads vindos dos anúncios (/teste)
-- Estrutura idêntica à tabela orgânica, separada para segmentação

CREATE TABLE IF NOT EXISTS quiz_submissions_ads (
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

  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Índices para performance no dashboard
CREATE INDEX IF NOT EXISTS quiz_submissions_ads_email_idx       ON quiz_submissions_ads (email);
CREATE INDEX IF NOT EXISTS quiz_submissions_ads_created_at_idx  ON quiz_submissions_ads (created_at DESC);
CREATE INDEX IF NOT EXISTS quiz_submissions_ads_completed_idx   ON quiz_submissions_ads (quiz_completed);
