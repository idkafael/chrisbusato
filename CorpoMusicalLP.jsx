import { useState, useEffect, useRef } from 'react'

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true)
    }, { threshold: 0.15, ...options })
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

// ─── Tokens ──────────────────────────────────────────────────────────────────

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
      transition: 'box-shadow 0.3s ease',
      borderBottom: scrolled ? `1px solid ${C.sageLight}` : '1px solid transparent',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: mobile ? '0 24px' : '0 40px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22, color: C.brown, letterSpacing: '-0.3px',
        }}>
          Corpo Musical
        </span>
        {!mobile && (
          <a href="#oferta" style={{
            background: C.sage, color: C.white,
            padding: '10px 22px', borderRadius: 100,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
            textDecoration: 'none', letterSpacing: '0.2px',
            transition: 'background 0.2s',
            display: 'inline-block',
          }}
            onMouseEnter={e => e.target.style.background = C.sageDark}
            onMouseLeave={e => e.target.style.background = C.sage}
          >
            Quero o método
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
      minHeight: '100vh', background: C.cream,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      padding: mobile ? '100px 24px 64px' : '120px 40px 80px',
    }}>
      {/* blobs */}
      <div style={{
        position: 'absolute', top: '-8%', right: '-6%',
        width: 480, height: 480, background: C.sageLight,
        borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%',
        opacity: 0.25, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '4%', left: '-5%',
        width: 280, height: 280, background: C.sageLight,
        borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%',
        opacity: 0.2, pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 760, textAlign: 'center', position: 'relative', zIndex: 1,
        animation: 'fadeUp 0.9s ease forwards',
      }}>
        {/* eyebrow */}
        <div style={{
          display: 'inline-block',
          background: C.sagePale, border: `1px solid ${C.sageLight}`,
          color: C.sageDark, borderRadius: 100,
          padding: '6px 18px', marginBottom: 32,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
          letterSpacing: '0.5px',
        }}>
          Para Professores de Dança
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(40px, 6vw, 72px)',
          color: C.brown, lineHeight: 1.15,
          marginBottom: 28, letterSpacing: '-1px',
        }}>
          Pare de vender passos.<br />
          Comece a <em style={{ color: C.sageDark, fontStyle: 'italic' }}>transformar</em> dançarinos.
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: 'clamp(16px, 2.2vw, 20px)',
          color: C.brownMid, maxWidth: 560, margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          O Corpo Musical é o método que vai diferenciar seu ensino, aumentar a percepção de valor da sua aula e formar alunos mais musicais, autônomos e conectados.
        </p>

        <a href="#oferta" style={{
          display: 'inline-block',
          background: C.sage, color: C.white,
          padding: '16px 36px', borderRadius: 100,
          fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500,
          textDecoration: 'none', letterSpacing: '0.2px',
          transition: 'background 0.2s, transform 0.2s',
          marginBottom: 16,
        }}
          onMouseEnter={e => { e.target.style.background = C.sageDark; e.target.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.target.style.background = C.sage; e.target.style.transform = 'translateY(0)' }}
        >
          Quero conhecer o método → R$ 297
        </a>

        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: C.brownLight, letterSpacing: '0.3px',
        }}>
          Acesso imediato · Metodologia completa
        </div>
      </div>
    </section>
  )
}

// ─── Dor ─────────────────────────────────────────────────────────────────────

const dorCards = [
  { n: '01', title: 'Meus alunos só querem passos', text: 'Você cede. Passa passos. Confirma a crença. O loop se fecha.' },
  { n: '02', title: 'Guerra de preço', text: 'Sem diferenciação metodológica, qualquer professor cobra menos.' },
  { n: '03', title: 'Turmas desniveladas', text: 'Novos alunos "atrasam" os avançados. Difícil manter engajamento.' },
  { n: '04', title: 'Insegurança pedagógica', text: 'A sensação de precisar saber "tudo" antes de se sentir pronto.' },
  { n: '05', title: 'Musicalidade não ensinável', text: 'Você sabe que é importante, mas não sabe como colocar numa aula.' },
  { n: '06', title: 'Aluno aprende na aula, trava no baile', text: 'Decorou passos. No social, congela.' },
]

