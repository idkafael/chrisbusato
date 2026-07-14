import { useState, useEffect, useRef } from 'react'
import chrisSorrindo from './images/chris-sorrindo.jpg'

// ─── Imagens ──────────────────────────────────────────────────────────────────
import capaMusicalidade from './images/Capa-Musicalidade.png'
import capaMusicalizacao from './images/Capa-Musicalizacao.png'
import capaConsciencia from './images/Capa-Conciencia.png'
import capaVergonha from './images/Capa-Vergonha.png'
import fundoHero from './images/fundo-primeira-dobra.jpg'
import bannerPlataforma from './images/banner-plataforma.jpg'
import encontrosAoVivo from './images/encontrosaovivo.png'

// ─── Tokens (paleta da marca) ─────────────────────────────────────────────────

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
}

const CHECKOUT_URL = '#' // TODO: link de pagamento do Programa Online (Cakto)

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.cream}; overflow-x: hidden; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes livePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(232,83,74,0.5); }
    70%       { box-shadow: 0 0 0 7px rgba(232,83,74,0); }
  }
`

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true)
    }, { threshold: 0.12, ...options })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, inView]
}

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])
  return width
}

// ─── Ícones (SVG de traço — renderizam igual em qualquer dispositivo) ─────────

function Icon({ path, size = 15, color = 'currentColor', stroke = 1.6, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={{ flexShrink: 0, display: 'block' }}>
      {path(color, stroke)}
    </svg>
  )
}

const icons = {
  gift: (c, s) => (<g stroke={c} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12" />
    <path d="M12 8S10.5 4 8.5 4 6 6 8 8m4 0s1.5-4 3.5-4S18 6 16 8" />
  </g>),
  calendar: (c, s) => (<g stroke={c} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4.5" width="18" height="17" rx="2.5" /><path d="M3 9h18M8 2.5v4M16 2.5v4" />
  </g>),
  rotate: (c, s) => (<g stroke={c} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11a8 8 0 0 1 14-5l2 2M20 13a8 8 0 0 1-14 5l-2-2" /><path d="M20 3v5h-5M4 21v-5h5" />
  </g>),
  devices: (c, s) => (<g stroke={c} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="14" height="11" rx="1.5" /><path d="M2 18h11" /><rect x="16" y="9" width="6" height="11" rx="1.5" />
  </g>),
  clock: (c, s) => (<g stroke={c} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />
  </g>),
  plus: (c, s) => (<g stroke={c} strokeWidth={s} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></g>),
  check: (c, s) => (<g stroke={c} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></g>),
}

// ─── CTA reutilizável ───────────────────────────────────────────────────────

function CtaButton({ children, mobile, full = false, href = CHECKOUT_URL }) {
  const isAnchor = href.charAt(0) === '#' && href.length > 1
  return (
    <a
      href={href}
      {...(isAnchor ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      style={{
        display: full ? 'block' : 'inline-block',
        width: full ? '100%' : 'auto',
        background: C.sage, color: C.white,
        fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
        fontSize: mobile ? 16 : 17, letterSpacing: '0.2px',
        padding: mobile ? '17px 36px' : '19px 48px',
        borderRadius: 100, textDecoration: 'none', textAlign: 'center',
        boxShadow: '0 8px 28px rgba(107,127,109,0.35)',
        transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = C.sageDark; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(107,127,109,0.45)' }}
      onMouseLeave={e => { e.currentTarget.style.background = C.sage; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(107,127,109,0.35)' }}
    >
      {children}
    </a>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const w = useWindowWidth()
  const mobile = w < 768

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handle)
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      background: 'rgba(237,234,227,0.85)',
      boxShadow: scrolled ? '0 1px 24px rgba(61,53,48,0.08)' : 'none',
      transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      borderBottom: scrolled ? `1px solid ${C.sageLight}` : '1px solid transparent',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: mobile ? '0 20px' : '0 40px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 17 : 20, color: C.brown, letterSpacing: '-0.3px',
          whiteSpace: 'nowrap',
        }}>
          Programa Online · Brincando na Música
        </span>
        {!mobile && (
          <a href="#oferta" style={{
            position: 'absolute', right: 40,
            background: C.sage, color: C.white,
            padding: '10px 22px', borderRadius: 100,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            textDecoration: 'none', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = C.sageDark}
            onMouseLeave={e => e.currentTarget.style.background = C.sage}
          >
            Quero participar
          </a>
        )}
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.cream,
      position: 'relative',
      overflow: 'hidden',
      padding: mobile ? '110px 24px 80px' : '120px 40px',
      minHeight: mobile ? 'auto' : '100vh',
      display: 'flex', alignItems: 'center',
    }}>
      {/* Imagem de fundo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${fundoHero})`,
        backgroundSize: 'cover',
        backgroundPosition: mobile ? 'center' : 'center right',
        pointerEvents: 'none',
      }} />
      {/* Overlay para legibilidade */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: mobile
          ? 'linear-gradient(to bottom, rgba(237,234,227,0.9) 0%, rgba(237,234,227,0.55) 50%, rgba(237,234,227,0.2) 100%)'
          : 'linear-gradient(to right, rgba(237,234,227,0.95) 0%, rgba(237,234,227,0.82) 38%, rgba(237,234,227,0.3) 70%, rgba(237,234,227,0) 100%)',
      }} />

      <div style={{
        maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1,
        width: '100%',
      }}>
        <div style={{
          animation: 'fadeUp 0.8s ease both',
          textAlign: mobile ? 'center' : 'left',
          maxWidth: mobile ? '100%' : 580,
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(34px, 9vw, 48px)' : 'clamp(42px, 4.4vw, 62px)',
            color: C.brown, lineHeight: 1.15, letterSpacing: '-1px',
            marginBottom: 22,
          }}>
            Evolua na dança com a Chris,{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>ao vivo, toda semana.</em>
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 16 : 19, color: C.brownMid, lineHeight: 1.7,
            maxWidth: 480, margin: mobile ? '0 auto 32px' : '0 0 32px',
          }}>
            O Programa Online Brincando na Música: encontros ao vivo duas vezes por semana, prática guiada e um ano inteiro de acesso à plataforma de cursos como bônus.
          </p>

          <div>
            <CtaButton mobile={mobile} href="#encontros">Como funciona o programa →</CtaButton>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Cards de público ─────────────────────────────────────────────────────────

