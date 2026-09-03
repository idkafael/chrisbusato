import { useState, useEffect, useRef } from 'react'
import chrisSorrindo from './images/chris-sorrindo.jpg'
import feedbac1 from './images/feedbac1.jpeg'
import feedbac2 from './images/feedbac2.jpeg'
import feedbac3 from './images/feedbac3.jpeg'
import feedbac4 from './images/feedbac4.jpeg'
import feedback10 from './images/feedback10.jpeg'
import feedback11 from './images/feedback11.jpeg'

// ─── Funil de Quiz — teste de oferta (tráfego pago, público frio) ─────────────
// 9 telas em sequência, estilo app/quiz interativo. Rascunho de copy nas telas
// 4 e 5 (inimigo comum + simulação de WhatsApp) — sinalizado nos comentários
// para validação da Chris antes de ir ao ar de verdade.
//
// Ofertas: mesmo evento de 13/09, 10h às 14h — os MESMOS checkouts já usados
// no site principal (nenhuma oferta nova criada na Cakto):
//   Presencial   → R$120 → https://pay.cakto.com.br/cqmaji2
//   Transmissão  → R$67  → https://pay.cakto.com.br/khbx2vk

const CHECKOUT_PRESENCIAL = 'https://pay.cakto.com.br/cqmaji2'
const CHECKOUT_TRANSMISSAO = 'https://pay.cakto.com.br/khbx2vk'
const TOTAL_TELAS = 9

// Sem acento de propósito: o script de UTMs do site decora todo link <a> e
// corrompe caracteres acentuados dentro de query string já url-encoded
// (mesmo cuidado já tomado em BotaoWhatsApp.jsx e nas páginas de agradecimento).
const WHATSAPP_NUMERO = '5548999960701'
const WHATSAPP_MSG = 'vim do quiz do site da chris, fiquei com uma duvida'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MSG)}`

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
  vivo: '#E8534A',
}

const fonteTexto = "'DM Sans', sans-serif"
const fonteTitulo = "'Playfair Display', serif"

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { overflow-x: hidden; }
  body { background: ${C.brown}; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulso {
    0%   { box-shadow: 0 0 0 0 rgba(232,83,74,0.5); }
    70%  { box-shadow: 0 0 0 8px rgba(232,83,74,0); }
    100% { box-shadow: 0 0 0 0 rgba(232,83,74,0); }
  }
  @keyframes desliza {
    0%, 100% { transform: translateY(0); opacity: 0.5; }
    50%      { transform: translateY(8px); opacity: 1; }
  }
  @keyframes piscaDigitando {
    0%, 60%, 100% { opacity: 0.3; }
    30%           { opacity: 1; }
  }
  @keyframes confeteCai {
    from { transform: translateY(-40px) rotate(0deg); opacity: 1; }
    to   { transform: translateY(340px) rotate(360deg); opacity: 0; }
  }
`

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 390)
  useEffect(() => {
    const h = () => setWidth(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return width
}

// ─── Casco comum de cada tela: altura de viewport cheia + fade de entrada ─────

function TelaBase({ children, fundo = C.cream, semPadding = false, mobile }) {
  return (
    <div style={{
      minHeight: '100dvh',
      background: fundo,
      display: 'flex', flexDirection: 'column',
      padding: semPadding ? 0 : (mobile ? '20px 22px 28px' : '28px 32px 36px'),
      animation: 'fadeUp 0.45s ease both',
      position: 'relative',
    }}>
      {children}
    </div>
  )
}

function BarraProgresso({ etapa, mobile }) {
  return (
    <div style={{
      display: 'flex', gap: 5,
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
      padding: mobile ? '12px 16px' : '16px 24px',
      background: 'linear-gradient(180deg, rgba(61,53,48,0.35) 0%, transparent 100%)',
    }}>
      {Array.from({ length: TOTAL_TELAS }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 100,
          background: i < etapa ? C.white : 'rgba(255,255,255,0.28)',
          transition: 'background 0.3s ease',
        }} />
      ))}
    </div>
  )
}

