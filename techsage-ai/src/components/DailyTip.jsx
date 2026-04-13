import React, { useState } from 'react'
import { C, SHADOWS, RADIUS, FONT, GRAD } from '../tokens.js'
import tips from '../data/dailyTips.json'

function getTodaysTip() {
  const day = Math.floor(Date.now() / 86400000)
  return tips[day % tips.length]
}

function SafeImg({ src, alt, style = {} }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return <img src={src} alt={alt} onError={() => setFailed(true)} style={{ display: 'block', ...style }} />
}

const CAT_GRADS = {
  'Safety':      'linear-gradient(135deg,#F87171,#DC2626)',
  'WhatsApp':    'linear-gradient(135deg,#34D399,#059669)',
  'UPI Safety':  'linear-gradient(135deg,#FCD34D,#D97706)',
  'Passwords':   'linear-gradient(135deg,#A78BFA,#7C3AED)',
  'Email':       'linear-gradient(135deg,#60A5FA,#2563EB)',
  'Privacy':     'linear-gradient(135deg,#F472B6,#DB2777)',
  'Internet':    'linear-gradient(135deg,#38BDF8,#0284C7)',
  'Phone Safety':'linear-gradient(135deg,#FCD34D,#D97706)',
  'Banking':     'linear-gradient(135deg,#34D399,#059669)',
  'Social':      'linear-gradient(135deg,#60A5FA,#2563EB)',
  'Health Tech': 'linear-gradient(135deg,#34D399,#059669)',
  'Daily Life':  'linear-gradient(135deg,#A78BFA,#7C3AED)',
  'Shopping':    'linear-gradient(135deg,#F472B6,#DB2777)',
}

export default function DailyTip({ fontSize = 18, onRead }) {
  const [expanded, setExpanded] = useState(false)
  const tip = getTodaysTip()
  const grad = CAT_GRADS[tip.category] || GRAD.primaryBtn

  const handleExpand = () => {
    if (!expanded) onRead?.()
    setExpanded(e => !e)
  }

  return (
    <div style={{
      borderRadius: RADIUS.card,
      background: 'linear-gradient(135deg,rgba(254,243,199,0.5) 0%,rgba(255,255,255,0.82) 60%)',
      backdropFilter: 'blur(16px)',
      border: `1.5px solid ${C.amber}40`,
      boxShadow: SHADOWS.card,
      overflow: 'hidden',
    }}>
      {/* Header row */}
      <button onClick={handleExpand} style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        width: '100%', padding: '18px 20px',
        background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: grad, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', boxShadow: SHADOWS.button,
          animation: 'clay-breathe 5s ease-in-out infinite',
        }}>{tip.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span style={{ background: grad, borderRadius: RADIUS.full, padding: '3px 10px', fontSize: '11px', fontFamily: FONT.heading, fontWeight: '800', color: '#fff', boxShadow: SHADOWS.button }}>
              {tip.category}
            </span>
            <span style={{ fontFamily: FONT.heading, fontSize: '11px', fontWeight: '700', color: C.amber, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              💡 Tip of the day
            </span>
          </div>
          <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize}px`, fontWeight: '900', color: '#78350F', lineHeight: 1.3 }}>{tip.title}</p>
        </div>
        {/* Couple-tea illustration peek — visible only when collapsed */}
        {!expanded && (
          <div style={{ flexShrink: 0, opacity: 0.7 }}>
            <SafeImg src="/images/illus-couple-tea.png" alt="Two seniors having tea and chatting" style={{ width: '60px', height: '50px', objectFit: 'contain' }} />
          </div>
        )}
        <span style={{ fontSize: '18px', color: C.muted, flexShrink: 0, transition: 'transform 0.3s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div style={{ padding: '0 20px 22px' }}>
          {/* The full tip text in a recessed box */}
          <div style={{ background: 'rgba(255,255,255,0.65)', borderRadius: RADIUS.md, padding: '18px 20px', marginBottom: '14px', boxShadow: 'inset 4px 4px 8px rgba(217,119,6,0.08)' }}>
            <p style={{ fontSize: `${fontSize}px`, color: '#78350F', lineHeight: 1.85, fontWeight: '500' }}>{tip.tip}</p>
          </div>
          {/* Source + illustration side-by-side */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
            {tip.source && (
              <p style={{ fontSize: `${fontSize - 5}px`, color: C.muted, fontFamily: FONT.heading, fontWeight: '700' }}>
                Source: {tip.source}
              </p>
            )}
            <SafeImg
              src="/images/illus-couple-tea.png"
              alt="Two seniors sitting comfortably in armchairs having a friendly conversation over tea"
              style={{ width: '90px', height: '72px', objectFit: 'contain', flexShrink: 0 }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