const publicos = [
  {
    n: '01', nivel: 'Começando', icon: '🌱',
    titulo: 'Quem está começando',
    bullets: [
      'Não sabe por onde começar e quer um caminho organizado',
      'Trava na hora de soltar o corpo e seguir a música',
    ],
  },
  {
    n: '02', nivel: 'Evoluindo', icon: '💃',
    titulo: 'Quem já dança',
    bullets: [
      'Sente que estagnou e quer destravar para o próximo nível',
      'Quer dançar com mais musicalidade e presença, não só passos',
    ],
  },
  {
    n: '03', nivel: 'Ensinando', icon: '🎓',
    titulo: 'Professores de dança',
    bullets: [
      'Quer uma base metodológica para diferenciar o próprio ensino',
      'Busca referências de musicalidade e consciência corporal',
    ],
  },
]

function PublicoSection() {
  const [titleRef, titleInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section id="para-quem" style={{
      background: C.white,
      padding: mobile ? '72px 24px' : '100px 40px',
      position: 'relative', zIndex: 3,
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: mobile ? 48 : 72,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(24px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 18,
          }}>Para quem é</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(28px, 7vw, 38px)' : 'clamp(32px, 3.6vw, 48px)',
            color: C.brown, lineHeight: 1.2, letterSpacing: '-0.5px',
          }}>
            Três níveis,{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>um só caminho.</em>
          </h2>
        </div>

        <div style={{
          position: 'relative',
          display: mobile ? 'flex' : 'grid',
          flexDirection: mobile ? 'column' : undefined,
          gridTemplateColumns: mobile ? undefined : 'repeat(3, 1fr)',
          gap: mobile ? 0 : 32,
        }}>
          <div style={{
            position: 'absolute',
            background: `linear-gradient(${mobile ? '180deg' : '90deg'}, ${C.sageLight} 0%, ${C.sage} 50%, ${C.sageLight} 100%)`,
            ...(mobile
              ? { left: 31, top: 32, bottom: 32, width: 2 }
              : { top: 32, left: '17%', right: '17%', height: 2 }),
            pointerEvents: 'none',
          }} />
          {publicos.map((p, i) => <NivelItem key={i} p={p} delay={i * 120} mobile={mobile} />)}
        </div>
      </div>
    </section>
  )
}

