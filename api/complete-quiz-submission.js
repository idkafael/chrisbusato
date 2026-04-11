/**
 * POST /api/complete-quiz-submission
 * Atualiza a linha (id) com q1–q10 e quiz_completed = true.
 */
module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const supabaseUrl = String(process.env.SUPABASE_URL || "")
    .trim()
    .replace(/\s+/g, "");
  const serviceKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (!supabaseUrl || !serviceKey) {
    res.status(500).json({
      error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY on the server"
    });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      res.status(400).json({ error: "Invalid JSON body" });
      return;
    }
  }
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Expected JSON object" });
    return;
  }

  const id = String(body.id || "").trim();
  if (!id || id.length > 128 || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    res.status(400).json({ error: "Invalid or missing id" });
    return;
  }

  const letters = ["A", "B", "C", "D"];
  const patch = {
    quiz_completed: true,
    completed_at: new Date().toISOString()
  };

  for (let i = 1; i <= 10; i++) {
    const k = "q" + i;
    const v = body[k];
    if (!letters.includes(v)) {
      res.status(400).json({ error: "Invalid or missing " + k + " (use A,B,C,D)" });
      return;
    }
    patch[k] = v;
  }

  const restUrl =
    supabaseUrl.replace(/\/$/, "") +
    "/rest/v1/quiz_submissions?id=eq." +
    encodeURIComponent(id);

  try {
    const r = await fetch(restUrl, {
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
      res.status(502).json({
        error: "Supabase rejected the update",
        details: text.slice(0, 500)
      });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
