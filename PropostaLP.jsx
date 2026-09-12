import { useState, useEffect, useRef } from 'react'
import fundoHero from './images/fundo-primeira-dobra.jpg'

// Capas dos módulos e arte dos encontros — os mesmos assets usados no
// ProgramaOnlineLP / PlataformaCursosLP.
import capaMusicalidade from './images/Capa-Musicalidade.png'
import capaMusicalizacao from './images/Capa-Musicalizacao.png'
import capaConsciencia from './images/Capa-Conciencia.png'
import capaVergonha from './images/Capa-Vergonha.png'
import capaReplay from './images/Capa-Replay.png'
import encontrosAoVivo from './images/encontrosaovivo.png'

// ─── Links de checkout (Cakto) ───────────────────────────────────────────────
const CHECKOUT_ONLINE = 'https://pay.cakto.com.br/iewzemj'      // Programa Online — 12x R$97 / R$997 à vista
const CHECKOUT_MASTERMOVE = 'https://pay.cakto.com.br/93w4xfe'  // Master Move — 12x R$145 / R$1497 à vista

// ─── Tokens (paleta da marca) ────────────────────────────────────────────────

const C = {
  cream: '#F1EBE2',
  creamDeep: '#E7DFD2',
  card: '#FAF7F2',
  cardAlt: '#F4EEE4',
  gold: '#8A6A3B',
  goldDark: '#6E5230',
  goldLight: '#C6A87A',
  goldPale: '#EADFC9',
  brown: '#2A1D14',
  brownMid: '#5E4E41',
  brownLight: '#8C7C6E',
  line: 'rgba(42,29,20,0.12)',
  white: '#FFFDFA',
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.cream}; overflow-x: hidden; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes barUp {
    from { opacity: 0; transform: translateY(100%); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmerSlide {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .mod-scroller { scrollbar-width: none; -ms-overflow-style: none; }
  .mod-scroller::-webkit-scrollbar { display: none; }
`

// ─── Hooks ───────────────────────────────────────────────────────────────────

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

// ─── Blocos reutilizáveis ────────────────────────────────────────────────────

function Reveal({ children, delay = 0, style }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        animation: inView ? `fadeUp 0.8s ${delay}s cubic-bezier(0.22,1,0.36,1) both` : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Eyebrow({ children, color = C.gold, align = 'center' }) {
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color,
      textAlign: align,
    }}>
      {children}
    </div>
  )
}

function CtaButton({ children, href, variant = 'gold', full = false }) {
  const [hover, setHover] = useState(false)
  const isAnchor = href.charAt(0) === '#'
  const isGhost = variant === 'ghost'

  return (
    <a
      href={href}
      {...(isAnchor ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: full ? 'flex' : 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        width: full ? '100%' : 'auto',
        padding: '19px 38px',
        borderRadius: 999,
        // Os stops das pontas são iguais para o loop do shimmer não deixar emenda.
        // backgroundImage (e não background) porque o shorthand conflita com backgroundSize.
        backgroundColor: 'transparent',
        backgroundImage: isGhost
          ? 'none'
          : `linear-gradient(100deg, ${C.goldDark} 0%, ${C.gold} 25%, ${C.goldLight} 50%, ${C.gold} 75%, ${C.goldDark} 100%)`,
        backgroundSize: isGhost ? 'auto' : '200% auto',
        animation: isGhost ? 'none' : 'shimmerSlide 5s linear infinite',
        border: isGhost ? `1.5px solid ${C.gold}` : 'none',
        color: isGhost ? C.goldDark : C.white,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        cursor: 'pointer',
        boxShadow: isGhost ? 'none' : `0 14px 32px rgba(110,82,48,${hover ? 0.34 : 0.22})`,
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
        textAlign: 'center',
      }}
    >
      {children}
      <span style={{
        display: 'inline-block',
        transform: hover ? 'translateX(4px)' : 'none',
        transition: 'transform 0.3s ease',
      }}>→</span>
    </a>
  )
}

function Tag({ children, tone = 'gold' }) {
  const solid = tone === 'gold'
  return (
    <span style={{
      display: 'inline-block',
      padding: '7px 16px',
      borderRadius: 999,
      background: solid ? C.gold : C.goldPale,
      color: solid ? C.white : C.goldDark,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 12.5,
      fontWeight: 600,
      letterSpacing: '0.06em',
    }}>
      {children}
    </span>
  )
}

function NumberBadge({ n, size = 46 }) {
  return (
    <div style={{
      flexShrink: 0,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `linear-gradient(140deg, ${C.gold}, ${C.goldDark})`,
      color: C.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Playfair Display', serif",
      fontSize: size * 0.48,
      fontWeight: 600,
      boxShadow: '0 6px 16px rgba(110,82,48,0.24)',
    }}>
      {n}
    </div>
  )
}

// ─── Preço ───────────────────────────────────────────────────────────────────
// O cifrão da Playfair é alto e fino e encosta nos números quando entra no mesmo
// tamanho do valor. Por isso "12x de" e "R$" saem em DM Sans, menores e alinhados
// pelo topo do número — o valor é a única coisa em serifa.

function Preco({ parcela, avista, dark = false, isMobile }) {
  const big = isMobile ? 60 : 78
  const muted = dark ? 'rgba(255,253,250,0.6)' : C.brownLight
  const forte = dark ? C.white : C.brown
  const moeda = dark ? C.goldLight : C.goldDark

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: isMobile ? 7 : 9,
      }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: big * 0.23,
          fontWeight: 500,
          letterSpacing: '0.02em',
          color: muted,
          marginTop: big * 0.3,
        }}>
          12x de
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: big * 0.3,
          fontWeight: 600,
          letterSpacing: '0.01em',
          color: moeda,
          marginTop: big * 0.26,
          marginRight: -big * 0.02,
        }}>
          R$
        </span>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: big,
          fontWeight: 600,
          lineHeight: 0.88,
          letterSpacing: '-0.015em',
          color: forte,
        }}>
          {parcela}
        </span>
      </div>

      <div style={{
        marginTop: isMobile ? 14 : 16,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: isMobile ? 15 : 16.5,
        fontWeight: 300,
        color: muted,
      }}>
        ou{' '}
        <span style={{ fontWeight: 600, color: dark ? 'rgba(255,253,250,0.85)' : C.brownMid }}>
          R$ {avista}
        </span>{' '}
        à vista
      </div>
    </div>
  )
}

// Versão compacta, para o rodapé do comparativo.
function PrecoMini({ parcela, avista, destaque = false, isMobile, label }) {
  const cor = destaque ? C.goldDark : C.brown
  return (
    <div style={{ textAlign: 'center' }}>
      {/* No mobile o rodapé vira duas colunas iguais e perde o alinhamento com
          as colunas de cima, então o preço carrega o próprio rótulo. */}
      {label && isMobile && (
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: destaque ? C.gold : C.brownLight,
          marginBottom: 6,
        }}>
          {label}
        </div>
      )}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: 4,
      }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: isMobile ? 12 : 13,
          fontWeight: 500,
          color: C.brownLight,
        }}>
          12x
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: isMobile ? 12.5 : 13.5,
          fontWeight: 600,
          color: cor,
        }}>
          R$
        </span>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: isMobile ? 24 : 27,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: cor,
        }}>
          {parcela}
        </span>
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 300,
        color: C.brownLight,
        marginTop: 3,
      }}>
        ou R$ {avista}
      </div>
    </div>
  )
}

// ─── Ícones ──────────────────────────────────────────────────────────────────

const iconProps = {
  width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
}

const Icons = {
  book: <svg {...iconProps}><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 4.5v16" /><path d="M12 6v9" /></svg>,
  users: <svg {...iconProps}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" /><path d="M17 8.5a2.8 2.8 0 0 0 0-5" /><path d="M18 20c0-2.6-1-4.2-2.6-5" /></svg>,
  pin: <svg {...iconProps}><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" /><circle cx="12" cy="10" r="2.6" /></svg>,
  play: <svg {...iconProps}><rect x="2.5" y="4" width="19" height="13" rx="2" /><path d="M10.5 8.2l4 2.3-4 2.3z" /><path d="M8 20.5h8" /></svg>,
  broadcast: <svg {...iconProps}><circle cx="12" cy="12" r="2.5" /><path d="M7.5 7.5a6.4 6.4 0 0 0 0 9" /><path d="M16.5 16.5a6.4 6.4 0 0 0 0-9" /><path d="M4.6 4.6a10 10 0 0 0 0 14.8" /><path d="M19.4 19.4a10 10 0 0 0 0-14.8" /></svg>,
  chat: <svg {...iconProps}><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-3.2-.5L3 21l1.7-5a8.2 8.2 0 0 1-.7-3.5 8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 8 7.4z" /></svg>,
  infinity: <svg {...iconProps}><path d="M7 9a3 3 0 1 0 0 6c2.5 0 3-3 5-3s2.5 3 5 3a3 3 0 1 0 0-6c-2.5 0-3 3-5 3s-2.5-3-5-3z" /></svg>,
  laptop: <svg {...iconProps}><rect x="4" y="5" width="16" height="11" rx="1.6" /><path d="M2 19h20" /></svg>,
}

// ─── Conteúdo ────────────────────────────────────────────────────────────────

const faseIcon = {
  width: 21, height: 21, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round',
}

const FASES = [
  {
    nome: 'Música',
    desc: 'a linguagem',
    icon: <svg {...faseIcon}><circle cx="7" cy="17.5" r="2.8" /><circle cx="17.5" cy="15" r="2.8" /><path d="M9.8 17.5V6.2l10.5-2.4V15" /><path d="M9.8 9.4l10.5-2.4" /></svg>,
  },
  {
    nome: 'Corpo',
    desc: 'o instrumento',
    icon: <svg {...faseIcon}><circle cx="12" cy="4.4" r="2.2" /><path d="M12 6.8v6.4" /><path d="M12 9.2L6.8 11.6M12 9.2l5.2 2.4" /><path d="M12 13.2l-3 6.8M12 13.2l3 6.8" /></svg>,
  },
  {
    nome: 'Movimento',
    desc: 'a voz / expressão',
    icon: <svg {...faseIcon}><path d="M3 14.5c2.2-6 5.4-6 7.4 0s5.2 6 7.4 0" /><path d="M17.8 14.5l2.6-1.2M17.8 14.5l.5 2.8" /></svg>,
  },
  {
    nome: 'O Outro',
    desc: 'o diálogo',
    icon: <svg {...faseIcon}><path d="M8.8 4.6a8 8 0 0 0 0 14.8" /><path d="M15.2 4.6a8 8 0 0 1 0 14.8" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /></svg>,
  },
  {
    nome: 'Integração',
    desc: 'flow musical',
    icon: <svg {...faseIcon}><path d="M7 9a3 3 0 1 0 0 6c2.5 0 3-3 5-3s2.5 3 5 3a3 3 0 1 0 0-6c-2.5 0-3 3-5 3s-2.5-3-5-3z" /></svg>,
  },
  {
    nome: 'Vida Musical',
    desc: 'levar isso para a vida',
    icon: <svg {...faseIcon}><circle cx="12" cy="14" r="3.6" /><path d="M12 6.6V4.2M17.2 8.8l1.7-1.7M5.1 7.1l1.7 1.7" /><path d="M2.8 19.6h18.4" /></svg>,
  },
]

// O "Mapa" é um caminho, não uma grade de bolinhas numeradas: os nós ficam
// ligados por uma linha — horizontal no desktop, vertical no celular.
function MapaDaDanca({ isMobile }) {
  const no = {
    borderRadius: '50%',
    background: C.goldPale,
    border: '1px solid rgba(138,106,59,0.32)',
    color: C.goldDark,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }
  const nome = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: isMobile ? 14.5 : 14,
    fontWeight: 600,
    color: C.brown,
    lineHeight: 1.25,
  }
  const desc = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: isMobile ? 13 : 12.5,
    fontWeight: 300,
    color: C.brownLight,
    lineHeight: 1.35,
    marginTop: 2,
  }

  if (isMobile) {
    return (
      <div>
        {FASES.map((f, i) => (
          <div key={f.nome} style={{ display: 'flex', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ ...no, width: 38, height: 38 }}>{f.icon}</div>
              {i < FASES.length - 1 && (
                <div style={{ flex: 1, width: 2, minHeight: 16, borderRadius: 2, background: 'rgba(138,106,59,0.28)' }} />
              )}
            </div>
            <div style={{ paddingTop: 6, paddingBottom: i === FASES.length - 1 ? 0 : 20 }}>
              <div style={nome}>{f.nome}</div>
              <div style={desc}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 24,
        left: '8%',
        right: '8%',
        height: 2,
        borderRadius: 2,
        background: 'linear-gradient(90deg, transparent, rgba(138,106,59,0.3) 10%, rgba(138,106,59,0.3) 90%, transparent)',
      }} />
      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 10,
      }}>
        {FASES.map((f) => (
          <div key={f.nome} style={{ textAlign: 'center' }}>
            <div style={{ ...no, width: 48, height: 48, margin: '0 auto 12px' }}>{f.icon}</div>
            <div style={nome}>{f.nome}</div>
            <div style={desc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MODULOS = [
  { titulo: 'Musicalidade', desc: 'Como se mover na música sem depender de passos decorados.', cover: capaMusicalidade },
  { titulo: 'Musicalização', desc: 'Ritmo, tempo e estrutura musical para nunca mais dançar fora do tempo.', cover: capaMusicalizacao },
  { titulo: 'Consciência Corporal', desc: 'Postura, eixo e expressão para dançar com mais liberdade.', cover: capaConsciencia },
  { titulo: 'A Vergonha na Dança', desc: 'Destrave o medo de dançar e de ser visto se movimentando.', cover: capaVergonha },
  { titulo: 'Encontros gravados', desc: 'Os replays das aulas ao vivo, organizados para rever quando quiser.', cover: capaReplay },
]

const ONLINE_ITENS = [
  {
    icon: Icons.users,
    titulo: 'Encontros ao vivo semanais',
    desc: 'Para praticar, tirar dúvidas, receber feedback e seguir em desenvolvimento.',
    tag: '2x por semana',
    img: encontrosAoVivo,
    imgAlt: 'Encontros ao vivo do Corpo Musical, com alunos em videochamada',
    // Cor amostrada do fundo da própria arte, para a imagem não recortar no card.
    bg: '#F4E6D7',
  },
  {
    icon: Icons.broadcast,
    titulo: 'Transmissão ao vivo do Master Move',
    desc: 'Você acompanha a imersão presencial de São Paulo, ao vivo, de onde estiver.',
    tag: '1x por mês',
    extra: 'Domingos • 9h às 12h',
  },
  {
    icon: Icons.chat,
    titulo: 'Comunidade no WhatsApp',
    desc: 'Um espaço de troca com vídeos, mensagens, perguntas, sugestões e apoio contínuo.',
  },
  {
    icon: Icons.infinity,
    titulo: 'Acesso por 12 meses',
    desc: 'Todo o conteúdo gravado, encontros ao vivo e comunidade disponíveis por 1 ano.',
  },
]

const MASTERMOVE_COMO = [
  {
    icon: Icons.book,
    titulo: '2 horas de conteúdo',
    desc: 'Fundamentos essenciais para desenvolver o corpo e uma dança mais integral.',
  },
  {
    icon: Icons.users,
    titulo: '1 hora de prática entre os colegas',
    desc: 'Exploração, integração e prática com acompanhamento.',
  },
  {
    icon: Icons.pin,
    titulo: '1 encontro por mês',
    desc: 'Presencial em São Paulo • Domingos • 9h às 12h',
  },
]

const COMPARATIVO = [
  { item: 'Conteúdos gravados por todas as fases do Mapa da Dança', online: true, master: true },
  { item: 'Encontros ao vivo semanais', online: true, master: true },
  { item: 'Comunidade no WhatsApp', online: true, master: true },
  { item: 'Acesso por 12 meses', online: true, master: true },
  { item: 'Master Move ao vivo, pela transmissão', online: true, master: true },
  { item: 'Master Move presencial em São Paulo, 1x por mês', online: false, master: true },
  { item: 'Prática guiada e acompanhamento no corpo', online: false, master: true },
]

// Capas dos módulos: linha única no desktop, carrossel que corre com o dedo no
// celular — 5 capas em grade de 2 colunas deixaria uma órfã.
function ModulosGravados({ isMobile }) {
  return (
    <div
      className="mod-scroller"
      style={{
        display: isMobile ? 'flex' : 'grid',
        gridTemplateColumns: isMobile ? undefined : 'repeat(5, 1fr)',
        gap: isMobile ? 12 : 16,
        overflowX: isMobile ? 'auto' : 'visible',
        scrollSnapType: isMobile ? 'x mandatory' : undefined,
        margin: isMobile ? '0 -20px' : 0,
        padding: isMobile ? '0 20px 4px' : 0,
      }}
    >
      {MODULOS.map((m) => (
        <div
          key={m.titulo}
          style={{
            flex: isMobile ? '0 0 152px' : undefined,
            scrollSnapAlign: isMobile ? 'start' : undefined,
          }}
        >
          <div style={{
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid rgba(42,29,20,0.1)',
            boxShadow: '0 10px 26px rgba(42,29,20,0.14)',
            marginBottom: 12,
          }}>
            <img
              src={m.cover}
              alt={m.titulo}
              loading="lazy"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: isMobile ? 13.5 : 14,
            fontWeight: 600,
            color: C.brown,
            lineHeight: 1.25,
          }}>
            {m.titulo}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: isMobile ? 12 : 12.5,
            fontWeight: 300,
            color: C.brownLight,
            lineHeight: 1.4,
            marginTop: 3,
          }}>
            {m.desc}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Seções ──────────────────────────────────────────────────────────────────

function Hero({ isMobile }) {
  return (
    <section style={{
      position: 'relative',
      minHeight: isMobile ? '88vh' : '92vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: isMobile ? '90px 22px 70px' : '110px 40px',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${fundoHero})`,
        backgroundSize: 'cover',
        backgroundPosition: isMobile ? 'center 30%' : 'center 28%',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, rgba(241,235,226,0.86) 0%, rgba(241,235,226,0.58) 38%, rgba(241,235,226,0.9) 82%, ${C.cream} 100%)`,
      }} />

      <div style={{ position: 'relative', maxWidth: 760, textAlign: 'center' }}>
        <Reveal>
          <Eyebrow>O Corpo Musical</Eyebrow>
          <div style={{
            width: 48, height: 1, background: C.gold,
            margin: '18px auto 26px', opacity: 0.6,
          }} />
        </Reveal>

        <Reveal delay={0.1}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? 44 : 78,
            fontWeight: 500,
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            color: C.brown,
          }}>
            Sua proposta
          </h1>
        </Reveal>

        <Reveal delay={0.22}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 14,
            justifyContent: 'center',
            marginTop: isMobile ? 38 : 48,
          }}>
            <CtaButton href="#mastermove" full={isMobile}>Ver a proposta completa</CtaButton>
            <CtaButton href="#online" variant="ghost" full={isMobile}>Começar pelo online</CtaButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Ponte({ isMobile }) {
  return (
    <section style={{
      background: C.cream,
      padding: isMobile ? '64px 22px' : '96px 40px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <Reveal>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? 25 : 36,
            fontWeight: 400,
            lineHeight: 1.4,
            color: C.brown,
            letterSpacing: '-0.01em',
          }}>
            Hoje você sentiu na prática o que acontece quando o corpo
            <span style={{ color: C.gold }}> escuta a música</span> em vez de correr atrás dela.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: isMobile ? 16 : 18,
            fontWeight: 300,
            lineHeight: 1.75,
            color: C.brownMid,
            marginTop: 26,
          }}>
            O que vem agora é o caminho inteiro: as fases, o método, a prática constante e
            um grupo de pessoas fazendo isso junto com você. Escolha o formato que faz
            sentido para o seu momento.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function OfertaOnline({ isMobile }) {
  return (
    <section id="online" style={{
      background: C.creamDeep,
      padding: isMobile ? '70px 18px' : '110px 40px',
      scrollMarginTop: 20,
    }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>

        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 56 }}>
            <Tag tone="pale">Opção 1 — a base</Tag>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? 36 : 56,
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: C.brown,
              margin: '20px 0 0',
            }}>
              Programa Online<br />do Corpo Musical
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? 16 : 18,
              fontWeight: 300,
              lineHeight: 1.7,
              color: C.brownMid,
              maxWidth: 560,
              margin: '20px auto 0',
            }}>
              Uma forma mais leve, prazerosa e direta de desenvolver uma dança
              mais musical, fluida e verdadeira.
            </p>
          </div>
        </Reveal>

        {/* Mapa da Dança */}
        <Reveal delay={0.08}>
          <div style={{
            background: C.card,
            border: '1px solid rgba(42,29,20,0.09)',
            borderRadius: 24,
            padding: isMobile ? '28px 20px' : '40px 44px',
            boxShadow: '0 2px 3px rgba(42,29,20,0.03), 0 16px 40px rgba(42,29,20,0.08)',
            marginBottom: 18,
          }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 28 }}>
              <NumberBadge n={1} />
              <div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: isMobile ? 21 : 27,
                  fontWeight: 600,
                  color: C.brown,
                  lineHeight: 1.25,
                }}>
                  Conteúdo completo por todas as fases do Mapa da Dança
                </h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: isMobile ? 14.5 : 16,
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: C.brownMid,
                  marginTop: 8,
                }}>
                  Aulas e conteúdos gravados que atravessam todas as linguagens e fases do processo.
                </p>
              </div>
            </div>

            <MapaDaDanca isMobile={isMobile} />
          </div>
        </Reveal>

        {/* Item 2 — largura cheia para as capas caberem */}
        <Reveal delay={0.08}>
          <div style={{
            background: C.card,
            border: '1px solid rgba(42,29,20,0.09)',
            borderRadius: 24,
            padding: isMobile ? '28px 20px' : '40px 44px',
            boxShadow: '0 2px 3px rgba(42,29,20,0.03), 0 16px 40px rgba(42,29,20,0.08)',
            marginBottom: 18,
          }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 26 }}>
              <NumberBadge n={2} />
              <div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: isMobile ? 21 : 27,
                  fontWeight: 600,
                  color: C.brown,
                  lineHeight: 1.25,
                }}>
                  Conteúdos gravados
                </h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: isMobile ? 14.5 : 16,
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: C.brownMid,
                  marginTop: 8,
                }}>
                  Acesso imediato às aulas para estudar no seu tempo, quantas vezes quiser.
                </p>
              </div>
            </div>

            <ModulosGravados isMobile={isMobile} />
          </div>
        </Reveal>

        {/* Itens 2 a 6 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 18,
        }}>
          {ONLINE_ITENS.map((item, i) => (
            <Reveal key={item.titulo} delay={0.05 * i}>
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: item.bg || C.card,
                border: '1px solid rgba(42,29,20,0.09)',
                borderRadius: 22,
                overflow: 'hidden',
                boxShadow: '0 2px 3px rgba(42,29,20,0.03), 0 14px 34px rgba(42,29,20,0.07)',
              }}>
                <div style={{ flex: 1, padding: isMobile ? '24px 20px' : '30px 28px' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
                  <NumberBadge n={i + 3} size={40} />
                  <span style={{ color: C.gold, display: 'flex' }}>{item.icon}</span>
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: isMobile ? 20 : 23,
                  fontWeight: 600,
                  color: C.brown,
                  lineHeight: 1.25,
                }}>
                  {item.titulo}
                </h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: isMobile ? 14.5 : 15.5,
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: C.brownMid,
                  marginTop: 8,
                }}>
                  {item.desc}
                </p>
                {(item.tag || item.extra) && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12,
                    marginTop: 16,
                  }}>
                    {item.tag && <Tag tone="pale">{item.tag}</Tag>}
                    {item.extra && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: C.brownMid,
                      }}>
                        <span style={{ color: C.gold, display: 'flex' }}>
                          <svg {...iconProps} width={17} height={17}>
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M3 10h18M8 3v4M16 3v4" />
                          </svg>
                        </span>
                        {item.extra}
                      </span>
                    )}
                  </div>
                )}
                </div>

                {item.img && (
                  <img
                    src={item.img}
                    alt={item.imgAlt}
                    loading="lazy"
                    style={{ width: '100%', display: 'block', marginTop: 4 }}
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Investimento */}
        <Reveal delay={0.1}>
          <div style={{
            marginTop: 28,
            background: C.card,
            border: '1px solid rgba(42,29,20,0.09)',
            borderRadius: 24,
            padding: isMobile ? '34px 22px' : '48px',
            textAlign: 'center',
            boxShadow: '0 2px 3px rgba(42,29,20,0.03), 0 18px 44px rgba(42,29,20,0.09)',
          }}>
            <Eyebrow color={C.brownLight}>Investimento</Eyebrow>
            <div style={{ marginTop: isMobile ? 20 : 24 }}>
              <Preco parcela="97" avista="997" isMobile={isMobile} />
            </div>
            <div style={{ marginTop: 30, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
              <CtaButton href={CHECKOUT_ONLINE} full>Quero o programa online</CtaButton>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  )
}

function OfertaMasterMove({ isMobile }) {
  return (
    <section id="mastermove" style={{
      background: `linear-gradient(180deg, ${C.brown} 0%, #3A291D 55%, #241A12 100%)`,
      padding: isMobile ? '70px 18px 80px' : '110px 40px 120px',
      scrollMarginTop: 20,
    }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>

        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 38 : 54 }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: 999,
              background: `linear-gradient(100deg, ${C.gold}, ${C.goldLight})`,
              color: C.brown,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}>
              Opção 2 — a proposta completa
            </span>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? 52 : 88,
              fontWeight: 600,
              lineHeight: 0.98,
              letterSpacing: '-0.03em',
              color: C.white,
              margin: '22px 0 0',
            }}>
              Master Move
            </h2>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? 12.5 : 14,
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: C.goldLight,
              marginTop: 14,
            }}>
              Programa presencial do Corpo Musical
            </div>

            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? 21 : 29,
              fontWeight: 400,
              lineHeight: 1.45,
              color: 'rgba(255,253,250,0.92)',
              maxWidth: 620,
              margin: '30px auto 0',
            }}>
              O online traz o conhecimento.<br />
              O Master Move traz a <span style={{ fontStyle: 'italic', color: C.goldLight }}>aplicação presencial</span>.
            </p>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? 15.5 : 17,
              fontWeight: 300,
              lineHeight: 1.75,
              color: 'rgba(255,253,250,0.62)',
              maxWidth: 560,
              margin: '22px auto 0',
            }}>
              Um encontro mensal para vivenciar, integrar e aprofundar, na prática,
              os fundamentos para uma dança mais integral.
            </p>
          </div>
        </Reveal>

        {/* O que você recebe */}
        <Reveal delay={0.08}>
          <Eyebrow color={C.goldLight} align={isMobile ? 'center' : 'left'}>O que você recebe</Eyebrow>
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr',
          alignItems: 'stretch',
          gap: isMobile ? 14 : 18,
          margin: '20px 0 0',
        }}>
          <Reveal delay={0.1} style={{ display: 'flex' }}>
            <div style={{
              flex: 1,
              position: 'relative',
              background: 'linear-gradient(165deg, rgba(255,253,250,0.1) 0%, rgba(255,253,250,0.035) 100%)',
              border: '1px solid rgba(198,168,122,0.34)',
              borderRadius: 22,
              padding: isMobile ? '26px 22px' : '32px 30px',
              boxShadow: 'inset 0 1px 0 rgba(255,253,250,0.08), 0 20px 44px rgba(0,0,0,0.22)',
            }}>
              <div style={{
                position: 'absolute',
                top: isMobile ? 18 : 22,
                right: isMobile ? 18 : 22,
                padding: '5px 12px',
                borderRadius: 999,
                background: C.gold,
                color: C.white,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}>
                Incluso
              </div>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: `linear-gradient(145deg, ${C.gold}, ${C.goldDark})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.white, marginBottom: 18,
              }}>
                {Icons.laptop}
              </div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: isMobile ? 22 : 26,
                fontWeight: 600,
                color: C.white,
              }}>
                Programa Online
              </h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: isMobile ? 14.5 : 15.5,
                fontWeight: 300,
                lineHeight: 1.68,
                color: 'rgba(255,253,250,0.66)',
                marginTop: 10,
              }}>
                Todo o conhecimento do Corpo Musical, com conteúdos gravados por fases
                e encontros ao vivo para aprofundar o processo. Você não escolhe entre
                um e outro — o online vem junto.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? 30 : 42,
              color: C.goldLight,
              padding: isMobile ? '4px 0' : '0 6px',
            }}>
              +
            </div>
          </Reveal>

          <Reveal delay={0.22} style={{ display: 'flex' }}>
            <div style={{
              flex: 1,
              background: 'linear-gradient(165deg, rgba(255,253,250,0.1) 0%, rgba(255,253,250,0.035) 100%)',
              border: '1px solid rgba(198,168,122,0.34)',
              borderRadius: 22,
              padding: isMobile ? '26px 22px' : '32px 30px',
              boxShadow: 'inset 0 1px 0 rgba(255,253,250,0.08), 0 20px 44px rgba(0,0,0,0.22)',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: `linear-gradient(145deg, ${C.gold}, ${C.goldDark})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.white, marginBottom: 18,
              }}>
                {Icons.users}
              </div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: isMobile ? 22 : 26,
                fontWeight: 600,
                color: C.white,
              }}>
                Master Move
              </h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: isMobile ? 14.5 : 15.5,
                fontWeight: 300,
                lineHeight: 1.68,
                color: 'rgba(255,253,250,0.66)',
                marginTop: 10,
              }}>
                A aplicação presencial: um espaço para praticar, treinar e transformar
                o conhecimento em experiência real, com acompanhamento no corpo.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div style={{
            margin: '18px 0 0',
            padding: '15px 20px',
            borderRadius: 999,
            background: 'rgba(198,168,122,0.12)',
            border: '1px solid rgba(198,168,122,0.22)',
            textAlign: 'center',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: isMobile ? 12 : 13.5,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.goldLight,
          }}>
            Conhecimento + aplicação presencial
          </div>
        </Reveal>

        {/* Como funciona */}
        <Reveal delay={0.08}>
          <div style={{ marginTop: isMobile ? 48 : 64 }}>
            <Eyebrow color={C.goldLight} align={isMobile ? 'center' : 'left'}>
              Como funciona o Master Move
            </Eyebrow>
          </div>
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 16,
          marginTop: 20,
        }}>
          {MASTERMOVE_COMO.map((m, i) => (
            <Reveal key={m.titulo} delay={0.06 * i} style={{ display: 'flex' }}>
              <div style={{
                flex: 1,
                background: 'linear-gradient(165deg, rgba(255,253,250,0.085) 0%, rgba(255,253,250,0.03) 100%)',
                border: '1px solid rgba(198,168,122,0.26)',
                borderRadius: 20,
                padding: isMobile ? '24px 22px' : '30px 26px',
                textAlign: isMobile ? 'left' : 'center',
                boxShadow: 'inset 0 1px 0 rgba(255,253,250,0.07), 0 16px 36px rgba(0,0,0,0.2)',
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: '50%',
                  background: 'rgba(198,168,122,0.16)',
                  border: '1px solid rgba(198,168,122,0.32)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.goldLight,
                  margin: isMobile ? '0 0 16px' : '0 auto 18px',
                }}>
                  {m.icon}
                </div>
                <h4 style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: isMobile ? 15 : 15.5,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: C.white,
                  lineHeight: 1.35,
                }}>
                  {m.titulo}
                </h4>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: isMobile ? 14.5 : 15,
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: 'rgba(255,253,250,0.62)',
                  marginTop: 10,
                }}>
                  {m.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Investimento */}
        <Reveal delay={0.1}>
          <div style={{
            marginTop: isMobile ? 40 : 56,
            background: 'linear-gradient(160deg, rgba(198,168,122,0.2) 0%, rgba(138,106,59,0.1) 55%, rgba(198,168,122,0.06) 100%)',
            border: '1px solid rgba(198,168,122,0.4)',
            borderRadius: 26,
            padding: isMobile ? '36px 22px' : '52px',
            textAlign: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,253,250,0.1), 0 24px 60px rgba(0,0,0,0.28)',
          }}>
            <Eyebrow color={C.goldLight}>Investimento</Eyebrow>
            <div style={{ marginTop: isMobile ? 22 : 26 }}>
              <Preco parcela="145" avista="1.497" dark isMobile={isMobile} />
            </div>

            <p style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? 13.5 : 14.5,
              fontWeight: 500,
              color: C.goldLight,
              marginTop: isMobile ? 20 : 24,
              padding: '9px 18px',
              borderRadius: 999,
              background: 'rgba(198,168,122,0.14)',
              border: '1px solid rgba(198,168,122,0.28)',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12.5l5.5 5.5L20 6.5" />
              </svg>
              Programa Online completo incluso, sem custo adicional
            </p>

            <div style={{ marginTop: 28, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
              <CtaButton href={CHECKOUT_MASTERMOVE} full>Quero fazer parte</CtaButton>
            </div>

            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: isMobile ? 15 : 17,
              color: 'rgba(255,253,250,0.55)',
              marginTop: 24,
            }}>
              Do conhecimento para o corpo. Do corpo para a vida.
            </p>
          </div>
        </Reveal>

      </div>
    </section>
  )
}