function NivelItem({ p, delay, mobile }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      position: 'relative', zIndex: 1,
      display: 'flex',
      flexDirection: mobile ? 'row' : 'column',
      alignItems: mobile ? 'flex-start' : 'center',
      textAlign: mobile ? 'left' : 'center',
      gap: mobile ? 20 : 0,
      paddingBottom: mobile ? 44 : 0,
      transition: 'opacity 0.7s ease, transform 0.7s ease',
      transitionDelay: `${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(24px)',
    }}>
      <div style={{
        flexShrink: 0,
        width: 64, height: 64, borderRadius: '50%',
        background: `linear-gradient(150deg, ${C.sage} 0%, ${C.sageDark} 100%)`,
        boxShadow: '0 10px 26px rgba(107,127,109,0.35)',
        border: `4px solid ${C.white}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: mobile ? 0 : 22,
      }}>
        <span style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 700,
          fontSize: 24, color: C.white, fontStyle: 'italic',
        }}>{p.n}</span>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
          fontSize: 11, letterSpacing: '1.5px', color: C.sage,
          textTransform: 'uppercase', marginBottom: 8,
        }}>Nível {p.n} · {p.nivel}</div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 21 : 23, color: C.brown,
          marginBottom: 14, lineHeight: 1.2,
        }}>{p.titulo}</h3>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10,
          maxWidth: mobile ? '100%' : 280,
          margin: mobile ? 0 : '0 auto',
        }}>
          {p.bullets.map((b, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left',
            }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                <circle cx="7.5" cy="7.5" r="6.5" stroke={C.sageLight} strokeWidth="1"/>
                <path d="M5 7.5l1.8 1.8 3.2-3.4" stroke={C.sageDark} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: 14.5, color: C.brownMid, lineHeight: 1.55,
              }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── O que é o programa ───────────────────────────────────────────────────────

function SobreSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '72px 24px' : '100px 40px',
    }}>
      <div ref={ref} style={{
        maxWidth: 760, margin: '0 auto', textAlign: 'center',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '2.5px', color: C.sage,
          textTransform: 'uppercase', marginBottom: 18,
        }}>O programa</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(26px, 7vw, 36px)' : 'clamp(30px, 3.4vw, 46px)',
          color: C.brown, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 28,
        }}>
          Não é curso solto.{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>É acompanhamento ao vivo.</em>
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: mobile ? 16 : 19, color: C.brownMid, lineHeight: 1.75,
          marginBottom: 20,
        }}>
          No Programa Online você dança junto com a Chris duas vezes por semana, ao vivo, com prática guiada, correções e uma comunidade que evolui junto com você.
        </p>
        <p style={{
          fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
          fontSize: mobile ? 18 : 22, color: C.brownMid, lineHeight: 1.6,
        }}>
          E ainda leva 1 ano inteiro de acesso à plataforma de cursos como bônus.
        </p>
      </div>
    </section>
  )
}

// ─── Encontros ao vivo (destaque) ─────────────────────────────────────────────

function EncontrosAoVivoSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  const horarios = [
    { dia: 'Segunda-feira', hora: '20h', nota: 'Encontro fixo toda semana', icon: icons.calendar },
    { dia: 'Dia rotativo', hora: 'atualmente quarta · 8h30', nota: 'Horário alternativo para caber na sua rotina', icon: icons.rotate },
  ]

  return (
    <section id="encontros" style={{
      background: C.white,
      padding: mobile ? '72px 24px' : '100px 40px',
    }}>
      <div ref={ref} style={{
        maxWidth: 1000, margin: '0 auto',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 18,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#E8534A',
              display: 'block', animation: 'livePulse 2s ease-out infinite',
            }} />
            Ao vivo, toda semana
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(28px, 7vw, 38px)' : 'clamp(32px, 3.6vw, 48px)',
            color: C.brown, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 16,
          }}>
            Você não caminha sozinho:{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>dança junto com a Chris.</em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 15 : 17, color: C.brownMid, maxWidth: 560,
            margin: '0 auto', lineHeight: 1.65,
          }}>
            São <strong style={{ fontWeight: 600, color: C.brown }}>2 encontros ao vivo por semana</strong>, com prática guiada e espaço para tirar dúvidas. Escolha o horário que melhor cabe na sua rotina.
          </p>
        </div>

        {/* imagem dos encontros */}
        <div style={{
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(61,53,48,0.18)',
          marginBottom: 32,
        }}>
          <img
            src={encontrosAoVivo}
            alt="Encontros ao vivo do Programa Online"
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* horários */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: mobile ? 14 : 20,
        }}>
          {horarios.map((h, i) => (
            <div key={i} style={{
              background: C.creamCard,
              border: `1px solid ${C.sageLight}`,
              borderRadius: 16,
              padding: mobile ? '22px 22px' : '26px 28px',
              display: 'flex', gap: 16, alignItems: 'flex-start',
            }}>
              <div style={{
                flexShrink: 0,
                width: 44, height: 44, borderRadius: 12,
                background: C.sagePale,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon path={h.icon} size={22} color={C.sageDark} stroke={1.6} />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20, color: C.brown, marginBottom: 4, lineHeight: 1.2,
                }}>{h.dia}</div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                  fontSize: 15, color: C.sageDark, marginBottom: 8,
                }}>{h.hora}</div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                  fontSize: 13.5, color: C.brownMid, lineHeight: 1.5,
                }}>{h.nota}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Bônus: plataforma de cursos ──────────────────────────────────────────────

const modulos = [
  { titulo: 'Musicalidade', tag: 'Curso gravado', desc: 'Como se mover na música sem depender de passos decorados.', cover: capaMusicalidade },
  { titulo: 'Musicalização', tag: 'Curso gravado', desc: 'Ritmo, tempo e estrutura musical para nunca mais dançar fora do tempo.', cover: capaMusicalizacao },
  { titulo: 'Consciência Corporal', tag: 'Curso gravado', desc: 'Postura, eixo e expressão para dançar com mais liberdade.', cover: capaConsciencia },
  { titulo: 'A Vergonha na Dança', tag: 'Aulão', desc: 'Destrave o medo de dançar e de ser visto se movimentando.', cover: capaVergonha },
]

function BonusSection() {
  const [titleRef, titleInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.brown,
      padding: mobile ? '72px 24px' : '100px 40px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-12%', right: '-8%',
        width: 320, height: 320, background: C.sageDark,
        borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%',
        opacity: 0.25, pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: 48,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(24px)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(196,208,197,0.14)',
            border: '1px solid rgba(196,208,197,0.3)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 18,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: 11, letterSpacing: '2px', color: C.sageLight,
            textTransform: 'uppercase',
          }}>
            <Icon path={icons.gift} size={13} color={C.sageLight} stroke={1.7} />
            Bônus incluso
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(26px, 7vw, 36px)' : 'clamp(30px, 3.4vw, 46px)',
            color: C.cream, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 16,
          }}>
            1 ano de acesso à{' '}
            <em style={{ color: C.sageLight, fontStyle: 'italic' }}>plataforma de cursos.</em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 15 : 17, color: 'rgba(237,234,227,0.78)', maxWidth: 560,
            margin: '0 auto', lineHeight: 1.65,
          }}>
            Quem entra no programa recebe, de brinde, um ano inteiro na plataforma com todos os cursos gravados para estudar no seu ritmo.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: mobile ? 14 : 24,
          maxWidth: 760, margin: '0 auto',
        }}>
          {modulos.map((m, i) => <ModuloCard key={i} m={m} delay={i * 80} mobile={mobile} />)}
        </div>
      </div>
    </section>
  )
}

