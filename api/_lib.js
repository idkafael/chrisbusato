// Helpers compartilhados entre as funções serverless
const { createClient } = require("@supabase/supabase-js");

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function checkSecret(req) {
  const secret = req.query?.secret || req.body?.secret;
  return secret && secret === process.env.DASHBOARD_SECRET;
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function tableFor(source) {
  if (source === "ads") return "quiz_submissions_ads";
  if (source === "ingresso") return "quiz_submissions_ingresso";
  return "quiz_submissions";
}

module.exports = { getSupabase, checkSecret, cors, tableFor };
