/**
 * GET /api/dashboard-data
 * Retorna todos os registros de quiz_submissions.
 * Protegido por ?secret=DASHBOARD_SECRET (env var).
 */
module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Autenticação por secret query param
  const dashSecret = String(process.env.DASHBOARD_SECRET || "").trim();
  const providedSecret = String(req.query.secret || "").trim();

  if (!dashSecret) {
    res.status(500).json({ error: "DASHBOARD_SECRET not configured on server" });
    return;
  }

  if (!providedSecret || providedSecret !== dashSecret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const supabaseUrl = String(process.env.SUPABASE_URL || "").trim().replace(/\s+/g, "");
  const serviceKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (!supabaseUrl || !serviceKey) {
    res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" });
    return;
  }

  // Suporte a paginação
  const page = Math.max(0, parseInt(req.query.page || "0", 10));
  const pageSize = Math.min(500, Math.max(1, parseInt(req.query.pageSize || "200", 10)));
  const offset = page * pageSize;

  const restUrl =
    supabaseUrl.replace(/\/$/, "") +
    `/rest/v1/quiz_submissions?select=*&order=created_at.desc&limit=${pageSize}&offset=${offset}`;

  try {
    const r = await fetch(restUrl, {
      method: "GET",
      headers: {
        apikey: serviceKey,
        Authorization: "Bearer " + serviceKey,
        "Content-Type": "application/json",
        Prefer: "count=exact"
      }
    });

    const text = await r.text();
    if (!r.ok) {
      res.status(502).json({ error: "Supabase error", details: text.slice(0, 500) });
      return;
    }

    let rows = [];
    try {
      rows = JSON.parse(text);
    } catch {
      res.status(502).json({ error: "Failed to parse Supabase response" });
      return;
    }

    // Extrair total do header Content-Range
    const contentRange = r.headers.get("Content-Range") || "";
    let total = null;
    const match = contentRange.match(/\d+-\d+\/(\d+|\*)/);
    if (match && match[1] !== "*") {
      total = parseInt(match[1], 10);
    }

    res.status(200).json({ ok: true, rows, total, page, pageSize });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
