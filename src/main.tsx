import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { registerSW } from './lib/sw-register'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for offline support
registerSW({
  onUpdate(registration) {
    window.dispatchEvent(
      new CustomEvent('sw-update-available', { detail: registration })
    )
  },
  onSuccess() {
    console.log('[FSA] App is ready to work offline!')
  },
})
