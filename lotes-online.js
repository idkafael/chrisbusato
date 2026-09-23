// Intervalos no horário de São Paulo. Final exclusivo inclui o último dia inteiro.
export const LOTES_ONLINE = [
  { nome: '1º lote', preco: 37, periodo: '22/09 a 01/10', inicio: '2026-09-22T00:00:00-03:00', fim: '2026-10-02T00:00:00-03:00', checkout: 'https://pay.cakto.com.br/8mhrabz' },
  { nome: '2º lote', preco: 47, periodo: '02/10 a 09/10', inicio: '2026-10-02T00:00:00-03:00', fim: '2026-10-10T00:00:00-03:00', checkout: 'https://pay.cakto.com.br/kyw3hxn' },
  { nome: '3º lote', preco: 67, periodo: '10/10 a 18/10', inicio: '2026-10-10T00:00:00-03:00', fim: '2026-10-19T00:00:00-03:00', checkout: 'https://pay.cakto.com.br/wp92bu4' },
]
export function loteOnlineEm(agora = Date.now()) {
  const instante = Number(new Date(agora))
  const ativo = LOTES_ONLINE.findIndex(lote => instante >= Date.parse(lote.inicio) && instante < Date.parse(lote.fim))
  const encerrado = instante >= Date.parse(LOTES_ONLINE.at(-1).fim)
  const indice = ativo >= 0 ? ativo : encerrado ? 2 : 0
  return { lote: LOTES_ONLINE[indice], indice, ativo: ativo >= 0, encerrado }
}
