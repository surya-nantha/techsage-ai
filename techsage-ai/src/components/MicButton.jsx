import React from 'react'

const STATES = {
  idle: {
    bg: '#2E75B6',
    border: '#1F4E79',
    icon: '🎤',
    label: 'Tap to speak',
    pulse: false,
  },
  listening: {
    bg: '#C00000',
    border: '#7F0000',
    icon: '⏹',
    label: 'Tap to stop',
    pulse: true,
  },
  processing: {
    bg: '#7c3aed',
    border: '#4c1d95',
    icon: '⏳',
    label: 'Thinking...',
    pulse: false,
  },
  error: {
    bg: '#d97706',
    border: '#92400e',
    icon: '🔁',
    label: 'Try again',
    pulse: false,
  },
}

export default function MicButton({ state = 'idle', onClick, fontSize = 18 }) {
  const s = STATES[state] || STATES.idle
  const size = Math.max(88, fontSize * 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <button
        onClick={onClick}
        aria-label={s.label}
        aria-live="polite"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: s.bg,
          border: `4px solid ${s.border}`,
          cursor: state === 'processing' ? 'not-allowed' : 'pointer',
          fontSize: `${Math.round(size * 0.4)}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: s.pulse
            ? `0 0 0 8px ${s.bg}33, 0 4px 16px rgba(0,0,0,0.2)`
            : `0 4px 16px rgba(0,0,0,0.2)`,
          transition: 'all 0.2s',
          animation: s.pulse ? 'pulse 1.4s ease-in-out infinite' : 'none',
          outline: 'none',
        }}
        disabled={state === 'processing'}
      >
        <span role="img" aria-hidden="true">{s.icon}</span>
      </button>

      <span
        style={{
          fontSize: `${Math.round(fontSize * 0.85)}px`,
          fontWeight: '700',
          color: s.bg,
          letterSpacing: '0.3px',
        }}
      >
        {s.label}
      </span>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${STATES.listening.bg}55, 0 4px 16px rgba(0,0,0,0.2); }
          50% { box-shadow: 0 0 0 16px ${STATES.listening.bg}11, 0 4px 16px rgba(0,0,0,0.2); }
        }
      `}</style>
    </div>
  )
}
