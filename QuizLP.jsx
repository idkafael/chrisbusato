import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import chrisSorrindo from './images/chris-sorrindo.jpg'
import feedbac1 from './images/feedbac1.jpeg'
import feedbac2 from './images/feedbac2.jpeg'
import feedbac3 from './images/feedbac3.jpeg'
import feedbac4 from './images/feedbac4.jpeg'
import feedback10 from './images/feedback10.jpeg'
import feedback11 from './images/feedback11.jpeg'

// ─── Funil de Quiz — teste de oferta (tráfego pago, público frio) ─────────────
// Fluxo navegado por HISTÓRICO de ids (não mais números fixos de tela), porque
// o quiz tem ramificação real: quem "ainda não começou" pula a pergunta de
// estilo de dança, e quem escolhe presencial/online no início pode mudar de
// ideia na confirmação — o que muda a oferta final (preço e voucher).
//
// ORDEM_TELAS define a sequência linear; deveExibir() pula condicionalmente
// o que não se aplica; proximoId() anda pela ordem respeitando esses pulos.
// `respostas` guarda tudo que a pessoa respondeu (ver estrutura mais abaixo),
// usado para: personalizar o diagnóstico do WhatsApp, decidir presencial vs
// transmissão, e mostrar o preço certo no voucher.
//
// Ofertas: mesmo evento de 13/09, 10h às 14h — os MESMOS checkouts já usados
// no site principal (nenhuma oferta nova criada na Cakto):
//   Presencial   → R$120 → https://pay.cakto.com.br/cqmaji2
//   Transmissão  → R$67  → https://pay.cakto.com.br/khbx2vk

const CHECKOUT_PRESENCIAL = 'https://pay.cakto.com.br/cqmaji2'
const CHECKOUT_TRANSMISSAO = 'https://pay.cakto.com.br/khbx2vk'

const LOCAL_PRESENCIAL_NOME = 'Yandê Dança e Movimento'
const LOCAL_PRESENCIAL_ENDERECO = 'R. Domingos Lopes, 61 - Campo Belo, São Paulo - SP, 04606-050'
const DATA_EVENTO = '13 de setembro'
const HORARIO_EVENTO = '10h às 14h'

