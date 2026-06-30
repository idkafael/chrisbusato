import { useState, useEffect, useRef } from 'react'
import chrisSorrindo from './images/chris-sorrindo.jpg'

// ─── Imagens de capa dos módulos ─────────────────────────────────────────────
import capaMusicalidade from './images/Capa-Musicalidade.png'
import capaMusicalizacao from './images/Capa-Musicalizacao.png'
import capaConsciencia from './images/Capa-Conciencia.png'
import capaVergonha from './images/Capa-Vergonha.png'
import capaReplay from './images/Capa-Replay.png'
import fundoHero from './images/fundo-primeira-dobra.png'
import bannerPlataforma from './images/banner-plataforma.png'

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

const CHECKOUT_URL = '#' // TODO: trocar pelo link de pagamento da plataforma (Cakto R$ 497)

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.cream}; overflow-x: hidden; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-10px); }
  }
  @keyframes shimmerSlide {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
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

// ─── CTA reutilizável ───────────────────────────────────────────────────────

function CtaButton({ children, mobile, full = false }) {
  return (
    <a
      href={CHECKOUT_URL}
      target="_blank" rel="noopener noreferrer"
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
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 17 : 20, color: C.brown, letterSpacing: '-0.3px',
        }}>
          Plataforma Chris Busato
        </span>
        {!mobile && (
          <a href="#oferta" style={{
            background: C.sage, color: C.white,
            padding: '10px 22px', borderRadius: 100,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            textDecoration: 'none', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = C.sageDark}
            onMouseLeave={e => e.currentTarget.style.background = C.sage}
          >
            Quero acesso
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
      background: C.cream, position: 'relative', overflow: 'hidden',
      padding: mobile ? '120px 24px 80px' : '150px 40px 110px',
      minHeight: mobile ? 'auto' : '92vh',
      display: 'flex', alignItems: 'center',
    }}>
      {/* Imagem de fundo (somente primeira dobra) */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${fundoHero})`,
        backgroundSize: 'cover',
        backgroundPosition: mobile ? 'center' : 'center right',
        pointerEvents: 'none',
      }} />
      {/* Overlay para legibilidade do texto */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: mobile
          ? 'linear-gradient(to bottom, rgba(237,234,227,0.85) 0%, rgba(237,234,227,0.5) 50%, rgba(237,234,227,0.12) 100%)'
          : 'linear-gradient(to right, rgba(237,234,227,0.94) 0%, rgba(237,234,227,0.8) 38%, rgba(237,234,227,0.3) 70%, rgba(237,234,227,0) 100%)',
      }} />

      <div style={{
        maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1,
        width: '100%',
      }}>
        {/* texto */}
        <div style={{
          animation: 'fadeUp 0.8s ease both',
          textAlign: mobile ? 'center' : 'left',
          maxWidth: mobile ? '100%' : 560,
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(36px, 9vw, 50px)' : 'clamp(44px, 4.6vw, 66px)',
            color: C.brown, lineHeight: 1.13, letterSpacing: '-1px',
            marginBottom: 24,
          }}>
            Quer ter um{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>corpo musical?</em>
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: mobile ? 16 : 19,
            color: C.brownMid, lineHeight: 1.7,
            maxWidth: 500, margin: mobile ? '0 auto 36px' : '0 0 36px',
          }}>
            Todos os cursos da Chris num lugar só: <strong style={{ fontWeight: 600, color: C.brown }}>Musicalidade</strong>, <strong style={{ fontWeight: 600, color: C.brown }}>Musicalização</strong>, <strong style={{ fontWeight: 600, color: C.brown }}>Consciência Corporal</strong> e os <strong style={{ fontWeight: 600, color: C.brown }}>replays das aulas ao vivo</strong>. Uma formação completa para dançar com mais liberdade, presença e musicalidade.
          </p>

          <div style={{ marginBottom: 18 }}>
            <CtaButton mobile={mobile}>Quero acesso à plataforma →</CtaButton>
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            color: C.brownLight, letterSpacing: '0.3px',
          }}>
            Acesso imediato · Estude no seu ritmo · Para sempre
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Cards de público ─────────────────────────────────────────────────────────

const publicos = [
  {
    icon: '🌱',
    titulo: 'Quem está começando',
    bullets: [
      'Não sabe por onde começar e quer um caminho organizado',
      'Trava na hora de soltar o corpo e seguir a música',
    ],
  },
  {
    icon: '💃',
    titulo: 'Quem já dança',
    bullets: [
      'Sente que estagnou e quer destravar para o próximo nível',
      'Quer dançar com mais musicalidade e presença, não só passos',
    ],
  },
  {
    icon: '🎓',
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
    <section style={{
      background: C.white,
      padding: mobile ? '72px 24px' : '100px 40px',
      position: 'relative', zIndex: 3,
      marginTop: mobile ? -44 : -72,
      borderTopLeftRadius: mobile ? 32 : 48,
      borderTopRightRadius: mobile ? 32 : 48,
      boxShadow: '0 -16px 40px rgba(61,53,48,0.06)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: 56,
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
            Feito para qualquer{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>nível.</em>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 20,
        }}>
          {publicos.map((p, i) => <PublicoCard key={i} p={p} delay={i * 100} mobile={mobile} />)}
        </div>
      </div>
    </section>
  )
}

function PublicoCard({ p, delay, mobile }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      background: C.creamCard,
      border: `1px solid ${C.sageLight}`,
      borderRadius: 18, padding: mobile ? '32px 26px' : '38px 32px',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
      transitionDelay: `${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(24px)',
    }}>
      <div style={{ fontSize: 36, marginBottom: 18 }}>{p.icon}</div>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 22, color: C.brown, marginBottom: 18, lineHeight: 1.25,
      }}>{p.titulo}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {p.bullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{
              flexShrink: 0, width: 6, height: 6, borderRadius: '50%',
              background: C.sage, marginTop: 8,
            }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              fontSize: 15, color: C.brownMid, lineHeight: 1.6,
            }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── O que é a plataforma ─────────────────────────────────────────────────────

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
        }}>A plataforma</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(26px, 7vw, 36px)' : 'clamp(30px, 3.4vw, 46px)',
          color: C.brown, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 28,
        }}>
          Não é mais uma aula avulsa.{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>É a formação inteira.</em>
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: mobile ? 16 : 19, color: C.brownMid, lineHeight: 1.75,
          marginBottom: 20,
        }}>
          Tudo o que a Chris ensina, reunido numa única plataforma: cursos gravados de Musicalidade, Musicalização e Consciência Corporal, mais os replays das aulas ao vivo para você revisitar quantas vezes quiser.
        </p>
        <p style={{
          fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
          fontSize: mobile ? 18 : 22, color: C.brownMid, lineHeight: 1.6,
        }}>
          Você entra hoje e tem acesso a todo o conteúdo, no seu ritmo, de onde estiver.
        </p>
      </div>
    </section>
  )
}

