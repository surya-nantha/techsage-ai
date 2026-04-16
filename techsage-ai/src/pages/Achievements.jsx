import { useState } from 'react'
import React from 'react'
import ClayCard from '../components/Card.jsx'
import ClayButton from '../components/ClayButton.jsx'
import { useProgress } from '../hooks/useProgress.js'
import { useSettings } from '../App.jsx'
import { C, SHADOWS, RADIUS, FONT, GRAD } from '../tokens.js'
import achievementsDef from '../data/achievements.json'

function SafeImg({ src, alt, style = {} }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return <img src={src} alt={alt} onError={() => setFailed(true)} style={{ display: 'block', ...style }} />
}

function AchievementBadge({ achievement: a, unlocked, fontSize }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: RADIUS.card, background: unlocked ? 'linear-gradient(135deg,rgba(254,243,199,0.6),rgba(255,255,255,0.88))' : 'rgba(239,235,245,0.8)', backdropFilter: 'blur(12px)', padding: '18px 16px', textAlign: 'center', boxShadow: hovered && unlocked ? SHADOWS.cardHover : SHADOWS.card, transform: hovered && unlocked ? 'translateY(-6px)' : 'translateY(0)', transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)', border: unlocked ? '1.5px solid rgba(217,119,6,0.25)' : '1.5px solid transparent', opacity: unlocked ? 1 : 0.55 }}>
      <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: unlocked ? 'linear-gradient(135deg,#FCD34D,#D97706)' : '#D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 10px', boxShadow: unlocked ? SHADOWS.button : SHADOWS.pressed, filter: unlocked ? 'none' : 'grayscale(0.8)' }}>
        {unlocked ? a.icon : '🔒'}
      </div>
      <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 4}px`, fontWeight: '900', color: unlocked ? '#78350F' : C.muted, marginBottom: '4px', lineHeight: 1.2 }}>{a.title}</p>
      <p style={{ fontSize: `${fontSize - 6}px`, color: C.muted, lineHeight: 1.5 }}>{a.desc}</p>
    </div>
  )
}

export default function Achievements() {
  const { fontSize, language } = useSettings()
  const { progress, earned } = useProgress()
  const pct = Math.round((earned.length / achievementsDef.length) * 100)
  const allDone = earned.length === achievementsDef.length

  const L = {
    en: { title: 'Your Achievements', subtitle: 'Every step counts — you are doing great!', earnedLabel: 'earned', lockedLabel: 'Keep going to unlock', progressLabel: 'Progress', quoteAttr: 'Dr. S.B. Mujumdar, Founder of Symbiosis', quote: '"It\'s no longer about literacy, it\'s about digital literacy."', allDoneTitle: 'You are a TechSage! 🎓', allDoneBody: 'You have unlocked every achievement. You are inspiring proof that technology has no age limit.' },
    ta: { title: 'உங்கள் சாதனைகள்', subtitle: 'ஒவ்வொரு படியும் முக்கியம்!', earnedLabel: 'பெற்றீர்கள்', lockedLabel: 'தொடருங்கள்', progressLabel: 'முன்னேற்றம்', quoteAttr: 'டாக்டர் S.B. முஜும்தார், சிம்பயோசிஸ் நிறுவனர்', quote: '"டிஜிட்டல் எழுத்தறிவே இன்றைய உண்மையான எழுத்தறிவு."', allDoneTitle: 'நீங்கள் TechSage! 🎓', allDoneBody: 'அனைத்து சாதனைகளையும் பெற்றீர்கள்!' },
    hi: { title: 'आपकी उपलब्धियाँ', subtitle: 'हर कदम मायने रखता है!', earnedLabel: 'अर्जित', lockedLabel: 'जारी रखें', progressLabel: 'प्रगति', quoteAttr: 'डॉ. S.B. मुजुमदार, सिम्बायोसिस के संस्थापक', quote: '"अब यह साक्षरता के बारे में नहीं, डिजिटल साक्षरता के बारे में है।"', allDoneTitle: 'आप TechSage हैं! 🎓', allDoneBody: 'आपने सभी उपलब्धियाँ अर्जित की हैं!' },
  }
  const l = L[language] || L.en

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ══ HEADER ════════════════════════════════════════════ */}
      <ClayCard style={{ background: 'linear-gradient(135deg,rgba(254,243,199,0.5),rgba(255,255,255,0.82))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#FCD34D,#D97706)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', boxShadow: SHADOWS.button, animation: 'clay-breathe 5s ease-in-out infinite' }}>🏅</div>
          <div>
            <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 3}px`, fontWeight: '900', color: '#78350F', marginBottom: '4px' }}>{l.title}</p>
            <p style={{ fontSize: `${fontSize - 2}px`, color: C.muted }}>{l.subtitle}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 3}px`, fontWeight: '800', color: '#78350F' }}>{l.progressLabel}</span>
          <span style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 3}px`, fontWeight: '900', color: '#78350F' }}>{earned.length} / {achievementsDef.length}</span>
        </div>
        <div style={{ background: '#EFEBF5', borderRadius: '999px', height: '14px', overflow: 'hidden', boxShadow: SHADOWS.pressed }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(135deg,#FCD34D,#D97706)', borderRadius: '999px', transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: SHADOWS.button }} />
        </div>
      </ClayCard>

      {/* ══ ALL DONE CELEBRATION — dancing seniors ════════════
          Only shows when every badge is earned — pure joy moment */}
      {allDone && (
        <div style={{ borderRadius: RADIUS.card, background: GRAD.primaryBtn, padding: '28px 24px', boxShadow: SHADOWS.deep, textAlign: 'center' }}>
          <SafeImg src="/images/illus-seniors-dancing.png" alt="Happy seniors celebrating: singing, dancing and playing guitar" style={{ maxWidth: '320px', width: '100%', margin: '0 auto 20px', objectFit: 'contain' }} />
          <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 4}px`, fontWeight: '900', color: '#fff', marginBottom: '8px' }}>{l.allDoneTitle}</p>
          <p style={{ fontSize: `${fontSize - 2}px`, color: 'rgba(255,255,255,0.88)', lineHeight: 1.7 }}>{l.allDoneBody}</p>
        </div>
      )}

      {/* ══ EARNED BADGES ════════════════════════════════════ */}
      {earned.length > 0 && (
        <div>
          <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 2}px`, fontWeight: '800', color: C.foreground, marginBottom: '14px' }}>
            ✨ {earned.length} {l.earnedLabel}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '14px' }}>
            {earned.map(a => <AchievementBadge key={a.id} achievement={a} unlocked fontSize={fontSize} />)}
          </div>
        </div>
      )}

      {/* ══ LOCKED BADGES ════════════════════════════════════ */}
      <div>
        <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 2}px`, fontWeight: '800', color: C.muted, marginBottom: '14px' }}>
          🔒 {l.lockedLabel}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '14px' }}>
          {achievementsDef.filter(a => !earned.find(e => e.id === a.id)).map(a => (
            <AchievementBadge key={a.id} achievement={a} unlocked={false} fontSize={fontSize} />
          ))}
        </div>
      </div>

      {/* ══ INSPIRATION QUOTE — real speaker photo ════════════
          Dr. Mujumdar at the mic; his quote about digital literacy
          gives authority and warmth to the achievements page      */}
      <div style={{
        borderRadius: RADIUS.card,
        background: 'rgba(255,255,255,0.80)',
        backdropFilter: 'blur(16px)',
        boxShadow: SHADOWS.card,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'stretch',
      }}>
        {/* Real event speaker photo */}
        <div style={{ width: '110px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
          <SafeImg
            src="/images/real-speaker-mic.png"
            alt="Dr. S.B. Mujumdar, founder of Symbiosis, speaking at the Digital Literacy for Senior Citizens event"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.55) 100%)' }} />
        </div>
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
          <p style={{ fontSize: `${fontSize - 1}px`, color: C.foreground, lineHeight: 1.7, fontStyle: 'italic' }}>
            {l.quote}
          </p>
          <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 4}px`, fontWeight: '800', color: C.accent }}>
            — {l.quoteAttr}
          </p>
        </div>
      </div>
    </div>
  )
}

