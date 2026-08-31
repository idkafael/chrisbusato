import { useState, useEffect, useRef } from 'react'
import chrisSorrindo from './images/chris-sorrindo.jpg'

// ─── Encontro diário ao vivo ──────────────────────────────────────────────────
// A data se recalcula sozinha: até as 20h mostra HOJE; a partir das 20h passa a
// mostrar AMANHÃ. Depois da meia-noite volta a ser HOJE, já do novo dia.

const CHECKOUT_URL = 'https://pay.cakto.com.br/c92d9kw'
const PRECO = 'R$ 37'
const HORA_ENCONTRO = 20 // 20h no horário de Brasília
const FUSO = 'America/Sao_Paulo'

const C = {
  cream: '#EDEAE3',
  creamCard: '#F5F3EF',
  sage: '#8A9E8C',
  sageDark: '#6B7F6D',
  sageLight: '#C4D0C5',
  brown: '#3D3530',
  brownMid: '#6B5F58',
  brownLight: '#9C8E87',
  white: '#FAFAF8',
  vivo: '#E8534A',
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.cream}; overflow-x: hidden; }
  @keyframes pulsoVivo {
    0%   { box-shadow: 0 0 0 0 rgba(232,83,74,0.55); }
    70%  { box-shadow: 0 0 0 9px rgba(232,83,74,0); }
    100% { box-shadow: 0 0 0 0 rgba(232,83,74,0); }
  }
  @keyframes subir {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`

const fonteTexto = "'DM Sans', sans-serif"
const fonteTitulo = "'Playfair Display', serif"

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return w
}

// Lê a hora atual no fuso de Brasília, independente do relógio do visitante.
function agoraEmBrasilia() {
  const partes = new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const p = {}
  for (const parte of partes) if (parte.type !== 'literal') p[parte.type] = Number(parte.value)
  // alguns motores devolvem 24 à meia-noite
  return { ano: p.year, mes: p.month, dia: p.day, hora: p.hour % 24, min: p.minute, seg: p.second }
}

const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']

function calcularEncontro() {
  const { ano, mes, dia, hora, min, seg } = agoraEmBrasilia()
  const segundosAgora = hora * 3600 + min * 60 + seg
  const segundosAlvo = HORA_ENCONTRO * 3600
  const ehHoje = segundosAgora < segundosAlvo

  const faltam = ehHoje
    ? segundosAlvo - segundosAgora
    : 24 * 3600 - segundosAgora + segundosAlvo

  // Aritmética de data em UTC para não sofrer com horário de verão.
  const base = new Date(Date.UTC(ano, mes - 1, dia))
  if (!ehHoje) base.setUTCDate(base.getUTCDate() + 1)

  const dd = String(base.getUTCDate()).padStart(2, '0')
  const mm = String(base.getUTCMonth() + 1).padStart(2, '0')

  return {
    ehHoje,
    rotulo: ehHoje ? 'HOJE' : 'AMANHÃ',
    diaSemana: DIAS[base.getUTCDay()],
    dataCurta: `${dd}/${mm}`,
    horas: Math.floor(faltam / 3600),
    minutos: Math.floor((faltam % 3600) / 60),
    segundos: faltam % 60,
  }
}

function useProximoEncontro() {
  const [estado, setEstado] = useState(calcularEncontro)

  useEffect(() => {
    const t = setInterval(() => setEstado(calcularEncontro()), 1000)
    return () => clearInterval(t)
  }, [])

  return estado
}

// Observa se um elemento está na tela (ao contrário do "uma vez só", aqui
// o estado alterna conforme o visitante rola a página).
function useEstaVisivel(ref) {
  const [visivel, setVisivel] = useState(true)

  useEffect(() => {
    const alvo = ref.current
    if (!alvo) return
    const obs = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0 })
    obs.observe(alvo)
    return () => obs.disconnect()
  }, [ref])

  return visivel
}

// Barra fixa: entra quando a contagem principal sai de tela.
function BarraFixa({ encontro, visivel, mobile }) {
  const tempo = `${String(encontro.horas).padStart(2, '0')}h ${String(encontro.minutos).padStart(2, '0')}m ${String(encontro.segundos).padStart(2, '0')}s`

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: C.brown,
      borderBottom: '1px solid rgba(196,208,197,0.18)',
      boxShadow: visivel ? '0 6px 24px rgba(61,53,48,0.28)' : 'none',
      transform: visivel ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
    }}>
      <div style={{
        maxWidth: 900, margin: '0 auto',
        padding: mobile ? '10px 16px' : '12px 24px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: mobile ? 10 : 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 12, minWidth: 0 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: C.vivo, flexShrink: 0,
            animation: 'pulsoVivo 2s ease-out infinite',
          }} />
          <span style={{
            fontFamily: fonteTexto, fontWeight: 800,
            fontSize: mobile ? 11 : 12, letterSpacing: '1px', textTransform: 'uppercase',
            color: C.white, whiteSpace: 'nowrap',
          }}>{encontro.rotulo} · 20h</span>

          <span style={{
            fontFamily: fonteTexto, fontWeight: 700,
            fontSize: mobile ? 13.5 : 15, color: C.sageLight,
            fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
          }}>{tempo}</span>
        </div>

        {CHECKOUT_URL && (
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flexShrink: 0,
              background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDark} 100%)`,
              color: C.white, textDecoration: 'none',
              padding: mobile ? '9px 16px' : '11px 22px',
              borderRadius: 100,
              fontFamily: fonteTexto, fontWeight: 700,
              fontSize: mobile ? 12.5 : 14, whiteSpace: 'nowrap',
            }}
          >
            {mobile ? 'Participar' : 'Quero participar →'}
          </a>
        )}
      </div>
    </div>
  )
}

