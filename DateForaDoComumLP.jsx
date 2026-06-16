import { useState, useEffect, useRef } from 'react'

const C = {
  cream: '#EDEAE3', creamDark: '#E4E0D7', creamCard: '#F2EFE9', white: '#FAFAF8',
  sage: '#8A9E8C', sageDark: '#6B7F6D', sageLight: '#C4D0C5', sagePale: '#E8EDEA',
  brown: '#3D3530', brownMid: '#6B5F58', brownLight: '#9C8E87', ink: '#1C1916',
  rose: '#B87B72', rosePale: '#F0E8E7', roseDark: '#7A5550',
}

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      background: 'rgba(237,234,227,0.92)',
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
        }}>Date Fora do Comum</span>
      </div>
    </nav>
  )
}

// ─── HERO + VSL ───────────────────────────────────────────────────────────────
function HeroSection({ vslUrl }) {
  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  return (
    <section style={{
      background: C.cream,
      padding: mobile ? '100px 24px 56px' : '120px 40px 64px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(32px, 9vw, 48px)' : 'clamp(44px, 5vw, 62px)',
          color: C.brown, lineHeight: 1.2, letterSpacing: '-1.5px',
          marginBottom: 40,
        }}>
          Para se conectar de verdade,<br />
          vocês não precisam de{' '}
          <em style={{ color: C.roseDark, fontStyle: 'italic' }}>mais conversas.</em>
        </h1>

        {/* VSL */}
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          {vslUrl ? (
            <div style={{
              position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden',
              borderRadius: 12, boxShadow: '0 16px 48px rgba(61,53,48,0.18)',
            }}>
              <iframe
                src={vslUrl}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div style={{
              position: 'relative', paddingBottom: '56.25%',
              background: C.creamDark,
              borderRadius: 12,
              boxShadow: '0 16px 48px rgba(61,53,48,0.12)',
              border: `1px solid ${C.sageLight}`,
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: C.rose, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 0 14px rgba(184,123,114,0.15)`,
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={C.white} style={{ marginLeft: 4 }}>
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                  fontSize: 14, color: C.brownLight, letterSpacing: '0.5px',
                }}>Vídeo em breve</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function VslSection() { return null }

// ─── O QUE ACONTECE ───────────────────────────────────────────────────────────
function OQueAconteceSection() {
  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const [ref, inView] = useInView(0.1)

  const pontos = [
    {
      num: '01',
      titulo: 'Conversam muito e se entendem pouco',
      texto: 'As palavras aumentam. A sensação de encontro, não.',
    },
    {
      num: '02',
      titulo: 'Pequenos conflitos viram discussões grandes',
      texto: 'O problema raramente é o problema. Existe algo acontecendo por baixo da conversa.',
    },
    {
      num: '03',
      titulo: 'Sentem saudade de como era antes',
      texto: 'Não porque o amor acabou. Mas porque perderam o caminho até o outro.',
    },
    {
      num: '04',
      titulo: 'Vivem mais como gestores da rotina',
      texto: 'Filhos. Trabalho. Contas. Compromissos. E cada vez menos como casal.',
    },
    {
      num: '05',
      titulo: 'Um quer proximidade. O outro se fecha.',
      texto: 'Quanto mais um insiste, mais o outro se afasta.',
    },
    {
      num: '06',
      titulo: 'Estão juntos. Mas não se sentem juntos.',
      texto: 'A presença física existe. A conexão, não.',
    },
  ]

  return (
    <section ref={ref} style={{
      background: C.cream,
      padding: mobile ? '72px 24px' : '96px 40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: mobile ? 48 : 64 }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase',
            color: C.rose, marginBottom: 16,
          }}>O que está acontecendo</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(28px, 7vw, 40px)' : 'clamp(36px, 4vw, 48px)',
            color: C.brown, lineHeight: 1.2, letterSpacing: '-1px',
          }}>
            Vocês se amam.<br />
            <em style={{ color: C.brownMid, fontStyle: 'italic' }}>Mas algo parece não encaixar.</em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: mobile ? 15 : 17, color: C.brownMid,
            lineHeight: 1.75, maxWidth: 520, margin: '20px auto 0',
          }}>
            Não é falta de amor. Não é falta de esforço. É que ninguém ensinou como a conexão realmente funciona.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
          gap: mobile ? 16 : 24,
        }}>
          {pontos.map((p, i) => (
            <div key={i} style={{
              background: C.white,
              borderRadius: 16,
              padding: mobile ? '28px 24px' : '32px 28px',
              borderTop: `3px solid ${C.rose}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(61,53,48,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 32, color: C.rosePale, letterSpacing: '-1px',
                marginBottom: 16, lineHeight: 1,
              }}>{p.num}</div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: mobile ? 17 : 19, color: C.brown,
                lineHeight: 1.3, marginBottom: 12, letterSpacing: '-0.3px',
              }}>{p.titulo}</h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                fontSize: 14, color: C.brownMid, lineHeight: 1.7,
              }}>{p.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── A GRANDE VIRADA ──────────────────────────────────────────────────────────
function GrandeViradaSection() {
  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const [ref, inView] = useInView(0.1)
  return (
    <section ref={ref} style={{
      background: C.brown,
      padding: mobile ? '72px 24px' : '96px 40px',
      textAlign: 'center',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(184,123,114,0.2)', color: C.rose,
          borderRadius: 100, padding: '5px 18px', marginBottom: 32,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase',
        }}>A grande virada</div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(32px, 8vw, 48px)' : 'clamp(40px, 4vw, 56px)',
          color: C.cream, lineHeight: 1.2, letterSpacing: '-1.5px',
          marginBottom: 32,
        }}>
          O problema não é a comunicação.<br />
          <em style={{ color: C.rose, fontStyle: 'italic' }}>É a percepção.</em>
        </h2>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: mobile ? 15 : 18, color: 'rgba(237,234,227,0.7)',
          lineHeight: 1.8, marginBottom: 24,
        }}>
          A maioria dos casais tenta resolver tudo na conversa. Mas antes da conversa existe algo mais profundo:
        </p>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
          marginBottom: 40,
        }}>
          {['presença', 'atenção', 'escuta', 'ritmo', 'sintonia'].map((w, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.07)',
              border: `1px solid rgba(255,255,255,0.12)`,
              borderRadius: 100, padding: '8px 20px',
              fontFamily: "'Playfair Display', serif",
              fontSize: mobile ? 14 : 16, color: C.sageLight,
              fontStyle: 'italic',
            }}>{w}</div>
          ))}
        </div>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: mobile ? 14 : 16, color: 'rgba(237,234,227,0.5)',
          lineHeight: 1.8,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 32, fontStyle: 'italic',
        }}>
          Pesquisas sobre sincronia fisiológica mostram que casais emocionalmente conectados tendem a apresentar alinhamentos corporais sutis — como respiração, atenção e respostas emocionais compartilhadas.
        </p>
      </div>
    </section>
  )
}

