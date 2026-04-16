import React, { useState } from 'react'

export default function ClayInput({
  value,
  onChange,
  onKeyDown,
  placeholder,
  fontSize = 18,
  multiline = false,
  rows = 5,
  inputRef,
  className = "",
}) {
  const [focused, setFocused] = useState(false)

  const sharedProps = {
    value,
    onChange,
    onKeyDown,
    placeholder,
    onFocus: () => setFocused(true),
    onBlur:  () => setFocused(false),
    className: `
      w-full px-5 py-4 rounded-[24px] text-ink font-body leading-relaxed outline-none
      transition-all duration-200 ease-out
      ${focused ? 'bg-white border-2 border-wave' : 'bg-[#EFEBF5] border-2 border-transparent'}
      ${className}
    `,
    style: {
      fontSize: `${fontSize}px`,
      boxShadow: focused
        ? '0 0 0 4px rgba(59, 130, 246, 0.2), var(--shadow-clay-card)' // Now Wave Blue!
        : 'var(--shadow-clay-pressed)',
    }
  }

  if (multiline) {
    return <textarea ref={inputRef} rows={rows} className="resize-y" {...sharedProps} />
  }

  return <input ref={inputRef} type="text" {...sharedProps} />
}