function BotaoVoltar({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Voltar" style={{
      position: 'fixed', top: 20, left: 16, zIndex: 301,
      width: 34, height: 34, borderRadius: '50%',
      background: 'rgba(61,53,48,0.35)', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginTop: 16,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function BotaoContinuar({ onClick, children = 'Continuar →', desabilitado = false, cor = 'sage' }) {
  const bg = cor === 'sage'
    ? `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDark} 100%)`
    : C.white
  const texto = cor === 'sage' ? C.white : C.brown
  return (
    <button
      onClick={onClick}
      disabled={desabilitado}
      style={{
        display: 'block', width: '100%', border: 'none',
        background: desabilitado ? 'rgba(138,158,140,0.35)' : bg,
        color: desabilitado ? 'rgba(255,255,255,0.7)' : texto,
        padding: '18px 24px', borderRadius: 100,
        fontFamily: fonteTexto, fontWeight: 700, fontSize: 16,
        cursor: desabilitado ? 'not-allowed' : 'pointer',
        boxShadow: desabilitado ? 'none' : '0 10px 28px rgba(138,158,140,0.35)',
        transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.3s',
        opacity: desabilitado ? 0.6 : 1,
      }}
      onMouseEnter={e => { if (!desabilitado) e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {children}
    </button>
  )
}

// ─── Tela 1 — Promessa forte + deslizar/tocar para iniciar ────────────────────
// Conceito reaproveitado do print de referência (deslizar + "Iniciar Agora"),
// mas a promessa é a mesma linha da headline principal do site, numa versão
// mais direta — ela precisa validar sozinha o resto do funil.

function Tela1Promessa({ avancar, mobile }) {
  const [arrastando, setArrastando] = useState(false)
  const inicioY = useRef(null)

  const onTouchStart = e => { inicioY.current = e.touches[0].clientY; setArrastando(true) }
  const onTouchEnd = e => {
    setArrastando(false)
    if (inicioY.current == null) return
    const delta = inicioY.current - e.changedTouches[0].clientY
    if (delta > 60) avancar()
    inicioY.current = null
  }

  return (
    <TelaBase fundo={`linear-gradient(160deg, ${C.cream} 0%, ${C.creamDark} 100%)`} mobile={mobile}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        maxWidth: 440, margin: '0 auto', width: '100%',
      }}>
        <div style={{
          fontFamily: fonteTitulo, fontStyle: 'italic',
          fontSize: 16, color: C.sageDark, marginBottom: 28,
        }}>Chris Busato</div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: C.sagePale, border: `1px solid ${C.sageLight}`,
          borderRadius: 100, padding: '6px 16px', marginBottom: 24,
          fontFamily: fonteTexto, fontWeight: 600, fontSize: 12.5, color: C.sageDark,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.sage }} />
          Criadora do método Corpo Musical
        </div>

        <h1 style={{
          fontFamily: fonteTitulo,
          fontSize: mobile ? 'clamp(26px, 8vw, 34px)' : 'clamp(32px, 4vw, 44px)',
          color: C.brown, lineHeight: 1.2, letterSpacing: '-0.6px',
          marginBottom: 18,
        }}>
          Você não precisa aprender{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>mais um passo</em>{' '}
          pra dançar bem.
        </h1>

        <p style={{
          fontFamily: fonteTexto, fontWeight: 400,
          fontSize: mobile ? 15.5 : 17, color: C.brownMid, lineHeight: 1.65,
          marginBottom: 8,
        }}>
          Em menos de 2 minutos eu vou te mostrar exatamente o que está te
          travando na pista — e por que decorar mais passos não vai resolver.
        </p>
      </div>

      <div style={{ maxWidth: 440, margin: '0 auto', width: '100%' }}>
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 6, marginBottom: 18, cursor: 'grab', userSelect: 'none',
            opacity: arrastando ? 0.6 : 1, transition: 'opacity 0.2s',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: 'desliza 1.6s ease-in-out infinite' }}>
            <path d="M12 4v16M12 20l-5-5M12 20l5-5" stroke={C.brownLight} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{
            fontFamily: fonteTexto, fontWeight: 500, fontSize: 12.5,
            letterSpacing: '0.6px', textTransform: 'uppercase', color: C.brownLight,
          }}>Deslize para começar</span>
        </div>

        <BotaoContinuar onClick={avancar}>Iniciar Agora →</BotaoContinuar>
      </div>
    </TelaBase>
  )
}

// ─── Tela 2 — VSL em tela cheia ────────────────────────────────────────────────
// Reaproveita o player da home (mesmo id) como placeholder até termos uma VSL
// própria para o quiz. O botão "Continuar" só aparece depois de alguns
// segundos, pra desencorajar pular o vídeo sem travar quem realmente quer sair.