function DorCard({ card, delay }) {
  const [ref, inView] = useInView()
  const [hovered, setHovered] = useState(false)
  return (
    <div ref={ref} style={{
      background: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16, padding: '32px 28px',
      position: 'relative', overflow: 'hidden',
      transition: 'opacity 0.7s ease, transform 0.7s ease, background 0.2s',
      transitionDelay: `${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
      cursor: 'default',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic', fontSize: 64,
        color: C.sageLight, opacity: 0.3,
        lineHeight: 1, marginBottom: 8, userSelect: 'none',
      }}>{card.n}</div>
      <h3 style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        fontSize: 16, color: C.cream, marginBottom: 10,
      }}>{card.title}</h3>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
        fontSize: 15, color: C.brownLight, lineHeight: 1.65,
      }}>{card.text}</p>
    </div>
  )
}

function DorSection() {
  const [titleRef, titleInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.brown,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: 72,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sageLight,
            textTransform: 'uppercase', marginBottom: 20,
          }}>O Problema do Mercado</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(32px, 4vw, 52px)',
            color: C.cream, lineHeight: 1.2, letterSpacing: '-0.5px',
          }}>
            Você ensina bem.{' '}
            <em style={{ color: C.sageLight, fontStyle: 'italic' }}>
              Mas o mercado não enxerga isso.
            </em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 17, color: C.brownLight,
            maxWidth: 500, margin: '20px auto 0', lineHeight: 1.7,
          }}>
            Enquanto o ensino for medido em quantidade de passos, você vai continuar competindo no lugar errado.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 20,
        }}>
          {dorCards.map((card, i) => (
            <DorCard key={i} card={card} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Loop ─────────────────────────────────────────────────────────────────────

function LoopSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.creamDark,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div ref={ref} style={{
          background: C.creamCard,
          border: `1px solid ${C.sageLight}`,
          borderRadius: 20, padding: mobile ? '40px 28px' : '56px',
          position: 'relative', overflow: 'hidden',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          {/* blob */}
          <div style={{
            position: 'absolute', bottom: '-10%', right: '-6%',
            width: 220, height: 220, background: C.sageLight,
            borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%',
            opacity: 0.2, pointerEvents: 'none',
          }} />

          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 120, color: C.sageLight, opacity: 0.3,
            lineHeight: 0.7, marginBottom: 24, userSelect: 'none',
          }}>"</div>

          <blockquote style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(20px, 3vw, 30px)',
            color: C.brown, lineHeight: 1.5,
            marginBottom: 32, position: 'relative', zIndex: 1,
          }}>
            O aluno só quer passos porque nunca viveu outra coisa. E o professor, com medo de perdê-lo, continua dando passos.
          </blockquote>

          <div style={{
            height: 1, background: C.sageLight, marginBottom: 28,
          }} />

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 16, color: C.brownMid, lineHeight: 1.7,
            position: 'relative', zIndex: 1,
          }}>
            Esse loop não é culpa sua. É estrutural. O ensino tradicional criou uma dependência mútua que só se quebra com um método diferente.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Método ──────────────────────────────────────────────────────────────────

const pilares = [
  {
    n: '01', title: 'Musicalização',
    text: 'O corpo aprende a ser afetado pela música, não apenas acompanhá-la. A música deixa de ser fundo e passa a ser parte do que move.',
  },
  {
    n: '02', title: 'Musicalidade',
    text: 'Estrutura musical aplicada ao movimento. Pulso, frases, contratempos, blocos. Coerência entre o que se escuta e o que se dança.',
  },
  {
    n: '03', title: 'Corpo em Movimento',
    text: 'Eixo, base, transferência de peso, coordenação, autonomia. Um corpo seguro o suficiente para se permitir liberdade.',
  },
  {
    n: '04', title: 'Arte de Dançar com o Outro',
    text: 'Escuta corporal, condução sem controle, resposta sem apagamento. Dança a dois como conversa — não como comando.',
  },
]

function PilarCard({ pilar, delay }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      background: C.creamCard,
      border: `1px solid ${C.sageLight}`,
      borderRadius: 16, padding: '36px 32px',
      position: 'relative', overflow: 'hidden',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
      transitionDelay: `${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic', fontSize: 72,
        color: C.sageLight, opacity: 0.35,
        lineHeight: 0.9, marginBottom: 12,
        userSelect: 'none',
      }}>{pilar.n}</div>
      <h3 style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        fontSize: 18, color: C.brown, marginBottom: 12,
      }}>{pilar.title}</h3>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
        fontSize: 15, color: C.brownMid, lineHeight: 1.7,
      }}>{pilar.text}</p>
    </div>
  )
}