// ─── Módulos / Cursos ─────────────────────────────────────────────────────────

const modulos = [
  { titulo: 'Musicalidade', tag: 'Curso gravado', desc: 'Como se mover na música sem depender de passos decorados.', cover: capaMusicalidade },
  { titulo: 'Musicalização', tag: 'Curso gravado', desc: 'Ritmo, tempo e estrutura musical para nunca mais dançar fora do tempo.', cover: capaMusicalizacao },
  { titulo: 'Consciência Corporal', tag: 'Curso gravado', desc: 'Postura, eixo e expressão para dançar com mais liberdade.', cover: capaConsciencia },
  { titulo: 'A Vergonha na Dança', tag: 'Aulão', desc: 'Destrave o medo de dançar e de ser visto se movimentando.', cover: capaVergonha },
]

function ModulosSection() {
  const [titleRef, titleInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.white,
      padding: mobile ? '72px 24px' : '100px 40px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: 56,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(24px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 18,
          }}>O que tem dentro</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(28px, 7vw, 38px)' : 'clamp(32px, 3.6vw, 48px)',
            color: C.brown, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 16,
          }}>
            Os módulos da{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>plataforma.</em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 15 : 17, color: C.brownMid, maxWidth: 520,
            margin: '0 auto', lineHeight: 1.6,
          }}>
            Cada módulo é um curso completo e gravado. Estude na ordem que quiser.
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

        {/* PLACEHOLDER incentivo: mostre mais da plataforma */}
        <div style={{
          marginTop: 36,
          borderRadius: 16,
          border: `2px dashed ${C.sageLight}`,
          background: C.creamCard,
          padding: mobile ? '24px' : '28px 32px',
          textAlign: 'center',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: 14, color: C.brownLight, lineHeight: 1.6,
        }}>
          💡 Quer mostrar mais? Me mande prints de aulas, número de vídeos por módulo, duração total ou depoimentos em vídeo que eu adiciono mais blocos aqui.
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
        boxShadow: hovered ? '0 22px 48px rgba(61,53,48,0.18)' : '0 4px 16px rgba(61,53,48,0.06)',
      }}>
      <div style={{ overflow: 'hidden' }}>
        <img
          src={m.cover}
          alt={m.titulo}
          style={{
            width: '100%', display: 'block',
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
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

// ─── Encontros gravados / Replays (destaque) ──────────────────────────────────

function EncontrosSection() {
  const [ref, inView] = useInView()
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

      <div ref={ref} style={{
        maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
        gap: mobile ? 36 : 56, alignItems: 'center',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
      }}>
        <div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sageLight,
            textTransform: 'uppercase', marginBottom: 18,
          }}>Módulo bônus</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(26px, 7vw, 36px)' : 'clamp(30px, 3.4vw, 44px)',
            color: C.cream, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 20,
          }}>
            Encontros gravados:{' '}
            <em style={{ color: C.sageLight, fontStyle: 'italic' }}>os replays das aulas ao vivo.</em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 16 : 18, color: 'rgba(237,234,227,0.78)', lineHeight: 1.7,
            marginBottom: 24,
          }}>
            Toda aula ao vivo da Chris fica gravada aqui dentro. Perdeu o encontro? Assista o replay completo quando quiser. Quem entra na plataforma tem acesso ao acervo crescente de aulas.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Acervo de aulas ao vivo gravadas',
              'Novos encontros adicionados sempre',
              'Assista no seu tempo, quantas vezes precisar',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" stroke={C.sageLight} strokeWidth="1.2"/>
                  <path d="M6 9l2 2 4-4" stroke={C.sageLight} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                  fontSize: 15, color: 'rgba(237,234,227,0.9)',
                }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Capa dos replays */}
        <div style={{
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          maxWidth: mobile ? 320 : '100%',
          margin: mobile ? '0 auto' : 0,
        }}>
          <img
            src={capaReplay}
            alt="Encontros gravados — replays das aulas ao vivo"
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      </div>
    </section>
  )
}

