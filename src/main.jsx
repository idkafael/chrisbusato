import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import BrincandoNaMusicaLP from '../BrincandoNaMusicaLP.jsx'
import CorpoMusicalPresencialLP from '../CorpoMusicalPresencialLP.jsx'
import ErroAPossibilidadeLP from '../ErroAPossibilidadeLP.jsx'
import AgradecimentoPresencialLP from '../AgradecimentoPresencialLP.jsx'
import AgradecimentoOnlineLP from '../AgradecimentoOnlineLP.jsx'
import BrincandoNaMusicaGlobalLP from '../BrincandoNaMusicaGlobalLP.jsx'
import DateForaDoComumLP from '../DateForaDoComumLP.jsx'
import VergonhaNaDancaLP from '../VergonhaNaDancaLP.jsx'
import AssinaturaLP from '../AssinaturaLP.jsx'
import ClubeMusicalLP from '../ClubeMusicalLP.jsx'
import TesteAssinaturaLP from '../TesteAssinaturaLP.jsx'
import AoVivoLP from '../AoVivoLP.jsx'
import QuizLP from '../QuizLP.jsx'
import AdminLP from '../AdminLP.jsx'
import PropostaLP from '../PropostaLP.jsx'
import BotaoWhatsApp from '../BotaoWhatsApp.jsx'

function PixelPageViews() {
  const { pathname } = useLocation()
  const ultimaPagina = React.useRef(null)
  React.useEffect(() => {
    if (ultimaPagina.current === pathname || typeof window.fbq !== 'function') return
    window.fbq('track', 'PageView')
    ultimaPagina.current = pathname
  }, [pathname])
  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PixelPageViews />
      <Routes>
        <Route path="/" element={<BrincandoNaMusicaLP />} />
        <Route path="/presencial" element={<CorpoMusicalPresencialLP />} />
        <Route path="/possibilidades" element={<ErroAPossibilidadeLP />} />
        <Route path="/ad1" element={<AgradecimentoPresencialLP />} />
        <Route path="/ad2" element={<AgradecimentoOnlineLP />} />
        <Route path="/global" element={<BrincandoNaMusicaGlobalLP />} />
        <Route path="/casais" element={<DateForaDoComumLP />} />
        <Route path="/vergonha" element={<VergonhaNaDancaLP />} />
        <Route path="/vergonha37" element={<VergonhaNaDancaLP preco="R$37" checkoutUrl="https://pay.cakto.com.br/oviafav" />} />
        <Route path="/online" element={<ClubeMusicalLP />} />
        <Route path="/assinatura" element={<AssinaturaLP />} />
        <Route path="/teste" element={<TesteAssinaturaLP />} />
        <Route path="/aovivo" element={<AoVivoLP />} />
        <Route path="/quiz" element={<QuizLP />} />
        <Route path="/admin" element={<AdminLP />} />
        <Route path="/corpomusical" element={<PropostaLP />} />
        <Route path="/corpomusical3" element={<PropostaLP somenteParcelas />} />
        <Route path="/corpomusical1" element={<PropostaLP semPrecos />} />
        <Route path="/corpomusical2" element={<PropostaLP />} />
      </Routes>
      <BotaoWhatsApp />
    </BrowserRouter>
  </React.StrictMode>
)