function MetodoSection() {
  const [titleRef, titleInView] = useInView()
  const [compRef, compInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.white,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: 64,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 20,
          }}>A Virada</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(30px, 4vw, 50px)',
            color: C.brown, letterSpacing: '-0.5px',
          }}>
            O Corpo Musical{' '}
            <em style={{ color: C.sage, fontStyle: 'italic' }}>inverte a base.</em>
          </h2>
        </div>

        {/* comparativo */}
        <div ref={compRef} style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: 24, marginBottom: 72,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: compInView ? 1 : 0,
          transform: compInView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          <div style={{
            borderLeft: `3px solid ${C.brownLight}`,
            paddingLeft: 24, paddingTop: 4,
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 13, letterSpacing: '1.5px', textTransform: 'uppercase',
              color: C.brownLight, marginBottom: 14,
            }}>Ensino tradicional</div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              fontSize: 16, color: C.brownMid, lineHeight: 1.8,
            }}>
              passo{' '}
              <span style={{ color: C.brownLight }}>→</span>{' '}
              repetição{' '}
              <span style={{ color: C.brownLight }}>→</span>{' '}
              acerto{' '}
              <span style={{ color: C.brownLight }}>→</span>{' '}
              mais passo{' '}
              <span style={{ color: C.brownLight }}>→</span>{' '}
              tentar musicalidade depois
            </p>
          </div>

          <div style={{
            borderLeft: `3px solid ${C.sage}`,
            paddingLeft: 24, paddingTop: 4,
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 13, letterSpacing: '1.5px', textTransform: 'uppercase',
              color: C.sage, marginBottom: 14,
            }}>Corpo Musical</div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              fontSize: 16, color: C.brownMid, lineHeight: 1.8,
            }}>
              escuta{' '}
              <span style={{ color: C.sage }}>→</span>{' '}
              pulso{' '}
              <span style={{ color: C.sage }}>→</span>{' '}
              corpo disponível{' '}
              <span style={{ color: C.sage }}>→</span>{' '}
              estrutura{' '}
              <span style={{ color: C.sage }}>→</span>{' '}
              relação{' '}
              <span style={{ color: C.sage }}>→</span>{' '}
              expressão
            </p>
          </div>
        </div>

        {/* pilares */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 24,
        }}>
          {pilares.map((p, i) => (
            <PilarCard key={i} pilar={p} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Transformação ───────────────────────────────────────────────────────────

const antes = [
  'Turmas desniveladas',
  'Aluno trava no baile',
  'Insegurança pedagógica',
  'Guerra de preço',
  'Musicalidade "impossível de ensinar"',
  'Criar passos novos toda semana',
]

const depois = [
  'Base comum para qualquer aluno',
  'Autonomia real no social',
  'Você como guia de experiências',
  'Diferenciação metodológica clara',
  'Musicalidade ensinável desde o início',
  'Método que se sustenta sem novidades',
]

function TransformacaoSection() {
  const [titleRef, titleInView] = useInView()
  const [antesRef, antesInView] = useInView()
  const [depoisRef, depoisInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.sagePale,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: 64,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 20,
          }}>O Que Muda</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(30px, 4vw, 50px)',
            color: C.brown, letterSpacing: '-0.5px',
          }}>
            Seus alunos param de decorar.{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>Começam a dançar.</em>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: 24,
        }}>
          <div ref={antesRef} style={{
            background: C.creamCard,
            borderLeft: `3px solid ${C.brownLight}`,
            borderRadius: '0 16px 16px 0',
            padding: mobile ? '32px 24px' : '40px 36px',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            opacity: antesInView ? 1 : 0,
            transform: antesInView ? 'translateY(0)' : 'translateY(28px)',
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 13, letterSpacing: '1.5px', textTransform: 'uppercase',
              color: C.brownLight, marginBottom: 24,
            }}>Antes</div>
            {antes.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                marginBottom: 14,
              }}>
                <span style={{
                  color: C.brownLight, fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500, fontSize: 16, flexShrink: 0, marginTop: 1,
                }}>×</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                  fontSize: 15, color: C.brownMid, lineHeight: 1.5,
                }}>{item}</span>
              </div>
            ))}
          </div>

          <div ref={depoisRef} style={{
            background: C.creamCard,
            borderLeft: `3px solid ${C.sage}`,
            borderRadius: '0 16px 16px 0',
            padding: mobile ? '32px 24px' : '40px 36px',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            transitionDelay: '100ms',
            opacity: depoisInView ? 1 : 0,
            transform: depoisInView ? 'translateY(0)' : 'translateY(28px)',
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 13, letterSpacing: '1.5px', textTransform: 'uppercase',
              color: C.sage, marginBottom: 24,
            }}>Depois</div>
            {depois.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                marginBottom: 14,
              }}>
                <span style={{
                  color: C.sage, fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500, fontSize: 16, flexShrink: 0, marginTop: 1,
                }}>→</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                  fontSize: 15, color: C.brownMid, lineHeight: 1.5,
                }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Desnível ─────────────────────────────────────────────────────────────────

