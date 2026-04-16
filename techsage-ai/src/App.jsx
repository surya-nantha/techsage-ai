import React, { createContext, useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
// 1. Import our new beautiful icons!
import { Bot, Home, ShieldCheck, Target, BookOpen, Award, ChevronDown } from 'lucide-react'

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

// 2. Updated NavTab to handle Lucide Icon components
function NavTab({ to, icon: Icon, label }) {
  return (
    <NavLink to={to} end={to === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap transition border-b-2 min-w-16
        ${isActive ? 'border-ocean text-ocean bg-green-50' : 'border-transparent text-gray-400 hover:text-ocean hover:bg-gray-50'}`
      }
    >
      <Icon size={22} strokeWidth={2.5} />
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
          <header className="bg-gradient-to-r from-wave to-ocean sticky top-0 z-50 shadow-md">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
              
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                  {/* 3. Replaced emoji with Bot icon */}
                  <Bot size={26} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-white font-bold text-lg leading-tight">TechSage AI</div>
                  <div className="text-white/75 text-xs font-medium">
                    {language === 'ta' ? 'உங்கள் தொழில்நுட்ப உதவியாளர்' : language === 'hi' ? 'आपका तकनीकी सहायक' : 'Your friendly technology helper'}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button onClick={() => setFontSize(f => Math.max(f - 2, 14))}
                  className="w-10 h-10 rounded-full bg-white/20 text-white font-bold text-sm hover:bg-white/30 transition shadow-inner">
                  A−
                </button>
                <button onClick={() => setFontSize(f => Math.min(f + 2, 26))}
                  className="w-10 h-10 rounded-full bg-white/20 text-white font-bold text-sm hover:bg-white/30 transition shadow-inner">
                  A+
                </button>

                {/* Language selector */}
                <div className="relative">
                  <button onClick={() => setLangMenuOpen(o => !o)}
                    className="h-10 px-4 rounded-full bg-white/20 text-white font-bold text-sm flex items-center gap-1.5 hover:bg-white/30 transition shadow-inner">
                    {currentLang?.label} 
                    <ChevronDown size={16} strokeWidth={3} />
                  </button>
                  {langMenuOpen && (
                    <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl overflow-hidden z-50 min-w-36 border border-gray-100">
                      {LANGUAGES.map(l => (
                        <button key={l.code}
                          onClick={() => { setLanguage(l.code); setLangMenuOpen(false) }}
                          className={`block w-full px-4 py-3 text-left text-sm font-bold hover:bg-gray-50 transition ${language === l.code ? 'text-ocean' : 'text-gray-500'}`}>
                          {l.label} — {l.full}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* ── Nav ────────────────────────────────────────────── */}
          <nav className="bg-white sticky top-[68px] z-40 border-b border-gray-200 shadow-sm">
            <div className="max-w-4xl mx-auto flex overflow-x-auto hide-scrollbar">
              {/* 4. Pass the Lucide components directly as props */}
              <NavTab to="/"             icon={Home}        label={NL[0]} />
              <NavTab to="/scam-check"   icon={ShieldCheck} label={NL[1]} />
              <NavTab to="/quiz"         icon={Target}      label={NL[2]} />
              <NavTab to="/tutorials"    icon={BookOpen}    label={NL[3]} />
              <NavTab to="/achievements" icon={Award}       label={NL[4]} />
            </div>
          </nav>

          {/* ── Content ────────────────────────────────────────── */}
          <main className="flex-1 px-4 py-6 md:py-8 max-w-4xl w-full mx-auto">
            <Routes>
              <Route path="/"             element={<HomePage />} />
              <Route path="/scam-check"   element={<ScamDetector />} />
              <Route path="/quiz"         element={<ScamQuiz />} />
              <Route path="/tutorials"    element={<Tutorials />} />
              <Route path="/achievements" element={<Achievements />} />
            </Routes>
          </main>

          {/* ── Footer ─────────────────────────────────────────── */}
          <footer className="bg-ocean text-white/90 text-center p-4 text-sm font-medium">
            Made with ❤️ for <strong>GenLink Hacks 2026</strong> · Helping seniors feel confident with technology
          </footer>
        </div>
      </BrowserRouter>
    </SettingsContext.Provider>
  )
}