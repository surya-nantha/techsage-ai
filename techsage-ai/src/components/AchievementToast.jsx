import React, { useEffect, useState } from 'react'
import { C, SHADOWS, RADIUS, FONT, GRAD } from '../tokens.js'

// Pops up when a new achievement is unlocked — auto-dismisses after 4s
export default function AchievementToast({ achievement, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!achievement) return
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 400) }, 4000)
    return () => clearTimeout(t)
  }, [achievement])

  if (!achievement) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? '0' : '80px'})`,
      opacity: visible ? 1 : 0,
      transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: RADIUS.md,
      padding: '14px 20px',
      boxShadow: SHADOWS.deep,
      border: `2px solid ${C.accent}30`,
      maxWidth: '340px',
      width: 'calc(100vw - 40px)',
    }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '50%',
        background: GRAD.primaryBtn,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '26px', flexShrink: 0,
        boxShadow: SHADOWS.button,
        animation: 'clay-breathe 3s ease-in-out infinite',
      }}>
        {achievement.icon}
      </div>
      <div>
        <p style={{ fontFamily: FONT.heading, fontSize: '13px', fontWeight: '800', color: C.accent, marginBottom: '2px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          🏅 Achievement unlocked!
        </p>
        <p style={{ fontFamily: FONT.heading, fontSize: '16px', fontWeight: '900', color: C.foreground, marginBottom: '2px' }}>
          {achievement.title}
        </p>
        <p style={{ fontSize: '13px', color: C.muted }}>
          {achievement.desc}
        </p>
      </div>
    </div>
  )
}
