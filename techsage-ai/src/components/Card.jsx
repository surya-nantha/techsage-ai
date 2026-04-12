import React, { useState } from 'react'
import { SHADOWS, RADIUS, C } from '../tokens.js'

export default function ClayCard({
  children,
  style = {},
  hoverable = false,
  accent = null,
  padding = '28px',
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: RADIUS.card,
        background: C.cardBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding,
        color: C.foreground,
        boxShadow: hovered ? SHADOWS.cardHover : SHADOWS.card,
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        borderLeft: accent ? `5px solid ${accent}` : 'none',
        ...style,
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
