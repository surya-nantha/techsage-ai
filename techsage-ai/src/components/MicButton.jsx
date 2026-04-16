import React, { useState } from 'react'
import { Mic, Square, Loader2, RotateCcw } from 'lucide-react'

const STATES = {
  idle: {
    gradient: 'bg-gradient-to-br from-wave to-ocean', // New theme colors!
    Icon: Mic,
    label: 'Tap to speak',
    pulse: false,
  },
  listening: {
    gradient: 'bg-gradient-to-br from-red-400 to-danger',
    Icon: Square,
    label: 'Tap to stop',
    pulse: true,
  },
  processing: {
    gradient: 'bg-gradient-to-br from-amber to-caution',
    Icon: Loader2,
    label: 'Thinking...',
    pulse: false,
  },
  error: {
    gradient: 'bg-gradient-to-br from-orange-400 to-amber',
    Icon: RotateCcw,
    label: 'Try again',
    pulse: false,
  },
}

export default function MicButton({ state = 'idle', onClick, fontSize = 18 }) {
  const [pressed, setPressed] = useState(false)
  const s = STATES[state] || STATES.idle
  const size = Math.max(96, fontSize * 5.2)

  return (
    <div className="flex flex-col items-center gap-3">
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
        className={`
          rounded-full border-none flex items-center justify-center outline-none text-white
          transition-transform duration-150 ease-out
          ${s.gradient}
          ${state === 'processing' ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${pressed ? 'scale-90' : 'scale-100'}
          ${s.pulse ? 'animate-[clay-pulse-ring_1.4s_ease-in-out_infinite]' : ''}
          ${state === 'processing' ? 'animate-[clay-breathe_2s_ease-in-out_infinite]' : ''}
        `}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: 'var(--shadow-clay-button)',
        }}
      >
        {/* If processing, spin the Loader icon. Otherwise, show normal icon */}
        {state === 'processing' ? (
          <s.Icon className="animate-spin" size={size * 0.38} strokeWidth={2.5} />
        ) : (
          <s.Icon size={size * 0.38} strokeWidth={2.5} />
        )}
      </button>
      <span 
        className="font-heading font-extrabold text-ocean tracking-wide" 
        style={{ fontSize: `${Math.round(fontSize * 0.82)}px` }}
      >
        {s.label}
      </span>
    </div>
  )
}