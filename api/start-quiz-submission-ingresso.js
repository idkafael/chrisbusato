const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { email, phone, full_name } = req.body || {};
  if (!email || !phone) {
    return res
      .status(400)
      .json({ ok: false, error: "email e phone são obrigatórios" });
  }

  const { data, error } = await supabase
    .from("quiz_submissions_ingresso")
    .insert({
      email,
      phone,
      full_name: full_name || null,
      quiz_completed: false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("start-quiz-submission-ingresso:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true, id: data.id });
};

