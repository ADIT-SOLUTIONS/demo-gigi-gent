import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/barlow-condensed/latin-500.css'
import '@fontsource/barlow-condensed/latin-600.css'
import '@fontsource-variable/eb-garamond/wght.css'
import '@fontsource-variable/eb-garamond/wght-italic.css'
import '../src/index.css'
import './index.css'
import App from './App'
import { LangueProvider } from '../src/hooks/useLangue'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangueProvider>
      <App />
    </LangueProvider>
  </StrictMode>,
)
