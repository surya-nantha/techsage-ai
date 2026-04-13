import React, { useState } from 'react'
import ClayCard from '../components/Card.jsx'
import ClayButton from '../components/ClayButton.jsx'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js'
import { useSettings } from '../App.jsx'
import { C, SHADOWS, RADIUS, FONT, GRAD } from '../tokens.js'
import tutorials from '../data/tutorials.json'

// Each tutorial gets a distinct icon gradient so the grid feels like a candy-store shelf
const CARD_GRADIENTS = [
  GRAD.iconBlue,
  GRAD.iconPurple,
  GRAD.iconPink,
  GRAD.iconGreen,
  GRAD.iconAmber,
  GRAD.iconSky,
]

const CARD_BG_TINTS = [
  'linear-gradient(135deg, rgba(219,234,254,0.45) 0%, rgba(255,255,255,0.72) 60%)',
  'linear-gradient(135deg, rgba(237,233,254,0.45) 0%, rgba(255,255,255,0.72) 60%)',
  'linear-gradient(135deg, rgba(252,231,243,0.45) 0%, rgba(255,255,255,0.72) 60%)',
  'linear-gradient(135deg, rgba(209,250,229,0.45) 0%, rgba(255,255,255,0.72) 60%)',
  'linear-gradient(135deg, rgba(254,243,199,0.45) 0%, rgba(255,255,255,0.72) 60%)',
  'linear-gradient(135deg, rgba(224,242,254,0.45) 0%, rgba(255,255,255,0.72) 60%)',
]

const DIFFICULTY_CONFIG = {
  Beginner:     { bg: 'linear-gradient(135deg, #34D399, #059669)', label: '🌱 Beginner' },
  Intermediate: { bg: 'linear-gradient(135deg, #FCD34D, #D97706)', label: '⚡ Intermediate' },
}

const TUTORIAL_IMAGES = {
  email:     '/img-email.png',
  videocall: '/img-video-call.png',
  wifi:      '/img-wifi.png',
  photos:    '/img-photo-sharing.png',
  ai:        '/img-ai-assistant.png',
  passwords: '/img-password.png',
  privacy:   '/img-online-safety.png',
}

