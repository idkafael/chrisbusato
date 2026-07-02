import { useState, useEffect, useRef, createContext, useContext } from 'react'

const GlobalModeCtx = createContext({ globalMode: false, highlightOnline: false, onlineUrl: 'https://pay.cakto.com.br/bou4zi4_927919' })

const DIA_MUSICAL_URL = 'https://pay.cakto.com.br/xsj3gmd'
import carol1 from './images/carol1.jpeg'
import carol2 from './images/carol2.jpeg'
import carol3 from './images/carol3.jpeg'
import chris1 from './images/chris1.jpg'
import mark1 from './images/mark1.jpg'
import online1 from './images/online (1).mp4'
import online2 from './images/online (2).mp4'
import online3 from './images/online (3).mp4'
import online4 from './images/online (4).mp4'
import onlineImg1 from './images/online (1).jpeg'
import eve1 from './images/eve1.png'
import jul1 from './images/jul1.png'
import mire1 from './images/mire1.png'
import feedback10 from './images/feedback10.jpeg'
import feedback11 from './images/feedback11.jpeg'
import fundoHero from './images/fundo-primeira-dobra.jpg'
import chrisSorrindo from './images/chris-sorrindo.jpg'

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
        height: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'relative',
      }}>
        {/* título centralizado absolutamente */}
        <span style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'Playfair Display', serif",
          fontSize: 20, color: C.brown, letterSpacing: '-0.3px',
          whiteSpace: 'nowrap',
        }}>
          Vivência Brincando na Música
        </span>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const w = useWindowWidth()
  const mobile = w < 768
  const { globalMode, highlightOnline } = useContext(GlobalModeCtx)

  useEffect(() => {
    if (document.querySelector('script[src*="6a120f7fc9941c35508e9807"]')) return
    const s = document.createElement('script')
    s.src = 'https://scripts.converteai.net/1c6e6f27-d6f0-4013-b98a-0067464a2b63/players/6a120f7fc9941c35508e9807/v4/player.js'
    s.async = true
    document.head.appendChild(s)
  }, [])

  return (
    <section style={{
      background: C.cream,
      position: 'sticky', top: 0, zIndex: 1,
      overflow: 'hidden',
      minHeight: '100vh',
      padding: mobile ? '104px 20px 56px' : '124px 40px 56px',
      display: 'flex', alignItems: 'center',
    }}>
      {/* imagem de fundo (mesma da plataforma, efeito sticky) */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${fundoHero})`,
        backgroundSize: 'cover',
        backgroundPosition: mobile ? 'center 15%' : 'center 20%',
        pointerEvents: 'none',
      }} />
      {/* overlay pra legibilidade (mais leve, deixa a imagem aparecer mais) */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: mobile
          ? 'linear-gradient(to bottom, rgba(237,234,227,0.72) 0%, rgba(237,234,227,0.22) 42%, rgba(237,234,227,0.68) 100%)'
          : 'linear-gradient(to bottom, rgba(237,234,227,0.68) 0%, rgba(237,234,227,0.14) 40%, rgba(237,234,227,0.62) 100%)',
      }} />
      {/* rabiscos decorativos (tema brincando) */}
      {!mobile && <>
        <svg style={{ position: 'absolute', top: '14%', left: '6%', opacity: 0.5, pointerEvents: 'none' }} width="56" height="56" viewBox="0 0 56 56" fill="none">
          <path d="M4 28c8-16 24-20 30-8s-4 20-14 16 2-22 18-18" stroke={C.sageDark} strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
        <svg style={{ position: 'absolute', bottom: '10%', right: '7%', opacity: 0.5, pointerEvents: 'none' }} width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="14" cy="30" r="5" stroke={C.sageDark} strokeWidth="2"/>
          <path d="M19 30V8l16-4v20" stroke={C.sageDark} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="35" cy="24" r="5" stroke={C.sageDark} strokeWidth="2"/>
        </svg>
      </>}

      <div style={{
        maxWidth: 760, textAlign: 'center', position: 'relative', zIndex: 1,
        margin: '0 auto',
        animation: 'fadeUp 0.9s ease forwards',
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 6vw, 72px)',
          color: C.brown, lineHeight: 1.15,
          marginBottom: mobile ? 24 : 36, letterSpacing: '-1px',
          textShadow: '0 2px 24px rgba(237,234,227,0.85), 0 1px 3px rgba(237,234,227,0.6)',
        }}>
          Para brincar mais na dança,<br />
          você não precisa de{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>mais passos.</em>
        </h1>

        {/* VSL em moldura tipo foto colada */}
        <div style={{ marginBottom: mobile ? 24 : 36, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            position: 'relative',
            background: C.white,
            padding: mobile ? '8px 8px 8px' : '12px 12px 12px',
            borderRadius: 10,
            boxShadow: '0 24px 54px rgba(61,53,48,0.30)',
            transform: 'rotate(-1.1deg)',
            maxWidth: 560, width: '100%',
          }}>
            <WashiTape color={C.sage} rotate={-7} top={-15} left="20%" width={62} />
            <WashiTape color={C.brownLight} rotate={9} top={-13} left="82%" width={54} />
            <div style={{ borderRadius: 6, overflow: 'hidden' }}>
              <vturb-smartplayer
                id="vid-6a120f7fc9941c35508e9807"
                style={{ display: 'block', margin: '0 auto', width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
          {/* Botão online — primeiro quando highlightOnline */}
          {highlightOnline && <a href="#ingresso-online" style={{
            display: 'inline-block',
            background: C.sage, color: C.white,
            padding: '17px 36px', borderRadius: 100,
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600,
            textDecoration: 'none', letterSpacing: '0.2px',
            boxShadow: `0 6px 24px rgba(107,127,109,0.35)`,
            transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.sageDark; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(107,127,109,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.sage; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(107,127,109,0.35)' }}
          >
            Quero a gravação da vivência online
          </a>}
          {/* Botão presencial → agora aponta pro Dia Musical (12/07 esgotado) */}
          {!globalMode && <a href="#dia-musical" style={{
            display: 'inline-block',
            background: highlightOnline ? C.sagePale : C.sage,
            color: highlightOnline ? C.sageDark : C.white,
            border: highlightOnline ? `2px solid ${C.sage}` : 'none',
            padding: '17px 36px', borderRadius: 100,
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600,
            textDecoration: 'none', letterSpacing: '0.2px',
            boxShadow: highlightOnline ? 'none' : `0 6px 24px rgba(107,127,109,0.35)`,
            transition: 'background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.sage; e.currentTarget.style.color = C.white; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = highlightOnline ? C.sagePale : C.sage; e.currentTarget.style.color = highlightOnline ? C.sageDark : C.white; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Presencial 12/07 esgotou · Vem aí o Dia Musical
          </a>}
          {/* Botão online — segundo quando NÃO é highlightOnline */}
          {!highlightOnline && <a href="#ingresso-online" style={{
            display: 'inline-block',
            background: C.sagePale, color: C.sageDark,
            border: `2px solid ${C.sage}`,
            padding: '17px 36px', borderRadius: 100,
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600,
            textDecoration: 'none', letterSpacing: '0.2px',
            transition: 'background 0.2s, color 0.2s, transform 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.sage; e.currentTarget.style.color = C.white; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.sagePale; e.currentTarget.style.color = C.sageDark; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Quero a gravação da vivência online
          </a>}
        </div>

      </div>
    </section>
  )
}

// ─── Dor ─────────────────────────────────────────────────────────────────────

const dorCards = [
  {
    n: '01',
    title: 'Aprende na aula, trava na pista',
    text: 'Os passos fazem sentido no treino. No baile, a cabeça grita "e agora?" e o corpo congela.',
  },
  {
    n: '02',
    title: 'Sente a música mas não consegue usar',
    text: 'Você percebe que a música mudou. Sabe que deveria fazer algo diferente. Mas não sabe o quê.',
  },
  {
    n: '03',
    title: 'Parece que nunca é suficiente',
    text: 'Aprende um passo, quer mais. Aprende mais, ainda sente que falta algo. O repertório cresce, a sensação de limitação não passa.',
  },
  {
    n: '04',
    title: 'Dança "no piloto automático"',
    text: 'A mesma sequência toda vez. Não porque quer, mas porque não sabe como sair dela sem perder o ritmo.',
  },
  {
    n: '05',
    title: 'Insegurança de não "acertar"',
    text: 'A preocupação de errar o tempo toma mais espaço do que a dança em si. Você monitora mais do que dança.',
  },
  {
    n: '06',
    title: 'A música passa, você não brinca',
    text: 'Às vezes você percebe uma frase musical incrível. O momento passa. O corpo não respondeu a tempo.',
  },
]

function DorCard({ card, delay, mobile }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: mobile ? '52px 1fr' : '72px 1fr',
      gap: mobile ? 16 : 24,
      padding: mobile ? '26px 0' : '30px 0',
      borderTop: '1px solid rgba(237,234,227,0.14)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
      transitionDelay: `${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic', fontSize: mobile ? 34 : 42,
        color: 'rgba(196,208,197,0.4)',
        lineHeight: 1, userSelect: 'none', paddingTop: 2,
      }}>{card.n}</div>
      <div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 18 : 20, color: C.cream, marginBottom: 8, lineHeight: 1.3,
        }}>{card.title}</h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: mobile ? 14.5 : 15.5, color: C.brownLight, lineHeight: 1.65,
        }}>{card.text}</p>
      </div>
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
      position: 'relative', zIndex: 2,
      marginTop: mobile ? -36 : -60,
      borderTopLeftRadius: mobile ? 28 : 44,
      borderTopRightRadius: mobile ? 28 : 44,
      boxShadow: '0 -24px 50px rgba(0,0,0,0.18)',
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
          }}>O Que Acontece</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(32px, 4vw, 52px)',
            color: C.cream, lineHeight: 1.2, letterSpacing: '-0.5px',
          }}>
            Você aprende os passos.{' '}
            <em style={{ color: C.sageLight, fontStyle: 'italic' }}>
              Mas a música continua passando.
            </em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 17, color: C.brownLight,
            maxWidth: 520, margin: '20px auto 0', lineHeight: 1.7,
          }}>
            Não é falta de capacidade. É que ninguém te mostrou o mapa. A música tem uma estrutura, e quando você entende isso, o corpo começa a saber onde pode ir.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(2, 1fr)',
          columnGap: 56,
        }}>
          {dorCards.map((card, i) => (
            <DorCard key={i} card={card} delay={i * 70} mobile={mobile} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Virada ───────────────────────────────────────────────────────────────────

function ViradaSection() {
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
            Não é sobre repertório de passos predeterminados. É sobre repertório musical.
          </blockquote>

          <div style={{
            height: 1, background: C.sageLight, marginBottom: 28,
          }} />

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 16, color: C.brownMid, lineHeight: 1.7,
            position: 'relative', zIndex: 1,
          }}>
            A maioria das pessoas aprende movimentos. Poucas aprendem a enxergar possibilidades dentro da música. Quando você entende a base musical do que já faz (ou do que quer fazer), o passo deixa de ser uma obrigação e passa a ser uma escolha.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── O Mapa ───────────────────────────────────────────────────────────────────

const mapaItens = [
  {
    n: '01',
    title: 'Estrutura Musical',
    text: 'O que sustenta a música quando você quer se mover dentro dela. Pulso, frases, blocos, contrastes. Não como teoria, mas como mapa de possibilidades para o corpo.',
  },
  {
    n: '02',
    title: 'Musicalização',
    text: 'O quanto você se permite ser afetado pela música. Sentir antes de mover. Deixar que o que escuta chegue ao corpo, e só então dançar a partir disso.',
  },
  {
    n: '03',
    title: 'O Sentir',
    text: 'Reconhecer o que a música pede. Não como resposta automática, mas como escuta ativa. A dança começa antes do movimento.',
  },
  {
    n: '04',
    title: 'O Sustentar',
    text: 'Ter estrutura o suficiente para que o sentir vire dança, e não só uma reação vaga. Liberdade que se apoia em algo sólido.',
  },
]

function MapaCard({ item, delay }) {
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
      }}>{item.n}</div>
      <h3 style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        fontSize: 18, color: C.brown, marginBottom: 12,
      }}>{item.title}</h3>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
        fontSize: 15, color: C.brownMid, lineHeight: 1.7,
      }}>{item.text}</p>
    </div>
  )
}