const desnivelCards = [
  {
    title: 'A turma avança e fecha a porta',
    text: 'Com o tempo, os alunos que ficam acumulam um repertório que os novos não têm. A turma se torna inacessível. Você tem um grupo rodando, mas ele já não é mais uma porta de entrada.',
  },
  {
    title: 'Entrar aluno novo vira prejuízo',
    text: 'Ele não tem o repertório dos demais. Você fica preso entre dois problemas: aceita e ele se sente perdido; não aceita e perde faturamento.',
  },
  {
    title: 'Voltar o conteúdo desmotiva quem ficou',
    text: 'Para integrar quem chegou, você retoma o básico. Quem está há mais tempo sente que a aula parou. Você perde de um lado para não perder do outro.',
  },
  {
    title: 'A turma vai esvaziando',
    text: '20 viram 15, depois 12, depois 8. Até que uma turma "avançada" deixa de ser financeiramente viável. Você passou anos construindo e vê morrer aos poucos.',
  },
  {
    title: 'A grade fica engessada',
    text: 'Poucas entradas naturais ao longo do ano. Novas turmas do zero com frequência. Reposições, adaptações, emaranhado de níveis. Você perde liberdade para crescer.',
  },
  {
    title: 'O desnível é produzido pelo método',
    text: 'Quem perdeu aulas ou entrou depois parece "atrasado". A turma funciona como um trem: quem não embarcou no começo não consegue subir depois.',
  },
]

const desnivelBullets = [
  'Novos alunos entram sem quebrar a experiência dos antigos',
  'Os antigos não sentem que estão "voltando" — estão aprofundando',
  'A turma se renova e se sustenta ao longo do tempo',
]

