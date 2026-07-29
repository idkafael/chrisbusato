import { useState, useEffect, useRef } from 'react'

// ─── Checkout transparente de assinatura (teste) ──────────────────────────────
// Fluxo: 1. Dados → 2. Plano → 3. Pagamento (Pix ou Cartão via API Cakto)
// A cobrança real depende das env CAKTO_* na Vercel; sem elas roda em modo demo.

const C = {
  cream: '#EDEAE3',
  creamDark: '#E4E0D7',
  creamCard: '#F5F3EF',
  sage: '#8A9E8C',
  sageDark: '#6B7F6D',
  sageLight: '#C4D0C5',
  sagePale: '#E8EDEA',
  brown: '#3D3530',
  brownMid: '#6B5F58',
  brownLight: '#9C8E87',
  white: '#FAFAF8',
  red: '#C0564A',
}

const PLANOS = [
  {
    id: 'mensal',
    nome: 'Mensal',
    preco: 'R$ 126,39',
    sufixo: '/mês',
    desc: 'Acesso à comunidade e a todos os cursos por 30 dias, renovado automaticamente.',
  },
  {
    id: 'trimestral',
    nome: 'Trimestral',
    preco: 'R$ 379,17',
    sufixo: '/trimestre',
    desc: 'Três meses de acesso completo, com renovação automática a cada trimestre.',
    selo: 'Mais popular',
  },
  {
    id: 'anual',
    nome: 'Anual',
    preco: 'R$ 1.300',
    sufixo: '/ano',
    desc: 'Um ano inteiro de comunidade e plataforma — o melhor custo por mês.',
    selo: 'Melhor valor',
  },
]

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.cream}; }
  input::placeholder { color: ${C.brownLight}; }