function MapaSection() {
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
          }}>A Vivência</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(30px, 4vw, 50px)',
            color: C.brown, letterSpacing: '-0.5px', marginBottom: 20,
          }}>
            Um mapa simples para{' '}
            <em style={{ color: C.sage, fontStyle: 'italic' }}>brincar dentro da música.</em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 17, color: C.brownMid,
            maxWidth: 560, margin: '0 auto', lineHeight: 1.7,
          }}>
            Você vai entender a base musical do que já dança, e como usar essa estrutura para criar mais liberdade, não mais obrigação.
          </p>
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
            }}>Sem o mapa</div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              fontSize: 16, color: C.brownMid, lineHeight: 1.8,
            }}>
              passo{' '}
              <span style={{ color: C.brownLight }}>→</span>{' '}
              repetição{' '}
              <span style={{ color: C.brownLight }}>→</span>{' '}
              pista{' '}
              <span style={{ color: C.brownLight }}>→</span>{' '}
              travamento{' '}
              <span style={{ color: C.brownLight }}>→</span>{' '}
              mais passos
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
            }}>Com o mapa</div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              fontSize: 16, color: C.brownMid, lineHeight: 1.8,
            }}>
              escuta{' '}
              <span style={{ color: C.sage }}>→</span>{' '}
              estrutura{' '}
              <span style={{ color: C.sage }}>→</span>{' '}
              possibilidades{' '}
              <span style={{ color: C.sage }}>→</span>{' '}
              escolha{' '}
              <span style={{ color: C.sage }}>→</span>{' '}
              expressão
            </p>
          </div>
        </div>

        {/* cards do mapa */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 24,
        }}>
          {mapaItens.map((item, i) => (
            <MapaCard key={i} item={item} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── O Que Você Vai Viver ─────────────────────────────────────────────────────

const experiencias = [
  {
    title: 'Entender melhor a música que você dança',
    text: 'Reconhecer tempos, frases e mudanças musicais para saber onde está e como se movimentar com mais liberdade.',
  },
  {
    title: 'Brincar mais dentro da música',
    text: 'Perceber pausas, acentos e caminhos que a música oferece, sem precisar depender de decorar mil passos.',
  },
  {
    title: 'Dançar com mais sentido',
    text: 'Dançar não é só executar movimentos, mas também não é só sentir. Unir escuta, corpo e estrutura para que sua dança fique mais viva, expressiva e mais sentida.',
  },
  {
    title: 'Ganhar autonomia e segurança',
    text: 'Aprender a usar a música como guia para criar movimentos, brincar com possibilidades e dançar com mais fluidez.',
  },
]

function ExpItem({ exp, index, delay }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      display: 'flex', gap: 16, alignItems: 'flex-start',
      padding: '18px 0',
      borderBottom: index < experiencias.length - 1 ? `1px solid ${C.sageLight}` : 'none',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
      transitionDelay: `${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(18px)',
    }}>
      <div style={{
        flexShrink: 0,
        fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
        fontSize: 22, color: C.sageDark, opacity: 0.55,
        lineHeight: 1.3, width: 30,
      }}>{String(index + 1).padStart(2, '0')}</div>
      <div>
        <h3 style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
          fontSize: 16, color: C.brown, marginBottom: 6, lineHeight: 1.4,
        }}>{exp.title}</h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: 14.5, color: C.brownMid, lineHeight: 1.65,
        }}>{exp.text}</p>
      </div>
    </div>
  )
}

function VivenciaSection() {
  const [titleRef, titleInView] = useInView()
  const [photoRef, photoInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.sagePale,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
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
          }}>O Que Acontece na Vivência</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(30px, 4vw, 50px)',
            color: C.brown, letterSpacing: '-0.5px',
          }}>
            Você vai sair dançando diferente.{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>Não porque aprendeu mais passos.</em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 17, color: C.brownMid,
            maxWidth: 520, margin: '20px auto 0', lineHeight: 1.7,
          }}>
            Mas porque percebeu o que está por trás deles, e as inúmeras possibilidades musicais que existem em uma dança.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '0.8fr 1.2fr',
          gap: mobile ? 40 : 64,
          alignItems: 'center',
        }}>
          {/* foto da Chris, moldura tipo foto colada */}
          <div ref={photoRef} style={{
            display: 'flex', justifyContent: 'center',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            opacity: photoInView ? 1 : 0,
            transform: photoInView ? 'translateY(0)' : 'translateY(24px)',
          }}>
            <div style={{
              position: 'relative',
              background: C.white,
              padding: '10px 10px 34px',
              borderRadius: 8,
              boxShadow: '0 20px 46px rgba(61,53,48,0.22)',
              transform: 'rotate(-1.5deg)',
              maxWidth: 340, width: '100%',
            }}>
              <WashiTape color={C.sage} rotate={7} top={-15} left="24%" width={58} />
              <div style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '4/5' }}>
                <img src={chrisSorrindo} alt="Chris Busato"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{
                position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center',
                fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                fontSize: 14, color: C.brownMid,
              }}>Chris Busato</div>
            </div>
          </div>

          {/* lista editorial */}
          <div>
            {experiencias.map((exp, i) => (
              <ExpItem key={i} exp={exp} index={i} delay={i * 90} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Consciência Corporal & Relacional ────────────────────────────────────────

const consciencia = [
  {
    sintoma: 'Corpo rígido',
    sintomaDesc: 'tensão nos ombros, braços e quadril — o movimento não circula',
    depois: 'Corpo solto',
    depoisDesc: 'mais chão, respiração e disponibilidade pra se mover',
  },
  {
    sintoma: 'Sem eixo',
    sintomaDesc: 'desequilíbrio, pisada insegura, "não sei onde me apoiar"',
    depois: 'Autonomia',
    depoisDesc: 'sente o próprio centro e se organiza sozinho',
  },
  {
    sintoma: 'Cabeça no comando',
    sintomaDesc: '"qual passo? tá certo?" — corpo mecânico e atrasado',
    depois: 'Escuta no comando',
    depoisDesc: 'responde ao pulso, não à memória',
  },
  {
    sintoma: 'Fronteira confusa',
    sintomaDesc: 'puxa, pesa, antecipa ou desaparece no parceiro',
    depois: 'Conexão real',
    depoisDesc: 'sente limite, direção e resposta do outro',
  },
]

function ConscienciaRow({ item, index, mobile }) {
  const [ref, inView] = useInView()
  const [hovered, setHovered] = useState(false)
  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 16, overflow: 'hidden',
        background: C.white,
        border: `1px solid ${C.sageLight}`,
        boxShadow: hovered ? '0 16px 38px rgba(61,53,48,0.12)' : '0 3px 12px rgba(61,53,48,0.05)',
        transition: 'opacity 0.7s ease, transform 0.55s ease, box-shadow 0.3s ease',
        transitionDelay: `${index * 80}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? (hovered ? 'translateY(-3px)' : 'translateY(0)') : 'translateY(20px)',
      }}>
      <div style={{
        position: 'absolute', top: -12, right: 12,
        fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
        fontSize: 76, color: C.sagePale, lineHeight: 1,
        pointerEvents: 'none', userSelect: 'none', zIndex: 0,
      }}>{String(index + 1).padStart(2, '0')}</div>

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: mobile ? 'column' : 'row',
      }}>
        <div style={{ flex: 1, padding: mobile ? '20px 20px 16px' : '22px 24px' }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: 15, color: C.brown, marginBottom: 5,
          }}>{item.sintoma}</div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 13.5, color: C.brownLight, lineHeight: 1.5,
          }}>{item.sintomaDesc}</span>
        </div>

        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: mobile ? 0 : '0 4px',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `linear-gradient(150deg, ${C.sage} 0%, ${C.sageDark} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(107,127,109,0.35)',
            transform: mobile ? 'rotate(90deg)' : 'none',
            margin: mobile ? '-2px 0' : 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h9M8 3.5L11.5 7 8 10.5" stroke={C.white} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div style={{
          flex: 1, padding: mobile ? '16px 20px 20px' : '22px 24px',
          background: C.sagePale,
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: 15, color: C.sageDark, marginBottom: 5,
          }}>{item.depois}</div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 13.5, color: C.brownMid, lineHeight: 1.5,
          }}>{item.depoisDesc}</span>
        </div>
      </div>
    </div>
  )
}

function MiniPolaroid({ src, caption, rotate = 0, tapeColor = C.sage, offsetY = 0 }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: C.white,
        padding: '8px 8px 26px',
        borderRadius: 8,
        boxShadow: hovered ? '0 20px 44px rgba(61,53,48,0.28)' : '0 12px 30px rgba(61,53,48,0.18)',
        transform: `translateY(${offsetY}px) rotate(${hovered ? 0 : rotate}deg) scale(${hovered ? 1.04 : 1})`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        width: 168,
      }}>
      <WashiTape color={tapeColor} rotate={rotate <= 0 ? 8 : -8} top={-14} left="50%" width={48} />
      <div style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '4/5' }}>
        <img src={src} alt={caption}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
      </div>
      <div style={{
        position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center', padding: '0 6px',
        fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
        fontSize: 11.5, color: C.brownMid, lineHeight: 1.25,
      }}>{caption}</div>
    </div>
  )
}

function ConscienciaSection() {
  const [titleRef, titleInView] = useInView()
  const [quoteRef, quoteInView] = useInView()
  const [closeRef, closeInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.white,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: 40,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 20,
          }}>Consciência Corporal & Relacional</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 4vw, 46px)',
            color: C.brown, lineHeight: 1.2, letterSpacing: '-0.5px',
          }}>
            O corpo trava antes da cabeça perceber.{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>A consciência é o que muda isso.</em>
          </h2>
        </div>

        <div ref={quoteRef} style={{
          textAlign: 'center', maxWidth: 620, margin: '0 auto 56px',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          opacity: quoteInView ? 1 : 0,
          transform: quoteInView ? 'translateY(0)' : 'translateY(20px)',
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
            fontSize: mobile ? 17 : 20, color: C.brownMid, lineHeight: 1.6,
          }}>
            Quando falta consciência corporal, você não sente bem o próprio corpo.{' '}
            Quando falta consciência relacional, você não sente bem o corpo do outro perto do seu.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 64 }}>
          {consciencia.map((item, i) => (
            <ConscienciaRow key={i} item={item} index={i} mobile={mobile} />
          ))}
        </div>

        {/* fechamento: ideia central + prova real */}
        <div ref={closeRef} style={{
          textAlign: 'center',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          opacity: closeInView ? 1 : 0,
          transform: closeInView ? 'translateY(0)' : 'translateY(24px)',
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 22 : 28, color: C.brown, lineHeight: 1.4,
            letterSpacing: '-0.3px',
            maxWidth: 680, margin: '0 auto',
          }}>
            A dança melhora quando o corpo deixa de só executar movimentos e passa a{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>perceber: a si mesmo, a música, o outro e o espaço.</em>
          </p>

          {/* mural de fotos reais: quem já viveu essa mudança */}
          <div style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
            gap: mobile ? 24 : 28, marginTop: mobile ? 44 : 56,
          }}>
            <MiniPolaroid src={jul1} caption="Juliana, sobre dançar a dois" rotate={-3} tapeColor={C.sage} offsetY={0} />
            <MiniPolaroid src={feedback11} caption="Aluna, sobre consciência corporal" rotate={2.2} tapeColor={C.brownLight} offsetY={mobile ? 0 : 16} />
            <MiniPolaroid src={feedback10} caption="Ana, sobre anos dançando no automático" rotate={-1.5} tapeColor={C.sageDark} offsetY={mobile ? 0 : -12} />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Transformação ───────────────────────────────────────────────────────────

const antes = [
  'Aprende passo, trava na pista',
  'A cabeça monitora o tempo todo',
  'Repertório cresce, liberdade não',
  'A música passa sem você participar',
  'Dança no piloto automático',
  'Insegurança de "estar errado"',
]

const depois = [
  'Entende onde pode ir na música',
  'O corpo escuta e responde',
  'Menos passos, mais possibilidades',
  'Percebe os convites da música',
  'Faz escolhas enquanto dança',
  'Confiança que vem de estrutura',
]

function TransformacaoSection() {
  const [titleRef, titleInView] = useInView()
  const [antesRef, antesInView] = useInView()
  const [depoisRef, depoisInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.creamDark,
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
            Para de decorar.{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>Começa a brincar.</em>
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
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
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
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
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

// ─── Statement Strip ─────────────────────────────────────────────────────────

function StatementStrip() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.brown,
      padding: mobile ? '64px 24px' : '80px 40px',
      textAlign: 'center',
    }}>
      <div ref={ref} style={{
        maxWidth: 820, margin: '0 auto',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
      }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(26px, 4vw, 48px)',
          color: C.cream, lineHeight: 1.35,
          letterSpacing: '-0.5px',
        }}>
          "O corpo que escuta{' '}
          <span style={{ color: C.sageLight }}>dança diferente.</span>"
        </p>
      </div>
    </section>
  )
}

// ─── Marquee Strip ────────────────────────────────────────────────────────────

const marqueeWords = [
  'estrutura', '·', 'musicalização', '·', 'sentir', '·', 'sustentar',
  '·', 'pulso', '·', 'escuta', '·', 'ritmo', '·', 'brincando',
  '·', 'movimento', '·', 'música', '·', 'liberdade', '·', 'expressão',
]

function MarqueeStrip() {
  const words = [...marqueeWords, ...marqueeWords]
  return (
    <div style={{
      background: C.sagePale,
      borderTop: `1px solid ${C.sageLight}`,
      borderBottom: `1px solid ${C.sageLight}`,
      padding: '18px 0',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }}>
      <div style={{
        display: 'inline-block',
        animation: 'marquee 28s linear infinite',
      }}>
        {words.map((w, i) => (
          <span key={i} style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: w === '·' ? 400 : 500,
            fontSize: 13,
            letterSpacing: w === '·' ? '0' : '1.5px',
            textTransform: w === '·' ? 'none' : 'uppercase',
            color: w === '·' ? C.sageLight : C.sageDark,
            marginRight: 24,
          }}>{w}</span>
        ))}
      </div>
    </div>
  )
}

// ─── Pull Quote ───────────────────────────────────────────────────────────────

function PullQuote() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.white,
      padding: mobile ? '72px 24px' : '96px 40px',
    }}>
      <div ref={ref} style={{
        maxWidth: 640, margin: '0 auto', textAlign: 'center',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
      }}>
        <div style={{
          width: 40, height: 2, background: C.sage,
          margin: '0 auto 32px',
        }} />
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(20px, 3vw, 30px)',
          color: C.brown, lineHeight: 1.55,
          marginBottom: 24,
        }}>
          Você não precisa aprender mais. Precisa entender o que já tem, e o que a música está te oferecendo o tempo inteiro.
        </p>
        <div style={{
          width: 40, height: 2, background: C.sage,
          margin: '0 auto',
        }} />
      </div>
    </section>
  )
}

// ─── Stats Strip ──────────────────────────────────────────────────────────────

const stats = [
  { n: '1', label: 'mapa musical' },
  { n: '4', label: 'camadas de escuta' },
  { n: '∞', label: 'possibilidades na música' },
]

function StatsStrip() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.sage,
      padding: mobile ? '56px 24px' : '72px 40px',
    }}>
      <div ref={ref} style={{
        maxWidth: 800, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
        gap: mobile ? 40 : 0,
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            textAlign: 'center',
            borderRight: (!mobile && i < stats.length - 1) ? `1px solid rgba(255,255,255,0.2)` : 'none',
            padding: mobile ? '0' : '0 32px',
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(48px, 6vw, 72px)',
              color: C.white, lineHeight: 1,
              marginBottom: 8,
            }}>{s.n}</div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 14, letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
            }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Para Quem ────────────────────────────────────────────────────────────────

const paraQuemItens = [
  {
    frase: 'Você vai pro baile e repete as mesmas duas ou três coisas. Não porque quer, mas porque é o que aparece.',
    detalhe: 'O corpo vai no automático.',
  },
  {
    frase: 'A música muda. Você percebe. O corpo não vai junto.',
    detalhe: 'Você vê o momento, só não sabe o que fazer nele.',
  },
  {
    frase: 'Já aprendeu bastante. A sensação de limitação não foi embora com os passos.',
    detalhe: 'Mais repertório não parece ser a resposta.',
  },
  {
    frase: 'Às vezes você dança bem. Outras vezes trava. E você não entende por quê.',
    detalhe: 'Não é inconsistência, é falta de mapa.',
  },
]

function ParaQuemSection() {
  const [titleRef, titleInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          marginBottom: 56, textAlign: 'center',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(28px)',
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 4vw, 48px)',
            color: C.brown, letterSpacing: '-0.5px', marginBottom: 16,
          }}>
            Isso soa familiar?
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 17, color: C.brownMid, lineHeight: 1.7,
          }}>
            Se algum desses cenários parece com o que você vive, essa vivência foi feita para você.
          </p>
        </div>

        <div>
          {paraQuemItens.map((item, i) => (
            <ParaQuemItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ParaQuemItem({ item, index }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      borderTop: `1px solid ${C.creamDark}`,
      padding: '28px 0',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
      transitionDelay: `${index * 80}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
    }}>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic',
        fontSize: 'clamp(18px, 2.2vw, 22px)',
        color: C.brown, lineHeight: 1.55, marginBottom: 10,
      }}>{item.frase}</p>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
        fontSize: 15, color: C.brownMid, lineHeight: 1.5,
      }}>{item.detalhe}</p>
    </div>
  )
}

