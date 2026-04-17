// Atualiza campos CRM de um lead (stage, notes, starred, archived, dominant_type)
// Body: { secret, id, source, ...campos }
const { getSupabase, checkSecret, cors, tableFor } = require("./_lib");

const ALLOWED_FIELDS = ["stage", "notes", "starred", "archived", "dominant_type", "follow_up_done", "follow_up_at", "payment_day", "payment_value", "payment_notes"];

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "PATCH" && req.method !== "POST")
    return res.status(405).json({ ok: false });

  if (!checkSecret(req))
    return res.status(401).json({ ok: false, error: "Unauthorized" });

  const { id, source, ...rest } = req.body || {};
  if (!id) return res.status(400).json({ ok: false, error: "id obrigatório" });

  // Filtra só campos permitidos
  const update = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in rest) update[key] = rest[key];
  }
  if (!Object.keys(update).length)
    return res.status(400).json({ ok: false, error: "Nenhum campo válido" });

  // follow_up_at automático
  if ("follow_up_done" in update) {
    update.follow_up_at = update.follow_up_done ? new Date().toISOString() : null;
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from(tableFor(source))
    .update(update)
    .eq("id", id);

  if (error) {
    console.error("update-lead:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true });
};
