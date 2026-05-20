/**
 * POST /api/start-quiz-submission
 * Insere linha inicial (lead) com quiz_completed = false.
 * Respostas q1–q10 ficam null se a tabela permitir.
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

  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").replace(/\D/g, "");
  const full_name =
    body.full_name != null && String(body.full_name).trim() !== ""
      ? String(body.full_name).trim()
      : null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }
  if (phone.length < 10 || phone.length > 15) {
    res.status(400).json({ error: "Invalid phone" });
    return;
  }

  const row = {
    email,
    phone,
    full_name,
    quiz_completed: false
  };

  const restUrl =
    supabaseUrl.replace(/\/$/, "") + "/rest/v1/quiz_submissions";

  try {
    const r = await fetch(restUrl, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: "Bearer " + serviceKey,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify(row)
    });

    const text = await r.text();
    if (!r.ok) {
      res.status(502).json({
        error: "Supabase rejected the insert",
        details: text.slice(0, 500)
      });
      return;
    }

    let id = null;
    try {
      const rows = JSON.parse(text);
      if (Array.isArray(rows) && rows[0] && rows[0].id != null) {
        id = String(rows[0].id);
      }
    } catch {
      /* sem id na resposta */
    }

    res.status(200).json({ ok: true, id });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
