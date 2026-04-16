const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fallback: submissão completa em uma chamada só
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { email, phone, full_name, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body || {};
  if (!email || !phone) {
    return res.status(400).json({ ok: false, error: "email e phone são obrigatórios" });
  }

  const { error } = await supabase
    .from("quiz_submissions")
    .insert({
      email, phone, full_name: full_name || null,
      q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
      quiz_completed: true,
      completed_at: new Date().toISOString()
    });

  if (error) {
    console.error("submit-quiz:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true });
};
