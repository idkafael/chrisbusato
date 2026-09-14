import { useState, useEffect, useRef } from 'react'

import fundoHero from './images/fundo-primeira-dobra.jpg'
import chrisSorrindo from './images/chris-sorrindo.jpg'
import bannerPlataforma from './images/banner-plataforma.jpg'
import webappImg from './images/plataforma-webapp.jpg'
import encontrosAoVivo from './images/encontrosaovivo.png'
import capaMusicalidade from './images/Capa-Musicalidade.png'
import capaMusicalizacao from './images/Capa-Musicalizacao.png'
import capaConsciencia from './images/Capa-Conciencia.png'
import capaVergonha from './images/Capa-Vergonha.png'
import capaReplay from './images/Capa-Replay.png'

import feedbac1 from './images/feedbac1.jpeg'
import feedbac2 from './images/feedbac2.jpeg'
import feedbac3 from './images/feedbac3.jpeg'
import feedbac4 from './images/feedbac4.jpeg'
import feedback10 from './images/feedback10.jpeg'
import feedback11 from './images/feedback11.jpeg'
import carol1 from './images/carol1.jpeg'
import carol2 from './images/carol2.jpeg'
import carol3 from './images/carol3.jpeg'
import mark1 from './images/mark1.jpg'

// ─── Planos ──────────────────────────────────────────────────────────────────
// TODO: o valor do mensal e os links da Cakto ainda são ilustrativos — trocar
// antes de publicar. O anual segue o Programa Online da /corpomusical.
const PLANOS = {
  mensal: { preco: 127, checkout: '#' },
  anual: { parcelas: 12, parcela: 97, avista: 997, checkout: '#' },
}

// Economia e mensal equivalente são contra o anual à vista — é o que o card diz.
const ECONOMIA_ANUAL = PLANOS.mensal.preco * 12 - PLANOS.anual.avista
const MENSAL_EQUIVALENTE = Math.round(PLANOS.anual.avista / 12)

const reais = (n) => n.toLocaleString('pt-BR')

// ─── Tokens (mesma paleta da /corpomusical) ──────────────────────────────────