`

const fonteTexto = "'DM Sans', sans-serif"
const fonteTitulo = "'Playfair Display', serif"

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])
  return width
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ etapa }) {
  const passos = ['Dados', 'Plano', 'Pagamento']
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 36 }}>
      {passos.map((p, i) => {
        const num = i + 1
        const ativo = etapa === num
        const feito = etapa > num
        return (
          <div key={p} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div style={{
              width: 34, height: 1.5,
              background: etapa > i ? C.sageDark : 'rgba(138,158,140,0.3)',
              margin: '0 10px',
            }} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: fonteTexto, fontWeight: 700, fontSize: 13,
                background: feito || ativo ? C.sageDark : 'rgba(138,158,140,0.15)',
                color: feito || ativo ? C.white : C.brownLight,
                transition: 'background 0.3s',
              }}>
                {feito ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke={C.white} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : num}
              </div>
              <span style={{
                fontFamily: fonteTexto, fontWeight: ativo ? 700 : 500,
                fontSize: 13.5, color: ativo || feito ? C.brown : C.brownLight,
              }}>{p}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Campos ───────────────────────────────────────────────────────────────────

function Campo({ label, erro, ...props }) {
  return (
    <div style={{ marginBottom: 16, textAlign: 'left' }}>
      <label style={{
        display: 'block', fontFamily: fonteTexto, fontWeight: 600,
        fontSize: 12.5, letterSpacing: '0.5px', color: C.brownMid,
        textTransform: 'uppercase', marginBottom: 7,
      }}>{label}</label>
      <input
        {...props}
        style={{
          width: '100%', padding: '13px 15px',
          border: `1.5px solid ${erro ? C.red : 'rgba(138,158,140,0.35)'}`,
          borderRadius: 12, outline: 'none',
          fontFamily: fonteTexto, fontSize: 15, color: C.brown,
          background: C.white,
          transition: 'border-color 0.2s',
        }}
        onFocus={e => { e.target.style.borderColor = C.sageDark }}
        onBlur={e => { e.target.style.borderColor = erro ? C.red : 'rgba(138,158,140,0.35)' }}
      />
      {erro && <div style={{
        fontFamily: fonteTexto, fontSize: 12.5, color: C.red, marginTop: 5,
      }}>{erro}</div>}
    </div>
  )
}

function BotaoPrimario({ children, disabled, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        width: '100%',
        background: disabled ? 'rgba(138,158,140,0.35)' : `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDark} 100%)`,
        color: C.white, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: fonteTexto, fontWeight: 700, fontSize: 16, letterSpacing: '0.3px',
        padding: '17px 24px', borderRadius: 100,
        boxShadow: disabled ? 'none' : '0 8px 28px rgba(138,158,140,0.35)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-2px)' } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >{children}</button>
  )
}

// ─── Máscaras simples ─────────────────────────────────────────────────────────

const mascaraCpf = v => v.replace(/\D/g, '').slice(0, 11)
  .replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')

const mascaraTelefone = v => v.replace(/\D/g, '').slice(0, 11)
  .replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')

const mascaraCartao = v => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

const mascaraValidade = v => v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2')

// ─── Página ───────────────────────────────────────────────────────────────────

export default function TesteAssinaturaLP() {
  const w = useWindowWidth()
  const mobile = w < 768

  const [etapa, setEtapa] = useState(1)
  const [dados, setDados] = useState({ nome: '', email: '', telefone: '', cpf: '' })
  const [erros, setErros] = useState({})
  const [plano, setPlano] = useState('trimestral')
  const [metodo, setMetodo] = useState('credit_card')
  const [cartao, setCartao] = useState({ numero: '', nome: '', validade: '', cvv: '' })
  const [processando, setProcessando] = useState(false)
  const [resultado, setResultado] = useState(null) // { demo?, pix?, status?, error? }
  const [copiado, setCopiado] = useState(false)
  const sdkRef = useRef(null)

  // SDK Cakto (tokenização + antifraude) — carrega uma vez
  useEffect(() => {
    if (document.querySelector('script[src*="cakto-sdk"]')) return
    const s = document.createElement('script')
    s.src = 'https://cakto-sdk.pages.dev/cakto-sdk.min.js'
    s.async = true
    document.head.appendChild(s)
  }, [])

  const validarDados = () => {
    const e = {}
    if (dados.nome.trim().split(' ').length < 2) e.nome = 'Informe nome e sobrenome'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) e.email = 'E-mail inválido'
    if (dados.telefone.replace(/\D/g, '').length < 10) e.telefone = 'Telefone incompleto'
    if (dados.cpf.replace(/\D/g, '').length !== 11) e.cpf = 'CPF incompleto'
    setErros(e)
    return Object.keys(e).length === 0
  }

  const pagar = async () => {
    setProcessando(true)
    setResultado(null)
    try {
      let cardToken, fingerprint, antifraudRef

      if (metodo === 'credit_card') {
        const [mes, ano] = cartao.validade.split('/')
        if (window.Cakto?.CaktoSDK) {
          try {
            const sdk = sdkRef.current || new window.Cakto.CaktoSDK({})
            sdkRef.current = sdk
            if (sdk.collectDeviceProfile) {
              const prof = await sdk.collectDeviceProfile()
              fingerprint = prof?.fingerprint || prof
              antifraudRef = prof?.attemptReference || prof?.reference
            }
            cardToken = await sdk.tokenizeCard({
              cardNumber: cartao.numero.replace(/\s/g, ''),
              cardHolder: cartao.nome,
              expiryMonth: mes,
              expiryYear: ano,
              cvv: cartao.cvv,
            })
          } catch (err) {
            setResultado({ error: 'Não foi possível tokenizar o cartão: ' + (err?.message || err) })
            setProcessando(false)
            return
          }
        }
      }

      const resp = await fetch('/api/cakto-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metodo, plano,
          cliente: dados,
          cardToken: typeof cardToken === 'object' ? cardToken?.token : cardToken,
          fingerprint, antifraudRef,
        }),
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok) {
        setResultado({ error: data?.error || 'Falha ao processar', detalhe: data?.detalhe })
      } else {
        setResultado(data)
      }
    } catch (err) {
      // Sem backend local (vite dev) → simula modo demo
      setResultado({ demo: true, motivo: 'API indisponível neste ambiente (preview local)' })
    }
    setProcessando(false)
  }

  const planoAtual = PLANOS.find(p => p.id === plano)

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{
        minHeight: '100vh',
        padding: mobile ? '40px 20px 64px' : '64px 40px 96px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* marca */}
        <div style={{
          fontFamily: fonteTitulo, fontStyle: 'italic',
          fontSize: mobile ? 17 : 19, color: C.sageDark,
          marginBottom: 28, letterSpacing: '0.5px',
        }}>Chris Busato</div>

        <h1 style={{
          fontFamily: fonteTitulo,
          fontSize: mobile ? 'clamp(26px, 7.5vw, 34px)' : 40,
          color: C.brown, textAlign: 'center', letterSpacing: '-0.5px',
          marginBottom: 10, lineHeight: 1.15,
        }}>
          Comunidade{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>Corpo Musical</em>
        </h1>
        <p style={{
          fontFamily: fonteTexto, fontWeight: 300,
          fontSize: mobile ? 14.5 : 16, color: C.brownMid,
          textAlign: 'center', maxWidth: 420, lineHeight: 1.6, marginBottom: 36,
        }}>
          Assine e tenha acesso à comunidade e a todos os cursos da plataforma.
        </p>

        {/* cartão do fluxo */}
        <div style={{
          width: '100%', maxWidth: 520,
          background: C.white,
          border: '1px solid rgba(138,158,140,0.25)',
          borderRadius: 24,
          boxShadow: '0 24px 60px rgba(61,53,48,0.10)',
          padding: mobile ? '28px 22px' : '40px 44px',
        }}>
          <Stepper etapa={etapa} />

          {/* ── ETAPA 1 · DADOS ── */}
          {etapa === 1 && (
            <div>
              <Campo label="Nome completo" placeholder="Seu nome" value={dados.nome} erro={erros.nome}
                onChange={e => setDados(d => ({ ...d, nome: e.target.value }))} />
              <Campo label="E-mail" type="email" placeholder="voce@email.com" value={dados.email} erro={erros.email}
                onChange={e => setDados(d => ({ ...d, email: e.target.value }))} />
              <Campo label="WhatsApp" inputMode="tel" placeholder="(11) 99999-9999" value={dados.telefone} erro={erros.telefone}
                onChange={e => setDados(d => ({ ...d, telefone: mascaraTelefone(e.target.value) }))} />
              <Campo label="CPF" inputMode="numeric" placeholder="000.000.000-00" value={dados.cpf} erro={erros.cpf}
                onChange={e => setDados(d => ({ ...d, cpf: mascaraCpf(e.target.value) }))} />
              <div style={{ marginTop: 24 }}>
                <BotaoPrimario onClick={() => { if (validarDados()) setEtapa(2) }}>
                  Continuar →
                </BotaoPrimario>
              </div>
            </div>
          )}

          {/* ── ETAPA 2 · PLANO ── */}
          {etapa === 2 && (
            <div>
              <div style={{
                fontFamily: fonteTexto, fontWeight: 600, fontSize: 15,
                color: C.brown, marginBottom: 16,
              }}>Escolha seu plano</div>

              {PLANOS.map(p => {
                const sel = plano === p.id
                return (
                  <button key={p.id} onClick={() => setPlano(p.id)} style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    background: sel ? C.sagePale : C.white,
                    border: `1.5px solid ${sel ? C.sageDark : 'rgba(138,158,140,0.28)'}`,
                    borderRadius: 16, padding: '18px 18px',
                    marginBottom: 12, position: 'relative',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}>
                    {p.selo && <span style={{
                      position: 'absolute', top: -9, right: 14,
                      background: C.sageDark, color: C.white,
                      fontFamily: fonteTexto, fontWeight: 700, fontSize: 10.5,
                      letterSpacing: '0.8px', textTransform: 'uppercase',
                      borderRadius: 100, padding: '3px 10px',
                    }}>{p.selo}</span>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${sel ? C.sageDark : 'rgba(138,158,140,0.5)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {sel && <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.sageDark }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 16, color: C.brown }}>{p.nome}</div>
                        <div style={{ fontFamily: fonteTexto, fontWeight: 300, fontSize: 13, color: C.brownMid, lineHeight: 1.45, marginTop: 3 }}>{p.desc}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontFamily: fonteTexto, fontWeight: 800, fontSize: 19, color: C.brown }}>{p.preco}</span>
                        <span style={{ fontFamily: fonteTexto, fontWeight: 400, fontSize: 12, color: C.brownLight }}>{p.sufixo}</span>
                      </div>
                    </div>
                  </button>
                )
              })}

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={() => setEtapa(1)} style={{
                  flex: '0 0 auto', background: 'none', cursor: 'pointer',
                  border: `1.5px solid rgba(138,158,140,0.4)`, borderRadius: 100,
                  padding: '15px 22px', fontFamily: fonteTexto, fontWeight: 600,
                  fontSize: 14, color: C.brownMid,
                }}>← Voltar</button>
                <BotaoPrimario onClick={() => setEtapa(3)}>Continuar →</BotaoPrimario>
              </div>
            </div>
          )}

          {/* ── ETAPA 3 · PAGAMENTO ── */}
          {etapa === 3 && (
            <div>
              {/* resumo */}
              <div style={{
                background: C.creamCard, border: '1px solid rgba(138,158,140,0.2)',
                borderRadius: 14, padding: '14px 18px', marginBottom: 22,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontFamily: fonteTexto, fontWeight: 600, fontSize: 14, color: C.brown }}>
                    Plano {planoAtual.nome}
                  </div>
                  <div style={{ fontFamily: fonteTexto, fontWeight: 300, fontSize: 12.5, color: C.brownMid }}>
                    {dados.nome.split(' ')[0]} · {dados.email}
                  </div>
                </div>
                <div style={{ fontFamily: fonteTexto, fontWeight: 800, fontSize: 18, color: C.sageDark }}>
                  {planoAtual.preco}<span style={{ fontWeight: 400, fontSize: 11, color: C.brownLight }}>{planoAtual.sufixo}</span>
                </div>
              </div>

              {/* abas pix / cartão */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {[{ id: 'pix', label: 'Pix' }, { id: 'credit_card', label: 'Cartão de crédito' }].map(m => (
                  <button key={m.id} onClick={() => { setMetodo(m.id); setResultado(null) }} style={{
                    flex: 1, cursor: 'pointer',
                    background: metodo === m.id ? C.sageDark : C.white,
                    color: metodo === m.id ? C.white : C.brownMid,
                    border: `1.5px solid ${metodo === m.id ? C.sageDark : 'rgba(138,158,140,0.35)'}`,
                    borderRadius: 12, padding: '12px 10px',
                    fontFamily: fonteTexto, fontWeight: 700, fontSize: 14,
                    transition: 'all 0.2s',
                  }}>{m.label}</button>
                ))}
              </div>

              {/* formulário cartão */}
              {metodo === 'credit_card' && !resultado?.pix && (
                <div>
                  <Campo label="Número do cartão" inputMode="numeric" placeholder="0000 0000 0000 0000"
                    value={cartao.numero} onChange={e => setCartao(c => ({ ...c, numero: mascaraCartao(e.target.value) }))} />
                  <Campo label="Nome impresso no cartão" placeholder="Como está no cartão"
                    value={cartao.nome} onChange={e => setCartao(c => ({ ...c, nome: e.target.value.toUpperCase() }))} />
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <Campo label="Validade" inputMode="numeric" placeholder="MM/AA"
                        value={cartao.validade} onChange={e => setCartao(c => ({ ...c, validade: mascaraValidade(e.target.value) }))} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Campo label="CVV" inputMode="numeric" placeholder="123"
                        value={cartao.cvv} onChange={e => setCartao(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} />
                    </div>
                  </div>
                </div>
              )}

              {/* resultado: pix gerado */}
              {resultado?.pix && (
                <div style={{ textAlign: 'center', marginBottom: 18 }}>
                  <div style={{
                    fontFamily: fonteTexto, fontWeight: 600, fontSize: 14.5, color: C.brown, marginBottom: 14,
                  }}>Escaneie o QR Code para pagar</div>
                  {resultado.pix.qrCodeBase64 && (
                    <img
                      src={`data:image/png;base64,${resultado.pix.qrCodeBase64}`}
                      alt="QR Code Pix"
                      style={{ width: 210, height: 210, borderRadius: 12, border: '1px solid rgba(138,158,140,0.3)' }}
                    />
                  )}
                  <button onClick={() => {
                    navigator.clipboard?.writeText(resultado.pix.qrCode)
                    setCopiado(true); setTimeout(() => setCopiado(false), 2000)
                  }} style={{
                    display: 'block', width: '100%', marginTop: 14, cursor: 'pointer',
                    background: C.sagePale, border: `1.5px solid ${C.sageDark}`,
                    borderRadius: 12, padding: '12px 16px',
                    fontFamily: fonteTexto, fontWeight: 600, fontSize: 13.5, color: C.sageDark,
                  }}>{copiado ? '✓ Código copiado!' : 'Copiar código Pix (copia e cola)'}</button>
                </div>
              )}

              {/* resultado: status cartão */}
              {resultado?.status && !resultado.pix && (
                <div style={{
                  background: resultado.status === 'paid' ? C.sagePale : 'rgba(192,86,74,0.08)',
                  border: `1.5px solid ${resultado.status === 'paid' ? C.sageDark : C.red}`,
                  borderRadius: 14, padding: '16px 18px', marginBottom: 18,
                  fontFamily: fonteTexto, fontSize: 14.5,
                  color: resultado.status === 'paid' ? C.sageDark : C.red,
                  fontWeight: 600, textAlign: 'center',
                }}>
                  {resultado.status === 'paid'
                    ? '✓ Pagamento aprovado! Bem-vindo(a) à comunidade.'
                    : `Pagamento ${resultado.status === 'declined' || resultado.status === 'refused' ? 'recusado — tente outro cartão' : `com status: ${resultado.status}`}`}
                </div>
              )}

              {/* modo demo */}
              {resultado?.demo && (
                <div style={{
                  background: 'rgba(138,158,140,0.1)', border: '1.5px dashed rgba(138,158,140,0.5)',
                  borderRadius: 14, padding: '16px 18px', marginBottom: 18,
                  fontFamily: fonteTexto, fontSize: 13.5, color: C.brownMid, lineHeight: 1.6,
                }}>
                  <strong style={{ color: C.sageDark }}>Modo demonstração.</strong> O fluxo visual está completo,
                  mas a cobrança real ainda não está ativa: {resultado.motivo}. Configure as variáveis
                  CAKTO_* na Vercel para ativar.
                </div>
              )}

              {/* erro */}
              {resultado?.error && (
                <div style={{
                  background: 'rgba(192,86,74,0.08)', border: `1.5px solid ${C.red}`,
                  borderRadius: 14, padding: '14px 18px', marginBottom: 18,
                  fontFamily: fonteTexto, fontSize: 13.5, color: C.red, lineHeight: 1.5,
                }}>{resultado.error}</div>
              )}

              {!resultado?.pix && (
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button onClick={() => { setEtapa(2); setResultado(null) }} style={{
                    flex: '0 0 auto', background: 'none', cursor: 'pointer',
                    border: `1.5px solid rgba(138,158,140,0.4)`, borderRadius: 100,
                    padding: '15px 22px', fontFamily: fonteTexto, fontWeight: 600,
                    fontSize: 14, color: C.brownMid,
                  }}>← Voltar</button>
                  <BotaoPrimario onClick={pagar} disabled={processando}>
                    {processando ? 'Processando…' : metodo === 'pix' ? 'Gerar Pix →' : `Assinar ${planoAtual.preco}${planoAtual.sufixo}`}
                  </BotaoPrimario>
                </div>
              )}
            </div>
          )}
        </div>

        {/* selo de segurança */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 22,
          fontFamily: fonteTexto, fontWeight: 400, fontSize: 12.5, color: C.brownLight,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2.5l7 3v5.5c0 4.6-3 7.9-7 9.5-4-1.6-7-4.9-7-9.5V5.5l7-3z" stroke={C.brownLight} strokeWidth="1.6" strokeLinejoin="round"/>
            <path d="M8.5 12l2.4 2.4L15.8 9.5" stroke={C.brownLight} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Pagamento processado com segurança pela Cakto · Cancele quando quiser
        </div>
      </div>
    </>
  )
}