// ─── Tutorial step viewer ─────────────────────────────────────────
function TutorialViewer({ tutorial, colorIdx, onBack }) {
  const { fontSize, language } = useSettings()
  const { speak, stop, isSpeaking } = useSpeechSynthesis()
  const [step, setStep] = useState(0)
  const current = tutorial.steps[step]
  const total   = tutorial.steps.length
  const grad    = CARD_GRADIENTS[colorIdx % CARD_GRADIENTS.length]

  const goTo = (i) => { stop(); setStep(i) }
  const prev = () => goTo(Math.max(step - 1, 0))
  const next = () => { stop(); step < total - 1 ? setStep(step + 1) : onBack() }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Back */}
      <ClayButton variant="ghost" size="sm" onClick={() => { stop(); onBack() }}>
        ← Back to tutorials
      </ClayButton>

      {/* Tutorial identity card */}
      <ClayCard style={{ background: CARD_BG_TINTS[colorIdx % CARD_BG_TINTS.length] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '70px', height: '70px', borderRadius: '50%',
            background: grad, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '34px', boxShadow: SHADOWS.button,
            animation: 'clay-breathe 5s ease-in-out infinite',
          }}>
            {tutorial.icon}
          </div>
          <div>
            <p style={{
              fontFamily: FONT.heading, fontSize: `${fontSize + 3}px`,
              fontWeight: '900', color: C.foreground, marginBottom: '6px', lineHeight: 1.2,
            }}>
              {tutorial.title}
            </p>
            <p style={{ fontSize: `${fontSize - 3}px`, color: C.muted, lineHeight: 1.6 }}>
              {tutorial.description}
            </p>
            {TUTORIAL_IMAGES[tutorial.id] && (
              <img
                src={TUTORIAL_IMAGES[tutorial.id]}
                alt={tutorial.title}
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  borderRadius: RADIUS.md,
                  marginTop: '18px',
                  boxShadow: SHADOWS.card,
                }}
              />
            )}
          </div>
        </div>
      </ClayCard>

      {/* Step dot navigation */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
        {tutorial.steps.map((_, i) => {
          const isDone    = i < step
          const isCurrent = i === step
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Step ${i + 1}`}
              style={{
                width: isCurrent ? '44px' : '36px',
                height: '36px',
                borderRadius: RADIUS.full,
                background: isCurrent
                  ? grad
                  : isDone
                  ? 'linear-gradient(135deg, #A7F3D0, #059669)'
                  : '#EFEBF5',
                border: 'none',
                cursor: 'pointer',
                fontFamily: FONT.heading,
                fontSize: '14px',
                fontWeight: '800',
                color: isCurrent || isDone ? '#fff' : C.muted,
                boxShadow: isCurrent ? SHADOWS.button : SHADOWS.pressed,
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              {isDone ? '✓' : i + 1}
            </button>
          )
        })}
      </div>

      {/* Current step content */}
      <ClayCard>
        {/* Step counter badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{
            background: grad, borderRadius: RADIUS.sm,
            padding: '6px 16px', boxShadow: SHADOWS.button,
          }}>
            <span style={{
              fontFamily: FONT.heading, fontSize: `${fontSize - 3}px`,
              fontWeight: '900', color: '#fff', letterSpacing: '0.5px',
            }}>
              Step {step + 1} of {total}
            </span>
          </div>
          {/* Read-aloud toggle */}
          <button
            onClick={() => isSpeaking
              ? stop()
              : speak(`Step ${step + 1}. ${current.title}. ${current.description}`, language)
            }
            style={{
              background: `${C.accent}12`,
              border: `1.5px solid ${C.accent}30`,
              borderRadius: RADIUS.btn,
              padding: '6px 16px',
              fontSize: `${fontSize - 4}px`,
              color: C.accent,
              cursor: 'pointer',
              fontFamily: FONT.heading,
              fontWeight: '700',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {isSpeaking ? '⏹ Stop' : '🔊 Read aloud'}
          </button>
        </div>

        {/* Step title */}
        <p style={{
          fontFamily: FONT.heading,
          fontSize: `${fontSize + 4}px`,
          fontWeight: '900',
          color: C.foreground,
          marginBottom: '16px',
          lineHeight: 1.2,
        }}>
          {current.title}
        </p>

        {/* Step description — large, generous line height for seniors */}
        <div style={{
          background: '#EFEBF5',
          borderRadius: RADIUS.md,
          padding: '20px 22px',
          boxShadow: SHADOWS.pressed,
          marginBottom: '24px',
        }}>
          <p style={{
            fontSize: `${fontSize + 1}px`,
            color: C.foreground,
            lineHeight: 1.9,
            fontWeight: '500',
          }}>
            {current.description}
          </p>
        </div>

        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <ClayButton
            variant={step === 0 ? 'ghost' : 'secondary'}
            size="lg"
            onClick={prev}
            disabled={step === 0}
            style={{ flex: 1 }}
          >
            ← Previous
          </ClayButton>

          {step < total - 1 ? (
            <ClayButton size="lg" onClick={next} style={{ flex: 2 }}>
              Next step →
            </ClayButton>
          ) : (
            <ClayButton variant="success" size="lg" onClick={next} style={{ flex: 2 }}>
              ✅ Finished!
            </ClayButton>
          )}
        </div>
      </ClayCard>

      {/* Tip: swipe between steps on mobile */}
      <p style={{
        textAlign: 'center',
        fontSize: `${fontSize - 5}px`,
        color: C.muted,
        fontFamily: FONT.heading,
        fontWeight: '600',
      }}>
        Tap the numbered circles above to jump to any step
      </p>
    </div>
  )
}

// ─── Tutorials grid ───────────────────────────────────────────────
export default function Tutorials() {
  const { fontSize, language } = useSettings()
  const [selected, setSelected]   = useState(null)
  const [colorIdx, setColorIdx]   = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState(null)

  if (selected !== null) {
    return (
      <TutorialViewer
        tutorial={tutorials[selected]}
        colorIdx={colorIdx}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <ClayCard style={{ background: 'linear-gradient(135deg, rgba(237,233,254,0.5) 0%, rgba(255,255,255,0.72) 60%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: GRAD.primaryBtn, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '30px', boxShadow: SHADOWS.button,
            animation: 'clay-breathe 5s ease-in-out infinite',
          }}>📚</div>
          <div>
            <p style={{
              fontFamily: FONT.heading, fontSize: `${fontSize + 3}px`,
              fontWeight: '900', color: C.accent, marginBottom: '6px',
            }}>
              {language === 'en' ? 'Step-by-Step Tutorials' : 'படிப்படியான பாடங்கள்'}
            </p>
            <p style={{ fontSize: `${fontSize - 1}px`, color: C.muted, lineHeight: 1.7 }}>
              {language === 'en'
                ? 'Pick any topic and learn at your own pace. Each tutorial walks you through every step with clear, simple instructions.'
                : 'எந்த தலைப்பையும் தேர்ந்தெடுங்கள். ஒவ்வொரு படியிலும் தெளிவான வழிமுறைகள் இருக்கும்.'}
            </p>
          </div>
        </div>
      </ClayCard>

      {/* Tutorial cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '18px',
      }}>
        {tutorials.map((t, i) => {
          const grad    = CARD_GRADIENTS[i % CARD_GRADIENTS.length]
          const bg      = CARD_BG_TINTS[i % CARD_BG_TINTS.length]
          const diff    = DIFFICULTY_CONFIG[t.difficulty] || DIFFICULTY_CONFIG.Beginner
          const hovered = hoveredIdx === i

          return (
            <button
              key={t.id}
              onClick={() => { setSelected(i); setColorIdx(i) }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                background: hovered ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: RADIUS.card,
                padding: '24px',
                border: `1.5px solid ${hovered ? C.accent + '35' : C.accent + '15'}`,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: '14px',
                boxShadow: hovered ? SHADOWS.cardHover : SHADOWS.card,
                transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Icon orb */}
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px',
                boxShadow: hovered ? SHADOWS.button : SHADOWS.card,
                transition: 'all 0.3s',
                transform: hovered ? 'scale(1.10)' : 'scale(1)',
                animation: hovered ? 'clay-breathe 3s ease-in-out infinite' : 'none',
              }}>
                {t.icon}
              </div>

              {/* Title */}
              <p style={{
                fontFamily: FONT.heading,
                fontSize: `${fontSize + 1}px`,
                fontWeight: '900',
                color: C.foreground,
                lineHeight: 1.2,
              }}>
                {t.title}
              </p>

              {/* Description */}
              <p style={{
                fontSize: `${fontSize - 4}px`,
                color: C.muted,
                lineHeight: 1.6,
                flex: 1,
              }}>
                {t.description}
              </p>

              {/* Footer row: difficulty badge + step count */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  background: diff.bg,
                  borderRadius: RADIUS.full,
                  padding: '5px 14px',
                  fontSize: `${fontSize - 5}px`,
                  fontFamily: FONT.heading,
                  fontWeight: '800',
                  color: '#fff',
                  boxShadow: SHADOWS.button,
                }}>
                  {diff.label}
                </span>
                <span style={{
                  fontSize: `${fontSize - 5}px`,
                  color: C.muted,
                  fontFamily: FONT.heading,
                  fontWeight: '700',
                }}>
                  {t.steps.length} steps →
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Bottom encouragement */}
      <ClayCard padding="20px" style={{
        background: 'linear-gradient(135deg, rgba(167,139,250,0.12) 0%, rgba(219,39,119,0.06) 100%)',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: FONT.heading,
          fontSize: `${fontSize}px`,
          fontWeight: '800',
          color: C.accent,
          marginBottom: '6px',
        }}>
          🌟 {language === 'en' ? 'Take your time — there\'s no rush!' : 'அவசரப்படாதீர்கள்!'}
        </p>
        <p style={{ fontSize: `${fontSize - 3}px`, color: C.muted, lineHeight: 1.7 }}>
          {language === 'en'
            ? 'Each tutorial is here whenever you need it. You can go through any step as many times as you like.'
            : 'ஒவ்வொரு பாடத்தையும் எத்தனை முறை வேண்டுமானாலும் படிக்கலாம்.'}
        </p>
      </ClayCard>
    </div>
  )
}