function DesnivelCard({ card, delay }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      background: C.creamCard,
      borderLeft: `3px solid ${C.sageLight}`,
      borderRadius: 12, padding: 28,
      transition: 'opacity 0.7s ease, transform 0.7s ease',
      transitionDelay: `${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
    }}>
      <h3 style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        fontSize: 15, color: C.brown, marginBottom: 10, lineHeight: 1.4,
      }}>{card.title}</h3>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
        fontSize: 14, color: C.brownMid, lineHeight: 1.7,
      }}>{card.text}</p>
    </div>
  )
}

function DesnivelSection() {
  const [titleRef, titleInView] = useInView()
  const [solucaoRef, solucaoInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.creamDark,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* título */}
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: 64,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 20,
          }}>A Dor que Ninguém Nomeia</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 3.8vw, 48px)',
            color: C.brown, lineHeight: 1.25, letterSpacing: '-0.5px',
            marginBottom: 24,
          }}>
            Turmas não morrem porque os alunos saem.{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>
              Elas morrem porque o método não permite que novos alunos entrem.
            </em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 17, color: C.brownMid,
            maxWidth: 620, margin: '0 auto', lineHeight: 1.7,
          }}>
            No modelo baseado em passos, a turma só funciona enquanto todos têm o mesmo histórico. Qualquer saída enfraquece o grupo. Qualquer nova entrada vira um problema.
          </p>
        </div>

        {/* grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 16, marginBottom: 48,
        }}>
          {desnivelCards.map((card, i) => (
            <DesnivelCard key={i} card={card} delay={i * 80} />
          ))}
        </div>

        {/* bloco solução */}
        <div ref={solucaoRef} style={{
          borderLeft: `2px solid ${C.sage}`,
          background: C.sagePale,
          borderRadius: 12, padding: mobile ? '28px 24px' : '36px 40px',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: solucaoInView ? 1 : 0,
          transform: solucaoInView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          <h3 style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 18, color: C.brown, marginBottom: 16,
          }}>Como o Corpo Musical resolve</h3>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 16, color: C.brownMid, lineHeight: 1.75,
            marginBottom: 28,
          }}>
            Quando a progressão é construída em aprofundamento de bases — e não em acúmulo de passos — um aluno novo pode entrar acessando pulso, escuta e corpo enquanto os antigos aprofundam as mesmas camadas com mais sofisticação. O mesmo tema comporta diferentes profundidades. A turma deixa de ser uma linha cronológica rígida e passa a ser um campo de desenvolvimento vivo.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {desnivelBullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{
                  color: C.sage, fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500, fontSize: 16, flexShrink: 0, marginTop: 1,
                }}>→</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                  fontSize: 15, color: C.brownMid, lineHeight: 1.6,
                }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Para Quem ────────────────────────────────────────────────────────────────

const paraQuem = [
  'Você sente que o ensino só de passos ficou pequeno demais para o que quer oferecer',
  'Quer ensinar musicalidade e consciência corporal, mas não sabe como organizar isso numa aula',
  'Quer se diferenciar sem abandonar a dança social',
  'Está cansado de entrar em guerra de preço com quem oferece "mais passos por menos"',
  'Quer que seus alunos sintam que estão se transformando — não apenas acumulando repertório',
]

function ParaQuemSection() {
  const [titleRef, titleInView] = useInView()
  const [listRef, listInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: 56,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 20,
          }}>Esse Método é Para Você Se…</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 4vw, 48px)',
            color: C.brown, letterSpacing: '-0.5px',
          }}>
            Você já sabe dançar.{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>Agora quer ensinar diferente.</em>
          </h2>
        </div>

        <div ref={listRef} style={{
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: listInView ? 1 : 0,
          transform: listInView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          {paraQuem.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 16,
              marginBottom: 20,
              padding: '20px 24px',
              background: C.creamCard,
              border: `1px solid ${C.sageLight}`,
              borderRadius: 16,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: C.sagePale, border: `1.5px solid ${C.sage}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1,
              }}>
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path d="M1 4L4.5 7.5L11 1" stroke={C.sage} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                fontSize: 16, color: C.brownMid, lineHeight: 1.6,
              }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testemunhos ─────────────────────────────────────────────────────────────

