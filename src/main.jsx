import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CrmProvider } from './context/CrmContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CrmProvider>
      <App />
    </CrmProvider>
  </StrictMode>,
)
