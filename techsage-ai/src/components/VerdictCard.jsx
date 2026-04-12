import React, { useEffect } from 'react'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js'
import { useSettings } from '../App.jsx'
import { C, SHADOWS, RADIUS, FONT } from '../tokens.js'
import ClayButton from './ClayButton.jsx'

const VERDICT_CONFIG = {
  SAFE: {
    gradient: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    border: '#10B981',
    iconBg: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
    icon: '✅',
    title: 'This looks safe',
    titleColor: '#065F46',
  },
  SUSPICIOUS: {
    gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    border: '#F59E0B',
    iconBg: 'linear-gradient(135deg, #FCD34D 0%, #D97706 100%)',
    icon: '⚠️',
    title: 'Be careful — looks suspicious',
    titleColor: '#78350F',
  },
  SCAM: {
    gradient: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
    border: '#DC2626',
    iconBg: 'linear-gradient(135deg, #F87171 0%, #DC2626 100%)',
    icon: '🚨',
    title: 'WARNING: This is likely a scam!',
    titleColor: '#7F1D1D',
  },
}

export default function VerdictCard({ verdict, redFlags = [], recommendation }) {
  const { fontSize, language } = useSettings()
  const { speak, stop, isSpeaking } = useSpeechSynthesis()
  const cfg = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.SUSPICIOUS

  useEffect(() => {
    const text = `${cfg.title}. ${redFlags.length > 0 ? 'Warning signs: ' + redFlags.join('. ') + '.' : ''} ${recommendation || ''}`
    speak(text, language)
    return () => stop()
  }, [verdict])

  return (
    <div role="alert" aria-live="assertive" style={{
      borderRadius: RADIUS.card,
      background: cfg.gradient,
      border: `3px solid ${cfg.border}`,
      padding: '28px',
      boxShadow: SHADOWS.card,
      marginTop: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: cfg.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', flexShrink: 0,
          boxShadow: SHADOWS.button,
          animation: 'clay-breathe 4s ease-in-out infinite',
        }}>{cfg.icon}</div>
        <span style={{
          fontFamily: FONT.heading, fontSize: `${fontSize + 4}px`,
          fontWeight: '900', color: cfg.titleColor, lineHeight: 1.2,
        }}>{cfg.title}</span>
      </div>
      {redFlags.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.55)', borderRadius: RADIUS.md,
          padding: '16px 20px', marginBottom: '16px', backdropFilter: 'blur(8px)',
        }}>
          <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize-2}px`, fontWeight: '800', color: cfg.titleColor, marginBottom: '10px' }}>
            Warning signs found:
          </p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {redFlags.map((flag, i) => (
              <li key={i} style={{ fontSize: `${fontSize-2}px`, color: cfg.titleColor, lineHeight: 1.6 }}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
      {recommendation && (
        <div style={{
          background: 'rgba(255,255,255,0.65)', borderRadius: RADIUS.md,
          padding: '16px 20px', marginBottom: '20px', backdropFilter: 'blur(8px)',
        }}>
          <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize-1}px`, fontWeight: '800', color: cfg.titleColor, marginBottom: '4px' }}>What to do:</p>
          <p style={{ fontSize: `${fontSize-1}px`, color: cfg.titleColor, lineHeight: 1.7 }}>{recommendation}</p>
        </div>
      )}
      <ClayButton
        variant={verdict === 'SAFE' ? 'success' : verdict === 'SCAM' ? 'danger' : 'secondary'}
        size="sm"
        onClick={() => isSpeaking ? stop() : speak(`${cfg.title}. ${recommendation}`, language)}
      >
        {isSpeaking ? '⏹ Stop reading' : '🔊 Read aloud'}
      </ClayButton>
    </div>
  )
}
