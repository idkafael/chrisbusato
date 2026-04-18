// Ações em massa sobre múltiplos leads
// Body: { secret, ids: string[], source, action, value }
// actions: set_stage | set_starred | set_archived | set_follow_up | delete
const { getSupabase, checkSecret, cors, tableFor } = require("./_lib");

const ACTION_MAP = {
  set_stage:     "stage",
  set_starred:   "starred",
  set_archived:  "archived",
  set_follow_up: "follow_up_done",
};

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ ok: false });

  if (!checkSecret(req))
    return res.status(401).json({ ok: false, error: "Unauthorized" });

  const { ids, source, action, value } = req.body || {};
  if (!ids?.length) return res.status(400).json({ ok: false, error: "ids obrigatório" });

  const supabase = getSupabase();

  // Exclusão permanente
  if (action === "delete") {
    const { error } = await supabase
      .from(tableFor(source))
      .delete()
      .in("id", ids);
    if (error) {
      console.error("bulk-action delete:", error);
      return res.status(500).json({ ok: false, error: error.message });
    }
    return res.status(200).json({ ok: true, deleted: ids.length });
  }

  if (!ACTION_MAP[action]) return res.status(400).json({ ok: false, error: "action inválida" });

  const field = ACTION_MAP[action];
  const update = { [field]: value };

  if (action === "set_follow_up") {
    update.follow_up_at = value ? new Date().toISOString() : null;
  }

  const { error } = await supabase
    .from(tableFor(source))
    .update(update)
    .in("id", ids);

  if (error) {
    console.error("bulk-action:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true, updated: ids.length });
};
