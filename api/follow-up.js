/**
 * PATCH /api/follow-up
 * Marca ou desmarca o follow-up de um lead (campo follow_up_done).
 * Protegido pela mesma DASHBOARD_SECRET do dashboard.
 */
module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "PATCH") { res.status(405).json({ error: "Method not allowed" }); return; }

  const dashSecret    = String(process.env.DASHBOARD_SECRET || "").trim();
  const supabaseUrl   = String(process.env.SUPABASE_URL || "").trim().replace(/\s+/g, "");
  const serviceKey    = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (!supabaseUrl || !serviceKey) {
    res.status(500).json({ error: "Missing Supabase env vars" }); return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body || "{}"); } catch { res.status(400).json({ error: "Invalid JSON" }); return; }
  }
  if (!body || typeof body !== "object") { res.status(400).json({ error: "Expected JSON object" }); return; }

  const secret = String(body.secret || "").trim();
  if (!dashSecret || secret !== dashSecret) {
    res.status(401).json({ error: "Unauthorized" }); return;
  }

  const id   = String(body.id || "").trim();
  const done = body.done === true || body.done === "true";

  if (!id || !/^[a-zA-Z0-9_\-]+$/.test(id)) {
    res.status(400).json({ error: "Invalid id" }); return;
  }

  const patch = {
    follow_up_done: done,
    follow_up_at:   done ? new Date().toISOString() : null
  };

  const url = supabaseUrl.replace(/\/$/, "") + `/rest/v1/quiz_submissions?id=eq.${id}`;

  try {
    const r = await fetch(url, {
      method: "PATCH",
      headers: {
        apikey: serviceKey,
        Authorization: "Bearer " + serviceKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(patch)
    });

    if (!r.ok) {
      const text = await r.text();
      res.status(502).json({ error: "Supabase error", details: text.slice(0, 300) }); return;
    }

    res.status(200).json({ ok: true, id, follow_up_done: done });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