// Sem acento de propósito: o script de UTMs do site decora todo link <a> e
// corrompe caracteres acentuados dentro de query string já url-encoded
// (mesmo cuidado já tomado em BotaoWhatsApp.jsx e nas páginas de agradecimento).
const WHATSAPP_NUMERO = '5548999960701'
const WHATSAPP_MSG = 'vim do quiz do site da chris, fiquei com uma duvida'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MSG)}`

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
  vivo: '#E8534A',
}

const fonteTexto = "'DM Sans', sans-serif"
const fonteTitulo = "'Playfair Display', serif"

// ─── Estrutura do quiz ─────────────────────────────────────────────────────────
// Sequência linear de telas. Perguntas do quiz usam o prefixo "q-" — para
// adicionar/remover uma pergunta no futuro, basta editar esta lista e o
// objeto `perguntasQuiz` logo abaixo; nada mais precisa mudar.
const ORDEM_TELAS = [
  'promessa', 'vsl',
  'q-attendance', 'q-experience', 'q-danceStyle', 'q-pain', 'q-reaction',
  'q-belief', 'q-playfulness', 'q-desire',
  'whatsapp', 'metodo', 'confirmacao', 'voucher', 'prova', 'oferta',
]

// Pulos condicionais: quem ainda não começou a dançar não recebe a pergunta
// de estilo (não faria sentido pra ela).
function deveExibir(id, respostas) {
  if (id === 'q-danceStyle') return respostas.experience !== 'nao_comecei'
  return true
}

function proximoId(atualId, respostas) {
  let i = ORDEM_TELAS.indexOf(atualId) + 1
  while (i < ORDEM_TELAS.length && !deveExibir(ORDEM_TELAS[i], respostas)) i++
  return ORDEM_TELAS[i] ?? atualId
}

// Cada pergunta: campo onde a resposta é salva, o texto da pergunta, as
// opções (curtas, 2-5 alternativas) e, opcionalmente, uma reação curta que
// aparece antes de avançar (por valor de resposta, ou `_padrao` pra todas).
const perguntasQuiz = {
  'q-attendance': {
    campo: 'attendance',
    pergunta: 'Você vai estar em São Paulo no dia 13 de setembro?',
    opcoes: [
      { valor: 'presencial', texto: 'Sim, quero ir presencialmente' },
      { valor: 'online', texto: 'Não, mas quero ver a transmissão ao vivo' },
    ],
  },
  'q-experience': {
    campo: 'experience',
    pergunta: 'E qual é a sua relação com a dança hoje?',
    opcoes: [
      { valor: 'nao_comecei', texto: 'Ainda não comecei' },
      { valor: 'comecando', texto: 'Estou começando' },
      { valor: 'algum_tempo', texto: 'Já danço há algum tempo' },
      { valor: 'muitos_anos', texto: 'Danço há muitos anos' },
    ],
    reacoes: {
      nao_comecei: 'Ótimo. Você não precisa chegar sabendo um monte de passos para viver essa experiência.',
      comecando: 'Que bom. É um ótimo momento pra já começar com a base certa.',
      algum_tempo: 'Legal. Então você já sente na pele algumas dessas travas, vamos ver quais.',
      muitos_anos: 'Perfeito. A proposta aqui não é simplesmente aumentar seu repertório.',
    },
  },
  'q-danceStyle': {
    campo: 'danceStyle',
    pergunta: 'Qual dança está mais presente na sua vida hoje?',
    opcoes: [
      { valor: 'gafieira', texto: 'Samba de Gafieira' },
      { valor: 'forro', texto: 'Forró' },
      { valor: 'bolero', texto: 'Bolero' },
      { valor: 'sertanejo', texto: 'Sertanejo ou outra' },
      { valor: 'varios', texto: 'Danço vários estilos' },
    ],
    reacoes: {
      _padrao: 'Perfeito. Porque o que vamos trabalhar não fica preso a um único estilo.',
    },
  },
  'q-pain': {
    campo: 'pain',
    pergunta: 'Quando você está dançando, qual dessas cenas mais parece com você?',
    opcoes: [
      { valor: 'pensa_demais', texto: 'Penso demais para acertar' },
      { valor: 'trava', texto: 'Travo quando algo muda' },
      { valor: 'repete', texto: 'Sei passos, mas repito sempre os mesmos' },
      { valor: 'dificuldade_soltar', texto: 'Tenho dificuldade de me soltar e brincar' },
    ],
  },
  'q-reaction': {
    campo: 'reaction',
    pergunta: 'E quando você fica sem saber o que fazer?',
    opcoes: [
      { valor: 'lembrar_passo', texto: 'Tento lembrar algum passo' },
      { valor: 'repetir_conhecido', texto: 'Repito algo que já conheço' },
      { valor: 'esperar_outro', texto: 'Espero o outro resolver' },
      { valor: 'ouvir_musica', texto: 'Tento ouvir a música e me adaptar' },
    ],
  },
  'q-belief': {
    campo: 'belief',
    pergunta: 'Hoje, o que você sente que mais faria sua dança evoluir?',
    opcoes: [
      { valor: 'mais_passos', texto: 'Aprender mais passos' },
      { valor: 'tecnica', texto: 'Melhorar minha técnica' },
      { valor: 'entender_musica', texto: 'Entender melhor a música' },
      { valor: 'confianca', texto: 'Ter mais confiança para me soltar' },
    ],
    reacoes: {
      mais_passos: 'Interessante… guarda essa resposta 👀',
    },
  },
  'q-playfulness': {
    campo: 'playfulness',
    pergunta: 'Você sente que consegue realmente brincar quando dança?',
    opcoes: [
      { valor: 'sim_bastante', texto: 'Sim, bastante' },
      { valor: 'as_vezes', texto: 'Às vezes' },
      { valor: 'muito_pouco', texto: 'Muito pouco' },
      { valor: 'nao_sei', texto: 'Nem sei como fazer isso' },
    ],
  },
  'q-desire': {
    campo: 'desire',
    pergunta: 'Se pudesse sentir UMA coisa diferente na sua dança, qual escolheria?',
    opcoes: [
      { valor: 'liberdade', texto: 'Mais liberdade' },
      { valor: 'seguranca', texto: 'Mais segurança' },
      { valor: 'musicalidade', texto: 'Mais musicalidade' },
      { valor: 'conexao', texto: 'Mais conexão' },
      { valor: 'autenticidade', texto: 'Mais autenticidade' },
    ],
  },
}

// Lista de ids de pergunta aplicáveis para as respostas atuais — usada só
// para calcular a barrinha de progresso discreta dentro do quiz.
function perguntasAplicaveis(respostas) {
  return ORDEM_TELAS.filter(id => id.startsWith('q-') && deveExibir(id, respostas))
}

// ─── Gerador do diagnóstico no WhatsApp ────────────────────────────────────────
// Em vez de centenas de combinações escritas à mão, o texto é montado a
// partir de mapas "valor da resposta → frase" + uma ramificação para o caso
// em que a pessoa já reage de forma saudável (ouve a música e se adapta) —
// nesse caso não faz sentido apontar uma "contradição".

const textoExperiencia = {
  nao_comecei: 'você ainda não começou a dançar',
  comecando: 'você está começando agora na dança',
  algum_tempo: 'você já dança há algum tempo',
  muitos_anos: 'você já dança há bastante tempo',
}

const textoDor = {
  pensa_demais: 'ainda sente que pensa demais na hora de dançar',
  trava: 'ainda trava quando alguma coisa foge do combinado',
  repete: 'sente que repete sempre os mesmos movimentos',
  dificuldade_soltar: 'sente dificuldade de se soltar e brincar',
}

// Variante para quem ainda não começou a dançar: as frases de textoDor usam
// "ainda" e presente contínuo, o que presume experiência real de dança —
// incoerente para quem nunca dançou. Aqui a mesma dor vira uma antecipação.
const textoDorAntecipada = {
  pensa_demais: 'já imagina que vai pensar demais na hora de dançar',
  trava: 'já imagina que vai travar quando alguma coisa fugir do combinado',
  repete: 'já tem medo de ficar repetindo sempre os mesmos poucos movimentos',
  dificuldade_soltar: 'já sente que vai ter dificuldade de se soltar e brincar',
}

const textoReacaoFrase = {
  lembrar_passo: 'você tenta lembrar algum passo conhecido',
  repetir_conhecido: 'você repete algo que já conhece',
  esperar_outro: 'você espera o outro resolver',
  ouvir_musica: 'você tenta ouvir a música e se adaptar',
}

const textoReacaoDependencia = {
  lembrar_passo: 'lembrar o passo certo',
  repetir_conhecido: 'repetir o que já sabe',
  esperar_outro: 'esperar o outro decidir',
}

const textoDesejo = {
  liberdade: 'liberdade',
  seguranca: 'segurança',
  musicalidade: 'musicalidade',
  conexao: 'conexão',
  autenticidade: 'autenticidade',
}

function gerarDiagnostico(r) {
  const aindaNaoComecou = r.experience === 'nao_comecei'
  const exp = textoExperiencia[r.experience] || 'você já tem uma relação com a dança'
  const dor = (aindaNaoComecou ? textoDorAntecipada[r.pain] : textoDor[r.pain])
    || 'sente que falta alguma coisa na sua dança'
  const desejo = textoDesejo[r.desire] || 'mais liberdade'
  const respostaSaudavel = r.reaction === 'ouvir_musica'

  const conector = aindaNaoComecou ? 'e' : 'mas'

  const bloco1 = []
  bloco1.push('Vi uma coisa interessante nas suas respostas…')
  bloco1.push(`Pelo que você me contou, ${exp}, ${conector} ${dor}.`)

  if (r.belief === 'mais_passos') {
    bloco1.push('Você até me disse que acha que precisa aprender mais passos pra evoluir.')
  }

  if (respostaSaudavel) {
    bloco1.push('E o legal é que, quando fica sem saber o que fazer, você já tenta ouvir a música e se adaptar. Isso já é meio caminho andado.')
    bloco1.push(`Só que o que você mais quer sentir é ${desejo}, e sinto que isso ainda não vem por completo.`)
    bloco1.push('Sabe por quê?')
  } else {
    const reacaoFrase = textoReacaoFrase[r.reaction] || 'você tenta se virar do jeito que dá'
    bloco1.push(`E quando fica sem saber o que fazer, ${reacaoFrase}.`)
    bloco1.push(`Só que, ao mesmo tempo, o que você mais quer sentir é ${desejo}.`)
    bloco1.push('Percebe a contradição?')
  }

  const botaoPercepcao = respostaSaudavel ? 'Por quê?' : 'Percebi 👀'

  const bloco2 = respostaSaudavel
    ? [
        'Porque ouvir a música é só o primeiro passo. Sem uma base, isso também tem limite.',
        'Por isso talvez você não precise simplesmente aprender mais passos.',
        'Você precisa desenvolver uma base que continue existindo mesmo quando o passo acaba.',
        'É exatamente aí que entra a Base Musical.',
      ]
    : [
        `Quanto mais a sua dança depende de ${textoReacaoDependencia[r.reaction] || 'repetir o que já sabe'}, mais difícil fica se sentir livre para responder ao que está acontecendo.`,
        'Por isso talvez você não precise simplesmente aprender mais passos.',
        'Você precisa desenvolver uma base que continue existindo mesmo quando o passo acaba.',
        'É exatamente aí que entra a Base Musical.',
      ]

  return { bloco1, botaoPercepcao, bloco2 }
}

// Monta a fila de "eventos" da conversa: mensagens de texto intercaladas com
// pontos de escolha (quick-replies). O evento marcado `final: true` decide o
// que acontece depois (mensagem de fechamento + avança pro método).
function construirEventosConversa(diagnostico) {
  const eventos = []
  diagnostico.bloco1.forEach(texto => eventos.push({ tipo: 'texto', texto }))
  eventos.push({ tipo: 'botoes', opcoes: [{ valor: 'ok', texto: diagnostico.botaoPercepcao }] })
  diagnostico.bloco2.forEach(texto => eventos.push({ tipo: 'texto', texto }))
  eventos.push({
    tipo: 'botoes',
    final: true,
    campo: 'diagnosticoFeedback',
    opcoes: [
      { valor: 'muito', texto: 'Muito' },
      { valor: 'reconheci', texto: 'Sim, me reconheci' },
      { valor: 'entender_melhor', texto: 'Quero entender melhor' },
    ],
  })
  return eventos
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { overflow-x: hidden; }
  body { background: ${C.brown}; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulso {
    0%   { box-shadow: 0 0 0 0 rgba(232,83,74,0.5); }
    70%  { box-shadow: 0 0 0 8px rgba(232,83,74,0); }
    100% { box-shadow: 0 0 0 0 rgba(232,83,74,0); }
  }
  @keyframes piscaDigitando {
    0%, 60%, 100% { opacity: 0.3; }
    30%           { opacity: 1; }
  }
  @keyframes confeteCai {
    from { transform: translateY(-40px) rotate(0deg); opacity: 1; }
    to   { transform: translateY(340px) rotate(360deg); opacity: 0; }
  }

  /* ── bolhas de chat estilo WhatsApp (Tela5WhatsApp) ── */
  .wa-fundo {
    background-color: #E4DDD3;
    background-image:
      radial-gradient(rgba(61,53,48,0.05) 1px, transparent 1px),
      radial-gradient(rgba(61,53,48,0.05) 1px, transparent 1px);
    background-size: 26px 26px;
    background-position: 0 0, 13px 13px;
  }
  .wa-bolha {
    max-width: 82%; position: relative;
    padding: 7px 8px 6px 12px;
    box-shadow: 0 1px 1.5px rgba(0,0,0,0.13);
    animation: fadeUp 0.3s ease both;
  }
  .wa-recebida { align-self: flex-start; background: #FFFFFF; border-radius: 2px 10px 10px 10px; margin-top: 8px; }
  .wa-enviada  { align-self: flex-end;   background: #DCF8C6; border-radius: 10px 2px 10px 10px; margin-top: 8px; }
  .wa-seguida.wa-recebida { border-radius: 10px; margin-top: 2px; }
  .wa-seguida.wa-enviada  { border-radius: 10px; margin-top: 2px; }
  .wa-recebida:not(.wa-seguida)::before {
    content: ''; position: absolute; top: 0; left: -7px; width: 0; height: 0;
    border-style: solid; border-width: 0 8px 10px 0; border-color: transparent #FFFFFF transparent transparent;
  }
  .wa-enviada:not(.wa-seguida)::before {
    content: ''; position: absolute; top: 0; right: -7px; width: 0; height: 0;
    border-style: solid; border-width: 0 0 10px 8px; border-color: transparent transparent #DCF8C6 transparent;
  }
`

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 390)
  useEffect(() => {
    const h = () => setWidth(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return width
}

// ─── Casco comum de cada tela: altura de viewport cheia + fade de entrada ─────

function TelaBase({ children, fundo = C.cream, semPadding = false, mobile }) {
  return (
    <div style={{
      // semPadding hoje só é usado pela tela de WhatsApp: ali a altura
      // precisa ser fixa (não só um mínimo), senão um item flex com
      // overflow:auto ainda cresce pra caber o conteúdo em vez de conter a
      // rolagem, e é a página toda que rola — empurrando o cabeçalho do
      // "chat" pra fora da tela numa conversa mais longa.
      height: semPadding ? '100dvh' : undefined,
      minHeight: semPadding ? undefined : '100dvh',
      background: fundo,
      display: 'flex', flexDirection: 'column',
      padding: semPadding ? 0 : (mobile ? '20px 22px 28px' : '28px 32px 36px'),
      animation: 'fadeUp 0.45s ease both',
      position: 'relative',
    }}>
      {children}
    </div>
  )
}

// Removida de propósito: não revelamos quantas etapas o funil tem — a
// experiência precisa continuar sendo surpresa a cada tela.

function BotaoVoltar({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Voltar" style={{
      position: 'fixed', top: 20, left: 16, zIndex: 301,
      width: 34, height: 34, borderRadius: '50%',
      background: 'rgba(61,53,48,0.35)', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginTop: 16,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function BotaoContinuar({ onClick, children = 'Continuar →', desabilitado = false, cor = 'sage' }) {
  const bg = cor === 'sage'
    ? `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDark} 100%)`
    : C.white
  const texto = cor === 'sage' ? C.white : C.brown
  return (
    <button
      onClick={onClick}
      disabled={desabilitado}
      style={{
        display: 'block', width: '100%', border: 'none',
        background: desabilitado ? 'rgba(138,158,140,0.35)' : bg,
        color: desabilitado ? 'rgba(255,255,255,0.7)' : texto,
        padding: '18px 24px', borderRadius: 100,
        fontFamily: fonteTexto, fontWeight: 700, fontSize: 16,
        cursor: desabilitado ? 'not-allowed' : 'pointer',
        boxShadow: desabilitado ? 'none' : '0 10px 28px rgba(138,158,140,0.35)',
        transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.3s',
        opacity: desabilitado ? 0.6 : 1,
      }}
      onMouseEnter={e => { if (!desabilitado) e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {children}
    </button>
  )
}

// ─── Tela 1 — Promessa forte + deslizar/tocar para iniciar ────────────────────
// Conceito reaproveitado do print de referência (deslizar + "Iniciar Agora"),
// mas a promessa é a mesma linha da headline principal do site, numa versão
// mais direta — ela precisa validar sozinha o resto do funil.

// Barra "arraste para o lado" com física de mola de verdade (motion), no
// conceito do print de referência: um manípulo que a pessoa arrasta até o
// fim da trilha para avançar. Solta antes do fim → volta com efeito elástico.
function ArrastarParaComecar({ onCompletar }) {
  const trilhaRef = useRef(null)
  const [larguraTrilha, setLarguraTrilha] = useState(0)
  const x = useMotionValue(0)
  const [disparado, setDisparado] = useState(false)

  useEffect(() => {
    const medir = () => setLarguraTrilha(trilhaRef.current?.offsetWidth || 0)
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  const TAMANHO_ALCA = 48
  const MARGEM = 4
  const maxArrasto = Math.max(larguraTrilha - TAMANHO_ALCA - MARGEM * 2, 1)

  const preenchimento = useTransform(x, [0, maxArrasto], ['0%', '100%'])
  const opacidadeTexto = useTransform(x, [0, maxArrasto * 0.55], [1, 0])

  const handleDragEnd = () => {
    if (disparado) return
    if (x.get() >= maxArrasto * 0.8) {
      setDisparado(true)
      animate(x, maxArrasto, { type: 'spring', stiffness: 380, damping: 32 })
      setTimeout(onCompletar, 320)
    } else {
      animate(x, 0, { type: 'spring', stiffness: 420, damping: 28 })
    }
  }

  return (
    <div
      ref={trilhaRef}
      style={{
        position: 'relative', height: 56, borderRadius: 100,
        background: C.white, border: `1.5px solid ${C.sageLight}`,
        overflow: 'hidden', marginBottom: 18,
        boxShadow: '0 4px 16px rgba(61,53,48,0.06)',
      }}
    >
      <motion.div style={{
        position: 'absolute', inset: 0, borderRadius: 100,
        background: `linear-gradient(135deg, ${C.sage} 0%, ${C.sageDark} 100%)`,
        width: preenchimento,
      }} />

      <motion.div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: opacidadeTexto, pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: fonteTexto, fontWeight: 600, fontSize: 13.5,
          letterSpacing: '0.4px', color: C.brownLight,
        }}>Arraste para começar →</span>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxArrasto }}
        dragElastic={0.04}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{
          x,
          position: 'absolute', top: MARGEM, left: MARGEM,
          width: TAMANHO_ALCA, height: TAMANHO_ALCA, borderRadius: '50%',
          background: C.brown, cursor: disparado ? 'default' : 'grab',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          touchAction: 'none', boxShadow: '0 4px 12px rgba(61,53,48,0.3)',
        }}
        whileTap={{ scale: 1.08 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  )
}

function Tela1Promessa({ avancar, mobile }) {
  return (
    <TelaBase fundo={`linear-gradient(160deg, ${C.cream} 0%, ${C.creamDark} 100%)`} mobile={mobile}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        maxWidth: 440, margin: '0 auto', width: '100%',
      }}>
        <div style={{
          fontFamily: fonteTitulo, fontStyle: 'italic',
          fontSize: 16, color: C.sageDark, marginBottom: 28,
        }}>Chris Busato</div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: C.sagePale, border: `1px solid ${C.sageLight}`,
          borderRadius: 100, padding: '6px 16px', marginBottom: 24,
          fontFamily: fonteTexto, fontWeight: 600, fontSize: 12.5, color: C.sageDark,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.sage }} />
          Criadora do método Corpo Musical
        </div>

        <h1 style={{
          fontFamily: fonteTitulo,
          fontSize: mobile ? 'clamp(26px, 8vw, 34px)' : 'clamp(32px, 4vw, 44px)',
          color: C.brown, lineHeight: 1.2, letterSpacing: '-0.6px',
          marginBottom: 18,
        }}>
          Você não precisa aprender{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>mais um passo</em>{' '}
          pra dançar bem.
        </h1>

        <p style={{
          fontFamily: fonteTexto, fontWeight: 400,
          fontSize: mobile ? 15.5 : 17, color: C.brownMid, lineHeight: 1.65,
          marginBottom: 8,
        }}>
          Em menos de 2 minutos eu vou te mostrar exatamente o que está te
          travando na pista, e por que decorar mais passos não vai resolver.
        </p>
      </div>

      <div style={{ maxWidth: 440, margin: '0 auto', width: '100%' }}>
        {/* ArrastarParaComecar tirado por pedido — só o botão por enquanto */}
        <BotaoContinuar onClick={avancar}>Iniciar Agora →</BotaoContinuar>
      </div>
    </TelaBase>
  )
}

// ─── Tela 2 — VSL em tela cheia ────────────────────────────────────────────────
// Reaproveita o player da home (mesmo id) como placeholder até termos uma VSL
// própria para o quiz. O botão "Continuar" só aparece depois de alguns
// segundos, pra desencorajar pular o vídeo sem travar quem realmente quer sair.

function Tela2VSL({ avancar, mobile }) {
  const [podeAvancar, setPodeAvancar] = useState(false)
  // Sorteado uma vez só, ao montar — não é pra ficar mudando de número toda
  // hora, só varia de pessoa pra pessoa (prova social, não contador ao vivo).
  const [assistindo] = useState(() => 20 + Math.floor(Math.random() * 31))

  useEffect(() => {
    if (document.querySelector('script[src*="6a120f7fc9941c35508e9807"]')) { setPodeAvancar(false) }
    const s = document.createElement('script')
    s.src = 'https://scripts.converteai.net/1c6e6f27-d6f0-4013-b98a-0067464a2b63/players/6a120f7fc9941c35508e9807/v4/player.js'
    s.async = true
    if (!document.querySelector('script[src*="6a120f7fc9941c35508e9807"]')) document.head.appendChild(s)

    const t = setTimeout(() => setPodeAvancar(true), 12000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'relative', height: '100dvh', width: '100vw',
      overflow: 'hidden', background: '#000',
      animation: 'fadeUp 0.45s ease both',
    }}>
      {/* vídeo em "cover": preenche a tela toda cortando as laterais, em vez
          de ficar centralizado com sobra preta em cima/embaixo. A largura é
          calculada para que a caixa 16:9 sempre cubra tanto a largura quanto
          a altura da viewport — o mesmo cálculo do object-fit: cover. */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 'max(100vw, calc(100dvh * 16 / 9))',
          flexShrink: 0,
        }}>
          <vturb-smartplayer
            id="vid-6a120f7fc9941c35508e9807"
            style={{ display: 'block', width: '100%' }}
          />
        </div>
      </div>

      {/* prova social — número de pessoas assistindo, no topo central */}
      <div style={{
        position: 'absolute', top: mobile ? 18 : 24, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 2,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          borderRadius: 100, padding: '7px 14px',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: C.vivo, flexShrink: 0,
            animation: 'pulso 1.8s ease-out infinite',
          }} />
          <span style={{ fontFamily: fonteTexto, fontWeight: 600, fontSize: 12.5, color: '#fff' }}>
            {assistindo} pessoas estão assistindo ao vivo
          </span>
        </div>
      </div>

      {/* legenda, sem painel escuro atrás (tirado por pedido — parecia uma
          sombra em cima do texto) */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: podeAvancar ? 108 : 28,
        padding: '40px 24px 0',
        transition: 'bottom 0.5s ease',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: fonteTexto, fontWeight: 400, fontSize: 13,
          color: 'rgba(255,255,255,0.85)', textAlign: 'center', paddingBottom: 16,
        }}>Assista até o final. O que vem depois só faz sentido com isso.</p>
      </div>

      {/* botão, sobreposto ao vídeo, só aparece depois do delay */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '24px 22px 28px', maxWidth: 480, margin: '0 auto',
        opacity: podeAvancar ? 1 : 0,
        pointerEvents: podeAvancar ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
      }}>
        <BotaoContinuar onClick={avancar} cor="white">Continuar →</BotaoContinuar>
      </div>
    </div>
  )
}

