const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ ok: false });

  const { secret } = req.query;
  if (!secret || secret !== process.env.DASHBOARD_SECRET) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const { data, error } = await supabase
    .from("quiz_submissions_ads")
    .select("id, email, phone, full_name, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, quiz_completed, completed_at, follow_up_done, follow_up_at, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("dashboard-data-ads:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true, rows: data });
};