const testemunhos = [
  {
    text: 'Depois do Corpo Musical, minha aula virou experiência. Meus alunos voltam toda semana porque sentem que estão mudando de verdade.',
    name: 'Mariana T.', sub: 'professora de forró · São Paulo',
  },
  {
    text: 'Eu passava passos e ficava me perguntando por que os alunos não evoluíam. Agora entendo o que faltava: uma base real.',
    name: 'Felipe R.', sub: 'professor de zouk · Curitiba',
  },
  {
    text: 'A parte dos corredores mudou tudo na forma como eu conduzo uma aula. Nunca mais precisei ficar inventando passos novos.',
    name: 'Camila S.', sub: 'professora de samba de gafieira · Rio de Janeiro',
  },
]

function TestCard({ t, delay }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      background: C.creamCard,
      border: `1px solid rgba(196,208,197,0.3)`,
      borderRadius: 16, padding: '36px 32px',
      position: 'relative', overflow: 'hidden',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
      transitionDelay: `${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 100, color: C.sageLight, opacity: 0.4,
        lineHeight: 0.6, marginBottom: 20, userSelect: 'none',
      }}>"</div>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic', fontSize: 17,
        color: C.cream, lineHeight: 1.65, marginBottom: 28,
      }}>{t.text}</p>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
        fontSize: 14, color: C.brownLight,
      }}>
        <span style={{ fontWeight: 500, color: C.creamDark }}>{t.name}</span>
        <br />{t.sub}
      </div>
    </div>
  )
}

function TestemunhosSection() {
  const [titleRef, titleInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.brown,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: 64,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sageLight,
            textTransform: 'uppercase', marginBottom: 20,
          }}>Quem Já Vive o Método</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(30px, 4vw, 50px)',
            color: C.cream, letterSpacing: '-0.5px',
          }}>
            Resultados de quem{' '}
            <em style={{ color: C.sageLight, fontStyle: 'italic' }}>mudou a base.</em>
          </h2>
        </div>

        {/* SUBSTITUIR POR DEPOIMENTOS REAIS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 24,
        }}>
          {testemunhos.map((t, i) => (
            <TestCard key={i} t={t} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Oferta ──────────────────────────────────────────────────────────────────

const inclusos = [
  'Metodologia completa dos 4 pilares',
  'Nova arquitetura de progressão de alunos',
  'Como ensinar musicalidade de forma prática',
  'O método dos corredores',
  'Como reduzir desnível de turma',
  'Ferramentas para consciência corporal e relacional',
  'Diferenciação metodológica para sair da guerra de preço',
]

function OfertaSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section id="oferta" style={{
      background: C.white,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: 52 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 20,
          }}>O Método</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(30px, 4vw, 50px)',
            color: C.brown, letterSpacing: '-0.5px',
          }}>
            Corpo Musical{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>para Professores</em>
          </h2>
        </div>

        <div ref={ref} style={{
          background: C.creamCard,
          border: `1.5px solid ${C.sageLight}`,
          borderRadius: 20,
          padding: mobile ? '40px 28px' : '56px',
          maxWidth: 620, margin: '0 auto',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(52px, 7vw, 72px)',
            color: C.brown, lineHeight: 1, marginBottom: 8,
          }}>
            R$ 297
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 14, color: C.brownLight, marginBottom: 32, letterSpacing: '0.3px',
          }}>
            pagamento único · acesso imediato
          </div>

          <div style={{ height: 1, background: C.sageLight, marginBottom: 32 }} />

          <div style={{ textAlign: 'left', marginBottom: 40 }}>
            {inclusos.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                marginBottom: 14,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: C.sagePale, border: `1.5px solid ${C.sage}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 2,
                }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke={C.sage} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                  fontSize: 15, color: C.brownMid, lineHeight: 1.5,
                }}>{item}</span>
              </div>
            ))}
          </div>

          {/* link de pagamento real será substituído depois */}
          <a href="#oferta" style={{
            display: 'block', width: '100%',
            background: C.sage, color: C.white,
            padding: '18px 32px', borderRadius: 100,
            fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500,
            textDecoration: 'none', textAlign: 'center',
            transition: 'background 0.2s, transform 0.2s',
            marginBottom: 16,
          }}
            onMouseEnter={e => { e.target.style.background = C.sageDark; e.target.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.target.style.background = C.sage; e.target.style.transform = 'translateY(0)' }}
          >
            Quero o método agora →
          </a>

          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            color: C.brownLight, letterSpacing: '0.3px',
          }}>
            Acesso imediato após confirmação · Pagamento seguro
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'Preciso ter muito tempo de carreira?',
    a: 'Não. O método reorganiza o que você já sabe numa nova base. Não exige que você saiba tudo — exige que você ensine diferente.',
  },
  {
    q: 'Funciona para qualquer estilo de dança a dois?',
    a: 'Sim. Forró, zouk, salsa, samba de gafieira e outros estilos de dança social. Os fundamentos são transversais.',
  },
  {
    q: 'E se meus alunos realmente só quiserem passos?',
    a: 'Essa é exatamente a crença que o método desmonta. Quando o aluno vive uma aula com base musical, ele percebe que estava buscando algo muito mais profundo.',
  },
  {
    q: 'Como funciona o acesso?',
    a: 'Após a confirmação do pagamento de R$ 297, você recebe acesso imediato ao conteúdo completo.',
  },
]

