// Contato por WhatsApp — fonte única dos números e de como abrir a conversa.
// O botão flutuante e os botões das páginas leem daqui, para que trocar um
// número seja uma alteração só.

const NUMERO_PADRAO = '5548999960701' // +55 48 99996-0701

// A /corpomusical e a /corpomusical1 são atendidas pela mesma equipe.
const NUMERO_CORPO_MUSICAL = '5571981959330' // +55 71 98195-9330

// Chave = pathname em minúsculas, sem barra final.
const NUMERO_POR_ROTA = {
  '/corpomusical': NUMERO_CORPO_MUSICAL,
  '/corpomusical1': NUMERO_CORPO_MUSICAL,
  '/corpomusical3': '557181959330', // +55 71 8195-9330
}

export function numeroDaRota(pathname) {
  const rota = pathname.replace(/\/+$/, '').toLowerCase() || '/'
  return NUMERO_POR_ROTA[rota] || NUMERO_PADRAO
}

export function linkWhatsApp(numero, mensagem) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}

// Abrir via window.open() em vez de seguir o href: algum script de tracking do
// site (parte do pacote UTMify) varre e reescreve todo link wa.me presente no
// DOM, corrompendo a mensagem com caracteres inválidos. O link aberto aqui vem
// da variável JS, não do atributo do DOM, então chega limpo.
export function abrirWhatsApp(evento, link) {
  evento.preventDefault()
  window.open(link, '_blank', 'noopener,noreferrer')
}
