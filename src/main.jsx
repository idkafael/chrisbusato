import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BrincandoNaMusicaLP from '../BrincandoNaMusicaLP.jsx'
import CorpoMusicalPresencialLP from '../CorpoMusicalPresencialLP.jsx'
import ErroAPossibilidadeLP from '../ErroAPossibilidadeLP.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BrincandoNaMusicaLP />} />
        <Route path="/presencial" element={<CorpoMusicalPresencialLP />} />
        <Route path="/erro-possibilidade" element={<ErroAPossibilidadeLP />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
