// Valores de prévia herdados de /online. Ative vendas somente após conferir as ofertas.
export const plans = [
  { id: 'mensal', name: 'Mensal', price: 12700, period: '/mês', description: 'Um mês para viver a música com a gente.' },
  { id: 'anual', name: 'Anual', price: 99700, period: '/ano', description: 'Um ano de acesso à comunidade e aos cursos.', badge: 'Mais tempo para você' },
]
// Exemplos visuais, nunca vendidos pela API. Substituir pelos produtos aprovados.
export const bumps = [
  { id: 'praticas', name: 'Caderno de práticas', description: 'Um espaço para acompanhar sua jornada musical.', price: 1990, preview: true },
  { id: 'encontro', name: 'Encontro extra', description: 'Mais um momento para experimentar a música em grupo.', price: 2990, preview: true },
]
export const money = value => (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export function validCpf(value) {
  const cpf = String(value || '').replace(/\D/g, '')
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false
  return [9, 10].every(length => {
    const sum = [...cpf.slice(0, length)].reduce((total, digit, index) => total + Number(digit) * (length + 1 - index), 0)
    return Number(cpf[length]) === ((sum * 10) % 11) % 10
  })
}
export function validateCustomer(customer = {}) {
  customer = customer && typeof customer === 'object' ? customer : {}
  const errors = {}
  if (typeof customer.nome !== 'string' || customer.nome.trim().split(/\s+/).length < 2) errors.nome = 'Informe seu nome e sobrenome.'
  if (typeof customer.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) errors.email = 'Confira seu e-mail.'
  if (!/^\d{10,11}$/.test(String(customer.telefone || '').replace(/\D/g, ''))) errors.telefone = 'Informe o telefone com DDD.'
  if (!validCpf(customer.cpf)) errors.cpf = 'Confira os dígitos do CPF.'
  return errors
}
