import { createContext, useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
// import HomePage from './pages/HomePage.jsx'
// import ScamDetector from './pages/ScamDetector.jsx'
// import ScamQuiz from './pages/ScamQuiz.jsx'
// import Tutorials from './pages/Tutorials.jsx'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
// import './App.css'

// ─── Settings Context ───────────────────────────────────────────────
export const SettingsContext = createContext(null)

export function useSettings() {
  return useContext(SettingsContext)
}

// ─── Styles ─────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f0f4f8',
  },
  header: {
    background: '#1F4E79',
    color: '#fff',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  logoArea: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { fontSize: '28px' },
  logoText: { fontWeight: '700', fontSize: '22px', letterSpacing: '-0.3px' },
  logoSub: { fontSize: '13px', opacity: 0.8, marginTop: '-2px' },
  controls: { display: 'flex', alignItems: 'center', gap: '8px' },
  sizeBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '700',
  },
  langBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  langBtnActive: {
    background: '#fff',
    color: '#1F4E79',
  },
  nav: {
    background: '#fff',
    borderBottom: '2px solid #e2e8f0',
    display: 'flex',
    overflowX: 'auto',
  },
  main: {
    flex: 1,
    padding: '20px 16px',
    maxWidth: '860px',
    width: '100%',
    margin: '0 auto',
  },
}

function NavTab({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      style={({ isActive }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 20px',
        textDecoration: 'none',
        color: isActive ? '#1F4E79' : '#64748b',
        borderBottom: isActive ? '3px solid #1F4E79' : '3px solid transparent',
        fontWeight: isActive ? '700' : '500',
        fontSize: '13px',
        whiteSpace: 'nowrap',
        gap: '3px',
        transition: 'all 0.15s',
        minWidth: '80px',
        background: isActive ? '#f0f7ff' : 'transparent',
      })}
    >
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

function App() {
  const [fontSize, setFontSize] = useState(18)
  const [language, setLanguage] = useState('en')
 
  const increaseFontSize = () => setFontSize(f => Math.min(f + 2, 26))
  const decreaseFontSize = () => setFontSize(f => Math.max(f - 2, 14))
  const toggleLanguage = () => setLanguage(l => l === 'en' ? 'ta' : 'en')
 
  return (
    <SettingsContext.Provider value={{ fontSize, language }}>
      <BrowserRouter>
        <div style={S.app}>
          {/* Header */}
          <header style={S.header}>
            <div style={S.logoArea}>
              <span style={S.logoIcon}>🤖</span>
              <div>
                <div style={S.logoText}>TechSage AI</div>
                <div style={S.logoSub}>
                  {language === 'en' ? 'Your friendly technology helper' : 'உங்கள் நட்பான தொழில்நுட்ப உதவியாளர்'}
                </div>
              </div>
            </div>
            <div style={S.controls}>
              <button
                style={S.sizeBtn}
                onClick={decreaseFontSize}
                aria-label="Decrease text size"
                title="Smaller text"
              >A−</button>
              <button
                style={S.sizeBtn}
                onClick={increaseFontSize}
                aria-label="Increase text size"
                title="Larger text"
              >A+</button>
              <button
                style={{ ...S.langBtn, ...(language === 'ta' ? S.langBtnActive : {}) }}
                onClick={toggleLanguage}
                aria-label="Toggle language between English and Tamil"
              >
                {language === 'en' ? 'தமிழ்' : 'English'}
              </button>
            </div>
          </header>
 
          {/* Nav */}
          <nav style={S.nav} role="navigation" aria-label="Main navigation">
            <NavTab to="/" icon="🏠" label={language === 'en' ? 'Ask AI' : 'கேளுங்கள்'} />
            <NavTab to="/scam-check" icon="🛡️" label={language === 'en' ? 'Scam Check' : 'மோசடி'} />
            <NavTab to="/quiz" icon="🎯" label={language === 'en' ? 'Practice' : 'பயிற்சி'} />
            <NavTab to="/tutorials" icon="📚" label={language === 'en' ? 'Tutorials' : 'பாடங்கள்'} />
          </nav>
 
          {/* Page content */}
          {/* <main style={S.main}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/scam-check" element={<ScamDetector />} />
              <Route path="/quiz" element={<ScamQuiz />} />
              <Route path="/tutorials" element={<Tutorials />} />
            </Routes>
          </main> */}
 
          {/* Footer */}
          <footer style={{ textAlign: 'center', padding: '16px', fontSize: '13px', color: '#94a3b8', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
            Made with ❤️ for GenLink Hacks 2026 · Helping seniors feel confident with technology
          </footer>
        </div>
      </BrowserRouter>
    </SettingsContext.Provider>
  )
}

export default App
