const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "PATCH") return res.status(405).json({ ok: false });

  const { secret, id, done } = req.body || {};
  if (!secret || secret !== process.env.DASHBOARD_SECRET) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  if (!id) return res.status(400).json({ ok: false, error: "id é obrigatório" });

  const { error } = await supabase
    .from("quiz_submissions")
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
