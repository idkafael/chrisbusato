// Virada em 06/10: metade dos 24 dias entre 24/09 e a vivência de 18/10.
// Horário de Brasília; o fim exclusivo inclui todo o último dia.
export const LOTES_PRESENCIAL = [
  { nome: '1º lote', preco: 97, periodo: '24/09 a 05/10', inicio: '2026-09-24T00:00:00-03:00', fim: '2026-10-06T00:00:00-03:00', checkout: 'https://pay.cakto.com.br/j39pqwm' },
  { nome: '2º lote', preco: 120, periodo: '06/10 a 18/10', inicio: '2026-10-06T00:00:00-03:00', fim: '2026-10-19T00:00:00-03:00', checkout: 'https://pay.cakto.com.br/3244b9m' },
]
export function lotePresencialEm(agora = Date.now()) {
  const instante = Number(new Date(agora))
  const ativo = LOTES_PRESENCIAL.findIndex(lote => instante >= Date.parse(lote.inicio) && instante < Date.parse(lote.fim))
  const encerrado = instante >= Date.parse(LOTES_PRESENCIAL.at(-1).fim)
  const indice = ativo >= 0 ? ativo : encerrado ? LOTES_PRESENCIAL.length - 1 : 0
  return { lote: LOTES_PRESENCIAL[indice], indice, ativo: ativo >= 0, encerrado }
}
