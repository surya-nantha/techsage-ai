import React from 'react'

export default function Card({ children, style = {}, accent = null }) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: '20px',
        borderLeft: accent ? `6px solid ${accent}` : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
