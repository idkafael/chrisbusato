import { useEffect } from 'react'

const C = {
  cream: '#EDEAE3', creamDark: '#E4E0D7', white: '#FAFAF8',
  sage: '#8A9E8C', sageDark: '#6B7F6D', sageLight: '#C4D0C5', sagePale: '#E8EDEA',
  brown: '#3D3530', brownMid: '#6B5F58', brownLight: '#9C8E87',
  ink: '#1C1916',
}

// ─── Substitua pelo número real com DDI: ex. 5511999999999 ─────────────────
const WA_NUMBER = '5511999999999'
const WA_MSG = encodeURIComponent('Oi Chris! Acabei de garantir minha vaga presencial na vivência Brincando na Música do dia 13 de junho. Estou muito animado(a)! 🎶')
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`

function useWindowWidth() {
  const [w, setW] = [typeof window !== 'undefined' ? window.innerWidth : 1200, null]
  return w
}

export default function AgradecimentoPresencialLP() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; background: ${C.cream}; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(237,234,227,0.9)',
        borderBottom: `1px solid ${C.sageLight}`,
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: mobile ? '0 24px' : '0 40px',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18, color: C.brown, letterSpacing: '-0.3px',
          }}>Vivência Brincando na Música</span>
        </div>
      </nav>

      {/* Hero único */}
      <section style={{
        minHeight: '100vh',
        background: `linear-gradient(160deg, ${C.cream} 0%, ${C.creamDark} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: mobile ? '120px 24px 80px' : '140px 40px 100px',
      }}>
        <div style={{
          maxWidth: 640, width: '100%', textAlign: 'center',
          animation: 'fadeUp 0.8s ease both',
        }}>
          {/* Ícone */}
          <div style={{ fontSize: 56, marginBottom: 24 }}>🎉</div>

          {/* Eyebrow */}
          <div style={{
            display: 'inline-block',
            background: C.sagePale, color: C.sageDark,
            borderRadius: 100, padding: '5px 18px', marginBottom: 24,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase',
          }}>Vaga confirmada · Presencial</div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(36px, 9vw, 52px)' : 56,
            color: C.brown, lineHeight: 1.15,
            letterSpacing: '-1px', marginBottom: 20,
          }}>
            Sua vaga está{' '}
            <em style={{ color: C.sageDark, fontStyle: 'italic' }}>garantida!</em>
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 16 : 18,
            color: C.brownMid, lineHeight: 1.75,
            marginBottom: 16,
          }}>
            Te vejo <strong style={{ fontWeight: 500, color: C.brown }}>presencialmente no dia 13 de junho</strong> no Território da Dança - Lounge & Café SP, Zona Sul de São Paulo.
          </p>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 15 : 16,
            color: C.brownLight, lineHeight: 1.7,
            marginBottom: 48,
          }}>
            Você receberá os detalhes completos por e-mail em breve. Qualquer dúvida, fala comigo pelo WhatsApp.
          </p>

          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#25D366', color: C.white,
              padding: mobile ? '16px 32px' : '18px 40px',
              borderRadius: 100,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              fontSize: mobile ? 15 : 16, textDecoration: 'none',
              letterSpacing: '0.2px',
              boxShadow: '0 8px 28px rgba(37,211,102,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(37,211,102,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(37,211,102,0.3)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Falar com a Chris no WhatsApp
          </a>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 13, color: C.brownLight,
            marginTop: 32,
          }}>
            📍 13 de junho · 10h às 13h · Território da Dança, Zona Sul SP
          </p>
        </div>
      </section>
    </>
  )
}
