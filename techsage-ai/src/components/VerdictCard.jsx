import React, { useEffect } from 'react'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js'
import { useSettings } from '../App.jsx'

const VERDICT_CONFIG = {
  SAFE: {
    bg: '#f0fdf4',
    border: '#16a34a',
    icon: '✅',
    title: 'This looks safe',
    titleColor: '#15803d',
  },
  SUSPICIOUS: {
    bg: '#fffbeb',
    border: '#d97706',
    icon: '⚠️',
    title: 'Be careful — this looks suspicious',
    titleColor: '#b45309',
  },
  SCAM: {
    bg: '#fef2f2',
    border: '#dc2626',
    icon: '🚨',
    title: 'WARNING: This is likely a scam!',
    titleColor: '#b91c1c',
  },
}

export default function VerdictCard({ verdict, redFlags = [], recommendation }) {
  const { fontSize, language } = useSettings()
  const { speak, stop, isSpeaking } = useSpeechSynthesis()

  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.SUSPICIOUS

  // Auto-read the verdict aloud when it appears
  useEffect(() => {
    const text = `${config.title}. ${redFlags.length > 0 ? 'Red flags: ' + redFlags.join('. ') + '.' : ''} ${recommendation || ''}`
    speak(text, language)
    return () => stop()
  }, [verdict])

  return (
    <div
      style={{
        background: config.bg,
        border: `3px solid ${config.border}`,
        borderRadius: '16px',
        padding: '24px',
        marginTop: '16px',
      }}
      role="alert"
      aria-live="assertive"
    >
      {/* Verdict header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '40px' }}>{config.icon}</span>
        <span style={{ fontSize: `${fontSize + 4}px`, fontWeight: '800', color: config.titleColor }}>
          {config.title}
        </span>
      </div>

      {/* Red flags */}
      {redFlags.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: `${fontSize - 2}px`, fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
            Warning signs found:
          </p>
          <ul style={{ paddingLeft: '20px' }}>
            {redFlags.map((flag, i) => (
              <li key={i} style={{ fontSize: `${fontSize - 2}px`, color: '#4b5563', marginBottom: '6px', lineHeight: 1.5 }}>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      {recommendation && (
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '16px',
        }}>
          <p style={{ fontSize: `${fontSize - 1}px`, fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
            What to do:
          </p>
          <p style={{ fontSize: `${fontSize - 1}px`, color: '#374151', lineHeight: 1.6 }}>
            {recommendation}
          </p>
        </div>
      )}

      {/* TTS control */}
      <button
        onClick={() => isSpeaking ? stop() : speak(`${config.title}. ${recommendation}`, language)}
        style={{
          background: 'transparent',
          border: `2px solid ${config.border}`,
          borderRadius: '10px',
          padding: '10px 18px',
          fontSize: `${fontSize - 3}px`,
          color: config.titleColor,
          fontWeight: '700',
          cursor: 'pointer',
        }}
      >
        {isSpeaking ? '⏹ Stop reading' : '🔊 Read aloud'}
      </button>
    </div>
  )
}
