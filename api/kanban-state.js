// GET  /api/kanban-state?secret=xxx         — lê todo o estado
// POST /api/kanban-state  body:{secret,state} — salva estado (upsert por key)
const { getSupabase, checkSecret, cors } = require("./_lib");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!checkSecret(req)) return res.status(401).json({ ok: false, error: "Unauthorized" });

  const supabase = getSupabase();

  // ── GET ──────────────────────────────────────────────────────────────────
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("kanban_state")
      .select("key, value");
    if (error) return res.status(500).json({ ok: false, error: error.message });
    const state = {};
    (data || []).forEach(row => { state[row.key] = row.value; });
    return res.status(200).json({ ok: true, state });
  }

  // ── POST ─────────────────────────────────────────────────────────────────
  if (req.method === "POST") {
    const { state } = req.body || {};
    if (!state || typeof state !== "object")
      return res.status(400).json({ ok: false, error: "state obrigatório" });

    const rows = Object.entries(state).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from("kanban_state")
      .upsert(rows, { onConflict: "key" });

    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false });
};
