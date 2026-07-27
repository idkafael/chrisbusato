import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BrincandoNaMusicaLP from '../BrincandoNaMusicaLP.jsx'
import CorpoMusicalPresencialLP from '../CorpoMusicalPresencialLP.jsx'
import ErroAPossibilidadeLP from '../ErroAPossibilidadeLP.jsx'
import AgradecimentoPresencialLP from '../AgradecimentoPresencialLP.jsx'
import AgradecimentoOnlineLP from '../AgradecimentoOnlineLP.jsx'
import BrincandoNaMusicaGlobalLP from '../BrincandoNaMusicaGlobalLP.jsx'
import DateForaDoComumLP from '../DateForaDoComumLP.jsx'
import VergonhaNaDancaLP from '../VergonhaNaDancaLP.jsx'
import PlataformaCursosLP from '../PlataformaCursosLP.jsx'
import AdminLP from '../AdminLP.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
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
        <Route path="/online" element={<PlataformaCursosLP />} />
        <Route path="/admin" element={<AdminLP />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
