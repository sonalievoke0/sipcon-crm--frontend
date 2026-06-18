import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TicketsView from './pages/TicketsView'
import TicketDetail from './pages/TicketDetail'
import CompaniesView from './pages/CompaniesView'
import CompanyDetail from './pages/CompanyDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<TicketsView />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route path="companies" element={<CompaniesView />} />
          <Route path="companies/:id" element={<CompanyDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