function Tela2VSL({ avancar, mobile }) {
  const [podeAvancar, setPodeAvancar] = useState(false)

  useEffect(() => {
    if (document.querySelector('script[src*="6a120f7fc9941c35508e9807"]')) { setPodeAvancar(false) }
    const s = document.createElement('script')
    s.src = 'https://scripts.converteai.net/1c6e6f27-d6f0-4013-b98a-0067464a2b63/players/6a120f7fc9941c35508e9807/v4/player.js'
    s.async = true
    if (!document.querySelector('script[src*="6a120f7fc9941c35508e9807"]')) document.head.appendChild(s)

    const t = setTimeout(() => setPodeAvancar(true), 12000)
    return () => clearTimeout(t)
  }, [])

  return (
    <TelaBase fundo="#000" semPadding mobile={mobile}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '80px 0 16px',
        }}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <vturb-smartplayer
              id="vid-6a120f7fc9941c35508e9807"
              style={{ display: 'block', margin: '0 auto', width: '100%' }}
            />
          </div>
          <p style={{
            fontFamily: fonteTexto, fontWeight: 400, fontSize: 13,
            color: 'rgba(255,255,255,0.5)', marginTop: 20, textAlign: 'center',
            padding: '0 24px',
          }}>Assista até o final — o que vem depois só faz sentido com isso.</p>
        </div>

        <div style={{ padding: '0 22px 28px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
          <div style={{
            maxHeight: podeAvancar ? 80 : 0, overflow: 'hidden',
            transition: 'max-height 0.5s ease',
          }}>
            <BotaoContinuar onClick={avancar} cor="white">Continuar →</BotaoContinuar>
          </div>
        </div>
      </div>
    </TelaBase>
  )
}

// ─── Tela 3 — Quebra de crença ─────────────────────────────────────────────────
// Copy idêntica à ViradaSection do site principal.

function Tela3Crenca({ avancar, voltar, mobile }) {
  return (
    <TelaBase fundo={C.brown} mobile={mobile}>
      <BotaoVoltar onClick={voltar} />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', maxWidth: 460, margin: '0 auto', width: '100%',
        paddingTop: 56,
      }}>
        <div style={{
          fontFamily: fonteTitulo, fontSize: 90, color: 'rgba(196,208,197,0.28)',
          lineHeight: 0.6, marginBottom: 12, userSelect: 'none',
        }}>"</div>

        <blockquote style={{
          fontFamily: fonteTitulo, fontStyle: 'italic',
          fontSize: mobile ? 'clamp(22px, 6.5vw, 28px)' : 30,
          color: C.cream, lineHeight: 1.4, marginBottom: 28,
        }}>
          Não é sobre repertório de passos predeterminados.{' '}
          <span style={{ color: C.sageLight }}>É sobre repertório musical.</span>
        </blockquote>

        <div style={{ height: 1, background: 'rgba(196,208,197,0.2)', marginBottom: 24 }} />

        <p style={{
          fontFamily: fonteTexto, fontWeight: 400, fontSize: mobile ? 15 : 16.5,
          color: 'rgba(237,234,227,0.82)', lineHeight: 1.75,
        }}>
          A maioria das pessoas aprende movimentos. Poucas aprendem a enxergar
          possibilidades dentro da música. Quando você entende a base musical
          do que já faz, o passo deixa de ser uma obrigação e passa a ser uma
          escolha.
        </p>
      </div>

      <div style={{ maxWidth: 460, margin: '0 auto', width: '100%' }}>
        <BotaoContinuar onClick={avancar} />
      </div>
    </TelaBase>
  )
}

// ─── Tela 4 — Inimigo comum ────────────────────────────────────────────────────
// RASCUNHO — copy escrita a partir do posicionamento já usado no site
// (musicalidade > acúmulo de passos). Precisa de validação da Chris antes de
// ir para tráfego de verdade.

const inimigos = [
  'Aulas que empilham coreografia nova toda semana, sem te ensinar a ouvir a música',
  'Conteúdo de "resultado rápido" que te deixa dependente de decorar sequência',
  'Cursos genéricos que ignoram que cada corpo — e cada música — pede uma resposta diferente',
]

function Tela4Inimigo({ avancar, voltar, mobile }) {
  return (
    <TelaBase fundo={C.creamDark} mobile={mobile}>
      <BotaoVoltar onClick={voltar} />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', maxWidth: 460, margin: '0 auto', width: '100%',
        paddingTop: 56,
      }}>
        <div style={{
          fontFamily: fonteTexto, fontWeight: 600, fontSize: 11.5,
          letterSpacing: '2px', textTransform: 'uppercase', color: C.vivo,
          marginBottom: 16,
        }}>O problema não é você</div>

        <h2 style={{
          fontFamily: fonteTitulo, fontSize: mobile ? 'clamp(24px, 7vw, 30px)' : 32,
          color: C.brown, lineHeight: 1.25, marginBottom: 28,
        }}>
          É o jeito como{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>te ensinaram a dançar.</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {inimigos.map((texto, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: C.white, border: `1px solid ${C.sageLight}`,
              borderRadius: 14, padding: '16px 18px',
            }}>
              <span style={{
                flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                background: 'rgba(232,83,74,0.12)', color: C.vivo,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: fonteTexto, fontWeight: 800, fontSize: 13,
              }}>✕</span>
              <span style={{
                fontFamily: fonteTexto, fontWeight: 400, fontSize: 14.5,
                color: C.brownMid, lineHeight: 1.55,
              }}>{texto}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 460, margin: '0 auto', width: '100%' }}>
        <BotaoContinuar onClick={avancar} />
      </div>
    </TelaBase>
  )
}