// ─── Telas 3+4 (substituídas) — Quiz interativo ────────────────────────────────
// No lugar das duas telas estáticas de quebra de crença / inimigo comum: uma
// pequena jornada de perguntas. Cada resposta empurra a pessoa a perceber
// sozinha a dependência do passo — sem nunca dizer isso de forma direta.
// Uma única tela genérica renderiza qualquer pergunta de `perguntasQuiz`.

function TelaPergunta({ id, respostas, onResponder, avancar, voltar, mobile, indiceQuiz, totalQuiz }) {
  const cfg = perguntasQuiz[id]
  const [selecionado, setSelecionado] = useState(respostas[cfg.campo] || null)
  const [reacao, setReacao] = useState(null)
  const [pensando, setPensando] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    setSelecionado(respostas[cfg.campo] || null)
    setReacao(null)
    setPensando(false)
    return () => clearTimeout(timerRef.current)
  }, [id])

  const escolher = opcao => {
    setSelecionado(opcao.valor)
    onResponder(cfg.campo, opcao.valor)
    clearTimeout(timerRef.current)
    setReacao(null)

    const textoReacao = cfg.reacoes?.[opcao.valor] ?? cfg.reacoes?._padrao ?? null
    if (!textoReacao) {
      setPensando(false)
      timerRef.current = setTimeout(avancar, 450)
      return
    }

    // Em vez de estampar a respostinha verde na hora (ficava abrupto), uma
    // pausa curta com os pontinhos de "pensando" antes dela aparecer — o
    // mesmo respiro que a tela de WhatsApp já usa pro "digitando...".
    setPensando(true)
    timerRef.current = setTimeout(() => {
      setPensando(false)
      setReacao(textoReacao)
      timerRef.current = setTimeout(avancar, 1500)
    }, 600)
  }

  return (
    <TelaBase fundo={C.cream} mobile={mobile}>
      <BotaoVoltar onClick={voltar} />

      {/* barra discreta só do trecho de perguntas — não revela o funil todo,
          só o andamento dentro do quiz, que aqui é esperado como um quiz. */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'rgba(138,158,140,0.15)', zIndex: 299 }}>
        <div style={{
          height: '100%', borderRadius: '0 3px 3px 0',
          width: `${(indiceQuiz / totalQuiz) * 100}%`,
          background: C.sage, transition: 'width 0.4s ease',
        }} />
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', maxWidth: 460, margin: '0 auto', width: '100%',
        paddingTop: 60,
      }}>
        <h2 style={{
          fontFamily: fonteTexto, fontWeight: 700,
          fontSize: mobile ? 'clamp(20px, 6vw, 24px)' : 25,
          color: C.brown, lineHeight: 1.38, marginBottom: 26, textAlign: 'center',
        }}>{cfg.pergunta}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cfg.opcoes.map(opcao => {
            const ativo = selecionado === opcao.valor
            return (
              <button key={opcao.valor} onClick={() => escolher(opcao)} style={{
                textAlign: 'left', cursor: 'pointer', width: '100%',
                background: ativo ? C.sageDark : C.white,
                border: `1.5px solid ${ativo ? C.sageDark : C.sageLight}`,
                borderRadius: 14, padding: '16px 18px',
                fontFamily: fonteTexto, fontWeight: 600, fontSize: 15,
                color: ativo ? C.white : C.brown,
                transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
                transform: ativo ? 'scale(0.98)' : 'scale(1)',
              }}>{opcao.texto}</button>
            )
          })}
        </div>

        {pensando && (
          <div style={{
            marginTop: 20, padding: '14px 16px',
            background: C.sagePale, border: `1px solid ${C.sageLight}`, borderRadius: 12,
            display: 'flex', gap: 4, animation: 'fadeUp 0.3s ease both',
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: C.sageDark,
                animation: `piscaDigitando 1.2s ${i * 0.2}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        )}

        {reacao && (
          <div style={{
            marginTop: 20, padding: '14px 16px',
            background: C.sagePale, border: `1px solid ${C.sageLight}`, borderRadius: 12,
            animation: 'fadeUp 0.35s ease both',
          }}>
            <span style={{ fontFamily: fonteTexto, fontSize: 13.5, color: C.sageDark, lineHeight: 1.55 }}>{reacao}</span>
          </div>
        )}
      </div>
    </TelaBase>
  )
}

// ─── Tela 5 — Simulação animada de WhatsApp (diagnóstico personalizado) ──────
// A conversa não é mais um roteiro fixo: é montada a partir das respostas do
// quiz (gerarDiagnostico + construirEventosConversa, definidos mais acima).
// Continua parecendo WhatsApp: mensagens da Chris chegando com "digitando...",
// intercaladas com quick-replies (como o "Percebi 👀") — ao tocar numa opção,
// ela vira uma bolha verde à direita, como se a pessoa tivesse mandado
// aquilo mesmo, simulando uma conversa real (não só clique em botão).

function horaAgora() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function Tela5WhatsApp({ respostas, onResponder, avancar, voltar, mobile }) {
  const eventos = useMemo(() => construirEventosConversa(gerarDiagnostico(respostas)), [respostas])

  const [indice, setIndice] = useState(0)
  const [mensagensVisiveis, setMensagensVisiveis] = useState([])
  const [digitando, setDigitando] = useState(false)
  const [finalizando, setFinalizando] = useState(false)
  const [mostrarCTA, setMostrarCTA] = useState(false)
  const fimRef = useRef(null)

  const eventoAtual = eventos[indice]
  const aguardandoBotoes = !finalizando && eventoAtual && eventoAtual.tipo === 'botoes' ? eventoAtual : null

  const ehPresencial = respostas.attendance === 'presencial'
  const textoCTA = ehPresencial
    ? 'Já vou deixar tudo certinho pra você viver isso presencialmente com a gente, dia 13.'
    : 'Já vou deixar tudo certinho pra você viver isso ao vivo, pela transmissão, dia 13.'
  const textoBotaoCTA = ehPresencial ? 'Quero viver isso presencialmente →' : 'Quero viver isso na transmissão →'

  useEffect(() => {
    if (!eventoAtual || eventoAtual.tipo === 'botoes') return
    setDigitando(true)
    const atraso = indice === 0 ? 700 : 1300
    const t = setTimeout(() => {
      setDigitando(false)
      setMensagensVisiveis(v => [...v, { ...eventoAtual, origem: 'chris', hora: horaAgora() }])
      setIndice(i => i + 1)
    }, atraso)
    return () => clearTimeout(t)
  }, [indice, eventoAtual])

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [mensagensVisiveis, digitando, aguardandoBotoes])

  const escolherBotao = opcao => {
    // A opção escolhida vira uma bolha verde à direita, com hora e tique de
    // lida — como se a pessoa tivesse realmente mandado essa mensagem — em
    // vez de só sumir o botão e a conversa seguir sozinha.
    setMensagensVisiveis(v => [...v, { texto: opcao.texto, origem: 'usuario', hora: horaAgora() }])

    if (aguardandoBotoes.campo) onResponder(aguardandoBotoes.campo, opcao.valor)

    if (aguardandoBotoes.final) {
      // Fecha em 3 tempos (resposta → respiro → CTA) em vez de já sumir a
      // tela na resposta seguinte — a conversa "desacelera" até parar, com
      // um convite direto pra vivência (no formato que a pessoa escolheu)
      // no lugar de cortar seco pro próximo bloco do funil.
      setFinalizando(true)
      const respostaFinal = opcao.valor === 'entender_melhor'
        ? 'Então bora entender direitinho como isso funciona.'
        : (opcao.valor === 'muito' ? 'Que bom! 🙂' : 'Faz muito sentido, viu?')
      setDigitando(true)
      setTimeout(() => {
        setDigitando(false)
        setMensagensVisiveis(v => [...v, { texto: respostaFinal, origem: 'chris', hora: horaAgora() }])
        setTimeout(() => {
          setDigitando(true)
          setTimeout(() => {
            setDigitando(false)
            setMensagensVisiveis(v => [...v, { texto: textoCTA, origem: 'chris', hora: horaAgora() }])
            setMostrarCTA(true)
          }, 1200)
        }, 900)
      }, 1100)
    } else {
      setIndice(i => i + 1)
    }
  }

  return (
    <TelaBase fundo="#E4DDD3" semPadding mobile={mobile}>
      {/* cabeçalho estilo WhatsApp */}
      <div style={{
        background: C.sageDark, padding: mobile ? '46px 16px 14px' : '52px 24px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={voltar} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <img src={chrisSorrindo} alt="Chris Busato" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <div style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 15, color: '#fff' }}>Chris Busato</div>
          <div style={{ fontFamily: fonteTexto, fontSize: 11.5, color: 'rgba(255,255,255,0.75)' }}>
            {digitando ? 'digitando...' : 'online'}
          </div>
        </div>
      </div>

      {/* conversa — minHeight:0 é essencial aqui: sem isso, um item flex com
          overflow:auto ainda cresce pra caber todo o conteúdo (em vez de
          conter a rolagem internamente), e é a página toda que rola,
          empurrando o cabeçalho pra fora da tela numa conversa longa. */}
      <div className="wa-fundo" style={{
        flex: 1, minHeight: 0, overflowY: 'auto', padding: mobile ? '14px 12px' : '20px 22px',
        display: 'flex', flexDirection: 'column',
      }}>
        {mensagensVisiveis.map((m, i) => {
          const minha = m.origem === 'usuario'
          const seguida = i > 0 && mensagensVisiveis[i - 1].origem === m.origem
          return (
            <div key={i} className={`wa-bolha ${minha ? 'wa-enviada' : 'wa-recebida'} ${seguida ? 'wa-seguida' : ''}`}>
              <span style={{ fontFamily: fonteTexto, fontSize: 14.5, color: C.brown, lineHeight: 1.5 }}>{m.texto}</span>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3, marginTop: 2, marginLeft: 10 }}>
                <span style={{ fontFamily: fonteTexto, fontSize: 10.5, color: 'rgba(61,53,48,0.45)' }}>{m.hora}</span>
                {minha && (
                  <svg width="14" height="10" viewBox="0 0 16 11" fill="none">
                    <path d="M1 5.5L4.5 9L11 1.5" stroke="#53BDEB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.5 5.5L9 9L15.5 1.5" stroke="#53BDEB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
          )
        })}

        {digitando && (
          <div className="wa-bolha wa-recebida" style={{ display: 'flex', gap: 4, padding: '11px 14px' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: C.brownLight,
                animation: `piscaDigitando 1.2s ${i * 0.2}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        )}

        {/* quick-replies — pausam a conversa até a pessoa tocar numa opção */}
        {aguardandoBotoes && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14, animation: 'fadeUp 0.3s ease both' }}>
            {aguardandoBotoes.opcoes.map(opcao => (
              <button key={opcao.valor} onClick={() => escolherBotao(opcao)} style={{
                background: '#fff', border: `1.5px solid ${C.sageDark}`, borderRadius: 100,
                padding: '10px 18px', cursor: 'pointer',
                fontFamily: fonteTexto, fontWeight: 600, fontSize: 13.5, color: C.sageDark,
              }}>{opcao.texto}</button>
            ))}
          </div>
        )}

        {/* CTA de fechamento — convite pra vivência, no formato que a pessoa
            já escolheu, em vez de simplesmente sumir a tela na sequência. */}
        {mostrarCTA && (
          <button onClick={avancar} style={{
            marginTop: 16, alignSelf: 'stretch',
            background: C.sageDark, border: 'none', borderRadius: 100,
            padding: '15px 20px', cursor: 'pointer',
            fontFamily: fonteTexto, fontWeight: 700, fontSize: 14.5, color: '#fff',
            boxShadow: '0 6px 18px rgba(107,127,109,0.35)',
            animation: 'fadeUp 0.4s ease both',
          }}>{textoBotaoCTA}</button>
        )}
        <div ref={fimRef} />
      </div>

      {/* barra de digitação — só decorativa, dá o clima de app de verdade */}
      <div style={{
        background: '#F0EDE8', padding: mobile ? '8px 12px' : '10px 22px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          flex: 1, background: '#fff', borderRadius: 22, padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 16, opacity: 0.55 }}>🙂</span>
          <span style={{ fontFamily: fonteTexto, fontSize: 14, color: C.brownLight }}>Mensagem</span>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: '50%', background: C.sageDark,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 11l18-8-8 18-2-8-8-2z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </TelaBase>
  )
}

