declare global {
  interface Window {
    global: Window;
    process: { env: Record<string, string> };
  }
}

window.global = window;
window.process = { env: {} };
import { StrictMode } from 'react'


import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
