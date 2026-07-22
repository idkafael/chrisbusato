import { useState, useEffect, useRef } from 'react'
import chrisSorrindo from './images/chris-sorrindo.jpg'
import vergonhaImg from './images/vergonha.jpg'

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
  ink: '#1C1916',
  inkMid: '#2E2924',
  gold: '#C4A96B',
  goldLight: '#DFC99A',
  goldPale: '#F5EDDA',
}

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

function HeroSection() {
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{ background: C.ink }}>
      {/* Imagem com H1 sobreposto — 75vh */}
      <div style={{
        position: 'relative',
        height: '75vh',
        overflow: 'hidden',
      }}>
        <img
          src={vergonhaImg}
          alt="A Vergonha na Dança"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            display: 'block',
          }}
        />
        {/* Overlay gradiente para legibilidade do texto */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(28,25,22,0.15) 0%, rgba(28,25,22,0.55) 60%, rgba(28,25,22,0.92) 100%)',
        }} />

        {/* H1 + subtítulo + CTA sobrepostos na imagem */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-end',
          padding: mobile ? '0 24px 42%' : '0 40px 40%',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(36px, 10vw, 52px)' : 'clamp(44px, 4.5vw, 68px)',
            lineHeight: 1.1, letterSpacing: '-1px',
            color: C.cream,
            animation: 'fadeUp 0.7s 0.1s ease both',
            maxWidth: 720,
            marginBottom: 20,
          }}>
            A Vergonha{' '}
            <em style={{ color: C.gold, fontStyle: 'italic', display: 'block' }}>
              na Dança
            </em>
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 15 : 17,
            color: 'rgba(237,234,227,0.85)',
            lineHeight: 1.7, maxWidth: 400,
            marginBottom: 28,
            animation: 'fadeUp 0.7s 0.15s ease both',
          }}>
            Entenda o que acontece no seu corpo quando você sente vergonha de dançar e como sair disso.
          </p>

          <div style={{ animation: 'fadeUp 0.7s 0.3s ease both' }}>
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
      </div>
    </section>
  )
}

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
          A vergonha existe.{' '}
          <em style={{ color: C.gold, fontStyle: 'italic' }}>
            Mas ela não precisa te parar.
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
          color: C.cream,
          lineHeight: 1.6, maxWidth: 660, margin: '0 auto',
        }}>
          "O problema não é sentir vergonha. O problema é não saber o que fazer com ela quando ela aparece no meio da dança."
        </p>
      </div>
    </section>
  )
}

function OQueESection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: 'linear-gradient(160deg, #2e2820 0%, #3a2f24 50%, #2e2820 100%)',
      padding: mobile ? '0 24px 80px' : '0 40px 112px',
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
          O problema não é não saber dançar.{' '}
          <em style={{ color: C.gold, fontStyle: 'italic' }}>
            É o que acontece dentro de você quando alguém olha.
          </em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 16 : 18,
            color: 'rgba(237,234,227,0.75)',
            lineHeight: 1.75,
          }}>
            A vergonha na dança não é frescura. É uma resposta real do sistema nervoso e ela trava o corpo antes mesmo de você perceber.
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 16 : 18,
            color: 'rgba(237,234,227,0.75)',
            lineHeight: 1.75,
          }}>
            Tem gente que aprende os passos, sabe as músicas, mas na hora de dançar na frente de alguém, some. O corpo trava. A mente vai embora. E a experiência que deveria ser prazerosa vira um campo minado.
          </p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: mobile ? 17 : 20,
            color: 'rgba(237,234,227,0.65)',
            lineHeight: 1.65,
          }}>
            Quando você entender de onde vem essa vergonha, o corpo começa a responder diferente.
          </p>
        </div>

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
            "Eu já vi pessoas que dançavam lindamente em casa, mas travavam completamente no social. Não era falta de técnica. Era a vergonha operando por baixo de tudo. E ninguém tinha apontado isso para elas ainda."
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