// ─── Tela 6 — O método (sem vs. com) ────────────────────────────────────────────
// Também é onde inserimos data/local do evento, como combinado.

function Tela6Metodo({ avancar, voltar, mobile }) {
  return (
    <TelaBase fundo={C.cream} mobile={mobile}>
      <BotaoVoltar onClick={voltar} />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', maxWidth: 460, margin: '0 auto', width: '100%',
        paddingTop: 56,
      }}>
        <div style={{
          fontFamily: fonteTexto, fontWeight: 600, fontSize: 11.5,
          letterSpacing: '2px', textTransform: 'uppercase', color: C.sageDark,
          marginBottom: 14, textAlign: 'center',
        }}>O método Corpo Musical</div>

        <h2 style={{
          fontFamily: fonteTitulo, fontSize: mobile ? 'clamp(22px, 6.5vw, 27px)' : 29,
          color: C.brown, lineHeight: 1.25, marginBottom: 26, textAlign: 'center',
        }}>
          Não são mais passos.{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>É outra base.</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          <div style={{
            background: 'rgba(232,83,74,0.06)', border: '1px solid rgba(232,83,74,0.25)',
            borderRadius: 16, padding: '18px 20px',
          }}>
            <div style={{
              fontFamily: fonteTexto, fontWeight: 800, fontSize: 11.5,
              letterSpacing: '1px', color: C.vivo, marginBottom: 12,
            }}>SEM UMA BASE MUSICAL</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Decora', 'Lembra', 'Executa', 'Repete', 'Trava quando algo muda'].map((t, i) => (
                <span key={i} style={{
                  fontFamily: fonteTexto, fontWeight: 500, fontSize: 13.5, color: C.brownMid,
                  background: C.white, border: '1px solid rgba(232,83,74,0.2)',
                  borderRadius: 100, padding: '6px 13px',
                }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{
            background: C.sagePale, border: `1px solid ${C.sage}`,
            borderRadius: 16, padding: '18px 20px',
          }}>
            <div style={{
              fontFamily: fonteTexto, fontWeight: 800, fontSize: 11.5,
              letterSpacing: '1px', color: C.sageDark, marginBottom: 12,
            }}>COM UMA BASE MUSICAL</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Escuta', 'Percebe', 'Escolhe', 'Adapta', 'Combina', 'Brinca'].map((t, i) => (
                <span key={i} style={{
                  fontFamily: fonteTexto, fontWeight: 600, fontSize: 13.5, color: C.brown,
                  background: C.white, border: `1px solid ${C.sage}`,
                  borderRadius: 100, padding: '6px 13px',
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <p style={{
          fontFamily: fonteTitulo, fontStyle: 'italic',
          fontSize: mobile ? 16 : 17.5, color: C.brown, lineHeight: 1.5,
          textAlign: 'center', marginBottom: 0,
        }}>
          Você continua tendo passos.{' '}
          <span style={{ color: C.sageDark }}>Só deixa de depender deles para conseguir dançar.</span>
        </p>
      </div>

      <div style={{ maxWidth: 460, margin: '0 auto', width: '100%' }}>
        <BotaoContinuar onClick={avancar} />
      </div>
    </TelaBase>
  )
}

// ─── Tela — Confirmação (define a oferta final antes do voucher) ─────────────
// Quem escolheu presencial no início confirma endereço/horário aqui — e pode
// mudar pra transmissão nesse momento (last-minute). Quem escolheu online já
// vem direto pra transmissão, sem repetir perguntas de logística.

function TelaConfirmacao({ respostas, onResponder, avancar, voltar, mobile }) {
  const ehPresencial = respostas.attendance === 'presencial'

  // Quem veio como "online" não tem pergunta aqui — a oferta já é a
  // transmissão. Define isso assim que a tela monta.
  useEffect(() => {
    if (!ehPresencial) onResponder('ofertaFinal', 'transmissao')
  }, [ehPresencial])

  const confirmar = valor => {
    onResponder('ofertaFinal', valor)
    avancar()
  }

  return (
    <TelaBase fundo={C.cream} mobile={mobile}>
      <BotaoVoltar onClick={voltar} />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', maxWidth: 460, margin: '0 auto', width: '100%',
        paddingTop: 60,
      }}>
        {ehPresencial ? (
          <>
            <h2 style={{
              fontFamily: fonteTitulo, fontSize: mobile ? 'clamp(21px, 6vw, 25px)' : 26,
              color: C.brown, lineHeight: 1.3, marginBottom: 22, textAlign: 'center',
            }}>
              Vamos confirmar uma coisa importante antes de liberar seu voucher:
            </h2>

            <div style={{
              background: C.white, border: `1px solid ${C.sageLight}`,
              borderRadius: 16, padding: '18px 20px', marginBottom: 24,
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" stroke={C.sageDark} strokeWidth="1.7" strokeLinejoin="round" />
                  <circle cx="12" cy="9.5" r="2.4" stroke={C.sageDark} strokeWidth="1.7" />
                </svg>
                <div>
                  <div style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 14.5, color: C.brown, marginBottom: 2 }}>{LOCAL_PRESENCIAL_NOME}</div>
                  <div style={{ fontFamily: fonteTexto, fontSize: 13, color: C.brownMid, lineHeight: 1.5 }}>{LOCAL_PRESENCIAL_ENDERECO}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="3" y="5" width="18" height="16" rx="2.2" stroke={C.sageDark} strokeWidth="1.7" />
                  <path d="M3 9.5h18M8 3v4M16 3v4" stroke={C.sageDark} strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <span style={{ fontFamily: fonteTexto, fontWeight: 600, fontSize: 14, color: C.brown }}>
                  {DATA_EVENTO} · {HORARIO_EVENTO}
                </span>
              </div>
            </div>

            <p style={{
              fontFamily: fonteTexto, fontWeight: 600, fontSize: 15.5, color: C.brown,
              textAlign: 'center', marginBottom: 18,
            }}>Você consegue estar com a gente nesse local e horário?</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => confirmar('presencial')} style={{
                textAlign: 'left', cursor: 'pointer', width: '100%',
                background: C.sageDark, border: `1.5px solid ${C.sageDark}`,
                borderRadius: 14, padding: '16px 18px',
                fontFamily: fonteTexto, fontWeight: 700, fontSize: 15, color: C.white,
              }}>Sim, confirmado</button>
              <button onClick={() => confirmar('transmissao')} style={{
                textAlign: 'left', cursor: 'pointer', width: '100%',
                background: C.white, border: `1.5px solid ${C.sageLight}`,
                borderRadius: 14, padding: '16px 18px',
                fontFamily: fonteTexto, fontWeight: 600, fontSize: 15, color: C.brown,
              }}>Prefiro participar pela transmissão</button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{
              fontFamily: fonteTitulo, fontSize: mobile ? 'clamp(22px, 6.5vw, 26px)' : 27,
              color: C.brown, lineHeight: 1.3, marginBottom: 20, textAlign: 'center',
            }}>
              Sua participação será pela{' '}
              <em style={{ color: C.sageDark, fontStyle: 'italic' }}>transmissão ao vivo</em>{' '}
              da própria vivência.
            </h2>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: C.brown, borderRadius: 12, padding: '13px 16px', marginBottom: 26,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <rect x="3" y="5" width="18" height="16" rx="2.2" stroke={C.sageLight} strokeWidth="1.8" />
                <path d="M3 9.5h18M8 3v4M16 3v4" stroke={C.sageLight} strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: fonteTexto, fontWeight: 600, fontSize: 13, color: C.cream }}>
                {DATA_EVENTO} · {HORARIO_EVENTO}
              </span>
            </div>

            <BotaoContinuar onClick={avancar} />
          </>
        )}
      </div>
    </TelaBase>
  )
}

