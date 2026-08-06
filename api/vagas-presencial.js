// GET /api/vagas-presencial
// Retorna quantas vagas do presencial já foram preenchidas, contando pedidos
// PAGOS na Cakto (pendentes e reembolsados não entram).
//
// Env necessárias (Vercel → Settings → Environment Variables):
//   CAKTO_CLIENT_ID, CAKTO_CLIENT_SECRET   (já configuradas)
//   VAGAS_PRESENCIAL_TOTAL                 (capacidade do espaço, ex.: 60)
//   CAKTO_PRODUTO_PRESENCIAL               (opcional — id do produto; já tem padrão)

const CAKTO_API = 'https://api.cakto.com.br'

let tokenCache = { token: null, expiresAt: 0 }
let vagasCache = { dados: null, expiresAt: 0 }

const CACHE_MS = 60_000 // 1 min: evita bater na Cakto a cada visita

async function obterToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt - 60_000) return tokenCache.token

  const resp = await fetch(`${CAKTO_API}/public_api/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.CAKTO_CLIENT_ID,
      client_secret: process.env.CAKTO_CLIENT_SECRET,
    }),
  })
  if (!resp.ok) throw new Error(`Token Cakto falhou: ${resp.status}`)
  const data = await resp.json()
  tokenCache = { token: data.access_token, expiresAt: Date.now() + (data.expires_in || 3600) * 1000 }
  return tokenCache.token
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' })

  const total = Number(process.env.VAGAS_PRESENCIAL_TOTAL)
  const produto = process.env.CAKTO_PRODUTO_PRESENCIAL

  // Sem capacidade ou sem produto configurado não dá para mostrar barra honesta — o front esconde.
  if (!total || total <= 0) {
    return res.status(200).json({ indisponivel: true, motivo: 'VAGAS_PRESENCIAL_TOTAL não configurada' })
  }
  if (!produto) {
    return res.status(200).json({ indisponivel: true, motivo: 'CAKTO_PRODUTO_PRESENCIAL não configurado' })
  }
  if (!process.env.CAKTO_CLIENT_ID || !process.env.CAKTO_CLIENT_SECRET) {
    return res.status(200).json({ indisponivel: true, motivo: 'Credenciais Cakto não configuradas' })
  }

  // Cache curto, compartilhado entre visitantes
  if (vagasCache.dados && Date.now() < vagasCache.expiresAt) {
    res.setHeader('Cache-Control', 'public, max-age=30')
    return res.status(200).json(vagasCache.dados)
  }

  try {
    const token = await obterToken()

    // limit=1 porque só interessa o "count" — resposta mínima
    const url = `${CAKTO_API}/public_api/orders/?product=${produto}&status=paid&limit=1`
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!resp.ok) throw new Error(`Cakto respondeu ${resp.status}`)

    const data = await resp.json()
    const vendidas = Number(data.count) || 0

    // Só a porcentagem sai daqui — quantidade vendida e capacidade são dados
    // internos e não devem ficar públicos no endpoint.
    const dados = {
      percentual: Math.min(Math.round((vendidas / total) * 100), 100),
      esgotado: vendidas >= total,
    }

    vagasCache = { dados, expiresAt: Date.now() + CACHE_MS }
    res.setHeader('Cache-Control', 'public, max-age=30')
    return res.status(200).json(dados)
  } catch (err) {
    // Falhou? Melhor não mostrar barra nenhuma do que mostrar número errado.
    return res.status(200).json({ indisponivel: true, motivo: String(err.message || err) })
  }
}