const C = {
  cream: '#F1EBE2',
  creamDeep: '#E7DFD2',
  card: '#FAF7F2',
  gold: '#8A6A3B',
  goldDark: '#6E5230',
  goldLight: '#C6A87A',
  goldPale: '#EADFC9',
  brown: '#2A1D14',
  brownMid: '#5E4E41',
  brownLight: '#8C7C6E',
  ink: '#1E150F',
  line: 'rgba(42,29,20,0.12)',
  white: '#FFFDFA',
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&family=League+Spartan:wght@600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.cream}; overflow-x: hidden; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes brilhoPassa {
    0%   { transform: translateX(-160%) skewX(-22deg); }
    55%  { transform: translateX(560%) skewX(-22deg); }
    100% { transform: translateX(560%) skewX(-22deg); }
  }
  @keyframes shimmerSlide {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .cm-scroller::-webkit-scrollbar { display: none; }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`

// ─── Conteúdo ────────────────────────────────────────────────────────────────

const PUBLICOS = [
  {
    n: '01',
    nivel: 'Começando',
    titulo: 'Quem está começando',
    bullets: [
      'Não sabe por onde começar e quer um caminho organizado',
      'Trava na hora de soltar o corpo e seguir a música',
    ],
  },
  {
    n: '02',
    nivel: 'Evoluindo',
    titulo: 'Quem já dança',
    bullets: [
      'Sente que estagnou e quer destravar para o próximo nível',
      'Quer dançar com mais musicalidade e presença, não só passos',
    ],
  },
  {
    n: '03',
    nivel: 'Ensinando',
    titulo: 'Professores de dança',
    bullets: [
      'Quer uma base metodológica para diferenciar o próprio ensino',
      'Busca referências de musicalidade e consciência corporal',
    ],
  },
]

const DENTRO = [
  {
    titulo: 'Cursos completos',
    desc: 'Musicalidade, Musicalização e Consciência Corporal, gravados para você estudar no seu ritmo, na ordem que quiser.',
    visual: { tipo: 'capas' },
  },
  {
    titulo: '2 encontros ao vivo por semana',
    desc: 'Segunda às 20h e quarta às 8h30: você dança junto com a Chris, com prática guiada e espaço para tirar dúvidas.',
    visual: { tipo: 'imagem', src: encontrosAoVivo, fit: 'contain', fundo: '#F4E6D7', alt: 'Encontros ao vivo do Clube Musical' },
  },
  {
    titulo: 'Replays de todos os encontros',
    desc: 'Não pôde ao vivo? Todos os encontros ficam gravados para você assistir quando e quantas vezes quiser.',
    visual: { tipo: 'capa', src: capaReplay, alt: 'Replays das aulas ao vivo' },
  },
  {
    titulo: 'Uma plataforma organizada',
    desc: 'Tudo fácil de encontrar, no celular ou no computador, com acesso a qualquer hora.',
    visual: { tipo: 'imagem', src: bannerPlataforma, fit: 'cover', alt: 'A plataforma do Clube Musical por dentro' },
  },
  {
    titulo: 'Transmissão do Master Move',
    desc: 'Uma vez por mês você acompanha, ao vivo, a imersão presencial que acontece em São Paulo.',
    visual: { tipo: 'imagem', src: fundoHero, fit: 'cover', posicao: 'center 38%', alt: 'Chris Busato dançando' },
  },
  {
    titulo: 'Comunidade no WhatsApp',
    desc: 'Um espaço de troca com quem está no mesmo caminho: vídeos, mensagens, perguntas e apoio contínuo.',
    visual: { tipo: 'chat' },
  },
]

const TRANSFORMACOES = [
  { antes: 'Dança contando os passos na cabeça, sem sentir a música', depois: 'Ouve a música e o corpo responde com naturalidade' },
  { antes: 'Trava quando alguém olha ou quando precisa improvisar', depois: 'Dança com presença, mesmo sem decorar coreografia' },
  { antes: 'Junta aulas soltas sem um caminho que faça sentido', depois: 'Segue uma formação organizada, do básico ao avançado' },
  { antes: 'Sente que o corpo é "duro" e não responde do jeito que queria', depois: 'Tem consciência do próprio corpo e dança com liberdade' },
]

// Cada coluna tem a mesma altura. Prints baixos entram empilhados (2 por coluna)
// para fechar a altura de um print alto — a largura sai da proporção da imagem.
const FEEDBACK_COLUNAS = [
  [{ src: feedbac1, r: 945 / 1600 }],
  [{ src: feedbac2, r: 944 / 1600 }],
  [{ src: feedbac3, r: 1170 / 1512 }],
  [{ src: feedbac4, r: 943 / 1600 }],
  [{ src: feedback10, r: 1179 / 1003 }, { src: feedback11, r: 1125 / 971 }],
  [{ src: carol1, r: 738 / 1600 }],
  [{ src: carol2, r: 738 / 1600 }],
  [{ src: carol3, r: 738 / 1600 }],
  [{ src: mark1, r: 1179 / 2556 }],
]

// O mesmo conteúdo nos dois planos.
const INCLUSO = [
  'Cursos de Musicalidade, Musicalização e Consciência Corporal',
  'Aulão A Vergonha na Dança',
  '2 encontros ao vivo por semana com a Chris',
  'Replays de todos os encontros ao vivo',
  'Transmissão ao vivo do Master Move, 1x por mês',
  'Comunidade no WhatsApp',
]

const FAQ = [
  {
    q: 'Como funciona o acesso?',
    a: 'Assim que o pagamento é confirmado, você recebe o acesso à plataforma por e-mail e já pode começar a assistir todo o conteúdo imediatamente, de qualquer dispositivo.',
  },
  {
    q: 'Qual a diferença entre o plano mensal e o anual?',
    a: 'O conteúdo é o mesmo nos dois. No mensal você paga mês a mês. No anual você paga um valor menor pelo ano inteiro, em até 12x ou à vista. As formas de pagamento aparecem na hora do checkout.',
  },
  {
    q: 'O que acontece se eu cancelar?',
    a: 'Ao cancelar a assinatura, o seu acesso à plataforma é encerrado na hora.',
  },
  {
    q: 'Preciso ter experiência em dança?',
    a: 'Não. O clube foi pensado para todos os níveis: de quem está começando do zero a professores que querem aprofundar a metodologia.',
  },
  {
    q: 'Os encontros ao vivo ficam gravados?',
    a: 'Sim. Todas as aulas ao vivo ficam disponíveis como replay dentro da plataforma. Se não puder participar ao vivo, assiste depois.',
  },
  {
    q: 'E se eu não gostar?',
    a: 'Você tem a garantia legal de 7 dias. Se dentro desse período sentir que não é para você, é só pedir o reembolso.',
  },
]

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

function useMenosMovimento() {
  const consulta = '(prefers-reduced-motion: reduce)'
  const [reduzir, setReduzir] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(consulta).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(consulta)
    const handle = () => setReduzir(mq.matches)
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [])
  return reduzir
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

// A palavra de destaque dos títulos: itálico dourado, no lugar do azul do Sharkz.
function Ouro({ children, escuro = false }) {
  return (
    <em style={{ fontStyle: 'italic', fontWeight: 400, color: escuro ? C.goldLight : C.gold }}>
      {children}
    </em>
  )
}

function Titulo({ children, isMobile, escuro = false, align = 'center', style }) {
  return (
    <h2 style={{
      fontFamily: "'Playfair Display', serif",
      fontWeight: 500,
      fontSize: isMobile ? 34 : 56,
      lineHeight: 1.08,
      letterSpacing: '-0.025em',
      color: escuro ? C.white : C.brown,
      textAlign: align,
      ...style,
    }}>
      {children}
    </h2>
  )
}

function CtaButton({ children, href, variant = 'gold', full = false, isMobile }) {
  const [hover, setHover] = useState(false)
  const isAnchor = href.charAt(0) === '#'
  const gold = variant === 'gold'
  const ghostEscuro = variant === 'ghostEscuro'
  const corGhost = ghostEscuro ? C.goldLight : C.goldDark

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
        padding: isMobile ? '17px 26px' : '19px 38px',
        borderRadius: 999,
        // backgroundColor/backgroundImage separados: o shorthand conflita com backgroundSize.
        backgroundColor: gold
          ? 'transparent'
          : hover ? (ghostEscuro ? 'rgba(198,168,122,0.12)' : 'rgba(138,106,59,0.08)') : 'transparent',
        backgroundImage: gold
          ? `linear-gradient(100deg, ${C.goldDark} 0%, ${C.gold} 25%, ${C.goldLight} 50%, ${C.gold} 75%, ${C.goldDark} 100%)`
          : 'none',
        backgroundSize: gold ? '200% auto' : 'auto',
        animation: gold ? 'shimmerSlide 6s linear infinite' : 'none',
        border: gold ? 'none' : `1.5px solid ${ghostEscuro ? 'rgba(198,168,122,0.55)' : C.gold}`,
        color: gold ? C.white : corGhost,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: isMobile ? 14 : 15,
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: gold ? `0 14px 32px rgba(110,82,48,${hover ? 0.34 : 0.22})` : 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
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

function Check({ escuro = false }) {
  return (
    <span style={{
      flexShrink: 0,
      width: 22,
      height: 22,
      marginTop: 1,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: escuro ? 'rgba(198,168,122,0.16)' : C.goldPale,
      border: `1px solid ${escuro ? 'rgba(198,168,122,0.45)' : 'rgba(138,106,59,0.3)'}`,
      color: escuro ? C.goldLight : C.goldDark,
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 12.5l5.5 5.5L20 6.5" />
      </svg>
    </span>
  )
}

function ListaCheck({ itens, escuro = false, destaqueUltimo = false, isMobile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      {itens.map((item, i) => {
        const destaque = destaqueUltimo && i === itens.length - 1
        return (
          <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
            <Check escuro={escuro} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: isMobile ? 14.5 : 15,
              fontWeight: destaque ? 600 : 400,
              lineHeight: 1.45,
              color: destaque ? C.goldLight : (escuro ? 'rgba(255,253,250,0.84)' : C.brownMid),
            }}>
              {item}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ isMobile }) {
  const [rolou, setRolou] = useState(false)

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: rolou ? 'rgba(241,235,226,0.97)' : 'transparent',
      borderBottom: `1px solid ${rolou ? C.line : 'transparent'}`,
      transition: 'background 0.35s ease, border-color 0.35s ease',
    }}>
      <div style={{
        maxWidth: 1120,
        height: isMobile ? 60 : 72,
        margin: '0 auto',
        padding: isMobile ? '0 20px' : '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href="#topo" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: isMobile ? 21 : 24,
          color: C.brown,
          textDecoration: 'none',
          letterSpacing: '-0.01em',
        }}>
          Clube <Ouro>Musical</Ouro>
        </a>
        <a href="#planos" style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: isMobile ? 11.5 : 12.5,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.goldDark,
          textDecoration: 'none',
          padding: isMobile ? '9px 16px' : '10px 20px',
          borderRadius: 999,
          border: `1.5px solid ${C.gold}`,
        }}>
          Ver planos
        </a>
      </div>
    </nav>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero({ isMobile }) {
  return (
    <section id="topo" style={{
      position: 'relative',
      overflow: 'hidden',
      background: C.cream,
      padding: isMobile ? '116px 22px 76px' : '170px 40px 120px',
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
        background: `linear-gradient(180deg, rgba(241,235,226,0.9) 0%, rgba(241,235,226,0.62) 40%, rgba(241,235,226,0.9) 80%, ${C.cream} 100%)`,
      }} />

      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <Reveal>
          <Eyebrow>Clube Musical · com Chris Busato</Eyebrow>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: isMobile ? 48 : 96,
            lineHeight: 1,
            letterSpacing: '-0.035em',
            color: C.brown,
            marginTop: isMobile ? 22 : 28,
          }}>
            Quer ter um<br />
            <Ouro>corpo musical?</Ouro>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: isMobile ? 16.5 : 20,
            lineHeight: 1.65,
            color: C.brownMid,
            maxWidth: 620,
            margin: isMobile ? '24px auto 0' : '30px auto 0',
          }}>
            O Clube Musical reúne tudo o que a Chris ensina: cursos completos, encontros
            ao vivo toda semana e uma comunidade dançando junto com você.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 14,
            justifyContent: 'center',
            marginTop: isMobile ? 34 : 42,
          }}>
            <CtaButton href="#planos" full={isMobile} isMobile={isMobile}>Quero entrar no clube</CtaButton>
            <CtaButton href="#dentro" variant="ghost" full={isMobile} isMobile={isMobile}>Ver o que tem dentro</CtaButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Manifesto ───────────────────────────────────────────────────────────────

// O risco se desenha quando a frase entra na tela — a versão calma do
// "nem bandido, nem trouxa" do Sharkz.
function Riscado({ children, delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.6 })
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block', color: C.brownLight }}>
      {children}
      <span aria-hidden="true" style={{
        position: 'absolute',
        left: '-3%',
        right: '-3%',
        top: '52%',
        height: '0.075em',
        minHeight: 3,
        borderRadius: 4,
        background: C.goldDark,
        transformOrigin: 'left center',
        transform: inView ? 'scaleX(1)' : 'scaleX(0)',
        transition: `transform 0.9s cubic-bezier(0.65,0,0.35,1) ${delay}s`,
      }} />
    </span>
  )
}

function ManifestoSection({ isMobile }) {
  return (
    <section style={{
      background: C.creamDeep,
      padding: isMobile ? '84px 22px' : '130px 40px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <Reveal>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: isMobile ? 40 : 78,
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
            color: C.brown,
          }}>
            <Riscado delay={0.2}>Nem aula avulsa,</Riscado><br />
            <Riscado delay={0.55}>nem passo decorado.</Riscado><br />
            É o Clube <Ouro>Musical.</Ouro>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: isMobile ? 16.5 : 19,
            lineHeight: 1.75,
            color: C.brownMid,
            maxWidth: 640,
            margin: isMobile ? '28px auto 0' : '36px auto 0',
          }}>
            Tudo o que a Chris ensina, reunido num só lugar: os cursos de Musicalidade,
            Musicalização e Consciência Corporal, os encontros ao vivo e os replays para
            você revisitar quantas vezes quiser.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: isMobile ? 21 : 27,
            lineHeight: 1.4,
            color: C.gold,
            marginTop: isMobile ? 22 : 28,
          }}>
            Você não coleciona aulas. Você dança toda semana.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Para quem é ─────────────────────────────────────────────────────────────

function NiveisSection({ isMobile }) {
  return (
    <section style={{
      background: C.cream,
      padding: isMobile ? '84px 20px' : '120px 40px',
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow>Para quem é</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <Titulo isMobile={isMobile} style={{ marginTop: 18 }}>
            Três níveis, <Ouro>um só caminho.</Ouro>
          </Titulo>
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 16 : 22,
          marginTop: isMobile ? 40 : 60,
        }}>
          {PUBLICOS.map((p, i) => (
            <Reveal key={p.n} delay={0.1 * i} style={{ display: 'flex' }}>
              <div style={{
                flex: 1,
                background: C.card,
                border: '1px solid rgba(42,29,20,0.09)',
                borderRadius: 24,
                padding: isMobile ? '28px 24px' : '36px 32px',
                boxShadow: '0 2px 3px rgba(42,29,20,0.03), 0 16px 40px rgba(42,29,20,0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    fontSize: 46,
                    lineHeight: 1,
                    color: C.goldLight,
                  }}>
                    {p.n}
                  </span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11.5,
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: C.brownLight,
                  }}>
                    {p.nivel}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: isMobile ? 23 : 25,
                  lineHeight: 1.2,
                  color: C.brown,
                  margin: '18px 0 18px',
                }}>
                  {p.titulo}
                </h3>
                <ListaCheck itens={p.bullets} isMobile={isMobile} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Por dentro (a seção que conta a história enquanto rola) ─────────────────

const PALCO = {
  position: 'absolute',
  inset: 0,
  background: 'radial-gradient(120% 90% at 50% 0%, rgba(198,168,122,0.16), transparent 62%), #1E150F',
}

const BOLHAS = [
  { lado: 'esq', largura: '72%' },
  { lado: 'esq', largura: '48%' },
  { lado: 'dir', largura: '58%' },
  { lado: 'esq', largura: '64%' },
  { lado: 'dir', largura: '44%' },
  { lado: 'esq', largura: '54%' },
]

function VisualDentro({ visual }) {
  if (visual.tipo === 'capas') {
    const capas = [
      { src: capaMusicalidade, alt: 'Musicalidade' },
      { src: capaMusicalizacao, alt: 'Musicalização' },
      { src: capaConsciencia, alt: 'Consciência Corporal' },
      { src: capaVergonha, alt: 'A Vergonha na Dança' },
    ]
    return (
      <div style={{
        ...PALCO,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '4%',
        padding: '0 6%',
        alignItems: 'center',
      }}>
        {capas.map((c, i) => (
          <img key={c.alt} src={c.src} alt={c.alt} style={{
            width: '100%',
            display: 'block',
            borderRadius: 10,
            boxShadow: '0 14px 30px rgba(0,0,0,0.45)',
            transform: `translateY(${i % 2 ? 7 : -7}%)`,
          }} />
        ))}
      </div>
    )
  }

  // Capa vertical numa moldura horizontal: em vez de faixas pretas nas laterais,
  // ela flutua sobre o palco, como as capas do primeiro passo.
  if (visual.tipo === 'capa') {
    return (
      <div style={{
        ...PALCO,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6% 0',
      }}>
        <img src={visual.src} alt={visual.alt} style={{
          height: '100%',
          width: 'auto',
          maxWidth: '80%',
          objectFit: 'contain',
          borderRadius: 12,
          boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
        }} />
      </div>
    )
  }

  // Sem mensagens escritas de propósito: é uma ilustração do grupo, não um print real.
  if (visual.tipo === 'chat') {
    return (
      <div style={{ ...PALCO, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '42%',
          minWidth: 168,
          height: '86%',
          borderRadius: 24,
          background: '#120D09',
          border: '1px solid rgba(198,168,122,0.3)',
          boxShadow: '0 24px 50px rgba(0,0,0,0.5)',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            paddingBottom: 10,
            borderBottom: '1px solid rgba(198,168,122,0.16)',
          }}>
            <span style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `linear-gradient(140deg, ${C.gold}, ${C.goldDark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: C.white,
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 12,
            }}>
              CM
            </span>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: C.white }}>
                Clube Musical
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'rgba(255,253,250,0.5)' }}>
                Comunidade
              </span>
            </span>
          </div>
          {BOLHAS.map((b, i) => (
            <span key={i} style={{
              alignSelf: b.lado === 'dir' ? 'flex-end' : 'flex-start',
              width: b.largura,
              height: 24,
              borderRadius: 12,
              flexShrink: 0,
              background: b.lado === 'dir' ? 'rgba(198,168,122,0.3)' : 'rgba(255,253,250,0.09)',
            }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <img src={visual.src} alt={visual.alt} style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: visual.fit,
      objectPosition: visual.posicao || 'center',
      background: visual.fundo || C.ink,
    }} />
  )
}