function SeloAoVivo() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 9,
      background: 'rgba(232,83,74,0.1)',
      border: '1.5px solid rgba(232,83,74,0.4)',
      borderRadius: 100, padding: '7px 16px',
      fontFamily: fonteTexto, fontWeight: 800,
      fontSize: 11, letterSpacing: '1.6px', textTransform: 'uppercase',
      color: C.vivo,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%', background: C.vivo,
        animation: 'pulsoVivo 2s ease-out infinite',
      }} />
      Ao vivo · todo dia
    </div>
  )
}

function Contagem({ encontro, mobile }) {
  const blocos = [
    { valor: encontro.horas, rotulo: encontro.horas === 1 ? 'hora' : 'horas' },
    { valor: encontro.minutos, rotulo: 'min' },
    { valor: encontro.segundos, rotulo: 'seg' },
  ]

  return (
    <div>
      <div style={{
        fontFamily: fonteTexto, fontWeight: 600,
        fontSize: 12.5, letterSpacing: '1.4px', textTransform: 'uppercase',
        color: C.brownMid, marginBottom: 12, textAlign: 'center',
      }}>
        {encontro.ehHoje ? 'O encontro de hoje começa em' : 'O próximo encontro começa em'}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: mobile ? 10 : 14 }}>
        {blocos.map((b, i) => (
          <div key={i} style={{
            background: C.brown, borderRadius: 14,
            padding: mobile ? '14px 14px' : '18px 22px',
            minWidth: mobile ? 78 : 96, textAlign: 'center',
            boxShadow: '0 10px 26px rgba(61,53,48,0.18)',
          }}>
            <div style={{
              fontFamily: fonteTexto, fontWeight: 800,
              fontSize: mobile ? 30 : 38, color: C.white,
              lineHeight: 1, letterSpacing: '-1px',
              fontVariantNumeric: 'tabular-nums',
            }}>{String(b.valor).padStart(2, '0')}</div>
            <div style={{
              fontFamily: fonteTexto, fontWeight: 500,
              fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase',
              color: C.sageLight, marginTop: 6,
            }}>{b.rotulo}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BotaoInscricao({ mobile, children }) {
  if (!CHECKOUT_URL) {
    return (
      <div style={{
        width: '100%', maxWidth: 420, margin: '0 auto',
        background: 'rgba(138,158,140,0.12)',
        border: `1px dashed ${C.sage}`, color: C.sageDark,
        padding: '18px 28px', borderRadius: 100,
        fontFamily: fonteTexto, fontSize: 15, fontWeight: 600,
        textAlign: 'center',
      }}>
        Inscrições abrem em breve
      </div>
    )
  }

  return (
    <a
      href={CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block', width: '100%', maxWidth: 420, margin: '0 auto',
        background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDark} 100%)`,
        color: C.white,
        padding: mobile ? '17px 24px' : '19px 28px', borderRadius: 100,
        fontFamily: fonteTexto, fontSize: mobile ? 15 : 16.5, fontWeight: 700,
        textDecoration: 'none', textAlign: 'center',
        boxShadow: '0 10px 30px rgba(138,158,140,0.4)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 38px rgba(138,158,140,0.5)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(138,158,140,0.4)' }}
    >
      {children}
    </a>
  )
}

const oQueAcontece = [
  'Uma prática guiada ao vivo, com a Chris conduzindo você pela música',
  'Um destravamento por dia: presença, musicalidade ou expressão',
  'Espaço para tirar dúvidas e receber orientação na hora',
  'Você dança de onde estiver, sem precisar de par nem de espaço grande',
]

export default function AoVivoLP() {
  const encontro = useProximoEncontro()
  const w = useWindowWidth()
  const mobile = w < 768

  const refContagem = useRef(null)
  const contagemNaTela = useEstaVisivel(refContagem)

  return (
    <>
      <style>{globalStyles}</style>

      <BarraFixa encontro={encontro} visivel={!contagemNaTela} mobile={mobile} />

      <div style={{
        minHeight: '100vh',
        padding: mobile ? '36px 22px 60px' : '52px 40px 88px',
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>

          <div style={{
            fontFamily: fonteTitulo, fontStyle: 'italic',
            fontSize: mobile ? 16 : 18, color: C.sageDark,
            marginBottom: 26, letterSpacing: '0.5px',
          }}>Chris Busato</div>

          <div style={{ marginBottom: 20, animation: 'subir 0.6s ease both' }}>
            <SeloAoVivo />
          </div>

          {/* data dinâmica — muda sozinha todo dia */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap',
            justifyContent: 'center', gap: 10,
            background: C.brown, borderRadius: 14,
            padding: mobile ? '12px 18px' : '14px 24px',
            marginBottom: 26,
            animation: 'subir 0.6s 0.05s ease both',
          }}>
            <span style={{
              background: C.vivo, color: C.white,
              borderRadius: 6, padding: '4px 10px',
              fontFamily: fonteTexto, fontWeight: 800,
              fontSize: 11.5, letterSpacing: '1.2px',
            }}>{encontro.rotulo}</span>
            <span style={{
              fontFamily: fonteTexto, fontWeight: 700,
              fontSize: mobile ? 15 : 17, color: C.white, letterSpacing: '-0.2px',
            }}>
              {encontro.diaSemana} · {encontro.dataCurta} às 20h
            </span>
          </div>

          <h1 style={{
            fontFamily: fonteTitulo,
            fontSize: mobile ? 'clamp(28px, 8vw, 38px)' : 'clamp(38px, 4.4vw, 54px)',
            color: C.brown, lineHeight: 1.14, letterSpacing: '-0.8px',
            marginBottom: 18, animation: 'subir 0.6s 0.1s ease both',
          }}>
            Você não precisa de mais passos. Precisa de{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>um encontro por dia com a música.</em>
          </h1>

          <p style={{
            fontFamily: fonteTexto, fontWeight: 300,
            fontSize: mobile ? 15.5 : 18, color: C.brownMid,
            lineHeight: 1.7, maxWidth: 560, margin: '0 auto 34px',
            animation: 'subir 0.6s 0.15s ease both',
          }}>
            Um encontro ao vivo com a Chris, todos os dias às 20h. Sem coreografia
            para decorar: é prática guiada para o seu corpo entender a música e
            responder com naturalidade.
          </p>

          <div ref={refContagem} style={{ marginBottom: 32, animation: 'subir 0.6s 0.2s ease both' }}>
            <Contagem encontro={encontro} mobile={mobile} />
          </div>

          {/* preço + CTA */}
          <div style={{
            background: C.white,
            border: '1px solid rgba(138,158,140,0.25)',
            borderRadius: 22,
            padding: mobile ? '28px 22px' : '34px 40px',
            boxShadow: '0 20px 50px rgba(61,53,48,0.08)',
            marginBottom: 40,
            animation: 'subir 0.6s 0.25s ease both',
          }}>
            <div style={{
              fontFamily: fonteTexto, fontWeight: 800,
              fontSize: mobile ? 46 : 58, color: C.brown,
              lineHeight: 1, letterSpacing: '-2px', marginBottom: 6,
            }}>{PRECO}</div>
            <div style={{
              fontFamily: fonteTexto, fontWeight: 400, fontSize: 13.5,
              color: C.brownMid, marginBottom: 26,
            }}>
              acesso ao encontro {encontro.ehHoje ? 'de hoje' : 'de amanhã'} · link enviado por e-mail
            </div>

            <BotaoInscricao mobile={mobile}>
              {encontro.ehHoje ? 'Quero participar hoje às 20h →' : 'Quero participar amanhã às 20h →'}
            </BotaoInscricao>

            <div style={{
              fontFamily: fonteTexto, fontSize: 12,
              color: C.brownLight, marginTop: 14,
            }}>Confirmação imediata após pagamento · Pagamento seguro</div>
          </div>

          {/* o que acontece */}
          <div style={{ textAlign: 'left', maxWidth: 560, margin: '0 auto 40px' }}>
            <div style={{
              fontFamily: fonteTexto, fontWeight: 600,
              fontSize: 11.5, letterSpacing: '2.2px', textTransform: 'uppercase',
              color: C.sageDark, marginBottom: 18, textAlign: 'center',
            }}>O que acontece no encontro</div>

            {oQueAcontece.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 0',
                borderBottom: i < oQueAcontece.length - 1 ? '1px solid rgba(138,158,140,0.16)' : 'none',
              }}>
                <svg width="17" height="17" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  <circle cx="8" cy="8" r="7" stroke={C.sage} strokeWidth="1.2" />
                  <path d="M5 8l2 2 4-4" stroke={C.sageDark} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{
                  fontFamily: fonteTexto, fontWeight: 400,
                  fontSize: 15, color: C.brownMid, lineHeight: 1.6,
                }}>{item}</span>
              </div>
            ))}
          </div>

          {/* quem conduz */}
          <div style={{
            background: C.creamCard,
            border: '1px solid rgba(138,158,140,0.2)',
            borderRadius: 20,
            padding: mobile ? '24px 22px' : '30px 34px',
            display: 'flex', flexDirection: mobile ? 'column' : 'row',
            alignItems: 'center', gap: mobile ? 18 : 26,
            textAlign: mobile ? 'center' : 'left',
            marginBottom: 40,
          }}>
            <img
              src={chrisSorrindo}
              alt="Chris Busato"
              style={{
                width: 92, height: 92, borderRadius: '50%',
                objectFit: 'cover', flexShrink: 0,
                border: `3px solid ${C.white}`,
                boxShadow: '0 8px 22px rgba(61,53,48,0.16)',
              }}
            />
            <div>
              <div style={{
                fontFamily: fonteTitulo, fontSize: 21,
                color: C.brown, marginBottom: 7,
              }}>Chris Busato</div>
              <p style={{
                fontFamily: fonteTexto, fontWeight: 400,
                fontSize: 14.5, color: C.brownMid, lineHeight: 1.65,
              }}>
                Criadora do método Corpo Musical. Há mais de 17 anos ajuda pessoas a
                destravarem o corpo e dançarem com presença, musicalidade e verdade.
              </p>
            </div>
          </div>

          {/* CTA final */}
          <div>
            <div style={{
              fontFamily: fonteTitulo,
              fontSize: mobile ? 22 : 27, color: C.brown,
              lineHeight: 1.3, marginBottom: 20,
            }}>
              {encontro.ehHoje
                ? 'O encontro de hoje é às 20h.'
                : 'O próximo encontro é amanhã, às 20h.'}
            </div>
            <BotaoInscricao mobile={mobile}>Garantir minha vaga →</BotaoInscricao>
          </div>

          <div style={{
            fontFamily: fonteTexto, fontWeight: 300,
            fontSize: 12.5, color: C.brownLight,
            marginTop: 44, lineHeight: 1.7,
          }}>
            © {new Date().getFullYear()} Chris Busato · Todos os direitos reservados
          </div>

        </div>
      </div>
    </>
  )
}