function FaqSection() {
  const [open, setOpen] = useState(null)
  const [titleRef, titleInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: 56,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 20,
          }}>Dúvidas</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 4vw, 46px)',
            color: C.brown, letterSpacing: '-0.5px',
          }}>
            Perguntas{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>frequentes</em>
          </h2>
        </div>

        {faqs.map((faq, i) => (
          <FaqItem key={i} faq={faq} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
        ))}
      </div>
    </section>
  )
}

function FaqItem({ faq, index, open, onToggle }) {
  const [ref, inView] = useInView()
  const answerRef = useRef(null)

  return (
    <div ref={ref} style={{
      borderBottom: `1px solid ${C.creamDark}`,
      transition: 'opacity 0.7s ease, transform 0.7s ease',
      transitionDelay: `${index * 80}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
    }}>
      <button onClick={onToggle} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', gap: 16,
        padding: '24px 0', background: 'none', border: 'none',
        cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 16, color: C.brown, lineHeight: 1.4,
        }}>{faq.q}</span>
        <span style={{
          color: C.sage, fontSize: 22, fontWeight: 300,
          flexShrink: 0, lineHeight: 1,
          transition: 'transform 0.25s',
          display: 'inline-block',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? 300 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.35s ease',
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: 15, color: C.brownMid, lineHeight: 1.7,
          paddingBottom: 24,
        }}>{faq.a}</p>
      </div>
    </div>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{
      background: C.brown,
      padding: '64px 40px 48px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 24, color: C.cream, marginBottom: 12,
      }}>
        Corpo Musical
      </div>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
        fontSize: 15, color: C.brownMid, marginBottom: 24,
      }}>
        Uma nova base para dançar, ensinar e se relacionar.
      </p>
      <a
        href="https://chrisbusato.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: 14, color: C.sageLight, textDecoration: 'none',
          display: 'inline-block', marginBottom: 32,
          borderBottom: `1px solid transparent`,
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.target.style.borderBottomColor = C.sageLight}
        onMouseLeave={e => e.target.style.borderBottomColor = 'transparent'}
      >
        chrisbusato.com
      </a>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
        fontSize: 13, color: C.brownLight,
      }}>
        © {new Date().getFullYear()} Corpo Musical. Todos os direitos reservados.
      </div>
    </footer>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function CorpoMusicalLP() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
      `}</style>
      <Navbar />
      <Hero />
      <DorSection />
      <LoopSection />
      <MetodoSection />
      <TransformacaoSection />
      <DesnivelSection />
      <ParaQuemSection />
      <TestemunhosSection />
      <OfertaSection />
      <FaqSection />
      <Footer />
    </>
  )
}
