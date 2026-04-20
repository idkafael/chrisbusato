const { getSupabase, cors, tableFor } = require("./_lib");

// Fallback: submissão completa em uma chamada só
module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { email, phone, full_name, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, source } = req.body || {};
  if (!email || !phone) {
    return res.status(400).json({ ok: false, error: "email e phone são obrigatórios" });
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from(tableFor(source))
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