// ─── Antes / Depois ───────────────────────────────────────────────────────────

const antes = [
  'Dança contando os passos na cabeça, sem sentir a música',
  'Trava quando alguém olha ou quando precisa improvisar',
  'Junta aulas soltas sem um caminho que faça sentido',
  'Sente que o corpo é "duro" e não responde do jeito que queria',
]
const depois = [
  'Ouve a música e o corpo responde com naturalidade',
  'Dança com presença, mesmo sem decorar coreografia',
  'Segue uma formação organizada, do básico ao avançado',
  'Tem consciência do próprio corpo e dança com liberdade',
]

function AntesDepoisSection() {
  const [ref, inView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '72px 24px' : '100px 40px',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div ref={ref} style={{
          textAlign: 'center', marginBottom: 52,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 18,
          }}>A transformação</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(28px, 7vw, 38px)' : 'clamp(32px, 3.6vw, 48px)',
            color: C.brown, lineHeight: 1.2, letterSpacing: '-0.5px',
          }}>
            De onde você está{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>para onde quer chegar.</em>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: 20,
        }}>
          {/* Antes */}
          <div style={{
            background: C.white, border: `1px solid ${C.sageLight}`,
            borderRadius: 18, padding: mobile ? '28px 24px' : '36px 32px',
          }}>
            <h3 style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              fontSize: 13, letterSpacing: '1.5px', textTransform: 'uppercase',
              color: C.brownLight, marginBottom: 24,
            }}>Hoje</h3>
            {antes.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '12px 0',
                borderBottom: i < antes.length - 1 ? `1px solid ${C.cream}` : 'none',
              }}>
                <span style={{ flexShrink: 0, fontSize: 16, marginTop: 1 }}>🥀</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                  fontSize: 15, color: C.brownMid, lineHeight: 1.55,
                }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Depois */}
          <div style={{
            background: C.sageDark, borderRadius: 18,
            padding: mobile ? '28px 24px' : '36px 32px',
          }}>
            <h3 style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              fontSize: 13, letterSpacing: '1.5px', textTransform: 'uppercase',
              color: C.sageLight, marginBottom: 24,
            }}>Com a plataforma</h3>
            {depois.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '12px 0',
                borderBottom: i < depois.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
              }}>
                <span style={{ flexShrink: 0, fontSize: 16, marginTop: 1 }}>🌷</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                  fontSize: 15, color: 'rgba(255,255,255,0.92)', lineHeight: 1.55,
                }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Depoimentos ──────────────────────────────────────────────────────────────