function ModuloCard({ m, delay, mobile }) {
  const [ref, inView] = useInView()
  const [hovered, setHovered] = useState(false)
  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16, overflow: 'hidden',
        background: C.creamCard,
        border: `1px solid ${C.sageLight}`,
        cursor: 'default',
        display: 'flex', flexDirection: 'column',
        transition: 'opacity 0.7s ease, transform 0.45s ease, box-shadow 0.3s ease',
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? (hovered ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(24px)',
        boxShadow: hovered ? '0 22px 48px rgba(0,0,0,0.28)' : '0 4px 16px rgba(0,0,0,0.12)',
      }}>
      <div style={{ overflow: 'hidden' }}>
        <img src={m.cover} alt={m.titulo}
          style={{
            width: '100%', display: 'block',
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }} />
      </div>
      <div style={{ padding: mobile ? '14px 14px 18px' : '18px 20px 22px' }}>
        <div style={{
          display: 'inline-block',
          background: C.sagePale, color: C.sageDark,
          borderRadius: 100, padding: '3px 11px', marginBottom: 10,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
          fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase',
        }}>{m.tag}</div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 17 : 20, color: C.brown,
          lineHeight: 1.2, marginBottom: 6,
        }}>{m.titulo}</h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: mobile ? 12.5 : 14, color: C.brownMid, lineHeight: 1.55,
        }}>{m.desc}</p>
      </div>
    </div>
  )
}

// ─── Por dentro da plataforma ─────────────────────────────────────────────────

function PorDentroSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '72px 24px' : '100px 40px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '8%', left: '-6%',
        width: 260, height: 260, background: C.sageLight,
        borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%',
        opacity: 0.22, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-8%', right: '-5%',
        width: 320, height: 320, background: C.sageLight,
        borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%',
        opacity: 0.18, pointerEvents: 'none',
      }} />

      <div ref={ref} style={{
        maxWidth: 940, margin: '0 auto', position: 'relative', zIndex: 1,
        textAlign: 'center',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '2.5px', color: C.sage,
          textTransform: 'uppercase', marginBottom: 18,
        }}>A plataforma que vem junto</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(28px, 7vw, 38px)' : 'clamp(32px, 3.6vw, 48px)',
          color: C.brown, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 16,
        }}>
          Veja a plataforma{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>por dentro.</em>
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: mobile ? 15 : 17, color: C.brownMid, maxWidth: 480,
          margin: '0 auto 44px', lineHeight: 1.65,
        }}>
          Além dos encontros ao vivo, você tem uma área de membros organizada e linda para revisitar tudo no seu ritmo.
        </p>

        <div style={{
          borderRadius: 16, overflow: 'hidden',
          background: C.white,
          border: `1px solid ${C.sageLight}`,
          boxShadow: '0 30px 70px rgba(61,53,48,0.20)',
          maxWidth: 820, margin: '0 auto',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: mobile ? '10px 14px' : '12px 18px',
            background: C.creamCard,
            borderBottom: `1px solid ${C.sageLight}`,
          }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#E8534A', display: 'block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#E6B450', display: 'block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: C.sage, display: 'block' }} />
            <div style={{
              flex: 1, margin: '0 auto', maxWidth: 320,
              background: C.white, border: `1px solid ${C.sageLight}`,
              borderRadius: 100, padding: '4px 14px',
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              color: C.brownLight, textAlign: 'center',
              marginLeft: mobile ? 8 : 24,
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}>plataforma.chrisbusato.com</div>
          </div>
          <img src={bannerPlataforma} alt="Interior da plataforma de cursos da Chris Busato"
            style={{ width: '100%', display: 'block' }} />
        </div>

        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: 12, marginTop: 36,
        }}>
          {[
            { icon: icons.devices, label: 'Assista no celular ou computador' },
            { icon: icons.clock, label: 'Acesso 24h por dia' },
            { icon: icons.plus, label: 'Conteúdo novo sempre' },
          ].map((t, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.white, border: `1px solid ${C.sageLight}`,
              borderRadius: 100, padding: '9px 18px',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 13.5, color: C.brownMid,
            }}>
              <Icon path={t.icon} size={15} color={C.sage} stroke={1.7} />
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Antes / Depois ───────────────────────────────────────────────────────────

const transformacoes = [
  { antes: 'Dança contando os passos na cabeça, sem sentir a música', depois: 'Ouve a música e o corpo responde com naturalidade' },
  { antes: 'Trava quando alguém olha ou quando precisa improvisar', depois: 'Dança com presença, mesmo sem decorar coreografia' },
  { antes: 'Estuda sozinho e desanima sem acompanhamento', depois: 'Evolui toda semana com a Chris ao vivo e uma turma junto' },
  { antes: 'Sente que o corpo é "duro" e não responde do jeito que queria', depois: 'Tem consciência do próprio corpo e dança com liberdade' },
]

function AntesDepoisSection() {
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '72px 24px' : '110px 40px',
    }}>
      <div style={{
        maxWidth: 1080, margin: '0 auto',
        display: mobile ? 'block' : 'grid',
        gridTemplateColumns: mobile ? undefined : '0.85fr 1.15fr',
        gap: mobile ? 0 : 64,
        alignItems: 'start',
      }}>
        <div style={{
          position: mobile ? 'static' : 'sticky',
          top: mobile ? undefined : 110,
          marginBottom: mobile ? 44 : 0,
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 18,
          }}>A transformação</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(28px, 7vw, 38px)' : 'clamp(30px, 3.2vw, 46px)',
            color: C.brown, lineHeight: 1.18, letterSpacing: '-0.5px', marginBottom: 20,
          }}>
            De onde você está{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>para onde quer chegar.</em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 15 : 17, color: C.brownMid, lineHeight: 1.65,
            maxWidth: 360,
          }}>
            Com acompanhamento ao vivo toda semana, a evolução deixa de depender só da sua força de vontade.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? 16 : 20 }}>
          {transformacoes.map((t, i) => <TransformRow key={i} t={t} index={i} mobile={mobile} />)}
        </div>
      </div>
    </section>
  )
}

function TransformRow({ t, index, mobile }) {
  const [ref, inView] = useInView()
  const [hovered, setHovered] = useState(false)
  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 18, overflow: 'hidden',
        background: C.white,
        border: `1px solid ${C.sageLight}`,
        boxShadow: hovered ? '0 18px 40px rgba(61,53,48,0.12)' : '0 3px 14px rgba(61,53,48,0.05)',
        transition: 'opacity 0.7s ease, transform 0.6s ease, box-shadow 0.3s ease',
        transitionDelay: `${index * 90}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? (hovered ? 'translateY(-3px)' : 'translateY(0)') : 'translateY(22px)',
      }}>
      <div style={{
        position: 'absolute', top: -14, right: 14,
        fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
        fontSize: 88, color: C.sagePale, lineHeight: 1,
        pointerEvents: 'none', userSelect: 'none', zIndex: 0,
      }}>{String(index + 1).padStart(2, '0')}</div>

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex',
        flexDirection: mobile ? 'column' : 'row',
      }}>
        <div style={{ flex: 1, padding: mobile ? '22px 22px 18px' : '26px 26px' }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: 10, letterSpacing: '1.5px', color: C.brownLight,
            textTransform: 'uppercase', marginBottom: 8,
          }}>Hoje</div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 14.5, color: C.brownLight, lineHeight: 1.5,
          }}>{t.antes}</span>
        </div>

        <div style={{
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: mobile ? '0' : '0 4px',
          alignSelf: 'center',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: `linear-gradient(150deg, ${C.sage} 0%, ${C.sageDark} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(107,127,109,0.35)',
            transform: mobile ? 'rotate(90deg)' : 'none',
            margin: mobile ? '-2px 0' : 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke={C.white} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div style={{
          flex: 1, padding: mobile ? '18px 22px 22px' : '26px 26px',
          background: C.sagePale,
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: 10, letterSpacing: '1.5px', color: C.sageDark,
            textTransform: 'uppercase', marginBottom: 8,
          }}>Com o programa</div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            fontSize: 14.5, color: C.brown, lineHeight: 1.5,
          }}>{t.depois}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Oferta / Preço ───────────────────────────────────────────────────────────

