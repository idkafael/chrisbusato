// GET  /api/kanban-state?secret=xxx          — lê todo o estado
// POST /api/kanban-state body:{secret,state}  — merge inteligente no servidor
const { getSupabase, checkSecret, cors } = require("./_lib");

// Merge de array pelo campo `id` — local sobrescreve servidor para o mesmo id,
// itens que só existem no servidor são mantidos (sem deleção implícita).
function mergeById(serverArr, localArr) {
  const map = {};
  (serverArr || []).forEach(item => { if (item && item.id) map[item.id] = item; });
  (localArr  || []).forEach(item => { if (item && item.id) map[item.id] = item; });
  return Object.values(map);
}

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

  // ── POST — merge server-side ──────────────────────────────────────────────
  if (req.method === "POST") {
    const { state } = req.body || {};
    if (!state || typeof state !== "object")
      return res.status(400).json({ ok: false, error: "state obrigatório" });

    // 1. Lê estado atual do servidor
    const { data: existing } = await supabase
      .from("kanban_state")
      .select("key, value");
    const serverState = {};
    (existing || []).forEach(row => { serverState[row.key] = row.value; });

    // 2. Merge por tipo de dado
    const merged = {};
    for (const [key, localVal] of Object.entries(state)) {
      const serverVal = serverState[key];

      if (!serverVal) {
        // Servidor não tinha nada: usa o local direto
        merged[key] = localVal;
      } else if (Array.isArray(localVal)) {
        // Arrays (kbGuests, kbOffers): merge por id
        merged[key] = mergeById(serverVal, localVal);
      } else if (typeof localVal === "object" && localVal !== null) {
        // Objetos (kbStage, kbAssign, kbRemoved, kbFuLog):
        // servidor + local, local vence em conflito de chave
        merged[key] = { ...serverVal, ...localVal };
      } else {
        merged[key] = localVal;
      }
    }

    // 3. Salva estado merged
    const rows = Object.entries(merged).map(([key, value]) => ({
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
