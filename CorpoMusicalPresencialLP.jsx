import { useRef, useEffect, useState, useCallback } from 'react'

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  cream:     '#F5F0E8',
  creamCard: '#EDE8DE',
  white:     '#FDFCFA',
  sage:      '#7A9E87',
  sageDark:  '#4A7A5A',
  sageLight: '#C5D9CB',
  sagePale:  '#EBF2ED',
  brown:     '#3D2B1F',
  brownLight:'#7A6558',
  black:     '#1A1008',
}

const styleTag = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.white}; }
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
`

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return w
}

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const mobile = useWindowWidth() < 768
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: C.white,
      borderBottom: `1px solid ${C.sageLight}`,
      padding: mobile ? '14px 20px' : '16px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        fontSize: 13, color: C.brownLight, letterSpacing: '0.3px',
      }}>chrisbusato.com</span>

      <span style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        fontFamily: "'Playfair Display', serif",
        fontSize: 20, color: C.brown, letterSpacing: '-0.3px',
        whiteSpace: 'nowrap',
      }}>Corpo Musical Presencial</span>

      <a href="#precos" style={{
        background: C.sage, color: C.white,
        padding: '8px 18px', borderRadius: 100,
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        textDecoration: 'none', whiteSpace: 'nowrap',
      }}>Quero participar</a>
    </nav>
  )
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const mobile = useWindowWidth() < 768
  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '72px 24px 64px' : '100px 40px 88px',
      textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* detalhe decorativo */}
      <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 320, height: 320, borderRadius: '50%',
        background: C.sageLight, opacity: 0.18,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
        <div style={{
          display: 'inline-block',
          background: C.sagePale, color: C.sageDark,
          borderRadius: 100, padding: '6px 18px',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase',
          marginBottom: 28,
        }}>Aulas presenciais · Zona Sul de SP · 3 sábados por mês</div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(36px, 10vw, 52px)' : 'clamp(44px, 5vw, 64px)',
          color: C.brown, lineHeight: 1.1,
          letterSpacing: '-1px', marginBottom: 28,
          animation: 'fadeUp 0.7s ease both',
        }}>
          Uma dança construída{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>de dentro pra fora.</em>
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: mobile ? 16 : 18, color: C.brownLight,
          lineHeight: 1.7, marginBottom: 36,
          animation: 'fadeUp 0.7s 0.15s ease both',
        }}>
          Corpo Musical não é sobre decorar mais passos. É sobre desenvolver escuta, presença e musicalidade para que a dança comece a fazer sentido no seu corpo.
        </p>

        <a href="#precos" style={{
          display: 'inline-block',
          background: C.sage, color: C.white,
          padding: '16px 36px', borderRadius: 100,
          fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500,
          textDecoration: 'none',
          animation: 'fadeUp 0.7s 0.25s ease both',
        }}>Ver investimento →</a>
      </div>
    </section>
  )
}

// ─── DIFERENCIAL ─────────────────────────────────────────────────────────────
function DiferencialSection() {
  const { ref, inView } = useInView()
  const mobile = useWindowWidth() < 768
  return (
    <section style={{
      background: C.brown,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div ref={ref} style={{
        maxWidth: 760, margin: '0 auto', textAlign: 'center',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '2.5px', color: C.sage,
          textTransform: 'uppercase', marginBottom: 24,
        }}>O que é diferente</div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(28px, 7vw, 38px)' : 'clamp(32px, 3.5vw, 44px)',
          color: C.cream, lineHeight: 1.2,
          letterSpacing: '-0.5px', marginBottom: 32,
        }}>
          A maioria aprende dança decorando passos e tentando acertar.{' '}
          <em style={{ color: C.sage, fontStyle: 'italic' }}>No Corpo Musical, a base é outra.</em>
        </h2>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: mobile ? 15 : 17, color: 'rgba(245,240,232,0.75)',
          lineHeight: 1.75, marginBottom: 28,
        }}>
          Nossa base não é referente a passos, e sim a música e direções. Ao invés de construir a dança só de fora pra dentro, copiando movimentos pré-determinados, a gente começa a construir também de dentro pra fora.
        </p>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: mobile ? 15 : 17, color: 'rgba(245,240,232,0.75)',
          lineHeight: 1.75,
        }}>
          Por isso muita gente fala que começa a se sentir mais leve, mais musical, mais segura e mais livre pra improvisar. Porque para de depender só de decorar coisas.
        </p>
      </div>
    </section>
  )
}

// ─── MARQUEE STRIP ───────────────────────────────────────────────────────────
function MarqueeStrip() {
  const items = ['ESCUTA', 'MUSICALIDADE', 'PRESENÇA', 'CONSCIÊNCIA CORPORAL', 'RELAÇÃO', 'FLUIDEZ', 'EXPRESSÃO', 'IMPROVISO']
  const doubled = [...items, ...items]
  return (
    <div style={{
      background: C.sage, overflow: 'hidden',
      padding: '14px 0', whiteSpace: 'nowrap',
    }}>
      <div style={{
        display: 'inline-flex', gap: 40,
        animation: 'marquee 22s linear infinite',
      }}>
        {doubled.map((t, i) => (
          <span key={i} style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2px',
            color: C.white, textTransform: 'uppercase',
          }}>
            {t} <span style={{ opacity: 0.5, marginLeft: 8 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── DESENVOLVIMENTO ─────────────────────────────────────────────────────────
function DesenvolvimentoSection() {
  const { ref, inView } = useInView()
  const mobile = useWindowWidth() < 768

  const itens = [
    { n: '01', titulo: 'Sentir mais o próprio corpo', texto: 'Desenvolver consciência corporal real, não só executar movimentos. O corpo começa a ser parceiro, não obstáculo.' },
    { n: '02', titulo: 'Se organizar dentro da música', texto: 'Aprender a sentir a estrutura musical e encontrar seu lugar dentro dela, com segurança e naturalidade.' },
    { n: '03', titulo: 'Sustentar os movimentos', texto: 'Ir além da superfície. Desenvolver qualidade de movimento, tônus e presença em cada gesto.' },
    { n: '04', titulo: 'Presença e relação com o outro', texto: 'Dançar com alguém é um diálogo. Trabalhar a escuta, o contato e a conexão real na dança.' },
    { n: '05', titulo: 'Improvisar com liberdade', texto: 'Parar de depender de sequências prontas e começar a criar, responder e brincar dentro da música.' },
    { n: '06', titulo: 'Expressão e fluidez genuínas', texto: 'Transformar tudo isso em uma dança mais viva, mais autêntica, mais sua.' },
  ]

  return (
    <section style={{
      background: C.white,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 16,
          }}>O que você vai desenvolver</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(28px, 7vw, 36px)' : 'clamp(30px, 3vw, 42px)',
            color: C.brown, letterSpacing: '-0.5px', lineHeight: 1.2,
          }}>
            Não é só aprender movimentos.{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>É desenvolver uma base.</em>
          </h2>
        </div>

        <div ref={ref} style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 24,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          {itens.map((item) => (
            <div key={item.n} style={{
              background: C.creamCard,
              borderRadius: 16, padding: '32px 28px',
              borderTop: `3px solid ${C.sage}`,
            }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                fontSize: 11, color: C.sage, letterSpacing: '1.5px',
                marginBottom: 12,
              }}>{item.n}</div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18, color: C.brown,
                marginBottom: 10, lineHeight: 1.3,
              }}>{item.titulo}</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: 14, color: C.brownLight, lineHeight: 1.65,
              }}>{item.texto}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── COMO FUNCIONA ───────────────────────────────────────────────────────────
function ComoFuncionaSection() {
  const { ref, inView } = useInView()
  const mobile = useWindowWidth() < 768

  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div ref={ref} style={{
        maxWidth: 760, margin: '0 auto', textAlign: 'center',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '2.5px', color: C.sage,
          textTransform: 'uppercase', marginBottom: 16,
        }}>Como funciona</div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(28px, 7vw, 38px)' : 'clamp(32px, 3.5vw, 44px)',
          color: C.brown, lineHeight: 1.2,
          letterSpacing: '-0.5px', marginBottom: 32,
        }}>
          Três sábados por mês.{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>Se puder um ou dois, já é ótimo.</em>
        </h2>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: mobile ? 15 : 17, color: C.brownLight,
          lineHeight: 1.75, marginBottom: 48,
        }}>
          O método respeita muito o processo de cada pessoa. Não é sobre forçar um padrão. É sobre ajudar cada um a encontrar uma dança mais viva, mais consciente e mais autêntica.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 20, textAlign: 'left',
        }}>
          {[
            { icon: '📅', titulo: '3 sábados por mês', texto: 'Aulas regulares com continuidade de processo. Cada encontro aprofunda o que foi trabalhado.' },
            { icon: '📍', titulo: 'Zona Sul de São Paulo', texto: 'Espaço dedicado para a prática, com música ao vivo e ambiente pensado para o movimento.' },
            { icon: '🤝', titulo: 'Turma pequena', texto: 'Para garantir atenção individualizada, feedback real e evolução consistente para cada um.' },
          ].map((card, i) => (
            <div key={i} style={{
              background: C.white, borderRadius: 16,
              padding: '28px 24px',
              border: `1px solid ${C.sageLight}`,
            }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{card.icon}</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                fontSize: 15, color: C.brown, marginBottom: 8,
              }}>{card.titulo}</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: 13, color: C.brownLight, lineHeight: 1.6,
              }}>{card.texto}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PREÇOS ──────────────────────────────────────────────────────────────────
function PrecosSection() {
  const [tab, setTab] = useState('presencial')
  const { ref, inView } = useInView()
  const mobile = useWindowWidth() < 768

  const isPresencial = tab === 'presencial'

  return (
    <section id="precos" style={{
      background: C.white,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 16,
          }}>Investimento</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(28px, 7vw, 36px)' : 'clamp(30px, 3vw, 42px)',
            color: C.brown, letterSpacing: '-0.5px',
          }}>Corpo Musical{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>Presencial</em>
          </h2>
        </div>

        {/* TABS */}
        <div style={{
          display: 'flex', borderRadius: 100,
          background: C.creamCard, padding: 4,
          marginBottom: 36,
        }}>
          {[
            { key: 'presencial', label: 'Presencial' },
            { key: 'aluno', label: 'Já sou aluno online' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 100, border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                fontSize: 13, transition: 'all 0.2s',
                background: tab === key ? C.sage : 'transparent',
                color: tab === key ? C.white : C.brownLight,
              }}
            >{label}</button>
          ))}
        </div>

        {/* CARD */}
        <div ref={ref} style={{
          background: isPresencial ? C.brown : C.creamCard,
          borderRadius: 24, padding: mobile ? '40px 28px' : '52px 48px',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          {!isPresencial && (
            <div style={{
              display: 'inline-block',
              background: C.sage, color: C.white,
              borderRadius: 100, padding: '4px 14px',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase',
              marginBottom: 20,
            }}>Desconto para alunos online</div>
          )}

          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            fontSize: 'clamp(44px, 8vw, 64px)',
            color: isPresencial ? C.cream : C.brown,
            lineHeight: 1, letterSpacing: '-1.5px', marginBottom: 4,
          }}>
            {isPresencial ? 'R$ 2.100' : 'R$ 1.300'}
          </div>

          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 14,
            color: isPresencial ? 'rgba(245,240,232,0.6)' : C.brownLight,
            marginBottom: 8,
          }}>à vista</div>

          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 17,
            color: isPresencial ? C.sageLight : C.sageDark,
            marginBottom: 28,
          }}>
            ou {isPresencial ? '12x de R$ 204,16' : '12x de R$ 126,39'}
          </div>

          <div style={{
            height: 1,
            background: isPresencial ? 'rgba(255,255,255,0.1)' : C.sageLight,
            marginBottom: 28,
          }} />

          {[
            '3 sábados por mês na Zona Sul de SP',
            'Prática ao vivo com música',
            'Trabalho de escuta, musicalidade e presença',
            'Consciência corporal e qualidade de movimento',
            'Turma pequena com atenção individualizada',
            'Acesso ao conteúdo digital complementar',
            isPresencial ? null : 'Preço especial por já ser aluno online',
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              marginBottom: 12,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="8" cy="8" r="7.5" stroke={isPresencial ? C.sage : C.sage} strokeWidth="1"/>
                <path d="M4.5 8l2.5 2.5L11.5 5.5" stroke={isPresencial ? C.sage : C.sageDark} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: 14, lineHeight: 1.5,
                color: isPresencial ? 'rgba(245,240,232,0.85)' : C.brown,
              }}>{item}</span>
            </div>
          ))}

          <a href="#" style={{
            display: 'block', width: '100%', marginTop: 32,
            background: isPresencial ? C.sage : C.brown,
            color: C.white,
            padding: '16px 24px', borderRadius: 100,
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
            textDecoration: 'none', textAlign: 'center',
          }}>
            {isPresencial ? 'Quero participar presencialmente →' : 'Quero o desconto de aluno →'}
          </a>

          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            color: isPresencial ? 'rgba(245,240,232,0.35)' : C.brownLight,
            textAlign: 'center', marginTop: 16,
          }}>Confirmação imediata após pagamento · Pagamento seguro</div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Preciso ter experiência em dança?',
    a: 'Alguma vivência ajuda, mas não precisa ser avançado. O método se adapta ao processo de cada um, respeitando onde cada pessoa está.',
  },
  {
    q: 'Funciona para qualquer estilo de dança?',
    a: 'Sim. Os princípios de musicalidade, escuta e consciência corporal são transversais. Forró, zouk, samba, salsa, bachata — a base é a mesma.',
  },
  {
    q: 'E se eu não puder ir todos os sábados?',
    a: 'Sem problema. São 3 sábados por mês e cada aula tem seu próprio valor. Se puder ir um ou dois por mês, já é ótimo. O processo se constrói no tempo.',
  },
  {
    q: 'Qual é a diferença entre o online e o presencial?',
    a: 'O online traz a estrutura, o mapa e os fundamentos. O presencial aprofunda a prática ao vivo, a relação com o outro, o feedback em tempo real e a experiência corporal que só acontece no espaço compartilhado.',
  },
  {
    q: 'Como funciona o desconto para alunos do online?',
    a: 'Se você já participa do programa online, pode ingressar no presencial pelo mesmo investimento do plano online. Basta selecionar a aba correspondente e prosseguir.',
  },
]

function FaqSection() {
  const [open, setOpen] = useState(null)
  const mobile = useWindowWidth() < 768
  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 16,
          }}>Dúvidas</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(26px, 6vw, 32px)' : 'clamp(28px, 3vw, 38px)',
            color: C.brown,
          }}>Perguntas frequentes</h2>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            borderBottom: `1px solid ${C.sageLight}`,
          }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '20px 0', background: 'none',
              border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16,
            }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                fontSize: 15, color: C.brown, lineHeight: 1.4,
              }}>{faq.q}</span>
              <span style={{
                fontSize: 20, color: C.sage, flexShrink: 0,
                transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
              }}>+</span>
            </button>
            {open === i && (
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: 14, color: C.brownLight, lineHeight: 1.7,
                paddingBottom: 20,
              }}>{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  const mobile = useWindowWidth() < 768
  return (
    <footer style={{
      background: C.brown,
      padding: mobile ? '52px 24px' : '64px 40px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 22, color: C.cream, marginBottom: 8,
      }}>Corpo Musical</div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
        fontSize: 13, color: 'rgba(245,240,232,0.5)', marginBottom: 24,
        fontStyle: 'italic',
      }}>O sentir e o sustentar, com Chris Busato.</div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 12,
        color: 'rgba(245,240,232,0.35)',
      }}>
        chrisbusato.com &nbsp;·&nbsp; © 2026 Chris Busato. Todos os direitos reservados.
      </div>
    </footer>
  )
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function CorpoMusicalPresencialLP() {
  return (
    <>
      <style>{styleTag}</style>
      <Navbar />
      <main>
        <Hero />
        <DiferencialSection />
        <MarqueeStrip />
        <DesenvolvimentoSection />
        <ComoFuncionaSection />
        <PrecosSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
}
