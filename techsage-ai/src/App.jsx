import React, { createContext, useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import './clay.css'
import ClayBlobs from './components/ClayBlobs.jsx'
import HomePage from './pages/HomePage.jsx'
import ScamDetector from './pages/ScamDetector.jsx'
import ScamQuiz from './pages/ScamQuiz.jsx'
import Tutorials from './pages/Tutorials.jsx'
import { C, SHADOWS, RADIUS, FONT, GRAD } from './tokens.js'

export const SettingsContext = createContext(null)
export function useSettings() { return useContext(SettingsContext) }

function SizeBtn({ label, onClick }) {
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        background: 'rgba(255,255,255,0.18)',
        border: '1.5px solid rgba(255,255,255,0.35)',
        color: '#fff',
        borderRadius: RADIUS.btn,
        width: '44px', height: '44px',
        fontSize: '15px',
        cursor: 'pointer',
        fontFamily: FONT.heading,
        fontWeight: '800',
        transition: 'all 0.15s',
        transform: pressed ? 'scale(0.90)' : 'scale(1)',
        boxShadow: pressed
          ? 'inset 4px 4px 8px rgba(0,0,0,0.15)'
          : '4px 4px 10px rgba(0,0,0,0.15), -2px -2px 6px rgba(255,255,255,0.15)',
      }}
    >
      {label}
    </button>
  )
}

function NavTab({ to, icon, label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={({ isActive }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 18px',
        textDecoration: 'none',
        color: isActive ? C.accent : C.muted,
        borderBottom: isActive ? `3px solid ${C.accent}` : '3px solid transparent',
        fontFamily: FONT.heading,
        fontWeight: isActive ? '800' : '600',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        gap: '4px',
        transition: 'all 0.2s',
        minWidth: '78px',
        background: isActive
          ? `linear-gradient(180deg, ${C.accent}10 0%, transparent 100%)`
          : hovered
          ? `${C.accent}06`
          : 'transparent',
        transform: isActive || hovered ? 'translateY(-1px)' : 'translateY(0)',
      })}
    >
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

export default function App() {
  const [fontSize, setFontSize] = useState(18)
  const [language, setLanguage] = useState('en')
  const [langHovered, setLangHovered] = useState(false)

  return (
    <SettingsContext.Provider value={{ fontSize, language }}>
      <BrowserRouter>
        {/* Animated background blobs — z-index 0, fixed */}
        <ClayBlobs />

        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

          {/* ── Header ─────────────────────────────────────────── */}
          <header style={{
            background: `linear-gradient(135deg, #5B21B6 0%, ${C.accent} 60%, #A21CAF 100%)`,
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            boxShadow: '0 4px 24px rgba(124,58,237,0.35)',
            position: 'sticky', top: 0, zIndex: 100,
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '4px 4px 12px rgba(0,0,0,0.15), inset 2px 2px 4px rgba(255,255,255,0.3)',
                animation: 'clay-breathe 5s ease-in-out infinite',
              }}>🤖</div>
              <div>
                <div style={{ fontFamily: FONT.heading, fontWeight: '900', fontSize: '20px', color: '#fff', letterSpacing: '-0.3px' }}>
                  TechSage AI
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '-2px' }}>
                  {language === 'en' ? 'Your friendly technology helper' : 'உங்கள் நட்பான தொழில்நுட்ப உதவியாளர்'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SizeBtn label="A−" onClick={() => setFontSize(f => Math.max(f - 2, 14))} />
              <SizeBtn label="A+" onClick={() => setFontSize(f => Math.min(f + 2, 26))} />
              <button
                onMouseEnter={() => setLangHovered(true)}
                onMouseLeave={() => setLangHovered(false)}
                onClick={() => setLanguage(l => l === 'en' ? 'ta' : 'en')}
                style={{
                  background: langHovered ? '#fff' : 'rgba(255,255,255,0.18)',
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  color: langHovered ? C.accent : '#fff',
                  borderRadius: RADIUS.btn,
                  padding: '0 16px',
                  height: '44px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: FONT.heading,
                  fontWeight: '800',
                  transition: 'all 0.2s',
                }}
              >
                {language === 'en' ? 'தமிழ்' : 'English'}
              </button>
            </div>
          </header>

          {/* ── Nav ────────────────────────────────────────────── */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            style={{
              background: 'rgba(255,255,255,0.80)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${C.accent}18`,
              display: 'flex',
              overflowX: 'auto',
              boxShadow: '0 4px 20px rgba(124,58,237,0.08)',
              position: 'sticky', top: '66px', zIndex: 99,
            }}
          >
            <NavTab to="/"           icon="🏠" label={language === 'en' ? 'Ask AI'     : 'கேளுங்கள்'} />
            <NavTab to="/scam-check" icon="🛡️" label={language === 'en' ? 'Scam Check' : 'மோசடி'}    />
            <NavTab to="/quiz"       icon="🎯" label={language === 'en' ? 'Practice'   : 'பயிற்சி'}  />
            <NavTab to="/tutorials"  icon="📚" label={language === 'en' ? 'Tutorials'  : 'பாடங்கள்'} />
          </nav>

          {/* ── Content ────────────────────────────────────────── */}
          <main style={{
            flex: 1,
            padding: '24px 16px 40px',
            maxWidth: '880px',
            width: '100%',
            margin: '0 auto',
          }}>
            <Routes>
              <Route path="/"           element={<HomePage />} />
              <Route path="/scam-check" element={<ScamDetector />} />
              <Route path="/quiz"       element={<ScamQuiz />} />
              <Route path="/tutorials"  element={<Tutorials />} />
            </Routes>
          </main>

          {/* ── Footer ─────────────────────────────────────────── */}
          <footer style={{
            textAlign: 'center',
            padding: '20px 16px',
            fontSize: '13px',
            color: C.muted,
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(12px)',
            borderTop: `1px solid ${C.accent}15`,
            fontFamily: FONT.heading,
            fontWeight: '600',
          }}>
            Made with ❤️ for <strong style={{ color: C.accent }}>GenLink Hacks 2026</strong> · Helping seniors feel confident with technology
          </footer>
        </div>
      </BrowserRouter>
    </SettingsContext.Provider>
  )
}
