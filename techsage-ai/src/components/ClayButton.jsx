import React, { useState } from 'react'
import { SHADOWS, RADIUS, GRAD, C, FONT } from '../tokens.js'

/**
 * ClayButton variants: 'primary' | 'secondary' | 'ghost' | 'danger'
 * Sizes: 'sm' | 'md' | 'lg'
 */
const VARIANT_STYLES = {
  primary: {
    background:  GRAD.primaryBtn,
    color:       '#fff',
    border:      'none',
  },
  secondary: {
    background:  '#fff',
    color:       C.foreground,
    border:      'none',
  },
  ghost: {
    background:  'transparent',
    color:       C.accent,
    border:      `2px solid ${C.accent}33`,
  },
  danger: {
    background:  'linear-gradient(135deg, #F87171 0%, #DC2626 100%)',
    color:       '#fff',
    border:      'none',
  },
  success: {
    background:  'linear-gradient(135deg, #34D399 0%, #059669 100%)',
    color:       '#fff',
    border:      'none',
  },
}

const SIZE_STYLES = {
  sm: { height: '44px', padding: '0 18px', fontSize: '14px' },
  md: { height: '56px', padding: '0 28px', fontSize: '16px' },
  lg: { height: '64px', padding: '0 36px', fontSize: '18px' },
}

export default function ClayButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style = {},
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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: fullWidth ? '100%' : 'auto',
        height: s.height,
        padding: s.padding,
        borderRadius: RADIUS.btn,
        fontFamily: FONT.heading,
        fontSize: s.fontSize,
        fontWeight: '800',
        letterSpacing: '0.3px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        outline: 'none',
        transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: pressed
          ? SHADOWS.pressed
          : hovered
          ? SHADOWS.buttonHover
          : SHADOWS.button,
        transform: pressed
          ? 'scale(0.92) translateY(0)'
          : hovered
          ? 'translateY(-4px)'
          : 'translateY(0) scale(1)',
        ...v,
        ...style,
      }}
    >
      {children}
    </button>
  )
}
