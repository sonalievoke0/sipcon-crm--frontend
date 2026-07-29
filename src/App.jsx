import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TicketsView from './pages/TicketsView'
import TicketDetail from './pages/TicketDetail'
import CompaniesView from './pages/CompaniesView'
import CompanyDetail from './pages/CompanyDetail'
import Login from './pages/Login'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem('sipcon_admin_auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    localStorage.setItem('sipcon_admin_auth', 'true')
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('sipcon_admin_auth')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onLogout={handleLogout} />}>
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
