import { useState, useEffect, useCallback, useMemo } from 'react'

// ─── Tokens ───────────────────────────────────────────────────────────────────

const C = {
  cream: '#EDEAE3', creamDark: '#E4E0D7', creamCard: '#F5F3EF',
  sage: '#8A9E8C', sageDark: '#6B7F6D', sageLight: '#C4D0C5', sagePale: '#E8EDEA',
  brown: '#3D3530', brownMid: '#6B5F58', brownLight: '#9C8E87',
  white: '#FAFAF8',
  red: '#E8534A', redPale: '#FBEAE9',
  amber: '#C9922E', amberPale: '#FAF1DF',
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.cream}; }
  input, select, textarea, button { font-family: 'DM Sans', sans-serif; }
`

const F = "'DM Sans', sans-serif"
const S = "'Playfair Display', serif"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const brl = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0))

const hojeISO = () => new Date().toISOString().slice(0, 10)

/** date-only parse (evita fuso bagunçar o dia) */
const d = iso => new Date(String(iso).slice(0, 10) + 'T00:00:00')

function addMeses(date, n) {
  const alvo = new Date(date.getFullYear(), date.getMonth() + n, 1)
  const ultimo = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate()
  return new Date(alvo.getFullYear(), alvo.getMonth(), Math.min(date.getDate(), ultimo))
}

/** "6/12 meses" + alerta de expiração */
function calcAcesso(aluno) {
  const inicio = d(aluno.data_inicio)
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  let meses = (hoje.getFullYear() - inicio.getFullYear()) * 12 + (hoje.getMonth() - inicio.getMonth())
  if (hoje.getDate() < inicio.getDate()) meses -= 1
  const total = aluno.meses_acesso || 12
  const fim = addMeses(inicio, total)
  const diasRestantes = Math.round((fim - hoje) / 86400000)
  return {
    decorridos: Math.min(Math.max(0, meses), total),
    total,
    fim,
    diasRestantes,
    expirado: diasRestantes < 0,
    expirandoBreve: diasRestantes >= 0 && diasRestantes <= 30,
  }
}

const calcParcelas = aluno => {
  const ps = aluno.pagamentos || []
  return { pagas: ps.filter(p => p.pago).length, total: ps.length || aluno.total_parcelas || 0 }
}

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

// ─── Página ───────────────────────────────────────────────────────────────────

export default function AdminLP() {
  const urlSecret = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('secret') || ''
    : ''

  const [secret, setSecret] = useState(urlSecret)
  const [input, setInput] = useState('')
  const [alunos, setAlunos] = useState([])
  const [estado, setEstado] = useState(urlSecret ? 'carregando' : 'bloqueado') // bloqueado|carregando|ok|erro
  const [erro, setErro] = useState('')
  const [formAberto, setFormAberto] = useState(false)
  const [expandido, setExpandido] = useState(null)
  const [ref, setRef] = useState(() => { const h = new Date(); return { ano: h.getFullYear(), mes: h.getMonth() } })

  const carregar = useCallback(async (s) => {
    setEstado('carregando'); setErro('')
    try {
      const r = await fetch(`/api/admin-alunos?secret=${encodeURIComponent(s)}`)
      const j = await r.json()
      if (!r.ok) { setErro(j.error || 'Falha ao carregar'); setEstado(r.status === 401 ? 'bloqueado' : 'erro'); return }
      setAlunos(j.rows || []); setEstado('ok')
    } catch (e) { setErro(String(e.message || e)); setEstado('erro') }
  }, [])

  useEffect(() => { if (secret) carregar(secret) }, [secret, carregar])

  const togglePago = async (pagamento) => {
    // otimista
    setAlunos(prev => prev.map(a => ({
      ...a,
      pagamentos: (a.pagamentos || []).map(p => p.id === pagamento.id ? { ...p, pago: !p.pago } : p),
    })))
    try {
      const r = await fetch(`/api/admin-pagamentos?secret=${encodeURIComponent(secret)}&id=${pagamento.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pago: !pagamento.pago }),
      })
      if (!r.ok) throw new Error((await r.json()).error || 'Falha')
    } catch (e) {
      alert('Não consegui salvar: ' + e.message)
      carregar(secret) // reverte
    }
  }

  const removerAluno = async (aluno) => {
    if (!confirm(`Remover ${aluno.nome} e todas as parcelas dele? Isso não dá pra desfazer.`)) return
    try {
      const r = await fetch(`/api/admin-alunos?secret=${encodeURIComponent(secret)}&id=${aluno.id}`, { method: 'DELETE' })
      if (!r.ok) throw new Error((await r.json()).error || 'Falha')
      setAlunos(prev => prev.filter(a => a.id !== aluno.id))
    } catch (e) { alert('Erro ao remover: ' + e.message) }
  }

  // ── métricas ──
  const m = useMemo(() => {
    const todas = alunos.flatMap(a => (a.pagamentos || []).map(p => ({ ...p, aluno: a })))
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
    const pendentes = todas.filter(p => !p.pago)
    const doMes = pendentes.filter(p => { const v = d(p.vencimento); return v.getFullYear() === ref.ano && v.getMonth() === ref.mes })
    const soma = arr => arr.reduce((s, p) => s + Number(p.valor || 0), 0)
    return {
      todas,
      aReceber: soma(pendentes),
      recebido: soma(todas.filter(p => p.pago)),
      doMes: soma(doMes),
      atrasadas: pendentes.filter(p => d(p.vencimento) < hoje),
      alertas: alunos.map(a => ({ a, ac: calcAcesso(a) })).filter(x => x.ac.expirado || x.ac.expirandoBreve),
    }
  }, [alunos, ref])

  // ── gate ──
  if (estado === 'bloqueado') {
    return (
      <>
        <style>{globalStyles}</style>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: C.cream }}>
          <div style={{ background: C.white, border: `1px solid ${C.sageLight}`, borderRadius: 20, padding: '40px 36px', maxWidth: 400, width: '100%', boxShadow: '0 16px 50px rgba(61,53,48,0.10)' }}>
            <div style={{ fontFamily: S, fontSize: 26, color: C.brown, marginBottom: 8 }}>Área administrativa</div>
            <p style={{ fontFamily: F, fontSize: 14, color: C.brownMid, lineHeight: 1.6, marginBottom: 24 }}>
              Acesso restrito. Informe a chave de acesso para continuar.
            </p>
            {erro && <div style={{ background: C.redPale, color: C.red, fontFamily: F, fontSize: 13, padding: '10px 14px', borderRadius: 10, marginBottom: 16 }}>{erro}</div>}
            <form onSubmit={e => { e.preventDefault(); if (input.trim()) setSecret(input.trim()) }}>
              <input
                type="password" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Chave de acesso" autoFocus
                style={{ width: '100%', padding: '13px 16px', borderRadius: 10, border: `1px solid ${C.sageLight}`, fontSize: 15, color: C.brown, background: C.creamCard, marginBottom: 14, outline: 'none' }}
              />
              <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 100, border: 'none', background: C.sage, color: C.white, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Entrar
              </button>
            </form>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: '100vh', background: C.cream, padding: '28px 20px 80px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>

          {/* header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: F, fontWeight: 600, fontSize: 11, letterSpacing: '2px', color: C.sage, textTransform: 'uppercase', marginBottom: 6 }}>Chris Busato · Admin</div>
              <h1 style={{ fontFamily: S, fontSize: 30, color: C.brown, letterSpacing: '-0.5px' }}>Alunos e pagamentos</h1>
            </div>
            <button onClick={() => setFormAberto(v => !v)} style={{
              padding: '13px 24px', borderRadius: 100, border: 'none',
              background: formAberto ? C.brownLight : C.sage, color: C.white,
              fontSize: 14.5, fontWeight: 700, cursor: 'pointer',
            }}>{formAberto ? 'Cancelar' : '+ Novo aluno'}</button>
          </div>

          {estado === 'erro' && (
            <div style={{ background: C.redPale, color: C.red, fontFamily: F, fontSize: 14, padding: '14px 18px', borderRadius: 12, marginBottom: 20 }}>
              {erro} <button onClick={() => carregar(secret)} style={{ marginLeft: 10, background: 'none', border: 'none', color: C.red, textDecoration: 'underline', cursor: 'pointer' }}>tentar de novo</button>
            </div>
          )}

          {formAberto && <FormAluno secret={secret} onCriado={a => { setAlunos(p => [a, ...p]); setFormAberto(false) }} />}

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
            <Kpi label="A receber" valor={brl(m.aReceber)} cor={C.brown} sub={`${m.todas.filter(p => !p.pago).length} parcelas em aberto`} />
            <Kpi label={`Vence em ${MESES[ref.mes]}`} valor={brl(m.doMes)} cor={C.sageDark} sub="parcelas do mês exibido" />
            <Kpi label="Já recebido" valor={brl(m.recebido)} cor={C.sage} sub={`${m.todas.filter(p => p.pago).length} parcelas pagas`} />
            <Kpi label="Atrasadas" valor={String(m.atrasadas.length)} cor={m.atrasadas.length ? C.red : C.brownLight} sub={m.atrasadas.length ? brl(m.atrasadas.reduce((s, p) => s + Number(p.valor || 0), 0)) : 'tudo em dia'} />
          </div>

          {/* alertas */}
          {m.alertas.length > 0 && (
            <div style={{ background: C.amberPale, border: `1px solid ${C.amber}44`, borderRadius: 16, padding: '18px 20px', marginBottom: 24 }}>
              <div style={{ fontFamily: F, fontWeight: 700, fontSize: 12, letterSpacing: '1px', color: C.amber, textTransform: 'uppercase', marginBottom: 12 }}>
                ⚠ Acessos expirando
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {m.alertas.map(({ a, ac }) => (
                  <div key={a.id} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline', fontFamily: F, fontSize: 14, color: C.brown }}>
                    <strong style={{ fontWeight: 600 }}>{a.nome}</strong>
                    <span style={{ color: C.brownMid }}>
                      {ac.expirado
                        ? `expirou há ${Math.abs(ac.diasRestantes)} dia(s) (${ac.fim.toLocaleDateString('pt-BR')})`
                        : `expira em ${ac.diasRestantes} dia(s) — ${ac.fim.toLocaleDateString('pt-BR')}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* agenda */}
          <Agenda ref_={ref} setRef={setRef} pagamentos={m.todas} />

          {/* lista */}
          <div style={{ marginTop: 28 }}>
            <div style={{ fontFamily: F, fontWeight: 600, fontSize: 11, letterSpacing: '2px', color: C.sage, textTransform: 'uppercase', marginBottom: 14 }}>
              Alunos ({alunos.length})
            </div>

            {estado === 'carregando' && <div style={{ fontFamily: F, color: C.brownLight, padding: 30, textAlign: 'center' }}>Carregando…</div>}

            {estado === 'ok' && alunos.length === 0 && (
              <div style={{ background: C.white, border: `1px dashed ${C.sageLight}`, borderRadius: 16, padding: 40, textAlign: 'center', fontFamily: F, color: C.brownLight }}>
                Nenhum aluno ainda. Clique em <strong>+ Novo aluno</strong> para começar.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {alunos.map(a => (
                <AlunoCard
                  key={a.id} aluno={a}
                  aberto={expandido === a.id}
                  onToggle={() => setExpandido(expandido === a.id ? null : a.id)}
                  onTogglePago={togglePago}
                  onRemover={() => removerAluno(a)}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

// ─── KPI ──────────────────────────────────────────────────────────────────────

function Kpi({ label, valor, sub, cor }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.sageLight}`, borderRadius: 16, padding: '18px 20px' }}>
      <div style={{ fontFamily: F, fontWeight: 600, fontSize: 10.5, letterSpacing: '1.2px', color: C.brownLight, textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: cor, letterSpacing: '-0.5px', lineHeight: 1.1 }}>{valor}</div>
      {sub && <div style={{ fontFamily: F, fontSize: 12, color: C.brownLight, marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

// ─── Agenda (calendário do mês) ───────────────────────────────────────────────

/** valor curto pra caber na célula: R$ 59.923 */
const brlCurto = v => 'R$ ' + Number(v || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })

const primeiroNome = n => String(n || '').trim().split(/\s+/)[0] || '—'

function useIsMobile(bp = 900) {
  const [m, setM] = useState(typeof window !== 'undefined' ? window.innerWidth < bp : false)
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [bp])
  return m
}

function Agenda({ ref_, setRef, pagamentos }) {
  const mobile = useIsMobile()
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  const primeiro = new Date(ref_.ano, ref_.mes, 1)
  const diasNoMes = new Date(ref_.ano, ref_.mes + 1, 0).getDate()
  const offset = primeiro.getDay()

  const [hover, setHover] = useState(null) // { dia, entradas, rect }

  /** dia -> [{ aluno, nome, valor, pago, atrasado, parcelas[] }] — agrupa por aluno no mesmo dia */
  const porDia = useMemo(() => {
    const mapa = {}
    pagamentos.forEach(p => {
      const v = d(p.vencimento)
      if (v.getFullYear() !== ref_.ano || v.getMonth() !== ref_.mes) return
      const dia = v.getDate()
      const chave = p.aluno?.id || p.aluno?.nome || '—'
      mapa[dia] = mapa[dia] || {}
      const e = mapa[dia][chave] || {
        aluno: p.aluno, nome: p.aluno?.nome || '—',
        valor: 0, pago: true, atrasado: false, parcelas: [],
      }
      e.valor += Number(p.valor || 0)
      e.parcelas.push(p)
      if (!p.pago) { e.pago = false; if (v < hoje) e.atrasado = true }
      mapa[dia][chave] = e
    })
    const out = {}
    Object.entries(mapa).forEach(([dia, alunos]) => {
      out[dia] = Object.values(alunos).sort((a, b) => b.valor - a.valor)
    })
    return out
  }, [pagamentos, ref_]) // eslint-disable-line react-hooks/exhaustive-deps

  const navegar = n => setRef(r => {
    const nd = new Date(r.ano, r.mes + n, 1)
    return { ano: nd.getFullYear(), mes: nd.getMonth() }
  })

  const corDe = e => e.pago ? C.sage : e.atrasado ? C.red : C.amber
  const fundoDe = e => e.pago ? C.sagePale : e.atrasado ? C.redPale : C.amberPale

  const cabecalho = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: 10.5, letterSpacing: '1.2px', color: C.brownLight, textTransform: 'uppercase', marginBottom: 4 }}>Agenda de pagamentos</div>
        <div style={{ fontFamily: S, fontSize: 20, color: C.brown }}>{MESES[ref_.mes]} {ref_.ano}</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <BotaoNav onClick={() => navegar(-1)}>←</BotaoNav>
        <button onClick={() => { const h = new Date(); setRef({ ano: h.getFullYear(), mes: h.getMonth() }) }}
          style={{ padding: '7px 14px', borderRadius: 100, border: `1px solid ${C.sageLight}`, background: C.creamCard, fontFamily: F, fontSize: 12.5, fontWeight: 600, color: C.brownMid, cursor: 'pointer' }}>
          Hoje
        </button>
        <BotaoNav onClick={() => navegar(1)}>→</BotaoNav>
      </div>
    </div>
  )

  const legenda = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 16 }}>
      <Legenda cor={C.sage} label="Pago" />
      <Legenda cor={C.amber} label="A vencer" />
      <Legenda cor={C.red} label="Atrasado" />
    </div>
  )

  // ── MOBILE: lista (nome não cabe numa grade de 7 colunas) ──
  if (mobile) {
    const dias = Object.keys(porDia).map(Number).sort((a, b) => a - b)
    return (
      <div style={{ background: C.white, border: `1px solid ${C.sageLight}`, borderRadius: 18, padding: '20px 18px 22px' }}>
        {cabecalho}
        {dias.length === 0 && (
          <div style={{ fontFamily: F, fontSize: 13.5, color: C.brownLight, padding: '22px 0', textAlign: 'center' }}>
            Nenhum pagamento em {MESES[ref_.mes]}.
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dias.map(dia => {
            const entradas = porDia[dia]
            const data = new Date(ref_.ano, ref_.mes, dia)
            const ehHoje = data.getTime() === hoje.getTime()
            const total = entradas.reduce((s, e) => s + e.valor, 0)
            return (
              <div key={dia} style={{
                border: `1px solid ${ehHoje ? C.sageDark : C.creamDark}`,
                borderRadius: 12, padding: '12px 14px', background: C.creamCard,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13.5, color: ehHoje ? C.sageDark : C.brown }}>
                    Dia {dia}{ehHoje ? ' · hoje' : ''}
                  </div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: C.brownMid }}>{brlCurto(total)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {entradas.map((e, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: fundoDe(e), border: `1px solid ${corDe(e)}33`,
                      borderRadius: 8, padding: '7px 10px',
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: corDe(e), flexShrink: 0 }} />
                      <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.brown, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {e.nome}{e.parcelas.length > 1 ? ` (${e.parcelas.length}×)` : ''}
                      </span>
                      <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 600, color: corDe(e) }}>{brlCurto(e.valor)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        {legenda}
      </div>
    )
  }

  // ── DESKTOP: grade com os nomes ──
  const celulas = [...Array(offset).fill(null), ...Array.from({ length: diasNoMes }, (_, i) => i + 1)]
  const MAX_CHIPS = 3

  return (
    <div style={{ background: C.white, border: `1px solid ${C.sageLight}`, borderRadius: 18, padding: '20px 20px 24px' }}>
      {cabecalho}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {SEMANA.map((s, i) => (
          <div key={i} style={{ textAlign: 'center', fontFamily: F, fontWeight: 700, fontSize: 10, color: C.brownLight, padding: '4px 0' }}>{s}</div>
        ))}
        {celulas.map((dia, i) => {
          if (!dia) return <div key={`v${i}`} />
          const entradas = porDia[dia] || []
          const data = new Date(ref_.ano, ref_.mes, dia)
          const ehHoje = data.getTime() === hoje.getTime()
          const vazio = entradas.length === 0
          const total = entradas.reduce((s, e) => s + e.valor, 0)
          const visiveis = entradas.slice(0, MAX_CHIPS)
          const resto = entradas.length - visiveis.length

          const ativo = hover?.dia === dia

          return (
            <div key={dia}
              onMouseEnter={e => !vazio && setHover({ dia, entradas, rect: e.currentTarget.getBoundingClientRect() })}
              onMouseLeave={() => setHover(h => (h?.dia === dia ? null : h))}
              style={{
                minHeight: 104, borderRadius: 12, padding: '7px 7px 8px',
                background: vazio ? C.creamCard : C.white,
                border: `1.5px solid ${ehHoje ? C.sageDark : vazio ? 'transparent' : C.sageLight}`,
                display: 'flex', flexDirection: 'column', gap: 5,
                cursor: vazio ? 'default' : 'pointer',
                boxShadow: ativo ? '0 10px 26px rgba(61,53,48,0.16)' : 'none',
                transform: ativo ? 'translateY(-2px)' : 'none',
                transition: 'box-shadow 0.18s ease, transform 0.18s ease',
              }}>
              {/* topo: dia + total */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 4 }}>
                <span style={{
                  fontFamily: F, fontSize: 11.5, fontWeight: ehHoje ? 800 : 600,
                  color: ehHoje ? C.sageDark : C.brownMid,
                  ...(ehHoje ? { background: C.sagePale, borderRadius: 6, padding: '1px 6px' } : {}),
                }}>{dia}</span>
                {!vazio && (
                  <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: C.brownLight, whiteSpace: 'nowrap' }}>
                    {brlCurto(total)}
                  </span>
                )}
              </div>

              {/* nomes */}
              {!vazio && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {visiveis.map((e, k) => (
                    <div key={k} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: fundoDe(e), borderRadius: 6,
                      padding: '3px 6px', minWidth: 0,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: corDe(e), flexShrink: 0 }} />
                      <span style={{
                        fontFamily: F, fontSize: 10.5, fontWeight: 600, color: C.brown,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{primeiroNome(e.nome)}</span>
                    </div>
                  ))}
                  {resto > 0 && (
                    <div style={{ fontFamily: F, fontSize: 9.5, fontWeight: 600, color: C.brownLight, paddingLeft: 6 }}>
                      +{resto} {resto === 1 ? 'outro' : 'outros'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {legenda}

      {hover && <PopoverDia dia={hover.dia} entradas={hover.entradas} rect={hover.rect} mes={ref_.mes} ano={ref_.ano} />}
    </div>
  )
}

// ─── Mini-tela ao passar o mouse num dia ──────────────────────────────────────

function PopoverDia({ dia, entradas, rect, mes, ano }) {
  const W = 300
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const left = Math.min(Math.max(10, rect.left), vw - W - 10)
  const abrirPraCima = rect.top > vh / 2
  const pos = abrirPraCima ? { bottom: vh - rect.top + 8 } : { top: rect.bottom + 8 }
  const total = entradas.reduce((s, e) => s + e.valor, 0)

  return (
    <div style={{
      position: 'fixed', left, width: W, ...pos, zIndex: 60,
      background: C.white, border: `1px solid ${C.sageLight}`, borderRadius: 14,
      boxShadow: '0 18px 44px rgba(61,53,48,0.22)',
      padding: '14px 15px', pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.creamDark}` }}>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: C.brown }}>
          {dia} de {MESES[mes]} {ano}
        </span>
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: C.brownMid }}>{brl(total)}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {entradas.map((e, i) => {
          const ac = e.aluno ? calcAcesso(e.aluno) : null
          const cor = e.pago ? C.sage : e.atrasado ? C.red : C.amber
          const corAcesso = !ac ? C.brownLight : ac.expirado ? C.red : ac.expirandoBreve ? C.amber : C.sage

          return (
            <div key={i} style={{ borderTop: i > 0 ? `1px solid ${C.creamDark}` : 'none', paddingTop: i > 0 ? 12 : 0 }}>
              {/* nome + status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: cor, flexShrink: 0 }} />
                <span style={{ fontFamily: S, fontSize: 16, color: C.brown, lineHeight: 1.2 }}>{e.nome}</span>
              </div>

              {(e.aluno?.produto || e.aluno?.contato) && (
                <div style={{ fontFamily: F, fontSize: 11.5, color: C.brownLight, marginBottom: 8, paddingLeft: 14 }}>
                  {[e.aluno?.produto, e.aluno?.contato].filter(Boolean).join(' · ')}
                </div>
              )}

              {/* acesso */}
              {ac && (
                <div style={{ paddingLeft: 14, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F, fontSize: 11.5, marginBottom: 4 }}>
                    <span style={{ color: C.brownLight }}>Acesso</span>
                    <span style={{ color: corAcesso, fontWeight: 700 }}>{ac.decorridos}/{ac.total} meses</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 100, background: C.creamDark, overflow: 'hidden' }}>
                    <div style={{ width: `${ac.total ? Math.round((ac.decorridos / ac.total) * 100) : 0}%`, height: '100%', background: corAcesso }} />
                  </div>
                  <div style={{ fontFamily: F, fontSize: 10.5, color: C.brownLight, marginTop: 4 }}>
                    {ac.expirado
                      ? `expirou em ${ac.fim.toLocaleDateString('pt-BR')}`
                      : `expira em ${ac.fim.toLocaleDateString('pt-BR')} · ${ac.diasRestantes} dia(s)`}
                  </div>
                </div>
              )}

              {/* parcelas deste dia */}
              <div style={{ paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {e.parcelas.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F, fontSize: 11.5 }}>
                    <span style={{ color: C.brownMid }}>
                      Parcela {p.numero}/{e.aluno?.total_parcelas ?? '—'}
                    </span>
                    <span style={{ fontWeight: 700, color: p.pago ? C.sage : e.atrasado ? C.red : C.amber }}>
                      {brl(p.valor)} · {p.pago ? 'pago' : e.atrasado ? 'atrasado' : 'a vencer'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const BotaoNav = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    width: 32, height: 32, borderRadius: '50%', border: `1px solid ${C.sageLight}`,
    background: C.creamCard, color: C.brownMid, cursor: 'pointer', fontSize: 14,
  }}>{children}</button>
)

const Legenda = ({ cor, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <span style={{ width: 12, height: 12, borderRadius: 4, background: cor, border: `1px solid ${C.sageLight}` }} />
    <span style={{ fontFamily: F, fontSize: 11.5, color: C.brownLight }}>{label}</span>
  </div>
)

// ─── Card do aluno ────────────────────────────────────────────────────────────

function AlunoCard({ aluno, aberto, onToggle, onTogglePago, onRemover }) {
  const ac = calcAcesso(aluno)
  const pc = calcParcelas(aluno)
  const pct = ac.total ? Math.round((ac.decorridos / ac.total) * 100) : 0

  // pago à vista = parcela única e já quitada
  const aVista = pc.total === 1 && pc.pagas === 1

  const corStatus = ac.expirado ? C.red : ac.expirandoBreve ? C.amber : C.sage

  return (
    <div style={{ background: C.white, border: `1px solid ${ac.expirado ? `${C.red}55` : C.sageLight}`, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>

        {/* nome */}
        <div style={{ flex: '1 1 200px', minWidth: 0 }}>
          <div style={{ fontFamily: S, fontSize: 19, color: C.brown, marginBottom: 3 }}>{aluno.nome}</div>
          <div style={{ fontFamily: F, fontSize: 12.5, color: C.brownLight }}>
            {[aluno.produto, aluno.contato].filter(Boolean).join(' · ') || '—'}
          </div>
        </div>

        {/* acesso */}
        <div style={{ flex: '0 0 auto', minWidth: 140 }}>
          <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: C.brownLight, textTransform: 'uppercase', marginBottom: 5 }}>Acesso</div>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: corStatus, marginBottom: 5 }}>
            {ac.decorridos}/{ac.total} meses
          </div>
          <div style={{ height: 5, borderRadius: 100, background: C.creamDark, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: corStatus, borderRadius: 100 }} />
          </div>
        </div>

        {/* parcelas */}
        <div style={{ flex: '0 0 auto', minWidth: 110 }}>
          <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: C.brownLight, textTransform: 'uppercase', marginBottom: 5 }}>
            {aVista ? 'Pagamento' : 'Parcelas'}
          </div>
          {aVista ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: C.sagePale, borderRadius: 100, padding: '3px 10px',
              fontFamily: F, fontSize: 12, fontWeight: 700, color: C.sageDark,
            }}>✓ à vista</div>
          ) : (
            <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: pc.pagas === pc.total ? C.sage : C.brown }}>
              {pc.pagas}/{pc.total}
            </div>
          )}
          <div style={{ fontFamily: F, fontSize: 11.5, color: C.brownLight, marginTop: 3 }}>{brl(aluno.valor_total)} total</div>
        </div>

        {/* ações */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onToggle} style={{
            padding: '9px 16px', borderRadius: 100, border: `1px solid ${C.sage}`,
            background: aberto ? C.sage : 'transparent', color: aberto ? C.white : C.sageDark,
            fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{aberto ? 'Fechar' : 'Parcelas'}</button>
          <button onClick={onRemover} title="Remover aluno" style={{
            padding: '9px 12px', borderRadius: 100, border: `1px solid ${C.creamDark}`,
            background: 'transparent', color: C.brownLight, fontSize: 13, cursor: 'pointer',
          }}>✕</button>
        </div>
      </div>

      {/* parcelas */}
      {aberto && (
        <div style={{ borderTop: `1px solid ${C.creamDark}`, background: C.creamCard, padding: '14px 20px 18px' }}>
          <div style={{ fontFamily: F, fontSize: 11.5, color: C.brownLight, marginBottom: 12 }}>
            Início {d(aluno.data_inicio).toLocaleDateString('pt-BR')} · expira {ac.fim.toLocaleDateString('pt-BR')} · vencimento todo dia {aluno.dia_vencimento}
            {aluno.observacoes ? ` · ${aluno.observacoes}` : ''}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
            {(aluno.pagamentos || []).map(p => {
              const venc = d(p.vencimento)
              const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
              const atrasada = !p.pago && venc < hoje
              return (
                <label key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                  background: p.pago ? C.sagePale : atrasada ? C.redPale : C.white,
                  border: `1px solid ${p.pago ? C.sageLight : atrasada ? `${C.red}44` : C.creamDark}`,
                  borderRadius: 10, padding: '10px 12px',
                }}>
                  <input type="checkbox" checked={!!p.pago} onChange={() => onTogglePago(p)}
                    style={{ width: 17, height: 17, accentColor: C.sageDark, cursor: 'pointer', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.brown }}>
                      {p.numero}ª · {brl(p.valor)}
                    </div>
                    <div style={{ fontFamily: F, fontSize: 11, color: atrasada ? C.red : C.brownLight }}>
                      {venc.toLocaleDateString('pt-BR')}{p.pago ? ' · pago' : atrasada ? ' · atrasada' : ''}
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Form novo aluno ──────────────────────────────────────────────────────────

function FormAluno({ secret, onCriado }) {
  const [f, setF] = useState({
    nome: '', contato: '', produto: 'Programa Online',
    data_inicio: hojeISO(), meses_acesso: 12,
    valor_total: '', total_parcelas: 1, dia_vencimento: 10, observacoes: '',
    pago_a_vista: false,
  })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  const parcelaAprox = useMemo(() => {
    const t = Number(f.valor_total || 0), n = Math.max(1, parseInt(f.total_parcelas, 10) || 1)
    return t > 0 ? brl(t / n) : null
  }, [f.valor_total, f.total_parcelas])

  const enviar = async e => {
    e.preventDefault(); setErro(''); setSalvando(true)
    try {
      const r = await fetch(`/api/admin-alunos?secret=${encodeURIComponent(secret)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, valor_total: Number(f.valor_total || 0) }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Falha ao salvar')
      onCriado(j.aluno)
    } catch (e) { setErro(String(e.message || e)) } finally { setSalvando(false) }
  }

  const campo = { width: '100%', padding: '11px 13px', borderRadius: 9, border: `1px solid ${C.sageLight}`, fontSize: 14, color: C.brown, background: C.white, outline: 'none' }
  const rotulo = { display: 'block', fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', color: C.brownLight, textTransform: 'uppercase', marginBottom: 6 }

  return (
    <form onSubmit={enviar} style={{ background: C.white, border: `1px solid ${C.sageLight}`, borderRadius: 18, padding: '24px 22px', marginBottom: 24 }}>
      <div style={{ fontFamily: S, fontSize: 20, color: C.brown, marginBottom: 18 }}>Novo aluno</div>

      {erro && <div style={{ background: C.redPale, color: C.red, fontFamily: F, fontSize: 13, padding: '10px 14px', borderRadius: 10, marginBottom: 16 }}>{erro}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 16 }}>
        <div><label style={rotulo}>Nome *</label><input required value={f.nome} onChange={e => set('nome', e.target.value)} style={campo} placeholder="Ex.: Caio" /></div>
        <div><label style={rotulo}>Contato</label><input value={f.contato} onChange={e => set('contato', e.target.value)} style={campo} placeholder="WhatsApp / e-mail" /></div>
        <div><label style={rotulo}>Produto</label><input value={f.produto} onChange={e => set('produto', e.target.value)} style={campo} /></div>

        <div><label style={rotulo}>Início do acesso *</label><input required type="date" value={f.data_inicio} onChange={e => set('data_inicio', e.target.value)} style={campo} /></div>
        <div><label style={rotulo}>Meses de acesso</label><input type="number" min="1" value={f.meses_acesso} onChange={e => set('meses_acesso', e.target.value)} style={campo} /></div>
        <div><label style={rotulo}>Valor total (R$)</label><input type="number" step="0.01" min="0" value={f.valor_total} onChange={e => set('valor_total', e.target.value)} style={campo} placeholder="0,00" /></div>
      </div>

      {/* pago à vista */}
      <label style={{
        display: 'flex', alignItems: 'flex-start', gap: 11, cursor: 'pointer',
        background: f.pago_a_vista ? C.sagePale : C.creamCard,
        border: `1px solid ${f.pago_a_vista ? C.sage : C.creamDark}`,
        borderRadius: 12, padding: '13px 15px', marginBottom: 16,
        transition: 'background 0.15s ease, border-color 0.15s ease',
      }}>
        <input type="checkbox" checked={f.pago_a_vista} onChange={e => set('pago_a_vista', e.target.checked)}
          style={{ width: 17, height: 17, accentColor: C.sageDark, cursor: 'pointer', marginTop: 1, flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: F, fontSize: 13.5, fontWeight: 700, color: C.brown, marginBottom: 2 }}>
            Já pago à vista — só controle de acesso
          </div>
          <div style={{ fontFamily: F, fontSize: 12, color: C.brownMid, lineHeight: 1.5 }}>
            Para quem pagou tudo de uma vez (ex.: cartão à vista). Não gera parcelas a cobrar — o valor já entra como recebido e você só acompanha o tempo de acesso.
          </div>
        </div>
      </label>

      {!f.pago_a_vista && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={rotulo}>Nº de parcelas</label>
            <input type="number" min="1" value={f.total_parcelas} onChange={e => set('total_parcelas', e.target.value)} style={campo} />
            {parcelaAprox && <div style={{ fontFamily: F, fontSize: 11.5, color: C.sageDark, marginTop: 5 }}>≈ {parcelaAprox} por parcela</div>}
          </div>
          <div><label style={rotulo}>Dia do vencimento</label><input type="number" min="1" max="31" value={f.dia_vencimento} onChange={e => set('dia_vencimento', e.target.value)} style={campo} /></div>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={rotulo}>Observações</label>
        <input value={f.observacoes} onChange={e => set('observacoes', e.target.value)} style={campo} />
      </div>

      <button type="submit" disabled={salvando} style={{
        padding: '13px 30px', borderRadius: 100, border: 'none',
        background: salvando ? C.brownLight : C.sage, color: C.white,
        fontSize: 14.5, fontWeight: 700, cursor: salvando ? 'default' : 'pointer',
      }}>{salvando ? 'Salvando…' : f.pago_a_vista ? 'Salvar aluno (pago à vista)' : 'Salvar aluno e gerar parcelas'}</button>
    </form>
  )
}
