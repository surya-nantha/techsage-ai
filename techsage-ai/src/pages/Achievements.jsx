import React from 'react'
import ClayCard from '../components/Card.jsx'
import { useProgress } from '../hooks/useProgress.js'
import { useSettings } from '../App.jsx'
import { C, SHADOWS, RADIUS, FONT, GRAD } from '../tokens.js'
import achievementsDef from '../data/achievements.json'

export default function Achievements() {
  const { fontSize, language } = useSettings()
  const { progress, earned } = useProgress()

  const pct = Math.round((earned.length / achievementsDef.length) * 100)

  const labels = {
    en: { title: 'Your Achievements', subtitle: 'Every step counts — you are doing great!', earned: 'earned', locked: 'Keep going to unlock', progress: 'Progress' },
    ta: { title: 'உங்கள் சாதனைகள்', subtitle: 'ஒவ்வொரு படியும் முக்கியம்!', earned: 'பெற்றீர்கள்', locked: 'தொடருங்கள்', progress: 'முன்னேற்றம்' },
    hi: { title: 'आपकी उपलब्धियाँ', subtitle: 'हर कदम मायने रखता है — आप बहुत अच्छा कर रहे हैं!', earned: 'अर्जित', locked: 'जारी रखें', progress: 'प्रगति' },
  }
  const L = labels[language] || labels.en

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <ClayCard style={{ background: 'linear-gradient(135deg,rgba(254,243,199,0.5) 0%,rgba(255,255,255,0.72) 60%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#FCD34D,#D97706)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', boxShadow: SHADOWS.button, animation: 'clay-breathe 5s ease-in-out infinite' }}>🏅</div>
          <div>
            <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 3}px`, fontWeight: '900', color: '#78350F', marginBottom: '6px' }}>{L.title}</p>
            <p style={{ fontSize: `${fontSize - 2}px`, color: C.muted }}>{L.subtitle}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 3}px`, fontWeight: '800', color: '#78350F' }}>{L.progress}</span>
            <span style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 3}px`, fontWeight: '900', color: '#78350F' }}>{earned.length} / {achievementsDef.length}</span>
          </div>
          <div style={{ background: '#EFEBF5', borderRadius: '999px', height: '14px', overflow: 'hidden', boxShadow: SHADOWS.pressed }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(135deg,#FCD34D,#D97706)', borderRadius: '999px', transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: SHADOWS.button }}/>
          </div>
        </div>
      </ClayCard>

      {/* Earned */}
      {earned.length > 0 && (
        <div>
          <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 2}px`, fontWeight: '800', color: C.foreground, marginBottom: '14px' }}>
            ✨ {earned.length} {L.earned}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '14px' }}>
            {earned.map(a => (
              <AchievementBadge key={a.id} achievement={a} unlocked fontSize={fontSize} />
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      <div>
        <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 2}px`, fontWeight: '800', color: C.muted, marginBottom: '14px' }}>
          🔒 {L.locked}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '14px' }}>
          {achievementsDef.filter(a => !earned.includes(a)).map(a => (
            <AchievementBadge key={a.id} achievement={a} unlocked={false} fontSize={fontSize} />
          ))}
        </div>
      </div>
    </div>
  )
}

function AchievementBadge({ achievement: a, unlocked, fontSize }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: RADIUS.card,
        background: unlocked
          ? 'linear-gradient(135deg,rgba(254,243,199,0.6) 0%,rgba(255,255,255,0.85) 60%)'
          : 'rgba(239,235,245,0.8)',
        backdropFilter: 'blur(12px)',
        padding: '18px 16px',
        textAlign: 'center',
        boxShadow: hovered && unlocked ? SHADOWS.cardHover : SHADOWS.card,
        transform: hovered && unlocked ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        border: unlocked ? `1.5px solid rgba(217,119,6,0.25)` : '1.5px solid transparent',
        opacity: unlocked ? 1 : 0.55,
      }}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: '50%',
        background: unlocked ? 'linear-gradient(135deg,#FCD34D,#D97706)' : '#D1D5DB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '26px', margin: '0 auto 10px',
        boxShadow: unlocked ? SHADOWS.button : SHADOWS.pressed,
        filter: unlocked ? 'none' : 'grayscale(0.8)',
      }}>
        {unlocked ? a.icon : '🔒'}
      </div>
      <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 4}px`, fontWeight: '900', color: unlocked ? '#78350F' : C.muted, marginBottom: '4px', lineHeight: 1.2 }}>{a.title}</p>
      <p style={{ fontSize: `${fontSize - 6}px`, color: C.muted, lineHeight: 1.5 }}>{a.desc}</p>
    </div>
  )
}

// Need to import useState
import { useState } from 'react'
