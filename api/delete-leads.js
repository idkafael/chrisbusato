// Exclui leads permanentemente por ID
// Body: { secret, ids: string[], source }
const { getSupabase, checkSecret, cors, tableFor } = require("./_lib");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!checkSecret(req)) return res.status(401).json({ ok: false, error: "Unauthorized" });

  const { ids, source } = req.body || {};
  if (!ids?.length) return res.status(400).json({ ok: false, error: "ids obrigatório" });

  const supabase = getSupabase();
  const { error } = await supabase
    .from(tableFor(source))
    .delete()
    .in("id", ids);

  if (error) {
    console.error("delete-leads:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true, deleted: ids.length });
};