// ─── O QUE VÃO DESCOBRIR ──────────────────────────────────────────────────────
function OQueVaoDescobrirSection() {
  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const [ref, inView] = useInView(0.1)

  const aprendizados = [
    {
      titulo: 'Perceber os ciclos da conexão',
      texto: 'Entender como aproximação e afastamento acontecem dentro da relação.',
    },
    {
      titulo: 'Reconhecer os sinais invisíveis',
      texto: 'Aquilo que o corpo mostra antes das palavras.',
    },
    {
      titulo: 'Sair dos padrões automáticos',
      texto: 'As mesmas discussões, os mesmos afastamentos, as mesmas respostas — e como interrompê-los.',
    },
    {
      titulo: 'Criar encontros reais',
      texto: 'Momentos de presença que geram intimidade verdadeira.',
    },
  ]

  return (
    <section ref={ref} style={{
      background: C.creamDark,
      padding: mobile ? '72px 24px' : '96px 40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: mobile ? 48 : 80,
          alignItems: 'start',
        }}>
          <div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase',
              color: C.rose, marginBottom: 16,
            }}>O que vocês vão descobrir</p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: mobile ? 'clamp(28px, 7vw, 40px)' : 'clamp(32px, 3.5vw, 44px)',
              color: C.brown, lineHeight: 1.2, letterSpacing: '-1px',
              marginBottom: 20,
            }}>A Pauta Lógica<br /><em style={{ color: C.roseDark, fontStyle: 'italic' }}>da Conexão</em></h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              fontSize: mobile ? 15 : 17, color: C.brownMid, lineHeight: 1.75,
              marginBottom: 12,
            }}>
              Um mapa simples para enxergar aquilo que normalmente passa despercebido dentro da relação.
            </p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              fontSize: mobile ? 14 : 15, color: C.brownLight, lineHeight: 1.7,
            }}>
              Não é terapia. Não é aconselhamento. Não é um curso de comunicação.<br /><br />
              É uma experiência para perceber como a conexão é construída — ou interrompida — no dia a dia.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase',
              color: C.brownLight, marginBottom: 4,
            }}>Vocês vão aprender a:</p>
            {aprendizados.map((a, i) => (
              <div key={i} style={{
                background: C.white,
                borderRadius: 12, padding: '20px 20px 20px 24px',
                borderLeft: `3px solid ${C.rose}`,
              }}>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                  fontSize: 15, color: C.brown, marginBottom: 6,
                }}>{a.titulo}</div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                  fontSize: 13, color: C.brownMid, lineHeight: 1.65,
                }}>{a.texto}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── O QUE MUDA ───────────────────────────────────────────────────────────────