const incluso = [
  '2 encontros ao vivo por semana com a Chris',
  'Prática guiada e correções em tempo real',
  'Comunidade que evolui junto com você',
  'Bônus: 1 ano de acesso à plataforma de cursos',
  'Todos os cursos gravados (Musicalidade, Musicalização, Consciência Corporal e mais)',
]

function OfertaSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section id="oferta" style={{
      background: C.cream,
      padding: mobile ? '72px 24px 88px' : '100px 40px 120px',
    }}>
      <div ref={ref} style={{
        maxWidth: 560, margin: '0 auto', textAlign: 'center',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '2.5px', color: C.sage,
          textTransform: 'uppercase', marginBottom: 18,
        }}>Vagas abertas</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(28px, 8vw, 40px)' : 'clamp(32px, 3.6vw, 50px)',
          color: C.brown, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 44,
        }}>
          Ao vivo com a Chris.{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>Toda semana.</em>
        </h2>

        <div style={{
          background: C.white, border: `1.5px solid ${C.sageLight}`,
          borderRadius: 24, padding: mobile ? '36px 26px' : '48px 52px',
          boxShadow: '0 16px 50px rgba(61,53,48,0.08)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: C.sagePale, color: C.sageDark,
            borderRadius: 100, padding: '6px 15px', marginBottom: 20,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            <Icon path={icons.gift} size={14} color={C.sageDark} stroke={1.7} />
            1 ano de plataforma incluso
          </div>

          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: mobile ? 44 : 54, color: C.brown, lineHeight: 1,
            letterSpacing: '-1px', marginBottom: 6,
          }}>R$ —</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 14, color: C.brownLight, marginBottom: 32,
          }}>valor do programa · em breve</div>

          <div style={{ textAlign: 'left', marginBottom: 32 }}>
            {incluso.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '11px 0',
                borderBottom: i < incluso.length - 1 ? `1px solid ${C.cream}` : 'none',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                  <circle cx="8" cy="8" r="7" stroke={C.sage} strokeWidth="1.1"/>
                  <path d="M5 8l2 2 4-4" stroke={C.sageDark} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                  fontSize: 15, color: C.brownMid, lineHeight: 1.5,
                }}>{item}</span>
              </div>
            ))}
          </div>

          <CtaButton mobile={mobile} full>Quero entrar no programa →</CtaButton>
        </div>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: 13, color: C.brownLight, marginTop: 22, lineHeight: 1.6,
        }}>
          Acesso imediato · Pagamento 100% seguro
        </p>
      </div>
    </section>
  )
}

// ─── Chris (autoridade) ───────────────────────────────────────────────────────

function ChrisSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.white,
      padding: mobile ? '72px 24px' : '100px 40px',
    }}>
      <div ref={ref} style={{
        maxWidth: 820, margin: '0 auto',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '320px 1fr',
        gap: mobile ? 32 : 56, alignItems: 'center',
      }}>
        <div style={{
          aspectRatio: '4/5', borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(61,53,48,0.18)',
        }}>
          <img src={chrisSorrindo} alt="Chris Busato"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 16,
          }}>Quem conduz</div>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 30 : 40, color: C.brown, marginBottom: 20, lineHeight: 1.15,
          }}>Chris Busato</h3>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 16 : 17, color: C.brownMid, lineHeight: 1.75, marginBottom: 22,
          }}>
            Educadora de dança e criadora do método Corpo Musical. Há mais de dez anos, Chris ajuda pessoas a dançarem com mais liberdade, presença e musicalidade — agora ao vivo, toda semana, guiando você de perto.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              '+10 anos como educadora de dança',
              'Criadora do método Corpo Musical',
              'Referência em musicalidade e consciência corporal',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.sage, flexShrink: 0 }} />
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                  fontSize: 14, color: C.brownLight,
                }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqItems = [
  {
    q: 'Como funcionam os encontros ao vivo?',
    a: 'São 2 encontros ao vivo por semana com a Chris: um fixo às segundas-feiras, 20h, e outro em horário alternativo (atualmente quarta-feira, 8h30). Você participa do que couber melhor na sua rotina, com prática guiada e espaço para dúvidas.',
  },
  {
    q: 'E se eu não puder participar ao vivo?',
    a: 'Sem problema. Além dos dois horários por semana, você tem 1 ano de acesso à plataforma com os cursos gravados para estudar quando quiser.',
  },
  {
    q: 'O que é o bônus de 1 ano de plataforma?',
    a: 'Quem entra no programa recebe um ano inteiro de acesso à plataforma de cursos da Chris — Musicalidade, Musicalização, Consciência Corporal e mais — para revisitar no seu ritmo.',
  },
  {
    q: 'Preciso ter experiência em dança?',
    a: 'Não. O programa foi pensado para todos os níveis: de quem está começando do zero a professores que querem aprofundar a metodologia.',
  },
  {
    q: 'É tudo online?',
    a: 'Sim. Os encontros acontecem ao vivo pela internet e você participa de onde estiver, no celular ou no computador.',
  },
  {
    q: 'Posso parcelar?',
    a: 'Sim. Você pode pagar à vista ou parcelar no cartão. As condições aparecem na hora do checkout.',
  },
]

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false)
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <div ref={ref} style={{
      borderBottom: `1px solid ${C.sageLight}`,
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      transitionDelay: `${index * 60}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(16px)',
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        padding: '24px 0', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', gap: 16, textAlign: 'left',
      }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: mobile ? 15 : 16, color: open ? C.sageDark : C.brown,
          lineHeight: 1.4, transition: 'color 0.2s ease',
        }}>{item.q}</span>
        <div style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
          border: `1px solid ${open ? C.sage : C.sageLight}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.2s ease, transform 0.3s ease',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke={open ? C.sageDark : C.sage} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </button>
      {open && (
        <div style={{
          paddingBottom: 24,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: mobile ? 15 : 16, color: C.brownMid, lineHeight: 1.7,
        }}>{item.a}</div>
      )}
    </div>
  )
}

function FaqSection() {
  const [titleRef, titleInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '72px 24px' : '100px 40px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          marginBottom: 44, textAlign: 'center',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(24px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 14,
          }}>Dúvidas</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(26px, 7vw, 36px)' : 'clamp(30px, 3.4vw, 44px)',
            color: C.brown, letterSpacing: '-0.5px',
          }}>Perguntas frequentes</h2>
        </div>
        {faqItems.map((item, i) => <FaqItem key={i} item={item} index={i} />)}

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <CtaButton mobile={mobile} href="#oferta">Quero entrar no programa →</CtaButton>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const w = useWindowWidth()
  const mobile = w < 768
  return (
    <footer style={{
      background: C.brown,
      padding: mobile ? '40px 24px' : '48px 40px', textAlign: 'center',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
        fontSize: 18, color: C.sageLight, marginBottom: 12,
      }}>Chris Busato</div>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
        fontSize: 12, color: 'rgba(237,234,227,0.4)', letterSpacing: '0.3px',
      }}>
        © {new Date().getFullYear()} · Todos os direitos reservados
      </p>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function ProgramaOnlineLP() {
  return (
    <>
      <style>{globalStyles}</style>
      <Navbar />
      <Hero />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <PublicoSection />
        <SobreSection />
        <EncontrosAoVivoSection />
        <BonusSection />
        <PorDentroSection />
        <AntesDepoisSection />
        <OfertaSection />
        <ChrisSection />
        <FaqSection />
        <Footer />
      </div>
    </>
  )
}