// ─── Testemunhos (Carrossel) ──────────────────────────────────────────────────

const feedbackItems = [
  { src: carol1, name: 'Carol' },
  { src: carol2, name: 'Carol' },
  { src: carol3, name: 'Carol' },
  { src: chris1, name: 'Chris' },
  { src: mark1,  name: 'Mark'  },
]

// ─── Colagem lúdica (fita + moldura tipo foto colada) ─────────────────────────

function WashiTape({ color = C.sage, rotate = -8, top = -15, left = '50%', width = 64 }) {
  return (
    <div style={{
      position: 'absolute', top, left,
      transform: `translateX(-50%) rotate(${rotate}deg)`,
      width, height: 24,
      background: color, opacity: 0.88,
      boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
      backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.24) 0px, rgba(255,255,255,0.24) 3px, transparent 3px, transparent 7px)',
      zIndex: 5, pointerEvents: 'none',
    }} />
  )
}

function PolaroidVideo({ src, caption, rotate = 0, tapeColor = C.sage, tapeLeft = '50%' }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: C.white,
        padding: caption ? '10px 10px 32px' : '10px 10px 10px',
        borderRadius: 8,
        boxShadow: hovered ? '0 22px 50px rgba(61,53,48,0.30)' : '0 12px 32px rgba(61,53,48,0.20)',
        transform: `rotate(${hovered ? 0 : rotate}deg) scale(${hovered ? 1.02 : 1})`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <WashiTape color={tapeColor} rotate={rotate <= 0 ? 7 : -7} top={-15} left={tapeLeft} width={58} />
      <div style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '16/9' }}>
        <VideoPlayer src={src} />
      </div>
      {caption && (
        <div style={{
          position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center',
          fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
          fontSize: 13, color: C.brownMid,
        }}>{caption}</div>
      )}
    </div>
  )
}