function OQueMudaSection() {
  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const [ref, inView] = useInView(0.1)

  const antes = [
    'Conversas que não chegam a lugar nenhum',
    'Repetição dos mesmos conflitos',
    'Sensação de distância',
    'Cobrança',
    'Interpretações erradas',
    'Desgaste emocional',
  ]
  const depois = [
    'Mais clareza',
    'Mais presença',
    'Mais entendimento',
    'Mais leveza',
    'Mais parceria',
    'Mais conexão',
  ]

  return (
    <section ref={ref} style={{
      background: C.cream,
      padding: mobile ? '72px 24px' : '96px 40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: mobile ? 40 : 56 }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase',
            color: C.rose, marginBottom: 12,
          }}>O que muda</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(28px, 7vw, 40px)' : 'clamp(32px, 3.5vw, 44px)',
            color: C.brown, lineHeight: 1.2, letterSpacing: '-1px',
          }}>Antes e depois da vivência</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: mobile ? 16 : 24,
        }}>
          {/* Antes */}
          <div style={{
            background: C.white, borderRadius: 16,
            padding: mobile ? '28px 24px' : '36px 32px',
            border: `1px solid ${C.sageLight}`,
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase',
              color: C.brownLight, marginBottom: 24,
            }}>Antes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {antes.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: '#F0E8E7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 2l6 6M8 2l-6 6" stroke={C.roseDark} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                    fontSize: 15, color: C.brownMid, lineHeight: 1.5,
                  }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Depois */}
          <div style={{
            background: C.brown, borderRadius: 16,
            padding: mobile ? '28px 24px' : '36px 32px',
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase',
              color: C.sageLight, marginBottom: 24,
            }}>Depois</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {depois.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: 'rgba(138,158,140,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5.5l2.5 2.5 4.5-5" stroke={C.sageLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                    fontSize: 15, color: C.cream, lineHeight: 1.5,
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

// ─── PARA QUEM É ──────────────────────────────────────────────────────────────
function ParaQuemESection() {
  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const [ref, inView] = useInView(0.1)

  const items = [
    'Casais que sentem que algo se perdeu',
    'Casais que querem fortalecer a relação antes que vire uma crise',
    'Casais que desejam aprofundar a intimidade',
    'Casais que sabem que amor sozinho não sustenta conexão',
  ]

  return (
    <section ref={ref} style={{
      background: C.rosePale,
      padding: mobile ? '72px 24px' : '96px 40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase',
          color: C.roseDark, marginBottom: 12,
        }}>Para quem é</p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(28px, 7vw, 40px)' : 'clamp(32px, 3.5vw, 44px)',
          color: C.brown, lineHeight: 1.2, letterSpacing: '-1px',
          marginBottom: 40,
        }}>Esta vivência foi feita para vocês</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: C.white, borderRadius: 12,
              padding: mobile ? '18px 20px' : '20px 24px',
              border: `1px solid rgba(184,123,114,0.15)`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: C.rosePale,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 18 }}>💑</span>
              </div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: mobile ? 15 : 16, color: C.brown, lineHeight: 1.5,
              }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── O DIFERENCIAL ────────────────────────────────────────────────────────────
