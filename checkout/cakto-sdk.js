let ready
export function getSdk(clientId) {
  if (!clientId) return Promise.reject(new Error('Pagamento por cartão indisponível no momento.'))
  if (!ready) ready = new Promise((resolve, reject) => {
    const initialize = async () => {
      try {
        const sdk = new window.Cakto.CaktoSDK({ client_id: clientId })
        await sdk.initAntifraud()
        resolve(sdk)
      } catch { reject(new Error('Não foi possível iniciar o pagamento seguro. Recarregue a página.')) }
    }
    if (window.Cakto?.CaktoSDK) return void initialize()
    const script = document.createElement('script')
    script.src = 'https://cakto-sdk.pages.dev/cakto-sdk.min.js'
    script.async = true
    script.onload = initialize
    script.onerror = () => { script.remove(); reject(new Error('Não foi possível carregar o pagamento seguro.')) }
    document.head.appendChild(script)
  }).catch(error => { ready = null; throw error })
  return ready
}