// ─── VIVÊNCIAS ───────────────────────────────────────────────────────────────
function VideoPlayer({ src }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && videoRef.current) {
        videoRef.current.pause()
        setPlaying(false)
      }
    }, { threshold: 0.3 })
    if (videoRef.current) obs.observe(videoRef.current)
    return () => obs.disconnect()
  }, [])

  const toggle = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  const showOverlay = !playing || hovered

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <video
        ref={videoRef}
        src={`${src}#t=0.001`}
        playsInline
        preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onEnded={() => setPlaying(false)}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: playing ? (hovered ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0)') : 'rgba(0,0,0,0.32)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.25s ease',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          border: '1.5px solid rgba(255,255,255,0.45)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: showOverlay ? 1 : 0,
          transform: showOverlay ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}>
          {playing ? (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <rect x="1" y="1" width="4" height="14" rx="1.5" fill="white"/>
              <rect x="9" y="1" width="4" height="14" rx="1.5" fill="white"/>
            </svg>
          ) : (
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
              <path d="M2 1.5l13 7.5-13 7.5V1.5z" fill="white"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

function VideoSlot({ label, aspectRatio = '16/9' }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* label tag */}
      <div style={{
        position: 'absolute', top: 14, left: 14, zIndex: 2,
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 100, padding: '4px 12px',
        fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
        fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.9)',
        textTransform: 'uppercase',
      }}>{label}</div>

      {/* frame do vídeo */}
      <div style={{
        aspectRatio,
        background: 'linear-gradient(135deg, #1a1008 0%, #2e1f14 60%, #1a1008 100%)',
        borderRadius: 16, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        position: 'relative',
      }}>
        {/* grain overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          opacity: 0.4, pointerEvents: 'none',
        }} />
        {/* play button */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}>
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
            <path d="M1 1.5l16 8.5-16 8.5V1.5z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
        </div>
        {/* texto placeholder */}
        <div style={{
          position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px',
        }}>vídeo em breve</div>
      </div>
    </div>
  )
}