// ─── Tela 5 — Simulação animada de WhatsApp (estilo Typebot) ──────────────────
// RASCUNHO de script — mensagens de texto genéricas de transição, e uma bolha
// de "áudio" só visual (sem arquivo real ainda: precisa da Chris gravar e nos
// mandar o áudio pra tocar de verdade aqui).

const mensagensWhatsApp = [
  { tipo: 'texto', texto: 'Oi! 👋' },
  { tipo: 'texto', texto: 'Vi que você chegou até aqui porque sente que falta alguma coisa na sua dança, né?' },
  { tipo: 'texto', texto: 'Isso não é falta de talento. É falta de um caminho certo.' },
  { tipo: 'audio', duracao: '0:47' },
]

function BolhaAudio({ tocando, aoClicar }) {
  const barras = [6, 14, 9, 18, 11, 16, 8, 20, 10, 15, 7, 13]
  return (
    <button onClick={aoClicar} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%',
    }}>
      <div style={{
        flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
        background: C.sageDark, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {tocando ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="#fff"><rect x="1" y="1" width="4" height="10" rx="1" /><rect x="7" y="1" width="4" height="10" rx="1" /></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="#fff"><path d="M2 1l9 5-9 5V1z" /></svg>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, height: 20 }}>
        {barras.map((h, i) => (
          <span key={i} style={{
            width: 2.5, height: h, borderRadius: 2,
            background: tocando ? C.sageDark : 'rgba(107,127,109,0.4)',
          }} />
        ))}
      </div>
      <span style={{ fontFamily: fonteTexto, fontSize: 11, color: C.brownLight, flexShrink: 0 }}>0:47</span>
    </button>
  )
}