const depoimentos = [
  { texto: 'Eu dançava contando os passos. Hoje eu escuto a música e o corpo flui. Mudou completamente minha relação com a dança.', nome: 'Aluna da plataforma' },
  { texto: 'Os módulos são muito bem organizados. Finalmente entendi musicalidade de verdade, não foi só decoreba de passos.', nome: 'Aluna da plataforma' },
  { texto: 'Poder rever os encontros gravados quando eu quero é o que mais me ajuda. Assisto, pratico, volto e assisto de novo.', nome: 'Aluna da plataforma' },
]

function DepoimentosSection() {
  const [titleRef, titleInView] = useInView()
  const w = useWindowWidth()
  const mobile = w < 768

  return (
    <section style={{
      background: C.white,
      padding: mobile ? '72px 24px' : '100px 40px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div ref={titleRef} style={{
          textAlign: 'center', marginBottom: 52,
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          opacity: titleInView ? 1 : 0,
          transform: titleInView ? 'translateY(0)' : 'translateY(24px)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2.5px', color: C.sage,
            textTransform: 'uppercase', marginBottom: 18,
          }}>Quem já faz parte</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(28px, 7vw, 38px)' : 'clamp(32px, 3.6vw, 48px)',
            color: C.brown, lineHeight: 1.2, letterSpacing: '-0.5px',
          }}>
            O que as alunas{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>dizem.</em>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 20,
        }}>
          {depoimentos.map((d, i) => <DepoimentoCard key={i} d={d} delay={i * 100} />)}
        </div>

        {/* PLACEHOLDER: depoimentos reais */}
        <div style={{
          marginTop: 28,
          borderRadius: 16, border: `2px dashed ${C.sageLight}`,
          background: C.creamCard, padding: mobile ? '24px' : '28px 32px',
          textAlign: 'center',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
          fontSize: 14, color: C.brownLight, lineHeight: 1.6,
        }}>
          💬 Tem prints de depoimentos reais (WhatsApp, Instagram) ou vídeos? Me manda que eu troco esses cards pelos verdadeiros.
        </div>
      </div>
    </section>
  )
}