function DentroSection({ isMobile, reduzir }) {
  const trilhoRef = useRef(null)
  const [ativo, setAtivo] = useState(0)
  const total = DENTRO.length

  // Tela fixa só no desktop: no celular a barra de endereço muda a altura da tela
  // no meio da rolagem e o efeito engasga. Quem pede menos movimento também cai aqui.
  const empilhado = isMobile || reduzir

  useEffect(() => {
    if (empilhado) return
    let raf = 0
    const medir = () => {
      raf = 0
      const el = trilhoRef.current
      if (!el) return
      const percurso = el.offsetHeight - window.innerHeight
      if (percurso <= 0) return
      const progresso = Math.min(Math.max(-el.getBoundingClientRect().top / percurso, 0), 0.9999)
      setAtivo(Math.floor(progresso * total))
    }
    const agendar = () => { if (!raf) raf = requestAnimationFrame(medir) }
    medir()
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar)
    return () => {
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', agendar)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [empilhado, total])

  // Clicar num item leva a rolagem até o trecho em que ele fica ativo.
  const irPara = (i) => {
    const el = trilhoRef.current
    if (!el) return
    const percurso = el.offsetHeight - window.innerHeight
    const topo = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: topo + (percurso * (i + 0.5)) / total, behavior: 'smooth' })
  }

  const cabecalho = (
    <Reveal>
      <Eyebrow color={C.goldLight}>Por dentro do clube</Eyebrow>
      <Titulo isMobile={isMobile} escuro style={{ marginTop: 16 }}>
        Tudo que a Chris ensina, <Ouro escuro>num só lugar.</Ouro>
      </Titulo>
    </Reveal>
  )

  if (empilhado) {
    return (
      <section id="dentro" style={{
        background: C.ink,
        padding: isMobile ? '84px 20px' : '120px 40px',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {cabecalho}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 44 }}>
            {DENTRO.map((d, i) => (
              <Reveal key={d.titulo}>
                <div style={{
                  borderRadius: 22,
                  overflow: 'hidden',
                  border: '1px solid rgba(198,168,122,0.24)',
                  background: '#2A1D14',
                }}>
                  <div style={{ position: 'relative', aspectRatio: '16 / 11' }}>
                    <VisualDentro visual={d.visual} />
                  </div>
                  <div style={{ padding: '22px 22px 26px' }}>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      color: C.goldLight,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 500,
                      fontSize: 24,
                      lineHeight: 1.2,
                      color: C.white,
                      marginTop: 8,
                    }}>
                      {d.titulo}
                    </h3>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: 'rgba(255,253,250,0.7)',
                      marginTop: 8,
                    }}>
                      {d.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="dentro" style={{ background: C.ink }}>
      <div ref={trilhoRef} style={{ position: 'relative', height: `calc(${total * 60}vh + 100vh)` }}>
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '84px 40px 44px',
          overflow: 'hidden',
        }}>
          {cabecalho}

          <div style={{
            maxWidth: 1120,
            width: '100%',
            margin: '44px auto 0',
            display: 'grid',
            gridTemplateColumns: '0.9fr 1.1fr',
            gap: 64,
            alignItems: 'center',
          }}>
            {/* Lista com trilha: o preenchimento dourado mostra o quanto já foi visto */}
            <div style={{ position: 'relative', paddingLeft: 32 }}>
              <div style={{
                position: 'absolute',
                left: 5,
                top: 16,
                bottom: 16,
                width: 1,
                background: 'rgba(198,168,122,0.22)',
              }} />
              <div style={{
                position: 'absolute',
                left: 4,
                top: 16,
                width: 3,
                borderRadius: 3,
                background: C.goldLight,
                height: `calc((100% - 32px) * ${(ativo + 1) / total})`,
                transition: 'height 0.5s cubic-bezier(0.22,1,0.36,1)',
              }} />

              {DENTRO.map((d, i) => {
                const on = i === ativo
                const visto = i <= ativo
                return (
                  <button
                    key={d.titulo}
                    type="button"
                    onClick={() => irPara(i)}
                    aria-current={on ? 'step' : undefined}
                    style={{
                      position: 'relative',
                      display: 'block',
                      width: '100%',
                      padding: '11px 0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      left: -32,
                      top: 19,
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      background: visto ? C.goldLight : C.ink,
                      border: `1.5px solid ${visto ? C.goldLight : 'rgba(198,168,122,0.4)'}`,
                      transition: 'background 0.4s ease, border-color 0.4s ease',
                    }} />
                    <span style={{
                      display: 'block',
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 24,
                      lineHeight: 1.2,
                      color: on ? C.white : 'rgba(255,253,250,0.4)',
                      transition: 'color 0.4s ease',
                    }}>
                      {d.titulo}
                    </span>
                    <span style={{
                      display: 'grid',
                      gridTemplateRows: on ? '1fr' : '0fr',
                      transition: 'grid-template-rows 0.45s ease',
                    }}>
                      <span style={{ overflow: 'hidden' }}>
                        <span style={{
                          display: 'block',
                          paddingTop: 8,
                          maxWidth: 430,
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 15.5,
                          fontWeight: 300,
                          lineHeight: 1.65,
                          color: 'rgba(255,253,250,0.72)',
                        }}>
                          {d.desc}
                        </span>
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Moldura: as telas trocam com fade enquanto a trilha avança */}
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 11',
              maxHeight: '56vh',
              borderRadius: 24,
              overflow: 'hidden',
              border: '1px solid rgba(198,168,122,0.34)',
              background: C.ink,
              boxShadow: '0 40px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,253,250,0.08)',
            }}>
              {DENTRO.map((d, i) => {
                const on = i === ativo
                return (
                  <div key={d.titulo} aria-hidden={!on} style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: on ? 1 : 0,
                    transform: on ? 'none' : `translateY(${i < ativo ? -18 : 18}px) scale(0.98)`,
                    transition: 'opacity 0.6s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
                  }}>
                    <VisualDentro visual={d.visual} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── A plataforma (argumento de webapp) ──────────────────────────────────────

// Só o que a página já afirma hoje: celular ou computador, qualquer hora e tudo reunido.
const DESTAQUES_PLATAFORMA = [
  { titulo: 'No celular ou no computador', desc: 'Entre de onde estiver, na tela que for mais confortável para você.' },
  { titulo: 'Acesso a qualquer hora', desc: 'Estude quando couber no seu dia, no seu ritmo.' },
  { titulo: 'Tudo num lugar só', desc: 'Cursos, encontros ao vivo e replays organizados para você encontrar com facilidade.' },
]

function PlataformaSection({ isMobile, reduzir }) {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const aparece = inView || reduzir

  return (
    <section style={{
      background: C.creamDeep,
      padding: isMobile ? '84px 18px' : '120px 40px',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow>A plataforma</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <Titulo isMobile={isMobile} style={{ marginTop: 18 }}>
            O clube inteiro numa <Ouro>plataforma só.</Ouro>
          </Titulo>
        </Reveal>
        <Reveal delay={0.14}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? 17 : 19,
            lineHeight: 1.7,
            color: C.brownMid,
            textAlign: 'center',
            maxWidth: 620,
            margin: '20px auto 0',
          }}>
            Uma área de membros organizada e bonita, feita para você encontrar tudo com
            facilidade e estudar no seu ritmo.
          </p>
        </Reveal>

        {/* A janela entra inclinada e endireita quando aparece na tela */}
        <div style={{ perspective: 1600, marginTop: isMobile ? 40 : 64 }}>
          <div ref={ref} style={{
            borderRadius: isMobile ? 12 : 18,
            overflow: 'hidden',
            background: C.card,
            border: '1px solid rgba(42,29,20,0.12)',
            boxShadow: '0 40px 90px rgba(42,29,20,0.22), 0 8px 20px rgba(42,29,20,0.08)',
            transformOrigin: 'center top',
            transform: aparece ? 'none' : 'rotateX(16deg) translateY(48px) scale(0.95)',
            opacity: aparece ? 1 : 0,
            transition: 'transform 1.2s cubic-bezier(0.22,1,0.36,1), opacity 0.8s ease',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? 6 : 8,
              padding: isMobile ? '8px 12px' : '12px 18px',
              background: '#EFE8DD',
              borderBottom: '1px solid rgba(42,29,20,0.1)',
            }}>
              {['#E07A5F', '#E6B450', '#8FA98A'].map((cor) => (
                <span key={cor} style={{
                  width: isMobile ? 8 : 11,
                  height: isMobile ? 8 : 11,
                  borderRadius: '50%',
                  background: cor,
                  flexShrink: 0,
                }} />
              ))}
              <span style={{
                flex: 1,
                maxWidth: 340,
                margin: isMobile ? '0 0 0 10px' : '0 auto',
                padding: isMobile ? '3px 10px' : '5px 16px',
                borderRadius: 999,
                background: C.white,
                border: '1px solid rgba(42,29,20,0.1)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: isMobile ? 10 : 12,
                color: C.brownLight,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                plataforma.chrisbusato.com
              </span>
            </div>
            <img
              src={webappImg}
              alt="Tela da plataforma do Clube Musical"
              loading="lazy"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>

        {/* Enquanto os recursos da tela não forem confirmados, a imagem é ilustrativa */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: C.brownLight,
          textAlign: 'center',
          marginTop: 14,
        }}>
          Imagem ilustrativa da plataforma.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 20 : 32,
          maxWidth: 1000,
          margin: isMobile ? '36px auto 0' : '52px auto 0',
        }}>
          {DESTAQUES_PLATAFORMA.map((d, i) => (
            <Reveal key={d.titulo} delay={0.08 * i}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <Check />
                <div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: isMobile ? 17 : 18,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: C.brown,
                  }}>
                    {d.titulo}
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: isMobile ? 15.5 : 16,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: C.brownMid,
                    marginTop: 6,
                  }}>
                    {d.desc}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
// ─── Transformação ───────────────────────────────────────────────────────────

function TransformacaoSection({ isMobile }) {
  return (
    <section style={{
      background: C.cream,
      padding: isMobile ? '84px 20px' : '120px 40px',
    }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow>A transformação</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <Titulo isMobile={isMobile} style={{ marginTop: 18 }}>
            De onde você está <Ouro>para onde quer chegar.</Ouro>
          </Titulo>
        </Reveal>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 14 : 16,
          marginTop: isMobile ? 40 : 56,
        }}>
          {TRANSFORMACOES.map((t, i) => (
            <Reveal key={t.antes} delay={0.08 * i}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr',
                alignItems: 'stretch',
                background: C.card,
                border: '1px solid rgba(42,29,20,0.09)',
                borderRadius: 22,
                overflow: 'hidden',
                boxShadow: '0 2px 3px rgba(42,29,20,0.03), 0 12px 30px rgba(42,29,20,0.06)',
              }}>
                <div style={{ padding: isMobile ? '20px 22px 16px' : '26px 28px' }}>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: C.brownLight,
                  }}>
                    Hoje
                  </div>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: isMobile ? 15 : 16,
                    lineHeight: 1.5,
                    color: C.brownLight,
                    marginTop: 8,
                  }}>
                    {t.antes}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: isMobile ? '0' : '0 4px',
                  margin: isMobile ? '-2px 0' : 0,
                }}>
                  <span style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: `linear-gradient(140deg, ${C.gold}, ${C.goldDark})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(110,82,48,0.3)',
                    transform: isMobile ? 'rotate(90deg)' : 'none',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke={C.white} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>

                <div style={{
                  background: C.goldPale,
                  padding: isMobile ? '16px 22px 22px' : '26px 28px',
                }}>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: C.goldDark,
                  }}>
                    No clube
                  </div>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: isMobile ? 15 : 16,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: C.brown,
                    marginTop: 8,
                  }}>
                    {t.depois}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Depoimentos ─────────────────────────────────────────────────────────────

function FeedbackSection({ isMobile }) {
  const scrollerRef = useRef(null)
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0 })

  const onDown = (e) => {
    const el = scrollerRef.current
    if (!el) return
    drag.current = { down: true, startX: e.pageX, scrollLeft: el.scrollLeft }
    el.style.cursor = 'grabbing'
  }
  const onMove = (e) => {
    const el = scrollerRef.current
    if (!el || !drag.current.down) return
    e.preventDefault()
    el.scrollLeft = drag.current.scrollLeft - (e.pageX - drag.current.startX)
  }
  const onUp = () => {
    drag.current.down = false
    if (scrollerRef.current) scrollerRef.current.style.cursor = 'grab'
  }

  return (
    <section style={{
      background: C.creamDeep,
      padding: isMobile ? '84px 0 90px' : '120px 0',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: 760,
        margin: '0 auto',
        textAlign: 'center',
        padding: isMobile ? '0 22px' : '0 40px',
        marginBottom: isMobile ? 36 : 48,
      }}>
        <Reveal>
          <Eyebrow>Depoimentos</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <Titulo isMobile={isMobile} style={{ marginTop: 18 }}>
            Quem já vive o <Ouro>Corpo Musical.</Ouro>
          </Titulo>
        </Reveal>
        <Reveal delay={0.14}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 18,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: C.brownMid,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Arraste para ler mais
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div
          ref={scrollerRef}
          className="cm-scroller"
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: isMobile ? 14 : 20,
            overflowX: 'auto',
            padding: isMobile ? '4px 22px 20px' : '4px 40px 24px',
            scrollSnapType: 'x proximity',
            cursor: 'grab',
            scrollbarWidth: 'none',
          }}
        >
          {FEEDBACK_COLUNAS.map((col, i) => {
            const alturaCol = isMobile ? 460 : 540
            const gapInterno = isMobile ? 10 : 14
            const somaInversa = col.reduce((s, item) => s + 1 / item.r, 0)
            const larguraCol = (alturaCol - gapInterno * (col.length - 1)) / somaInversa

            return (
              <div key={i} style={{
                flex: '0 0 auto',
                width: larguraCol,
                height: alturaCol,
                display: 'flex',
                flexDirection: 'column',
                gap: gapInterno,
                scrollSnapAlign: 'center',
              }}>
                {col.map((item, j) => (
                  <div key={j} style={{
                    height: larguraCol / item.r,
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid rgba(42,29,20,0.1)',
                    boxShadow: '0 14px 34px rgba(42,29,20,0.12)',
                    background: C.white,
                  }}>
                    <img
                      src={item.src}
                      alt={`Depoimento ${i + 1}${col.length > 1 ? `.${j + 1}` : ''}`}
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', pointerEvents: 'none' }}
                    />
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </Reveal>
    </section>
  )
}

// ─── Planos ──────────────────────────────────────────────────────────────────
// Cards no estilo dos planos do Sharkz, em dourado: fonte geométrica pesada nos
// rótulos e no preço, medalha no canto e o anual com borda acesa.

const FONTE_DISPLAY = "'League Spartan', 'DM Sans', sans-serif"

function Medalha({ destaque = false, size = 54 }) {
  const id = destaque ? 'medalha-ouro' : 'medalha-bronze'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      aria-hidden="true"
      style={{
        flexShrink: 0,
        filter: destaque ? 'drop-shadow(0 0 14px rgba(226,190,130,0.45))' : 'none',
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={destaque ? '#F3D9A4' : '#8C7C6E'} />
          <stop offset="50%" stopColor={destaque ? '#C6A87A' : '#5E4E41'} />
          <stop offset="100%" stopColor={destaque ? '#8A6A3B' : '#3A2E25'} />
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="26" fill="none" stroke={`url(#${id})`} strokeWidth="2.5" />
      <circle cx="28" cy="28" r="20" fill={`url(#${id})`} opacity={destaque ? 0.22 : 0.18} />
      <path d="M24 35.5V20.5l12-3v14" fill="none" stroke={`url(#${id})`} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="21.5" cy="35.5" r="3.2" fill={`url(#${id})`} />
      <circle cx="33.5" cy="31.5" r="3.2" fill={`url(#${id})`} />
    </svg>
  )
}

