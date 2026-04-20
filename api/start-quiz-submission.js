const { getSupabase, cors, tableFor } = require("./_lib");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { email, phone, full_name, source } = req.body || {};
  if (!email || !phone) {
    return res.status(400).json({ ok: false, error: "email e phone são obrigatórios" });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(tableFor(source))
    .insert({
      email, phone, full_name: full_name || null,
      quiz_completed: false
    })
    .select("id")
    .single();

  if (error) {
    console.error("start-quiz-submission:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true, id: data.id });
};
