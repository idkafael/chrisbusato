// GET /api/vagas-aovivo
// Vagas do encontro diário: conta apenas os pedidos pagos no DIA CORRENTE
// (00:00 às 23:59, horário de Brasília). A contagem zera à meia-noite.
//
// Env opcionais: CAKTO_PRODUTO_AOVIVO, VAGAS_AOVIVO_TOTAL

const CAKTO_API = 'https://api.cakto.com.br'
const PRODUTO_PADRAO = '228ffdb8-31d8-455f-8f84-e030a049a8cb' // Brincando na Musica | HOJE AS 20H
const TOTAL_PADRAO = 10
const FUSO = 'America/Sao_Paulo'
const MAX_PAGINAS = 5 // teto de segurança: 50 pedidos no dia

let tokenCache = { token: null, expiresAt: 0 }
let cache = { dados: null, expiresAt: 0 }
const CACHE_MS = 45_000

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

// Meia-noite do dia corrente em Brasília, em ms epoch.
function inicioDoDia() {
  const partes = new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(new Date())

  const p = {}
  for (const parte of partes) if (parte.type !== 'literal') p[parte.type] = Number(parte.value)
  const hora = p.hour % 24

  // "agora" em Brasília expresso como UTC, para achar o deslocamento do fuso
  const agoraBRTComoUTC = Date.UTC(p.year, p.month - 1, p.day, hora, p.minute, p.second)
  const deslocamento = agoraBRTComoUTC - Date.now()

  const meiaNoiteBRTComoUTC = Date.UTC(p.year, p.month - 1, p.day, 0, 0, 0)
  return meiaNoiteBRTComoUTC - deslocamento
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' })

  const total = Number(process.env.VAGAS_AOVIVO_TOTAL) || TOTAL_PADRAO
  const produto = process.env.CAKTO_PRODUTO_AOVIVO || PRODUTO_PADRAO

  if (!process.env.CAKTO_CLIENT_ID || !process.env.CAKTO_CLIENT_SECRET) {
    return res.status(200).json({ indisponivel: true, motivo: 'Credenciais Cakto não configuradas' })
  }

  if (cache.dados && Date.now() < cache.expiresAt) {
    res.setHeader('Cache-Control', 'public, max-age=30')
    return res.status(200).json(cache.dados)
  }

  try {
    const token = await obterToken()
    const inicioMs = inicioDoDia()

    // Os pedidos vêm do mais novo para o mais antigo: paginamos só enquanto
    // todos os itens da página ainda forem do dia corrente.
    let vendidas = 0
    for (let pagina = 1; pagina <= MAX_PAGINAS; pagina++) {
      const url = `${CAKTO_API}/public_api/orders/?product=${produto}&status=paid&page=${pagina}`
      const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      if (!resp.ok) throw new Error(`Cakto respondeu ${resp.status}`)

      const data = await resp.json()
      const pedidos = data.results || []
      if (pedidos.length === 0) break

      const deHoje = pedidos.filter(o => {
        const quando = Date.parse(o.paidAt || o.createdAt || '')
        return Number.isFinite(quando) && quando >= inicioMs
      })
      vendidas += deHoje.length

      // Achou pedido de outro dia ou acabou a lista → não precisa paginar mais
      if (deHoje.length < pedidos.length || !data.next) break
    }

    const restantes = Math.max(total - vendidas, 0)
    const dados = {
      vendidas: Math.min(vendidas, total),
      total,
      restantes,
      percentual: Math.min(Math.round((vendidas / total) * 100), 100),
      esgotado: vendidas >= total,
    }

    cache = { dados, expiresAt: Date.now() + CACHE_MS }
    res.setHeader('Cache-Control', 'public, max-age=30')
    return res.status(200).json(dados)
  } catch (err) {
    // Melhor não mostrar barra nenhuma do que mostrar número errado.
    return res.status(200).json({ indisponivel: true, motivo: String(err.message || err) })
  }
}
