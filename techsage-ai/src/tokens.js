// src/tokens.js — Single source of truth for all design values.
// Import from here instead of hardcoding strings anywhere.

export const C = {
  canvas:       '#F4F1FA',
  cardBg:       'rgba(255,255,255,0.72)',
  foreground:   '#332F3A',
  muted:        '#635F69',
  accent:       '#7C3AED',
  accentLight:  '#A78BFA',
  accentAlt:    '#DB2777',
  sky:          '#0EA5E9',
  emerald:      '#10B981',
  amber:        '#F59E0B',
  white:        '#FFFFFF',
}

export const SHADOWS = {
  deep:        'var(--shadow-clay-deep)',
  card:        'var(--shadow-clay-card)',
  cardHover:   'var(--shadow-clay-card-hover)',
  button:      'var(--shadow-clay-button)',
  buttonHover: 'var(--shadow-clay-button-hover)',
  pressed:     'var(--shadow-clay-pressed)',
}

export const RADIUS = {
  xl:   '60px',
  lg:   '48px',
  card: '32px',
  md:   '24px',
  btn:  '20px',
  sm:   '16px',
  full: '9999px',
}

export const FONT = {
  heading: '"Nunito", sans-serif',
  body:    '"DM Sans", sans-serif',
}

// Gradient helpers
export const GRAD = {
  primaryBtn: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
  iconBlue:   'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)',
  iconPurple: 'linear-gradient(135deg, #C084FC 0%, #7C3AED 100%)',
  iconPink:   'linear-gradient(135deg, #F472B6 0%, #DB2777 100%)',
  iconGreen:  'linear-gradient(135deg, #34D399 0%, #059669 100%)',
  iconAmber:  'linear-gradient(135deg, #FCD34D 0%, #D97706 100%)',
  iconSky:    'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
}
