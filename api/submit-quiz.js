/**
 * POST /api/submit-quiz
 * Grava uma linha em public.quiz_submissions (Supabase REST).
 * Usa SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (nunca no browser).
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

  const letters = ["A", "B", "C", "D"];
  const row = {
    email: String(body.email || "").trim(),
    phone: String(body.phone || "").replace(/\D/g, ""),
    full_name: body.full_name != null && String(body.full_name).trim() !== ""
      ? String(body.full_name).trim()
      : null
  };

  for (let i = 1; i <= 10; i++) {
    const k = "q" + i;
    const v = body[k];
    if (!letters.includes(v)) {
      res.status(400).json({ error: "Invalid or missing " + k + " (use A,B,C,D)" });
      return;
    }
    row[k] = v;
  }

  if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }
  if (row.phone.length < 10 || row.phone.length > 15) {
    res.status(400).json({ error: "Invalid phone" });
    return;
  }

  const restUrl =
    supabaseUrl.replace(/\/$/, "") + "/rest/v1/quiz_submissions";

  try {
    const r = await fetch(restUrl, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: "Bearer " + serviceKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(row)
    });

    if (!r.ok) {
      const text = await r.text();
      res.status(502).json({
        error: "Supabase rejected the insert",
        details: text.slice(0, 500)
      });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
