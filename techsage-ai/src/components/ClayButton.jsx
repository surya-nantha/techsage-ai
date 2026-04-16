import React, { useState } from 'react'

// Mapped directly to your official color palette
const VARIANT_STYLES = {
  primary: {
    baseClass: 'bg-gradient-to-br from-wave to-ocean text-white border-none',
  },
  secondary: {
    baseClass: 'bg-white text-ink border-none',
  },
  ghost: {
    baseClass: 'bg-transparent text-ocean border-2 border-ocean/30',
  },
  danger: {
    baseClass: 'bg-gradient-to-br from-red-400 to-danger text-white border-none',
  },
  success: {
    baseClass: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-none',
  },
}

const SIZE_STYLES = {
  sm: { height: 'h-[44px]', padding: 'px-4', fontSize: 'text-sm' },
  md: { height: 'h-[56px]', padding: 'px-7', fontSize: 'text-base' },
  lg: { height: 'h-[64px]', padding: 'px-9', fontSize: 'text-lg' },
}

export default function ClayButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = "",
  fullWidth = false,
  type = 'button',
}) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.primary
  const s = SIZE_STYLES[size] || SIZE_STYLES.md

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => !disabled && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className={`
        inline-flex items-center justify-center gap-2 rounded-[20px] font-heading font-extrabold tracking-wide select-none outline-none
        transition-all duration-200 ease-out
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${s.height} ${s.padding} ${s.fontSize}
        ${v.baseClass}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${pressed ? 'scale-[0.92] translate-y-0' : hovered ? '-translate-y-1' : 'translate-y-0 scale-100'}
        ${className}
      `}
      style={{
        boxShadow: pressed
          ? 'var(--shadow-clay-pressed)'
          : hovered
          ? 'var(--shadow-clay-button-hover)'
          : 'var(--shadow-clay-button)',
      }}
    >
      {children}
    </button>
  )
}