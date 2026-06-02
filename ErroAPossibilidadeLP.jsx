import { useState, useEffect, useRef } from 'react'

// ─── Tokens (mesmo padrão das outras páginas) ─────────────────────────────────

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
  // Extras para essa página — tom mais noturno/misterioso
  ink: '#1C1916',
  inkMid: '#2E2924',
  gold: '#C4A96B',
  goldLight: '#DFC99A',
  goldPale: '#F5EDDA',
}

// ─── Keyframes ────────────────────────────────────────────────────────────────

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.ink}; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 0.8; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
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
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      background: scrolled ? 'rgba(28,25,22,0.92)' : 'rgba(28,25,22,0)',
      borderBottom: scrolled ? '1px solid rgba(196,169,107,0.15)' : '1px solid transparent',
      transition: 'background 0.4s ease, border-color 0.4s ease',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: mobile ? '0 24px' : '0 40px',
        height: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: mobile ? 15 : 17,
          color: C.goldLight,
          letterSpacing: '0.5px',
        }}>
          Chris Busato
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      minHeight: '100vh',
      background: `linear-gradient(160deg, ${C.ink} 0%, ${C.inkMid} 60%, #1a1208 100%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: mobile ? '120px 24px 80px' : '140px 40px 100px',
      position: 'relative', overflow: 'hidden',
      textAlign: 'center',
    }}>
      {/* Glow de fundo */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: mobile ? 300 : 600, height: mobile ? 300 : 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,169,107,0.08) 0%, transparent 70%)',
        animation: 'glowPulse 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Título */}
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: mobile ? 'clamp(36px, 10vw, 52px)' : 'clamp(44px, 5vw, 70px)',
        lineHeight: 1.1,
        letterSpacing: '-1px',
        color: C.cream,
        maxWidth: 820,
        marginBottom: 20,
        animation: 'fadeUp 0.7s 0.1s ease both',
      }}>
        Do Erro{' '}
        <em style={{
          color: C.gold,
          fontStyle: 'italic',
          display: 'block',
        }}>à Possibilidade.</em>
      </h1>

      {/* Subtítulo */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
        fontSize: mobile ? 16 : 19,
        color: 'rgba(237,234,227,0.6)',
        lineHeight: 1.65,
        maxWidth: 520,
        marginBottom: 40,
        animation: 'fadeUp 0.7s 0.2s ease both',
      }}>
        Aprenda a lidar com o erro sem perder a dança, a conexão e a liberdade.
      </p>

      {/* VSL */}
      <div style={{
        width: '100%',
        maxWidth: mobile ? '100%' : 780,
        marginBottom: 40,
        animation: 'fadeUp 0.7s 0.3s ease both',
        borderRadius: mobile ? 14 : 20,
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
        border: '1px solid rgba(196,169,107,0.12)',
        aspectRatio: '16/9',
        background: '#0e0b08',
        position: 'relative',
      }}>
        {/* placeholder — substituir pelo embed do vturb/converteai quando disponível */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <div style={{
            width: mobile ? 60 : 72, height: mobile ? 60 : 72,
            borderRadius: '50%',
            background: 'rgba(196,169,107,0.12)',
            border: `1.5px solid rgba(196,169,107,0.35)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
              <path d="M2 1.5l19 11L2 23.5V1.5z" fill={C.gold} stroke={C.gold} strokeWidth="1" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 12, letterSpacing: '1.5px',
            color: 'rgba(196,169,107,0.35)', textTransform: 'uppercase',
          }}>vídeo em breve</p>
        </div>
      </div>

      {/* CTA */}
      <a
        href="#inscricao"
        style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${C.gold} 0%, #a8863d 100%)`,
          color: C.ink,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
          fontSize: mobile ? 15 : 16,
          letterSpacing: '0.3px',
          padding: mobile ? '16px 36px' : '18px 48px',
          borderRadius: 100,
          textDecoration: 'none',
          boxShadow: `0 8px 32px rgba(196,169,107,0.35)`,
          animation: 'fadeUp 0.7s 0.4s ease both',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = `0 12px 40px rgba(196,169,107,0.45)`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(196,169,107,0.35)`
        }}
      >
        Quero participar
      </a>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        opacity: 0.35,
        animation: 'fadeUp 1s 0.8s ease both',
      }}>
        <div style={{
          width: 1, height: 40,
          background: `linear-gradient(to bottom, transparent, ${C.gold})`,
        }} />
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: 10, letterSpacing: '2px', color: C.goldLight,
          textTransform: 'uppercase',
        }}>Descer</div>
      </div>
    </section>
  )
}

// ─── Statement bold ───────────────────────────────────────────────────────────

function StatementSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.inkMid,
      padding: mobile ? '80px 24px' : '112px 40px',
      borderTop: '1px solid rgba(196,169,107,0.1)',
    }}>
      <div ref={ref} style={{
        maxWidth: 820, margin: '0 auto', textAlign: 'center',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(28px, 8vw, 40px)' : 'clamp(36px, 4vw, 56px)',
          color: C.cream, lineHeight: 1.2,
          letterSpacing: '-0.5px', marginBottom: 20,
        }}>
          O erro existe.{' '}
          <em style={{ color: C.gold, fontStyle: 'italic' }}>
            E isso é uma ótima notícia.
          </em>
        </h2>

        <div style={{
          width: 40, height: 1,
          background: `rgba(196,169,107,0.4)`,
          margin: '28px auto',
        }} />

        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: mobile ? 18 : 22,
          color: 'rgba(237,234,227,0.55)',
          lineHeight: 1.6, maxWidth: 620, margin: '0 auto 24px',
        }}>
          "O problema não é o erro. É não saber o que fazer com ele."
        </p>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: mobile ? 15 : 17,
          color: 'rgba(237,234,227,0.5)',
          lineHeight: 1.7, maxWidth: 560, margin: '0 auto',
        }}>
          Nessa aula, Chris Busato vai mostrar como transformar o erro em informação, em movimento, em criatividade — em vez de bloqueio.
        </p>
      </div>
    </section>
  )
}

// ─── O que é ──────────────────────────────────────────────────────────────────

function OQueESection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.ink,
      padding: mobile ? '80px 24px' : '112px 40px',
      borderTop: '1px solid rgba(196,169,107,0.08)',
    }}>
      <div ref={ref} style={{
        maxWidth: 900, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
        gap: mobile ? 40 : 80,
        alignItems: 'center',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
      }}>
        {/* coluna esquerda */}
        <div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 11, letterSpacing: '2.5px', color: C.gold,
            textTransform: 'uppercase', marginBottom: 20,
          }}>O que você vai aprender</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(26px, 7vw, 34px)' : 'clamp(28px, 2.8vw, 40px)',
            color: C.cream, lineHeight: 1.25,
            letterSpacing: '-0.5px', marginBottom: 24,
          }}>
            Quem tem medo de errar{' '}
            <em style={{ color: C.gold, fontStyle: 'italic' }}>
              não consegue brincar.
            </em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 15 : 16,
            color: 'rgba(237,234,227,0.55)',
            lineHeight: 1.75,
          }}>
            É uma única aula ao vivo, gravada, com acesso permanente. Densa, direta e transformadora — feita para quem quer dançar com mais liberdade, mesmo sem ser perfeito.
          </p>
        </div>

        {/* coluna direita — pull quote */}
        <div style={{
          borderLeft: `2px solid rgba(196,169,107,0.2)`,
          paddingLeft: mobile ? 24 : 36,
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: mobile ? 20 : 24,
            color: 'rgba(237,234,227,0.7)',
            lineHeight: 1.55, marginBottom: 20,
          }}>
            "E se o erro não fosse o fim da dança? Talvez seja onde a possibilidade começa."
          </p>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '1.5px',
            color: 'rgba(196,169,107,0.5)',
            textTransform: 'uppercase',
          }}>Chris Busato</div>
        </div>
      </div>
    </section>
  )
}

// ─── O que você vai aprender ──────────────────────────────────────────────────

const aprendizados = [
  {
    num: '01',
    titulo: 'A anatomia do erro',
    descricao: 'Por que o corpo trava quando erra e como destravar esse padrão de forma consciente.',
  },
  {
    num: '02',
    titulo: 'Erro como linguagem',
    descricao: 'Como usar o que "deu errado" como material criativo — não apesar do erro, mas através dele.',
  },
  {
    num: '03',
    titulo: 'Presença sob pressão',
    descricao: 'Técnicas para manter qualidade e consciência corporal mesmo quando a mente entra em pânico.',
  },
  {
    num: '04',
    titulo: 'O professor que não julga',
    descricao: 'Como criar uma relação interna de aprendizagem que acelera a evolução ao invés de freá-la.',
  },
]

function AprendizadosSection() {
  const [titleRef, titleInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.ink,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          marginBottom: 64,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(24px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 11, letterSpacing: '2.5px', color: C.gold,
            textTransform: 'uppercase', marginBottom: 16,
          }}>O que você vai levar</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(26px, 7vw, 36px)' : 'clamp(28px, 3vw, 44px)',
            color: C.cream, letterSpacing: '-0.5px', lineHeight: 1.2,
          }}>
            Quatro mudanças de{' '}
            <em style={{ color: C.gold, fontStyle: 'italic' }}>perspectiva.</em>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {aprendizados.map((item, i) => (
            <AprendizadoItem key={i} item={item} index={i} mobile={mobile} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AprendizadoItem({ item, index, mobile }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '80px 1fr',
      gap: mobile ? 12 : 40,
      padding: '32px 0',
      borderTop: '1px solid rgba(196,169,107,0.12)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
      transitionDelay: `${index * 80}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic',
        fontSize: mobile ? 18 : 22,
        color: 'rgba(196,169,107,0.4)',
        paddingTop: 2,
      }}>{item.num}</div>
      <div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 19 : 22,
          color: C.cream, marginBottom: 10, lineHeight: 1.3,
        }}>{item.titulo}</h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: mobile ? 15 : 16,
          color: 'rgba(237,234,227,0.55)', lineHeight: 1.65,
        }}>{item.descricao}</p>
      </div>
    </div>
  )
}