function OnlinePlaceholder() {
  return (
    <div style={{
      aspectRatio: '4/3',
      background: C.creamCard,
      borderRadius: 12,
      border: `1.5px dashed ${C.sageLight}`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      <div style={{ fontSize: 22, opacity: 0.4 }}>🖼</div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        fontSize: 10, letterSpacing: '1.5px', color: C.brownLight,
        textTransform: 'uppercase', opacity: 0.5,
      }}>imagem online</div>
    </div>
  )
}

function VivenciasSection() {
  const [ref, inView] = useInView()
  const mobile = useWindowWidth() < 768

  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '64px 24px 40px' : '96px 40px 48px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 16,
          }}>Já aconteceu</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(28px, 7vw, 36px)' : 'clamp(30px, 3vw, 44px)',
            color: C.brown, letterSpacing: '-0.5px', lineHeight: 1.2,
          }}>
            Veja como é{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>na prática.</em>
          </h2>
        </div>

        <div ref={ref} style={{
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(32px)',
        }}>

          {/* ── PRESENCIAL ── */}
          <div style={{ marginBottom: 56 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
            }}>
              <div style={{ height: 1, flex: 1, background: C.sageLight }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                fontSize: 10, letterSpacing: '2.5px', color: C.sageDark,
                textTransform: 'uppercase',
              }}>📍 Presencial · MK Danças, Zona Sul SP</span>
              <div style={{ height: 1, flex: 1, background: C.sageLight }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
              gap: mobile ? 32 : 20,
              paddingTop: 14,
            }}>
              {[
                'https://i.imgur.com/k1A44n2.mp4',
                'https://i.imgur.com/KVxXjuR.mp4',
              ].map((src, i) => (
                <PolaroidVideo
                  key={i}
                  src={src}
                  rotate={i === 0 ? -2.5 : 2}
                  tapeColor={i === 0 ? C.sage : C.brownLight}
                  tapeLeft={i === 0 ? '22%' : '78%'}
                />
              ))}
            </div>
          </div>

          {/* ── AO VIVO ── */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
            }}>
              <div style={{ height: 1, flex: 1, background: C.sageLight }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                fontSize: 10, letterSpacing: '2.5px', color: C.sageDark,
                textTransform: 'uppercase',
              }}>📡 Online · Ao vivo</span>
              <div style={{ height: 1, flex: 1, background: C.sageLight }} />
            </div>

            {/* vídeos online 1 e 2 — lado a lado */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
              gap: mobile ? 32 : 20, marginBottom: mobile ? 32 : 24,
              paddingTop: 14,
            }}>
              {[online1, online2].map((src, i) => (
                <PolaroidVideo
                  key={i}
                  src={src}
                  rotate={i === 0 ? 2 : -1.8}
                  tapeColor={i === 0 ? C.sageDark : C.sage}
                  tapeLeft={i === 0 ? '78%' : '24%'}
                />
              ))}
            </div>

            {/* vídeos online 3 e 4 — grid 2 cols */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: mobile ? 20 : 16,
              paddingTop: 14,
            }}>
              {[online3, online4].map((src, i) => (
                <PolaroidVideo
                  key={i}
                  src={src}
                  rotate={i === 0 ? -1.5 : 1.5}
                  tapeColor={i === 0 ? C.brownLight : C.sageDark}
                  tapeLeft="50%"
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function TestemunhosSection() {
  const [titleRef, titleInView] = useInView()
  const [paused, setPaused] = useState(false)
  const w = useWindowWidth()
  const mobile = w < 768
  const CARD_W = mobile ? 260 : 320
  const GAP = 20
  const looped = [...feedbackItems, ...feedbackItems, ...feedbackItems]

  return (
    <section style={{
      background: C.brown,
      padding: mobile ? '72px 0 80px' : '96px 0 112px',
      overflow: 'hidden',
    }}>
      {/* título */}
      <div ref={titleRef} style={{
        textAlign: 'center',
        marginBottom: 56,
        padding: '0 24px',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        opacity: titleInView ? 1 : 0,
        transform: titleInView ? 'translateY(0)' : 'translateY(28px)',
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '2.5px', color: C.sageLight,
          textTransform: 'uppercase', marginBottom: 20,
        }}>Quem Já Viveu</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(30px, 4vw, 50px)',
          color: C.cream, letterSpacing: '-0.5px',
        }}>
          O que muda quando o{' '}
          <em style={{ color: C.sageLight, fontStyle: 'italic' }}>corpo entende a música.</em>
        </h2>
      </div>

      {/* trilha animada — mural de fotos coladas */}
      <div
        style={{ overflow: 'hidden', userSelect: 'none', paddingTop: 22 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div style={{
          display: 'flex',
          gap: GAP,
          width: 'max-content',
          animation: `carouselScroll ${feedbackItems.length * 10}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          paddingLeft: GAP,
        }}>
          {looped.map((item, i) => {
            const rotate = [-2.4, 1.8, -1.2, 2.4][i % 4]
            const tapeColor = [C.sage, C.brownLight, C.sageDark][i % 3]
            const tapeLeft = i % 2 === 0 ? '28%' : '72%'
            return (
              <div key={i} style={{
                flexShrink: 0,
                width: CARD_W,
                position: 'relative',
                background: C.white,
                padding: '10px 10px 6px',
                borderRadius: 8,
                boxShadow: '0 12px 34px rgba(0,0,0,0.30)',
                transform: `rotate(${rotate}deg)`,
              }}>
                <WashiTape color={tapeColor} rotate={rotate <= 0 ? 7 : -7} top={-15} left={tapeLeft} width={52} />
                <div style={{ borderRadius: 4, overflow: 'hidden' }}>
                  <img
                    src={item.src}
                    alt={`Feedback de ${item.name}`}
                    style={{
                      width: '100%',
                      height: mobile ? 380 : 440,
                      objectFit: 'cover',
                      objectPosition: 'top',
                      display: 'block',
                    }}
                  />
                </div>
                <div style={{
                  padding: '10px 6px 4px',
                  textAlign: 'center',
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontSize: 14,
                  color: C.brownMid,
                }}>
                  {item.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p style={{
        textAlign: 'center',
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 400,
        fontSize: 12,
        color: 'rgba(255,255,255,0.25)',
        marginTop: 28,
        letterSpacing: '0.3px',
      }}>
        Passe o mouse para pausar
      </p>
    </section>
  )
}

// ─── Inscrição ────────────────────────────────────────────────────────────────

const inclusosOnline = [
  'Mapa musical aplicado ao movimento',
  'Estrutura musical para dançarinos: prática, não teoria',
  'Musicalização: o sentir como ponto de partida',
  'Como perceber os caminhos dentro da música',
  'Exercícios para criar musicalidade com o que já sabe',
]

const inclusosPresencial = [
  'Um Dia Musical inteiro com Chris Busato',
  'Buffet incluso',
  'Prática ao vivo com música',
  'Exercícios em dupla e em grupo',
  'Interação direta e feedback em tempo real',
  'Você sai sabendo brincar dentro da música, não só seguir ela',
]

function CheckItem({ text, light }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
        background: light ? 'rgba(255,255,255,0.15)' : C.sagePale,
        border: `1.5px solid ${light ? 'rgba(255,255,255,0.4)' : C.sage}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1"
            stroke={light ? 'rgba(255,255,255,0.9)' : C.sage}
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
        fontSize: 15, lineHeight: 1.5,
        color: light ? 'rgba(255,255,255,0.85)' : C.brownMid,
      }}>{text}</span>
    </div>
  )
}

function InscricaoSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768
  const { globalMode, highlightOnline, onlineUrl } = useContext(GlobalModeCtx)

  return (
    <section id="inscricao" style={{
      background: C.white,
      padding: mobile ? '80px 24px' : '112px 40px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* título */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 20,
          }}>A Vivência</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(30px, 4vw, 50px)',
            color: C.brown, letterSpacing: '-0.5px',
          }}>
            Brincando na Música{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>com Chris Busato</em>
          </h2>
        </div>

        {/* dois cards */}
        <div ref={ref} style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: 24,
          maxWidth: 900, margin: '0 auto',
          alignItems: 'start',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(28px)',
        }}>

          {/* ── CARD ONLINE ── */}
          <div id="ingresso-online" style={{
            background: highlightOnline ? C.brown : C.creamCard,
            border: highlightOnline ? 'none' : `1.5px solid ${C.sageLight}`,
            borderRadius: 20,
            padding: mobile ? '36px 24px' : '44px 40px',
            position: 'relative', overflow: 'hidden',
          }}>
            {highlightOnline && <div style={{
              position: 'absolute', top: '-15%', right: '-10%',
              width: 200, height: 200, background: C.sageDark,
              borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%',
              opacity: 0.2, pointerEvents: 'none',
            }} />}

            <div style={{
              display: 'inline-block',
              background: highlightOnline ? C.sage : C.sagePale,
              color: highlightOnline ? C.white : C.sageDark,
              borderRadius: 100, padding: '4px 14px',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase',
              marginBottom: 20,
            }}>Online · 11 de julho</div>

            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22, color: highlightOnline ? C.cream : C.brown,
              letterSpacing: '-0.3px', marginBottom: 16, lineHeight: 1.2,
            }}>Brincando na Música</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: 18, color: highlightOnline ? 'rgba(196,180,160,0.5)' : C.brownLight,
                textDecoration: 'line-through', letterSpacing: '-0.3px',
              }}>R$ 167</div>
              <div style={{
                background: '#E8534A', color: C.white,
                borderRadius: 100, padding: '2px 10px',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: 11, letterSpacing: '0.5px',
              }}>60% OFF</div>
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: 'clamp(48px, 5vw, 64px)',
              color: highlightOnline ? C.cream : C.brown, lineHeight: 1, marginBottom: 4,
              letterSpacing: '-2px',
            }}>R$ 67</div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              fontSize: 13, color: highlightOnline ? C.sageLight : C.brownLight, marginBottom: 16,
            }}>pagamento único · vagas limitadas</div>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: highlightOnline ? C.sage : C.sagePale,
              borderRadius: 8, padding: '8px 14px',
              marginBottom: 24,
              position: 'relative', zIndex: 1,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="2" width="12" height="11" rx="2" stroke={highlightOnline ? C.white : C.sage} strokeWidth="1.3"/>
                <path d="M1 6h12" stroke={highlightOnline ? C.white : C.sage} strokeWidth="1.3"/>
                <path d="M4 1v2M10 1v2" stroke={highlightOnline ? C.white : C.sage} strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                fontSize: 13, color: highlightOnline ? C.white : C.sageDark,
              }}>Vivência do dia 11 de julho (sábado) · <strong style={{ fontWeight: 700, color: highlightOnline ? C.white : C.brown }}>10h às 14h</strong></span>
            </div>

            {/* nota gravação */}
            <div style={{
              borderLeft: `2.5px solid ${highlightOnline ? C.sageLight : C.sage}`,
              paddingLeft: 14,
              marginBottom: 24,
              position: 'relative', zIndex: 1,
            }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                fontSize: 13, color: highlightOnline ? C.sageLight : C.sageDark, marginBottom: 4,
              }}>🎥 Gravação completa inclusa</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: 13, color: highlightOnline ? 'rgba(196,208,197,0.8)' : C.brownLight, lineHeight: 1.55,
              }}>Não pode ao vivo? Você recebe a gravação e assiste quando quiser.</div>
            </div>

            <div style={{ height: 1, background: highlightOnline ? 'rgba(255,255,255,0.1)' : C.sageLight, marginBottom: 24, position: 'relative', zIndex: 1 }} />

            <div style={{ marginBottom: 32, position: 'relative', zIndex: 1 }}>
              {inclusosOnline.map((item, i) => <CheckItem key={i} text={item} light={highlightOnline} />)}
            </div>

            <a href={onlineUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', width: '100%',
              background: highlightOnline ? C.sage : C.sage,
              color: C.white,
              border: `2px solid ${C.sage}`,
              padding: '19px 24px', borderRadius: 100,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16, fontWeight: 700,
              textDecoration: 'none', textAlign: 'center',
              boxShadow: highlightOnline ? '0 8px 28px rgba(107,127,109,0.5)' : '0 6px 20px rgba(107,127,109,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative', zIndex: 1,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.sageDark; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(107,127,109,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.sage; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Quero minha vaga online →
            </a>
          </div>

          {/* ── CARD PRESENCIAL ── */}
          {!globalMode && <div id="ingresso-presencial" style={{
            background: highlightOnline ? C.creamCard : C.brown,
            border: highlightOnline ? `1.5px solid ${C.sageLight}` : 'none',
            borderRadius: 20,
            padding: mobile ? '36px 24px' : '44px 40px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* blob */}
            <div style={{
              position: 'absolute', top: '-15%', right: '-10%',
              width: 200, height: 200, background: C.sageDark,
              borderRadius: '60% 40% 70% 30% / 50% 60% 40% 70%',
              opacity: 0.2, pointerEvents: 'none',
            }} />

            <div style={{
              display: 'inline-block',
              background: highlightOnline ? C.sagePale : C.sage,
              color: highlightOnline ? C.sageDark : C.white,
              borderRadius: 100, padding: '4px 14px',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase',
              marginBottom: 16,
            }}>Presencial · Dia Musical</div>

            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              fontSize: 12.5, color: highlightOnline ? C.brownLight : 'rgba(196,180,160,0.6)',
              textDecoration: 'line-through', marginBottom: 4,
            }}>Vivência 12/07 esgotada</div>

            <div style={{
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700,
              fontSize: 24, marginBottom: 14, lineHeight: 1.2,
              background: `linear-gradient(90deg, ${C.sageLight} 0%, ${highlightOnline ? C.sageDark : '#ffffff'} 50%, ${C.sageLight} 100%)`,
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'goldShimmer 3.5s linear infinite',
              display: 'inline-block',
            }}>O próximo capítulo: Dia Musical</div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: 'clamp(44px, 5vw, 58px)',
                color: highlightOnline ? C.brown : C.cream, lineHeight: 1,
                letterSpacing: '-2px',
              }}>R$ 197</div>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: highlightOnline ? C.sagePale : C.sage,
              color: highlightOnline ? C.sageDark : C.white,
              borderRadius: 100, padding: '4px 12px', marginBottom: 20,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: 10.5, letterSpacing: '1px', textTransform: 'uppercase',
              animation: 'escuroPulse 2.2s ease-out infinite',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: highlightOnline ? C.sageDark : C.white,
                display: 'block', animation: 'loteDot 1.2s ease-in-out infinite',
              }} />
              1º lote no escuro · valor exclusivo
            </div>

            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 13, color: highlightOnline ? C.brownMid : 'rgba(237,234,227,0.75)',
              marginBottom: 20,
            }}>📍 <strong style={{ color: highlightOnline ? C.brown : C.white }}>São Paulo</strong> · demais detalhes no escuro</div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 24 }} />

            <div style={{ marginBottom: 32 }}>
              {inclusosPresencial.map((item, i) => <CheckItem key={i} text={item} light={!highlightOnline} />)}
            </div>

            <a href={DIA_MUSICAL_URL} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', width: '100%',
              background: C.white, color: C.brown,
              padding: '17px 24px', borderRadius: 100,
              fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700,
              textDecoration: 'none', textAlign: 'center',
              boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
              transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
              marginBottom: 14,
              position: 'relative', zIndex: 1,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.cream; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.18)' }}
            >
              Garantir meu ingresso no escuro →
            </a>

            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              color: 'rgba(255,255,255,0.4)', textAlign: 'center',
            }}>
              R$ 197 é o menor valor que o Dia Musical jamais terá
            </div>
          </div>}

        </div>

        {/* mapa presencial */}
        {!globalMode && <div style={{ maxWidth: 900, margin: '48px auto 0' }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2px', color: C.sage,
            textTransform: 'uppercase', textAlign: 'center', marginBottom: 16,
          }}>📍 Local — MK Danças · Av. Padre Antônio José dos Santos, 748 A · Cidade Monções, Zona Sul SP</div>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <a
              href="https://maps.app.goo.gl/CzsbkMhVyN78DRSP7"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.sageDark,
                textDecoration: 'underline', fontWeight: 500,
              }}
            >Ver no Google Maps →</a>
          </div>
          <div style={{
            borderRadius: 16, overflow: 'hidden',
            border: `1px solid ${C.sageLight}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          }}>
            <iframe
              title="Local da vivência presencial"
              src="https://maps.google.com/maps?q=Av.+Padre+Antônio+José+dos+Santos,+748+A+-+Cidade+Monções,+São+Paulo&output=embed&hl=pt-BR"
              width="100%"
              height="340"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>}

      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'Preciso ter experiência em dança?',
    a: 'Não necessariamente. Ter alguma experiência pode ajudar a compreender alguns conceitos mais rapidamente, mas não é um pré-requisito. A vivência foi pensada para acolher pessoas em diferentes momentos da sua jornada com a dança, desde quem está começando até quem já possui mais experiência.',
  },
  {
    q: 'Funciona para qualquer estilo de dança?',
    a: 'Sim. Os princípios de estrutura musical e musicalização são transversais a qualquer dança social. Forró, zouk, salsa, samba de gafieira, bachata. A base é a mesma.',
  },
  {
    q: 'Vou aprender passos novos?',
    a: 'Não. O objetivo não é ampliar seu repertório de passos, mas te ajudar a entender o que fazer com o que já sabe. A vivência é sobre percepção e musicalidade, não sobre sequências.',
  },
  {
    q: 'E se eu nunca tiver pensado sobre música antes?',
    a: 'Melhor ainda. Você vai construir o mapa sem precisar desfazer nada. A vivência foi feita para quem dança de forma intuitiva e quer entender o que já sente.',
  },
  {
    q: 'Como funciona a inscrição?',
    a: 'Após confirmar o pagamento, você recebe as informações completas sobre data, horário e local da vivência. Vagas são limitadas para garantir a qualidade da experiência.',
  },
]

function FaqItem({ faq, index, open, onToggle }) {
  const [ref, inView] = useInView()

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
          color: C.sage, fontSize: 22, fontWeight: 400,
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
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: 15, color: C.brownMid, lineHeight: 1.7,
          paddingBottom: 24,
        }}>{faq.a}</p>
      </div>
    </div>
  )
}

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
        Brincando na Música
      </div>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
        fontSize: 15, color: C.brownMid, marginBottom: 24,
      }}>
        O sentir e o sustentar, com Chris Busato.
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
        fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
        fontSize: 13, color: C.brownLight,
      }}>
        © {new Date().getFullYear()} Chris Busato. Todos os direitos reservados.
      </div>
    </footer>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function BrincandoNaMusicaLP({ globalMode = false, highlightOnline = false, onlineUrl = 'https://pay.cakto.com.br/bou4zi4_927919' }) {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  return (
    <GlobalModeCtx.Provider value={{ globalMode, highlightOnline, onlineUrl }}>
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ribbonSlideIn {
          from { opacity: 0; transform: rotate(45deg) translateY(-40px); }
          to   { opacity: 1; transform: rotate(45deg) translateY(0); }
        }
        @keyframes ribbonShimmer {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes ribbonPulse {
          0%, 100% { box-shadow: 0 2px 16px rgba(232,83,74,0.5); }
          50%       { box-shadow: 0 2px 28px rgba(232,83,74,0.85); }
        }
        @keyframes lotePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,83,74,0.45); }
          70%       { box-shadow: 0 0 0 8px rgba(232,83,74,0); }
        }
        @keyframes escuroPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(196,208,197,0.35); }
          70%       { box-shadow: 0 0 0 10px rgba(196,208,197,0); }
        }
        @keyframes goldShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes mysteryFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes loteDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes carouselScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-1 * (320px + 20px) * 5)); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
      `}</style>
      <Navbar />
      <Hero />
      {/* conteúdo desliza por cima do hero sticky */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <DorSection />
        <StatementStrip />
        <VivenciaSection />
        <ConscienciaSection />
        <MarqueeStrip />
        <TransformacaoSection />
        <ParaQuemSection />
        <VivenciasSection />
        <InscricaoSection />
        <TestemunhosSection />
        <FaqSection />
        <Footer />
      </div>
    </>
    </GlobalModeCtx.Provider>
  )
}
