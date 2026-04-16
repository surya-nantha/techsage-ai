import React, { useState } from 'react'

export default function ClayCard({
  children,
  className = "",
  hoverable = false,
  accent = null,
  padding = 'p-6 md:p-7', // Tailwind responsive padding
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      className={`relative overflow-hidden rounded-[32px] text-ink transition-all duration-400 ease-out backdrop-blur-md
        ${hovered ? '-translate-y-2' : 'translate-y-0'}
        ${padding} ${className}
      `}
      style={{
        background: 'rgba(255, 255, 255, 0.72)',
        boxShadow: hovered ? 'var(--shadow-clay-card-hover)' : 'var(--shadow-clay-card)',
        borderLeft: accent ? `5px solid ${accent}` : 'none',
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}