// ─── Para quem é ─────────────────────────────────────────────────────────────

const paraQuem = [
  'Você trava na frente dos outros quando erra',
  'Você se critica muito durante a prática',
  'Você sente que seus erros falam mais alto que seus acertos',
  'Você é professor e quer lidar melhor com os erros dos seus alunos',
  'Você quer dançar com mais liberdade, mesmo sem ser perfeito',
]

function ParaQuemSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.inkMid,
      padding: mobile ? '80px 24px' : '112px 40px',
      borderTop: '1px solid rgba(196,169,107,0.1)',
    }}>
      <div ref={ref} style={{
        maxWidth: 780, margin: '0 auto',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 11, letterSpacing: '2.5px', color: C.gold,
          textTransform: 'uppercase', marginBottom: 16,
        }}>Para quem é</div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(26px, 7vw, 36px)' : 'clamp(28px, 3vw, 44px)',
          color: C.cream, letterSpacing: '-0.5px',
          lineHeight: 1.2, marginBottom: 48,
        }}>
          Essa aula é pra você{' '}
          <em style={{ color: C.gold, fontStyle: 'italic' }}>se…</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {paraQuem.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 16,
              padding: '20px 0',
              borderBottom: i < paraQuem.length - 1 ? '1px solid rgba(196,169,107,0.1)' : 'none',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              transitionDelay: `${i * 70}ms`,
            }}>
              <div style={{
                flexShrink: 0,
                width: 6, height: 6, borderRadius: '50%',
                background: C.gold,
                marginTop: 9,
                boxShadow: `0 0 8px rgba(196,169,107,0.5)`,
              }} />
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                fontSize: mobile ? 16 : 18,
                color: 'rgba(237,234,227,0.75)', lineHeight: 1.55,
              }}>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Chris ────────────────────────────────────────────────────────────────────

function ChrisSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.ink,
      padding: mobile ? '80px 24px' : '112px 40px',
      borderTop: '1px solid rgba(196,169,107,0.08)',
    }}>
      <div ref={ref} style={{
        maxWidth: 760, margin: '0 auto',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
      }}>
        <div style={{
          display: 'flex', flexDirection: mobile ? 'column' : 'row',
          gap: mobile ? 28 : 48, alignItems: mobile ? 'flex-start' : 'center',
        }}>
          {/* Avatar placeholder */}
          <div style={{
            flexShrink: 0,
            width: mobile ? 72 : 96, height: mobile ? 72 : 96,
            borderRadius: '50%',
            background: 'rgba(196,169,107,0.15)',
            border: '1.5px solid rgba(196,169,107,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: mobile ? 22 : 28,
              color: C.gold,
            }}>C</span>
          </div>

          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 11, letterSpacing: '2.5px', color: C.gold,
              textTransform: 'uppercase', marginBottom: 10,
            }}>Quem ensina</div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: mobile ? 22 : 26,
              color: C.cream, marginBottom: 14,
            }}>Chris Busato</h3>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              fontSize: mobile ? 15 : 16,
              color: 'rgba(237,234,227,0.6)', lineHeight: 1.7,
            }}>
              Educadora de dança, criadora do método Corpo Musical e da vivência Brincando na Música. Há mais de dez anos, Chris acompanha corpos que querem se expressar com mais liberdade — e errar com mais leveza.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Inscrição / Preço ────────────────────────────────────────────────────────

function InscricaoSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section
      id="inscricao"
      style={{
        background: `linear-gradient(160deg, ${C.inkMid} 0%, ${C.ink} 100%)`,
        padding: mobile ? '80px 24px 100px' : '112px 40px 128px',
        borderTop: '1px solid rgba(196,169,107,0.12)',
      }}
    >
      <div ref={ref} style={{
        maxWidth: 600, margin: '0 auto', textAlign: 'center',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 11, letterSpacing: '2.5px', color: C.gold,
          textTransform: 'uppercase', marginBottom: 16,
        }}>Acesso à aula</div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(28px, 8vw, 40px)' : 'clamp(32px, 3.5vw, 50px)',
          color: C.cream, letterSpacing: '-0.5px',
          lineHeight: 1.15, marginBottom: 48,
        }}>
          Uma vez.{' '}
          <em style={{ color: C.gold, fontStyle: 'italic' }}>Para sempre.</em>
        </h2>

        {/* Card de preço */}
        <div style={{
          background: 'rgba(196,169,107,0.06)',
          border: '1px solid rgba(196,169,107,0.2)',
          borderRadius: 24, padding: mobile ? '36px 28px' : '48px 56px',
          marginBottom: 32,
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 14, color: 'rgba(237,234,227,0.4)',
            letterSpacing: '0.3px', marginBottom: 8,
            textDecoration: 'line-through',
          }}>de R$ 197</div>

          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 52 : 64,
            color: C.cream, lineHeight: 1, marginBottom: 4,
            letterSpacing: '-2px',
          }}>
            R$<span style={{ fontSize: mobile ? 64 : 80, fontWeight: 700 }}>97</span>
          </div>

          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 14, color: 'rgba(237,234,227,0.45)',
            marginBottom: 36,
          }}>pagamento único · acesso permanente à gravação</div>

          {/* O que inclui */}
          <div style={{ textAlign: 'left', marginBottom: 36 }}>
            {[
              'Aula ao vivo com Chris Busato',
              'Gravação disponível para sempre',
              'Material de apoio exclusivo',
              'Grupo secreto de prática pós-aula',
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < 3 ? '1px solid rgba(196,169,107,0.08)' : 'none',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="rgba(196,169,107,0.5)" strokeWidth="1"/>
                  <path d="M4.5 7l2 2 3-3" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                  fontSize: 15, color: 'rgba(237,234,227,0.7)',
                }}>{item}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#"
            style={{
              display: 'block',
              background: `linear-gradient(135deg, ${C.gold} 0%, #a8863d 100%)`,
              color: C.ink,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: 16, letterSpacing: '0.3px',
              padding: '18px 40px',
              borderRadius: 100,
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: `0 8px 32px rgba(196,169,107,0.3)`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 12px 40px rgba(196,169,107,0.45)`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = `0 8px 32px rgba(196,169,107,0.3)`
            }}
          >
            Garantir minha vaga
          </a>
        </div>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: 13, color: 'rgba(237,234,227,0.35)',
          lineHeight: 1.6,
        }}>
          Vagas limitadas · Pagamento 100% seguro
        </p>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqItems = [
  {
    q: 'Quando acontece a aula ao vivo?',
    a: 'A data será divulgada em breve para quem se inscrever. Você recebe o aviso por e-mail.',
  },
  {
    q: 'E se eu não puder ao vivo?',
    a: 'Sem problema — a gravação fica disponível permanentemente. Você assiste quando e quantas vezes quiser.',
  },
  {
    q: 'Precisa ter experiência em dança?',
    a: 'Não. A aula é sobre uma relação interna com o aprendizado. Vale para qualquer nível, seja iniciante ou professor experiente.',
  },
  {
    q: 'É diferente das outras vivências da Chris?',
    a: 'Sim. Esta é uma aula focada especificamente no tema do erro — mais conceitual, mais densa, mais transformadora.',
  },
]

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false)
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <div ref={ref} style={{
      borderBottom: '1px solid rgba(196,169,107,0.12)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      transitionDelay: `${index * 70}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(16px)',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none',
          cursor: 'pointer', padding: '24px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 16, textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: mobile ? 15 : 16,
          color: open ? C.goldLight : C.cream,
          lineHeight: 1.4,
          transition: 'color 0.2s ease',
        }}>{item.q}</span>
        <div style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
          border: `1px solid rgba(196,169,107,${open ? '0.5' : '0.2'})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.2s ease, transform 0.3s ease',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke={open ? C.gold : 'rgba(196,169,107,0.6)'} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </button>
      {open && (
        <div style={{
          paddingBottom: 24,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: mobile ? 15 : 16,
          color: 'rgba(237,234,227,0.55)', lineHeight: 1.7,
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
      background: C.inkMid,
      padding: mobile ? '80px 24px' : '112px 40px',
      borderTop: '1px solid rgba(196,169,107,0.1)',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          marginBottom: 48,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(24px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 11, letterSpacing: '2.5px', color: C.gold,
            textTransform: 'uppercase', marginBottom: 14,
          }}>Dúvidas</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(26px, 7vw, 36px)' : 'clamp(28px, 3vw, 42px)',
            color: C.cream, letterSpacing: '-0.5px',
          }}>Perguntas frequentes</h2>
        </div>
        {faqItems.map((item, i) => (
          <FaqItem key={i} item={item} index={i} />
        ))}
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
      background: C.ink,
      borderTop: '1px solid rgba(196,169,107,0.1)',
      padding: mobile ? '40px 24px' : '48px 40px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic', fontSize: 16,
        color: 'rgba(196,169,107,0.5)',
        marginBottom: 12,
      }}>Chris Busato</div>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
        fontSize: 12, color: 'rgba(237,234,227,0.25)',
        letterSpacing: '0.3px',
      }}>
        © {new Date().getFullYear()} · Todos os direitos reservados
      </p>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function ErroAPossibilidadeLP() {
  return (
    <>
      <style>{globalStyles}</style>
      <Navbar />
      <HeroSection />
      <StatementSection />
      <OQueESection />
      <AprendizadosSection />
      <ParaQuemSection />
      <ChrisSection />
      <InscricaoSection />
      <FaqSection />
      <Footer />
    </>
  )
}