const aprendizados = [
  {
    num: '01',
    titulo: 'Por que a vergonha trava o corpo',
    descricao: 'Entender o que acontece no sistema nervoso quando você se sente exposto e por que o corpo congela antes que você decida qualquer coisa.',
  },
  {
    num: '02',
    titulo: 'O olhar do outro e o que fazer com ele',
    descricao: 'A vergonha não vive em você, ela vive na relação com o olhar alheio. Quando você entende isso, começa a ter uma escolha de verdade.',
  },
  {
    num: '03',
    titulo: 'Da exposição para a expressão',
    descricao: 'Dançar na frente de alguém sem desaparecer. Aprender a estar presente no próprio corpo mesmo quando os olhos dos outros estão em você.',
  },
  {
    num: '04',
    titulo: 'Confiança que não depende de aprovação',
    descricao: 'Não a confiança de quem nunca sente vergonha. A confiança de quem aprendeu a dançar mesmo com ela. Essa é a liberdade que fica.',
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
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: mobile ? 15 : 16,
          color: 'rgba(237,234,227,0.8)', lineHeight: 1.65,
        }}>{item.descricao}</p>
      </div>
    </div>
  )
}

const paraQuem = [
  'Você quer dançar, mas quando alguém olha, o corpo trava e a vontade some',
  'No social, você evita entrar na roda ou fica esperando um convite que nunca vem',
  'Você sabe os passos em casa, mas na aula ou no baile parece que esquece tudo',
  'Você sente que precisa "merecer" dançar antes de se permitir se expressar',
  'O medo de errar na frente dos outros é maior do que o prazer de dançar',
  'Você é professor e quer entender o que acontece com os alunos que travam diante do olhar',
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
          Esse aulão é pra você{' '}
          <em style={{ color: C.gold, fontStyle: 'italic' }}>se…</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {paraQuem.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 16,
              padding: '20px 0',
              borderBottom: i < paraQuem.length - 1 ? '1px solid rgba(196,169,107,0.2)' : 'none',
            }}>
              <div style={{
                flexShrink: 0,
                width: 6, height: 6, borderRadius: '50%',
                background: C.gold,
                marginTop: 9,
                boxShadow: `0 0 8px rgba(196,169,107,0.5)`,
              }} />
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: mobile ? 16 : 18,
                color: 'rgba(237,234,227,0.92)', lineHeight: 1.55,
              }}>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
          <div style={{
            aspectRatio: '4/5',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          }}>
            <img
              src={chrisSorrindo}
              alt="Chris Busato"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

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
              Educadora de dança e criadora do método Corpo Musical. Há mais de dez anos, Chris acompanha corpos que querem se expressar com mais liberdade. Ela não ignora o que paralisa. Ela vai direto no que está embaixo e ensina você a atravessar isso.
            </p>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {[
                '+10 anos como educadora de dança',
                'Criadora do Corpo Musical',
                'Referência em expressão e musicalidade corporal',
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
        }}>Acesso ao aulão</div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(28px, 8vw, 40px)' : 'clamp(32px, 3.5vw, 50px)',
          color: C.cream, letterSpacing: '-0.5px',
          lineHeight: 1.15, marginBottom: 48,
        }}>
          Uma vez.{' '}
          <em style={{ color: C.gold, fontStyle: 'italic' }}>Para sempre.</em>
        </h2>

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
          }}>de R$ 297</div>

          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: mobile ? 48 : 56,
            color: C.cream, lineHeight: 1, marginBottom: 4,
            letterSpacing: '-1px',
          }}>
            R$ 57
          </div>

          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 14, color: 'rgba(237,234,227,0.45)',
            marginBottom: 36,
          }}>pagamento único · acesso permanente à gravação</div>

          <div style={{ textAlign: 'left', marginBottom: 36 }}>
            {[
              'Aulão A Vergonha na Dança com Chris Busato',
              'Gravação disponível para sempre',
              'Material de apoio exclusivo',
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < 2 ? '1px solid rgba(196,169,107,0.08)' : 'none',
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

          <a
            href="https://pay.cakto.com.br/bkqgwvr"
            target="_blank" rel="noopener noreferrer"
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

function UrgenciaSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  const lines = [
    'Porque o custo de não decidir raramente aparece hoje.',
    'Ele aparece nos bailes que você evitou.',
    'Nas músicas que não viraram movimento.',
    'Na versão de você que ainda está esperando permissão para dançar.',
  ]

  return (
    <section style={{
      background: `linear-gradient(160deg, #1a1510 0%, #231c14 50%, #1a1510 100%)`,
      padding: mobile ? '80px 24px 88px' : '112px 40px 120px',
    }}>
      <div ref={ref} style={{
        maxWidth: 680,
        margin: '0 auto',
        textAlign: 'center',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: mobile ? 26 : 34,
          color: C.cream,
          lineHeight: 1.25,
          marginBottom: 40,
          letterSpacing: '-0.01em',
        }}>
          Por que você não pode sair daqui{' '}
          <em style={{ color: C.gold, fontStyle: 'italic' }}>sem tomar essa decisão?</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
          {lines.map((line, i) => (
            <p key={i} style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: mobile ? 17 : 20,
              color: i === 0 ? 'rgba(237,234,227,0.92)' : 'rgba(237,234,227,0.7)',
              lineHeight: 1.6,
              fontStyle: i > 0 ? 'italic' : 'normal',
              transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`,
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(12px)',
            }}>{line}</p>
          ))}
        </div>

        <div style={{
          width: 48,
          height: 1,
          background: `rgba(196,169,107,0.4)`,
          margin: '0 auto 48px',
        }} />

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: mobile ? 17 : 20,
          color: 'rgba(237,234,227,0.92)',
          lineHeight: 1.7,
          marginBottom: 40,
        }}>
          Você pode continuar esperando se sentir pronto para dançar na frente dos outros.<br />
          Ou pode descobrir o que existe do outro lado da vergonha que vem te parando há tanto tempo.
        </p>

        <a href="#inscricao" style={{
          display: 'inline-block',
          background: `linear-gradient(135deg, ${C.gold} 0%, #a8863d 100%)`,
          color: C.ink,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: mobile ? 16 : 17,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          padding: mobile ? '16px 36px' : '18px 48px',
          borderRadius: 50,
          textDecoration: 'none',
          boxShadow: `0 8px 32px rgba(196,169,107,0.35)`,
        }}>Quero participar</a>
      </div>
    </section>
  )
}

const faqItems = [
  {
    q: 'Isso é para mim mesmo se eu me considero muito tímido?',
    a: 'Sim. Na verdade, esse aulão foi criado justamente para pessoas que sentem vergonha de dançar na frente de outras. Você não precisa chegar confiante. Você precisa apenas estar disposto a olhar para isso de um ângulo diferente.',
  },
  {
    q: 'O que torna essa experiência diferente?',
    a: 'A maioria das aulas de dança ignora o que está embaixo da trava. Aqui a gente vai direto ao ponto: de onde vem a vergonha, o que ela faz com o corpo e como criar uma nova relação com o olhar do outro enquanto você dança.',
  },
  {
    q: 'E se eu não me sentir pronto?',
    a: 'Essa talvez seja exatamente a razão para estar aqui. A vergonha nunca vai embora esperando. Ela vai embora sendo atravessada.',
  },
  {
    q: 'Precisa ter experiência em dança?',
    a: 'Não. O aulão é sobre o que acontece internamente, não sobre técnica. Vale para quem está começando agora e para quem dança há anos mas ainda trava na frente de outras pessoas.',
  },
  {
    q: 'É diferente das outras vivências da Chris?',
    a: 'Sim. Este é um aulão focado especificamente no tema da vergonha na dança. Mais direto, mais visceral e mais transformador do que qualquer exercício de técnica.',
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

export default function VergonhaNaDancaLP() {
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
      <UrgenciaSection />
      <FaqSection />
      <Footer />
    </>
  )
}