function DepoimentoCard({ d, delay }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      background: C.creamCard, border: `1px solid ${C.sageLight}`,
      borderRadius: 18, padding: '32px 28px',
      display: 'flex', flexDirection: 'column', gap: 18,
      transition: 'opacity 0.7s ease, transform 0.7s ease',
      transitionDelay: `${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(24px)',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
        fontSize: 40, color: C.sageLight, lineHeight: 0.5, height: 16,
      }}>“</div>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
        fontSize: 15.5, color: C.brownMid, lineHeight: 1.65,
      }}>{d.texto}</p>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: C.sageLight, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>💃</div>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
          fontSize: 14, color: C.brown,
        }}>{d.nome}</span>
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
      {/* blobs decorativos */}
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
        }}>Por dentro</div>
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
          Uma área de membros organizada e linda, feita para você encontrar tudo com facilidade e estudar no seu ritmo.
        </p>

        {/* Mockup janela do navegador */}
        <div style={{
          borderRadius: 16, overflow: 'hidden',
          background: C.white,
          border: `1px solid ${C.sageLight}`,
          boxShadow: '0 30px 70px rgba(61,53,48,0.20)',
          maxWidth: 820, margin: '0 auto',
        }}>
          {/* barra superior */}
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
          <img
            src={bannerPlataforma}
            alt="Interior da plataforma de cursos da Chris Busato"
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* pills de features */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: 12, marginTop: 36,
        }}>
          {['📱 Assista no celular ou computador', '🕐 Acesso 24h por dia', '➕ Conteúdo novo sempre'].map((t, i) => (
            <div key={i} style={{
              background: C.white, border: `1px solid ${C.sageLight}`,
              borderRadius: 100, padding: '9px 18px',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 13.5, color: C.brownMid,
            }}>{t}</div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Oferta / Preço ───────────────────────────────────────────────────────────

const incluso = [
  'Curso completo de Musicalidade',
  'Curso completo de Musicalização',
  'Curso completo de Consciência Corporal',
  'Encontros gravados (replays das aulas ao vivo)',
  'Novos módulos adicionados ao longo do tempo',
  'Acesso para sempre, no seu ritmo',
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
        }}>Acesso completo</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(28px, 8vw, 40px)' : 'clamp(32px, 3.6vw, 50px)',
          color: C.brown, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 44,
        }}>
          Uma plataforma.{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>Todos os cursos.</em>
        </h2>

        <div style={{
          background: C.white, border: `1.5px solid ${C.sageLight}`,
          borderRadius: 24, padding: mobile ? '36px 26px' : '48px 52px',
          boxShadow: '0 16px 50px rgba(61,53,48,0.08)',
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 14, color: C.brownLight, marginBottom: 6,
            textDecoration: 'line-through',
          }}>de R$ 997</div>

          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 16, color: C.brownMid, marginBottom: 2,
          }}>12x de</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: mobile ? 48 : 58, color: C.brown, lineHeight: 1,
            letterSpacing: '-1px', marginBottom: 6,
          }}>R$ 49,70</div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 15, color: C.brownMid, marginBottom: 32,
          }}>ou <strong style={{ fontWeight: 700, color: C.brown }}>R$ 497</strong> à vista</div>

          <div style={{ textAlign: 'left', marginBottom: 32 }}>
            {incluso.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 0',
                borderBottom: i < incluso.length - 1 ? `1px solid ${C.cream}` : 'none',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke={C.sage} strokeWidth="1.1"/>
                  <path d="M5 8l2 2 4-4" stroke={C.sageDark} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                  fontSize: 15, color: C.brownMid,
                }}>{item}</span>
              </div>
            ))}
          </div>

          <CtaButton mobile={mobile} full>Quero acesso à plataforma →</CtaButton>
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
          }}>Quem ensina</div>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 30 : 40, color: C.brown, marginBottom: 20, lineHeight: 1.15,
          }}>Chris Busato</h3>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 16 : 17, color: C.brownMid, lineHeight: 1.75, marginBottom: 22,
          }}>
            Educadora de dança e criadora do método Corpo Musical. Há mais de dez anos, Chris ajuda pessoas a dançarem com mais liberdade, presença e musicalidade. Toda a sua metodologia, antes espalhada em aulas e turmas, agora reunida em uma única plataforma.
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
    q: 'Como funciona o acesso?',
    a: 'Assim que o pagamento é confirmado, você recebe o acesso à plataforma por e-mail e já pode começar a assistir todos os cursos imediatamente, de qualquer dispositivo.',
  },
  {
    q: 'Por quanto tempo tenho acesso?',
    a: 'O acesso é vitalício. Você estuda no seu ritmo, revisita os cursos quantas vezes quiser e acompanha os novos módulos que forem adicionados.',
  },
  {
    q: 'Preciso ter experiência em dança?',
    a: 'Não. A plataforma foi pensada para todos os níveis: de quem está começando do zero a professores que querem aprofundar a metodologia.',
  },
  {
    q: 'Os encontros ao vivo ficam gravados?',
    a: 'Sim. Todas as aulas ao vivo ficam disponíveis como replay dentro da plataforma, no módulo de Encontros Gravados. Se não puder participar ao vivo, assiste depois.',
  },
  {
    q: 'Posso parcelar?',
    a: 'Sim. Você pode pagar à vista ou parcelar no cartão. As condições aparecem na hora do checkout.',
  },
  {
    q: 'E se eu não gostar?',
    a: 'Você tem a garantia legal de 7 dias. Se dentro desse período sentir que não é para você, é só pedir o reembolso.',
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
          <CtaButton mobile={mobile}>Quero acesso à plataforma →</CtaButton>
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

export default function PlataformaCursosLP() {
  return (
    <>
      <style>{globalStyles}</style>
      <Navbar />
      <Hero />
      <PublicoSection />
      <SobreSection />
      <ModulosSection />
      <EncontrosSection />
      <AntesDepoisSection />
      <DepoimentosSection />
      <PorDentroSection />
      <OfertaSection />
      <ChrisSection />
      <FaqSection />
      <Footer />
    </>
  )
}