function DiferencialSection() {
  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const [ref, inView] = useInView(0.1)
  return (
    <section ref={ref} style={{
      background: C.creamDark,
      padding: mobile ? '72px 24px' : '96px 40px',
      textAlign: 'center',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase',
          color: C.rose, marginBottom: 12,
        }}>O diferencial</p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(28px, 7vw, 40px)' : 'clamp(32px, 3.5vw, 44px)',
          color: C.brown, lineHeight: 1.2, letterSpacing: '-1px',
          marginBottom: 24,
        }}>
          Não é sobre aprender técnicas.<br />
          <em style={{ color: C.roseDark, fontStyle: 'italic' }}>É sobre aprender a perceber.</em>
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: mobile ? 15 : 17, color: C.brownMid, lineHeight: 1.8,
          marginBottom: 24,
        }}>
          A maioria dos programas ensina o que fazer. Nós ensinamos a enxergar o que está acontecendo.
        </p>
        <div style={{
          background: C.brown, borderRadius: 16,
          padding: mobile ? '28px 24px' : '36px 40px',
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 20 : 24, color: C.cream,
            lineHeight: 1.5, letterSpacing: '-0.5px', fontStyle: 'italic',
          }}>
            "Quando vocês percebem o padrão, a relação deixa de ser um problema para resolver e volta a ser um encontro para viver."
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: 13, color: C.brownLight, marginTop: 16,
            letterSpacing: '1px', textTransform: 'uppercase',
          }}>Chris Busato</p>
        </div>
      </div>
    </section>
  )
}

// ─── DEPOIMENTOS ──────────────────────────────────────────────────────────────
function TestemunhosSection() {
  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const [ref, inView] = useInView(0.1)
  return (
    <section ref={ref} style={{
      background: C.cream,
      padding: mobile ? '72px 24px' : '96px 40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase',
          color: C.rose, marginBottom: 12,
        }}>Relatos de transformação</p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(28px, 7vw, 40px)' : 'clamp(32px, 3.5vw, 44px)',
          color: C.brown, lineHeight: 1.2, letterSpacing: '-1px',
          marginBottom: 48,
        }}>O que casais estão dizendo</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 24,
        }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: C.white, borderRadius: 16,
              padding: '32px 28px',
              border: `1px solid ${C.sageLight}`,
              display: 'flex', flexDirection: 'column', gap: 16,
              opacity: 0.4,
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 14, color: C.brownLight, fontStyle: 'italic',
                lineHeight: 1.7,
              }}>Depoimento em breve...</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                fontSize: 13, color: C.brownLight,
                borderTop: `1px solid ${C.sageLight}`, paddingTop: 16,
              }}>— Casal participante</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── INSCRIÇÃO ────────────────────────────────────────────────────────────────
