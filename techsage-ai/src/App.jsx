import React, { createContext, useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import './clay.css'
import ClayBlobs from './components/ClayBlobs.jsx'
import HomePage from './pages/HomePage.jsx'
import ScamDetector from './pages/ScamDetector.jsx'
import ScamQuiz from './pages/ScamQuiz.jsx'
import Tutorials from './pages/Tutorials.jsx'
import Achievements from './pages/Achievements.jsx'
import { C, SHADOWS, RADIUS, FONT, GRAD } from './tokens.js'

export const SettingsContext = createContext(null)
export function useSettings() { return useContext(SettingsContext) }

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'ta', label: 'தமிழ்', full: 'Tamil' },
  { code: 'hi', label: 'हिंदी', full: 'Hindi' },
]

function SizeBtn({ label, onClick }) {
  const [pressed, setPressed] = useState(false)
  return (
    <button onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)',
        color: '#fff', borderRadius: RADIUS.btn, width: '40px', height: '40px',
        fontSize: '14px', cursor: 'pointer', fontFamily: FONT.heading, fontWeight: '800',
        transition: 'all 0.15s',
        transform: pressed ? 'scale(0.90)' : 'scale(1)',
        boxShadow: pressed ? 'inset 4px 4px 8px rgba(0,0,0,0.15)' : '4px 4px 10px rgba(0,0,0,0.15)',
      }}>{label}</button>
  )
}

function NavTab({ to, icon, label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <NavLink to={to} end={to === '/'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={({ isActive }) => ({
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '10px 14px', textDecoration: 'none',
        color: isActive ? C.accent : C.muted,
        borderBottom: isActive ? `3px solid ${C.accent}` : '3px solid transparent',
        fontFamily: FONT.heading, fontWeight: isActive ? '800' : '600',
        fontSize: '11px', whiteSpace: 'nowrap', gap: '3px',
        transition: 'all 0.2s', minWidth: '64px',
        background: isActive ? `linear-gradient(180deg,${C.accent}10 0%,transparent 100%)` : hovered ? `${C.accent}06` : 'transparent',
        transform: isActive || hovered ? 'translateY(-1px)' : 'translateY(0)',
      })}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

export default function App() {
  const [fontSize, setFontSize] = useState(18)
  const [language, setLanguage] = useState('en')
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const currentLang = LANGUAGES.find(l => l.code === language)

  const navLabels = {
    en: ['Ask AI', 'Scam Check', 'Practice', 'Tutorials', 'Badges'],
    ta: ['கேளுங்கள்', 'மோசடி', 'பயிற்சி', 'பாடங்கள்', 'பரிசுகள்'],
    hi: ['पूछें', 'स्कैम', 'अभ्यास', 'ट्यूटोरियल', 'पदक'],
  }
  const NL = navLabels[language] || navLabels.en

  return (
    <SettingsContext.Provider value={{ fontSize, language }}>
      <BrowserRouter>
        <ClayBlobs />

        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

          {/* ── Header ─────────────────────────────────────────── */}
          <header style={{
            background: 'linear-gradient(135deg,#5B21B6 0%,#7C3AED 60%,#A21CAF 100%)',
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '10px',
            boxShadow: '0 4px 24px rgba(124,58,237,0.35)',
            position: 'sticky', top: 0, zIndex: 100,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '4px 4px 12px rgba(0,0,0,0.15)', animation: 'clay-breathe 5s ease-in-out infinite' }}>🤖</div>
              <div>
                <div style={{ fontFamily: FONT.heading, fontWeight: '900', fontSize: '19px', color: '#fff', letterSpacing: '-0.3px' }}>TechSage AI</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginTop: '-1px' }}>
                  {language === 'ta' ? 'உங்கள் தொழில்நுட்ப உதவியாளர்' : language === 'hi' ? 'आपका तकनीकी सहायक' : 'Your friendly technology helper'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SizeBtn label="A−" onClick={() => setFontSize(f => Math.max(f - 2, 14))} />
              <SizeBtn label="A+" onClick={() => setFontSize(f => Math.min(f + 2, 26))} />

              {/* Language selector */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setLangMenuOpen(o => !o)}
                  style={{
                    background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)',
                    color: '#fff', borderRadius: RADIUS.btn, padding: '0 14px', height: '40px',
                    fontSize: '13px', cursor: 'pointer', fontFamily: FONT.heading, fontWeight: '800',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  {currentLang?.label} ▾
                </button>
                {langMenuOpen && (
                  <div style={{
                    position: 'absolute', top: '48px', right: 0,
                    background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
                    borderRadius: RADIUS.md, boxShadow: SHADOWS.deep,
                    overflow: 'hidden', zIndex: 200, minWidth: '130px',
                    border: `1px solid ${C.accent}20`,
                  }}>
                    {LANGUAGES.map(l => (
                      <button key={l.code}
                        onClick={() => { setLanguage(l.code); setLangMenuOpen(false) }}
                        style={{
                          display: 'block', width: '100%', padding: '12px 16px',
                          background: language === l.code ? `${C.accent}12` : 'transparent',
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                          fontFamily: FONT.heading, fontSize: '14px', fontWeight: language === l.code ? '800' : '600',
                          color: language === l.code ? C.accent : C.foreground,
                        }}
                      >
                        {l.label} — {l.full}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ── Nav ────────────────────────────────────────────── */}
          <nav role="navigation" aria-label="Main navigation" style={{
            background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${C.accent}18`,
            display: 'flex', overflowX: 'auto',
            boxShadow: '0 4px 20px rgba(124,58,237,0.08)',
            position: 'sticky', top: '64px', zIndex: 99,
          }}>
            <NavTab to="/"           icon="🏠" label={NL[0]} />
            <NavTab to="/scam-check" icon="🛡️" label={NL[1]} />
            <NavTab to="/quiz"       icon="🎯" label={NL[2]} />
            <NavTab to="/tutorials"  icon="📚" label={NL[3]} />
            <NavTab to="/achievements" icon="🏅" label={NL[4]} />
          </nav>

          {/* ── Content ────────────────────────────────────────── */}
          <main style={{ flex: 1, padding: '24px 16px 40px', maxWidth: '880px', width: '100%', margin: '0 auto' }}>
            <Routes>
              <Route path="/"             element={<HomePage />} />
              <Route path="/scam-check"   element={<ScamDetector />} />
              <Route path="/quiz"         element={<ScamQuiz />} />
              <Route path="/tutorials"    element={<Tutorials />} />
              <Route path="/achievements" element={<Achievements />} />
            </Routes>
          </main>

          {/* ── Footer ─────────────────────────────────────────── */}
          <footer style={{
            textAlign: 'center', padding: '16px',
            fontSize: '12px', color: C.muted,
            background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)',
            borderTop: `1px solid ${C.accent}15`,
            fontFamily: FONT.heading, fontWeight: '600',
          }}>
            Made with ❤️ for <strong style={{ color: C.accent }}>GenLink Hacks 2026</strong> · Helping seniors feel confident with technology
          </footer>
        </div>
      </BrowserRouter>
    </SettingsContext.Provider>
  )
}
