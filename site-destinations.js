/**
 * Destinos do botão “Entrar no grupo” (WhatsApp).
 *
 * 1) PATH — mesmo domínio, rota diferente (ex.: chrisbusato.com/quizz)
 *    Chave = pathname sem barra final, em minúsculas (ex.: "/quizz").
 *    Use link direto para número: https://wa.me/5511999999999
 *    (só dígitos: 55 + DDD + número, sem espaços ou +)
 *
 * 2) HOST — subdomínios (chave = hostname exato)
 *
 * Prioridade: path → host → default
 */
window.SITE_PATH_DESTINATIONS = {
  "/quizz": {
    whatsapp:
      "https://wa.me/5511998431233?text=" +
      encodeURIComponent(
        "oii, vim do quizz pode me falar mais sobre o corpo musical?"
      )
  }
};

window.SITE_DESTINATIONS = {
  default: {
    whatsapp: "https://chat.whatsapp.com/Bsv2jPif2JH8RHbsFc3LZC"
  }

  /* Subdomínios (opcional):
  ,
  "quiz.chrisbusato.com": {
    whatsapp: "https://chat.whatsapp.com/..."
  }
  */
};