function Tela5WhatsApp({ avancar, voltar, mobile }) {
  const [visiveis, setVisiveis] = useState(0)
  const [digitando, setDigitando] = useState(false)
  const [audioTocando, setAudioTocando] = useState(false)
  const fimRef = useRef(null)

  useEffect(() => {
    if (visiveis >= mensagensWhatsApp.length) return
    setDigitando(true)
    const atraso = visiveis === 0 ? 700 : 1300
    const t = setTimeout(() => {
      setDigitando(false)
      setVisiveis(v => v + 1)
    }, atraso)
    return () => clearTimeout(t)
  }, [visiveis])

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [visiveis, digitando])

  const terminou = visiveis >= mensagensWhatsApp.length

  return (
    <TelaBase fundo="#E5DDD5" semPadding mobile={mobile}>
      {/* cabeçalho estilo WhatsApp */}
      <div style={{
        background: C.sageDark, padding: mobile ? '46px 16px 14px' : '52px 24px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={voltar} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <img src={chrisSorrindo} alt="Chris Busato" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <div style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 15, color: '#fff' }}>Chris Busato</div>
          <div style={{ fontFamily: fonteTexto, fontSize: 11.5, color: 'rgba(255,255,255,0.75)' }}>
            {digitando ? 'digitando...' : 'online'}
          </div>
        </div>
      </div>

      {/* conversa */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: mobile ? '18px 16px' : '24px 24px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {mensagensWhatsApp.slice(0, visiveis).map((m, i) => (
          <div key={i} style={{
            alignSelf: 'flex-start', maxWidth: '78%',
            background: C.white, borderRadius: '4px 14px 14px 14px',
            padding: m.tipo === 'audio' ? '10px 14px' : '10px 14px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            animation: 'fadeUp 0.3s ease both',
          }}>
            {m.tipo === 'texto' ? (
              <span style={{ fontFamily: fonteTexto, fontSize: 14.5, color: C.brown, lineHeight: 1.5 }}>{m.texto}</span>
            ) : (
              <BolhaAudio tocando={audioTocando} aoClicar={() => setAudioTocando(v => !v)} />
            )}
          </div>
        ))}

        {digitando && (
          <div style={{
            alignSelf: 'flex-start', background: C.white, borderRadius: '4px 14px 14px 14px',
            padding: '12px 16px', display: 'flex', gap: 4,
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: C.brownLight,
                animation: `piscaDigitando 1.2s ${i * 0.2}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        )}
        <div ref={fimRef} />
      </div>

      <div style={{
        maxHeight: terminou ? 90 : 0, overflow: 'hidden', transition: 'max-height 0.5s ease',
        padding: '0 20px 24px',
      }}>
        <BotaoContinuar onClick={avancar} />
      </div>
    </TelaBase>
  )
}

// ─── Tela 6 — O método (sem vs. com) ────────────────────────────────────────────
// Também é onde inserimos data/local do evento, como combinado.

function Tela6Metodo({ avancar, voltar, mobile }) {
  return (
    <TelaBase fundo={C.cream} mobile={mobile}>
      <BotaoVoltar onClick={voltar} />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', maxWidth: 460, margin: '0 auto', width: '100%',
        paddingTop: 56,
      }}>
        <div style={{
          fontFamily: fonteTexto, fontWeight: 600, fontSize: 11.5,
          letterSpacing: '2px', textTransform: 'uppercase', color: C.sageDark,
          marginBottom: 14, textAlign: 'center',
        }}>O método Corpo Musical</div>

        <h2 style={{
          fontFamily: fonteTitulo, fontSize: mobile ? 'clamp(22px, 6.5vw, 27px)' : 29,
          color: C.brown, lineHeight: 1.25, marginBottom: 26, textAlign: 'center',
        }}>
          Não são mais passos.{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>É outra base.</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 26 }}>
          <div style={{
            background: 'rgba(232,83,74,0.06)', border: '1px solid rgba(232,83,74,0.25)',
            borderRadius: 16, padding: '18px 20px',
          }}>
            <div style={{
              fontFamily: fonteTexto, fontWeight: 800, fontSize: 11.5,
              letterSpacing: '1px', color: C.vivo, marginBottom: 10,
            }}>SEM O MÉTODO</div>
            {['Decora passo por passo', 'Trava quando a música muda', 'Depende de aula nova toda semana'].map((t, i) => (
              <div key={i} style={{ fontFamily: fonteTexto, fontSize: 14, color: C.brownMid, lineHeight: 1.8 }}>— {t}</div>
            ))}
          </div>

          <div style={{
            background: C.sagePale, border: `1px solid ${C.sage}`,
            borderRadius: 16, padding: '18px 20px',
          }}>
            <div style={{
              fontFamily: fonteTexto, fontWeight: 800, fontSize: 11.5,
              letterSpacing: '1px', color: C.sageDark, marginBottom: 10,
            }}>COM O MÉTODO</div>
            {['Entende a estrutura musical', 'Adapta a qualquer passo, em qualquer música', 'Dança com liberdade mesmo sem saber "o passo certo"'].map((t, i) => (
              <div key={i} style={{ fontFamily: fonteTexto, fontWeight: 500, fontSize: 14, color: C.brown, lineHeight: 1.8 }}>✓ {t}</div>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: C.brown, borderRadius: 12, padding: '13px 16px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <rect x="3" y="5" width="18" height="16" rx="2.2" stroke={C.sageLight} strokeWidth="1.8" />
            <path d="M3 9.5h18M8 3v4M16 3v4" stroke={C.sageLight} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: fonteTexto, fontWeight: 600, fontSize: 13, color: C.cream }}>
            13 de setembro · 10h às 14h · São Paulo
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 460, margin: '0 auto', width: '100%' }}>
        <BotaoContinuar onClick={avancar} />
      </div>
    </TelaBase>
  )
}

// ─── Tela 7 — Escassez + resgate de voucher ────────────────────────────────────
// A barra de vagas é a MESMA do site principal (mesmo evento, mesma API real
// /api/vagas-presencial) — não é um número inventado para o funil.
// O "desconto" revelado no flip não é um preço extra: é o preço que já é
// promocional no site (R$120 / R$67), só que quem vem de tráfego frio nunca
// viu a âncora original — por isso funciona como "desbloqueio".

function useVagasPresencial() {
  const [dados, setDados] = useState(null)
  useEffect(() => {
    let ativo = true
    fetch('/api/vagas-presencial').then(r => r.json()).then(d => {
      if (ativo && d && !d.indisponivel) setDados(d)
    }).catch(() => {})
    return () => { ativo = false }
  }, [])
  return dados
}

function Tela7Voucher({ avancar, voltar, mobile }) {
  const [resgatado, setResgatado] = useState(false)
  const [restamSeg, setRestamSeg] = useState(15 * 60)
  const vagas = useVagasPresencial()

  useEffect(() => {
    if (resgatado) return
    const t = setInterval(() => setRestamSeg(s => Math.max(s - 1, 0)), 1000)
    return () => clearInterval(t)
  }, [resgatado])

  const min = String(Math.floor(restamSeg / 60)).padStart(2, '0')
  const seg = String(restamSeg % 60).padStart(2, '0')

  return (
    <TelaBase fundo={`linear-gradient(160deg, ${C.brown} 0%, #2A2420 100%)`} mobile={mobile}>
      <BotaoVoltar onClick={voltar} />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        maxWidth: 420, margin: '0 auto', width: '100%', paddingTop: 56,
      }}>
        <div style={{
          fontFamily: fonteTexto, fontWeight: 700, fontSize: 12, letterSpacing: '1.5px',
          textTransform: 'uppercase', color: C.sageLight, marginBottom: 8,
        }}>1º Lote · Vagas Limitadas</div>

        {vagas && !vagas.esgotado && (
          <p style={{ fontFamily: fonteTexto, fontWeight: 500, fontSize: 13.5, color: 'rgba(237,234,227,0.75)', marginBottom: 20 }}>
            {vagas.percentual}% das vagas já preenchidas
          </p>
        )}

        {/* card do voucher */}
        <div
          onClick={() => !resgatado && setResgatado(true)}
          style={{
            position: 'relative', width: '100%', maxWidth: 280, height: 300,
            perspective: 1000, cursor: resgatado ? 'default' : 'pointer', marginBottom: 26,
          }}
        >
          <div style={{
            position: 'relative', width: '100%', height: '100%',
            transformStyle: 'preserve-3d', transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
            transform: resgatado ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}>
            {/* frente */}
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              background: C.sagePale, borderRadius: 20,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
              border: `2px dashed ${C.sage}`,
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%', background: C.sage,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: resgatado ? 'none' : 'pulso 2s ease-out infinite',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M20 12v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7M2 7h20v5H2V7zM12 22V7M12 7c-1.5 0-4-1-4-3.2C8 2 9 1 10.2 1 12 1 12 4 12 7zM12 7c1.5 0 4-1 4-3.2C16 2 15 1 13.8 1 12 1 12 4 12 7z" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 15, color: C.brown }}>Toque para resgatar seu voucher</span>
            </div>

            {/* verso */}
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)', background: C.white, borderRadius: 20,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
              border: `2px solid ${C.sage}`, padding: '20px 18px', overflow: 'hidden',
            }}>
              {resgatado && Array.from({ length: 14 }).map((_, i) => (
                <span key={i} style={{
                  position: 'absolute', top: 0, left: `${(i * 37) % 100}%`,
                  width: 6, height: 10, background: [C.sage, C.vivo, C.brownLight][i % 3],
                  animation: `confeteCai ${1.4 + (i % 5) * 0.2}s ${i * 0.06}s ease-in both`,
                }} />
              ))}
              <span style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 13, color: C.sageDark }}>Voucher resgatado! 🎉</span>
              <span style={{ fontFamily: fonteTexto, fontWeight: 800, fontSize: 22, color: C.brown, marginTop: 4 }}>Preço de 1º lote</span>
              <span style={{ fontFamily: fonteTexto, fontWeight: 500, fontSize: 13, color: C.brownMid, textAlign: 'center', lineHeight: 1.5, marginTop: 4 }}>
                Presencial <strong style={{ color: C.brown }}>R$120</strong> · Transmissão <strong style={{ color: C.brown }}>R$67</strong>
              </span>
            </div>
          </div>
        </div>

        {resgatado && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: fonteTexto, fontWeight: 600, fontSize: 13, color: C.vivo, marginBottom: 6,
          }}>
            Garantido por mais {min}:{seg} min
          </div>
        )}
      </div>

      <div style={{
        maxHeight: resgatado ? 90 : 0, overflow: 'hidden', transition: 'max-height 0.5s ease',
        maxWidth: 420, margin: '0 auto', width: '100%',
      }}>
        <BotaoContinuar onClick={avancar}>Finalizar Acesso →</BotaoContinuar>
      </div>
    </TelaBase>
  )
}