function CtaPlano({ children, href, destaque = false, isMobile }) {
  const [hover, setHover] = useState(false)
  const isAnchor = href.charAt(0) === '#'

  return (
    <a
      href={href}
      {...(isAnchor ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        width: '100%',
        padding: isMobile ? '19px 20px' : '22px 24px',
        borderRadius: 999,
        backgroundColor: destaque ? 'transparent' : (hover ? 'rgba(255,253,250,0.08)' : 'rgba(255,253,250,0.03)'),
        backgroundImage: destaque ? 'linear-gradient(100deg, #B88B4A 0%, #E2BE82 55%, #F3D9A4 100%)' : 'none',
        border: destaque ? 'none' : '1px solid rgba(255,253,250,0.16)',
        boxShadow: destaque ? `0 14px 36px rgba(212,170,105,${hover ? 0.45 : 0.3})` : 'none',
        color: destaque ? C.brown : C.white,
        fontFamily: FONTE_DISPLAY,
        fontSize: isMobile ? 15 : 16,
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
      }}
    >
      {/* A faixa de luz diagonal que atravessa o botão */}
      <span aria-hidden="true" style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '22%',
        background: `linear-gradient(90deg, transparent, rgba(255,255,255,${destaque ? 0.55 : 0.14}), transparent)`,
        animation: 'brilhoPassa 4.5s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <span style={{ position: 'relative' }}>{children}</span>
      <span style={{
        position: 'relative',
        display: 'inline-block',
        transform: hover ? 'translateX(4px)' : 'none',
        transition: 'transform 0.3s ease',
      }}>→</span>
    </a>
  )
}

