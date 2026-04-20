const { getSupabase, checkSecret, cors, tableFor } = require("./_lib");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "PATCH") return res.status(405).json({ ok: false });

  if (!checkSecret(req))
    return res.status(401).json({ ok: false, error: "Unauthorized" });

  const { id, done, source } = req.body || {};
  if (!id) return res.status(400).json({ ok: false, error: "id é obrigatório" });

  const supabase = getSupabase();
  const { error } = await supabase
    .from(tableFor(source))
    .update({
      follow_up_done: !!done,
      follow_up_at: done ? new Date().toISOString() : null
    })
    .eq("id", id);

  if (error) {
    console.error("follow-up:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true });
};
