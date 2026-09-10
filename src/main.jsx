import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import PlanSelector from './components/PlanSelector.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/planes"
          element={
            <main className="plans-page">
              <PlanSelector />
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