function ListaPlano({ itens, destaqueUltimo = false, grande = false, isMobile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: grande ? 12 : 11 }}>
      {itens.map((item, i) => {
        const destaque = destaqueUltimo && i === itens.length - 1
        return (
          <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{
              flexShrink: 0,
              width: 18,
              height: 18,
              marginTop: grande ? 4 : 2,
              borderRadius: '50%',
              border: `1.5px solid ${destaque ? '#E8C48A' : 'rgba(255,253,250,0.45)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: destaque ? '#E8C48A' : 'rgba(255,253,250,0.8)',
            }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12.5l5.5 5.5L20 6.5" />
              </svg>
            </span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: grande ? (isMobile ? 16 : 18) : (isMobile ? 14.5 : 15.5),
              fontWeight: destaque ? 600 : 400,
              lineHeight: 1.4,
              color: destaque ? '#E8C48A' : 'rgba(255,253,250,0.86)',
            }}>
              {item}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function PlanosSection({ isMobile }) {
  const { mensal, anual } = PLANOS
  // Quantas mensalidades cabem na economia do anual à vista (R$ 527 ÷ R$ 127 = 4).
  const mesesDeEconomia = Math.floor(ECONOMIA_ANUAL / mensal.preco)

  const rotuloPlano = (tamanho) => ({
    fontFamily: FONTE_DISPLAY,
    fontWeight: 800,
    fontSize: tamanho,
    lineHeight: 1,
    letterSpacing: '0.01em',
    textTransform: 'uppercase',
    color: C.white,
  })
  const numero = {
    fontFamily: FONTE_DISPLAY,
    fontWeight: 800,
    fontSize: isMobile ? 84 : 112,
    lineHeight: 0.8,
    letterSpacing: '-0.035em',
    color: C.white,
  }
  const moeda = {
    fontFamily: FONTE_DISPLAY,
    fontWeight: 700,
    fontSize: isMobile ? 22 : 26,
    color: 'rgba(255,253,250,0.62)',
    marginRight: 6,
  }
  const unidade = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: isMobile ? 15 : 17,
    color: 'rgba(255,253,250,0.62)',
    marginLeft: 12,
  }

  return (
    <section id="planos" style={{
      position: 'relative',
      overflow: 'hidden',
      background: `radial-gradient(90% 60% at 50% 30%, rgba(138,106,59,0.18) 0%, transparent 70%), linear-gradient(180deg, ${C.brown} 0%, ${C.ink} 100%)`,
      padding: isMobile ? '88px 18px 100px' : '130px 40px 150px',
    }}>
      {/* Linha ondulada de fundo, como a do Sharkz — parada, só textura */}
      <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{
        position: 'absolute',
        left: 0,
        top: isMobile ? 290 : 350,
        width: '100%',
        height: 120,
        opacity: 0.5,
      }}>
        <path d="M0 70 C 240 20, 480 110, 720 60 S 1200 20, 1440 70" fill="none" stroke="rgba(198,168,122,0.25)" strokeWidth="1.2" />
      </svg>

      <div style={{ position: 'relative', maxWidth: 1080, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow color={C.goldLight}>Planos</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <Titulo isMobile={isMobile} escuro style={{ marginTop: 18 }}>
            Escolha como quer <Ouro escuro>entrar no clube.</Ouro>
          </Titulo>
        </Reveal>
        <Reveal delay={0.14}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: isMobile ? 16 : 18,
            lineHeight: 1.6,
            color: 'rgba(255,253,250,0.66)',
            textAlign: 'center',
            maxWidth: 520,
            margin: '20px auto 0',
          }}>
            O conteúdo é o mesmo nos dois planos. Muda só a forma de pagar.
          </p>
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 26 : 40,
          alignItems: 'center',
          marginTop: isMobile ? 48 : 72,
        }}>
          {/* Mensal — no celular vem depois do anual */}
          <Reveal delay={0.1} style={{ order: isMobile ? 2 : 1 }}>
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 30,
              border: '1px solid rgba(255,253,250,0.13)',
              background: 'radial-gradient(90% 60% at 100% 0%, rgba(198,168,122,0.12) 0%, transparent 60%), linear-gradient(165deg, #2B2018 0%, #15100C 100%)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.45)',
              padding: isMobile ? '30px 24px 28px' : '40px 38px 36px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={rotuloPlano(isMobile ? 28 : 34)}>Mensal</div>
                <Medalha size={isMobile ? 46 : 54} />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: isMobile ? 30 : 42 }}>
                <span style={moeda}>R$</span>
                <span style={numero}>{reais(mensal.preco)}</span>
                <span style={unidade}>/mês</span>
              </div>

              <div style={{ marginTop: isMobile ? 26 : 32 }}>
                <ListaPlano itens={INCLUSO} isMobile={isMobile} />
              </div>

              <div style={{ marginTop: isMobile ? 28 : 34 }}>
                <CtaPlano href={mensal.checkout} isMobile={isMobile}>Assinar mensal</CtaPlano>
              </div>
            </div>
          </Reveal>

          {/* Anual — borda acesa, brilho em volta e luz dourada no topo */}
          <Reveal delay={0.2} style={{ order: isMobile ? 1 : 2 }}>
            <div style={{
              position: 'relative',
              borderRadius: 32,
              border: '2px solid rgba(232,196,138,0.9)',
              background: 'radial-gradient(110% 70% at 50% 0%, rgba(226,190,130,0.34) 0%, transparent 62%), linear-gradient(170deg, #5B3F22 0%, #36261A 48%, #1E150F 100%)',
              boxShadow: '0 0 0 1px rgba(232,196,138,0.25), 0 0 42px rgba(212,170,105,0.38), 0 0 110px rgba(212,170,105,0.16), inset 0 0 50px rgba(226,190,130,0.12)',
              padding: isMobile ? '28px 22px 30px' : '38px 38px 44px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                {/* "Mais vantajoso", e não "mais escolhido": a assinatura é nova,
                    então não há escolha de ninguém para citar — a vantagem é o preço. */}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: isMobile ? '9px 14px' : '11px 18px',
                  borderRadius: 14,
                  border: '1.5px solid rgba(232,196,138,0.75)',
                  background: 'rgba(30,21,15,0.35)',
                  fontFamily: FONTE_DISPLAY,
                  fontWeight: 700,
                  fontSize: isMobile ? 13 : 15,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: C.white,
                  whiteSpace: 'nowrap',
                }}>
                  <svg width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="#E8C48A" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6-4.5-4.2 6.1-.8z" />
                  </svg>
                  Mais vantajoso
                </span>
                <Medalha destaque size={isMobile ? 50 : 60} />
              </div>

              <div style={{ ...rotuloPlano(isMobile ? 30 : 38), marginTop: isMobile ? 22 : 26 }}>Anual</div>

              <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: isMobile ? 26 : 32 }}>
                <span style={moeda}>R$</span>
                <span style={numero}>{reais(anual.avista)}</span>
                <span style={unidade}>/ano</span>
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: isMobile ? 13.5 : 14.5,
                color: 'rgba(255,253,250,0.66)',
                marginTop: 14,
              }}>
                à vista · ou {anual.parcelas}x de R$ {reais(anual.parcela)}
              </div>

              {ECONOMIA_ANUAL > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '0.9fr 1.1fr',
                  height: isMobile ? 46 : 52,
                  marginTop: 20,
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: '1.5px solid rgba(232,196,138,0.7)',
                  background: 'rgba(20,14,10,0.7)',
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONTE_DISPLAY,
                    fontWeight: 700,
                    fontSize: isMobile ? 13 : 15,
                    letterSpacing: '0.02em',
                    color: C.white,
                    whiteSpace: 'nowrap',
                  }}>
                    ≈ R$ {reais(MENSAL_EQUIVALENTE)}/mês
                  </span>
                  {/* Corte diagonal entre as duas metades, como na pílula do Sharkz */}
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '-6%',
                    paddingLeft: '10%',
                    backgroundImage: 'linear-gradient(100deg, #C6A87A 0%, #E8C48A 100%)',
                    clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)',
                    fontFamily: FONTE_DISPLAY,
                    fontWeight: 800,
                    fontSize: isMobile ? 14 : 17,
                    letterSpacing: '0.01em',
                    textTransform: 'uppercase',
                    color: C.brown,
                    whiteSpace: 'nowrap',
                  }}>
                    Economize R$ {reais(ECONOMIA_ANUAL)}
                  </span>
                </div>
              )}

              <div style={{ marginTop: isMobile ? 22 : 26 }}>
                <ListaPlano
                  itens={[
                    'Tudo do plano mensal',
                    '12 meses de acesso',
                    ...(mesesDeEconomia >= 1 ? [`${mesesDeEconomia} meses de economia`] : []),
                  ]}
                  destaqueUltimo={mesesDeEconomia >= 1}
                  grande
                  isMobile={isMobile}
                />
              </div>

              <div style={{ marginTop: isMobile ? 28 : 40 }}>
                <CtaPlano href={anual.checkout} destaque isMobile={isMobile}>Assinar anual</CtaPlano>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13.5,
            color: 'rgba(255,253,250,0.5)',
            textAlign: 'center',
            marginTop: isMobile ? 36 : 48,
          }}>
            Acesso imediato · Pagamento 100% seguro
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Chris ───────────────────────────────────────────────────────────────────

function ChrisSection({ isMobile }) {
  return (
    <section style={{
      background: C.cream,
      padding: isMobile ? '84px 22px' : '120px 40px',
    }}>
      <div style={{
        maxWidth: 980,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '380px 1fr',
        gap: isMobile ? 36 : 64,
        alignItems: 'center',
      }}>
        <Reveal>
          <div style={{
            padding: 10,
            borderRadius: 32,
            border: '1px solid rgba(138,106,59,0.28)',
            maxWidth: isMobile ? 340 : 'none',
            margin: isMobile ? '0 auto' : 0,
          }}>
            <div style={{
              aspectRatio: '4 / 5',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 28px 60px rgba(42,29,20,0.2)',
            }}>
              <img src={chrisSorrindo} alt="Chris Busato" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <Eyebrow align={isMobile ? 'center' : 'left'}>Quem conduz o clube</Eyebrow>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: isMobile ? 38 : 50,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: C.brown,
            marginTop: 16,
            textAlign: isMobile ? 'center' : 'left',
          }}>
            Chris <Ouro>Busato</Ouro>
          </h3>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: isMobile ? 16 : 17.5,
            lineHeight: 1.75,
            color: C.brownMid,
            marginTop: 20,
          }}>
            Educadora de dança e criadora do método Corpo Musical. Há mais de dez anos, Chris
            ajuda pessoas a dançarem com mais liberdade, presença e musicalidade. Toda a sua
            metodologia, antes espalhada em aulas e turmas, agora reunida no Clube Musical.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
            {[
              '+10 anos como educadora de dança',
              'Criadora do método Corpo Musical',
              'Referência em musicalidade e consciência corporal',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, flexShrink: 0 }} />
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: C.brownMid,
                }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FaqItem({ item, index, isMobile }) {
  const [aberto, setAberto] = useState(false)

  return (
    <div style={{
      position: 'relative',
      background: C.card,
      borderRadius: 18,
      overflow: 'hidden',
      border: `1px solid ${aberto ? 'rgba(138,106,59,0.45)' : 'rgba(42,29,20,0.09)'}`,
      boxShadow: aberto ? '0 16px 40px rgba(42,29,20,0.08)' : '0 2px 3px rgba(42,29,20,0.03)',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    }}>
      <span aria-hidden="true" style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        background: C.gold,
        transformOrigin: 'top',
        transform: aberto ? 'scaleY(1)' : 'scaleY(0)',
        transition: 'transform 0.35s ease',
      }} />

      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 12 : 18,
          padding: isMobile ? '18px 16px' : '22px 26px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          minWidth: 22,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12.5,
          fontWeight: 600,
          letterSpacing: '0.12em',
          fontVariantNumeric: 'tabular-nums',
          color: aberto ? C.gold : C.brownLight,
          transition: 'color 0.3s ease',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{
          flex: 1,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: isMobile ? 15 : 16.5,
          fontWeight: 600,
          lineHeight: 1.4,
          color: C.brown,
        }}>
          {item.q}
        </span>
        <span style={{
          flexShrink: 0,
          width: 34,
          height: 34,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1.5px solid ${aberto ? C.gold : 'rgba(42,29,20,0.18)'}`,
          background: aberto ? C.gold : 'transparent',
          color: aberto ? C.white : C.brownMid,
          transform: aberto ? 'rotate(45deg)' : 'none',
          transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div style={{
        display: 'grid',
        gridTemplateRows: aberto ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.35s ease',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <p style={{
            margin: isMobile ? '0 16px' : '0 26px',
            padding: isMobile ? '14px 0 20px 34px' : '16px 0 24px 40px',
            borderTop: `1px solid ${C.line}`,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: isMobile ? 15 : 16,
            lineHeight: 1.7,
            color: C.brownMid,
          }}>
            {item.a}
          </p>
        </div>
      </div>
    </div>
  )
}

function FaqSection({ isMobile }) {
  return (
    <section style={{
      background: C.creamDeep,
      padding: isMobile ? '84px 18px' : '120px 40px',
    }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <Reveal>
          <Eyebrow>Dúvidas</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <Titulo isMobile={isMobile} style={{ marginTop: 18 }}>
            Perguntas <Ouro>frequentes</Ouro>
          </Titulo>
        </Reveal>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginTop: isMobile ? 36 : 48,
        }}>
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={0.05 * i}>
              <FaqItem item={item} index={i} isMobile={isMobile} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Rodapé ──────────────────────────────────────────────────────────────────

function Rodape({ isMobile }) {
  return (
    <footer style={{
      background: C.ink,
      padding: isMobile ? '76px 22px 100px' : '104px 40px 72px',
      textAlign: 'center',
    }}>
      <Reveal>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 500,
          fontSize: isMobile ? 42 : 68,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: C.white,
        }}>
          Clube <Ouro escuro>Musical</Ouro>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(255,253,250,0.5)',
          marginTop: 18,
        }}>
          Dança e vida em movimento
        </div>
      </Reveal>
      <Reveal delay={0.16}>
        <div style={{ marginTop: 36 }}>
          <CtaButton href="#planos" isMobile={isMobile}>Quero entrar no clube</CtaButton>
        </div>
      </Reveal>

      <div style={{
        maxWidth: 980,
        margin: isMobile ? '56px auto 0' : '72px auto 0',
        paddingTop: 26,
        borderTop: '1px solid rgba(198,168,122,0.16)',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        color: 'rgba(255,253,250,0.4)',
      }}>
        © {new Date().getFullYear()} · Chris Busato · Todos os direitos reservados
      </div>
    </footer>
  )
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default function ClubeMusicalLP() {
  const width = useWindowWidth()
  const isMobile = width < 768
  const reduzir = useMenosMovimento()

  useEffect(() => {
    document.title = 'Clube Musical | Chris Busato'
  }, [])

  return (
    <>
      <style>{globalStyles}</style>
      <Navbar isMobile={isMobile} />
      <main>
        <Hero isMobile={isMobile} />
        <ManifestoSection isMobile={isMobile} />
        <NiveisSection isMobile={isMobile} />
        <DentroSection isMobile={isMobile} reduzir={reduzir} />
        <PlataformaSection isMobile={isMobile} reduzir={reduzir} />
        <TransformacaoSection isMobile={isMobile} />
        {/* Prova social antes do preço */}
        <FeedbackSection isMobile={isMobile} />
        <PlanosSection isMobile={isMobile} />
        <ChrisSection isMobile={isMobile} />
        <FaqSection isMobile={isMobile} />
      </main>
      <Rodape isMobile={isMobile} />
    </>
  )
}
