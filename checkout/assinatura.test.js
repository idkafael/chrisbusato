import test from 'node:test'
import assert from 'node:assert/strict'
import handler from '../api/assinatura.js'
import { validateCustomer, validCpf } from './catalog.js'

const customer = { nome: 'Pessoa Teste', email: 'teste@example.com', telefone: '11999999999', cpf: '52998224725' }
const base = { plano: 'mensal', metodo: 'pix', cliente: customer, fingerprint: 'session-test-000000000', idempotencyKey: 'test-idempotency-0000001' }
async function call(body, method = 'POST') {
  let status, result
  const res = { setHeader() {}, status(value) { status = value; return this }, json(value) { result = value; return this } }
  await handler({ method, body }, res)
  return { status, result }
}
test('validação rejeita CPF repetido, incorreto e cliente nulo', () => {
  assert.equal(validCpf('11111111111'), false)
  assert.equal(validCpf('52998224724'), false)
  assert.equal(validCpf(customer.cpf), true)
  assert.equal(Object.keys(validateCustomer(null)).length, 4)
})
test('pagamentos fechados sem ativação, e segredos não saem no GET', async () => {
  process.env.CAKTO_ASSINATURA_ENABLED = 'false'
  assert.equal((await call(base)).status, 503)
  const response = await call(null, 'GET')
  assert.equal(response.result.enabled, false)
  assert.equal('clientSecret' in response.result, false)
})
test('extras fictícios e método inválido nunca geram cobrança', async () => {
  process.env.CAKTO_ASSINATURA_ENABLED = 'true'
  assert.equal((await call({ ...base, extras: ['praticas'] })).status, 400)
  assert.equal((await call({ ...base, metodo: 'boleto' })).status, 400)
  assert.equal((await call({ ...base, cliente: null })).status, 400)
  assert.equal((await call({ ...base, metodo: 'pix_parcelado' })).status, 503)
})
test('links hospedados limitados ao domínio oficial e à cesta exata', async () => {
  process.env.CAKTO_ASSINATURA_CHECKOUTS = JSON.stringify({ mensal: 'https://pay.cakto.com.br/test-only' })
  assert.equal((await call({ ...base, metodo: 'pix_parcelado' })).result.checkoutUrl, 'https://pay.cakto.com.br/test-only')
  process.env.CAKTO_ASSINATURA_CHECKOUTS = JSON.stringify({ mensal: 'https://example.com' })
  assert.equal((await call({ ...base, metodo: 'pix_parcelado' })).status, 503)
  process.env.CAKTO_ASSINATURA_CHECKOUTS = '{}'
})
test('API preserva idempotência, resolve oferta no servidor e normaliza Pix/cartão', async () => {
  process.env.CAKTO_CLIENT_ID = 'test-client'
  process.env.CAKTO_CLIENT_SECRET = 'test-secret'
  process.env.CAKTO_ASSINATURA_OFFER_MENSAL = 'server-offer'
  const oldFetch = globalThis.fetch
  const sent = []
  globalThis.fetch = async (url, init) => {
    if (url.endsWith('/token/')) return { ok: true, json: async () => ({ access_token: 'fake-token', expires_in: 3600 }) }
    sent.push(init)
    return { ok: true, json: async () => ({ id: 'order-test', status: 'waiting_payment', pix: { qrCode: 'test-code', expirationDate: '2026-12-01' } }) }
  }
  try {
    const first = await call({ ...base, offerId: 'tampered', amount: 1 })
    await call(base)
    assert.equal(first.result.pix.expirationDate, '2026-12-01')
    assert.equal(sent[0].headers['X-Idempotency-Key'], sent[1].headers['X-Idempotency-Key'])
    const pix = JSON.parse(sent[0].body)
    assert.equal(pix.items[0].offerId, 'server-offer')
    assert.equal(pix.customer.phone, '5511999999999')
    assert.equal('amount' in pix, false)
    assert.equal((await call({ ...base, metodo: 'credit_card' })).status, 400)
    await call({ ...base, metodo: 'credit_card', cardToken: 'test-token', antifraudRef: 'test-profile' })
    const card = JSON.parse(sent.at(-1).body)
    assert.equal(card.antifraud_profiling_attempt_reference, 'test-profile')
    assert.deepEqual(card.card, { token: 'test-token' })
    globalThis.fetch = async () => { throw new Error('private upstream detail') }
    const failure = await call(base)
    assert.equal(failure.status, 502)
    assert.equal(JSON.stringify(failure).includes('private upstream detail'), false)
  } finally { globalThis.fetch = oldFetch }
})
