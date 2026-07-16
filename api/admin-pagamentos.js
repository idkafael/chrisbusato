/**
 * /api/admin-pagamentos
 *
 * PATCH ?secret=XXX&id=UUID   body: { pago: true|false }
 *   -> marca/desmarca uma parcela como paga (grava pago_em)
 *
 * Auth: query param `secret` == env ADMIN_SECRET (ou DASHBOARD_SECRET).
 */

const json = (res, status, body) => res.status(status).json(body)

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'PATCH') return json(res, 405, { error: 'Método não permitido' })

  // ── auth ──
  const expected = String(process.env.ADMIN_SECRET || process.env.DASHBOARD_SECRET || '').trim()
  const provided = String((req.query && req.query.secret) || '').trim()
  if (!expected) return json(res, 500, { error: 'ADMIN_SECRET não configurado no servidor' })
  if (!provided || provided !== expected) return json(res, 401, { error: 'Não autorizado' })

  const url = String(process.env.SUPABASE_URL || '').trim().replace(/\s+/g, '').replace(/\/$/, '')
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  if (!url || !key) return json(res, 500, { error: 'SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausente' })

  const id = String((req.query && req.query.id) || '').trim()
  if (!id) return json(res, 400, { error: 'id é obrigatório' })

  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
  const pago = Boolean(b.pago)

  try {
    const r = await fetch(`${url}/rest/v1/pagamentos?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        apikey: key,
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ pago, pago_em: pago ? new Date().toISOString() : null }),
    })
    const t = await r.text()
    if (!r.ok) return json(res, 502, { error: 'Erro ao atualizar parcela', details: t.slice(0, 400) })
    return json(res, 200, { ok: true, pagamento: JSON.parse(t)[0] })
  } catch (e) {
    return json(res, 500, { error: String(e && e.message ? e.message : e) })
  }
}
