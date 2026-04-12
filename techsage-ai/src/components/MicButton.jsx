import React, { useState } from 'react'
import { C, SHADOWS, GRAD, FONT } from '../tokens.js'

const STATES = {
  idle: {
    gradient: GRAD.primaryBtn,
    icon: '🎤',
    label: 'Tap to speak',
    pulse: false,
  },
  listening: {
    gradient: 'linear-gradient(135deg, #F87171 0%, #C00000 100%)',
    icon: '⏹',
    label: 'Tap to stop',
    pulse: true,
  },
  processing: {
    gradient: `linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)`,
    icon: '✨',
    label: 'Thinking...',
    pulse: false,
  },
  error: {
    gradient: 'linear-gradient(135deg, #FCD34D 0%, #D97706 100%)',
    icon: '🔁',
    label: 'Try again',
    pulse: false,
  },
}

export default function MicButton({ state = 'idle', onClick, fontSize = 18 }) {
  const [pressed, setPressed] = useState(false)
  const s = STATES[state] || STATES.idle
  const size = Math.max(96, fontSize * 5.2)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <button
        onClick={onClick}
        disabled={state === 'processing'}
        aria-label={s.label}
        aria-live="polite"
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: s.gradient,
          border: 'none',
          cursor: state === 'processing' ? 'not-allowed' : 'pointer',
          fontSize: `${Math.round(size * 0.38)}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
          boxShadow: SHADOWS.button,
          animation: s.pulse
            ? 'clay-pulse-ring 1.4s ease-in-out infinite'
            : state === 'processing'
            ? 'clay-breathe 2s ease-in-out infinite'
            : 'none',
          transform: pressed ? 'scale(0.90)' : 'scale(1)',
          transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {state === 'processing' ? (
          <span style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#fff',
                animation: `dots 1.2s ease-in-out ${i * 0.2}s infinite`,
                display: 'inline-block',
              }} />
            ))}
          </span>
        ) : (
          <span role="img" aria-hidden="true">{s.icon}</span>
        )}
      </button>
      <span style={{
        fontFamily: FONT.heading,
        fontSize: `${Math.round(fontSize * 0.82)}px`,
        fontWeight: '800',
        color: C.accent,
        letterSpacing: '0.4px',
      }}>
        {s.label}
      </span>
    </div>
  )
}
