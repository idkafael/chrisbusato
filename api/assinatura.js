import { plans, bumps, validateCustomer } from '../checkout/catalog.js'

// Hosted URLs are explicitly mapped by plan + sorted extras, never fabricated
// query parameters. Configure the corresponding basket in Cakto first.
function settings() {
  let hosted = {}
  try { hosted = JSON.parse(process.env.CAKTO_ASSINATURA_CHECKOUTS || '{}') } catch { /* fail closed */ }
  return { enabled: process.env.CAKTO_ASSINATURA_ENABLED === 'true', hosted }
}
function safeUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'pay.cakto.com.br' ? url.href : null } catch { return null }
}
let cachedToken
async function token() {
  if (cachedToken && cachedToken.until > Date.now()) return cachedToken.value
  const response = await fetch('https://api.cakto.com.br/public_api/token/', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: process.env.CAKTO_CLIENT_ID, client_secret: process.env.CAKTO_CLIENT_SECRET }),
    signal: AbortSignal.timeout(15000),
  })
  const data = await response.json()
  if (!response.ok || !data.access_token) throw new Error('auth')
  cachedToken = { value: data.access_token, until: Date.now() + Math.max(0, (Number(data.expires_in) || 3600) - 60) * 1000 }
  return cachedToken.value
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const config = settings()
  if (req.method === 'GET') return res.status(200).json({
    enabled: config.enabled,
    sdkClientId: process.env.CAKTO_SDK_CLIENT_ID || '',
    hostedBaskets: Object.keys(config.hosted).filter(key => safeUrl(config.hosted[key])),
    directPlans: config.enabled && process.env.CAKTO_CLIENT_ID && process.env.CAKTO_CLIENT_SECRET
      ? plans.filter(plan => process.env[`CAKTO_ASSINATURA_OFFER_${plan.id.toUpperCase()}`]).map(plan => plan.id) : [],
  })
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'Método não permitido.' }) }
  if (!config.enabled) return res.status(503).json({ error: 'As inscrições ainda não estão abertas. Nenhuma cobrança foi feita.' })
  const { plano, extras = [], metodo, cliente, cardToken, fingerprint, antifraudRef, idempotencyKey } = req.body || {}
  if (!plans.some(plan => plan.id === plano) || !Array.isArray(extras) || new Set(extras).size !== extras.length || extras.some(id => !bumps.some(bump => bump.id === id && !bump.preview))) return res.status(400).json({ error: 'Seleção de plano ou extras inválida.' })
  if (!['pix', 'credit_card', 'pix_parcelado'].includes(metodo)) return res.status(400).json({ error: 'Forma de pagamento inválida.' })
  if (Object.keys(validateCustomer(cliente)).length) return res.status(400).json({ error: 'Confira seus dados antes de continuar.' })
  const basket = [plano, ...[...extras].sort()].join('+')
  const url = safeUrl(config.hosted[basket])
  // Hosted checkout owns the final quote, recurring authorization and Pagaleve eligibility.
  if (url) return res.status(200).json({ checkoutUrl: url })
  if (metodo === 'pix_parcelado' || extras.length) return res.status(503).json({ error: 'Esta combinação ainda não está disponível. Fale com nossa equipe.' })
  const offerId = process.env[`CAKTO_ASSINATURA_OFFER_${plano.toUpperCase()}`]
  if (!offerId || !process.env.CAKTO_CLIENT_ID || !process.env.CAKTO_CLIENT_SECRET) return res.status(503).json({ error: 'Pagamento temporariamente indisponível. Nenhuma cobrança foi feita.' })
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(idempotencyKey || '') || typeof fingerprint !== 'string' || fingerprint.length < 16 || fingerprint.length > 255) return res.status(400).json({ error: 'Sessão inválida. Recarregue a página.' })
  if (metodo === 'credit_card' && (typeof cardToken !== 'string' || !cardToken || typeof antifraudRef !== 'string' || !antifraudRef)) return res.status(400).json({ error: 'Não foi possível validar o cartão.' })
  try {
    const body = {
      paymentMethod: metodo,
      customer: { name: cliente.nome.trim(), email: cliente.email.trim(), phone: `55${cliente.telefone.replace(/\D/g, '')}`, docType: 'cpf', docNumber: cliente.cpf.replace(/\D/g, ''), fingerprint },
      items: [{ offerId, quantity: 1, offerType: 'main' }],
      ...(metodo === 'pix' ? { pixExpiresIn: 1800 } : { card: { token: cardToken }, installments: 1, antifraud_profiling_attempt_reference: antifraudRef }),
    }
    const response = await fetch('https://api.cakto.com.br/public_api/payments/', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}`, 'X-Idempotency-Key': idempotencyKey }, body: JSON.stringify(body), signal: AbortSignal.timeout(25000),
    })
    const data = await response.json()
    if (!response.ok) return res.status(response.status >= 500 ? 502 : 400).json({ error: 'Não foi possível concluir o pagamento. Confira os dados ou fale com nossa equipe.' })
    return res.status(201).json({ id: data.id, status: data.status, amount: data.amount, pix: data.pix ? { qrCode: data.pix.qrCode, expirationDate: data.pix.expirationDate } : undefined })
  } catch { return res.status(502).json({ error: 'Não recebemos a confirmação. Tente consultar novamente usando o mesmo pedido ou fale com nossa equipe.' }) }
}
