/**
 * /api/admin-alunos
 *
 * GET    ?secret=XXX            -> lista alunos (com as parcelas embutidas)
 * POST   ?secret=XXX            -> cria aluno + gera as parcelas automaticamente
 * PATCH  ?secret=XXX&id=UUID    -> edita dados do aluno
 * DELETE ?secret=XXX&id=UUID    -> remove aluno (parcelas caem em cascata)
 *
 * Auth: query param `secret` == env ADMIN_SECRET (ou DASHBOARD_SECRET).
 * Banco: Supabase REST com SERVICE_ROLE (nunca exposto no client).
 */

const json = (res, status, body) => res.status(status).json(body)

function sbConfig() {
  const url = String(process.env.SUPABASE_URL || '').trim().replace(/\s+/g, '').replace(/\/$/, '')
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  return { url, key }
}

function sbHeaders(key, extra = {}) {
  return {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Content-Type': 'application/json',
    ...extra,
  }
}

/** Vencimento da parcela N: mês do início + offset, no dia escolhido (limitado ao fim do mês). */
function vencimentoParcela(dataInicio, dia, offsetMeses) {
  const base = new Date(dataInicio + 'T00:00:00Z')
  const alvoMes = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + offsetMeses, 1))
  const ultimoDia = new Date(Date.UTC(alvoMes.getUTCFullYear(), alvoMes.getUTCMonth() + 1, 0)).getUTCDate()
  const diaFinal = Math.min(Math.max(1, dia), ultimoDia)
  return new Date(Date.UTC(alvoMes.getUTCFullYear(), alvoMes.getUTCMonth(), diaFinal))
    .toISOString().slice(0, 10)
}

/** Divide o total em N parcelas; a última absorve o arredondamento. */
function dividirParcelas(valorTotal, total) {
  const cents = Math.round(Number(valorTotal || 0) * 100)
  const n = Math.max(1, parseInt(total, 10) || 1)
  const base = Math.floor(cents / n)
  const valores = Array.from({ length: n }, () => base)
  valores[n - 1] = cents - base * (n - 1)
  return valores.map(c => c / 100)
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') return res.status(204).end()

  // ── auth ──
  const expected = String(process.env.ADMIN_SECRET || process.env.DASHBOARD_SECRET || '').trim()
  const provided = String((req.query && req.query.secret) || '').trim()
  if (!expected) return json(res, 500, { error: 'ADMIN_SECRET não configurado no servidor' })
  if (!provided || provided !== expected) return json(res, 401, { error: 'Não autorizado' })

  const { url, key } = sbConfig()
  if (!url || !key) return json(res, 500, { error: 'SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausente' })

  try {
    // ── LISTAR ──
    if (req.method === 'GET') {
      const r = await fetch(
        `${url}/rest/v1/alunos?select=*,pagamentos(*)&order=created_at.desc`,
        { headers: sbHeaders(key) }
      )
      const text = await r.text()
      if (!r.ok) return json(res, 502, { error: 'Supabase', details: text.slice(0, 400) })
      const rows = JSON.parse(text)
      // ordena as parcelas de cada aluno
      rows.forEach(a => Array.isArray(a.pagamentos) && a.pagamentos.sort((x, y) => x.numero - y.numero))
      return json(res, 200, { ok: true, rows })
    }

    // ── CRIAR ──
    if (req.method === 'POST') {
      const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})

      if (!b.nome || !String(b.nome).trim()) return json(res, 400, { error: 'nome é obrigatório' })
      if (!b.data_inicio) return json(res, 400, { error: 'data_inicio é obrigatória' })

      const totalParcelas = Math.max(1, parseInt(b.total_parcelas, 10) || 1)
      const diaVenc = Math.min(31, Math.max(1, parseInt(b.dia_vencimento, 10) || 10))

      const aluno = {
        nome: String(b.nome).trim(),
        contato: b.contato ? String(b.contato).trim() : null,
        produto: b.produto ? String(b.produto).trim() : null,
        data_inicio: b.data_inicio,
        meses_acesso: Math.max(1, parseInt(b.meses_acesso, 10) || 12),
        valor_total: Number(b.valor_total || 0),
        total_parcelas: totalParcelas,
        dia_vencimento: diaVenc,
        observacoes: b.observacoes ? String(b.observacoes).trim() : null,
      }

      const rIns = await fetch(`${url}/rest/v1/alunos`, {
        method: 'POST',
        headers: sbHeaders(key, { Prefer: 'return=representation' }),
        body: JSON.stringify(aluno),
      })
      const tIns = await rIns.text()
      if (!rIns.ok) return json(res, 502, { error: 'Erro ao criar aluno', details: tIns.slice(0, 400) })
      const criado = JSON.parse(tIns)[0]

      // gera as parcelas
      const valores = dividirParcelas(aluno.valor_total, totalParcelas)
      const parcelas = valores.map((valor, i) => ({
        aluno_id: criado.id,
        numero: i + 1,
        vencimento: vencimentoParcela(aluno.data_inicio, diaVenc, i),
        valor,
        pago: false,
      }))

      const rPag = await fetch(`${url}/rest/v1/pagamentos`, {
        method: 'POST',
        headers: sbHeaders(key, { Prefer: 'return=representation' }),
        body: JSON.stringify(parcelas),
      })
      const tPag = await rPag.text()
      if (!rPag.ok) {
        // rollback pra não deixar aluno sem parcelas
        await fetch(`${url}/rest/v1/alunos?id=eq.${criado.id}`, { method: 'DELETE', headers: sbHeaders(key) })
        return json(res, 502, { error: 'Erro ao gerar parcelas', details: tPag.slice(0, 400) })
      }

      return json(res, 200, { ok: true, aluno: { ...criado, pagamentos: JSON.parse(tPag) } })
    }

    // ── EDITAR ──
    if (req.method === 'PATCH') {
      const id = String((req.query && req.query.id) || '').trim()
      if (!id) return json(res, 400, { error: 'id é obrigatório' })
      const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})

      const patch = {}
      for (const campo of ['nome', 'contato', 'produto', 'data_inicio', 'observacoes']) {
        if (b[campo] !== undefined) patch[campo] = b[campo]
      }
      if (b.meses_acesso !== undefined) patch.meses_acesso = Math.max(1, parseInt(b.meses_acesso, 10) || 12)
      if (Object.keys(patch).length === 0) return json(res, 400, { error: 'nada para atualizar' })

      const r = await fetch(`${url}/rest/v1/alunos?id=eq.${id}`, {
        method: 'PATCH',
        headers: sbHeaders(key, { Prefer: 'return=representation' }),
        body: JSON.stringify(patch),
      })
      const t = await r.text()
      if (!r.ok) return json(res, 502, { error: 'Erro ao atualizar', details: t.slice(0, 400) })
      return json(res, 200, { ok: true, aluno: JSON.parse(t)[0] })
    }

    // ── REMOVER ──
    if (req.method === 'DELETE') {
      const id = String((req.query && req.query.id) || '').trim()
      if (!id) return json(res, 400, { error: 'id é obrigatório' })
      const r = await fetch(`${url}/rest/v1/alunos?id=eq.${id}`, { method: 'DELETE', headers: sbHeaders(key) })
      if (!r.ok) {
        const t = await r.text()
        return json(res, 502, { error: 'Erro ao remover', details: t.slice(0, 400) })
      }
      return json(res, 200, { ok: true })
    }

    return json(res, 405, { error: 'Método não permitido' })
  } catch (e) {
    return json(res, 500, { error: String(e && e.message ? e.message : e) })
  }
}