// ─── Tela 7 — Escassez + resgate de voucher ────────────────────────────────────
// A barra de vagas é a MESMA do site principal (mesmo evento, mesma API real
// /api/vagas-presencial) — não é um número inventado para o funil.
// O "desconto" revelado no flip não é um preço extra: é o preço que já é
// promocional no site (R$120 / R$67), só que quem vem de tráfego frio nunca
// viu a âncora original — por isso funciona como "desbloqueio".

function useVagasPresencial() {
  const [dados, setDados] = useState(null)
  useEffect(() => {
    let ativo = true
    fetch('/api/vagas-presencial').then(r => r.json()).then(d => {
      if (ativo && d && !d.indisponivel) setDados(d)
    }).catch(() => {})
    return () => { ativo = false }
  }, [])
  return dados
}

function Tela7Voucher({ oferta, avancar, voltar, mobile }) {
  const [resgatado, setResgatado] = useState(false)
  const [restamSeg, setRestamSeg] = useState(15 * 60)
  const vagas = useVagasPresencial()

  const ehPresencial = oferta === 'presencial'
  const nomeOferta = ehPresencial ? 'Presencial' : 'Transmissão ao vivo'
  const precoOferta = ehPresencial ? 'R$120' : 'R$67'
  const precoDe = ehPresencial ? 'R$480' : 'R$268' // âncora: preço "de" = preço atual ÷ 0,25 (75% off)

  useEffect(() => {
    if (resgatado) return
    const t = setInterval(() => setRestamSeg(s => Math.max(s - 1, 0)), 1000)
    return () => clearInterval(t)
  }, [resgatado])

  const min = String(Math.floor(restamSeg / 60)).padStart(2, '0')
  const seg = String(restamSeg % 60).padStart(2, '0')

  // Fundo liso (em vez do gradiente de antes) de propósito: as reentrâncias
  // do "bilhete" só enganam o olho se a cor da reentrância bater exatamente
  // com o que está atrás do card — com gradiente, a cor varia por posição.
  const FUNDO_TELA = '#332B26'
  const ALTURA_TALAO = 92 // faixa do código de barras, destacada por uma linha picotada

  const barraCodigo = (
    <div style={{
      width: '100%', height: 34, borderRadius: 3,
      backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0px, currentColor 2px, transparent 2px, transparent 4px, currentColor 4px, currentColor 5px, transparent 5px, transparent 8px, currentColor 8px, currentColor 9px, transparent 9px, transparent 10px, currentColor 10px, currentColor 13px, transparent 13px, transparent 15px)',
      backgroundSize: '46px 100%', backgroundRepeat: 'repeat-x',
    }} />
  )

  return (
    <TelaBase fundo={FUNDO_TELA} mobile={mobile}>
      <BotaoVoltar onClick={voltar} />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        maxWidth: 420, margin: '0 auto', width: '100%', paddingTop: 56,
      }}>
        <div style={{
          fontFamily: fonteTexto, fontWeight: 700, fontSize: 12, letterSpacing: '1.5px',
          textTransform: 'uppercase', color: C.sageLight, marginBottom: 8,
        }}>1º Lote · Vagas Limitadas</div>

        {vagas && !vagas.esgotado && (
          <p style={{ fontFamily: fonteTexto, fontWeight: 500, fontSize: 13.5, color: 'rgba(237,234,227,0.75)', marginBottom: 20 }}>
            {vagas.percentual}% das vagas já preenchidas
          </p>
        )}

        {/* card do voucher — formato de bilhete/ingresso: reentrâncias
            circulares nas laterais + linha picotada separando o talão do
            código de barras, igual um ingresso físico de verdade. */}
        <div
          onClick={() => !resgatado && setResgatado(true)}
          style={{
            position: 'relative', width: '100%', maxWidth: 280, height: 336,
            perspective: 1000, cursor: resgatado ? 'default' : 'pointer', marginBottom: 26,
          }}
        >
          <div style={{
            position: 'relative', width: '100%', height: '100%',
            transformStyle: 'preserve-3d', transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
            transform: resgatado ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}>
            {/* frente */}
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              background: C.sagePale, borderRadius: 20,
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              border: `2px solid ${C.sage}`,
            }}>
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 14, padding: '10px 20px',
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%', background: C.sage,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: resgatado ? 'none' : 'pulso 2s ease-out infinite',
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M20 12v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7M2 7h20v5H2V7zM12 22V7M12 7c-1.5 0-4-1-4-3.2C8 2 9 1 10.2 1 12 1 12 4 12 7zM12 7c1.5 0 4-1 4-3.2C16 2 15 1 13.8 1 12 1 12 4 12 7z" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 15, color: C.brown }}>Toque para resgatar seu voucher</span>
              </div>

              {/* talão inferior — código de barras já insinuado, meio apagado */}
              <div style={{
                position: 'relative', height: ALTURA_TALAO, flexShrink: 0,
                borderTop: `2px dashed ${C.sage}`, display: 'flex', alignItems: 'center',
                padding: '0 26px', color: C.sage, opacity: 0.45,
              }}>
                {barraCodigo}
                <span style={{ position: 'absolute', left: 0, top: -11, width: 22, height: 22, borderRadius: '50%', background: FUNDO_TELA }} />
                <span style={{ position: 'absolute', right: 0, top: -11, width: 22, height: 22, borderRadius: '50%', background: FUNDO_TELA }} />
              </div>
            </div>

            {/* verso */}
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)', background: C.white, borderRadius: 20,
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              border: `2px solid ${C.sage}`,
            }}>
              <div style={{
                position: 'relative', flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 18px', overflow: 'hidden',
              }}>
                {resgatado && Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} style={{
                    position: 'absolute', top: 0, left: `${(i * 37) % 100}%`,
                    width: 6, height: 10, background: [C.sage, C.vivo, C.brownLight][i % 3],
                    animation: `confeteCai ${1.4 + (i % 5) * 0.2}s ${i * 0.06}s ease-in both`,
                  }} />
                ))}
                <span style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 13, color: C.sageDark }}>Voucher resgatado! 🎉</span>
                <span style={{ fontFamily: fonteTexto, fontWeight: 500, fontSize: 13, color: C.brownMid, marginTop: 4 }}>{nomeOferta} · preço de 1º lote</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2 }}>
                  <span style={{ fontFamily: fonteTexto, fontWeight: 600, fontSize: 14.5, color: C.brownLight, textDecoration: 'line-through' }}>{precoDe}</span>
                  <span style={{
                    fontFamily: fonteTexto, fontWeight: 800, fontSize: 10.5, letterSpacing: '0.3px',
                    color: '#fff', background: C.vivo, borderRadius: 100, padding: '2px 8px',
                  }}>-75%</span>
                </div>
                <span style={{ fontFamily: fonteTexto, fontWeight: 800, fontSize: 30, color: C.brown }}>{precoOferta}</span>
              </div>

              {/* talão inferior — código de barras nítido, é o "ingresso" em si */}
              <div style={{
                position: 'relative', height: ALTURA_TALAO, flexShrink: 0,
                borderTop: `2px dashed ${C.sageLight}`, display: 'flex', alignItems: 'center',
                padding: '0 26px', color: C.brown,
              }}>
                {barraCodigo}
                <span style={{ position: 'absolute', left: 0, top: -11, width: 22, height: 22, borderRadius: '50%', background: FUNDO_TELA }} />
                <span style={{ position: 'absolute', right: 0, top: -11, width: 22, height: 22, borderRadius: '50%', background: FUNDO_TELA }} />
              </div>
            </div>
          </div>
        </div>

        {resgatado && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: fonteTexto, fontWeight: 600, fontSize: 13, color: C.vivo, marginBottom: 6,
          }}>
            Garantido por mais {min}:{seg} min
          </div>
        )}
      </div>

      <div style={{
        maxHeight: resgatado ? 90 : 0, overflow: 'hidden', transition: 'max-height 0.5s ease',
        maxWidth: 420, margin: '0 auto', width: '100%',
      }}>
        <BotaoContinuar onClick={avancar}>Finalizar Acesso →</BotaoContinuar>
      </div>
    </TelaBase>
  )
}

