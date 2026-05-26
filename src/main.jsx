import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BrincandoNaMusicaLP from '../BrincandoNaMusicaLP.jsx'
import CorpoMusicalPresencialLP from '../CorpoMusicalPresencialLP.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BrincandoNaMusicaLP />} />
        <Route path="/presencial" element={<CorpoMusicalPresencialLP />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
