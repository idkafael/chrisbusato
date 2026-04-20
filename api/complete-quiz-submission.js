const { getSupabase, cors, tableFor } = require("./_lib");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "PATCH") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, source } = req.body || {};
  if (!id) return res.status(400).json({ ok: false, error: "id é obrigatório" });

  const supabase = getSupabase();
  const { error } = await supabase
    .from(tableFor(source))
    .update({
      q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
      quiz_completed: true,
      completed_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    console.error("complete-quiz-submission:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true });
};