function Check({ on }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: on ? C.gold : 'transparent',
      border: on ? 'none' : `1px solid ${C.line}`,
      color: on ? C.white : C.brownLight,
      fontSize: 13,
    }}>
      {on ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12.5l5.5 5.5L20 6.5" />
        </svg>
      ) : '–'}
    </span>
  )
}

function Comparativo({ isMobile }) {
  const cols = isMobile ? '1fr 62px 62px' : '1fr 150px 170px'

  return (
    <section style={{
      background: C.cream,
      padding: isMobile ? '66px 18px' : '100px 40px',
    }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 44 }}>
            <Eyebrow>Lado a lado</Eyebrow>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? 30 : 44,
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: C.brown,
              marginTop: 16,
            }}>
              O que muda entre uma proposta e outra
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{
            background: C.card,
            borderRadius: 22,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(42,29,20,0.07)',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: cols,
              alignItems: 'center',
              gap: 8,
              padding: isMobile ? '18px 16px' : '22px 28px',
              background: C.cardAlt,
              borderBottom: `1px solid ${C.line}`,
            }}>
              <div />
              <div style={{
                textAlign: 'center',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: isMobile ? 11.5 : 14,
                fontWeight: 600,
                color: C.brownMid,
                lineHeight: 1.25,
              }}>
                Online
              </div>
              <div style={{
                textAlign: 'center',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: isMobile ? 11.5 : 14,
                fontWeight: 700,
                color: C.goldDark,
                lineHeight: 1.25,
              }}>
                Master<br />Move
              </div>
            </div>

            {COMPARATIVO.map((row, i) => (
              <div key={row.item} style={{
                display: 'grid',
                gridTemplateColumns: cols,
                alignItems: 'center',
                gap: 8,
                padding: isMobile ? '15px 16px' : '18px 28px',
                borderBottom: `1px solid ${C.line}`,
                background: row.master && !row.online ? 'rgba(198,168,122,0.08)' : 'transparent',
              }}>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: isMobile ? 13.5 : 15.5,
                  fontWeight: 400,
                  lineHeight: 1.45,
                  color: C.brown,
                }}>
                  {row.item}
                </div>
                <div style={{ textAlign: 'center' }}><Check on={row.online} /></div>
                <div style={{ textAlign: 'center' }}><Check on={row.master} /></div>
              </div>
            ))}

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : cols,
              alignItems: 'center',
              gap: isMobile ? 10 : 8,
              padding: isMobile ? '20px 16px' : '22px 28px',
              background: C.cardAlt,
            }}>
              {!isMobile && <div />}
              <PrecoMini parcela="97" avista="997" label="Online" isMobile={isMobile} />
              <PrecoMini parcela="145" avista="1.497" label="Master Move" destaque isMobile={isMobile} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 14,
            justifyContent: 'center',
            marginTop: 30,
          }}>
            <CtaButton href={CHECKOUT_MASTERMOVE} full={isMobile}>Quero o Master Move</CtaButton>
            <CtaButton href={CHECKOUT_ONLINE} variant="ghost" full={isMobile}>Quero só o online</CtaButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Fechamento({ isMobile }) {
  return (
    <section style={{
      background: C.creamDeep,
      padding: isMobile ? '64px 22px 110px' : '96px 40px 120px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <Reveal>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? 24 : 34,
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1.4,
            color: C.brown,
          }}>
            A dança também transforma pessoas.
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: isMobile ? 15.5 : 17,
            fontWeight: 300,
            lineHeight: 1.75,
            color: C.brownMid,
            marginTop: 20,
          }}>
            Se ficou alguma dúvida sobre qual formato é o seu, fale com a gente pelo
            botão do WhatsApp aqui na tela. A gente te ajuda a escolher.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div style={{
            marginTop: isMobile ? 44 : 60,
            paddingTop: 30,
            borderTop: `1px solid ${C.line}`,
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? 15 : 17,
              fontWeight: 400,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: C.brown,
            }}>
              O Corpo Musical
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? 10.5 : 11.5,
              fontWeight: 400,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: C.brownLight,
              marginTop: 10,
            }}>
              Dança e vida em movimento
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function BarraFixa({ isMobile }) {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visivel) return null

  const isAnchor = CHECKOUT_MASTERMOVE.charAt(0) === '#'

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 60,
      animation: 'barUp 0.45s cubic-bezier(0.22,1,0.36,1) both',
      background: 'rgba(42,29,20,0.94)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(198,168,122,0.28)',
      padding: isMobile ? '12px 88px 12px 16px' : '14px 40px',
    }}>
      <div style={{
        maxWidth: 980,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: isMobile ? 10.5 : 12,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.goldLight,
          }}>
            Master Move
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 5,
            marginTop: 2,
            lineHeight: 1.15,
          }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? 12.5 : 14,
              fontWeight: 500,
              color: 'rgba(255,253,250,0.72)',
            }}>
              12x
            </span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? 13 : 14.5,
              fontWeight: 600,
              color: C.white,
            }}>
              R$
            </span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? 22 : 26,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: C.white,
            }}>
              145
            </span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? 11.5 : 13.5,
              fontWeight: 300,
              color: 'rgba(255,253,250,0.58)',
            }}>
              · online incluso
            </span>
          </div>
        </div>

        <a
          href={CHECKOUT_MASTERMOVE}
          {...(isAnchor ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          style={{
            flexShrink: 0,
            padding: isMobile ? '12px 18px' : '14px 30px',
            borderRadius: 999,
            background: `linear-gradient(100deg, ${C.gold}, ${C.goldLight})`,
            color: C.brown,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: isMobile ? 12.5 : 14,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Fazer parte
        </a>
      </div>
    </div>
  )
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default function PropostaLP() {
  const width = useWindowWidth()
  const isMobile = width < 768

  useEffect(() => {
    document.title = 'Proposta | O Corpo Musical'
  }, [])

  return (
    <>
      <style>{globalStyles}</style>
      <main style={{ background: C.cream }}>
        <Hero isMobile={isMobile} />
        <Ponte isMobile={isMobile} />
        <OfertaOnline isMobile={isMobile} />
        <OfertaMasterMove isMobile={isMobile} />
        <Comparativo isMobile={isMobile} />
        <Fechamento isMobile={isMobile} />
        <BarraFixa isMobile={isMobile} />
      </main>
    </>
  )
}
