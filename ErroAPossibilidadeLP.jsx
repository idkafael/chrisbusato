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
      display: 'flex', alignItems: 'center',
      padding: mobile ? '120px 24px 80px' : '140px 40px 100px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow de fundo */}
      <div style={{
        position: 'absolute',
        top: '40%', left: mobile ? '50%' : '30%', transform: 'translate(-50%, -50%)',
        width: mobile ? 300 : 500, height: mobile ? 300 : 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,169,107,0.07) 0%, transparent 70%)',
        animation: 'glowPulse 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1100, width: '100%', margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
        gap: mobile ? 48 : 72,
        alignItems: 'center',
      }}>
        {/* Coluna texto */}
        <div style={{ textAlign: mobile ? 'center' : 'left' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(36px, 10vw, 52px)' : 'clamp(44px, 4.5vw, 68px)',
            lineHeight: 1.1, letterSpacing: '-1px',
            color: C.cream, marginBottom: 20,
            animation: 'fadeUp 0.7s 0.1s ease both',
          }}>
            Do Erro{' '}
            <em style={{ color: C.gold, fontStyle: 'italic', display: 'block' }}>
              à Possibilidade
            </em>
          </h1>

          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: mobile ? 18 : 22,
            color: 'rgba(237,234,227,0.75)',
            lineHeight: 1.5, maxWidth: 440,
            margin: mobile ? '0 auto 20px' : '0 0 20px',
            animation: 'fadeUp 0.7s 0.15s ease both',
          }}>
            Quantas experiências você já perdeu por medo de errar?
          </p>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 15 : 17,
            color: 'rgba(237,234,227,0.55)',
            lineHeight: 1.7, maxWidth: 440,
            margin: mobile ? '0 auto 36px' : '0 0 36px',
            animation: 'fadeUp 0.7s 0.2s ease both',
          }}>
            Aprenda a transformar o erro de inimigo em caminho para mais liberdade, presença e expressão.
          </p>

          <div style={{ animation: 'fadeUp 0.7s 0.3s ease both', display: mobile ? 'flex' : 'block', justifyContent: 'center' }}>
            <a
              href="#inscricao"
              style={{
                display: 'inline-block',
                background: `linear-gradient(135deg, ${C.gold} 0%, #a8863d 100%)`,
                color: C.ink,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                fontSize: mobile ? 15 : 16, letterSpacing: '0.3px',
                padding: mobile ? '16px 36px' : '18px 48px',
                borderRadius: 100, textDecoration: 'none',
                boxShadow: `0 8px 32px rgba(196,169,107,0.35)`,
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
              Quero Participar
            </a>
          </div>
        </div>

        {/* Coluna foto */}
        <div style={{
          animation: 'fadeUp 0.8s 0.25s ease both',
          position: 'relative',
        }}>
          {/* Foto principal — substituir src quando disponível */}
          <div style={{
            aspectRatio: '3/4',
            borderRadius: 20,
            background: 'linear-gradient(160deg, rgba(196,169,107,0.08) 0%, rgba(28,25,22,0.9) 100%)',
            border: '1px solid rgba(196,169,107,0.15)',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 12,
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" opacity="0.25">
              <rect x="3" y="3" width="22" height="22" rx="2" stroke={C.gold} strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="3" stroke={C.gold} strokeWidth="1.5"/>
              <path d="M3 19l7-6 5 5 4-4 6 6" stroke={C.gold} strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              fontSize: 10, letterSpacing: '2px',
              color: 'rgba(196,169,107,0.3)', textTransform: 'uppercase',
            }}>foto · Chris Busato</span>
          </div>
          {/* Detalhe decorativo */}
          <div style={{
            position: 'absolute', bottom: -16, right: -16,
            width: 80, height: 80, borderRadius: 16,
            border: '1px solid rgba(196,169,107,0.15)',
            background: 'rgba(196,169,107,0.04)',
            zIndex: -1,
          }} />
        </div>
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
      background: 'linear-gradient(160deg, #2e2820 0%, #3a2f24 50%, #2e2820 100%)',
      padding: mobile ? '80px 24px' : '112px 40px',
      borderTop: '1px solid rgba(196,169,107,0.12)',
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
          letterSpacing: '-0.5px', marginBottom: 28,
        }}>
          O erro existe.{' '}
          <em style={{ color: C.gold, fontStyle: 'italic' }}>
            Mas ele não precisa controlar você.
          </em>
        </h2>

        <div style={{
          width: 40, height: 1,
          background: `rgba(196,169,107,0.4)`,
          margin: '0 auto 32px',
        }} />

        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: mobile ? 19 : 24,
          color: 'rgba(237,234,227,0.8)',
          lineHeight: 1.6, maxWidth: 660, margin: '0 auto',
        }}>
          "O problema não é quando você erra. O problema é o que acontece dentro de você depois do erro."
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
      background: 'linear-gradient(160deg, #2e2820 0%, #3a2f24 50%, #2e2820 100%)',
      padding: mobile ? '80px 24px' : '112px 40px',
      borderTop: '1px solid rgba(196,169,107,0.1)',
    }}>
      <div ref={ref} style={{
        maxWidth: 720, margin: '0 auto',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 11, letterSpacing: '2.5px', color: C.gold,
          textTransform: 'uppercase', marginBottom: 20,
        }}>O que você vai aprender</div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(26px, 7vw, 36px)' : 'clamp(30px, 3vw, 44px)',
          color: C.cream, lineHeight: 1.2,
          letterSpacing: '-0.5px', marginBottom: 36,
        }}>
          O problema não é errar a perna.{' '}
          <em style={{ color: C.gold, fontStyle: 'italic' }}>
            É não perceber o que acontece depois.
          </em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 16 : 18,
            color: 'rgba(237,234,227,0.75)',
            lineHeight: 1.75,
          }}>
            Só temos duas pernas. Então, mais cedo ou mais tarde, uma delas vai errar.
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 16 : 18,
            color: 'rgba(237,234,227,0.75)',
            lineHeight: 1.75,
          }}>
            Mas existe algo que acontece nos segundos seguintes que faz algumas pessoas travarem… enquanto outras transformam o mesmo erro em algo completamente diferente.
          </p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: mobile ? 17 : 20,
            color: 'rgba(237,234,227,0.65)',
            lineHeight: 1.65,
          }}>
            Quando você entender o que é isso, sua forma de enxergar o erro nunca mais será a mesma.
          </p>
        </div>

        {/* Pull quote Chris */}
        <div style={{
          marginTop: 48,
          borderTop: '1px solid rgba(196,169,107,0.15)',
          paddingTop: 40,
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: mobile ? 18 : 22,
            color: 'rgba(237,234,227,0.8)',
            lineHeight: 1.65,
            marginBottom: 20,
          }}>
            "Eu não gosto de fingir que o erro não existe. O que me fascina é perceber que quase ninguém foi ensinado a enxergar o que realmente acontece quando ele aparece. E é justamente aí que mora a possibilidade."
          </p>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            fontSize: 11, letterSpacing: '2.5px',
            color: 'rgba(196,169,107,0.6)',
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
    titulo: 'Por que o erro trava o corpo',
    descricao: 'Entender o que acontece internamente quando a expectativa é quebrada, e como parar de congelar na hora errada.',
  },
  {
    num: '02',
    titulo: 'Técnica, método e desenvolvimento',
    descricao: 'Lidar com o erro não é questão de talento ou sorte. Existe um caminho concreto e você vai aprender ele aqui.',
  },
  {
    num: '03',
    titulo: 'A outra perna também dança',
    descricao: 'Quando você aprende a se reorganizar com qualquer perna, o "erro" vira variação. As combinações se multiplicam.',
  },
  {
    num: '04',
    titulo: 'Segurança e confiança de verdade',
    descricao: 'Não a confiança de quem nunca erra. A confiança de quem sabe o que fazer quando erra. Essa é a liberdade que fica.',
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
  'Quando erra na frente do seu par, você trava. Ficam os dois sem saber o que fazer',
  'Você sabe que o erro estava lá, mas prefere fingir que não aconteceu',
  'Seu par errou a perna, a dança parou e você não sabe como continuar',
  'Você quer dançar com mais liberdade, mas o medo de errar te prende',
  'Você é professor e quer ensinar seus alunos a lidar com o erro, não a fugir dele',
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
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '340px 1fr',
          gap: mobile ? 36 : 64,
          alignItems: 'center',
        }}>
          {/* Foto grande — substituir src quando disponível */}
          <div style={{
            aspectRatio: '4/5',
            borderRadius: 20,
            background: 'linear-gradient(160deg, rgba(196,169,107,0.08) 0%, rgba(28,25,22,0.95) 100%)',
            border: '1px solid rgba(196,169,107,0.15)',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 12,
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" opacity="0.25">
              <rect x="3" y="3" width="22" height="22" rx="2" stroke={C.gold} strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="3" stroke={C.gold} strokeWidth="1.5"/>
              <path d="M3 19l7-6 5 5 4-4 6 6" stroke={C.gold} strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              fontSize: 10, letterSpacing: '2px',
              color: 'rgba(196,169,107,0.3)', textTransform: 'uppercase',
            }}>foto · Chris Busato</span>
          </div>

          {/* Bio */}
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 11, letterSpacing: '2.5px', color: C.gold,
              textTransform: 'uppercase', marginBottom: 16,
            }}>Quem ensina</div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: mobile ? 28 : 36,
              color: C.cream, marginBottom: 20, lineHeight: 1.2,
            }}>Chris Busato</h3>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              fontSize: mobile ? 15 : 17,
              color: 'rgba(237,234,227,0.6)', lineHeight: 1.75,
              marginBottom: 24,
            }}>
              Educadora de dança e criadora do método Corpo Musical. Há mais de dez anos, Chris acompanha corpos que querem dançar com mais liberdade. Ela não finge que o erro não existe. Ela ensina você a lidar com ele, para que o que era bloqueio vire possibilidade.
            </p>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {[
                '+10 anos como educadora de dança',
                'Criadora do Corpo Musical',
                'Referência em musicalidade corporal',
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: C.gold, flexShrink: 0,
                    boxShadow: `0 0 6px rgba(196,169,107,0.4)`,
                  }} />
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                    fontSize: 14, color: 'rgba(237,234,227,0.5)',
                  }}>{item}</span>
                </div>
              ))}
            </div>
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
    a: 'Sem problema. A gravação fica disponível permanentemente. Você assiste quando e quantas vezes quiser.',
  },
  {
    q: 'Precisa ter experiência em dança?',
    a: 'Não. A aula é sobre uma relação interna com o aprendizado. Vale para qualquer nível, seja iniciante ou professor experiente.',
  },
  {
    q: 'É diferente das outras vivências da Chris?',
    a: 'Sim. Esta é uma aula focada especificamente no tema do erro. Mais conceitual, mais densa e mais transformadora.',
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
