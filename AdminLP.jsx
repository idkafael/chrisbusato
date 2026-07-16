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

function Agenda({ ref_, setRef, pagamentos }) {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  const primeiro = new Date(ref_.ano, ref_.mes, 1)
  const diasNoMes = new Date(ref_.ano, ref_.mes + 1, 0).getDate()
  const offset = primeiro.getDay()

  const porDia = useMemo(() => {
    const mapa = {}
    pagamentos.forEach(p => {
      const v = d(p.vencimento)
      if (v.getFullYear() === ref_.ano && v.getMonth() === ref_.mes) {
        (mapa[v.getDate()] = mapa[v.getDate()] || []).push(p)
      }
    })
    return mapa
  }, [pagamentos, ref_])

  const navegar = n => setRef(r => {
    const nd = new Date(r.ano, r.mes + n, 1)
    return { ano: nd.getFullYear(), mes: nd.getMonth() }
  })

  const celulas = [...Array(offset).fill(null), ...Array.from({ length: diasNoMes }, (_, i) => i + 1)]

  return (
    <div style={{ background: C.white, border: `1px solid ${C.sageLight}`, borderRadius: 18, padding: '20px 20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontFamily: S, fontSize: 20, color: C.brown }}>{MESES[ref_.mes]} {ref_.ano}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <BotaoNav onClick={() => navegar(-1)}>←</BotaoNav>
          <button onClick={() => { const h = new Date(); setRef({ ano: h.getFullYear(), mes: h.getMonth() }) }}
            style={{ padding: '7px 14px', borderRadius: 100, border: `1px solid ${C.sageLight}`, background: C.creamCard, fontFamily: F, fontSize: 12.5, fontWeight: 600, color: C.brownMid, cursor: 'pointer' }}>
            Hoje
          </button>
          <BotaoNav onClick={() => navegar(1)}>→</BotaoNav>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
        {SEMANA.map((s, i) => (
          <div key={i} style={{ textAlign: 'center', fontFamily: F, fontWeight: 700, fontSize: 10, color: C.brownLight, padding: '4px 0' }}>{s}</div>
        ))}
        {celulas.map((dia, i) => {
          if (!dia) return <div key={`v${i}`} />
          const lista = porDia[dia] || []
          const data = new Date(ref_.ano, ref_.mes, dia)
          const ehHoje = data.getTime() === hoje.getTime()
          const pendentes = lista.filter(p => !p.pago)
          const atrasado = pendentes.length > 0 && data < hoje
          const total = lista.reduce((s, p) => s + Number(p.valor || 0), 0)

          const fundo = lista.length === 0 ? C.creamCard
            : atrasado ? C.redPale
              : pendentes.length > 0 ? C.amberPale
                : C.sagePale
          const borda = ehHoje ? C.sageDark : (lista.length ? (atrasado ? `${C.red}55` : `${C.sageLight}`) : 'transparent')

          return (
            <div key={dia} title={lista.map(p => `${p.aluno?.nome || ''} — ${brl(p.valor)}${p.pago ? ' (pago)' : ''}`).join('\n')}
              style={{
                minHeight: 62, borderRadius: 10, padding: '6px 7px',
                background: fundo, border: `1.5px solid ${borda}`,
                display: 'flex', flexDirection: 'column', gap: 3,
              }}>
              <div style={{ fontFamily: F, fontSize: 11, fontWeight: ehHoje ? 800 : 600, color: ehHoje ? C.sageDark : C.brownMid }}>{dia}</div>
              {lista.length > 0 && (
                <>
                  <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, color: atrasado ? C.red : C.brown, lineHeight: 1.25 }}>
                    {brl(total)}
                  </div>
                  <div style={{ fontFamily: F, fontSize: 9.5, color: C.brownLight }}>
                    {pendentes.length === 0 ? '✓ pago' : `${lista.length} parc.`}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 16 }}>
        <Legenda cor={C.sagePale} label="Pago" />
        <Legenda cor={C.amberPale} label="A vencer" />
        <Legenda cor={C.redPale} label="Atrasado" />
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
          <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: C.brownLight, textTransform: 'uppercase', marginBottom: 5 }}>Parcelas</div>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: pc.pagas === pc.total ? C.sage : C.brown }}>
            {pc.pagas}/{pc.total}
          </div>
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
        <div><label style={rotulo}>Dia do vencimento</label><input type="number" min="1" max="31" value={f.dia_vencimento} onChange={e => set('dia_vencimento', e.target.value)} style={campo} /></div>

        <div><label style={rotulo}>Valor total (R$)</label><input type="number" step="0.01" min="0" value={f.valor_total} onChange={e => set('valor_total', e.target.value)} style={campo} placeholder="0,00" /></div>
        <div>
          <label style={rotulo}>Nº de parcelas</label>
          <input type="number" min="1" value={f.total_parcelas} onChange={e => set('total_parcelas', e.target.value)} style={campo} />
          {parcelaAprox && <div style={{ fontFamily: F, fontSize: 11.5, color: C.sageDark, marginTop: 5 }}>≈ {parcelaAprox} por parcela</div>}
        </div>
        <div><label style={rotulo}>Observações</label><input value={f.observacoes} onChange={e => set('observacoes', e.target.value)} style={campo} /></div>
      </div>

      <button type="submit" disabled={salvando} style={{
        padding: '13px 30px', borderRadius: 100, border: 'none',
        background: salvando ? C.brownLight : C.sage, color: C.white,
        fontSize: 14.5, fontWeight: 700, cursor: salvando ? 'default' : 'pointer',
      }}>{salvando ? 'Salvando…' : 'Salvar aluno e gerar parcelas'}</button>
    </form>
  )
}
