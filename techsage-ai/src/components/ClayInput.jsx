import React, { useState } from 'react'
import { SHADOWS, RADIUS, C, FONT } from '../tokens.js'

export default function ClayInput({
  value,
  onChange,
  onKeyDown,
  placeholder,
  fontSize = 18,
  multiline = false,
  rows = 5,
  inputRef,
  style = {},
}) {
  const [focused, setFocused] = useState(false)

  const base = {
    width: '100%',
    padding: '16px 20px',
    borderRadius: RADIUS.md,
    border: focused ? `2px solid ${C.accentLight}` : '2px solid transparent',
    background: focused ? '#fff' : '#EFEBF5',
    color: C.foreground,
    fontFamily: FONT.body,
    fontSize: `${fontSize}px`,
    lineHeight: 1.6,
    outline: 'none',
    resize: multiline ? 'vertical' : 'none',
    boxShadow: focused
      ? `0 0 0 4px ${C.accent}22, ${SHADOWS.card}`
      : SHADOWS.pressed,
    transition: 'all 0.22s ease',
    ...style,
  }

  const sharedProps = {
    value,
    onChange,
    onKeyDown,
    placeholder,
    onFocus: () => setFocused(true),
    onBlur:  () => setFocused(false),
    style: base,
  }

  if (multiline) {
    return <textarea rows={rows} {...sharedProps} />
  }

  return <input ref={inputRef} type="text" {...sharedProps} />
}