// ─── Tela 8 — Prova concreta ───────────────────────────────────────────────────
// Checklist e feedbacks reaproveitados 1:1 do site principal. Fotos/vídeos da
// vivência acontecendo no espaço novo ainda não existem — assim que a Chris
// mandar o material, entra aqui embaixo dos feedbacks.

const entregaveis = [
  'Tudo do acesso online',
  'Vivência presencial com Chris Busato',
  'Prática ao vivo com música',
  'Exercícios em dupla e em grupo',
  'Interação direta e feedback em tempo real',
  'Você sai sabendo brincar dentro da música, não só seguir ela',
]

const feedbacksQuiz = [feedbac1, feedbac2, feedbac3, feedbac4, feedback10, feedback11]

function Tela8Prova({ avancar, voltar, mobile }) {
  return (
    <TelaBase fundo={C.creamCard} mobile={mobile}>
      <BotaoVoltar onClick={voltar} />
      <div style={{ flex: 1, maxWidth: 480, margin: '0 auto', width: '100%', paddingTop: 56, overflowY: 'auto' }}>
        <h2 style={{
          fontFamily: fonteTitulo, fontSize: mobile ? 'clamp(22px, 6.5vw, 27px)' : 29,
          color: C.brown, lineHeight: 1.25, marginBottom: 22, textAlign: 'center',
        }}>
          O que você leva{' '}
          <em style={{ color: C.sageDark, fontStyle: 'italic' }}>com você.</em>
        </h2>

        <div style={{ marginBottom: 30 }}>
          {entregaveis.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 11,
              padding: '11px 0',
              borderBottom: i < entregaveis.length - 1 ? `1px solid ${C.sageLight}` : 'none',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="8" cy="8" r="7" stroke={C.sage} strokeWidth="1.2" />
                <path d="M5 8l2 2 4-4" stroke={C.sageDark} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: fonteTexto, fontSize: 14.5, color: C.brownMid, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{
          fontFamily: fonteTexto, fontWeight: 600, fontSize: 11, letterSpacing: '2px',
          textTransform: 'uppercase', color: C.sageDark, marginBottom: 14, textAlign: 'center',
        }}>Quem já viveu</div>

        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 20, marginLeft: -22, marginRight: -22, paddingLeft: 22, paddingRight: 22 }}>
          {feedbacksQuiz.map((src, i) => (
            <img key={i} src={src} alt={`Feedback ${i + 1}`} style={{
              height: 220, borderRadius: 12, border: `1px solid ${C.sageLight}`,
              flexShrink: 0, boxShadow: '0 8px 20px rgba(61,53,48,0.10)',
            }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <BotaoContinuar onClick={avancar}>Ver minha oferta →</BotaoContinuar>
      </div>
    </TelaBase>
  )
}

// ─── Tela 9 — Oferta final ──────────────────────────────────────────────────────

const faqsQuiz = [
  {
    q: 'E se eu não gostar? Tenho garantia?',
    a: 'Tem sim. Você conta com uma garantia incondicional de 7 dias, protegida por lei. Se por qualquer motivo a experiência não for para você, é só pedir o reembolso dentro desse prazo e devolvemos 100% do valor, sem burocracia.',
  },
  {
    q: 'Como funciona a inscrição?',
    a: 'Após confirmar o pagamento, você recebe as informações completas sobre data, horário e local da vivência. Vagas são limitadas para garantir a qualidade da experiência.',
  },
  {
    q: 'Preciso ter experiência em dança?',
    a: 'Não necessariamente. A vivência foi pensada para acolher pessoas em diferentes momentos da jornada com a dança, desde quem está começando até quem já tem mais experiência.',
  },
]

function FaqItemQuiz({ item }) {
  const [aberto, setAberto] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${C.sageLight}` }}>
      <button onClick={() => setAberto(v => !v)} style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        padding: '15px 0', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', gap: 12, textAlign: 'left',
      }}>
        <span style={{ fontFamily: fonteTexto, fontWeight: 600, fontSize: 14, color: aberto ? C.sageDark : C.brown }}>{item.q}</span>
        <span style={{
          flexShrink: 0, fontSize: 18, color: C.sage,
          transform: aberto ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s',
        }}>+</span>
      </button>
      {aberto && (
        <p style={{ fontFamily: fonteTexto, fontSize: 13.5, color: C.brownMid, lineHeight: 1.65, paddingBottom: 16 }}>{item.a}</p>
      )}
    </div>
  )
}

function Tela9Oferta({ ofertaInicial, voltar, mobile }) {
  // Já vem pré-selecionada com o que a pessoa decidiu no quiz — mas continua
  // trocável aqui, caso ela mude de ideia na última hora.
  const [escolha, setEscolha] = useState(ofertaInicial || 'presencial')
  const url = escolha === 'presencial' ? CHECKOUT_PRESENCIAL : CHECKOUT_TRANSMISSAO

  return (
    <TelaBase fundo={C.cream} mobile={mobile}>
      <BotaoVoltar onClick={voltar} />
      <div style={{ flex: 1, maxWidth: 480, margin: '0 auto', width: '100%', paddingTop: 56, overflowY: 'auto' }}>
        <h2 style={{
          fontFamily: fonteTitulo, fontSize: mobile ? 'clamp(22px, 6.5vw, 27px)' : 29,
          color: C.brown, lineHeight: 1.25, marginBottom: 6, textAlign: 'center',
        }}>Escolha como participar</h2>
        <p style={{ fontFamily: fonteTexto, fontSize: 13, color: C.brownMid, textAlign: 'center', marginBottom: 22 }}>
          13 de setembro · 10h às 14h
        </p>

        {/* opção presencial */}
        <button onClick={() => setEscolha('presencial')} style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 12,
          background: escolha === 'presencial' ? C.sagePale : C.white,
          border: `1.5px solid ${escolha === 'presencial' ? C.sageDark : C.sageLight}`,
          borderRadius: 16, padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 15, color: C.brown }}>Presencial</span>
            <span style={{ fontFamily: fonteTexto, fontWeight: 800, fontSize: 19, color: C.brown }}>R$120</span>
          </div>
          <span style={{ fontFamily: fonteTexto, fontSize: 13, color: C.brownMid, lineHeight: 1.5 }}>
            Vivência ao vivo com a Chris, em São Paulo.
          </span>
        </button>

        {/* opção transmissão */}
        <button onClick={() => setEscolha('transmissao')} style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 24,
          background: escolha === 'transmissao' ? C.sagePale : C.white,
          border: `1.5px solid ${escolha === 'transmissao' ? C.sageDark : C.sageLight}`,
          borderRadius: 16, padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 15, color: C.brown }}>Transmissão ao vivo</span>
            <span style={{ fontFamily: fonteTexto, fontWeight: 800, fontSize: 19, color: C.brown }}>R$67</span>
          </div>
          <span style={{ fontFamily: fonteTexto, fontSize: 13, color: C.brownMid, lineHeight: 1.5 }}>
            Participe de onde estiver, ao vivo pela internet.
          </span>
        </button>

        <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: 28 }}>
          <BotaoContinuar onClick={() => {}}>Garantir minha vaga →</BotaoContinuar>
        </a>

        {/* garantia */}
        <div style={{
          display: 'flex', gap: 14, alignItems: 'center',
          background: C.creamCard, border: `1px solid ${C.sageLight}`,
          borderRadius: 16, padding: '18px 20px', marginBottom: 24,
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 2.5l7 3v5.5c0 4.6-3 7.9-7 9.5-4-1.6-7-4.9-7-9.5V5.5l7-3z" stroke={C.sageDark} strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M8.5 12l2.4 2.4L15.8 9.5" stroke={C.sageDark} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{ fontFamily: fonteTexto, fontWeight: 700, fontSize: 14, color: C.brown, marginBottom: 3 }}>Garantia de 7 dias</div>
            <div style={{ fontFamily: fonteTexto, fontSize: 12.5, color: C.brownMid, lineHeight: 1.5 }}>
              Não gostou? Devolvemos 100% do valor, sem burocracia.
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 26 }}>
          {faqsQuiz.map((item, i) => <FaqItemQuiz key={i} item={item} />)}
        </div>

        {/* WhatsApp — abre via window.open() em vez de <a href> estático:
            um script de tracking do site (parte do pacote UTMify) varre e
            reescreve todo link wa.me no DOM, corrompendo a mensagem. */}
        <a
          href={WHATSAPP_LINK}
          onClick={e => { e.preventDefault(); window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer') }}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            background: '#25D366', color: '#fff', textDecoration: 'none',
            padding: '15px 20px', borderRadius: 100, marginBottom: 30,
            fontFamily: fonteTexto, fontWeight: 600, fontSize: 14.5,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0012.05 0z" />
          </svg>
          Falar com a gente no WhatsApp
        </a>
      </div>
    </TelaBase>
  )
}

// ─── Componente raiz — navegação por histórico + respostas do quiz ───────────
// Estrutura de respostas guardada (pedida explicitamente): attendance,
// experience, danceStyle, pain, reaction, belief, playfulness, desire — mais
// diagnosticoFeedback (reação ao diagnóstico do WhatsApp) e ofertaFinal
// (presencial/transmissao, decidida no início e confirmável depois).

export default function QuizLP() {
  const mobile = useWindowWidth() < 768

  const [respostas, setRespostas] = useState({
    attendance: null,
    experience: null,
    danceStyle: null,
    pain: null,
    reaction: null,
    belief: null,
    playfulness: null,
    desire: null,
    diagnosticoFeedback: null,
    ofertaFinal: null,
  })

  const [historico, setHistorico] = useState(['promessa'])
  const passoAtual = historico[historico.length - 1]

  // respostasRef sempre reflete o valor mais recente de `respostas`, mesmo
  // dentro de um setTimeout já agendado antes de um onResponder() ser
  // processado. Sem isso, `avancar` capturado no clique via closure usa o
  // `respostas` de ANTES da resposta atual ser salva (setState é assíncrono),
  // e proximoId() decide um pulo (ex.: q-danceStyle) com dado desatualizado.
  const respostasRef = useRef(respostas)
  respostasRef.current = respostas

  const onResponder = (campo, valor) => setRespostas(r => ({ ...r, [campo]: valor }))

  const avancar = () => {
    const proximo = proximoId(passoAtual, respostasRef.current)
    setHistorico(h => [...h, proximo])
  }
  const voltar = () => setHistorico(h => (h.length > 1 ? h.slice(0, -1) : h))

  useEffect(() => {
    window.scrollTo(0, 0)
    // O /quiz inteiro vive numa única URL — o Clarity sozinho não distingue
    // em qual tela a pessoa está. Um evento por troca de tela permite depois
    // filtrar/contar sessões no painel do Clarity por "quiz_<id-da-tela>"
    // e enxergar exatamente onde as pessoas param no funil.
    if (typeof window.clarity === 'function') window.clarity('event', `quiz_${passoAtual}`)
  }, [passoAtual])

  const propsComuns = { avancar, voltar, mobile }

  let tela
  if (passoAtual === 'promessa') {
    tela = <Tela1Promessa avancar={avancar} mobile={mobile} />
  } else if (passoAtual === 'vsl') {
    tela = <Tela2VSL avancar={avancar} mobile={mobile} />
  } else if (passoAtual.startsWith('q-')) {
    const aplicaveis = perguntasAplicaveis(respostas)
    tela = (
      <TelaPergunta
        id={passoAtual}
        respostas={respostas}
        onResponder={onResponder}
        indiceQuiz={aplicaveis.indexOf(passoAtual) + 1}
        totalQuiz={aplicaveis.length}
        {...propsComuns}
      />
    )
  } else if (passoAtual === 'whatsapp') {
    tela = <Tela5WhatsApp respostas={respostas} onResponder={onResponder} {...propsComuns} />
  } else if (passoAtual === 'metodo') {
    tela = <Tela6Metodo {...propsComuns} />
  } else if (passoAtual === 'confirmacao') {
    tela = <TelaConfirmacao respostas={respostas} onResponder={onResponder} {...propsComuns} />
  } else if (passoAtual === 'voucher') {
    tela = <Tela7Voucher oferta={respostas.ofertaFinal} {...propsComuns} />
  } else if (passoAtual === 'prova') {
    tela = <Tela8Prova {...propsComuns} />
  } else if (passoAtual === 'oferta') {
    tela = <Tela9Oferta ofertaInicial={respostas.ofertaFinal} voltar={voltar} mobile={mobile} />
  }

  return (
    <>
      <style>{globalStyles}</style>
      {tela}
    </>
  )
}
