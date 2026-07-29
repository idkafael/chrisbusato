// POST /api/cakto-pagamento — checkout transparente via API Cakto
// Body: { metodo: 'pix'|'credit_card', plano: 'mensal'|'trimestral'|'anual',
//         cliente: { nome, email, telefone, cpf }, cardToken?, fingerprint?, antifraudRef? }
//
// Env necessárias (Vercel → Settings → Environment Variables):
//   CAKTO_CLIENT_ID, CAKTO_CLIENT_SECRET
//   CAKTO_OFFER_MENSAL, CAKTO_OFFER_TRIMESTRAL, CAKTO_OFFER_ANUAL  (offerIds dos 3 planos)

const CAKTO_API = 'https://api.cakto.com.br'

let tokenCache = { token: null, expiresAt: 0 }

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
  if (!resp.ok) throw new Error(`Token Cakto falhou: ${resp.status} ${await resp.text()}`)
  const data = await resp.json()
  tokenCache = { token: data.access_token, expiresAt: Date.now() + (data.expires_in || 3600) * 1000 }
  return tokenCache.token
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

  const offers = {
    mensal: process.env.CAKTO_OFFER_MENSAL,
    trimestral: process.env.CAKTO_OFFER_TRIMESTRAL,
    anual: process.env.CAKTO_OFFER_ANUAL,
  }

  // Sem credenciais/ofertas configuradas → modo demo (a UI simula o fluxo)
  if (!process.env.CAKTO_CLIENT_ID || !process.env.CAKTO_CLIENT_SECRET) {
    return res.status(200).json({ demo: true, motivo: 'CAKTO_CLIENT_ID/SECRET não configurados na Vercel' })
  }

  try {
    const { metodo, plano, cliente, cardToken, fingerprint, antifraudRef } = req.body || {}

    if (!metodo || !['pix', 'credit_card'].includes(metodo)) {
      return res.status(400).json({ error: 'metodo deve ser pix ou credit_card' })
    }
    const offerId = offers[plano]
    if (!offerId) {
      return res.status(200).json({ demo: true, motivo: `Oferta do plano "${plano}" não configurada (CAKTO_OFFER_*)` })
    }
    if (!cliente?.nome || !cliente?.email || !cliente?.cpf) {
      return res.status(400).json({ error: 'Dados do cliente incompletos' })
    }

    const token = await obterToken()

    const body = {
      paymentMethod: metodo,
      customer: {
        name: cliente.nome,
        email: cliente.email,
        phone: cliente.telefone || undefined,
        docType: 'cpf',
        docNumber: String(cliente.cpf).replace(/\D/g, ''),
        fingerprint: fingerprint || undefined,
      },
      items: [{ offerId, quantity: 1, offerType: 'main' }],
      antifraudProfilingAttemptReference: antifraudRef || undefined,
    }
    if (metodo === 'pix') body.pixExpiresIn = 1800 // 30 min
    if (metodo === 'credit_card') {
      if (!cardToken) return res.status(400).json({ error: 'cardToken é obrigatório para cartão' })
      body.card = { token: cardToken }
    }

    const resp = await fetch(`${CAKTO_API}/public_api/payments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
    const data = await resp.json().catch(() => ({}))

    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'Cakto recusou a cobrança', detalhe: data })
    }

    // Devolve só o necessário ao front
    return res.status(201).json({
      id: data.id,
      refId: data.refId,
      status: data.status,
      amount: data.amount,
      pix: data.pix ? { qrCode: data.pix.qrCode, qrCodeBase64: data.pix.qrCodeBase64, expiresAt: data.pix.expiresAt } : undefined,
    })
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', detalhe: String(err.message || err) })
  }
}
