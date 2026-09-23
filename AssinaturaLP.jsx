import { useEffect, useRef, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { plans, bumps, money, validateCustomer } from './checkout/catalog.js'
import { getSdk } from './checkout/cakto-sdk.js'
import checkoutBanner from './images/CorpoMusicalBanner.png'
import { abrirWhatsApp, linkWhatsApp, numeroDaRota } from './whatsapp.js'
import './checkout/assinatura.css'

const fields = [
  ['nome', 'Nome completo', 'Seu nome e sobrenome', 'text', 'name'],
  ['email', 'E-mail', 'voce@email.com', 'email', 'email'],
  ['telefone', 'WhatsApp', '(11) 99999-9999', 'tel', 'tel-national'],
  ['cpf', 'CPF', '000.000.000-00', 'text', 'off'],
]
const methods = [['pix', 'Pix', 'À vista'], ['credit_card', 'Cartão', 'Crédito'], ['pix_parcelado', 'Pix parcelado', 'Sem cartão']]
function mask(key, value) {
  if (key === 'cpf') return value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  if (key === 'telefone') return value.replace(/\D/g, '').slice(0, 11).replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4})$/, '$1-$2')
  return value
}
export default function AssinaturaLP() {
  const [params] = useSearchParams()
  const planId = params.get('plano')
  if (!plans.some(plan => plan.id === planId)) return <Navigate to="/online#planos" replace />
  return <CheckoutAssinatura key={planId} planId={planId} />
}
function CheckoutAssinatura({ planId }) {
  const [step, setStep] = useState(0)
  const [customer, setCustomer] = useState({ nome: '', email: '', telefone: '', cpf: '' })
  const [errors, setErrors] = useState({})
  const [extras, setExtras] = useState([])
  const [method, setMethod] = useState('pix')
  const [config, setConfig] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [card, setCard] = useState({ holderName: '', cardNumber: '', expMonth: '', expYear: '', cvv: '' })
  const request = useRef(null)
  const guard = useRef(false)
  const heading = useRef(null)
  const fingerprint = useRef(null)
  const plan = plans.find(item => item.id === planId)
  const selected = bumps.filter(item => extras.includes(item.id))
  const total = plan.price + selected.reduce((sum, item) => sum + item.price, 0)
  const preview = !config?.enabled
  const basket = [planId, ...[...extras].sort()].join('+')
  const hosted = config?.hostedBaskets?.includes(basket)
  const available = !preview && (hosted || (!extras.length && method !== 'pix_parcelado' && config?.directPlans?.includes(planId) && (method !== 'credit_card' || config.sdkClientId)))
  const support = linkWhatsApp(numeroDaRota('/online'), 'Olá! Quero saber mais sobre a assinatura Corpo Musical.')
  useEffect(() => {
    const previous = document.title
    document.title = 'Assine o Corpo Musical | Chris Busato'
    const controller = new AbortController()
    fingerprint.current = crypto.randomUUID()
    fetch('/api/assinatura', { signal: controller.signal }).then(response => response.ok ? response.json() : Promise.reject()).then(setConfig).catch(() => {})
    return () => { controller.abort(); document.title = previous }
  }, [])
  useEffect(() => {
    if (config?.enabled && config.sdkClientId && !hosted) getSdk(config.sdkClientId).catch(() => {})
  }, [config, hosted])
  function move(next) { setStep(next); setError(''); request.current = null; setTimeout(() => heading.current?.focus(), 0) }
  function next(event) {
    event.preventDefault()
    if (step === 0) {
      const invalid = validateCustomer(customer)
      setErrors(invalid)
      if (Object.keys(invalid).length) { document.getElementById(`checkout-${Object.keys(invalid)[0]}`)?.focus(); return }
    }
    move(step + 1)
  }
  async function pay(event) {
    event.preventDefault()
    if (guard.current || !available || result) return
    guard.current = true; setBusy(true); setError('')
    try {
      if (!request.current) {
        const payload = { plano: planId, extras, metodo: method, cliente: customer, fingerprint: fingerprint.current, idempotencyKey: crypto.randomUUID() }
        if (method === 'credit_card' && !hosted) {
          const sdk = await getSdk(config.sdkClientId)
          const token = await sdk.createToken({ ...card, cardNumber: card.cardNumber.replace(/\D/g, '') })
          await sdk.completeAntifraudProfile()
          payload.cardToken = token.cardToken
          payload.antifraudRef = sdk.getAntifraudReference()
          if (!payload.cardToken || !payload.antifraudRef) throw new Error('Não foi possível validar o cartão. Confira os dados.')
        }
        request.current = payload
      }
      const response = await fetch('/api/assinatura', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request.current) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Não foi possível concluir. Tente novamente.')
      if (data.checkoutUrl) {
        const url = new URL(data.checkoutUrl)
        if (url.protocol !== 'https:' || url.hostname !== 'pay.cakto.com.br') throw new Error('Endereço de pagamento inválido.')
        window.location.assign(url.href); return
      }
      if (!data.id || !data.status) throw new Error('Confirmação indisponível. Consulte novamente o mesmo pedido.')
      setResult(data)
      setCard({ holderName: '', cardNumber: '', expMonth: '', expYear: '', cvv: '' })
    } catch (failure) { setError(failure.message || 'Falha de conexão. Consulte novamente o mesmo pedido.') }
    finally { guard.current = false; setBusy(false) }
  }
  return <div className="subscription">
    <a className="sub-skip" href="#checkout-content">Ir para a assinatura</a>
    <header className="sub-header"><a href="/online" className="sub-brand">Chris Busato<span>CORPO MUSICAL</span></a><a href={support} onClick={event => abrirWhatsApp(event, support)}>Precisa de ajuda? <span>↗</span></a></header>
    <main className="sub-layout" id="checkout-content">
      <div className="sub-checkout-column">
      <img className="sub-checkout-banner" src={checkoutBanner} width="1916" height="821" alt="Clube Musical: seu próximo passo para dançar com mais liberdade. Aulas organizadas, conteúdos completos e comunidade ativa." />
      <section className="sub-checkout" aria-label="Assinatura Corpo Musical">
        <nav className="sub-steps" aria-label="Etapas da assinatura">
          {['Dados', 'Pagamento'].map((label, index) => {
            const completed = index < step || (index === 1 && result?.status === 'paid')
            const locked = index > step
            const status = completed ? 'Concluído' : locked ? 'Bloqueado' : 'Em andamento'
            return <button key={label} type="button"
              className={`sub-step ${completed ? 'is-complete' : locked ? 'is-locked' : 'is-current'}`}
              disabled={locked || busy || !!result || !!request.current}
              aria-label={`${label}: ${status}`}
              aria-current={index === step && !completed ? 'step' : undefined}
              onClick={() => move(index)}>
              <span className="sub-step-icon" aria-hidden="true">{completed ? '✓' : locked ? <svg width="13" height="15" viewBox="0 0 16 18" fill="none"><rect x="2" y="8" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M4.5 8V5a3.5 3.5 0 0 1 7 0v3" stroke="currentColor" strokeWidth="1.5" /></svg> : index + 1}</span>
              <div className="sub-step-label">{label}<small>{status}</small></div>
            </button>
          })}
        </nav>
        <div className="sub-panel">
          {!result && <div className="sub-chosen-plan"><div><small>SUA ASSINATURA</small><strong>Corpo Musical · {plan.name}</strong></div><span>{money(plan.price)}{plan.period}</span>{!busy && !request.current && <a href="/online#planos">Trocar plano</a>}</div>}
          <span className="sub-eyebrow">{result ? 'SEU PEDIDO' : `PASSO 0${step + 1} DE 02`}</span>
          <h2 ref={heading} tabIndex={-1}>{result ? (result.status === 'paid' ? 'Pagamento aprovado' : result.pix ? 'Seu Pix está pronto' : ['declined', 'refused'].includes(result.status) ? 'Pagamento não aprovado' : 'Pedido em processamento') : ['Vamos nos conhecer?', 'Falta só um passo'][step]}</h2>
          {!result && <p className="sub-description">{['Preencha seus dados para começar sua jornada.', 'Confira seu pedido e escolha como pagar.'][step]}</p>}
          {result ? <div className="sub-result" role="status">
            <p>{result.status === 'paid' ? 'A confirmação e as orientações de acesso serão enviadas para seu e-mail.' : result.pix ? 'Copie o código abaixo e pague na opção Pix copia e cola do seu banco. A confirmação será enviada por e-mail após o pagamento.' : ['declined', 'refused'].includes(result.status) ? 'Fale com nossa equipe para continuar sua inscrição.' : 'Aguarde a confirmação por e-mail. Não faça outro pagamento.'}</p>
            <small>Pedido: {result.id}</small>
            {result.pix && <><label htmlFor="pix-code">Código Pix</label><textarea id="pix-code" readOnly value={result.pix.qrCode} /><button className="sub-primary" type="button" onClick={async () => { try { await navigator.clipboard.writeText(result.pix.qrCode); setCopied(true) } catch { setError('Selecione o código acima e copie manualmente.') } }}>{copied ? 'Código copiado ✓' : 'Copiar código Pix'}</button>{result.pix.expirationDate && <small>Validade: {result.pix.expirationDate}</small>}</>}
          </div> : <form onSubmit={step === 0 ? next : pay}>
            <fieldset disabled={busy || !!request.current} className="sub-fields">
            {step === 0 && <div className="sub-inputs">{fields.map(([key, label, placeholder, type, autocomplete]) => <label key={key} htmlFor={`checkout-${key}`}>{label}<input id={`checkout-${key}`} name={key} type={type} autoComplete={autocomplete} inputMode={['cpf', 'telefone'].includes(key) ? 'numeric' : undefined} maxLength={key === 'cpf' ? 14 : key === 'telefone' ? 15 : 150} placeholder={placeholder} value={customer[key]} onChange={event => setCustomer({ ...customer, [key]: mask(key, event.target.value) })} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} />{errors[key] && <small id={`error-${key}`} className="sub-error">{errors[key]}</small>}</label>)}</div>}
            {step === 1 && <>
              <div className="sub-extras-heading"><h3>Um pouco mais para você</h3><span>OPCIONAL</span></div>
              {bumps.filter(item => preview || !item.preview).map(item => <label className={`sub-bump ${extras.includes(item.id) ? 'selected' : ''}`} key={item.id}><input type="checkbox" checked={extras.includes(item.id)} onChange={() => setExtras(current => current.includes(item.id) ? current.filter(id => id !== item.id) : [...current, item.id])} /><span className="sub-bump-art" aria-hidden="true">{item.id === 'praticas' ? '01' : '02'}</span><span><strong>{item.name}</strong><small>{item.description}</small><b>+ {money(item.price)}</b></span></label>)}
            </>}
            {step === 1 && <>
              <div className="sub-methods" role="radiogroup" aria-label="Forma de pagamento">{methods.map(([id, label, detail]) => <label key={id} className={method === id ? 'selected' : ''}><input type="radio" name="metodo" checked={method === id} onChange={() => setMethod(id)} /><strong>{label}</strong><small>{detail}</small></label>)}</div>
              {method === 'pix' && <p className="sub-payment-note">{hosted ? 'Você poderá gerar seu Pix no ambiente seguro da Cakto.' : 'Ao finalizar, você recebe um código Pix para pagar no aplicativo do seu banco.'} O acesso depende da confirmação do pagamento.</p>}
              {method === 'pix_parcelado' && <p className="sub-payment-note">Continue na Cakto para consultar as parcelas e condições da Pagaleve. Disponibilidade e aprovação são confirmadas antes do pagamento.</p>}
              {method === 'credit_card' && (hosted ? <p className="sub-payment-note">Você informa os dados do cartão no ambiente seguro da Cakto e confere as condições antes de pagar.</p> : <div className="sub-inputs sub-card-fields">{[['holderName', 'Nome no cartão', 'cc-name'], ['cardNumber', 'Número do cartão', 'cc-number'], ['expMonth', 'Mês (MM)', 'cc-exp-month'], ['expYear', 'Ano (AA)', 'cc-exp-year'], ['cvv', 'CVV', 'cc-csc']].map(([key, label, autocomplete]) => <label key={key}>{label}<input required autoComplete={autocomplete} inputMode={key === 'holderName' ? 'text' : 'numeric'} type={key === 'cvv' ? 'password' : 'text'} maxLength={key === 'cardNumber' ? 23 : key === 'holderName' ? 100 : key === 'cvv' ? 4 : 2} value={card[key]} onChange={event => setCard({ ...card, [key]: key === 'holderName' ? event.target.value : event.target.value.replace(/\D/g, '') })} /></label>)}</div>)}
            </>}
            </fieldset>
            {step > 0 && <div className="sub-summary" aria-live="polite"><div><span>Plano {plan.name.toLowerCase()}</span><span>{money(plan.price)}</span></div>{selected.map(item => <div key={item.id}><span>{item.name}</span><span>{money(item.price)}</span></div>)}<div className="sub-total"><span>Total{preview ? ' da prévia' : ''}</span><strong>{money(total)}</strong></div><small>{preview ? 'Valores ilustrativos, sujeitos à definição.' : hosted ? 'Confira o valor final e a renovação na Cakto antes de pagar.' : `Valor do período ${plan.name.toLowerCase()}.`}</small></div>}
            {step === 1 && preview && <p className="sub-payment-note">Esta é uma demonstração. Os planos e os extras ainda serão definidos. Nenhum pagamento será realizado.</p>}
            {step === 1 && !preview && !available && <p className="sub-error">Esta forma de pagamento ainda não está disponível para a seleção. Fale com nossa equipe.</p>}
            {error && <p role="alert" className="sub-error">{error}</p>}
            <button className="sub-primary" type="submit" disabled={busy || (step === 1 && !available)}>{busy ? 'Processando…' : step === 0 ? 'Continuar' : request.current ? 'Consultar o mesmo pedido' : preview ? 'Pagamento desativado na prévia' : hosted ? 'Continuar na Cakto' : method === 'pix' ? 'Gerar Pix' : 'Pagar assinatura'}{!busy && <span aria-hidden="true">↗</span>}</button>
            {step > 0 && !busy && !request.current && <button className="sub-back" type="button" onClick={() => move(step - 1)}>← Voltar para meus dados</button>}
            {step === 0 && <p className="sub-privacy">Seus dados serão usados para processar sua inscrição e enviar as informações de acesso.</p>}
          </form>}
          {result && error && <p role="alert" className="sub-error">{error}</p>}
        </div>
        <div className="sub-trust"><span>Pagamento via Cakto</span><span>Seus dados protegidos</span></div>
      </section>
      </div>
    </main>
    <footer className="sub-footer"><span>© {new Date().getFullYear()} Chris Busato</span><span>Corpo presente. Música viva.</span><a href={support} onClick={event => abrirWhatsApp(event, support)}>Fale com nossa equipe ↗</a></footer>
  </div>
}