function InscricaoSection() {
  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const [ref, inView] = useInView(0.1)

  const itens = [
    'Exercícios guiados',
    'Experiências em dupla',
    'Mapa da conexão',
    'Material de apoio',
    'Gravação completa inclusa',
  ]

  return (
    <section id="inscricao" ref={ref} style={{
      background: C.brown,
      padding: mobile ? '72px 24px' : '96px 40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase',
          color: C.rose, marginBottom: 12,
        }}>Vivência Pauta Lógica para Casais</p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: mobile ? 'clamp(28px, 7vw, 40px)' : 'clamp(32px, 3.5vw, 44px)',
          color: C.cream, lineHeight: 1.2, letterSpacing: '-1px',
          marginBottom: 12,
        }}>Date Fora do Comum</h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
          fontSize: mobile ? 15 : 17, color: 'rgba(237,234,227,0.6)',
          lineHeight: 1.7, marginBottom: 40,
        }}>
          Uma experiência prática para descobrir os mecanismos invisíveis que criam conexão.
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: 20,
          padding: mobile ? '28px 20px' : '36px 40px',
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 32, textAlign: 'left',
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase',
            color: 'rgba(237,234,227,0.4)', marginBottom: 20,
          }}>O que está incluído</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {itens.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(184,123,114,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5.5l2.5 2.5 4.5-5" stroke={C.rose} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                  fontSize: mobile ? 14 : 15, color: C.cream, lineHeight: 1.5,
                }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preço */}
        <div style={{ marginBottom: 28 }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 14, color: 'rgba(237,234,227,0.4)',
            textDecoration: 'line-through', marginBottom: 4,
          }}>de R$ —</p>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: 'clamp(48px, 5vw, 64px)',
            color: C.cream, lineHeight: 1, letterSpacing: '-2px', marginBottom: 6,
          }}>R$ —</div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 13, color: 'rgba(237,234,227,0.4)',
          }}>pagamento único · vagas limitadas</p>
        </div>

        <a href="#" style={{
          display: 'inline-block', width: '100%',
          background: C.rose, color: C.white,
          padding: mobile ? '18px 32px' : '20px 48px',
          borderRadius: 100,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
          fontSize: mobile ? 16 : 18, textDecoration: 'none',
          letterSpacing: '0.2px', textAlign: 'center',
          boxShadow: `0 8px 28px rgba(184,123,114,0.4)`,
          transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = C.roseDark; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(184,123,114,0.5)' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.rose; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(184,123,114,0.4)' }}
        >
          Quero participar →
        </a>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FaqSection() {
  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const [open, setOpen] = useState(null)
  const [ref, inView] = useInView(0.1)

  const faqs = [
    {
      q: 'Precisamos estar em crise?',
      a: 'Não. Na verdade, funciona melhor antes da crise. A vivência é para casais que querem aprofundar a conexão — não apenas resolver problemas.',
    },
    {
      q: 'Serve para qualquer tempo de relacionamento?',
      a: 'Sim. Desde relacionamentos recentes até casais com décadas juntos. O mapa da conexão é válido em qualquer fase.',
    },
    {
      q: 'É terapia de casal?',
      a: 'Não. É uma experiência educativa e prática sobre conexão. Não substitui acompanhamento terapêutico, mas pode complementá-lo muito bem.',
    },
    {
      q: 'E se um dos dois não quiser participar?',
      a: 'A vivência é pensada para casais que chegam com abertura. Se um dos dois não se sente pronto, o momento pode não ser esse ainda — e tudo bem.',
    },
    {
      q: 'Como funciona a inscrição?',
      a: 'Basta clicar no botão de inscrição, escolher a modalidade e finalizar o pagamento. Você receberá todas as informações por e-mail.',
    },
  ]

  return (
    <section ref={ref} style={{
      background: C.cream,
      padding: mobile ? '72px 24px' : '96px 40px',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: mobile ? 'clamp(28px, 7vw, 40px)' : 'clamp(32px, 3.5vw, 44px)',
            color: C.brown, lineHeight: 1.2, letterSpacing: '-1px',
          }}>
            Perguntas <em style={{ color: C.rose, fontStyle: 'italic' }}>frequentes</em>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.sageLight}` }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                }}
              >
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                  fontSize: mobile ? 15 : 17, color: C.brown, textAlign: 'left', lineHeight: 1.4,
                }}>{faq.q}</span>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: open === i ? C.rose : C.sagePale,
                  color: open === i ? C.white : C.sageDark,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, lineHeight: 1,
                  transition: 'background 0.2s, color 0.2s',
                }}>{open === i ? '×' : '+'}</span>
              </button>
              {open === i && (
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                  fontSize: mobile ? 14 : 15, color: C.brownMid,
                  lineHeight: 1.75, paddingBottom: 24,
                }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const mobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  return (
    <footer style={{
      background: C.brown,
      padding: mobile ? '40px 24px' : '48px 40px',
      textAlign: 'center',
      borderTop: '1px solid rgba(255,255,255,0.07)',
    }}>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 16, color: 'rgba(237,234,227,0.5)', letterSpacing: '-0.3px',
      }}>Date Fora do Comum · Chris Busato</p>
    </footer>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function DateForaDoComumLP({ vslUrl }) {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; background: ${C.cream}; }
      `}</style>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        <HeroSection vslUrl={vslUrl} />
        <OQueAconteceSection />
        <GrandeViradaSection />
        <OQueVaoDescobrirSection />
        <OQueMudaSection />
        <ParaQuemESection />
        <DiferencialSection />
        <TestemunhosSection />
        <InscricaoSection />
        <FaqSection />
        <Footer />
      </div>
    </>
  )
}
