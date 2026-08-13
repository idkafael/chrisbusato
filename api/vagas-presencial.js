// GET /api/vagas-presencial
// Retorna quantas vagas do presencial já foram preenchidas, contando pedidos
// PAGOS na Cakto (pendentes e reembolsados não entram).
//
// Env necessárias (Vercel → Settings → Environment Variables):
//   CAKTO_CLIENT_ID, CAKTO_CLIENT_SECRET   (já configuradas)
//   VAGAS_PRESENCIAL_TOTAL                 (capacidade do espaço, ex.: 60)
//   CAKTO_PRODUTO_PRESENCIAL               (opcional — id do produto; já tem padrão)

const CAKTO_API = 'https://api.cakto.com.br'

// Padrões do lote atual (13 de setembro). As env vars abaixo continuam valendo
// como override — ao trocar de evento, basta atualizar aqui ou na Vercel.
const PRODUTO_PADRAO = '751ef21d-edda-4dff-a3c4-83a855d8d545' // Presencial 13 de Setembro
const TOTAL_PADRAO = 70
// Vagas já ocupadas por convidados/cortesias — não vão à venda pública, mas
// ocupam lugar na sala, então entram na conta de "vagas preenchidas".
const RESERVADAS_PADRAO = 10

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

  const total = Number(process.env.VAGAS_PRESENCIAL_TOTAL) || TOTAL_PADRAO
  const produto = process.env.CAKTO_PRODUTO_PRESENCIAL || PRODUTO_PADRAO
  const reservadas = Number(process.env.VAGAS_PRESENCIAL_RESERVADAS ?? RESERVADAS_PADRAO) || 0

  if (!total || total <= 0) {
    return res.status(200).json({ indisponivel: true, motivo: 'Capacidade inválida' })
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

    // Ocupação da sala = vendas reais + vagas de convidados já comprometidas.
    const ocupadas = Math.min(vendidas + reservadas, total)

    // Marcos de virada de lote, posicionados por vagas restantes.
    // Só a posição relativa sai daqui — a capacidade em si continua privada.
    const marcos = [
      { restantes: 20, rotulo: '2º lote' },
      { restantes: 10, rotulo: '3º lote' },
    ]
      .filter(m => total > m.restantes)
      .map(m => ({
        rotulo: m.rotulo,
        pct: Math.round(((total - m.restantes) / total) * 1000) / 10,
        atingido: ocupadas >= total - m.restantes,
      }))

    // Só a porcentagem sai daqui — quantidade vendida e capacidade são dados
    // internos e não devem ficar públicos no endpoint.
    const dados = {
      percentual: Math.min(Math.round((ocupadas / total) * 100), 100),
      esgotado: ocupadas >= total,
      marcos,
    }

    vagasCache = { dados, expiresAt: Date.now() + CACHE_MS }
    res.setHeader('Cache-Control', 'public, max-age=30')
    return res.status(200).json(dados)
  } catch (err) {
    // Falhou? Melhor não mostrar barra nenhuma do que mostrar número errado.
    return res.status(200).json({ indisponivel: true, motivo: String(err.message || err) })
  }
}