// ─── Tela 8 — Prova concreta ───────────────────────────────────────────────────
// Checklist e feedbacks reaproveitados 1:1 do site principal. Fotos/vídeos da
// vivência acontecendo no espaço novo ainda não existem — assim que a Chris
// mandar o material, entra aqui embaixo dos feedbacks.

const entregaveis = [
  'Tudo do acesso online',
  'Vivência presencial com Chris Busato',
  'Prática ao vivo com música',
  'Exercícios em dupla e em grupo',
  'Interação direta e feedback em tempo real',
  'Você sai sabendo brincar dentro da música, não só seguir ela',
]

const feedbacksQuiz = [feedbac1, feedbac2, feedbac3, feedbac4, feedback10, feedback11]

function Tela8Prova({ avancar, voltar, mobile }) {
  return (
    <TelaBase fundo={C.creamCard} mobile={mobile}>
      <BotaoVoltar onClick={voltar} />
      <div style={{ flex: 1, maxWidth: 480, margin: '0 auto', width: '100%', paddingTop: 56, overflowY: 'auto' }}>
        <h2 style={{
          fontFamily: fonteTitulo, fontSize: mobile ? 'clamp(22px, 6.5vw, 27px)' : 29,
          color: C.brown, lineHeight: 1.25, marginBottom: 22, textAlign: 'center',
        }}>
          O que você leva{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>com você.</em>
        </h2>

        <div style={{ marginBottom: 30 }}>
          {entregaveis.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 11,
              padding: '11px 0',
              borderBottom: i < entregaveis.length - 1 ? `1px solid ${C.sageLight}` : 'none',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="8" cy="8" r="7" stroke={C.sage} strokeWidth="1.2" />
                <path d="M5 8l2 2 4-4" stroke={C.sageDark} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: fonteTexto, fontSize: 14.5, color: C.brownMid, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{
          fontFamily: fonteTexto, fontWeight: 600, fontSize: 11, letterSpacing: '2px',
          textTransform: 'uppercase', color: C.sageDark, marginBottom: 14, textAlign: 'center',
        }}>Quem já viveu</div>

        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 20, marginLeft: -22, marginRight: -22, paddingLeft: 22, paddingRight: 22 }}>
          {feedbacksQuiz.map((src, i) => (
            <img key={i} src={src} alt={`Feedback ${i + 1}`} style={{
              height: 220, borderRadius: 12, border: `1px solid ${C.sageLight}`,
              flexShrink: 0, boxShadow: '0 8px 20px rgba(61,53,48,0.10)',
            }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <BotaoContinuar onClick={avancar}>Ver minha oferta →</BotaoContinuar>
      </div>
    </TelaBase>
  )
}

// ─── Tela 9 — Oferta final ──────────────────────────────────────────────────────

const faqsQuiz = [
  {
    q: 'E se eu não gostar? Tenho garantia?',
    a: 'Tem sim. Você conta com uma garantia incondicional de 7 dias, protegida por lei. Se por qualquer motivo a experiência não for para você, é só pedir o reembolso dentro desse prazo e devolvemos 100% do valor, sem burocracia.',
  },
  {
    q: 'Como funciona a inscrição?',
    a: 'Após confirmar o pagamento, você recebe as informações completas sobre data, horário e local da vivência. Vagas são limitadas para garantir a qualidade da experiência.',
  },
  {
    q: 'Preciso ter experiência em dança?',
    a: 'Não necessariamente. A vivência foi pensada para acolher pessoas em diferentes momentos da jornada com a dança, desde quem está começando até quem já tem mais experiência.',
  },
]

function FaqItemQuiz({ item }) {
  const [aberto, setAberto] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${C.sageLight}` }}>
      <button onClick={() => setAberto(v => !v)} style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        padding: '15px 0', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', gap: 12, textAlign: 'left',
      }}>
        <span style={{ fontFamily: fonteTexto, fontWeight: 600, fontSize: 14, color: aberto ? C.sageDark : C.brown }}>{item.q}</span>
        <span style={{
          flexShrink: 0, fontSize: 18, color: C.sage,
          transform: aberto ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s',
        }}>+</span>
      </button>
      {aberto && (
        <p style={{ fontFamily: fonteTexto, fontSize: 13.5, color: C.brownMid, lineHeight: 1.65, paddingBottom: 16 }}>{item.a}</p>
      )}
    </div>
  )
}

function Tela9Oferta({ voltar, mobile }) {
  const [escolha, setEscolha] = useState('presencial')
  const url = escolha === 'presencial' ? CHECKOUT_PRESENCIAL : CHECKOUT_TRANSMISSAO

  return (
    <TelaBase fundo={C.cream} mobile={mobile}>
      <BotaoVoltar onClick={voltar} />
      <div style={{ flex: 1, maxWidth: 480, margin: '0 auto', width: '100%', paddingTop: 56, overflowY: 'auto' }}>
        <h2 style={{
          fontFamily: fonteTitulo, fontSize: mobile ? 'clamp(22px, 6.5vw, 27px)' : 29,
          color: C.brown, lineHeight: 1.25, marginBottom: 6, textAlign: 'center',
        }}>Escolha como participar</h2>
        <p style={{ fontFamily: fonteTexto, fontSize: 13, color: C.brownMid, textAlign: 'center', marginBottom: 22 }}>
          13 de setembro · 10h às 14h
        </p>

        {/* opção presencial */}
        <button onClick={() => setEscolha('presencial')} style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 12,
          background: escolha === 'presencial' ? C.sagePale : C.white,
          border: `1.5px solid ${escolha === 'presencial' ? C.sageDark : C.sageLight}`,
          borderRadius: 16, padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 15, color: C.brown }}>Presencial</span>
            <span style={{ fontFamily: fonteTexto, fontWeight: 800, fontSize: 19, color: C.brown }}>R$120</span>
          </div>
          <span style={{ fontFamily: fonteTexto, fontSize: 13, color: C.brownMid, lineHeight: 1.5 }}>
            Vivência ao vivo com a Chris, em São Paulo.
          </span>
        </button>

        {/* opção transmissão */}
        <button onClick={() => setEscolha('transmissao')} style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 24,
          background: escolha === 'transmissao' ? C.sagePale : C.white,
          border: `1.5px solid ${escolha === 'transmissao' ? C.sageDark : C.sageLight}`,
          borderRadius: 16, padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 15, color: C.brown }}>Transmissão ao vivo</span>
            <span style={{ fontFamily: fonteTexto, fontWeight: 800, fontSize: 19, color: C.brown }}>R$67</span>
          </div>
          <span style={{ fontFamily: fonteTexto, fontSize: 13, color: C.brownMid, lineHeight: 1.5 }}>
            Participe de onde estiver, ao vivo pela internet.
          </span>
        </button>

        <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: 28 }}>
          <BotaoContinuar onClick={() => {}}>Garantir minha vaga →</BotaoContinuar>
        </a>

        {/* garantia */}
        <div style={{
          display: 'flex', gap: 14, alignItems: 'center',
          background: C.creamCard, border: `1px solid ${C.sageLight}`,
          borderRadius: 16, padding: '18px 20px', marginBottom: 24,
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 2.5l7 3v5.5c0 4.6-3 7.9-7 9.5-4-1.6-7-4.9-7-9.5V5.5l7-3z" stroke={C.sageDark} strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M8.5 12l2.4 2.4L15.8 9.5" stroke={C.sageDark} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 14, color: C.brown, marginBottom: 3 }}>Garantia de 7 dias</div>
            <div style={{ fontFamily: fonteTexto, fontSize: 12.5, color: C.brownMid, lineHeight: 1.5 }}>
              Não gostou? Devolvemos 100% do valor, sem burocracia.
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 26 }}>
          {faqsQuiz.map((item, i) => <FaqItemQuiz key={i} item={item} />)}
        </div>

        {/* WhatsApp — abre via window.open() em vez de <a href> estático:
            um script de tracking do site (parte do pacote UTMify) varre e
            reescreve todo link wa.me no DOM, corrompendo a mensagem. */}
        <a
          href={WHATSAPP_LINK}
          onClick={e => { e.preventDefault(); window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer') }}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            background: '#25D366', color: '#fff', textDecoration: 'none',
            padding: '15px 20px', borderRadius: 100, marginBottom: 30,
            fontFamily: fonteTexto, fontWeight: 600, fontSize: 14.5,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0012.05 0z" />
          </svg>
          Falar com a gente no WhatsApp
        </a>
      </div>
    </TelaBase>
  )
}

// ─── Componente raiz — máquina de estados das 9 telas ──────────────────────────

export default function QuizLP() {
  const [etapa, setEtapa] = useState(1)
  const mobile = useWindowWidth() < 768

  const avancar = () => setEtapa(e => Math.min(e + 1, TOTAL_TELAS))
  const voltar = () => setEtapa(e => Math.max(e - 1, 1))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [etapa])

  const telas = {
    1: <Tela1Promessa avancar={avancar} mobile={mobile} />,
    2: <Tela2VSL avancar={avancar} mobile={mobile} />,
    3: <Tela3Crenca avancar={avancar} voltar={voltar} mobile={mobile} />,
    4: <Tela4Inimigo avancar={avancar} voltar={voltar} mobile={mobile} />,
    5: <Tela5WhatsApp avancar={avancar} voltar={voltar} mobile={mobile} />,
    6: <Tela6Metodo avancar={avancar} voltar={voltar} mobile={mobile} />,
    7: <Tela7Voucher avancar={avancar} voltar={voltar} mobile={mobile} />,
    8: <Tela8Prova avancar={avancar} voltar={voltar} mobile={mobile} />,
    9: <Tela9Oferta voltar={voltar} mobile={mobile} />,
  }

  return (
    <>
      <style>{globalStyles}</style>
      <BarraProgresso etapa={etapa} mobile={mobile} />
      {telas[etapa]}
    </>
  )
}
